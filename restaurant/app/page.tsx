"use client";

import { useEffect, useState } from "react";

type Order = { id: string; status: string; total: number; restaurant: { name: string }; items: { name: string; quantity: number }[] };
const api = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

export default function RestaurantDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [message, setMessage] = useState("Loading orders...");

  const load = async () => {
    const token = window.localStorage.getItem("luxebites-token");
    const response = await fetch(`${api}/restaurant/orders`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
    const payload = await response.json().catch(() => null);
    if (!response.ok) { setMessage(payload?.message ?? "Sign in with a restaurant-owner account to view orders."); return; }
    setOrders(payload.data ?? []); setMessage("");
  };

  useEffect(() => { void load(); }, []);

  const advance = async (order: Order) => {
    const next = order.status === "PLACED" ? "CONFIRMED" : order.status === "CONFIRMED" ? "PREPARING" : order.status === "PREPARING" ? "READY" : null;
    if (!next) return;
    const token = window.localStorage.getItem("luxebites-token");
    await fetch(`${api}/restaurant/orders/${order.id}/status`, { method: "PATCH", headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ status: next }) });
    await load();
  };

  return <div className="shell"><aside className="side"><h1>Luxebites</h1><p>Restaurant studio</p><p>Orders</p><p>Menu</p><p>Analytics</p></aside><main className="main"><span className="eyebrow">Operations desk</span><h1 className="title">Good service, in motion.</h1><section className="grid"><div className="card"><strong>Today&apos;s orders</strong><div className="value">{orders.length}</div></div><div className="card"><strong>Pending attention</strong><div className="value">{orders.filter((order) => order.status === "PLACED").length}</div></div><div className="card"><strong>Live status</strong><div className="value">{message ? "—" : "Ready"}</div></div></section><section className="table"><div className="row"><strong>Order</strong><strong>Status</strong><strong>Total</strong><strong>Action</strong></div>{orders.map((order) => <div className="row" key={order.id}><span>{order.items.map((item) => `${item.name} ×${item.quantity}`).join(", ")}</span><span>{order.status}</span><span>₹{order.total}</span><button className="pill" onClick={() => void advance(order)}>Advance</button></div>)}{!orders.length && <div className="row"><span>{message}</span></div>}</section></main></div>;
}
