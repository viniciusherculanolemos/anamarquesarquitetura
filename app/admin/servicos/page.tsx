import { createClient } from "@/lib/supabase/server";
import SortableServicoList from "@/components/admin/SortableServicoList";
import { Servico } from "@/types";

async function getServicos(): Promise<Servico[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("servicos")
      .select("*")
      .order("ordem", { ascending: true });
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function AdminServicosPage() {
  const servicos = await getServicos();
  const ativos = servicos.filter((s) => s.ativo).length;

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-stone-800">Serviços</h1>
        <p className="text-sm text-stone-400 mt-1">
          {servicos.length} serviço{servicos.length !== 1 ? "s" : ""}
          {" · "}
          <span className="text-green-500">{ativos} ativo{ativos !== 1 ? "s" : ""}</span>
          {" · Arraste para reordenar"}
        </p>
      </div>

      <SortableServicoList initialServicos={servicos} />
    </div>
  );
}
