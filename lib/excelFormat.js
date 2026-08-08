// =====================================================================
// محرك تنسيق ملفات الإكسل الذكي (rule-based، مش نداء AI حقيقي)
// بيدور على أسماء الأعمدة (عربي/إنجليزي) أيًا كان ترتيبهم أو مكانهم،
// يتجاهل صفوف العناوين/التواريخ فوق الجدول وصفوف الإجماليات تحته،
// وبيرفض أي صف بياناته ناقصة بدل ما يحطه غلط.
// =====================================================================

const KEYWORDS = {
  code: ["item code", "code", "كود", "الكود", "كود الصنف"],
  description: [
    "description",
    "item description",
    "item",
    "name",
    "وصف",
    "الوصف",
    "الصنف",
    "اسم الصنف",
    "البيان",
    "بيان",
  ],
  quantity: ["quantity", "qty", "كمية", "الكمية", "العدد"],
  price: ["unit price", "price", "rate", "سعر", "السعر", "سعر الوحدة"],
};

const TOTAL_KEYWORDS = ["total", "grand total", "اجمالي", "إجمالي", "المجموع", "الإجمالي"];

function norm(v) {
  return String(v ?? "").trim().toLowerCase();
}

function matchesAny(cellText, keywordList) {
  const t = norm(cellText);
  if (!t) return false;
  return keywordList.some((k) => t === k || t.includes(k));
}

// بيدور على أفضل صف تعتبر هيدر الجدول، وبيرجع خريطة index الأعمدة
function detectHeader(rows, requiredFields) {
  let best = { rowIndex: -1, score: 0, map: {} };

  const scanLimit = Math.min(rows.length, 30); // مش محتاجين ندور أكتر من كده
  for (let r = 0; r < scanLimit; r++) {
    const row = rows[r] || [];
    const map = {};
    let score = 0;
    row.forEach((cell, c) => {
      for (const field of Object.keys(KEYWORDS)) {
        if (map[field] !== undefined) continue; // أول عمود يتطابق بس
        if (matchesAny(cell, KEYWORDS[field])) {
          map[field] = c;
          score++;
          break;
        }
      }
    });
    const hasAllRequired = requiredFields.every((f) => map[f] !== undefined);
    if (hasAllRequired && score > best.score) {
      best = { rowIndex: r, score, map };
    }
  }
  return best;
}

function isRowEmpty(row, colIndexes) {
  return colIndexes.every((idx) => idx === undefined || norm(row[idx]) === "");
}

function isTotalRow(row) {
  return row.some((cell) => matchesAny(cell, TOTAL_KEYWORDS));
}

function toNumber(v) {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(String(v).replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : null;
}

/**
 * @param {any[][]} rawRows - كل صفوف الشيت (array of arrays)
 * @param {"coded"|"uncoded"} mode
 * @param {{code?: string}} options - كود الشركة (لوضع "بدون كود")
 */
export function formatExcelRows(rawRows, mode, options = {}) {
  const requiredFields =
    mode === "coded" ? ["code", "quantity", "price"] : ["description", "quantity", "price"];

  const header = detectHeader(rawRows, requiredFields);
  if (header.rowIndex === -1) {
    const missingLabel = mode === "coded" ? "الكود + الكمية + السعر" : "الوصف + الكمية + السعر";
    throw new Error(
      `معرفتش أوصل لجدول واضح في الملف. تأكد إن الملف فيه أعمدة بأسماء واضحة (${missingLabel}) في نفس الصف.`
    );
  }

  const colIndexes = Object.values(header.map);
  const outRows = [];
  const skippedRows = [];
  let emptyStreak = 0;

  for (let r = header.rowIndex + 1; r < rawRows.length; r++) {
    const row = rawRows[r] || [];

    if (isRowEmpty(row, colIndexes)) {
      emptyStreak++;
      if (emptyStreak >= 3) break; // 3 صفوف فاضية ورا بعض = خلصنا الجدول
      continue;
    }
    emptyStreak = 0;

    if (isTotalRow(row)) break; // وصلنا لصف الإجماليات - نوقف هنا

    const code = header.map.code !== undefined
      ? String(row[header.map.code] ?? "").trim().replace(/^EG-/i, "")
      : "";
    const description =
      header.map.description !== undefined ? String(row[header.map.description] ?? "").trim() : "";
    const quantity = header.map.quantity !== undefined ? toNumber(row[header.map.quantity]) : null;
    const price = header.map.price !== undefined ? toNumber(row[header.map.price]) : null;

    const excelRowNumber = r + 1; // رقم الصف الحقيقي في ملف الإكسل (1-indexed)

    if (mode === "coded") {
      if (!code || quantity === null || price === null) {
        skippedRows.push(excelRowNumber);
        continue;
      }
      outRows.push({ itemCode: code, description: "", quantity, unitPrice: price });
    } else {
      if (!description || quantity === null || price === null) {
        skippedRows.push(excelRowNumber);
        continue;
      }
      outRows.push({
        itemCode: options.code || "",
        description,
        quantity,
        unitPrice: price,
      });
    }
  }

  return { rows: outRows, skippedRows, headerRowNumber: header.rowIndex + 1 };
}
