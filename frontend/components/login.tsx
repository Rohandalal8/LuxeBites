"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { signInWithEmail, signInWithGoogle } from "@/lib/firebase";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await signInWithEmail(email, password);
      router.push("/");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to sign in.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      setError("");
      await signInWithGoogle();
      router.push("/");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Google sign-in failed.");
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="login-email" className="mb-2 block text-sm font-semibold text-[#4e493f]">Email address</label>
        <input
          id="login-email"
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
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="login-password" className="block text-sm font-semibold text-[#4e493f]">Password</label>
          <a href="#forgot-password" className="text-xs font-semibold text-[#d97732] hover:text-[#b85f23]">Forgot password?</a>
        </div>
        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          className="auth-input"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </div>

      {error ? <p className="text-sm text-[#b3261e]">{error}</p> : null}

      <button type="submit" className="auth-button" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign in"} <span aria-hidden="true">→</span>
      </button>
      <div className="flex items-center gap-4 py-1 text-xs text-[#a49b8f]"><span className="h-px flex-1 bg-[#e8e1d6]" />or continue with<span className="h-px flex-1 bg-[#e8e1d6]" /></div>
      <button type="button" onClick={handleGoogleLogin} className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#ded7cb] bg-white px-4 py-3 text-sm font-semibold text-[#4e493f] transition hover:border-[#bfb5a7] hover:bg-[#fcfaf6]">
        <span className="text-base font-bold text-[#4285f4]">G</span> Continue with Google
      </button>
    </form>
  );
}