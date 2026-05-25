"use client";

import { useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import { Projeto } from "@/types";

const CATEGORIAS = ["Todos", "Residencial", "Comercial", "Interiores"];

export default function ProjectsGrid({ projetos }: { projetos: Projeto[] }) {
  const [filtro, setFiltro] = useState("Todos");

  const filtrados =
    filtro === "Todos"
      ? projetos
      : projetos.filter(
          (p) => p.categoria?.toLowerCase() === filtro.toLowerCase()
        );

  return (
    <>
      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-6 mt-10 flex justify-center gap-2 flex-wrap">
        {CATEGORIAS.map((cat) => (
          <button
            key={cat}
            onClick={() => setFiltro(cat)}
            className={`px-5 py-2 text-[10px] tracking-widest uppercase border transition-colors ${
              filtro === cat
                ? "bg-taupe-dark text-white border-taupe-dark"
                : "border-taupe-light/50 text-taupe hover:border-taupe-dark hover:text-taupe-dark"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        {filtrados.length === 0 ? (
          <p className="text-center text-taupe py-20">
            Nenhum projeto encontrado nesta categoria.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtrados.map((projeto) => (
              <ProjectCard key={projeto.id} projeto={projeto} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
