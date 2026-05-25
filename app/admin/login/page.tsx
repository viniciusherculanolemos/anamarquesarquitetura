"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("E-mail ou senha incorretos.");
      setLoading(false);
      return;
    }

    router.push("/admin/projetos");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-beige flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 rounded-full border border-taupe flex items-center justify-center mb-3">
            <span
              className="text-3xl italic font-light text-dark"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              A
            </span>
          </div>
          <h1
            className="text-lg tracking-[0.3em] text-dark font-light uppercase"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            Ana Marques
          </h1>
          <p className="text-[10px] tracking-widest text-taupe uppercase">Área administrativa</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail"
              required
              className="w-full bg-white border border-taupe-light/50 px-4 py-3 text-sm text-dark placeholder:text-taupe/40 focus:outline-none focus:border-taupe transition-colors"
            />
          </div>

          <div className="relative">
            <input
              type={showPwd ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              required
              className="w-full bg-white border border-taupe-light/50 px-4 py-3 pr-12 text-sm text-dark placeholder:text-taupe/40 focus:outline-none focus:border-taupe transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-taupe/50 hover:text-taupe transition-colors"
            >
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && (
            <p className="text-xs text-red-500 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-dark hover:bg-taupe-dark disabled:opacity-60 text-white text-xs tracking-[0.3em] uppercase py-4 transition-colors duration-300"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
