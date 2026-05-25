import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nome, cargo, texto, foto_perfil, imagens, link_projeto } = body;

    if (!nome?.trim() || !texto?.trim()) {
      return NextResponse.json({ error: "Nome e depoimento são obrigatórios" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("depoimentos")
      .insert({
        nome: nome.trim(),
        cargo: cargo?.trim() || null,
        texto: texto.trim(),
        foto_perfil: foto_perfil || null,
        imagens: imagens ?? [],
        link_projeto: link_projeto?.trim() || null,
        publicado: false,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao enviar depoimento" }, { status: 500 });
  }
}
