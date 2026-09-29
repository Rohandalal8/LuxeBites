"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { signUpWithEmail } from "@/lib/firebase";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const userCredential = await signUpWithEmail(email, password);
      const token = await userCredential.user.getIdToken();

      await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api"}/auth/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          email,
          avatar: userCredential.user.photoURL,
        }),
      });

      router.push("/");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to create account.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="register-name" className="mb-2 block text-sm font-semibold text-[#4e493f]">Your name</label>
        <input
          id="register-name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Alex Morgan"
          className="auth-input"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="register-email" className="mb-2 block text-sm font-semibold text-[#4e493f]">Email address</label>
        <input
          id="register-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="auth-input"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="register-password" className="mb-2 block text-sm font-semibold text-[#4e493f]">Create a password</label>
        <input
          id="register-password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          className="auth-input"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={6}
        />
      </div>

      {error ? <p className="text-sm text-[#b3261e]">{error}</p> : null}

      <button type="submit" className="auth-button" disabled={isSubmitting}>
        {isSubmitting ? "Creating account..." : "Create account"} <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
