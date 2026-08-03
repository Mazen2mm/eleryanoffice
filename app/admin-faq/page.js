import AdminBody from "@/components/AdminBody";
import AdminHeader from "@/components/AdminHeader";
import FirebaseScripts from "@/components/FirebaseScripts";

export const metadata = {
  title: "مكتب هاني العريان | الأسئلة",
};

export default function AdminFaqPage() {
  return (
    <>
      <FirebaseScripts />

      <AdminBody style={{ alignItems: "flex-start", padding: "25px 15px" }}>
        <div className="dashboard">
          <AdminHeader title='الأسئلة (رسائل صفحة "تواصل معنا")' />

          <div className="admin-panel active" style={{ padding: "20px" }}>
            <div className="table-scroll">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>الاسم</th>
                    <th>رقم الهاتف</th>
                    <th>الرسالة</th>
                    <th>التاريخ</th>
                    <th>حذف</th>
                  </tr>
                </thead>
                <tbody id="faqTbody" suppressHydrationWarning>
                  <tr>
                    <td colSpan={5} style={{ color: "#999" }}>
                      جاري التحميل...
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </AdminBody>

      <div className="save-toast" id="saveToast">
        <i className="fa-solid fa-circle-check"></i> <span>تم الإجراء بنجاح</span>
      </div>

      <script src="/admin.js"></script>
    </>
  );
}
