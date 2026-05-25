"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, Loader2, CheckCircle, X, MessageSquarePlus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const inputClass =
  "w-full border border-taupe-light/40 bg-white px-4 py-3 text-sm text-dark placeholder:text-stone-300 focus:outline-none focus:border-taupe transition-colors";

async function uploadDepoimentoFile(file: File): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split(".").pop();
  const fileName = `pub-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  await supabase.storage.from("depoimentos").upload(fileName, file, { cacheControl: "3600" });
  const { data } = supabase.storage.from("depoimentos").getPublicUrl(fileName);
  return data.publicUrl;
}

export default function TestimonialForm() {
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState("");
  const [texto, setTexto] = useState("");
  const [linkProjeto, setLinkProjeto] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);
  const [imagens, setImagens] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadDepoimentoFile(file);
      setFotoPerfil(url);
    } catch {
      setError("Erro ao enviar foto. Tente novamente.");
    } finally {
      setUploading(false);
    }
  }

  async function handleImagensUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = await Promise.all(files.map(uploadDepoimentoFile));
      setImagens((prev) => [...prev, ...urls]);
    } catch {
      setError("Erro ao enviar imagens. Tente novamente.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim() || !texto.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/depoimentos/publico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, cargo: cargo || null, texto, foto_perfil: fotoPerfil, imagens, link_projeto: linkProjeto || null }),
      });
      if (!res.ok) throw new Error();
      setSuccess(true);
    } catch {
      setError("Não foi possível enviar seu depoimento. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) {
    return (
      <div className="text-center mt-12">
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 border border-taupe-light text-taupe hover:bg-beige text-xs tracking-[0.2em] uppercase px-8 py-4 transition-colors"
        >
          <MessageSquarePlus size={15} />
          Compartilhar minha experiência
        </button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="mt-12 max-w-xl mx-auto text-center py-12 px-8 bg-beige border border-taupe-light/20">
        <CheckCircle size={32} className="text-taupe mx-auto mb-4" />
        <p className="font-light text-dark text-lg mb-2" style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}>
          Obrigada pelo seu depoimento!
        </p>
        <p className="text-sm text-stone-500">
          Sua mensagem foi recebida e será publicada após revisão.
        </p>
        <button
          onClick={() => { setSuccess(false); setOpen(false); setNome(""); setCargo(""); setTexto(""); setLinkProjeto(""); setFotoPerfil(null); setImagens([]); }}
          className="mt-6 text-xs text-taupe hover:text-dark transition-colors tracking-wider uppercase"
        >
          Fechar
        </button>
      </div>
    );
  }

  return (
    <div className="mt-12 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[10px] tracking-[0.4em] uppercase text-taupe mb-1">Sua vez</p>
          <h3
            className="text-2xl font-light text-dark"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            Compartilhe sua experiência
          </h3>
        </div>
        <button onClick={() => setOpen(false)} className="p-2 text-stone-300 hover:text-stone-500 transition-colors">
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-taupe-light/20 p-8">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-stone-400 mb-1.5">Seu nome *</label>
            <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ana Souza" required className={inputClass} />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-stone-400 mb-1.5">Projeto ou cargo</label>
            <input value={cargo} onChange={(e) => setCargo(e.target.value)} placeholder="Ex: Cliente — Residência São Paulo" className={inputClass} />
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-wider text-stone-400 mb-1.5">Link do projeto (opcional)</label>
          <input
            value={linkProjeto}
            onChange={(e) => setLinkProjeto(e.target.value)}
            type="url"
            placeholder="https://instagram.com/p/... ou outro link"
            className={inputClass}
          />
          <p className="text-[11px] text-stone-400 mt-1">Instagram, site, ou qualquer link onde o projeto esteja publicado.</p>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-wider text-stone-400 mb-1.5">Seu depoimento *</label>
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            rows={4}
            placeholder="Conte como foi a experiência de trabalhar com a Ana Marques..."
            required
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Foto de perfil */}
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-stone-400 mb-2">Sua foto (opcional)</label>
          <div className="flex items-center gap-4">
            {fotoPerfil ? (
              <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border border-taupe-light/30">
                <Image src={fotoPerfil} alt="Foto" fill className="object-cover" />
                <button type="button" onClick={() => setFotoPerfil(null)} className="absolute inset-0 bg-dark/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <X size={14} className="text-white" />
                </button>
              </div>
            ) : (
              <div className="w-14 h-14 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center shrink-0 text-stone-300 text-xs text-center leading-tight px-1">
                Sem foto
              </div>
            )}
            <label className="inline-flex items-center gap-2 border border-dashed border-stone-200 hover:border-taupe-light text-stone-400 hover:text-taupe text-xs tracking-wider uppercase px-4 py-2.5 cursor-pointer transition-colors">
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              {fotoPerfil ? "Trocar foto" : "Adicionar foto"}
              <input type="file" accept="image/*" className="hidden" onChange={handleFotoUpload} disabled={uploading} />
            </label>
          </div>
        </div>

        {/* Imagens do projeto */}
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-stone-400 mb-2">Fotos do projeto (opcional)</label>
          <div className="flex flex-wrap gap-2">
            {imagens.map((img, i) => (
              <div key={i} className="relative w-16 h-16 overflow-hidden border border-stone-200">
                <Image src={img} alt={`Foto ${i + 1}`} fill className="object-cover" />
                <button type="button" onClick={() => setImagens((prev) => prev.filter((_, j) => j !== i))} className="absolute inset-0 bg-dark/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <X size={12} className="text-white" />
                </button>
              </div>
            ))}
            {imagens.length < 6 && (
              <label className="w-16 h-16 border-2 border-dashed border-stone-200 hover:border-taupe-light flex items-center justify-center cursor-pointer transition-colors text-stone-300 hover:text-taupe">
                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImagensUpload} disabled={uploading} />
              </label>
            )}
          </div>
          {imagens.length > 0 && <p className="text-[10px] text-stone-400 mt-1.5">Máximo 6 imagens · clique na foto para remover</p>}
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={submitting || uploading || !nome.trim() || !texto.trim()}
            className="inline-flex items-center gap-2 bg-dark hover:bg-taupe-dark disabled:opacity-50 text-white text-xs tracking-[0.2em] uppercase px-8 py-3.5 transition-colors"
          >
            {submitting ? <><Loader2 size={14} className="animate-spin" /> Enviando...</> : "Enviar depoimento"}
          </button>
          <button type="button" onClick={() => setOpen(false)} className="text-xs text-stone-400 hover:text-stone-600 transition-colors">
            Cancelar
          </button>
        </div>
      </form>

      <p className="text-[11px] text-stone-400 mt-4 text-center">
        Seu depoimento será publicado após revisão. Obrigada pela confiança!
      </p>
    </div>
  );
}
