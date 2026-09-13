'use client';

import { useState } from "react";
import Login from "@/components/login";
import Register from "@/components/register";

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    return (
        <div>
            {isLogin ? <Login /> : <Register />}
            <span className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
            </span>
            <button
                onClick={() => setIsLogin(!isLogin)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
                {isLogin ? "Register" : "Login"}
            </button>
        </div>
    )
}