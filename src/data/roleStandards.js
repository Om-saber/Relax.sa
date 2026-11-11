/**
 * الصلاحيات الأساسية لكل دور — المرجع اللي بنقارن بيه
 * لو المدير خرج عن المعتاد → نظهر تحذير
 */
export const ROLE_STANDARDS = {
  'super-admin': {
    name: 'مدير النظام',
    permissions: [
      'viewBookings', 'editBookings', 'cancelBookings',
      'manageStaff', 'manageClients', 'manageServices',
      'manageCities', 'viewReports', 'manageRoles',
      'manageComplaints', 'manageFinance', 'manageContent',
    ],
  },
  management: {
    name: 'الإدارة العامة',
    permissions: [
      'viewBookings', 'editBookings', 'cancelBookings',
      'manageStaff', 'manageClients', 'manageServices',
      'manageCities', 'viewReports', 'manageComplaints',
      'manageFinance', 'manageContent',
    ],
  },
  'customer-service': {
    name: 'خدمة العملاء',
    permissions: [
      'viewBookings', 'editBookings', 'cancelBookings',
      'manageClients', 'manageComplaints',
    ],
  },
  accountant: {
    name: 'المحاسب المالي',
    permissions: ['viewBookings', 'viewReports', 'manageFinance'],
  },
  supervisor: {
    name: 'المشرف الميداني',
    permissions: [
      'viewBookings', 'editBookings', 'manageStaff',
      'manageClients', 'viewReports', 'manageComplaints',
    ],
  },
  'branch-manager': {
    name: 'مدير الفرع',
    permissions: [
      'viewBookings', 'editBookings', 'cancelBookings',
      'manageStaff', 'manageClients', 'manageCities',
      'viewReports', 'manageComplaints',
    ],
  },
};

export const PERMISSION_LABELS = {
  viewBookings: 'عرض الحجوزات',
  editBookings: 'تعديل وتأكيد المواعيد',
  cancelBookings: 'إلغاء الحجوزات',
  manageStaff: 'إدارة الموظفات وجداول العمل',
  manageClients: 'إدارة بيانات العملاء',
  manageServices: 'تسعير الخدمات والباقات',
  manageCities: 'إدارة الفروع والمدن',
  viewReports: 'التقارير والمبيعات',
  manageRoles: 'تعديل الأدوار والصلاحيات',
  manageComplaints: 'خدمة العملاء والشكاوى',
  manageFinance: 'المحاسبة والعمولات',
  manageContent: 'إدارة محتوى الموقع والبنرات',
};

// صلاحيات حساسة — تحتاج تحذير أمني لأي دور غير إداري
export const SENSITIVE_PERMISSIONS = ['manageRoles', 'manageFinance'];

/**
 * تحليل التغيير وإرجاع تحذير (أو null لو طبيعي)
 */
export function analyzePermissionChange(role, permKey, willBeActive, currentPermissionsCount) {
  const standard = ROLE_STANDARDS[role.key]?.permissions || [];
  const isStandard = standard.includes(permKey);
  const permLabel = PERMISSION_LABELS[permKey] || permKey;
  const isAdminRole = ['super-admin', 'management'].includes(role.key);

  if (willBeActive) {
    // 🔴 1) هيكمل 12/12 لدور مش super-admin
    if (currentPermissionsCount + 1 === 12 && role.key !== 'super-admin') {
      return {
        level: 'critical',
        title: '🚨 جميع الصلاحيات مفعلة',
        message: `بعد إضافة "${permLabel}"، دور "${role.name}" هيبقى عنده كل الصلاحيات (12/12) — يعني هيبقى زي مدير النظام. تأكد إن ده مقصود.`,
      };
    }

    // 🔴 2) صلاحية حساسة لدور غير إداري
    if (SENSITIVE_PERMISSIONS.includes(permKey) && !isAdminRole) {
      return {
        level: 'critical',
        title: '🚨 تحذير أمني حرج',
        message: `أنت على وشك إعطاء دور "${role.name}" صلاحية "${permLabel}" — دي صلاحية حساسة جداً (تسمح بتعديل الأدوار أو الشؤون المالية). عادةً بتتاح لمدير النظام أو الإدارة العامة فقط.`,
      };
    }

    // 🟠 3) صلاحية إضافية غير معتادة
    if (!isStandard) {
      return {
        level: 'warning',
        title: '⚠️ صلاحية إضافية غير معتادة',
        message: `"${permLabel}" ليست من الصلاحيات الأساسية لدور "${role.name}". أنت تعطي الدور صلاحية أعلى من المعتاد — ده ممكن يعقد إدارة الأدوار لاحقاً.`,
      };
    }
  } else {
    // 🟡 4) حذف صلاحية أساسية
    if (isStandard) {
      return {
        level: 'warning',
        title: '⚠️ حذف صلاحية أساسية',
        message: `"${permLabel}" من الصلاحيات الأساسية لدور "${role.name}". حذفها قد يمنع الدور من أداء مهامه بشكل صحيح.`,
      };
    }
  }

  return null; // طبيعي — مفيش تحذير
}
