import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("depoimentos")
      .select("*")
      .order("ordem", { ascending: true });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao buscar depoimentos" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const body = await request.json();

    const { data: last } = await supabase
      .from("depoimentos")
      .select("ordem")
      .order("ordem", { ascending: false })
      .limit(1)
      .single();

    const ordem = last ? (last.ordem ?? 0) + 1 : 0;

    const { data, error } = await supabase
      .from("depoimentos")
      .insert({ ...body, ordem })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao criar depoimento" }, { status: 500 });
  }
}
