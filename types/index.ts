export interface Projeto {
  id: string;
  titulo: string;
  slug: string;
  descricao: string | null;
  descricao_completa: string | null;
  categoria: string | null;
  area: string | null;
  ano: number | null;
  localidade: string | null;
  imagem_capa: string | null;
  imagens: string[] | null;
  ordem: number;
  destaque: boolean;
  publicado: boolean;
  created_at: string;
  updated_at: string;
}

export interface Mensagem {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  assunto: string | null;
  mensagem: string;
  lida: boolean;
  created_at: string;
}

export interface Depoimento {
  id: string;
  nome: string;
  cargo: string | null;
  texto: string;
  foto_perfil: string | null;
  imagens: string[] | null;
  link_projeto: string | null;
  ordem: number;
  publicado: boolean;
  created_at: string;
}

export interface Servico {
  id: string;
  icone: string;
  titulo: string;
  descricao: string | null;
  ordem: number;
  ativo: boolean;
  created_at: string;
}

export interface SobreMim {
  id: string;
  titulo: string | null;
  subtitulo: string | null;
  texto: string | null;
  foto: string | null;
  foto_hero: string | null;
  whatsapp: string | null;
  anos_experiencia: number | null;
  projetos_entregues: number | null;
  updated_at: string;
}
