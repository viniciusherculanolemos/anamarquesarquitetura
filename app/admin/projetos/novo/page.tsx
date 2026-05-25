import ProjectForm from "@/components/admin/ProjectForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NovoProjeto() {
  return (
    <div className="p-8">
      <Link
        href="/admin/projetos"
        className="inline-flex items-center gap-2 text-xs tracking-wider uppercase text-stone-400 hover:text-stone-600 transition-colors mb-6"
      >
        <ArrowLeft size={14} /> Voltar
      </Link>
      <h1 className="text-2xl font-semibold text-stone-800 mb-8">Novo Projeto</h1>
      <ProjectForm />
    </div>
  );
}
