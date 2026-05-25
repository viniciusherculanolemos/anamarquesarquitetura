"use client";

import { useState } from "react";
import { Mail, MailOpen, Trash2, X, Check, Reply, Phone, ExternalLink } from "lucide-react";
import { Mensagem } from "@/types";
import { formatDate } from "@/lib/utils";

function MensagemModal({ msg, onClose, onDelete, onMarkRead }: {
  msg: Mensagem;
  onClose: () => void;
  onDelete: (id: string) => void;
  onMarkRead: (id: string) => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full max-w-2xl rounded shadow-xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-stone-100">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-full bg-taupe/10 flex items-center justify-center shrink-0">
              <span className="text-sm font-semibold text-taupe">
                {msg.nome.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-stone-800">{msg.nome}</h3>
              <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                <a
                  href={`mailto:${msg.email}`}
                  className="text-xs text-taupe hover:text-taupe-dark transition-colors inline-flex items-center gap-1"
                >
                  <ExternalLink size={10} /> {msg.email}
                </a>
                {msg.telefone && (
                  <a
                    href={`tel:${msg.telefone}`}
                    className="text-xs text-taupe hover:text-taupe-dark transition-colors inline-flex items-center gap-1"
                  >
                    <Phone size={10} /> {msg.telefone}
                  </a>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors shrink-0 ml-2"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {msg.assunto && (
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">
              Assunto: <span className="normal-case font-medium text-stone-600">{msg.assunto}</span>
            </p>
          )}
          <div className="bg-stone-50 rounded p-4">
            <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-wrap">{msg.mensagem}</p>
          </div>
          <p className="text-xs text-stone-300 mt-4">{formatDate(msg.created_at)}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between p-4 border-t border-stone-100 bg-stone-50/50">
          <div className="flex items-center gap-2">
            {!msg.lida && (
              <button
                onClick={() => { onMarkRead(msg.id); onClose(); }}
                className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-green-600 transition-colors border border-stone-200 hover:border-green-300 px-3 py-1.5 rounded"
              >
                <Check size={12} /> Marcar como lida
              </button>
            )}
            <button
              onClick={() => { if (confirm("Excluir esta mensagem?")) { onDelete(msg.id); onClose(); } }}
              className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-red-500 transition-colors border border-stone-200 hover:border-red-300 px-3 py-1.5 rounded"
            >
              <Trash2 size={12} /> Excluir
            </button>
          </div>
          <a
            href={`mailto:${msg.email}?subject=Re: ${msg.assunto ?? "Contato"}`}
            className="inline-flex items-center gap-1.5 bg-dark hover:bg-taupe-dark text-white text-xs tracking-wider uppercase px-4 py-2 transition-colors rounded"
          >
            <Reply size={13} /> Responder
          </a>
        </div>
      </div>
    </div>
  );
}

interface Props {
  initialMensagens: Mensagem[];
}

export default function MensagemList({ initialMensagens }: Props) {
  const [mensagens, setMensagens] = useState<Mensagem[]>(initialMensagens);
  const [selected, setSelected] = useState<Mensagem | null>(null);

  async function handleDelete(id: string) {
    await fetch(`/api/mensagens/${id}`, { method: "DELETE" });
    setMensagens((prev) => prev.filter((m) => m.id !== id));
  }

  async function handleMarkRead(id: string) {
    await fetch(`/api/mensagens/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lida: true }),
    });
    setMensagens((prev) => prev.map((m) => m.id === id ? { ...m, lida: true } : m));
  }

  if (mensagens.length === 0) {
    return (
      <p className="text-center text-stone-400 py-20 text-sm">
        Nenhuma mensagem recebida ainda.
      </p>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {mensagens.map((msg) => (
          <div
            key={msg.id}
            onClick={() => setSelected(msg)}
            className={`bg-white border rounded p-5 cursor-pointer transition-all hover:shadow-md hover:border-taupe-light/60 ${
              msg.lida ? "border-stone-200 opacity-75" : "border-taupe-light/60 shadow-sm"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="mt-0.5 shrink-0">
                  {msg.lida ? (
                    <MailOpen size={16} className="text-stone-300" />
                  ) : (
                    <Mail size={16} className="text-taupe-dark" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <span className={`text-sm font-medium ${msg.lida ? "text-stone-500" : "text-stone-800"}`}>
                      {msg.nome}
                    </span>
                    <span className="text-xs text-stone-400">{msg.email}</span>
                    {msg.telefone && (
                      <span className="text-xs text-stone-400">{msg.telefone}</span>
                    )}
                    {!msg.lida && (
                      <span className="text-[10px] bg-taupe/10 text-taupe px-2 py-0.5 rounded-full uppercase tracking-wider font-medium">
                        Nova
                      </span>
                    )}
                  </div>
                  {msg.assunto && (
                    <p className="text-xs text-stone-500 mb-1 font-medium">{msg.assunto}</p>
                  )}
                  <p className={`text-sm leading-relaxed line-clamp-2 ${msg.lida ? "text-stone-400" : "text-stone-600"}`}>
                    {msg.mensagem}
                  </p>
                  <p className="text-xs text-stone-300 mt-2">{formatDate(msg.created_at)}</p>
                </div>
              </div>

              <div
                className="shrink-0 flex flex-col gap-1.5"
                onClick={(e) => e.stopPropagation()}
              >
                {!msg.lida && (
                  <button
                    onClick={() => handleMarkRead(msg.id)}
                    className="inline-flex items-center gap-1 text-xs text-stone-400 hover:text-green-500 transition-colors whitespace-nowrap"
                    title="Marcar como lida"
                  >
                    <Check size={13} /> Lida
                  </button>
                )}
                <a
                  href={`mailto:${msg.email}?subject=Re: ${msg.assunto ?? "Contato"}`}
                  className="text-xs text-stone-400 hover:text-blue-500 transition-colors whitespace-nowrap"
                >
                  Responder
                </a>
                <button
                  onClick={() => { if (confirm("Excluir esta mensagem?")) handleDelete(msg.id); }}
                  className="text-xs text-stone-300 hover:text-red-500 transition-colors text-left"
                  title="Excluir"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <MensagemModal
          msg={selected}
          onClose={() => setSelected(null)}
          onDelete={handleDelete}
          onMarkRead={handleMarkRead}
        />
      )}
    </>
  );
}
