import AdminBody from "@/components/AdminBody";
import AdminHeader from "@/components/AdminHeader";
import FirebaseScripts from "@/components/FirebaseScripts";

export const metadata = {
  robots: { index: false, follow: false, nocache: true },
  title: "تقرير الحضور والغياب اليومي",
};

export default function AttendanceReportPage() {
  return (
    <>
      <FirebaseScripts />

      <AdminBody style={{ padding: "20px 10px", alignItems: "flex-start" }}>
        <div className="dashboard" style={{ maxWidth: "1000px" }}>
          <AdminHeader
            title="سجل الحضور والغياب اليومي للموظفين"
            showLogout={false}
            homeLabel="العودة للرئيسية"
          />

          <div className="admin-panel active" style={{ padding: "20px" }}>
            <div className="table-scroll">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>الموظف</th>
                    <th>الحالة</th>
                    <th>التاريخ</th>
                    <th>الوقت</th>
                    <th>إجراء</th>
                  </tr>
                </thead>
                <tbody id="attendanceTbody" suppressHydrationWarning>
                  <tr>
                    <td colSpan={5} style={{ color: "#999" }}>
                      جاري تحميل سجل الحضور...
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </AdminBody>

      <div className="save-toast" id="saveToast">
        <i className="fa-solid fa-circle-check"></i> <span suppressHydrationWarning>تم الإجراء بنجاح</span>
      </div>

      <script src="/admin.js"></script>
      <script src="/attendance-report-init.js"></script>
    </>
  );
}
