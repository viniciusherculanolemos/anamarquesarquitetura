"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Upload, Loader2, CheckCircle } from "lucide-react";

const inputClass =
  "w-full border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-stone-400 transition-colors rounded";

const labelClass = "block text-xs font-medium text-stone-500 mb-1.5 uppercase tracking-wider";

export default function AdminSobrePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [id, setId] = useState<string | null>(null);
  const [titulo, setTitulo] = useState("Sobre Mim");
  const [subtitulo, setSubtitulo] = useState("");
  const [texto, setTexto] = useState("");
  const [foto, setFoto] = useState<string | null>(null);
  const [fotoHero, setFotoHero] = useState<string | null>(null);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [whatsapp, setWhatsapp] = useState("");
  const [anos, setAnos] = useState(5);
  const [projetos, setProjetos] = useState(25);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from("sobre").select("*").single();
      if (data) {
        setId(data.id);
        setTitulo(data.titulo ?? "Sobre Mim");
        setSubtitulo(data.subtitulo ?? "");
        setTexto(data.texto ?? "");
        setFoto(data.foto ?? null);
        setFotoHero(data.foto_hero ?? null);
        setWhatsapp(data.whatsapp ?? "");
        setAnos(data.anos_experiencia ?? 5);
        setProjetos(data.projetos_entregues ?? 25);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleFotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const fileName = `sobre-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("projetos").upload(fileName, file, { upsert: true });
    if (!error) {
      const { data } = supabase.storage.from("projetos").getPublicUrl(fileName);
      setFoto(data.publicUrl);
    }
    setUploading(false);
  }

  async function handleFotoHeroUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingHero(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const fileName = `hero-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("projetos").upload(fileName, file, { upsert: true });
    if (!error) {
      const { data } = supabase.storage.from("projetos").getPublicUrl(fileName);
      setFotoHero(data.publicUrl);
    }
    setUploadingHero(false);
  }

  async function handleSave() {
    setSaving(true);
    const supabase = createClient();
    const payload = {
      titulo,
      subtitulo,
      texto,
      foto,
      foto_hero: fotoHero,
      whatsapp: whatsapp.trim() || null,
      anos_experiencia: anos,
      projetos_entregues: projetos,
      updated_at: new Date().toISOString(),
    };

    if (id) {
      await supabase.from("sobre").update(payload).eq("id", id);
    } else {
      const { data } = await supabase.from("sobre").insert(payload).select().single();
      if (data) setId(data.id);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="animate-spin text-stone-400" size={24} />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-stone-800">Sobre / Perfil</h1>
          <p className="text-sm text-stone-400 mt-1">Edite o conteúdo da página &quot;Sobre Mim&quot;</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-dark hover:bg-taupe-dark disabled:opacity-60 text-white text-xs tracking-wider uppercase px-6 py-3 transition-colors"
        >
          {saving ? (
            <><Loader2 size={14} className="animate-spin" /> Salvando...</>
          ) : saved ? (
            <><CheckCircle size={14} /> Salvo!</>
          ) : (
            "Salvar"
          )}
        </button>
      </div>

      <div className="space-y-8">
        {/* Hero Photo */}
        <div className="bg-white border border-stone-200 rounded p-6">
          <h2 className="text-sm font-semibold text-stone-600 uppercase tracking-wider mb-1">Foto Inicial (Hero)</h2>
          <p className="text-xs text-stone-400 mb-5">Imagem de fundo da primeira tela do site. Recomendado: 1920×1080px.</p>
          <div className="flex items-start gap-6">
            {fotoHero ? (
              <div className="relative w-48 h-28 overflow-hidden rounded shrink-0">
                <Image src={fotoHero} alt="Foto hero" fill className="object-cover" />
              </div>
            ) : (
              <div className="w-48 h-28 bg-stone-100 rounded flex items-center justify-center shrink-0">
                <span className="text-stone-300 text-xs text-center px-2">Sem foto<br/>(usa padrão)</span>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <label className="flex flex-col items-center justify-center w-40 h-16 border-2 border-dashed border-stone-200 hover:border-stone-400 rounded cursor-pointer transition-colors">
                {uploadingHero ? (
                  <Loader2 size={18} className="text-stone-400 animate-spin" />
                ) : (
                  <>
                    <Upload size={18} className="text-stone-300 mb-1" />
                    <span className="text-xs text-stone-400">{fotoHero ? "Trocar foto" : "Enviar foto"}</span>
                  </>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleFotoHeroUpload} />
              </label>
              {fotoHero && (
                <button type="button" onClick={() => setFotoHero(null)} className="text-xs text-red-400 hover:text-red-600 transition-colors">
                  Remover (volta ao padrão)
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Photo */}
        <div className="bg-white border border-stone-200 rounded p-6">
          <h2 className="text-sm font-semibold text-stone-600 uppercase tracking-wider mb-5">Foto</h2>
          <div className="flex items-start gap-6">
            {foto ? (
              <div className="relative w-32 h-40 overflow-hidden rounded shrink-0">
                <Image src={foto} alt="Foto de perfil" fill className="object-cover" />
              </div>
            ) : (
              <div className="w-32 h-40 bg-stone-100 rounded flex items-center justify-center shrink-0">
                <span className="text-stone-300 text-xs">Sem foto</span>
              </div>
            )}
            <label className="flex flex-col items-center justify-center w-40 h-16 border-2 border-dashed border-stone-200 hover:border-stone-400 rounded cursor-pointer transition-colors">
              {uploading ? (
                <Loader2 size={18} className="text-stone-400 animate-spin" />
              ) : (
                <>
                  <Upload size={18} className="text-stone-300 mb-1" />
                  <span className="text-xs text-stone-400">Alterar foto</span>
                </>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleFotoUpload} />
            </label>
          </div>
        </div>

        {/* Text content */}
        <div className="bg-white border border-stone-200 rounded p-6 space-y-5">
          <h2 className="text-sm font-semibold text-stone-600 uppercase tracking-wider">Textos</h2>

          <div>
            <label className={labelClass}>Título da seção</label>
            <input value={titulo} onChange={(e) => setTitulo(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Subtítulo / Frase de destaque</label>
            <input
              value={subtitulo}
              onChange={(e) => setSubtitulo(e.target.value)}
              placeholder="Aparece em destaque, entre aspas"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Texto completo</label>
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              rows={8}
              placeholder="Separe parágrafos com linha em branco"
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>

        {/* WhatsApp */}
        <div className="bg-white border border-stone-200 rounded p-6">
          <h2 className="text-sm font-semibold text-stone-600 uppercase tracking-wider mb-1">WhatsApp</h2>
          <p className="text-xs text-stone-400 mb-4">Número com DDI para o botão &quot;Entre em contato&quot;. Ex: 5511999999999</p>
          <input
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="5511999999999"
            className={inputClass}
          />
        </div>

        {/* Stats */}
        <div className="bg-white border border-stone-200 rounded p-6">
          <h2 className="text-sm font-semibold text-stone-600 uppercase tracking-wider mb-5">Números</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Projetos entregues</label>
              <input
                type="number"
                value={projetos}
                onChange={(e) => setProjetos(Number(e.target.value))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Anos de atuação</label>
              <input
                type="number"
                value={anos}
                onChange={(e) => setAnos(Number(e.target.value))}
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
