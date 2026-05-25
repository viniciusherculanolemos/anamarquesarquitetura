import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import SortableProjectList from "@/components/admin/SortableProjectList";
import { Projeto } from "@/types";

async function getProjects(): Promise<Projeto[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("projetos")
      .select("*")
      .order("ordem", { ascending: true });
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function AdminProjetosPage() {
  const projetos = await getProjects();

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-stone-800">Projetos</h1>
          <p className="text-sm text-stone-400 mt-1">
            Arraste para reordenar · {projetos.length} projeto{projetos.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/projetos/novo"
          className="inline-flex items-center gap-2 bg-dark hover:bg-taupe-dark text-white text-xs tracking-wider uppercase px-5 py-3 transition-colors"
        >
          <Plus size={15} /> Novo projeto
        </Link>
      </div>

      <SortableProjectList initialProjects={projetos} />
    </div>
  );
}
