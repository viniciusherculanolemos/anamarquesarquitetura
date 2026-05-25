"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FolderOpen, MessageSquare, LogOut, User, ExternalLink, Quote, LayoutList } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin/projetos", label: "Projetos", icon: FolderOpen },
  { href: "/admin/mensagens", label: "Mensagens", icon: MessageSquare },
  { href: "/admin/depoimentos", label: "Depoimentos", icon: Quote },
  { href: "/admin/servicos", label: "Serviços", icon: LayoutList },
  { href: "/admin/sobre", label: "Sobre / Perfil", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="w-64 min-h-screen bg-dark flex flex-col">
      {/* Logo */}
      <div className="px-6 py-8 border-b border-white/10">
        <div className="flex flex-col items-start">
          <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center mb-2">
            <span
              className="text-xl italic font-light text-white"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              A
            </span>
          </div>
          <span
            className="text-[11px] tracking-[0.3em] text-white font-light uppercase"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            Ana Marques
          </span>
          <span className="text-[9px] tracking-[0.4em] text-white/40 uppercase">
            Admin
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 text-sm transition-colors rounded-sm",
              pathname.startsWith(href)
                ? "bg-taupe-dark/30 text-white"
                : "text-white/50 hover:text-white hover:bg-white/5"
            )}
          >
            <Icon size={16} strokeWidth={1.5} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-4 py-6 border-t border-white/10 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-white/40 hover:text-white/70 transition-colors"
        >
          <ExternalLink size={16} strokeWidth={1.5} />
          Ver site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-white/40 hover:text-red-400 transition-colors"
        >
          <LogOut size={16} strokeWidth={1.5} />
          Sair
        </button>
      </div>
    </aside>
  );
}
