export default function Register() {
    return (
        <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
                <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
                    Register
                </h1>
                <div className="w-full max-w-xs mt-6">
                    <form className="flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="Username"
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Register
                        </button>
                    </form>
                </div>
            </main>
        </div>
    )
}
