import Link from "next/link";

export default function UnauthorizedPage() {
  return <main className="center"><div className="login-card"><span className="eyebrow">Access restricted</span><h1>Owner access required.</h1><p>This workspace is limited to active restaurant-owner accounts.</p><Link className="button" href="/login">Return to sign in</Link></div></main>;
}
