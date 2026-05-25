import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const { items }: { items: { id: string; ordem: number }[] } = await request.json();

    const updates = items.map(({ id, ordem }) =>
      supabase
        .from("projetos")
        .update({ ordem, updated_at: new Date().toISOString() })
        .eq("id", id)
    );

    await Promise.all(updates);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao reordenar projetos" }, { status: 500 });
  }
}
