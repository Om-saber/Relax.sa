/**
 * bookingAdapter.js — يحوّل حجز API → شكل mock المستخدم في Components
 */

const STATUS_MAP = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  ON_WAY: 'on_way',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toISOString().split('T')[0];
  } catch {
    return '';
  }
}

export function adaptBooking(apiBooking) {
  if (!apiBooking) return null;

  const items = apiBooking.items || [];

  return {
    id: apiBooking.id,
    bookingNumber: apiBooking.bookingNumber,
    customerName: apiBooking.customerName,
    customerPhone: apiBooking.customerPhone,
    city: apiBooking.city?.nameAr || apiBooking.cityId || '',
    cityKey: apiBooking.city?.key || '',
    district: apiBooking.district || '',
    address: apiBooking.address || '',
    date: formatDate(apiBooking.date),
    timeSlot: apiBooking.timeSlot?.labelAr || apiBooking.timeSlot?.key || '',
    timeSlotKey: apiBooking.timeSlot?.key || '',
    startAt: apiBooking.startAt,
    endAt: apiBooking.endAt,

    services: items.map((item) => ({
      id: item.serviceId || item.id,
      title: item.titleAr,
      titleEn: item.titleEn,
      price: Number(item.unitPrice),
      quantity: item.quantity,
      duration: item.durationMinutes,
    })),

    totalPrice: Number(apiBooking.totalPrice),
    subtotal: Number(apiBooking.subtotal || apiBooking.totalPrice),
    discountAmount: Number(apiBooking.discountAmount || 0),
    vatAmount: Number(apiBooking.vatAmount || 0),

    paymentMethod: apiBooking.paymentMethod
      ? String(apiBooking.paymentMethod).toLowerCase()
      : null,
    paymentStatus: apiBooking.paymentStatus
      ? String(apiBooking.paymentStatus).toLowerCase()
      : 'unpaid',

    status: STATUS_MAP[apiBooking.status] || apiBooking.status,

    specialistId: apiBooking.specialistId || null,
    specialistName: apiBooking.specialist?.name || null,
    specialistPhone: apiBooking.specialist?.phone || null,

    notes: apiBooking.notes || '',
    createdAt: apiBooking.createdAt,
    cancelledAt: apiBooking.cancelledAt,
    cancelReason: apiBooking.cancelReason,

    _raw: apiBooking,
  };
}

export function adaptBookings(apiBookings) {
  if (!Array.isArray(apiBookings)) return [];
  return apiBookings.map(adaptBooking);
}
