import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectsGrid from "@/components/ProjectsGrid";
import { createClient } from "@/lib/supabase/server";
import { Projeto } from "@/types";

const PLACEHOLDER_PROJECTS: Projeto[] = [
  {
    id: "1", titulo: "Apartamento Contemporâneo", slug: "apartamento-contemporaneo",
    descricao: "Projeto residencial com foco em funcionalidade e elegância.", descricao_completa: null,
    categoria: "Residencial", area: "120m²", ano: 2024, localidade: "Rio de Janeiro, RJ",
    imagem_capa: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
    imagens: [], ordem: 0, destaque: true, publicado: true, created_at: "", updated_at: "",
  },
  {
    id: "2", titulo: "Cozinha Integrada", slug: "cozinha-integrada",
    descricao: "Integração total entre cozinha e sala de jantar.", descricao_completa: null,
    categoria: "Interiores", area: "45m²", ano: 2023, localidade: "Niterói, RJ",
    imagem_capa: "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800&q=80",
    imagens: [], ordem: 1, destaque: false, publicado: true, created_at: "", updated_at: "",
  },
  {
    id: "3", titulo: "Sala de Estar Minimalista", slug: "sala-de-estar-minimalista",
    descricao: "Design minimalista com materiais naturais e iluminação planejada.", descricao_completa: null,
    categoria: "Residencial", area: "60m²", ano: 2023, localidade: "Rio de Janeiro, RJ",
    imagem_capa: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
    imagens: [], ordem: 2, destaque: true, publicado: true, created_at: "", updated_at: "",
  },
  {
    id: "4", titulo: "Escritório Moderno", slug: "escritorio-moderno",
    descricao: "Ambiente corporativo com identidade visual forte.", descricao_completa: null,
    categoria: "Comercial", area: "200m²", ano: 2024, localidade: "Rio de Janeiro, RJ",
    imagem_capa: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    imagens: [], ordem: 3, destaque: false, publicado: true, created_at: "", updated_at: "",
  },
  {
    id: "5", titulo: "Suite Master", slug: "suite-master",
    descricao: "Suíte principal com closet integrado e banheiro spa.", descricao_completa: null,
    categoria: "Interiores", area: "35m²", ano: 2022, localidade: "Niterói, RJ",
    imagem_capa: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
    imagens: [], ordem: 4, destaque: false, publicado: true, created_at: "", updated_at: "",
  },
  {
    id: "6", titulo: "Casa em Condomínio", slug: "casa-condominio",
    descricao: "Projeto completo com integração indoor/outdoor.", descricao_completa: null,
    categoria: "Residencial", area: "350m²", ano: 2022, localidade: "Angra dos Reis, RJ",
    imagem_capa: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    imagens: [], ordem: 5, destaque: true, publicado: true, created_at: "", updated_at: "",
  },
];

async function getProjects(): Promise<Projeto[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("projetos")
      .select("*")
      .eq("publicado", true)
      .order("ordem", { ascending: true });
    return data && data.length > 0 ? data : PLACEHOLDER_PROJECTS;
  } catch {
    return PLACEHOLDER_PROJECTS;
  }
}

export default async function ProjetosPage() {
  const projetos = await getProjects();

  return (
    <>
      <Navbar />

      {/* Page Header */}
      <section className="pt-32 pb-16 bg-beige border-b border-taupe-light/30">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[10px] tracking-[0.4em] uppercase text-taupe mb-3">Portfólio</p>
          <h1
            className="text-5xl font-light text-dark"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            Projetos
          </h1>
          <div className="w-12 h-px bg-taupe mx-auto mt-4" />
        </div>
      </section>

      <ProjectsGrid projetos={projetos} />

      <Footer />
    </>
  );
}
