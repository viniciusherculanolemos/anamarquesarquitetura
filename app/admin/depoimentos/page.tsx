import { createClient } from "@/lib/supabase/server";
import SortableDepoimentoList from "@/components/admin/SortableDepoimentoList";
import { Depoimento } from "@/types";

async function getDepoimentos(): Promise<Depoimento[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("depoimentos")
      .select("*")
      .order("ordem", { ascending: true });
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function AdminDepoimentosPage() {
  const depoimentos = await getDepoimentos();
  const publicados = depoimentos.filter((d) => d.publicado).length;

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-stone-800">Depoimentos</h1>
        <p className="text-sm text-stone-400 mt-1">
          {depoimentos.length} depoimento{depoimentos.length !== 1 ? "s" : ""}
          {" · "}
          <span className="text-green-500">{publicados} publicado{publicados !== 1 ? "s" : ""}</span>
          {" · Arraste para reordenar"}
        </p>
      </div>

      <SortableDepoimentoList initialDepoimentos={depoimentos} />
    </div>
  );
}
