"use client";

import { useState } from "react";
import { Icons } from "./Icons";

export default function LoginView({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      onLogin();
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-sand-50 flex items-center justify-center p-6">
      <div className="w-full max-w-[400px] bg-white rounded-2xl shadow-xl shadow-kuriftu-900/5 border border-sand-200 overflow-hidden">
        <div className="p-8 pb-0 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-kuriftu-700 to-kuriftu-500 text-white font-bold text-2xl mb-6 shadow-lg shadow-kuriftu-700/20">
            K
          </div>
          <h1 className="text-2xl font-bold text-kuriftu-900 tracking-tight mb-2">
            Welcome to KuriftuAI
          </h1>
          <p className="text-sand-500 text-sm">
            Sign in to access your hospitality dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-sand-600 uppercase tracking-wider mb-1.5 ml-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@kuriftu.com"
              className="w-full px-4 py-3 rounded-xl border border-sand-200 bg-sand-50 text-kuriftu-900 text-sm outline-none focus:border-kuriftu-500 focus:ring-1 focus:ring-kuriftu-500 transition-all placeholder:text-sand-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-sand-600 uppercase tracking-wider mb-1.5 ml-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-sand-200 bg-sand-50 text-kuriftu-900 text-sm outline-none focus:border-kuriftu-500 focus:ring-1 focus:ring-kuriftu-500 transition-all placeholder:text-sand-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-kuriftu-700 hover:bg-kuriftu-800 text-white rounded-xl font-semibold text-sm transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-kuriftu-700/10 mt-2 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Sign In"
            )}
          </button>

          <div className="pt-2 text-center">
            <a href="#" className="text-xs text-kuriftu-600 hover:text-kuriftu-700 font-medium">
              Forgot your password?
            </a>
          </div>

          <div className="relative py-2 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-sand-200"></div>
            </div>
            <span className="relative px-4 bg-white text-[10px] font-bold text-sand-400 uppercase tracking-widest">
              Or
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              setEmail("demo@kuriftu.com");
              setPassword("••••••••");
              setLoading(true);
              setTimeout(() => {
                onLogin();
                setLoading(false);
              }, 800);
            }}
            className="w-full py-3 border border-kuriftu-200 bg-white hover:bg-kuriftu-50 text-kuriftu-700 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
          >
            <span className="text-kuriftu-500">
              {Icons.sparkle}
            </span>
            Try Demo Login
          </button>
        </form>

        <div className="p-4 bg-sand-50 border-t border-sand-100 text-center">
          <p className="text-[11px] text-sand-400">
            Powered by Kuriftu Intelligent Systems © 2026
          </p>
        </div>
      </div>
    </div>
  );
}
