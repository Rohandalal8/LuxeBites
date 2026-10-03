"use client";

import { useEffect, useState } from "react";

type Application = { id: string; name?: string; status: string; applicant: { email: string | null; name: string | null } };
type Data = { restaurants: Application[]; riders: Application[] };
const api = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

export default function AdminDashboard() {
  const [data, setData] = useState<Data>({ restaurants: [], riders: [] });
  const [message, setMessage] = useState("Loading review queue...");
  const token = () => window.localStorage.getItem("luxebites-token");
  const load = async () => { const response = await fetch(`${api}/admin/applications`, { headers: token() ? { Authorization: `Bearer ${token()}` } : {} }); const payload = await response.json().catch(() => null); if (!response.ok) { setMessage(payload?.message ?? "Sign in with an admin account to continue."); return; } setData(payload.data); setMessage(""); };
  useEffect(() => { void load(); }, []);
  const approve = async (kind: "restaurant" | "rider", id: string) => { await fetch(`${api}/admin/${kind}-applications/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json", ...(token() ? { Authorization: `Bearer ${token()}` } : {}) }, body: JSON.stringify({ status: "APPROVED" }) }); await load(); };
  const renderQueue = ({ title, items, kind }: { title: string; items: Application[]; kind: "restaurant" | "rider" }) => <section className="panel"><h2>{title}</h2>{items.map((item) => <div className="item" key={item.id}><span>{item.name ?? item.applicant.name ?? item.applicant.email}</span><button className="approve" onClick={() => void approve(kind, item.id)}>Approve</button></div>)}{!items.length && <div className="item"><span>{message || "No pending applications"}</span></div>}</section>;

  return <div className="admin"><aside className="nav"><h1>Luxebites</h1><p>Admin command</p><p>Applications</p><p>Users</p><p>Orders</p><p>Analytics</p></aside><main className="content"><span className="eyebrow">Platform overview</span><h1 className="title">Keep the whole table clear.</h1><section className="stats"><div className="stat"><span>Restaurants pending</span><strong>{data.restaurants.length}</strong></div><div className="stat"><span>Riders pending</span><strong>{data.riders.length}</strong></div><div className="stat"><span>System</span><strong>{message ? "Locked" : "Ready"}</strong></div><div className="stat"><span>Backend</span><strong>1 API</strong></div></section><section className="panels">{renderQueue({ title: "Restaurant applications", items: data.restaurants, kind: "restaurant" })}{renderQueue({ title: "Rider applications", items: data.riders, kind: "rider" })}</section></main></div>;
}
