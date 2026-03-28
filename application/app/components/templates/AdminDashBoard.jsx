"use client";

import { useState, useEffect, useCallback } from "react";
import clsx from "clsx";

/* ─── reads JWT from localStorage — same as your existing frontend ── */
const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

const fmt = (n) => `$${Number(n ?? 0).toLocaleString()}`;

const DELIVERY_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

const STATUS_PILL = {
  pending:    "text-amber-400  bg-amber-400/10",
  processing: "text-sky-400    bg-sky-400/10",
  shipped:    "text-violet-400 bg-violet-400/10",
  delivered:  "text-emerald-400 bg-emerald-400/10",
  cancelled:  "text-rose-400   bg-rose-400/10",
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
  const [tab,   setTab]   = useState("overview");
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  }, []);

  return (
    <div className="min-h-screen bg-[#06060e] text-white"
      style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>

      {toast && (
        <div className={clsx(
          "fixed top-5 right-5 z-50 px-5 py-3 rounded-xl text-sm font-semibold shadow-2xl transition-all",
          toast.type === "error" ? "bg-rose-600" : "bg-emerald-600"
        )}>{toast.msg}</div>
      )}

      <div className="flex h-screen overflow-hidden">
        {/* ── Sidebar ── */}
        <aside className="w-52 flex-shrink-0 border-r border-white/8 flex flex-col py-8 px-4 gap-1">
          <div className="px-3 mb-10">
            <div className="text-xl font-black tracking-widest">
              SHOP<span className="text-violet-400">.CO</span>
            </div>
            <div className="text-[10px] text-white/25 tracking-wider mt-1 uppercase">Admin Panel</div>
          </div>

          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm w-full text-left transition-all",
                tab === t.key
                  ? "bg-violet-500/20 text-violet-300 font-semibold"
                  : "text-white/40 hover:text-white/80 hover:bg-white/5"
              )}>
              <span className="w-5 text-center text-base">{t.icon}</span>
              {t.label}
            </button>
          ))}

          <div className="mt-auto border-t border-white/8 pt-4">
            <a href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/30 hover:text-white/60 hover:bg-white/5 transition-all">
              <span className="w-5 text-center">↩</span> View Store
            </a>
          </div>
        </aside>

        {/* ── Main ── */}
        <main className="flex-1 overflow-y-auto p-8">
          {tab === "overview"  && <OverviewTab  onNav={setTab} toast={showToast} />}
          {tab === "orders"    && <OrdersTab    toast={showToast} />}
          {tab === "products"  && <ProductsTab  toast={showToast} />}
          {tab === "users"     && <UsersTab     toast={showToast} />}
          {tab === "analytics" && <AnalyticsTab toast={showToast} />}
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
      .then(([a, o]) => {
        setAnalytics(a);
        setOrders(o.orders ?? []);
      })
      .catch(() => toast("Failed to load overview", "error"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Skeleton rows={6} />;

  const s = analytics?.stats ?? {};

  const cards = [
    { label: "Revenue (30d)",  value: fmt(s.revenue),      pct: s.revenuePct,  nav: "analytics" },
    { label: "Orders (30d)",   value: s.orders ?? 0,       pct: s.ordersPct,   nav: "orders"    },
    { label: "New Users (30d)",value: s.newUsers ?? 0,     pct: s.usersPct,    nav: "users"     },
    { label: "Avg Order",      value: fmt(s.avgOrder),     pct: null,          nav: "analytics" },
    { label: "Products",       value: s.totalProducts ?? 0,pct: null,          nav: "products"  },
  ];

  return (
    <div>
      <PageHeader title="Overview" sub="Last 30 days" />
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {cards.map((c, i) => (
          <div key={i} onClick={() => onNav(c.nav)}
            className="bg-[#0f0f1a] border border-white/8 rounded-2xl p-5 cursor-pointer hover:border-violet-500/30 transition-all">
            <div className="text-white/35 text-xs uppercase tracking-widest mb-2">{c.label}</div>
            <div className="text-2xl font-black mb-1">{c.value}</div>
            {c.pct != null && (
              <div className={clsx("text-xs", c.pct >= 0 ? "text-emerald-400" : "text-rose-400")}>
                {c.pct >= 0 ? "▲" : "▼"} {Math.abs(c.pct)}% vs prev period
              </div>
            )}
          </div>
        ))}
      </div>

      <Card title="Recent Orders" action={{ label: "All orders →", fn: () => onNav("orders") }}>
        <table className="w-full text-sm">
          <tbody>
            {orders.map((o, i) => (
              <tr key={i} className="border-t border-white/6 hover:bg-white/3">
                <td className="px-4 py-3 font-mono text-xs text-white/35">#{String(o._id).slice(-6).toUpperCase()}</td>
                <td className="px-4 py-3 text-white/70 text-xs">{o.userId}</td>
                <td className="px-4 py-3 font-bold">{fmt(o.total)}</td>
                <td className="px-4 py-3">
                  <span className={clsx("px-2 py-0.5 rounded-full text-xs font-medium capitalize", STATUS_PILL[o.deliveryStatus])}>
                    {o.deliveryStatus}
                  </span>
                </td>
                <td className="px-4 py-3 text-white/35 text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td colSpan={5} className="px-4 py-10 text-center text-white/25">No orders yet</td></tr>}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ORDERS  — calls GET /api/admin/orders + PATCH /api/admin/orders
═══════════════════════════════════════════════════════════════ */
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
      setOrders(data.orders);
      setTotal(data.total);
    } catch (e) { toast(e.message, "error"); }
    finally { setLoading(false); }
  }, [page, status]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (orderId, deliveryStatus) => {
    // optimistic
    setOrders(o => o.map(x => x._id === orderId ? { ...x, deliveryStatus } : x));
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ orderId, deliveryStatus }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      toast("Order updated");
    } catch (e) { toast(e.message, "error"); load(); }
  };

  return (
    <div>
      <PageHeader title="Orders" sub={`${total} total`} />
      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", ...DELIVERY_STATUSES].map(s => (
          <button key={s} onClick={() => { setStatus(s); setPage(1); }}
            className={clsx("px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all",
              status === s ? "bg-violet-500 text-white" : "bg-white/8 text-white/50 hover:bg-white/15"
            )}>{s}</button>
        ))}
      </div>

      {loading ? <Skeleton rows={6} /> : (
        <Card>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/25 text-xs uppercase tracking-widest border-b border-white/8">
                {["Order ID","User ID","Items","Subtotal","Delivery","Total","Status"].map(h => (
                  <th key={h} className="p-4 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((o, i) => (
                <tr key={i} className="border-t border-white/6 hover:bg-white/3 transition-all">
                  <td className="p-4 font-mono text-xs text-white/35">#{String(o._id).slice(-6).toUpperCase()}</td>
                  <td className="p-4 text-white/50 text-xs truncate max-w-[120px]">{o.userId}</td>
                  <td className="p-4 text-white/60">{o.items?.length ?? 0}</td>
                  <td className="p-4">{fmt(o.subtotal)}</td>
                  <td className="p-4">{fmt(o.deliveryFee)}</td>
                  <td className="p-4 font-bold">{fmt(o.total)}</td>
                  <td className="p-4">
                    <select value={o.deliveryStatus}
                      onChange={e => updateStatus(o._id, e.target.value)}
                      className="bg-[#0f0f1a] border border-white/15 rounded-lg px-2 py-1 text-xs capitalize focus:outline-none focus:border-violet-500 cursor-pointer">
                      {DELIVERY_STATUSES.map(s => (
                        <option key={s} value={s} className="bg-[#0f0f1a] capitalize">{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && <tr><td colSpan={7} className="py-16 text-center text-white/25">No orders found</td></tr>}
            </tbody>
          </table>
          <Pagination page={page} total={total} perPage={20} onPage={setPage} />
        </Card>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PRODUCTS — calls GET/POST /api/products + PATCH/DELETE /api/products/[id]
   Field names match your cart: title, price, oldPrice, discount, image, rating
═══════════════════════════════════════════════════════════════ */
function ProductsTab({ toast }) {
  const [products, setProducts] = useState([]);
  const [total,    setTotal]    = useState(0);
  const [page,     setPage]     = useState(1);
  const [loading,  setLoading]  = useState(true);
  const [view,     setView]     = useState("list"); // list | add | edit
  const [editing,  setEditing]  = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const qs  = new URLSearchParams({ page, limit: 20 }).toString();
      const res = await fetch(`/api/products?${qs}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setProducts(data.products);
      setTotal(data.total);
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
    const url    = id ? `/api/products/${id}` : "/api/products";
    const method = id ? "PATCH" : "POST";
    const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(payload) });
    const data = await res.json();
    if (!data.success) { toast(data.message, "error"); return; }
    toast(id ? "Product updated!" : "Product added to shop!");
    setView("list");
    setEditing(null);
  };

  if (view !== "list") {
    return (
      <ProductForm
        initial={editing}
        onSubmit={p => handleSave(p, editing?._id)}
        onCancel={() => { setView("list"); setEditing(null); }}
      />
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <PageHeader title="Products" sub={`${total} products`} compact />
        <button onClick={() => setView("add")}
          className="bg-violet-500 hover:bg-violet-600 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all">
          + Add Product
        </button>
      </div>

      {loading ? <Skeleton rows={5} /> : (
        <Card>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/25 text-xs uppercase tracking-widest border-b border-white/8">
                {["Product","Category","Price","Old Price","Discount","Stock","Actions"].map(h => (
                  <th key={h} className="p-4 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={i} className="border-t border-white/6 hover:bg-white/3 transition-all">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {p.image
                        ? <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-white/5" />
                        : <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">🛍️</div>
                      }
                      <span className="font-medium">{p.title}</span>
                    </div>
                  </td>
                  <td className="p-4 text-white/60 capitalize">{p.category}</td>
                  <td className="p-4 font-bold">{fmt(p.price)}</td>
                  <td className="p-4 text-white/40 line-through">{p.oldPrice ? fmt(p.oldPrice) : "—"}</td>
                  <td className="p-4">{p.discount ? <span className="text-rose-400">{p.discount}%</span> : "—"}</td>
                  <td className={clsx("p-4 font-medium", p.stock <= 5 ? "text-amber-400" : "text-white/60")}>{p.stock}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => { setEditing(p); setView("edit"); }}
                        className="text-xs text-sky-400 border border-sky-400/20 hover:bg-sky-400/10 px-2.5 py-1 rounded-lg transition-all">Edit</button>
                      <button onClick={() => handleDelete(p._id)}
                        className="text-xs text-rose-400 border border-rose-400/20 hover:bg-rose-400/10 px-2.5 py-1 rounded-lg transition-all">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td colSpan={7} className="py-16 text-center text-white/25">No products yet</td></tr>
              )}
            </tbody>
          </table>
          <Pagination page={page} total={total} perPage={20} onPage={setPage} />
        </Card>
      )}
    </div>
  );
}

/* ── Product Form — field names match your Cart model exactly ── */
function ProductForm({ initial, onSubmit, onCancel }) {
  const blank = { title:"", price:"", oldPrice:"", discount:"", category:"", image:"", rating:"", description:"", sizes:"", colors:"", stock:"", featured:false };
  const [form, setForm] = useState(initial ? {
    ...blank, ...initial,
    sizes:  (initial.sizes  ?? []).join(", "),
    colors: (initial.colors ?? []).join(", "),
  } : blank);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: null })); };

  const validate = () => {
    const e = {};
    if (!form.title.trim())                               e.title    = "Required";
    if (!form.price || isNaN(+form.price) || +form.price <= 0) e.price = "Valid price required";
    if (!form.category.trim())                            e.category = "Required";
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    await onSubmit({
      ...form,
      price:    +form.price,
      oldPrice: form.oldPrice  ? +form.oldPrice  : null,
      discount: form.discount  ? +form.discount  : 0,
      rating:   form.rating    ? +form.rating    : 0,
      stock:    form.stock     ? +form.stock     : 0,
      sizes:    form.sizes.split(",").map(s => s.trim()).filter(Boolean),
      colors:   form.colors.split(",").map(s => s.trim()).filter(Boolean),
    });
    setSaving(false);
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onCancel} className="text-white/40 hover:text-white text-xl">←</button>
        <PageHeader title={initial ? "Edit Product" : "Add New Product"} sub="Saved to MongoDB" compact />
      </div>

      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 max-w-3xl">
        <Field label="Title *" error={errors.title} span2>
          <input value={form.title} onChange={e => set("title", e.target.value)} placeholder="Classic White T-Shirt" className={inp(errors.title)} />
        </Field>
        <Field label="Price ($) *" error={errors.price}>
          <input type="number" min="0" step="0.01" value={form.price} onChange={e => set("price", e.target.value)} placeholder="29.99" className={inp(errors.price)} />
        </Field>
        <Field label="Old Price ($)">
          <input type="number" min="0" step="0.01" value={form.oldPrice} onChange={e => set("oldPrice", e.target.value)} placeholder="39.99" className={inp()} />
        </Field>
        <Field label="Discount (%)">
          <input type="number" min="0" max="100" value={form.discount} onChange={e => set("discount", e.target.value)} placeholder="20" className={inp()} />
        </Field>
        <Field label="Category *" error={errors.category}>
          <input value={form.category} onChange={e => set("category", e.target.value)} placeholder="men / women / kids…" className={inp(errors.category)} />
        </Field>
        <Field label="Stock">
          <input type="number" min="0" value={form.stock} onChange={e => set("stock", e.target.value)} placeholder="100" className={inp()} />
        </Field>
        <Field label="Rating (0–5)">
          <input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={e => set("rating", e.target.value)} placeholder="4.5" className={inp()} />
        </Field>
        <Field label="Image URL" span2>
          <input value={form.image} onChange={e => set("image", e.target.value)} placeholder="https://…" className={inp()} />
        </Field>
        <Field label="Sizes (comma-separated)">
          <input value={form.sizes} onChange={e => set("sizes", e.target.value)} placeholder="XS, S, M, L, XL" className={inp()} />
        </Field>
        <Field label="Colors (comma-separated)">
          <input value={form.colors} onChange={e => set("colors", e.target.value)} placeholder="Black, White, Navy" className={inp()} />
        </Field>
        <Field label="Description" span2>
          <textarea rows={3} value={form.description} onChange={e => set("description", e.target.value)} placeholder="Short product description…" className={inp() + " resize-none"} />
        </Field>

        <div className="md:col-span-2">
          <Toggle label="Feature on homepage" value={form.featured} onChange={v => set("featured", v)} />
        </div>

        {form.image && (
          <div className="md:col-span-2 rounded-xl overflow-hidden border border-white/10">
            <img src={form.image} alt="preview" className="w-full h-44 object-cover" />
          </div>
        )}

        <div className="md:col-span-2 flex gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="bg-violet-500 hover:bg-violet-600 disabled:opacity-50 text-white font-semibold px-8 py-3 rounded-xl text-sm transition-all">
            {saving ? "Saving…" : initial ? "Save Changes" : "Add to Shop"}
          </button>
          <button type="button" onClick={onCancel}
            className="bg-white/8 hover:bg-white/15 text-white/60 px-6 py-3 rounded-xl text-sm transition-all">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   USERS — calls GET/PATCH /api/admin/users
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
      setUsers(data.users);
      setTotal(data.total);
    } catch (e) { toast(e.message, "error"); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const patch = async (userId, updates) => {
    const res  = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({ userId, updates }),
    });
    const data = await res.json();
    if (!data.success) { toast(data.message, "error"); return; }
    setUsers(u => u.map(x => x._id === userId ? { ...x, ...updates } : x));
    toast("User updated");
  };

  return (
    <div>
      <PageHeader title="Users" sub={`${total} registered users`} />
      <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
        placeholder="Search name or email…"
        className="mb-5 bg-[#0f0f1a] border border-white/10 rounded-xl px-4 py-2 text-sm placeholder:text-white/25 focus:outline-none focus:border-violet-500 w-64" />

      {loading ? <Skeleton rows={5} /> : (
        <Card>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/25 text-xs uppercase tracking-widest border-b border-white/8">
                {["User","Email","Joined","Admin","Status"].map(h => (
                  <th key={h} className="p-4 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={i} className="border-t border-white/6 hover:bg-white/3 transition-all">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-emerald-400 flex items-center justify-center text-xs font-bold">
                        {u.name?.[0]?.toUpperCase() ?? "?"}
                      </div>
                      <span className="font-medium">{u.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-white/45 text-xs">{u.email}</td>
                  <td className="p-4 text-white/35 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <button onClick={() => patch(u._id, { isAdmin: !u.isAdmin })}
                      className={clsx("text-xs px-3 py-1 rounded-full font-medium transition-all",
                        u.isAdmin ? "bg-violet-500/20 text-violet-300" : "bg-white/8 text-white/40 hover:bg-violet-500/20 hover:text-violet-300"
                      )}>
                      {u.isAdmin ? "Admin" : "User"}
                    </button>
                  </td>
                  <td className="p-4">
                    <button onClick={() => patch(u._id, { isBanned: !u.isBanned })}
                      className={clsx("text-xs px-3 py-1 rounded-full font-medium transition-all",
                        u.isBanned
                          ? "bg-rose-400/10 text-rose-400 hover:bg-emerald-400/10 hover:text-emerald-400"
                          : "bg-emerald-400/10 text-emerald-400 hover:bg-rose-400/10 hover:text-rose-400"
                      )}>
                      {u.isBanned ? "Banned" : "Active"}
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && <tr><td colSpan={5} className="py-16 text-center text-white/25">No users found</td></tr>}
            </tbody>
          </table>
          <Pagination page={page} total={total} perPage={25} onPage={setPage} />
        </Card>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ANALYTICS — calls GET /api/admin/analytics
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
      <div className="flex justify-between items-center mb-6">
        <PageHeader title="Analytics" sub="Revenue from paid orders" compact />
        <div className="flex gap-2">
          {[7, 30, 90].map(d => (
            <button key={d} onClick={() => setPeriod(d)}
              className={clsx("px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                period === d ? "bg-violet-500 text-white" : "bg-white/8 text-white/50 hover:bg-white/15"
              )}>Last {d}d</button>
          ))}
        </div>
      </div>

      {loading ? <Skeleton rows={8} /> : data && (
        <div className="space-y-6">
          {/* KPI cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Revenue",   value: fmt(data.stats.revenue),   pct: data.stats.revenuePct },
              { label: "Orders",    value: data.stats.orders,         pct: data.stats.ordersPct  },
              { label: "New Users", value: data.stats.newUsers,       pct: data.stats.usersPct   },
              { label: "Avg Order", value: fmt(data.stats.avgOrder),  pct: null                  },
            ].map((k, i) => (
              <div key={i} className="bg-[#0f0f1a] border border-white/8 rounded-2xl p-5">
                <div className="text-white/35 text-xs uppercase tracking-widest mb-2">{k.label}</div>
                <div className="text-3xl font-black mb-1">{k.value}</div>
                {k.pct != null && (
                  <div className={clsx("text-xs", k.pct >= 0 ? "text-emerald-400" : "text-rose-400")}>
                    {k.pct >= 0 ? "▲" : "▼"} {Math.abs(k.pct)}% vs prev period
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Daily revenue bar chart */}
          <Card title={`Daily Revenue — Last ${period} days`}>
            <div className="px-4 pb-4">
              <BarChart data={data.dailyRevenue} />
            </div>
          </Card>

          {/* Status breakdown + Top products */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Delivery Status Breakdown">
              {data.statusBreakdown.map((s, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3 border-t border-white/6 first:border-0">
                  <span className={clsx("text-sm px-2.5 py-0.5 rounded-full font-medium capitalize", STATUS_PILL[s._id] ?? "text-white/50 bg-white/5")}>
                    {s._id}
                  </span>
                  <span className="font-bold">{s.count}</span>
                </div>
              ))}
              {data.statusBreakdown.length === 0 && <p className="px-5 py-6 text-white/25 text-sm">No data yet</p>}
            </Card>

            <Card title="Top Products by Revenue">
              {data.topProducts.map((p, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3 border-t border-white/6 first:border-0">
                  {p.image
                    ? <img src={p.image} alt="" className="w-8 h-8 rounded-lg object-cover bg-white/5" />
                    : <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-sm">🛍️</div>
                  }
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{p.title || "Unknown product"}</div>
                    <div className="text-xs text-white/35">{p.units} units sold</div>
                  </div>
                  <div className="font-bold text-emerald-400 text-sm">{fmt(p.revenue)}</div>
                </div>
              ))}
              {data.topProducts.length === 0 && <p className="px-5 py-6 text-white/25 text-sm">No sales yet</p>}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── CSS bar chart ─────────────────────────────────────────── */
function BarChart({ data }) {
  if (!data?.length) return <p className="py-8 text-center text-white/25 text-sm">No data for this period</p>;
  const max = Math.max(...data.map(d => d.revenue), 1);
  return (
    <div className="flex items-end gap-1 h-36 pt-2">
      {data.map((d, i) => (
        <div key={i} title={`${d._id}: ${fmt(d.revenue)}`}
          className="flex-1 bg-violet-500/40 hover:bg-violet-500 rounded-t transition-all"
          style={{ height: `${Math.max((d.revenue / max) * 100, 2)}%` }}
        />
      ))}
    </div>
  );
}

/* ─── Shared UI ─────────────────────────────────────────────── */
function Card({ title, action, children }) {
  return (
    <div className="bg-[#0f0f1a] border border-white/8 rounded-2xl overflow-hidden">
      {title && (
        <div className="flex justify-between items-center p-4 border-b border-white/8">
          <span className="font-semibold text-sm">{title}</span>
          {action && <button onClick={action.fn} className="text-xs text-violet-400 hover:text-violet-300">{action.label}</button>}
        </div>
      )}
      {children}
    </div>
  );
}

function PageHeader({ title, sub, compact }) {
  return (
    <div className={compact ? "mb-0" : "mb-6"}>
      <h1 className="text-2xl font-black">{title}</h1>
      {sub && <p className="text-white/30 text-sm mt-0.5">{sub}</p>}
    </div>
  );
}

function Field({ label, error, children, span2 }) {
  return (
    <div className={clsx("space-y-1.5", span2 && "md:col-span-2")}>
      <label className="text-xs text-white/40 uppercase tracking-widest">{label}</label>
      {children}
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div onClick={() => onChange(!value)}
        className={clsx("w-10 h-5 rounded-full relative transition-all", value ? "bg-violet-500" : "bg-white/15")}>
        <div className={clsx("absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all", value ? "left-5" : "left-0.5")} />
      </div>
      <span className="text-sm text-white/55">{label}</span>
    </label>
  );
}

function Skeleton({ rows = 4 }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 bg-white/5 rounded-xl" />
      ))}
    </div>
  );
}

function Pagination({ page, total, perPage, onPage }) {
  if (total <= perPage) return null;
  return (
    <div className="flex justify-between items-center p-4 border-t border-white/8 text-sm text-white/35">
      <span>Page {page} · {total} total</span>
      <div className="flex gap-2">
        <button disabled={page <= 1} onClick={() => onPage(p => p - 1)}
          className="px-3 py-1 rounded-lg bg-white/8 hover:bg-white/15 disabled:opacity-30 text-xs transition-all">← Prev</button>
        <button disabled={page * perPage >= total} onClick={() => onPage(p => p + 1)}
          className="px-3 py-1 rounded-lg bg-white/8 hover:bg-white/15 disabled:opacity-30 text-xs transition-all">Next →</button>
      </div>
    </div>
  );
}

const inp = (err) => clsx(
  "w-full bg-[#06060e] border rounded-xl px-4 py-2.5 text-sm placeholder:text-white/20 focus:outline-none transition-all",
  err ? "border-rose-500/60 focus:border-rose-400" : "border-white/10 focus:border-violet-500"
);
