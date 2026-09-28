export default function Login() {
    return (
        <form className="space-y-5">
            <div>
                <label htmlFor="login-email" className="mb-2 block text-sm font-semibold text-[#4e493f]">Email address</label>
                <input id="login-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" className="auth-input" />
            </div>
            <div>
                <div className="mb-2 flex items-center justify-between">
                    <label htmlFor="login-password" className="block text-sm font-semibold text-[#4e493f]">Password</label>
                    <a href="#forgot-password" className="text-xs font-semibold text-[#d97732] hover:text-[#b85f23]">Forgot password?</a>
                </div>
                <input id="login-password" name="password" type="password" autoComplete="current-password" placeholder="Enter your password" className="auth-input" />
            </div>
            <button type="submit" className="auth-button">Sign in <span aria-hidden="true">→</span></button>
            <div className="flex items-center gap-4 py-1 text-xs text-[#a49b8f]"><span className="h-px flex-1 bg-[#e8e1d6]" />or continue with<span className="h-px flex-1 bg-[#e8e1d6]" /></div>
            <button type="button" className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#ded7cb] bg-white px-4 py-3 text-sm font-semibold text-[#4e493f] transition hover:border-[#bfb5a7] hover:bg-[#fcfaf6]"><span className="text-base font-bold text-[#4285f4]">G</span> Continue with Google</button>
        </form>
    )
}