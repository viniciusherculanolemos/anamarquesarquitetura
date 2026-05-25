"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import { Projeto } from "@/types";

const schema = z.object({
  titulo: z.string().min(2, "Título obrigatório"),
  slug: z.string().optional(),
  descricao: z.string().optional(),
  descricao_completa: z.string().optional(),
  categoria: z.string().optional(),
  area: z.string().optional(),
  ano: z.coerce.number().optional(),
  localidade: z.string().optional(),
  destaque: z.boolean(),
  publicado: z.boolean(),
});

type FormData = z.infer<typeof schema>;

const CATEGORIAS = ["Residencial", "Comercial", "Interiores", "Consultoria"];

const inputClass =
  "w-full border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-stone-400 transition-colors rounded";

const labelClass = "block text-xs font-medium text-stone-500 mb-1.5 uppercase tracking-wider";

interface Props {
  projeto?: Projeto;
}

export default function ProjectForm({ projeto }: Props) {
  const router = useRouter();
  const isEdit = !!projeto;

  const [coverImage, setCoverImage] = useState<string | null>(projeto?.imagem_capa ?? null);
  const [gallery, setGallery] = useState<string[]>(projeto?.imagens ?? []);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: {
      titulo: projeto?.titulo ?? "",
      slug: projeto?.slug ?? "",
      descricao: projeto?.descricao ?? "",
      descricao_completa: projeto?.descricao_completa ?? "",
      categoria: projeto?.categoria ?? "",
      area: projeto?.area ?? "",
      ano: projeto?.ano ?? undefined,
      localidade: projeto?.localidade ?? "",
      destaque: projeto?.destaque ?? false,
      publicado: projeto?.publicado ?? true,
    },
  });

  const titulo = watch("titulo");

  async function uploadImage(file: File): Promise<string> {
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("projetos")
      .upload(fileName, file, { cacheControl: "3600", upsert: false });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("projetos").getPublicUrl(fileName);
    return data.publicUrl;
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setCoverImage(url);
    } catch {
      setError("Erro ao fazer upload da imagem de capa.");
    } finally {
      setUploading(false);
    }
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = await Promise.all(files.map(uploadImage));
      setGallery((prev) => [...prev, ...urls]);
    } catch {
      setError("Erro ao fazer upload das imagens.");
    } finally {
      setUploading(false);
    }
  }

  function removeGalleryImage(url: string) {
    setGallery((prev) => prev.filter((img) => img !== url));
  }

  async function onSubmit(data: FormData) {
    setError(null);
    const slug = data.slug?.trim() || slugify(data.titulo);

    const payload = {
      ...data,
      slug,
      imagem_capa: coverImage,
      imagens: gallery,
      ano: data.ano ?? null,
    };

    const url = isEdit ? `/api/projetos/${projeto!.id}` : "/api/projetos";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      setError("Erro ao salvar projeto.");
      return;
    }

    router.push("/admin/projetos");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
      {/* Basic Info */}
      <div className="bg-white border border-stone-200 rounded p-6 space-y-5">
        <h2 className="text-sm font-semibold text-stone-600 uppercase tracking-wider">
          Informações básicas
        </h2>

        <div>
          <label className={labelClass}>Título *</label>
          <input
            {...register("titulo")}
            placeholder="Ex: Apartamento Contemporâneo"
            className={inputClass}
          />
          {errors.titulo && <p className="text-xs text-red-400 mt-1">{errors.titulo.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Slug (URL)</label>
          <input
            {...register("slug")}
            placeholder={titulo ? slugify(titulo) : "gerado-automaticamente"}
            className={inputClass}
          />
          <p className="text-xs text-stone-400 mt-1">
            Deixe vazio para gerar automaticamente do título
          </p>
        </div>

        <div>
          <label className={labelClass}>Descrição curta</label>
          <textarea
            {...register("descricao")}
            rows={2}
            placeholder="Breve descrição exibida nos cards"
            className={`${inputClass} resize-none`}
          />
        </div>

        <div>
          <label className={labelClass}>Descrição completa</label>
          <textarea
            {...register("descricao_completa")}
            rows={6}
            placeholder="Texto completo da página do projeto (separe parágrafos com linha em branco)"
            className={`${inputClass} resize-none`}
          />
        </div>
      </div>

      {/* Details */}
      <div className="bg-white border border-stone-200 rounded p-6 space-y-5">
        <h2 className="text-sm font-semibold text-stone-600 uppercase tracking-wider">
          Detalhes
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Categoria</label>
            <select {...register("categoria")} className={inputClass}>
              <option value="">Selecionar</option>
              {CATEGORIAS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Área</label>
            <input {...register("area")} placeholder="Ex: 120m²" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Ano</label>
            <input {...register("ano")} type="number" placeholder="2024" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Localidade</label>
            <input {...register("localidade")} placeholder="Ex: Rio de Janeiro, RJ" className={inputClass} />
          </div>
        </div>

        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register("publicado")} className="w-4 h-4 accent-stone-700" />
            <span className="text-sm text-stone-600">Publicado</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register("destaque")} className="w-4 h-4 accent-amber-500" />
            <span className="text-sm text-stone-600">Destaque na home</span>
          </label>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white border border-stone-200 rounded p-6 space-y-5">
        <h2 className="text-sm font-semibold text-stone-600 uppercase tracking-wider">
          Imagens
        </h2>

        {/* Cover Image */}
        <div>
          <label className={labelClass}>Imagem de capa</label>
          {coverImage ? (
            <div className="relative w-full aspect-video overflow-hidden rounded border border-stone-200">
              <Image src={coverImage} alt="Capa" fill className="object-cover" />
              <button
                type="button"
                onClick={() => setCoverImage(null)}
                className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full p-1 text-stone-600 shadow"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-stone-200 hover:border-stone-400 rounded cursor-pointer transition-colors">
              {uploading ? (
                <Loader2 size={24} className="text-stone-400 animate-spin" />
              ) : (
                <>
                  <Upload size={24} className="text-stone-300 mb-2" />
                  <span className="text-sm text-stone-400">Clique para enviar a capa</span>
                </>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
            </label>
          )}
        </div>

        {/* Gallery */}
        <div>
          <label className={labelClass}>Galeria de imagens</label>
          <div className="grid grid-cols-3 gap-3">
            {gallery.map((img) => (
              <div key={img} className="relative aspect-square overflow-hidden rounded border border-stone-200">
                <Image src={img} alt="Galeria" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeGalleryImage(img)}
                  className="absolute top-1 right-1 bg-white/90 hover:bg-white rounded-full p-1 text-stone-600 shadow"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-stone-200 hover:border-stone-400 rounded cursor-pointer transition-colors">
              {uploading ? (
                <Loader2 size={20} className="text-stone-400 animate-spin" />
              ) : (
                <>
                  <Upload size={20} className="text-stone-300 mb-1" />
                  <span className="text-xs text-stone-400 text-center">Adicionar</span>
                </>
              )}
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} />
            </label>
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isSubmitting || uploading}
          className="inline-flex items-center gap-2 bg-dark hover:bg-taupe-dark disabled:opacity-60 text-white text-xs tracking-wider uppercase px-8 py-3 transition-colors"
        >
          {isSubmitting ? <><Loader2 size={14} className="animate-spin" /> Salvando...</> : isEdit ? "Salvar alterações" : "Criar projeto"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-stone-400 hover:text-stone-600 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
