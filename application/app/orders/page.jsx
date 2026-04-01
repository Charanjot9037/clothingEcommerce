"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, MapPin, Truck, Calendar, CreditCard } from "lucide-react";
import Wrapper from "../components/atoms/Wrapper";

function StatusBadge({ status }) {
  const styles = {
    pending:    "bg-yellow-100 text-yellow-700",
    processing: "bg-blue-100 text-blue-700",
    dispatched: "bg-purple-100 text-purple-700",
    shipped:    "bg-indigo-100 text-indigo-700",
    delivered:  "bg-green-100 text-green-700",
  };
  return (
    <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${styles[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

function OrdersContent() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const router       = useRouter();
  const searchParams = useSearchParams();
  const justPaid     = searchParams.get("success") === "true";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }

    fetch("/api/auth/orders", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => { if (d.success) setOrders(d.orders); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleExpand = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
    </div>
  );
  const handleDeleteOrder = async (orderId) => {
  const confirm = window.confirm("Are you sure you want to delete this order from your history?");
  if (!confirm) return;

  const token = localStorage.getItem("token");

  try {
    const res = await fetch("/api/auth/orders/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ orderId }),
    });

    const data = await res.json();
    if (data.success) {
      setOrders(prev => prev.filter(o => o._id !== orderId));
    } else {
      alert(data.message || "Failed to delete order.");
    }
  } catch (err) {
    alert("Something went wrong.");
  }
};

  return (
    <Wrapper>
      <div className="">

        {justPaid && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl p-4 mb-8">
            <CheckCircle className="text-green-500" size={24} />
            <div>
              <p className="font-bold text-green-700">Payment Successful!</p>
              <p className="text-green-600 text-sm">Your order has been placed successfully.</p>
            </div>
          </div>
        )}

        <h1 className="text-3xl font-black uppercase tracking-tight mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20">
            <Package size={64} strokeWidth={1} className="text-gray-300" />
            <p className="text-gray-400">No orders yet.</p>
            <Link href="/" className="bg-black text-white px-8 py-3 rounded-full text-sm font-semibold hover:opacity-80">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {orders.map((order) => (
              <div key={order._id} className="border border-gray-200 rounded-2xl bg-white overflow-hidden">

                {/* ── Header ── */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-gray-400">Order placed</span>
                    <span className="text-sm font-semibold">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric", month: "long", day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={order.deliveryStatus} />
                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full capitalize">
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* ── Items ── */}
                <div className="flex flex-col gap-3 px-5 py-4">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <img src={item.image} alt={item.title}
                        className="w-14 h-14 rounded-xl object-cover bg-gray-100 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{item.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Size: {item.selectedSize} · Color: {item.selectedColor} · Qty: {item.quantity}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">${item.price} each</p>
                      </div>
                      <span className="text-sm font-black">${item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* ── Delivery & Date Info ── */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 px-5 pb-4">
  <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
    <Truck size={15} className="text-gray-400 flex-shrink-0" />
    <div>
      <p className="text-xs text-gray-400">Delivery Status</p>
      <p className="text-xs font-semibold capitalize">{order.deliveryStatus}</p>
    </div>
  </div>

  <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
    <Calendar size={15} className="text-gray-400 flex-shrink-0" />
    <div>
      <p className="text-xs text-gray-400">Expected Delivery</p>
      <p className="text-xs font-semibold">
        {order.expectedDeliveryDate
          ? new Date(order.expectedDeliveryDate).toLocaleDateString("en-US", {
              month: "short", day: "numeric", year: "numeric",
            })
          : "—"}
      </p>
    </div>
  </div>

  {order.deliveryStatus === "pending" && (
    <button
      onClick={() => handleDeleteOrder(order._id)}
      className="w-full flex items-center justify-center gap-2 bg-black text-white text-sm font-semibold py-2.5 rounded-xl hover:opacity-80 transition-all"
    >
      Cancel Order
    </button>
  )}

  {(order.deliveryStatus === "dispatched" || order.deliveryStatus === "delivered") && (
    <div className="col-span-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700 flex items-center justify-between gap-3">
      <div>
        <p className="font-semibold">Want to cancel this order?</p>
        <p className="text-xs text-amber-600 mt-0.5">
          Your order has already been {order.deliveryStatus}. Please contact us.
        </p>
      </div>
      
     <a   href={`mailto:support@yourstore.com?subject=Cancel Order ${order._id}&body=Hi, I would like to cancel my order ID: ${order._id}.`}
        className="flex-shrink-0 inline-flex items-center gap-1.5 bg-amber-600 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-amber-700 transition-all"
      >
        📧 Email Support
      </a>
    </div>
  )}
</div>

                {/* ── Toggle Details ── */}
                <button
                  onClick={() => toggleExpand(order._id)}
                  className="w-full text-xs text-gray-400 hover:text-black py-2 border-t border-gray-100 transition-all"
                >
                  {expanded[order._id] ? "▲ Hide Details" : "▼ Show Details"}
                </button>

                {expanded[order._id] && (
                  <div className="px-5 pb-5 border-t border-gray-100 pt-4 flex flex-col gap-4">

                    {/* Pricing Breakdown */}
                    <div>
                      <p className="text-xs font-bold uppercase text-gray-400 mb-2 flex items-center gap-1.5">
                        <CreditCard size={13} /> Price Breakdown
                      </p>
                      <div className="flex flex-col gap-1.5 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Subtotal</span>
                          <span>${order.subtotal}</span>
                        </div>
                        {order.discount > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Discount</span>
                            <span>−${order.discount}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-500">Delivery Fee</span>
                          <span>${order.deliveryFee}</span>
                        </div>
                        <hr className="border-gray-100 my-1" />
                        <div className="flex justify-between font-black text-base">
                          <span>Total</span>
                          <span>${order.total}</span>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Address */}
                    {order.address && (
                      <div>
                        <p className="text-xs font-bold uppercase text-gray-400 mb-2 flex items-center gap-1.5">
                          <MapPin size={13} /> Delivery Address
                        </p>
                        <div className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl px-4 py-3">
                          <p className="font-semibold text-black">{order.address.fullName}</p>
                          <p>{order.address.street}</p>
                          <p>{order.address.city}, {order.address.state} {order.address.zip}</p>
                          <p>{order.address.country}</p>
                          {order.address.phone && (
                            <p className="mt-1 text-gray-400 text-xs">📞 {order.address.phone}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Order ID */}
                    <p className="text-xs text-gray-300 break-all">Order ID: {order._id}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Wrapper>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <OrdersContent />
    </Suspense>
  );
}