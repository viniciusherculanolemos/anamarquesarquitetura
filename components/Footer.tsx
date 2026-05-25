import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-dark text-white/70">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Logo + tagline */}
          <div className="flex flex-col items-start gap-4">
            <div className="flex flex-col items-start">
              <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center mb-2">
                <span
                  className="text-2xl italic font-light text-white"
                  style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                >
                  A
                </span>
              </div>
              <span
                className="text-sm tracking-[0.3em] text-white font-light uppercase"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
              >
                Ana Marques
              </span>
              <span className="text-[10px] tracking-[0.4em] text-white/50 uppercase">
                Arquitetura
              </span>
            </div>
            <p className="text-sm leading-relaxed text-white/50 max-w-xs">
              Transformo espaços com arquitetura acolhedora para viver bem.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4
              className="text-white text-xs tracking-widest uppercase mb-6"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              Navegação
            </h4>
            <ul className="flex flex-col gap-3">
              {[
                { href: "/", label: "Início" },
                { href: "/projetos", label: "Projetos" },
                { href: "/sobre", label: "Sobre" },
                { href: "/contato", label: "Contato" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-white/80 transition-colors tracking-wide"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4
              className="text-white text-xs tracking-widest uppercase mb-6"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              Contato
            </h4>
            <ul className="flex flex-col gap-3 text-sm text-white/50">
              <li>
                <a
                  href="https://wa.me/5521964883818"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white/80 transition-colors"
                >
                  (21) 96488-3818
                </a>
              </li>
              <li>
                <a
                  href="mailto:contato@anamarques.arq"
                  className="hover:text-white/80 transition-colors"
                >
                  contato@anamarques.arq
                </a>
              </li>
              <li>Rio de Janeiro — RJ</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/30">
          <p>© {new Date().getFullYear()} Ana Marques Arquitetura. Todos os direitos reservados.</p>
          <a
            href="https://www.instagram.com/arq.anapmarques/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/60 transition-colors"
          >
            @arq.anapmarques
          </a>
        </div>
      </div>
    </footer>
  );
}
