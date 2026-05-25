"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const schema = z.object({
  nome: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().optional(),
  assunto: z.string().optional(),
  mensagem: z.string().min(10, "Mensagem deve ter ao menos 10 caracteres"),
});

type FormData = z.infer<typeof schema>;

const inputClass =
  "w-full bg-transparent border border-taupe-light/40 px-4 py-3 text-sm text-dark placeholder:text-taupe/40 focus:outline-none focus:border-taupe transition-colors";

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setError(null);
    try {
      const res = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erro ao enviar mensagem");
      setSent(true);
      reset();
    } catch {
      setError("Não foi possível enviar sua mensagem. Tente novamente.");
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
        <CheckCircle size={48} className="text-taupe-dark" strokeWidth={1.2} />
        <h3
          className="text-3xl font-light text-dark"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          Mensagem enviada!
        </h3>
        <p className="text-sm text-taupe">Em breve entrarei em contato com você.</p>
        <button
          onClick={() => setSent(false)}
          className="mt-4 text-xs tracking-widest uppercase text-taupe hover:text-taupe-dark underline transition-colors"
        >
          Enviar outra mensagem
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <input
            {...register("nome")}
            placeholder="Seu nome *"
            className={cn(inputClass, errors.nome && "border-red-400")}
          />
          {errors.nome && (
            <p className="text-xs text-red-400 mt-1">{errors.nome.message}</p>
          )}
        </div>
        <div>
          <input
            {...register("email")}
            type="email"
            placeholder="Seu e-mail *"
            className={cn(inputClass, errors.email && "border-red-400")}
          />
          {errors.email && (
            <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <input
          {...register("telefone")}
          placeholder="Telefone / WhatsApp"
          className={inputClass}
        />
        <input
          {...register("assunto")}
          placeholder="Assunto"
          className={inputClass}
        />
      </div>

      <div>
        <textarea
          {...register("mensagem")}
          rows={6}
          placeholder="Sua mensagem *"
          className={cn(inputClass, "resize-none", errors.mensagem && "border-red-400")}
        />
        {errors.mensagem && (
          <p className="text-xs text-red-400 mt-1">{errors.mensagem.message}</p>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-400 text-center">{error}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full md:w-auto inline-flex items-center justify-center gap-3 bg-taupe-dark hover:bg-brown disabled:opacity-60 text-white text-xs tracking-[0.3em] uppercase px-10 py-4 transition-colors duration-300"
      >
        {isSubmitting ? (
          "Enviando..."
        ) : (
          <>
            Enviar mensagem <Send size={14} />
          </>
        )}
      </button>
    </form>
  );
}
