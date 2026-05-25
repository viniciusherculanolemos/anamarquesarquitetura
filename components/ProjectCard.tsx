import Link from "next/link";
import Image from "next/image";
import { Projeto } from "@/types";

interface ProjectCardProps {
  projeto: Projeto;
}

export default function ProjectCard({ projeto }: ProjectCardProps) {
  const imgSrc =
    projeto.imagem_capa ||
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80";

  return (
    <Link
      href={`/projetos/${projeto.slug}`}
      className="group block overflow-hidden bg-beige"
    >
      <div className="relative overflow-hidden aspect-[4/3]">
        <Image
          src={imgSrc}
          alt={projeto.titulo}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/20 transition-colors duration-500" />
        {projeto.categoria && (
          <div className="absolute top-4 left-4 bg-cream/90 backdrop-blur-sm px-3 py-1">
            <span className="text-[10px] tracking-widest uppercase text-taupe-dark">
              {projeto.categoria}
            </span>
          </div>
        )}
      </div>
      <div className="px-5 py-4 border border-t-0 border-taupe-light/30">
        <h3
          className="text-xl font-light text-dark group-hover:text-taupe-dark transition-colors"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          {projeto.titulo}
        </h3>
        <div className="flex items-center gap-4 mt-1">
          {projeto.localidade && (
            <span className="text-xs text-taupe tracking-wide">{projeto.localidade}</span>
          )}
          {projeto.ano && (
            <span className="text-xs text-taupe/60">{projeto.ano}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
