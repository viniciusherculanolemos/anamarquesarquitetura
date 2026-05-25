import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { SobreMim, Servico } from "@/types";
import { getIcon } from "@/lib/icons";
import anaImg from "@/img/anamarques.png";

const DEFAULT_SOBRE: SobreMim = {
  id: "1",
  titulo: "Sobre Mim",
  subtitulo: "Arquiteta apaixonada por criar espaços que acolhem, inspiram e transformam a rotina das pessoas.",
  texto: "Formada em Arquitetura e Urbanismo, atuo há mais de 5 anos desenvolvendo projetos residenciais e comerciais com foco em funcionalidade, estética e bem-estar.\n\nAcredito que um bom projeto vai além da estética — ele deve refletir a personalidade de quem vive naquele espaço. Por isso, cada projeto começa com uma escuta atenta das necessidades, desejos e rotina do cliente.\n\nMinha abordagem une técnica, criatividade e sensibilidade para criar ambientes que tenham significado e que gerem bem-estar no dia a dia.",
  foto: null,
  foto_hero: null,
  whatsapp: null,
  anos_experiencia: 5,
  projetos_entregues: 25,
  updated_at: "",
};

const DEFAULT_SERVICOS: Servico[] = [
  { id: "1", icone: "Home", titulo: "Projetos Residenciais", descricao: "Criação de ambientes que refletem a personalidade e o estilo de vida dos moradores, do conceito à entrega.", ordem: 0, ativo: true, created_at: "" },
  { id: "2", icone: "Building2", titulo: "Projetos Comerciais", descricao: "Espaços corporativos e comerciais planejados para potencializar resultados e criar experiências únicas.", ordem: 1, ativo: true, created_at: "" },
  { id: "3", icone: "Sofa", titulo: "Interiores", descricao: "Desenvolvimento completo de interiores com seleção de materiais, móveis, iluminação e acabamentos.", ordem: 2, ativo: true, created_at: "" },
  { id: "4", icone: "MessageCircle", titulo: "Consultoria Online", descricao: "Orientação especializada à distância para decisões de projeto, decoração e reformas.", ordem: 3, ativo: true, created_at: "" },
  { id: "5", icone: "HardHat", titulo: "Acompanhamento de Obra", descricao: "Supervisão técnica durante a execução para garantir fidelidade ao projeto e qualidade na entrega.", ordem: 4, ativo: true, created_at: "" },
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

async function getSobre(): Promise<SobreMim> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("sobre").select("*").single();
    return data ?? DEFAULT_SOBRE;
  } catch {
    return DEFAULT_SOBRE;
  }
}

export default async function SobrePage() {
  const [sobre, servicos] = await Promise.all([getSobre(), getServicos()]);

  return (
    <>
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-16 bg-beige border-b border-taupe-light/30 text-center">
        <p className="text-[10px] tracking-[0.4em] uppercase text-taupe mb-3">Conheça</p>
        <h1
          className="text-5xl font-light text-dark"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          {sobre.titulo ?? "Sobre Mim"}
        </h1>
        <div className="w-12 h-px bg-taupe mx-auto mt-4" />
      </section>

      {/* Bio */}
      <section className="py-20 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={sobre.foto ?? anaImg}
            alt="Ana Marques Arquiteta"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div>
          {sobre.subtitulo && (
            <p
              className="text-2xl font-light italic text-taupe-dark mb-8 leading-relaxed"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              &ldquo;{sobre.subtitulo}&rdquo;
            </p>
          )}
          {sobre.texto && (
            <div className="space-y-4">
              {sobre.texto.split("\n\n").map((p, i) => (
                <p key={i} className="text-sm text-dark/60 leading-loose">
                  {p}
                </p>
              ))}
            </div>
          )}

          <div className="grid grid-cols-3 gap-6 mt-10 mb-10 pt-10 border-t border-taupe-light/40">
            {[
              { value: `${sobre.projetos_entregues ?? 25}+`, label: "Projetos\nEntregues" },
              { value: `${sobre.anos_experiencia ?? 5}+`, label: "Anos de\nAtuação" },
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
            href="/contato"
            className="inline-block bg-taupe-dark hover:bg-brown text-white text-xs tracking-[0.3em] uppercase px-8 py-4 transition-colors duration-300"
          >
            Vamos conversar
          </Link>
        </div>
      </section>

      {/* Services */}
      <section className="bg-beige py-20 border-t border-taupe-light/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-[10px] tracking-[0.4em] uppercase text-taupe mb-2">O que ofereço</p>
            <h2
              className="text-4xl font-light text-dark"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              Serviços
            </h2>
            <div className="w-12 h-px bg-taupe mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicos.map((s) => (
              <div key={s.id} className="bg-cream p-8 border border-taupe-light/20 hover:border-taupe/40 transition-colors">
                {React.createElement(getIcon(s.icone), { size: 28, strokeWidth: 1.2, className: "text-taupe mb-5" })}
                <h3
                  className="text-xl font-light text-dark mb-3"
                  style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                >
                  {s.titulo}
                </h3>
                <p className="text-sm text-dark/50 leading-relaxed">{s.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
