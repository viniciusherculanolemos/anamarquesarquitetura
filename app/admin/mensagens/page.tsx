import { createClient } from "@/lib/supabase/server";
import { Mensagem } from "@/types";
import MensagemList from "@/components/admin/MensagemList";

async function getMensagens(): Promise<Mensagem[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("mensagens")
      .select("*")
      .order("created_at", { ascending: false });
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function MensagensPage() {
  const mensagens = await getMensagens();
  const naoLidas = mensagens.filter((m) => !m.lida).length;

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-stone-800">Mensagens</h1>
        <p className="text-sm text-stone-400 mt-1">
          {mensagens.length} mensagem{mensagens.length !== 1 ? "s" : ""}
          {naoLidas > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {naoLidas} não lida{naoLidas !== 1 ? "s" : ""}
            </span>
          )}
          <span className="ml-2 text-stone-300">· Clique para ver detalhes</span>
        </p>
      </div>

      <MensagemList initialMensagens={mensagens} />
    </div>
  );
}
