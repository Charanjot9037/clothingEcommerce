"use client";

import { useState, useEffect, useCallback } from "react";
import clsx from "clsx";

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

export default function AdminDashboard() {
  const [tab,   setTab]   = useState("overview");
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  }, []);

  return (
    <div className="min-h-screen bg-white text-black"
      style={{ fontFamily: "'Satoshi', 'DM Sans', 'Segoe UI', sans-serif" }}>

      {toast && (
        <div className={clsx(
          "fixed top-5 right-5 z-50 px-5 py-3 text-sm font-semibold shadow-lg border",
          toast.type === "error" ? "bg-red-600 text-white border-red-600" : "bg-black text-white border-black"
        )}>{toast.msg}</div>
      )}

      <div className="flex h-screen overflow-hidden">

        {/* ── SIDEBAR — black, matches your site's nav/footer ── */}
        <aside className="w-56 flex-shrink-0 bg-black text-white flex flex-col py-8 px-5 gap-0.5">
          <div className="mb-10 px-2">
            <div className="text-2xl font-black tracking-widest text-white">SHOP.CO</div>
            <div className="text-[10px] text-white/40 tracking-[0.2em] mt-1 uppercase">Admin Console</div>
          </div>

          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 text-sm w-full text-left transition-all",
                tab === t.key
                  ? "bg-white text-black font-bold"
                  : "text-white/50 hover:text-white hover:bg-white/10"
              )}>
              <span className="w-5 text-center">{t.icon}</span>
              {t.label}
            </button>
          ))}

          <div className="mt-auto pt-6 border-t border-white/10">
            <a href="/"
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-white/40 hover:text-white hover:bg-white/10 transition-all">
              <span className="w-5 text-center">↩</span> View Store
            </a>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className="flex-1 overflow-y-auto bg-[#f2f0f1]">
          {/* Topbar */}
          <div className="bg-white border-b border-black/10 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-black/40">
              {TABS.find(t => t.key === tab)?.label}
            </h2>
            <div className="flex items-center gap-3">
              <div className="text-xs text-black/40 font-medium">
                {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
              </div>
              <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-black">A</div>
            </div>
          </div>

          <div className="p-8">
            {tab === "overview"  && <OverviewTab  onNav={setTab} toast={showToast} />}
            {tab === "orders"    && <OrdersTab    toast={showToast} />}
            {tab === "products"  && <ProductsTab  toast={showToast} />}
            {tab === "users"     && <UsersTab     toast={showToast} />}
            {tab === "analytics" && <AnalyticsTab toast={showToast} />}
          </div>
        </main>
      </div>
    </div>
  );
}

/* ── OVERVIEW ─────────────────────────────────────────────────── */
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
console.log(orders)
  const cards = [
    { label: "Revenue (30d)",   value: fmt(s.revenue),       pct: s.revenuePct, nav: "analytics" },
    { label: "Orders (30d)",    value: s.orders ?? 0,        pct: s.ordersPct,  nav: "orders"    },
    { label: "New Users (30d)", value: s.newUsers ?? 0,      pct: s.usersPct,   nav: "users"     },
    { label: "Avg Order",       value: fmt(s.avgOrder),      pct: null,         nav: "analytics" },
    { label: "Products",        value: s.totalProducts ?? 0, pct: null,         nav: "products"  },
  ];

  return (
    <div>
      <PageHeader title="Dashboard Overview" sub="Your store at a glance — last 30 days" />
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {cards.map((c, i) => (
          <div key={i} onClick={() => onNav(c.nav)}
            className="bg-white border border-black/10 p-5 cursor-pointer hover:border-black transition-all group">
            <div className="text-black/40 text-xs uppercase tracking-widest mb-3 font-medium">{c.label}</div>
            <div className="text-3xl font-black mb-2">{c.value}</div>
            {c.pct != null && (
              <div className={clsx("text-xs font-semibold", c.pct >= 0 ? "text-green-600" : "text-red-500")}>
                {c.pct >= 0 ? "▲" : "▼"} {Math.abs(c.pct)}% vs last period
              </div>
            )}
          </div>
        ))}
      </div>
      <Card title="Recent Orders" action={{ label: "View all →", fn: () => onNav("orders") }}>
        <table className="w-full text-sm">
          <tbody>
            {orders.map((o, i) => (
              <tr key={i} className="border-t border-black/6 hover:bg-black/2 transition-all">
                <td className="px-5 py-3 font-mono text-xs font-bold text-black/40">#{String(o._id).slice(-6).toUpperCase()}</td>
                <td className="px-5 py-3 text-black/50 text-xs">{o.user?.name || "Unknown User"}</td>
                <td className="px-5 py-3 font-black">{fmt(o.total)}</td>
                <td className="px-5 py-3">
                  <span className={clsx("px-2.5 py-0.5 text-xs font-semibold capitalize rounded-full", STATUS_PILL[o.deliveryStatus])}>
                    {o.deliveryStatus}
                  </span>
                </td>
                <td className="px-5 py-3 text-black/35 text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td colSpan={5} className="px-5 py-12 text-center text-black/30">No orders yet</td></tr>}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ── ORDERS ───────────────────────────────────────────────────── */
function OrdersTab({ toast }) {
  const [orders,  setOrders]  = useState([]);
  const [total,   setTotal]   = useState(0);
  const [page,    setPage]    = useState(1);
  const [status,  setStatus]  = useState("all");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const qs  = new URLSearchParams({ page, limit: 20, status }).toString();
      const res = await fetch(`/api/admin/orders?${qs}`, { headers: authHeaders() });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setOrders(data.orders); setTotal(data.total);
    } catch (e) { toast(e.message, "error"); }
    finally { setLoading(false); }
  }, [page, status]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (orderId, deliveryStatus) => {
    setOrders(o => o.map(x => x._id === orderId ? { ...x, deliveryStatus } : x));
    try {
      const res = await fetch("/api/admin/orders", { method: "PATCH", headers: authHeaders(), body: JSON.stringify({ orderId, deliveryStatus }) });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      toast("Order updated");
    } catch (e) { toast(e.message, "error"); load(); }
  };

  return (
    <div>
      <PageHeader title="Orders" sub={`${total} total orders`} />
      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", ...DELIVERY_STATUSES].map(s => (
          <button key={s} onClick={() => { setStatus(s); setPage(1); }}
            className={clsx("px-4 py-1.5 text-xs font-semibold capitalize border transition-all",
              status === s ? "bg-black text-white border-black" : "bg-white text-black/60 border-black/20 hover:border-black hover:text-black"
            )}>{s}</button>
        ))}
      </div>
      {loading ? <Skeleton rows={6} /> : (
        <Card>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-black/40 text-xs uppercase tracking-widest border-b border-black/10 bg-black/2">
                {["Order ID","User","Items","Subtotal","Delivery","Total","Status"].map(h => (
                  <th key={h} className="px-5 py-3 text-left font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((o, i) => (
                <tr key={i} className="border-t border-black/6 hover:bg-black/2 transition-all">
                  <td className="px-5 py-3 font-mono text-xs font-bold text-black/40">#{String(o._id).slice(-6).toUpperCase()}</td>
                  <td className="px-5 py-3 text-xs text-black/50 truncate max-w-[100px]">{o?.userId?.name}</td>
                  <td className="px-5 py-3 text-black/60">{o.items?.length ?? 0}</td>
                  <td className="px-5 py-3">{fmt(o.subtotal)}</td>
                  <td className="px-5 py-3">{fmt(o.deliveryFee)}</td>
                  <td className="px-5 py-3 font-black">{fmt(o.total)}</td>
                  <td className="px-5 py-3">
                    <select value={o.deliveryStatus} onChange={e => updateStatus(o._id, e.target.value)}
                      className="bg-white border border-black/20 px-2 py-1 text-xs capitalize focus:outline-none focus:border-black cursor-pointer font-medium">
                      {DELIVERY_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && <tr><td colSpan={7} className="py-16 text-center text-black/30">No orders found</td></tr>}
            </tbody>
          </table>
          <Pagination page={page} total={total} perPage={20} onPage={setPage} />
        </Card>
      )}
    </div>
  );
}

/* ── PRODUCTS ─────────────────────────────────────────────────── */
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
    const url = id ? `/api/products/${id}` : "/api/products";
    const res = await fetch(url, { method: id ? "PATCH" : "POST", headers: authHeaders(), body: JSON.stringify(payload) });
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
      <div className="flex justify-between items-center mb-6">
        <PageHeader title="Products" sub={`${total} products in catalogue`} compact />
        <button onClick={() => { setEditing(null); setView("add"); }}
          className="bg-black text-white px-6 py-2.5 text-sm font-bold hover:bg-black/80 transition-all uppercase tracking-wide">
          + Add Product
        </button>
      </div>
      {loading ? <Skeleton rows={5} /> : (
        <Card>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-black/40 text-xs uppercase tracking-widest border-b border-black/10 bg-black/2">
                {["Product","Category","Price","Old Price","Discount","Stock","Actions"].map(h => (
                  <th key={h} className="px-5 py-3 text-left font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={i} className="border-t border-black/6 hover:bg-black/2 transition-all">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {p.image ? <img src={p.image} alt="" className="w-10 h-10 object-cover" />
                        : <div className="w-10 h-10 bg-black/5 flex items-center justify-center">🛍️</div>}
                      <span className="font-semibold">{p.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-black/50 capitalize text-xs font-medium">{p.category}</td>
                  <td className="px-5 py-3 font-black">{fmt(p.price)}</td>
                  <td className="px-5 py-3 text-black/35 line-through text-xs">{p.oldPrice ? fmt(p.oldPrice) : "—"}</td>
                  <td className="px-5 py-3">
                    {p.discount ? <span className="bg-black text-white text-xs font-bold px-2 py-0.5">{p.discount}% OFF</span> : "—"}
                  </td>
                  <td className={clsx("px-5 py-3 font-bold", p.stock <= 5 ? "text-red-500" : "text-black/60")}>{p.stock}</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => { setEditing(p); setView("edit"); }}
                        className="text-xs font-semibold border border-black px-3 py-1 hover:bg-black hover:text-white transition-all">Edit</button>
                      <button onClick={() => handleDelete(p._id)}
                        className="text-xs font-semibold border border-red-400 text-red-500 px-3 py-1 hover:bg-red-500 hover:text-white transition-all">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && <tr><td colSpan={7} className="py-16 text-center text-black/30">No products yet</td></tr>}
            </tbody>
          </table>
          <Pagination page={page} total={total} perPage={20} onPage={setPage} />
        </Card>
      )}
    </div>
  );
}

function ProductForm({ initial, onSubmit, onCancel }) {
  const blank = { title:"", price:"", oldPrice:"", discount:"", category:"", image:"", rating:"", description:"", sizes:"", colors:"", stock:"", featured:false };
  const [form, setForm] = useState(initial ? { ...blank, ...initial, sizes:(initial.sizes??[]).join(", "), colors:(initial.colors??[]).join(", ") } : blank);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: null })); };
  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Required";
    if (!form.price || isNaN(+form.price) || +form.price <= 0) e.price = "Valid price required";
    if (!form.category.trim()) e.category = "Required";
    return e;
  };
  const submit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    await onSubmit({ ...form, price:+form.price, oldPrice:form.oldPrice?+form.oldPrice:null, discount:form.discount?+form.discount:0, rating:form.rating?+form.rating:0, stock:form.stock?+form.stock:0, sizes:form.sizes.split(",").map(s=>s.trim()).filter(Boolean), colors:form.colors.split(",").map(s=>s.trim()).filter(Boolean) });
    setSaving(false);
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onCancel} className="text-black/40 hover:text-black text-xl">←</button>
        <PageHeader title={initial ? "Edit Product" : "Add New Product"} sub="Saved directly to MongoDB" compact />
      </div>
      <form onSubmit={submit} className="bg-white border border-black/10 p-8 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          <Field label="Title *" error={errors.title} span2><input value={form.title} onChange={e=>set("title",e.target.value)} placeholder="Classic White T-Shirt" className={inp(errors.title)} /></Field>
          <Field label="Price ($) *" error={errors.price}><input type="number" min="0" step="0.01" value={form.price} onChange={e=>set("price",e.target.value)} placeholder="29.99" className={inp(errors.price)} /></Field>
          <Field label="Old Price ($)"><input type="number" min="0" step="0.01" value={form.oldPrice} onChange={e=>set("oldPrice",e.target.value)} placeholder="39.99" className={inp()} /></Field>
          <Field label="Discount (%)"><input type="number" min="0" max="100" value={form.discount} onChange={e=>set("discount",e.target.value)} placeholder="20" className={inp()} /></Field>
          <Field label="Category *" error={errors.category}><input value={form.category} onChange={e=>set("category",e.target.value)} placeholder="men / women / kids" className={inp(errors.category)} /></Field>
          <Field label="Stock"><input type="number" min="0" value={form.stock} onChange={e=>set("stock",e.target.value)} placeholder="100" className={inp()} /></Field>
          <Field label="Rating (0–5)"><input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={e=>set("rating",e.target.value)} placeholder="4.5" className={inp()} /></Field>
          <Field label="Image URL" span2><input value={form.image} onChange={e=>set("image",e.target.value)} placeholder="https://…" className={inp()} /></Field>
          <Field label="Sizes (comma-separated)"><input value={form.sizes} onChange={e=>set("sizes",e.target.value)} placeholder="XS, S, M, L, XL" className={inp()} /></Field>
          <Field label="Colors (comma-separated)"><input value={form.colors} onChange={e=>set("colors",e.target.value)} placeholder="Black, White, Navy" className={inp()} /></Field>
          <Field label="Description" span2><textarea rows={3} value={form.description} onChange={e=>set("description",e.target.value)} placeholder="Short product description…" className={inp()+" resize-none"} /></Field>
          <div className="md:col-span-2"><Toggle label="Feature on homepage" value={form.featured} onChange={v=>set("featured",v)} /></div>
          {form.image && <div className="md:col-span-2 border border-black/10 overflow-hidden"><img src={form.image} alt="preview" className="w-full h-48 object-cover" /><div className="px-3 py-1.5 bg-black/3 text-xs text-black/35">Image preview</div></div>}
          <div className="md:col-span-2 flex gap-3 pt-4 border-t border-black/10">
            <button type="submit" disabled={saving} className="bg-black text-white font-bold px-8 py-3 text-sm hover:bg-black/80 disabled:opacity-50 transition-all uppercase tracking-wide">{saving ? "Saving…" : initial ? "Save Changes" : "Add to Shop"}</button>
            <button type="button" onClick={onCancel} className="border border-black/20 text-black/60 px-6 py-3 text-sm font-medium hover:border-black hover:text-black transition-all">Cancel</button>
          </div>
        </div>
      </form>
    </div>
  );
}

/* ── USERS ────────────────────────────────────────────────────── */
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
        className="mb-6 border border-black/20 px-4 py-2.5 text-sm w-64 focus:outline-none focus:border-black placeholder:text-black/30" />
      {loading ? <Skeleton rows={5} /> : (
        <Card>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-black/40 text-xs uppercase tracking-widest border-b border-black/10 bg-black/2">
                {["User","Email","Joined","Role","Status"].map(h=>(
                  <th key={h} className="px-5 py-3 text-left font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={i} className="border-t border-black/6 hover:bg-black/2 transition-all">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-black">{u.name?.[0]?.toUpperCase()??"?"}</div>
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
          <Pagination page={page} total={total} perPage={25} onPage={setPage} />
        </Card>
      )}
    </div>
  );
}

/* ── ANALYTICS ────────────────────────────────────────────────── */
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
      <div className="flex justify-between items-center mb-6">
        <PageHeader title="Analytics" sub="Revenue from paid orders" compact />
        <div className="flex gap-0 border border-black/20">
          {[7,30,90].map(d => (
            <button key={d} onClick={() => setPeriod(d)}
              className={clsx("px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all border-r border-black/20 last:border-0",
                period === d ? "bg-black text-white" : "text-black/50 hover:text-black bg-white"
              )}>{d}d</button>
          ))}
        </div>
      </div>
      {loading ? <Skeleton rows={8} /> : data && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label:"Revenue",   value:fmt(data.stats.revenue),  pct:data.stats.revenuePct },
              { label:"Orders",    value:data.stats.orders,        pct:data.stats.ordersPct  },
              { label:"New Users", value:data.stats.newUsers,      pct:data.stats.usersPct   },
              { label:"Avg Order", value:fmt(data.stats.avgOrder), pct:null                  },
            ].map((k,i) => (
              <div key={i} className="bg-white border border-black/10 p-5">
                <div className="text-black/40 text-xs uppercase tracking-widest mb-3 font-medium">{k.label}</div>
                <div className="text-3xl font-black mb-2">{k.value}</div>
                {k.pct != null && <div className={clsx("text-xs font-semibold", k.pct>=0?"text-green-600":"text-red-500")}>{k.pct>=0?"▲":"▼"} {Math.abs(k.pct)}% vs prev</div>}
              </div>
            ))}
          </div>
          <Card title={`Daily Revenue — Last ${period} days`}>
            <div className="px-5 pb-5 pt-2"><BarChart data={data.dailyRevenue} /></div>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Delivery Status Breakdown">
              {data.statusBreakdown.map((s,i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3 border-t border-black/6 first:border-0">
                  <span className={clsx("text-xs font-bold px-2.5 py-1 capitalize rounded-full", STATUS_PILL[s._id]??"bg-black/5 text-black/50")}>{s._id}</span>
                  <span className="font-black">{s.count}</span>
                </div>
              ))}
              {data.statusBreakdown.length===0 && <p className="px-5 py-8 text-black/30 text-sm">No data yet</p>}
            </Card>
            <Card title="Top Products by Revenue">
              {data.topProducts.map((p,i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3 border-t border-black/6 first:border-0">
                  {p.image ? <img src={p.image} alt="" className="w-9 h-9 object-cover" /> : <div className="w-9 h-9 bg-black/5 flex items-center justify-center">🛍️</div>}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{p.title||"Unknown"}</div>
                    <div className="text-xs text-black/35">{p.units} units sold</div>
                  </div>
                  <div className="font-black text-sm">{fmt(p.revenue)}</div>
                </div>
              ))}
              {data.topProducts.length===0 && <p className="px-5 py-8 text-black/30 text-sm">No sales yet</p>}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

function BarChart({ data }) {
  if (!data?.length) return <p className="py-8 text-center text-black/30 text-sm">No data for this period</p>;
  const max = Math.max(...data.map(d => d.revenue), 1);
  return (
    <div className="flex items-end gap-1 h-36 pt-2">
      {data.map((d,i) => (
        <div key={i} title={`${d._id}: ${fmt(d.revenue)}`}
          className="flex-1 bg-black/15 hover:bg-black transition-all cursor-pointer"
          style={{ height:`${Math.max((d.revenue/max)*100,2)}%` }} />
      ))}
    </div>
  );
}

function Card({ title, action, children }) {
  return (
    <div className="bg-white border border-black/10 overflow-hidden">
      {title && (
        <div className="flex justify-between items-center px-5 py-4 border-b border-black/10">
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
    <div className={compact ? "mb-0" : "mb-8"}>
      <h1 className="text-3xl font-black uppercase tracking-tight">{title}</h1>
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
      <div onClick={() => onChange(!value)} className={clsx("w-10 h-5 relative transition-all", value ? "bg-black" : "bg-black/20")}>
        <div className={clsx("absolute top-0.5 w-4 h-4 bg-white transition-all", value ? "left-5" : "left-0.5")} />
      </div>
      <span className="text-sm text-black/55 font-medium">{label}</span>
    </label>
  );
}

function Skeleton({ rows = 4 }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => <div key={i} className="h-12 bg-black/5" />)}
    </div>
  );
}

function Pagination({ page, total, perPage, onPage }) {
  if (total <= perPage) return null;
  return (
    <div className="flex justify-between items-center px-5 py-4 border-t border-black/10 text-sm">
      <span className="text-black/40 font-medium">Page {page} · {total} total</span>
      <div className="flex border border-black/20">
        <button disabled={page<=1} onClick={()=>onPage(p=>p-1)} className="px-4 py-1.5 text-xs font-bold hover:bg-black hover:text-white disabled:opacity-30 transition-all border-r border-black/20">← Prev</button>
        <button disabled={page*perPage>=total} onClick={()=>onPage(p=>p+1)} className="px-4 py-1.5 text-xs font-bold hover:bg-black hover:text-white disabled:opacity-30 transition-all">Next →</button>
      </div>
    </div>
  );
}

const inp = (err) => clsx(
  "w-full border px-4 py-2.5 text-sm placeholder:text-black/25 focus:outline-none transition-all bg-white",
  err ? "border-red-400 focus:border-red-500" : "border-black/15 focus:border-black"
);
