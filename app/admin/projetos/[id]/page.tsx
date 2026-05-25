import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProjectForm from "@/components/admin/ProjectForm";
import { createClient } from "@/lib/supabase/server";

async function getProjeto(id: string) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("projetos")
      .select("*")
      .eq("id", id)
      .single();
    return data;
  } catch {
    return null;
  }
}

export default async function EditarProjeto({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const projeto = await getProjeto(id);
  if (!projeto) notFound();

  return (
    <div className="p-8">
      <Link
        href="/admin/projetos"
        className="inline-flex items-center gap-2 text-xs tracking-wider uppercase text-stone-400 hover:text-stone-600 transition-colors mb-6"
      >
        <ArrowLeft size={14} /> Voltar
      </Link>
      <h1 className="text-2xl font-semibold text-stone-800 mb-8">
        Editar: {projeto.titulo}
      </h1>
      <ProjectForm projeto={projeto} />
    </div>
  );
}
