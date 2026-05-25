import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import TestimonialForm from "@/components/TestimonialForm";
import ContactForm from "@/components/ContactForm";
import { createClient } from "@/lib/supabase/server";
import { Projeto, Depoimento, Servico, SobreMim } from "@/types";
import { getIcon } from "@/lib/icons";
import anaImg from "@/img/anamarques.png";

const DEFAULT_SERVICOS: Servico[] = [
  { id: "1", icone: "Home", titulo: "Projetos Residenciais", descricao: null, ordem: 0, ativo: true, created_at: "" },
  { id: "2", icone: "Building2", titulo: "Projetos Comerciais", descricao: null, ordem: 1, ativo: true, created_at: "" },
  { id: "3", icone: "Sofa", titulo: "Interiores", descricao: null, ordem: 2, ativo: true, created_at: "" },
  { id: "4", icone: "MessageCircle", titulo: "Consultoria Online", descricao: null, ordem: 3, ativo: true, created_at: "" },
  { id: "5", icone: "HardHat", titulo: "Acompanhamento de Obra", descricao: null, ordem: 4, ativo: true, created_at: "" },
];

async function getServicos(): Promise<Servico[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("servicos")
      .select("*")
      .eq("ativo", true)
      .order("ordem", { ascending: true });
    return data && data.length > 0 ? data : DEFAULT_SERVICOS;
  } catch {
    return DEFAULT_SERVICOS;
  }
}

async function getDepoimentos(): Promise<Depoimento[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("depoimentos")
      .select("*")
      .eq("publicado", true)
      .order("ordem", { ascending: true });
    return data ?? [];
  } catch {
    return [];
  }
}

async function getSobre(): Promise<SobreMim | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("sobre").select("*").single();
    return data ?? null;
  } catch {
    return null;
  }
}

async function getFeaturedProjects(): Promise<Projeto[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("projetos")
      .select("*")
      .eq("publicado", true)
      .eq("destaque", true)
      .order("ordem", { ascending: true })
      .limit(3);
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [projetos, depoimentos, servicos, sobre] = await Promise.all([
    getFeaturedProjects(),
    getDepoimentos(),
    getServicos(),
    getSobre(),
  ]);

  return (
    <>
      <Navbar transparent />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0">
          <Image
            src={sobre?.foto_hero ?? "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80"}
            alt="Projeto de arquitetura"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-dark/50" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16">
          <div className="max-w-xl">
            <p className="text-white/60 text-xs tracking-[0.4em] uppercase mb-6">
              Arquitetura Acolhedora para Viver Bem
            </p>
            <h1
              className="text-5xl md:text-6xl lg:text-7xl text-white font-light leading-tight mb-8"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              Projetos que transformam espaços em experiências.
            </h1>
            <Link
              href="/projetos"
              className="inline-block bg-taupe-dark hover:bg-brown text-white text-xs tracking-[0.3em] uppercase px-8 py-4 transition-colors duration-300"
            >
              Conheça meu trabalho
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-beige py-12 border-y border-taupe-light/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-3 md:grid-cols-5 gap-6">
            {servicos.map((s) => (
              <div key={s.id} className="flex flex-col items-center gap-3 text-center group cursor-default">
                {React.createElement(getIcon(s.icone), {
                  size: 28,
                  strokeWidth: 1.2,
                  className: "text-taupe group-hover:text-taupe-dark transition-colors",
                })}
                <span className="text-[10px] tracking-widest uppercase text-taupe leading-relaxed">
                  {s.titulo}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {projetos.length > 0 && (
        <section className="py-20 max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-[10px] tracking-[0.4em] uppercase text-taupe mb-2">Portfólio</p>
            <h2
              className="text-4xl font-light text-dark"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              Projetos em Destaque
            </h2>
            <div className="w-12 h-px bg-taupe mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projetos.map((projeto) => (
              <ProjectCard key={projeto.id} projeto={projeto} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/projetos"
              className="inline-block border border-taupe-dark text-taupe-dark hover:bg-taupe-dark hover:text-white text-xs tracking-[0.3em] uppercase px-10 py-4 transition-colors duration-300"
            >
              Ver todos os projetos
            </Link>
          </div>
        </section>
      )}

      {/* About Preview */}
      <section className="bg-beige py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image
              src={sobre?.foto ?? anaImg}
              alt="Ana Marques Arquiteta"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-[10px] tracking-[0.4em] uppercase text-taupe mb-3">Sobre Mim</p>
            <h2
              className="text-4xl font-light text-dark mb-6 leading-tight"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              {sobre?.subtitulo ?? "Arquiteta apaixonada por criar espaços que acolhem."}
            </h2>
            <p className="text-sm text-dark/60 leading-relaxed mb-8">
              {sobre?.texto
                ? sobre.texto.split("\n\n")[0]
                : "Formada em Arquitetura e Urbanismo, atuo desenvolvendo projetos residenciais e comerciais com foco em funcionalidade, estética e bem-estar. Cada projeto é uma nova oportunidade de transformar sonhos em realidade."}
            </p>

            <div className="grid grid-cols-3 gap-6 mb-10">
              {[
                { value: `${sobre?.projetos_entregues ?? 25}+`, label: "Projetos\nEntregues" },
                { value: `${sobre?.anos_experiencia ?? 5}+`, label: "Anos de\nAtuação" },
                { value: "100%", label: "Compromisso\ncom você" },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div
                    className="text-3xl font-light text-taupe-dark mb-1"
                    style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                  >
                    {value}
                  </div>
                  <div className="text-[10px] tracking-wider uppercase text-taupe/70 whitespace-pre-line leading-relaxed">
                    {label}
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/sobre"
              className="inline-block border border-taupe-dark text-taupe-dark hover:bg-taupe-dark hover:text-white text-xs tracking-[0.3em] uppercase px-8 py-3 transition-colors duration-300"
            >
              Saiba mais
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-[10px] tracking-[0.4em] uppercase text-taupe mb-2">Clientes</p>
          <h2
            className="text-4xl font-light text-dark"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            O que dizem sobre meu trabalho
          </h2>
          <div className="w-12 h-px bg-taupe mx-auto mt-4" />
        </div>

        {depoimentos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {depoimentos.map((dep) => (
              <div key={dep.id} className="bg-beige border border-taupe-light/20 p-8 flex flex-col gap-5">
                <span
                  className="text-5xl font-light text-taupe-light leading-none select-none"
                  style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                  aria-hidden="true"
                >
                  &ldquo;
                </span>
                <p
                  className="text-base font-light text-dark/70 leading-relaxed italic flex-1 -mt-4"
                  style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                >
                  {dep.texto}
                </p>

                {dep.imagens && dep.imagens.length > 0 && (
                  <div className="flex gap-2">
                    {dep.imagens.slice(0, 3).map((img, i) => (
                      <div key={i} className="relative w-16 h-12 overflow-hidden">
                        <Image src={img} alt="" fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-t border-taupe-light/30 pt-4 flex items-center gap-3">
                  {dep.foto_perfil ? (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                      <Image src={dep.foto_perfil} alt={dep.nome} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-taupe-light/20 flex items-center justify-center shrink-0">
                      <span className="text-sm font-medium text-taupe">{dep.nome.charAt(0)}</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-dark">{dep.nome}</p>
                    {dep.cargo && <p className="text-xs text-taupe mt-0.5">{dep.cargo}</p>}
                  </div>
                  {dep.link_projeto && (
                    <a
                      href={dep.link_projeto}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 inline-flex items-center gap-1.5 border border-taupe-light/40 hover:border-taupe text-taupe hover:text-taupe-dark text-[10px] tracking-wider uppercase px-3 py-1.5 transition-colors"
                      title="Ver projeto"
                    >
                      Ver projeto
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <TestimonialForm />
      </section>

      {/* Contact Form */}
      <section className="bg-beige py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-[10px] tracking-[0.4em] uppercase text-taupe mb-2">Fale Comigo</p>
            <h2
              className="text-4xl font-light text-dark"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              Vamos conversar sobre seu projeto?
            </h2>
            <div className="w-12 h-px bg-taupe mx-auto mt-4" />
          </div>
          <ContactForm />
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-dark py-14 text-center">
        <p
          className="text-2xl md:text-3xl font-light text-white/90 italic"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          Transformo espaços com arquitetura acolhedora
        </p>
        {sobre?.whatsapp ? (
          <a
            href={`https://wa.me/${sobre.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 bg-taupe-dark hover:bg-brown text-white text-xs tracking-[0.3em] uppercase px-10 py-4 transition-colors duration-300"
          >
            Entre em contato
          </a>
        ) : (
          <Link
            href="/contato"
            className="inline-block mt-6 bg-taupe-dark hover:bg-brown text-white text-xs tracking-[0.3em] uppercase px-10 py-4 transition-colors duration-300"
          >
            Entre em contato
          </Link>
        )}
      </section>

      <Footer />
    </>
  );
}
