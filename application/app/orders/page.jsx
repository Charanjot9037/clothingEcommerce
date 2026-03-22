"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package } from "lucide-react";
import Wrapper from "../components/atoms/Wrapper";

function OrdersContent() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
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
      .then((d) => {
        console.log("📦 Orders response:", d); // ← debug
        if (d.success) setOrders(d.orders);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <Wrapper>
      <div className="max-w-4xl mx-auto px-4 py-10">

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
              <div key={order._id} className="border border-gray-200 rounded-2xl p-5 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric", month: "long", day: "numeric",
                    })}
                  </span>
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full capitalize">
                    {order.status}
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <img src={item.image} alt={item.title} className="w-12 h-12 rounded-xl object-cover bg-gray-100" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{item.title}</p>
                        <p className="text-xs text-gray-400">Size: {item.selectedSize} · Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-bold">${item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <hr className="my-4 border-gray-100" />
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total</span>
                  <span className="font-black">${order.total}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Wrapper>
  );
}

// Suspense wrapper required for useSearchParams in Next.js 13+
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