"use client";

import { FormEvent, useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { apiFetch } from "@/lib/api";

export default function OnboardingPage() {
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => onAuthStateChanged(auth, (nextUser) => {
    setUser(nextUser);
    if (nextUser) setForm((current) => ({ ...current, name: nextUser.displayName ?? "", email: nextUser.email ?? "" }));
  }), []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const token = await user.getIdToken();
      await apiFetch("/restaurant/apply", token, { method: "POST", body: JSON.stringify(form) });
      setMessage("Application submitted. An administrator must approve it before owner access is activated.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to submit your application.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <main className="center"><div className="login-card"><h1>Sign in first.</h1><p>Your Firebase account is required to submit a restaurant application.</p><a className="button" href="/login">Open sign in</a></div></main>;
  return <main className="center"><form className="login-card form" onSubmit={submit}><span className="eyebrow">Owner onboarding</span><h1>Tell us about your restaurant.</h1><p>Submit your details for review. Once approved by an administrator, your account becomes a restaurant owner.</p><label>Restaurant name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label><label>Phone<input required value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></label><label>Owner email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label><label>Restaurant address<input required value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} /></label>{error && <div className="error">{error}</div>}{message && <div className="success">{message}</div>}<button className="button" disabled={loading || Boolean(message)}>{loading ? "Submitting..." : "Submit application"}</button></form></main>;
}
