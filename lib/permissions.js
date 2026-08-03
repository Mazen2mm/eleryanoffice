// خريطة الصفحات المحمية والصلاحية المطلوبة لكل صفحة
// "all" = أي مستخدم مسجل دخول (أدمن أو موظف) يقدر يدخلها
export const PROTECTED_PAGES = {
  "admin-home": "all",
  "admin-dashboard": "declarations",
  "admin-clients": "clients",
  "admin-companies": "companies",
  "admin-users": "users",
  attendance: "attendance_click",
  "attendance-report": "attendance_report",
  "e-invoice": "einvoice",
  "admin-services": "office_services",
  "admin-blog": "blog",
  "admin-faq": "faq",
};

export function hasAccess(session, pageName) {
  if (!session) return false;
  const required = PROTECTED_PAGES[pageName];
  if (!required) return true; // صفحة مش في القائمة = مش محمية
  if (session.role === "admin") return true;
  if (required === "all") return true;
  return Array.isArray(session.permissions) && session.permissions.includes(required);
}
