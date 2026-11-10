import React, { useState } from 'react';
import {
  FiSearch, FiRefreshCw, FiX, FiPhone, FiMapPin,
  FiCalendar, FiDollarSign, FiFileText, FiUser,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa6';
import { useAdminClients } from '../../hooks/useAdminClients';

const TIER_COLORS = {
  SILVER: 'bg-gray-100 text-gray-700 border-gray-300',
  GOLD: 'bg-amber-50 text-amber-700 border-amber-300',
  VIP: 'bg-purple-50 text-purple-700 border-purple-300',
};

const TIER_LABELS = {
  SILVER: 'فضية',
  GOLD: 'ذهبية',
  VIP: 'VIP',
};

const ClientsManagementTab = () => {
  const [search, setSearch] = useState('');
  const [tier, setTier] = useState('');
  const { clients, loading, error, refetch, getClientDetails, addNote } = useAdminClients({
    search: search || undefined,
    tier: tier || undefined,
  });

  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  const openDetails = async (client) => {
    setDetailLoading(true);
    setDetail({ summary: client, loading: true });
    const res = await getClientDetails(client.id);
    setDetailLoading(false);
    if (res.success) setDetail(res.data);
    else setDetail({ summary: client, error: res.error });
  };

  const closeDetail = () => {
    setDetail(null);
    setNoteText('');
  };

  const handleSaveNote = async () => {
    if (!noteText.trim() || !detail?.id) return;
    setSavingNote(true);
    const res = await addNote(detail.id, noteText.trim());
    setSavingNote(false);
    if (res.success) {
      setDetail({ ...detail, notes: res.data.notes });
      setNoteText('');
    } else {
      alert(res.error || 'فشل حفظ الملاحظة');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-black text-[#2B151F]">
            إدارة بيانات العميلات بالكامل (CRM Database)
          </h3>
          <p className="text-xs text-[#8E717D]">
            سجل العميلات، الملاحظات الخاصة وتفضيلات الزيوت والروائح، وتصنيفات الـ VIP
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <FiSearch className="absolute start-3.5 top-1/2 -translate-y-1/2 text-[#8E717D]" />
            <input
              type="text"
              placeholder="بحث باسم أو جوال..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full ps-10 pe-4 py-2.5 rounded-2xl bg-white border border-rose-200 outline-none text-xs font-bold"
            />
          </div>

          <select
            value={tier}
            onChange={(e) => setTier(e.target.value)}
            className="px-3 py-2.5 rounded-2xl bg-white border border-rose-200 text-xs font-bold"
          >
            <option value="">كل الفئات</option>
            <option value="SILVER">فضية</option>
            <option value="GOLD">ذهبية</option>
            <option value="VIP">VIP</option>
          </select>

          <button
            onClick={refetch}
            className="px-3 py-2.5 rounded-2xl border border-rose-200 text-[#CF3A69] hover:bg-rose-50 text-xs font-bold flex items-center gap-1.5"
          >
            <FiRefreshCw /> تحديث
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold p-3 rounded-xl">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-[#8E717D]">جاري التحميل...</div>
      ) : clients.length === 0 ? (
        <div className="text-center py-20 text-[#8E717D]">لا توجد عميلات</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {clients.map((client) => (
            <div
              key={client.id}
              className="bg-white rounded-3xl p-6 shadow-sm border border-rose-100 space-y-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => openDetails(client)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-black text-[#2B151F]">{client.name}</h4>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                        TIER_COLORS[client.tier] || TIER_COLORS.SILVER
                      }`}
                    >
                      {TIER_LABELS[client.tier] || client.tier}
                    </span>
                  </div>
                  <span className="text-xs text-[#8E717D] font-mono" dir="ltr">
                    {client.phone}
                  </span>
                </div>

                <div className="text-end">
                  <span className="text-xs font-black text-[#2B151F] block">
                    إجمالي الإنفاق: {client.totalSpent} ر.س
                  </span>
                  <span className="text-[10px] text-[#8E717D]">
                    ({client.totalBookings} حجوزات)
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#FFF9FA] border border-rose-100/70 text-xs text-[#5A3F4B] space-y-1 font-bold">
                <div className="flex items-center gap-1.5">
                  <FiMapPin className="text-[#CF3A69]" />
                  <span>
                    {client.city || 'مدينة غير محددة'}
                    {client.district ? ` - ${client.district}` : ''}
                  </span>
                </div>
                {client.notes && (
                  <div className="text-[#CF3A69] pt-1 flex items-start gap-1.5">
                    <FiFileText className="mt-0.5 shrink-0" />
                    <span className="line-clamp-2">{client.notes.split('\n')[0]}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-between text-xs">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openDetails(client);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 text-[#CF3A69] font-bold hover:bg-rose-100"
                >
                  عرض التفاصيل
                </button>

                {client.phone && (
                  <a
                    href={`https://wa.me/966${client.phone.replace(/^0/, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-emerald-600 font-bold flex items-center gap-1 hover:underline"
                  >
                    <FaWhatsapp />
                    <span>واتساب</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {detail && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={closeDetail}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-black text-[#2B151F]">
                  {detail.summary?.name || detail.name}
                </h3>
                <p className="text-xs text-[#8E717D] font-mono" dir="ltr">
                  {detail.summary?.phone || detail.phone}
                </p>
              </div>
              <button onClick={closeDetail} className="p-2 hover:bg-rose-50 rounded-lg">
                <FiX />
              </button>
            </div>

            {detailLoading ? (
              <div className="text-center py-10 text-[#8E717D]">جاري تحميل التفاصيل...</div>
            ) : detail.error ? (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold p-3 rounded-xl">
                {detail.error}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-3 rounded-xl bg-[#FFF9FA] border border-rose-100 text-center">
                    <FiDollarSign className="mx-auto text-[#CF3A69] mb-1" />
                    <div className="text-sm font-black text-[#2B151F]">{detail.totalSpent} ر.س</div>
                    <div className="text-[10px] text-[#8E717D]">إجمالي الإنفاق</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FFF9FA] border border-rose-100 text-center">
                    <FiCalendar className="mx-auto text-[#CF3A69] mb-1" />
                    <div className="text-sm font-black text-[#2B151F]">{detail.totalBookings}</div>
                    <div className="text-[10px] text-[#8E717D]">حجوزات</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FFF9FA] border border-rose-100 text-center">
                    <FiUser className="mx-auto text-[#CF3A69] mb-1" />
                    <div className="text-sm font-black text-[#2B151F]">
                      {TIER_LABELS[detail.tier] || detail.tier}
                    </div>
                    <div className="text-[10px] text-[#8E717D]">الفئة</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FFF9FA] border border-rose-100 text-center">
                    <FiPhone className="mx-auto text-[#CF3A69] mb-1" />
                    <div className="text-sm font-black text-[#2B151F]">
                      {detail.bookings?.length || 0}
                    </div>
                    <div className="text-[10px] text-[#8E717D]">حجوزات مسجلة</div>
                  </div>
                </div>

                {detail.bookings && detail.bookings.length > 0 && (
                  <div>
                    <h4 className="text-xs font-black text-[#2B151F] mb-2">آخر الحجوزات</h4>
                    <div className="bg-white rounded-xl border border-rose-100 overflow-hidden">
                      <table className="w-full text-xs">
                        <thead className="bg-rose-50">
                          <tr>
                            <th className="text-start p-2 font-black text-[#8E717D]">رقم</th>
                            <th className="text-start p-2 font-black text-[#8E717D]">التاريخ</th>
                            <th className="text-start p-2 font-black text-[#8E717D]">المبلغ</th>
                            <th className="text-start p-2 font-black text-[#8E717D]">الدفع</th>
                            <th className="text-start p-2 font-black text-[#8E717D]">الحالة</th>
                          </tr>
                        </thead>
                        <tbody>
                          {detail.bookings.map((b) => (
                            <tr key={b.id} className="border-t border-rose-50">
                              <td className="p-2 font-mono text-[#CF3A69]">{b.bookingNumber}</td>
                              <td className="p-2">{String(b.date).slice(0, 10)}</td>
                              <td className="p-2 font-bold">{b.totalPrice} ر.س</td>
                              <td className="p-2">
                                <span
                                  className={`text-[10px] px-1.5 py-0.5 rounded ${
                                    b.paymentStatus === 'PAID'
                                      ? 'bg-emerald-50 text-emerald-700'
                                      : 'bg-gray-100 text-gray-500'
                                  }`}
                                >
                                  {b.paymentStatus === 'PAID' ? '✓ مدفوع' : 'غير مدفوع'}
                                </span>
                              </td>
                              <td className="p-2">{b.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {detail.payments && detail.payments.length > 0 && (
                  <div>
                    <h4 className="text-xs font-black text-[#2B151F] mb-2">المدفوعات</h4>
                    <div className="space-y-1">
                      {detail.payments.slice(0, 5).map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between p-2 bg-[#FFF9FA] rounded-lg text-xs"
                        >
                          <span className="font-bold text-[#2B151F]">
                            {p.amount} {p.currency}
                          </span>
                          <span className="text-[#8E717D]">{p.provider}</span>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded ${
                              p.status === 'PAID'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-gray-100'
                            }`}
                          >
                            {p.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-xs font-black text-[#2B151F] mb-2">الملاحظات الداخلية</h4>
                  {detail.notes && (
                    <pre className="whitespace-pre-wrap text-xs p-3 rounded-xl bg-[#FFF9FA] border border-rose-100 text-[#5A3F4B] font-sans max-h-40 overflow-y-auto">
                      {detail.notes}
                    </pre>
                  )}
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="أضيفي ملاحظة جديدة..."
                      className="flex-1 px-3 py-2 rounded-xl border border-rose-200 bg-white text-xs font-bold"
                    />
                    <button
                      onClick={handleSaveNote}
                      disabled={savingNote || !noteText.trim()}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#CF3A69] to-[#E65A84] text-white text-xs font-black disabled:opacity-50"
                    >
                      {savingNote ? '...' : 'إضافة'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsManagementTab;
