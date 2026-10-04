"use client";

import { useEffect, useState } from "react";

type Delivery = { id: string; riderId: string | null; status: string; order: { restaurant: { name: string }; total: number; address: { fullAddress: string } | null } };
const api = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

export default function RiderDashboard() {
  const [online, setOnline] = useState(false);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [message, setMessage] = useState("Loading deliveries...");
  const token = () => window.localStorage.getItem("luxebites-token");
  const headers = (): Record<string, string> => token() ? { Authorization: `Bearer ${token()}` } : {};
  const load = async () => { const response = await fetch(`${api}/rider/deliveries`, { headers: headers() }); const payload = await response.json().catch(() => null); if (!response.ok) { setMessage(payload?.message ?? "Sign in with an approved rider account."); return; } setDeliveries(payload.data ?? []); setMessage(""); };
  useEffect(() => { void load(); }, []);
  const toggle = async () => { const next = !online; await fetch(`${api}/rider/availability`, { method: "PATCH", headers: { "Content-Type": "application/json", ...headers() }, body: JSON.stringify({ isOnline: next }) }); setOnline(next); };
  const accept = async (id: string) => { await fetch(`${api}/rider/deliveries/${id}/accept`, { method: "POST", headers: headers() }); await load(); };

  return <main className="mobile"><header className="top"><span className="brand"><img width="34" height="34" src="/luxe-bites-admin-mark.svg" alt="" />Luxebites</span><button className={`status ${online ? "" : "off"}`} onClick={() => void toggle()}>{online ? "Online" : "Go online"}</button></header><span className="eyebrow">Rider dashboard</span><h1 className="title">Keep the city moving.</h1><section className="cards"><div className="card"><span className="label">Today&apos;s earnings</span><div className="value">₹0</div></div><div className="card"><span className="label">Active deliveries</span><div className="value">{deliveries.filter((delivery) => delivery.riderId).length}</div></div></section><section className="deliveries"><span className="eyebrow">Available deliveries</span>{deliveries.map((delivery) => <article className="delivery" key={delivery.id}><h3>{delivery.order.restaurant.name}</h3><p>{delivery.order.address?.fullAddress ?? "Address pending"} · ₹{delivery.order.total}</p>{delivery.status === "SEARCHING_RIDER" && <button className="accept" onClick={() => void accept(delivery.id)}>Accept delivery</button>}</article>)}{!deliveries.length && <p>{message}</p>}</section></main>;
}
