import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as XLSX from "xlsx";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/session";
import { hasAccess } from "@/lib/permissions";
import { formatExcelRows } from "@/lib/excelFormat";

export async function POST(request) {
  // لازم يكون مسجل دخول وعنده صلاحية "einvoice"
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);
  if (!session || !hasAccess(session, "e-invoice")) {
    return NextResponse.json({ ok: false, message: "غير مصرح" }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const mode = formData.get("mode"); // "coded" | "uncoded"
    const companyCode = (formData.get("companyCode") || "").toString().trim();
    const companyName = (formData.get("companyName") || "").toString().trim();

    if (!file || typeof file === "string") {
      return NextResponse.json({ ok: false, message: "لم يتم إرفاق ملف" }, { status: 400 });
    }
    if (mode !== "coded" && mode !== "uncoded") {
      return NextResponse.json({ ok: false, message: "نوع غير معروف" }, { status: 400 });
    }
    if (mode === "uncoded" && !companyCode) {
      return NextResponse.json({ ok: false, message: "اختر الشركة أولاً" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const firstSheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[firstSheetName];
    const rawRows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "", raw: true });

    const { rows, skippedRows } = formatExcelRows(rawRows, mode, { code: companyCode });

    if (rows.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          message:
            skippedRows.length > 0
              ? `كل الصفوف اللي لقيتها ناقصة بيانات (${skippedRows.length} صف). تأكد من شكل الملف.`
              : "معرفتش ألاقي أي صفوف بيانات صالحة في الملف.",
        },
        { status: 400 }
      );
    }

    // بناء ملف الإخراج بنفس الشكل المطلوب
    const outHeader = ["Item Code", "Description", "Quantity", "Unit Price"];
    const outData = rows.map((r) => [r.itemCode, r.description, r.quantity, r.unitPrice]);
    const outSheet = XLSX.utils.aoa_to_sheet([outHeader, ...outData]);
    outSheet["!cols"] = [{ wch: 18 }, { wch: 40 }, { wch: 12 }, { wch: 14 }];
    const outWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(outWorkbook, outSheet, "Items");

    const outBuffer = XLSX.write(outWorkbook, { type: "buffer", bookType: "xlsx" });
    const fileBase64 = outBuffer.toString("base64");

    const safeCompany = companyName ? companyName.replace(/[^\u0621-\u064Aa-zA-Z0-9]+/g, "-") : "";
    const filename = `formatted-invoice${safeCompany ? "-" + safeCompany : ""}.xlsx`;

    return NextResponse.json({
      ok: true,
      fileBase64,
      filename,
      rowsCount: rows.length,
      skippedRows,
    });
  } catch (err) {
    console.error("format-excel error:", err);
    return NextResponse.json(
      { ok: false, message: err.message || "حدث خطأ أثناء معالجة الملف" },
      { status: 500 }
    );
  }
}
