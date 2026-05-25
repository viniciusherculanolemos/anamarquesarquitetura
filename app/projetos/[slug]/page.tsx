import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { Projeto } from "@/types";
import { ArrowLeft, MapPin, Calendar, Maximize2 } from "lucide-react";
import GalleryLightbox from "@/components/GalleryLightbox";

const PLACEHOLDER: Record<string, Projeto> = {
  "apartamento-contemporaneo": {
    id: "1", titulo: "Apartamento Contemporâneo", slug: "apartamento-contemporaneo",
    descricao: "Projeto residencial com foco em funcionalidade e elegância.",
    descricao_completa: "Um apartamento que une modernidade e acolhimento. O projeto explorou materiais naturais como madeira e pedra, combinados com tons neutros e iluminação estratégica para criar ambientes que convidam ao descanso e à convivência.\n\nCada detalhe foi pensado para otimizar o espaço disponível sem abrir mão do conforto. A integração entre sala, cozinha e varanda amplia visualmente o ambiente e favorece a circulação de luz natural.",
    categoria: "Residencial", area: "120m²", ano: 2024, localidade: "Rio de Janeiro, RJ",
    imagem_capa: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80",
    imagens: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
      "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800&q=80",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
    ],
    ordem: 0, destaque: true, publicado: true, created_at: "", updated_at: "",
  },
};

async function getProjeto(slug: string): Promise<Projeto | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("projetos")
      .select("*")
      .eq("slug", slug)
      .eq("publicado", true)
      .single();
    if (data) return data;
    return PLACEHOLDER[slug] ?? null;
  } catch {
    return PLACEHOLDER[slug] ?? null;
  }
}

export default async function ProjetoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const projeto = await getProjeto(slug);

  if (!projeto) notFound();

  const allImages = [
    ...(projeto.imagem_capa ? [projeto.imagem_capa] : []),
    ...(projeto.imagens ?? []),
  ];

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px]">
        <Image
          src={projeto.imagem_capa ?? "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80"}
          alt={projeto.titulo}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-dark/40" />
        <div className="absolute bottom-10 left-0 right-0 max-w-7xl mx-auto px-6">
          {projeto.categoria && (
            <span className="inline-block bg-taupe-dark text-white text-[10px] tracking-widest uppercase px-4 py-2 mb-4">
              {projeto.categoria}
            </span>
          )}
          <h1
            className="text-4xl md:text-6xl font-light text-white"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            {projeto.titulo}
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <Link
          href="/projetos"
          className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-taupe hover:text-taupe-dark transition-colors mb-12"
        >
          <ArrowLeft size={14} /> Voltar aos projetos
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Description */}
          <div className="lg:col-span-2">
            {projeto.descricao && (
              <p className="text-lg text-dark/70 leading-relaxed mb-6 italic"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}>
                {projeto.descricao}
              </p>
            )}
            {projeto.descricao_completa && (
              <div className="text-sm text-dark/60 leading-loose space-y-4">
                {projeto.descricao_completa.split("\n\n").map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <h3
              className="text-xs tracking-widest uppercase text-taupe border-b border-taupe-light/40 pb-3"
            >
              Detalhes do Projeto
            </h3>
            {projeto.localidade && (
              <div className="flex items-start gap-3">
                <MapPin size={15} className="text-taupe mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] tracking-wider uppercase text-taupe mb-1">Localidade</p>
                  <p className="text-sm text-dark">{projeto.localidade}</p>
                </div>
              </div>
            )}
            {projeto.ano && (
              <div className="flex items-start gap-3">
                <Calendar size={15} className="text-taupe mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] tracking-wider uppercase text-taupe mb-1">Ano</p>
                  <p className="text-sm text-dark">{projeto.ano}</p>
                </div>
              </div>
            )}
            {projeto.area && (
              <div className="flex items-start gap-3">
                <Maximize2 size={15} className="text-taupe mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] tracking-wider uppercase text-taupe mb-1">Área</p>
                  <p className="text-sm text-dark">{projeto.area}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Gallery */}
        {allImages.length > 1 && (
          <div className="mt-16">
            <h2
              className="text-2xl font-light text-dark mb-8"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              Galeria
            </h2>
            <GalleryLightbox
              images={allImages.slice(1)}
              projectTitle={projeto.titulo}
            />
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-beige py-16 text-center border-t border-taupe-light/30">
        <p className="text-[10px] tracking-[0.4em] uppercase text-taupe mb-3">Gostou do projeto?</p>
        <h2
          className="text-3xl font-light text-dark mb-6"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          Vamos criar o seu espaço juntos?
        </h2>
        <Link
          href="/contato"
          className="inline-block bg-taupe-dark hover:bg-brown text-white text-xs tracking-[0.3em] uppercase px-10 py-4 transition-colors duration-300"
        >
          Entre em contato
        </Link>
      </section>

      <Footer />
    </>
  );
}
