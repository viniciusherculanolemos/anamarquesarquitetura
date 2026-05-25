"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

function IconInstagram({ className }: { className?: string }) {
  return (
    <svg className={className} width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconPinterest({ className }: { className?: string }) {
  return (
    <svg className={className} width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
    </svg>
  );
}

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/projetos", label: "Projetos" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

interface NavbarProps {
  transparent?: boolean;
}

export default function Navbar({ transparent = false }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!transparent) return;
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [transparent]);

  const isLight = transparent && !scrolled;

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isLight
            ? "bg-transparent"
            : "bg-cream/95 backdrop-blur-sm border-b border-taupe-light/30 shadow-sm"
        )}
      >
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Social Icons */}
          <div className="flex items-center gap-4 w-32">
            <a
              href="https://www.instagram.com/arq.anapmarques/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className={cn(
                "transition-colors",
                isLight ? "text-white/80 hover:text-white" : "text-taupe hover:text-taupe-dark"
              )}
            >
              <IconInstagram />
            </a>
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Pinterest"
              className={cn(
                "transition-colors",
                isLight ? "text-white/80 hover:text-white" : "text-taupe hover:text-taupe-dark"
              )}
            >
              <IconPinterest />
            </a>
          </div>

          {/* Logo */}
          <Link href="/" className="flex flex-col items-center group">
            <div
              className={cn(
                "w-11 h-11 rounded-full border flex items-center justify-center mb-1 transition-colors",
                isLight
                  ? "border-white/70 group-hover:border-white"
                  : "border-taupe group-hover:border-taupe-dark"
              )}
            >
              <span
                className={cn(
                  "text-2xl italic font-light",
                  "font-[var(--font-cormorant)]",
                  isLight ? "text-white" : "text-dark"
                )}
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
              >
                A
              </span>
            </div>
            <span
              className={cn(
                "text-[11px] tracking-[0.3em] font-light uppercase transition-colors",
                isLight ? "text-white" : "text-dark"
              )}
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              Ana Marques
            </span>
            <span
              className={cn(
                "text-[9px] tracking-[0.4em] uppercase transition-colors",
                isLight ? "text-white/70" : "text-taupe"
              )}
            >
              Arquitetura
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 w-32 justify-end">
            {navLinks.slice(1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-[11px] tracking-widest uppercase transition-colors",
                  isLight
                    ? "text-white/80 hover:text-white"
                    : "text-dark/70 hover:text-dark"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
            className={cn(
              "md:hidden transition-colors",
              isLight ? "text-white" : "text-dark"
            )}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-dark/97 flex flex-col items-center justify-center gap-10">
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-6 right-6 text-white/70 hover:text-white"
            aria-label="Fechar menu"
          >
            <X size={26} />
          </button>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-white text-3xl tracking-widest uppercase font-light hover:text-taupe-light transition-colors"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
