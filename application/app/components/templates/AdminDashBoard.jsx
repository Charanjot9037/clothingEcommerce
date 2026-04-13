"use client";

import { useState, useEffect, useCallback } from "react";
import clsx from "clsx";
import CloudinaryImageUpload from "./CloudinaryUpload";
import Image from "next/image";

const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

const fmt = (n) => `$${Number(n ?? 0).toLocaleString()}`;

const DELIVERY_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

const STATUS_PILL = {
  pending:    "text-amber-600  bg-amber-50   border border-amber-200",
  processing: "text-blue-600   bg-blue-50    border border-blue-200",
  shipped:    "text-purple-600 bg-purple-50  border border-purple-200",
  delivered:  "text-green-600  bg-green-50   border border-green-200",
  cancelled:  "text-red-600    bg-red-50     border border-red-200",
};

const TABS = [
  { label: "Overview",  icon: "▦",  key: "overview"  },
  { label: "Orders",    icon: "📦", key: "orders"    },
  { label: "Products",  icon: "🛍️", key: "products"  },
  { label: "Users",     icon: "👤", key: "users"     },
  { label: "Analytics", icon: "📊", key: "analytics" },
];

/* ═══════════════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════════════ */
export default function AdminDashboard() {
  const [tab,         setTab]         = useState("overview");
  const [toast,       setToast]       = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  }, []);

  /* close sidebar on tab change (mobile) */
  const handleTab = (key) => {
    setTab(key);
    setSidebarOpen(false);
  };

  return (
    <div
      className="min-h-screen bg-white text-black"
      style={{ fontFamily: "'Satoshi','DM Sans','Segoe UI',sans-serif" }}
    >
      {/* Toast */}
      {toast && (
        <div className={clsx(
          "fixed top-4 right-4 z-[60] px-5 py-3 text-sm font-semibold shadow-lg border max-w-[calc(100vw-2rem)]",
          toast.type === "error"
            ? "bg-red-600 text-white border-red-600"
            : "bg-black text-white border-black"
        )}>
          {toast.msg}
        </div>
      )}

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex h-screen overflow-hidden">

        {/* ── SIDEBAR ── */}
        <aside className={clsx(
          "fixed md:relative inset-y-0 left-0 z-40 w-56 flex-shrink-0",
          "bg-gradient-to-b from-gray-950 to-slate-800 text-white",
          "flex flex-col py-8 px-5 gap-0.5 transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}>
          {/* Logo */}
          <div className="mb-8 px-2">
            <div className="text-xl font-black tracking-widest text-white">SHOP.CO</div>
            <div className="text-[10px] text-white/40 tracking-widest mt-1 uppercase">Admin</div>
          </div>

          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => handleTab(t.key)}
              className={clsx(
                "flex items-center gap-3 px-3 py-3 text-sm w-full text-left transition-all rounded-sm",
                tab === t.key
                  ? "bg-white/15 text-white font-bold"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              )}
            >
              <span className="w-5 text-center text-base">{t.icon}</span>
              {t.label}
            </button>
          ))}

          <div className="mt-auto pt-6 border-t border-white/10">
            <a
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-white/40 hover:text-white hover:bg-white/10 transition-all"
            >
              <span className="w-5 text-center">↩</span> View Store
            </a>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className="flex-1 overflow-y-auto bg-[#f2f0f1] min-w-0">

          {/* Topbar */}
          <div className="bg-white border-b border-black/10 px-4 md:px-8 py-4 flex justify-between items-center sticky top-0 z-20">
            <div className="flex items-center gap-3">
              {/* Hamburger — mobile only */}
              <button
                className="md:hidden flex flex-col gap-1 p-1"
                onClick={() => setSidebarOpen(o => !o)}
              >
                <span className="w-5 h-0.5 bg-black block" />
                <span className="w-5 h-0.5 bg-black block" />
                <span className="w-5 h-0.5 bg-black block" />
              </button>
              <h2 className="text-xs font-bold uppercase tracking-widest text-black/40">
                {TABS.find(t => t.key === tab)?.label}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-xs text-black/40 font-medium">
                {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
              </div>
              <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-black">
                A
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 md:p-8">
            {tab === "overview"  && <OverviewTab  onNav={handleTab} toast={showToast} />}
            {tab === "orders"    && <OrdersTab    toast={showToast} />}
            {tab === "products"  && <ProductsTab  toast={showToast} />}
            {tab === "users"     && <UsersTab     toast={showToast} />}
            {tab === "analytics" && <AnalyticsTab toast={showToast} />}
          </div>

          {/* Mobile bottom nav */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 flex z-20">
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => handleTab(t.key)}
                className={clsx(
                  "flex-1 flex flex-col items-center gap-0.5 py-3 text-[10px] font-semibold transition-all",
                  tab === t.key ? "text-white" : "text-white/40"
                )}
              >
                <span className="text-base leading-none">{t.icon}</span>
                <span className="hidden xs:block">{t.label}</span>
              </button>
            ))}
          </nav>

          {/* Bottom nav spacer on mobile */}
          <div className="h-16 md:hidden" />
        </main>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   OVERVIEW
═══════════════════════════════════════════════════════════════ */
function OverviewTab({ onNav, toast }) {
  const [analytics, setAnalytics] = useState(null);
  const [orders,    setOrders]    = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/analytics?period=30", { headers: authHeaders() }).then(r => r.json()),
      fetch("/api/admin/orders?limit=5",      { headers: authHeaders() }).then(r => r.json()),
    ])
      .then(([a, o]) => { setAnalytics(a); setOrders(o.orders ?? []); })
      .catch(() => toast("Failed to load overview", "error"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Skeleton rows={6} />;
  const s = analytics?.stats ?? {};

  const cards = [
    { label: "Revenue (30d)",   value: fmt(s.revenue),       pct: s.revenuePct, nav: "analytics" },
    { label: "Orders (30d)",    value: s.orders ?? 0,        pct: s.ordersPct,  nav: "orders"    },
    { label: "New Users (30d)", value: s.newUsers ?? 0,      pct: s.usersPct,   nav: "users"     },
    { label: "Avg Order",       value: fmt(s.avgOrder),      pct: null,         nav: "analytics" },
    { label: "Products",        value: s.totalProducts ?? 0, pct: null,         nav: "products"  },
  ];

  return (
    <div>
      <PageHeader title="Overview" sub="Your store at a glance — last 30 days" />

      {/* Stat cards — 2 cols mobile, 3 tablet, 5 desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 mb-6">
        {cards.map((c, i) => (
          <div
            key={i}
            onClick={() => onNav(c.nav)}
            className="bg-white border border-black/10 p-4 cursor-pointer hover:border-black transition-all"
          >
            <div className="text-black/40 text-[10px] uppercase tracking-widest mb-2 font-medium">{c.label}</div>
            <div className="text-2xl md:text-3xl font-black mb-1">{c.value}</div>
            {c.pct != null && (
              <div className={clsx("text-xs font-semibold", c.pct >= 0 ? "text-green-600" : "text-red-500")}>
                {c.pct >= 0 ? "▲" : "▼"} {Math.abs(c.pct)}%
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Recent orders — card layout on mobile, table on md+ */}
      <Card title="Recent Orders" action={{ label: "View all →", fn: () => onNav("orders") }}>
        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-black/6">
          {orders.map((o, i) => (
            <div key={i} className="p-4 flex gap-3 items-start">
              {o.items?.[0]?.image
                ? <img src={o.items[0].image} alt="" className="w-12 h-12 object-cover rounded flex-shrink-0" />
                : <div className="w-12 h-12 bg-black/5 rounded flex items-center justify-center flex-shrink-0 text-xl">🛍️</div>
              }
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <span className="font-mono text-xs text-black/40 font-bold">#{String(o._id).slice(-6).toUpperCase()}</span>
                  <span className="font-black text-sm">{fmt(o.total)}</span>
                </div>
                <div className="text-xs text-black/50 mt-0.5">{o.userId?.name || "Unknown"}</div>
                <div className="flex items-center justify-between mt-2">
                  <span className={clsx("px-2 py-0.5 text-xs font-semibold capitalize rounded-full", STATUS_PILL[o.deliveryStatus])}>
                    {o.deliveryStatus}
                  </span>
                  <span className="text-xs text-black/35">{new Date(o.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
          {orders.length === 0 && <p className="p-8 text-center text-black/30 text-sm">No orders yet</p>}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <tbody>
              {orders.map((o, i) => (
                <tr key={i} className="border-t border-black/6 hover:bg-black/2 transition-all">
                  <td className="px-5 py-3 font-mono text-xs font-bold text-black/40">#{String(o._id).slice(-6).toUpperCase()}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      {o.items?.[0]?.image
                        ? <img src={o.items[0].image} alt="" className="w-10 h-10 object-cover rounded flex-shrink-0" />
                        : <div className="w-10 h-10 bg-black/5 rounded flex items-center justify-center flex-shrink-0">🛍️</div>
                      }
                      {o.items?.length > 1 && <div className="text-xs text-black/35">+{o.items.length - 1} more</div>}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-black/50 text-xs">{o.userId?.name || "Unknown"}</td>
                  <td className="px-5 py-3 font-black">{fmt(o.total)}</td>
                  <td className="px-5 py-3">
                    <span className={clsx("px-2.5 py-0.5 text-xs font-semibold capitalize rounded-full", STATUS_PILL[o.deliveryStatus])}>
                      {o.deliveryStatus}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-black/35 text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {orders.length === 0 && <tr><td colSpan={6} className="px-5 py-12 text-center text-black/30">No orders yet</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ORDERS
═══════════════════════════════════════════════════════════════ */
function OrdersTab({ toast }) {
  const [orders,        setOrders]        = useState([]);
  const [total,         setTotal]         = useState(0);
  const [page,          setPage]          = useState(1);
  const [status,        setStatus]        = useState("all");
  const [loading,       setLoading]       = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const deleteOrder = async (orderId) => {
    if (!confirm("Permanently delete this cancelled order?")) return;
    try {
      const res  = await fetch(`/api/admin/orders/${orderId}`, { method: "DELETE", headers: authHeaders() });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setOrders(o => o.filter(x => x._id !== orderId));
      setTotal(t => t - 1);
      toast("Order deleted");
    } catch (e) { toast(e.message, "error"); }
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const qs   = new URLSearchParams({ page, limit: 20, status }).toString();
      const res  = await fetch(`/api/admin/orders?${qs}`, { headers: authHeaders() });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setOrders(data.orders);
      setTotal(data.total);
    } catch (e) { toast(e.message, "error"); }
    finally { setLoading(false); }
  }, [page, status]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (orderId, deliveryStatus) => {
    setOrders(o => o.map(x => x._id === orderId ? { ...x, deliveryStatus } : x));
    try {
      const res  = await fetch("/api/admin/orders", { method: "PATCH", headers: authHeaders(), body: JSON.stringify({ orderId, deliveryStatus }) });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      toast("Order updated");
    } catch (e) { toast(e.message, "error"); load(); }
  };

  return (
    <div>
      <PageHeader title="Orders" sub={`${total} total orders`} />

      {/* Filter pills */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {["all", ...DELIVERY_STATUSES].map(s => (
          <button key={s} onClick={() => { setStatus(s); setPage(1); }}
            className={clsx("px-3 py-1.5 text-xs font-semibold capitalize border transition-all",
              status === s ? "bg-black text-white border-black" : "bg-white text-black/60 border-black/20 hover:border-black hover:text-black"
            )}>{s}</button>
        ))}
      </div>

      {loading ? <Skeleton rows={6} /> : (
        <Card>
          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-black/6">
            {orders.map((o, i) => (
              <div key={i} className="p-4">
                <div className="flex gap-3 items-start mb-3">
                  {o.items[0]?.image
                    ? <img src={o.items[0].image} alt="" className="w-12 h-12 object-cover rounded flex-shrink-0" />
                    : <div className="w-12 h-12 bg-black/5 rounded flex items-center justify-center flex-shrink-0">🛍️</div>
                  }
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <span className="font-mono text-xs text-black/40 font-bold">#{String(o._id).slice(-6).toUpperCase()}</span>
                      <span className="font-black">{fmt(o.total)}</span>
                    </div>
                    <div className="text-xs text-black/50 mt-0.5">{o.userId?.name || "Guest"}</div>
                    <div className="text-xs text-black/35">{o.items?.length} item(s) · sub {fmt(o.subtotal)} · del {fmt(o.deliveryFee)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <select value={o.deliveryStatus} onChange={e => updateStatus(o._id, e.target.value)}
                    className="bg-white border border-black/20 px-2 py-1 text-xs capitalize focus:outline-none focus:border-black flex-1 min-w-0">
                    {DELIVERY_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button onClick={() => setSelectedOrder(o)} className="text-xs px-3 py-1.5 bg-black text-white font-semibold">View</button>
                  {o.deliveryStatus === "cancelled" && (
                    <button onClick={() => deleteOrder(o._id)} className="text-xs px-3 py-1.5 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all font-semibold">Delete</button>
                  )}
                </div>
              </div>
            ))}
            {orders.length === 0 && <p className="p-8 text-center text-black/30 text-sm">No orders found</p>}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-black/40 text-xs uppercase tracking-widest border-b border-black/10 bg-black/2">
                  {["Order ID","Product","User","Items","Subtotal","Delivery","Total","Status","Action"].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-semibold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((o, i) => (
                  <tr key={i} className="border-t border-black/6 hover:bg-black/2 transition-all">
                    <td className="px-4 py-3 font-mono text-xs font-bold text-black/40">#{String(o._id).slice(-6).toUpperCase()}</td>
                    <td className="px-4 py-3">
                      {o.items[0]?.image
                        ? <img src={o.items[0].image} alt="Product" width={44} height={44} className="rounded object-cover w-11 h-11" />
                        : <div className="w-11 h-11 bg-black/5 rounded flex items-center justify-center">🛍️</div>
                      }
                    </td>
                    <td className="px-4 py-3 text-xs text-black/50 max-w-[100px] truncate">{o.userId?.name || "Guest"}</td>
                    <td className="px-4 py-3 text-black/60">{o.items?.length ?? 0}</td>
                    <td className="px-4 py-3">{fmt(o.subtotal)}</td>
                    <td className="px-4 py-3">{fmt(o.deliveryFee)}</td>
                    <td className="px-4 py-3 font-black">{fmt(o.total)}</td>
                    <td className="px-4 py-3">
                      <select value={o.deliveryStatus} onChange={e => updateStatus(o._id, e.target.value)}
                        className="bg-white border border-black/20 px-2 py-1 text-xs capitalize focus:outline-none focus:border-black">
                        {DELIVERY_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setSelectedOrder(o)} className="text-xs px-3 py-1 bg-black text-white whitespace-nowrap">View</button>
                        {o.deliveryStatus === "cancelled" && (
                          <button onClick={() => deleteOrder(o._id)} className="text-xs px-3 py-1 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all whitespace-nowrap">Delete</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && <tr><td colSpan={9} className="py-16 text-center text-black/30">No orders found</td></tr>}
              </tbody>
            </table>
          </div>

          <Pagination page={page} total={total} perPage={20} onPage={setPage} />
        </Card>
      )}

      {/* Order detail modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto relative rounded-lg">
            <div className="sticky top-0 bg-white border-b border-black/10 px-5 py-4 flex justify-between items-center">
              <h2 className="text-base font-black uppercase tracking-wide">Order Details</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-black/40 hover:text-black text-xl leading-none">✕</button>
            </div>
            <div className="p-5 space-y-3">
              {selectedOrder.items[0]?.image && (
                <img src={selectedOrder.items[0].image} className="w-20 h-20 object-cover rounded" alt="" />
              )}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div><span className="text-black/40 text-xs uppercase tracking-wide block">Order ID</span><span className="font-mono font-bold text-xs">{String(selectedOrder._id).slice(-6).toUpperCase()}</span></div>
                <div><span className="text-black/40 text-xs uppercase tracking-wide block">Date</span><span className="font-medium text-xs">{new Date(selectedOrder.createdAt).toLocaleString()}</span></div>
                <div><span className="text-black/40 text-xs uppercase tracking-wide block">Name</span><span className="font-semibold">{selectedOrder.userId?.name || "Guest"}</span></div>
                <div><span className="text-black/40 text-xs uppercase tracking-wide block">Email</span><span className="text-xs">{selectedOrder.userId?.email || "—"}</span></div>
                <div><span className="text-black/40 text-xs uppercase tracking-wide block">Items</span><span className="font-semibold">{selectedOrder.items.length}</span></div>
                <div><span className="text-black/40 text-xs uppercase tracking-wide block">Status</span><span className={clsx("text-xs font-bold capitalize px-2 py-0.5 rounded-full", STATUS_PILL[selectedOrder.deliveryStatus])}>{selectedOrder.deliveryStatus}</span></div>
                <div><span className="text-black/40 text-xs uppercase tracking-wide block">Subtotal</span><span className="font-semibold">{fmt(selectedOrder.subtotal)}</span></div>
                <div><span className="text-black/40 text-xs uppercase tracking-wide block">Delivery</span><span className="font-semibold">{fmt(selectedOrder.deliveryFee)}</span></div>
                <div className="col-span-2"><span className="text-black/40 text-xs uppercase tracking-wide block">Total</span><span className="text-xl font-black">{fmt(selectedOrder.total)}</span></div>
              </div>
              {selectedOrder.address && (
                <div className="border-t border-black/10 pt-3">
                  <div className="text-black/40 text-xs uppercase tracking-wide mb-2">Shipping Address</div>
                  <div className="text-sm space-y-0.5 text-black/70">
                    <p className="font-semibold text-black">{selectedOrder.address.fullName}</p>
                    <p>{selectedOrder.address.street}</p>
                    <p>{selectedOrder.address.city}, {selectedOrder.address.state} {selectedOrder.address.zip}</p>
                  </div>
                </div>
              )}
              {/* All items */}
              {selectedOrder.items.length > 1 && (
                <div className="border-t border-black/10 pt-3">
                  <div className="text-black/40 text-xs uppercase tracking-wide mb-2">All Items</div>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        {item.image && <img src={item.image} alt="" className="w-10 h-10 object-cover rounded" />}
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold truncate">{item.title}</div>
                          <div className="text-xs text-black/40">x{item.quantity} · {fmt(item.price)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PRODUCTS
═══════════════════════════════════════════════════════════════ */
function ProductsTab({ toast }) {
  const [products, setProducts] = useState([]);
  const [total,    setTotal]    = useState(0);
  const [page,     setPage]     = useState(1);
  const [loading,  setLoading]  = useState(true);
  const [view,     setView]     = useState("list");
  const [editing,  setEditing]  = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const qs  = new URLSearchParams({ page, limit: 20 }).toString();
      const res = await fetch(`/api/products?${qs}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setProducts(data.products); setTotal(data.total);
    } catch (e) { toast(e.message, "error"); }
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { if (view === "list") load(); }, [load, view]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE", headers: authHeaders() });
    setProducts(p => p.filter(x => x._id !== id));
    toast("Product deleted");
  };

  const handleSave = async (payload, id) => {
    const url  = id ? `/api/products/${id}` : "/api/products";
    const res  = await fetch(url, { method: id ? "PATCH" : "POST", headers: authHeaders(), body: JSON.stringify(payload) });
    const data = await res.json();
    if (!data.success) { toast(data.message, "error"); return; }
    toast(id ? "Product updated!" : "Product added to shop!");
    setView("list"); setEditing(null);
  };

  if (view !== "list") {
    return <ProductForm initial={editing} onSubmit={p => handleSave(p, editing?._id)} onCancel={() => { setView("list"); setEditing(null); }} />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6 gap-3">
        <PageHeader title="Products" sub={`${total} products`} compact />
        <button
          onClick={() => { setEditing(null); setView("add"); }}
          className="bg-black text-white px-4 md:px-6 py-2.5 text-xs md:text-sm font-bold hover:bg-black/80 transition-all uppercase tracking-wide whitespace-nowrap flex-shrink-0"
        >
          + Add Product
        </button>
      </div>

      {loading ? <Skeleton rows={5} /> : (
        <Card>
          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-black/6">
            {products.map((p, i) => (
              <div key={i} className="p-4 flex gap-3 items-start">
                {p.images?.[0]
                  ? <img src={p.images[0]} alt="" className="w-14 h-14 object-cover flex-shrink-0" />
                  : <div className="w-14 h-14 bg-black/5 flex items-center justify-center flex-shrink-0 text-xl">🛍️</div>
                }
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{p.title}</div>
                  <div className="text-xs text-black/40 capitalize mt-0.5">{p.category}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-black text-sm">{fmt(p.price)}</span>
                    {p.oldPrice && <span className="text-black/30 line-through text-xs">{fmt(p.oldPrice)}</span>}
                    {p.discount ? <span className="bg-black text-white text-[10px] font-bold px-1.5 py-0.5">{p.discount}% OFF</span> : null}
                  </div>
                  <div className={clsx("text-xs font-semibold mt-1", p.stock <= 5 ? "text-red-500" : "text-black/40")}>
                    Stock: {p.stock}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => { setEditing(p); setView("edit"); }}
                      className="text-xs font-semibold border border-black px-3 py-1 hover:bg-black hover:text-white transition-all">Edit</button>
                    <button onClick={() => handleDelete(p._id)}
                      className="text-xs font-semibold border border-red-400 text-red-500 px-3 py-1 hover:bg-red-500 hover:text-white transition-all">Delete</button>
                  </div>
                </div>
              </div>
            ))}
            {products.length === 0 && <p className="p-8 text-center text-black/30 text-sm">No products yet</p>}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-black/40 text-xs uppercase tracking-widest border-b border-black/10 bg-black/2">
                  {["Product","Category","Price","Old Price","Discount","Stock","Actions"].map(h => (
                    <th key={h} className="px-5 py-3 text-left font-semibold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={i} className="border-t border-black/6 hover:bg-black/2 transition-all">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {p.images?.[0]
                          ? <img src={p.images[0]} alt="" className="w-10 h-10 object-cover flex-shrink-0" />
                          : <div className="w-10 h-10 bg-black/5 flex items-center justify-center flex-shrink-0">🛍️</div>
                        }
                        <span className="font-semibold truncate max-w-[160px]">{p.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-black/50 capitalize text-xs font-medium">{p.category}</td>
                    <td className="px-5 py-3 font-black">{fmt(p.price)}</td>
                    <td className="px-5 py-3 text-black/35 line-through text-xs">{p.oldPrice ? fmt(p.oldPrice) : "—"}</td>
                    <td className="px-5 py-3">{p.discount ? <span className="bg-black text-white text-xs font-bold px-2 py-0.5">{p.discount}% OFF</span> : "—"}</td>
                    <td className={clsx("px-5 py-3 font-bold", p.stock <= 5 ? "text-red-500" : "text-black/60")}>{p.stock}</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => { setEditing(p); setView("edit"); }}
                          className="text-xs font-semibold border border-black px-3 py-1 hover:bg-black hover:text-white transition-all whitespace-nowrap">Edit</button>
                        <button onClick={() => handleDelete(p._id)}
                          className="text-xs font-semibold border border-red-400 text-red-500 px-3 py-1 hover:bg-red-500 hover:text-white transition-all whitespace-nowrap">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && <tr><td colSpan={7} className="py-16 text-center text-black/30">No products yet</td></tr>}
              </tbody>
            </table>
          </div>

          <Pagination page={page} total={total} perPage={20} onPage={setPage} />
        </Card>
      )}
    </div>
  );
}

/* ── Product Form ── */
const COLORS = [
  { hex: "#4CAF50", label: "Green" },
  { hex: "#F44336", label: "Red" },
  { hex: "#FFC107", label: "Yellow" },
  { hex: "#FF9800", label: "Orange" },
  { hex: "#03A9F4", label: "Light Blue" },
  { hex: "#9C27B0", label: "Purple" },
  { hex: "#E91E63", label: "Pink" },
  { hex: "#1a3458", label: "Navy" },
  { hex: "#4a5c3d", label: "Olive" },
  { hex: "#111111", label: "Black" },
];

function ColorPicker({ value = [], onChange }) {
  const toggle = (hex) => {
    const next = value.includes(hex)
      ? value.filter((h) => h !== hex)
      : [...value, hex];
    onChange(next);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {COLORS.map((c) => (
          <button
            key={c.hex}
            type="button"
            title={c.label}
            onClick={() => toggle(c.hex)}
            className="relative w-8 h-8 rounded-full transition-transform hover:scale-110 focus:outline-none"
            style={{
              background: c.hex,
              border: value.includes(c.hex)
                ? "2.5px solid #000"
                : "2px solid transparent",
              boxShadow: value.includes(c.hex)
                ? "0 0 0 1px #fff inset"
                : undefined,
              transform: value.includes(c.hex) ? "scale(1.12)" : undefined,
            }}
          >
            {value.includes(c.hex) && (
              <span
                className="absolute inset-0 rounded-full flex items-center justify-center"
                style={{ pointerEvents: "none" }}
              >
                <span className="block w-3 h-3 rounded-full border-2 border-white" />
              </span>
            )}
          </button>
        ))}
      </div>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {COLORS.filter((c) => value.includes(c.hex)).map((c) => (
            <span
              key={c.hex}
              className="flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full border border-black/10"
              style={{ background: c.hex + "22" }}
            >
              <span
                className="w-3 h-3 rounded-full inline-block flex-shrink-0"
                style={{ background: c.hex }}
              />
              {c.label}
              <button
                type="button"
                className="opacity-40 hover:opacity-100 leading-none ml-0.5"
                onClick={() => toggle(c.hex)}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Product Form ── */
function ProductForm({ initial, onSubmit, onCancel }) {
  const blank = {
    title: "",
    price: "",
    oldPrice: "",
    discount: "",
    category: "",
    images: ["", "", ""],
    rating: "",
    description: "",
    sizes: "",
    colors: [],
    stock: "",
    featured: false,
    reviews: [{}, {}, {}],
  };

  const [form, setForm] = useState(
    initial
      ? {
          ...blank,
          ...initial,
          sizes: (initial.sizes ?? []).join(", "),
          colors: initial.colors ?? [],
          images: initial.images?.length ? initial.images : ["", "", ""],
        }
      : blank
  );
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Required";
    if (!form.price || isNaN(+form.price) || +form.price <= 0)
      e.price = "Valid price required";
    if (!form.category.trim()) e.category = "Required";
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setSaving(true);
    await onSubmit({
      ...form,
      price: +form.price,
      oldPrice: form.oldPrice ? +form.oldPrice : null,
      discount: form.discount ? +form.discount : 0,
      rating: form.rating ? +form.rating : 0,
      stock: form.stock ? +form.stock : 0,
      sizes: form.sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      colors: form.colors, // already an array of hex strings
      images: (form.images ?? []).filter(Boolean),
    });
    setSaving(false);
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onCancel} className="text-black/40 hover:text-black text-xl">
          ←
        </button>
        <PageHeader
          title={initial ? "Edit Product" : "Add Product"}
          sub="Saved to MongoDB"
          compact
        />
      </div>

      <form
        onSubmit={submit}
        className="bg-white border border-black/10 p-4 md:p-8 max-w-3xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          <Field label="Title *" error={errors.title} span2>
            <input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Classic White T-Shirt"
              className={inp(errors.title)}
            />
          </Field>

          <Field label="Price ($) *" error={errors.price}>
            <input
              type="number"
              min="0"
              step="1"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
              placeholder="0000"
              className={inp(errors.price)}
            />
          </Field>

          <Field label="Old Price ($)">
            <input
              type="number"
              min="0"
              step="1"
              value={form.oldPrice}
              onChange={(e) => set("oldPrice", e.target.value)}
              placeholder="0000"
              className={inp()}
            />
          </Field>

          <Field label="Discount (%)">
            <input
              type="number"
              min="0"
              max="100"
              value={form.discount}
              onChange={(e) => set("discount", e.target.value)}
              placeholder="20"
              className={inp()}
            />
          </Field>

          <Field label="Category *" error={errors.category}>
            <input
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              placeholder="men / women / kids"
              className={inp(errors.category)}
            />
          </Field>

          <Field label="Stock">
            <input
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => set("stock", e.target.value)}
              placeholder="100"
              className={inp()}
            />
          </Field>

          <Field label="Rating (0–5)">
            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={form.rating}
              onChange={(e) => set("rating", e.target.value)}
              placeholder="4.5"
              className={inp()}
            />
          </Field>

          {[0, 1, 2].map((i) => (
            <CloudinaryImageUpload
              key={i}
              index={i}
              label={`Gallery Image ${i + 1}`}
              value={form.images?.[i] ?? ""}
              onChange={(url) => {
                const imgs = [...(form.images ?? ["", "", ""])];
                imgs[i] = url;
                set("images", imgs);
              }}
            />
          ))}

          {(form.images ?? []).some(Boolean) && (
            <div className="md:col-span-2 flex gap-2 flex-wrap">
              {(form.images ?? []).map((url, i) =>
                url ? (
                  <div
                    key={i}
                    className="flex-1 min-w-[80px] border border-black/10 overflow-hidden"
                  >
                    <img
                      src={url}
                      alt={`gallery-${i + 1}`}
                      className="w-full h-24 md:h-28 object-cover"
                    />
                    <div className="px-2 py-1 bg-black/3 text-xs text-black/35">
                      Image {i + 1}
                    </div>
                  </div>
                ) : null
              )}
            </div>
          )}

          <Field label="Sizes (comma-separated)">
            <input
              value={form.sizes}
              onChange={(e) => set("sizes", e.target.value)}
              placeholder="XS, S, M, L, XL"
              className={inp()}
            />
          </Field>

          <Field label="Colors">
            <ColorPicker
              value={form.colors}
              onChange={(v) => set("colors", v)}
            />
          </Field>

          <Field label="Description" span2>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Short product description…"
              className={inp() + " resize-none"}
            />
          </Field>

          <div className="md:col-span-2">
            <Toggle
              label="Feature on homepage"
              value={form.featured}
              onChange={(v) => set("featured", v)}
            />
          </div>

          <div className="md:col-span-2 flex flex-wrap gap-3 pt-4 border-t border-black/10">
            <button
              type="submit"
              disabled={saving}
              className="bg-black text-white font-bold px-6 md:px-8 py-3 text-sm hover:bg-black/80 disabled:opacity-50 transition-all uppercase tracking-wide"
            >
              {saving ? "Saving…" : initial ? "Save Changes" : "Add to Shop"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="border border-black/20 text-black/60 px-5 md:px-6 py-3 text-sm font-medium hover:border-black hover:text-black transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
/* ═══════════════════════════════════════════════════════════════
   USERS
═══════════════════════════════════════════════════════════════ */
function UsersTab({ toast }) {
  const [users,   setUsers]   = useState([]);
  const [total,   setTotal]   = useState(0);
  const [page,    setPage]    = useState(1);
  const [search,  setSearch]  = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const qs  = new URLSearchParams({ page, limit: 25, search }).toString();
      const res = await fetch(`/api/admin/users?${qs}`, { headers: authHeaders() });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setUsers(data.users); setTotal(data.total);
    } catch (e) { toast(e.message, "error"); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const patch = async (userId, updates) => {
    const res  = await fetch("/api/admin/users", { method: "PATCH", headers: authHeaders(), body: JSON.stringify({ userId, updates }) });
    const data = await res.json();
    if (!data.success) { toast(data.message, "error"); return; }
    setUsers(u => u.map(x => x._id === userId ? { ...x, ...updates } : x));
    toast("User updated");
  };

  return (
    <div>
      <PageHeader title="Users" sub={`${total} registered users`} />
      <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
        placeholder="Search by name or email…"
        className="mb-5 border border-black/20 px-4 py-2.5 text-sm w-full md:w-64 focus:outline-none focus:border-black placeholder:text-black/30" />

      {loading ? <Skeleton rows={5} /> : (
        <Card>
          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-black/6">
            {users.map((u, i) => (
              <div key={i} className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-sm font-black flex-shrink-0">
                    {u.name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{u.name}</div>
                    <div className="text-xs text-black/40 truncate">{u.email}</div>
                    <div className="text-xs text-black/30">{new Date(u.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => patch(u._id, { isAdmin: !u.isAdmin })}
                    className={clsx("text-xs font-bold px-3 py-1.5 border transition-all uppercase tracking-wide",
                      u.isAdmin ? "bg-black text-white border-black" : "bg-white text-black/40 border-black/20 hover:border-black hover:text-black"
                    )}>{u.isAdmin ? "Admin" : "User"}</button>
                  <button onClick={() => patch(u._id, { isBanned: !u.isBanned })}
                    className={clsx("text-xs font-bold px-3 py-1.5 border transition-all",
                      u.isBanned ? "border-red-400 text-red-500 hover:bg-red-500 hover:text-white" : "border-green-400 text-green-600 hover:bg-green-500 hover:text-white"
                    )}>{u.isBanned ? "Banned" : "Active"}</button>
                </div>
              </div>
            ))}
            {users.length === 0 && <p className="p-8 text-center text-black/30 text-sm">No users found</p>}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-black/40 text-xs uppercase tracking-widest border-b border-black/10 bg-black/2">
                  {["User","Email","Joined","Role","Status"].map(h => (
                    <th key={h} className="px-5 py-3 text-left font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={i} className="border-t border-black/6 hover:bg-black/2 transition-all">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-black flex-shrink-0">{u.name?.[0]?.toUpperCase() ?? "?"}</div>
                        <span className="font-semibold">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-black/45 text-xs">{u.email}</td>
                    <td className="px-5 py-3 text-black/35 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3">
                      <button onClick={() => patch(u._id, { isAdmin: !u.isAdmin })}
                        className={clsx("text-xs font-bold px-3 py-1 border transition-all uppercase tracking-wide",
                          u.isAdmin ? "bg-black text-white border-black" : "bg-white text-black/40 border-black/20 hover:border-black hover:text-black"
                        )}>{u.isAdmin ? "Admin" : "User"}</button>
                    </td>
                    <td className="px-5 py-3">
                      <button onClick={() => patch(u._id, { isBanned: !u.isBanned })}
                        className={clsx("text-xs font-bold px-3 py-1 border transition-all",
                          u.isBanned ? "border-red-400 text-red-500 hover:bg-red-500 hover:text-white" : "border-green-400 text-green-600 hover:bg-green-500 hover:text-white"
                        )}>{u.isBanned ? "Banned" : "Active"}</button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && <tr><td colSpan={5} className="py-16 text-center text-black/30">No users found</td></tr>}
              </tbody>
            </table>
          </div>

          <Pagination page={page} total={total} perPage={25} onPage={setPage} />
        </Card>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ANALYTICS
═══════════════════════════════════════════════════════════════ */
function AnalyticsTab({ toast }) {
  const [data,    setData]    = useState(null);
  const [period,  setPeriod]  = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/analytics?period=${period}`, { headers: authHeaders() })
      .then(r => r.json())
      .then(d => { if (d.success) setData(d); else toast(d.message, "error"); })
      .finally(() => setLoading(false));
  }, [period]);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <PageHeader title="Analytics" sub="Revenue from paid orders" compact />
        <div className="flex border border-black/20">
          {[7, 30, 90].map(d => (
            <button key={d} onClick={() => setPeriod(d)}
              className={clsx("px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all border-r border-black/20 last:border-0",
                period === d ? "bg-black text-white" : "text-black/50 hover:text-black bg-white"
              )}>{d}d</button>
          ))}
        </div>
      </div>

      {loading ? <Skeleton rows={8} /> : data && (
        <div className="space-y-5">
          {/* KPI cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Revenue",   value: fmt(data.stats.revenue),  pct: data.stats.revenuePct },
              { label: "Orders",    value: data.stats.orders,        pct: data.stats.ordersPct  },
              { label: "New Users", value: data.stats.newUsers,      pct: data.stats.usersPct   },
              { label: "Avg Order", value: fmt(data.stats.avgOrder), pct: null                  },
            ].map((k, i) => (
              <div key={i} className="bg-white border border-black/10 p-4 md:p-5">
                <div className="text-black/40 text-[10px] uppercase tracking-widest mb-2 font-medium">{k.label}</div>
                <div className="text-2xl md:text-3xl font-black mb-1">{k.value}</div>
                {k.pct != null && <div className={clsx("text-xs font-semibold", k.pct >= 0 ? "text-green-600" : "text-red-500")}>{k.pct >= 0 ? "▲" : "▼"} {Math.abs(k.pct)}% vs prev</div>}
              </div>
            ))}
          </div>

          {/* Bar chart */}
          <Card title={`Daily Revenue — Last ${period} days`}>
            <div className="px-4 md:px-5 pb-5 pt-2"><BarChart data={data.dailyRevenue} /></div>
          </Card>

          {/* Status + Top products */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Card title="Delivery Status Breakdown">
              {data.statusBreakdown.map((s, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3 border-t border-black/6 first:border-0">
                  <span className={clsx("text-xs font-bold px-2.5 py-1 capitalize rounded-full", STATUS_PILL[s._id] ?? "bg-black/5 text-black/50")}>{s._id}</span>
                  <span className="font-black">{s.count}</span>
                </div>
              ))}
              {data.statusBreakdown.length === 0 && <p className="px-5 py-8 text-black/30 text-sm">No data yet</p>}
            </Card>

            <Card title="Top Products by Revenue">
              {data.topProducts.map((p, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3 border-t border-black/6 first:border-0">
                  {p.image ? <img src={p.image} alt="" className="w-9 h-9 object-cover flex-shrink-0" /> : <div className="w-9 h-9 bg-black/5 flex items-center justify-center flex-shrink-0">🛍️</div>}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{p.title || "Unknown"}</div>
                    <div className="text-xs text-black/35">{p.units} units sold</div>
                  </div>
                  <div className="font-black text-sm flex-shrink-0">{fmt(p.revenue)}</div>
                </div>
              ))}
              {data.topProducts.length === 0 && <p className="px-5 py-8 text-black/30 text-sm">No sales yet</p>}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Shared components ─────────────────────────────────────── */
function BarChart({ data }) {
  if (!data?.length) return <p className="py-8 text-center text-black/30 text-sm">No data for this period</p>;
  const max = Math.max(...data.map(d => d.revenue), 1);
  return (
    <div className="flex items-end gap-0.5 md:gap-1 h-32 md:h-36 pt-2">
      {data.map((d, i) => (
        <div key={i} title={`${d._id}: ${fmt(d.revenue)}`}
          className="flex-1 bg-black/15 hover:bg-black transition-all cursor-pointer min-w-0"
          style={{ height: `${Math.max((d.revenue / max) * 100, 2)}%` }} />
      ))}
    </div>
  );
}

function Card({ title, action, children }) {
  return (
    <div className="bg-white border border-black/10 overflow-hidden">
      {title && (
        <div className="flex justify-between items-center px-4 md:px-5 py-4 border-b border-black/10">
          <span className="font-bold text-sm uppercase tracking-wide">{title}</span>
          {action && <button onClick={action.fn} className="text-xs font-semibold text-black/40 hover:text-black underline underline-offset-2">{action.label}</button>}
        </div>
      )}
      {children}
    </div>
  );
}

function PageHeader({ title, sub, compact }) {
  return (
    <div className={compact ? "mb-0" : "mb-6"}>
      <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">{title}</h1>
      {sub && <p className="text-black/40 text-sm mt-1 font-medium">{sub}</p>}
    </div>
  );
}

function Field({ label, error, children, span2 }) {
  return (
    <div className={clsx("space-y-1.5", span2 && "md:col-span-2")}>
      <label className="text-xs font-semibold text-black/45 uppercase tracking-widest">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div onClick={() => onChange(!value)} className={clsx("w-10 h-5 relative transition-all flex-shrink-0", value ? "bg-black" : "bg-black/20")}>
        <div className={clsx("absolute top-0.5 w-4 h-4 bg-white transition-all", value ? "left-5" : "left-0.5")} />
      </div>
      <span className="text-sm text-black/55 font-medium">{label}</span>
    </label>
  );
}

function Skeleton({ rows = 4 }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => <div key={i} className="h-12 bg-black/5 rounded" />)}
    </div>
  );
}

function Pagination({ page, total, perPage, onPage }) {
  if (total <= perPage) return null;
  return (
    <div className="flex justify-between items-center px-4 md:px-5 py-4 border-t border-black/10 text-sm">
      <span className="text-black/40 font-medium text-xs md:text-sm">Page {page} · {total} total</span>
      <div className="flex border border-black/20">
        <button disabled={page <= 1} onClick={() => onPage(p => p - 1)}
          className="px-3 md:px-4 py-1.5 text-xs font-bold hover:bg-black hover:text-white disabled:opacity-30 transition-all border-r border-black/20">← Prev</button>
        <button disabled={page * perPage >= total} onClick={() => onPage(p => p + 1)}
          className="px-3 md:px-4 py-1.5 text-xs font-bold hover:bg-black hover:text-white disabled:opacity-30 transition-all">Next →</button>
      </div>
    </div>
  );
}

const inp = (err) => clsx(
  "w-full border px-4 py-2.5 text-sm placeholder:text-black/25 focus:outline-none transition-all bg-white",
  err ? "border-red-400 focus:border-red-500" : "border-black/15 focus:border-black"
);