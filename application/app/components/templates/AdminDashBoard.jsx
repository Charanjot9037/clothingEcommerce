"use client";

import { useState, useEffect } from "react";
import clsx from "clsx";

const tabs = [
  { label: "Total Orders", value: "8,492", icon: "📦", color: "violet" },
  { label: "Order Status", value: "3 Types", icon: "🔄", color: "orange" },
  { label: "Revenue", value: "$284K", icon: "💰", color: "green" },
  { label: "Pending", value: "342", icon: "⏳", color: "pink" },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [date, setDate] = useState("");

  useEffect(() => {
    setDate(
      new Date().toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    );
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white px-6 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-3 text-3xl font-bold">
            SHOP.CO
         
        </div>

        <div className="flex items-center gap-4">
          <div className="text-xs text-gray-400 border px-3 py-1 rounded-full">
            {date}
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-green-400 flex items-center justify-center font-bold">
            AK
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {tabs.map((tab, i) => (
          <div
            key={i}
            onClick={() => setActiveTab(i)}
            className={clsx(
              "p-5 rounded-2xl border cursor-pointer transition-all",
              activeTab === i
                ? "border-white/20 bg-white/5 scale-[1.02]"
                : "border-white/10 hover:bg-white/5"
            )}
          >
            <div className="text-2xl mb-3">{tab.icon}</div>
            <div className="text-xs text-gray-400 uppercase mb-1">
              {tab.label}
            </div>
            <div className="text-2xl font-bold">{tab.value}</div>
          </div>
        ))}
      </div>

      {/* Panels */}
      <div>
        {activeTab === 0 && <OrdersTable />}
        {activeTab === 1 && <StatusPanel />}
        {activeTab === 2 && <RevenuePanel />}
        {activeTab === 3 && <PendingPanel />}
      </div>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function OrdersTable() {
  return (
    <div className="bg-[#12121a] border border-white/10 rounded-2xl overflow-hidden">
      <div className="flex justify-between p-5 border-b border-white/10">
        <h2 className="font-semibold">All Orders</h2>
        <button className="bg-violet-500 px-4 py-1 rounded-lg text-sm">
          + New
        </button>
      </div>

      <table className="w-full text-sm">
        <thead className="text-gray-400 text-xs uppercase">
          <tr>
            <th className="p-4 text-left">Order</th>
            <th className="p-4 text-left">Customer</th>
            <th className="p-4 text-left">Amount</th>
            <th className="p-4 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {[
            { id: "#7821", name: "Sarah", amount: "$149", status: "Delivered" },
            { id: "#7820", name: "Mike", amount: "$349", status: "Processing" },
          ].map((o, i) => (
            <tr key={i} className="border-t border-white/10 hover:bg-white/5">
              <td className="p-4">{o.id}</td>
              <td className="p-4">{o.name}</td>
              <td className="p-4 font-bold">{o.amount}</td>
              <td className="p-4 text-green-400">{o.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusPanel() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { label: "Delivered", value: "4218" },
        { label: "Shipped", value: "2104" },
        { label: "Processing", value: "1828" },
        { label: "Pending", value: "342" },
      ].map((item, i) => (
        <div
          key={i}
          className="bg-[#12121a] p-6 rounded-xl border border-white/10 text-center"
        >
          <div className="text-2xl font-bold">{item.value}</div>
          <div className="text-xs text-gray-400">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

function RevenuePanel() {
  const data = [38, 52, 61, 45, 70, 83];

  return (
    <div className="bg-[#12121a] p-6 rounded-2xl border border-white/10">
      <h2 className="mb-4 font-semibold">Revenue</h2>

      <div className="flex items-end gap-3 h-40">
        {data.map((v, i) => (
          <div
            key={i}
            className="flex-1 bg-green-400/30 rounded-t-md"
            style={{ height: `${v}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function PendingPanel() {
  return (
    <div className="bg-[#12121a] p-6 rounded-2xl border border-white/10">
      <h2 className="font-semibold mb-3">Pending Orders</h2>
      <p className="text-sm text-gray-400">
        342 orders need attention.
      </p>
    </div>
  );
}