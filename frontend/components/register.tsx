export default function Register() {
    return (
        <form className="space-y-5">
            <div>
                <label htmlFor="register-name" className="mb-2 block text-sm font-semibold text-[#4e493f]">Your name</label>
                <input id="register-name" name="name" type="text" autoComplete="name" placeholder="Alex Morgan" className="auth-input" />
            </div>
            <div>
                <label htmlFor="register-email" className="mb-2 block text-sm font-semibold text-[#4e493f]">Email address</label>
                <input id="register-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" className="auth-input" />
            </div>
            <div>
                <label htmlFor="register-password" className="mb-2 block text-sm font-semibold text-[#4e493f]">Create a password</label>
                <input id="register-password" name="password" type="password" autoComplete="new-password" placeholder="At least 8 characters" className="auth-input" />
            </div>
            <button type="submit" className="auth-button">Create account <span aria-hidden="true">→</span></button>
        </form>
    )
}
