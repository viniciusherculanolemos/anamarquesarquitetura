-- =========================================================
-- Ana Marques Arquitetura — Schema Definitivo
-- ATENÇÃO: Este script apaga e recria todas as tabelas.
--          Execute uma única vez num banco limpo.
-- =========================================================

-- ---------------------------------------------------------
-- PASSO 1: Limpar storage policies existentes
-- ---------------------------------------------------------
DROP POLICY IF EXISTS "storage_public_read"                      ON storage.objects;
DROP POLICY IF EXISTS "storage_auth_upload"                      ON storage.objects;
DROP POLICY IF EXISTS "storage_auth_update"                      ON storage.objects;
DROP POLICY IF EXISTS "storage_auth_delete"                      ON storage.objects;
DROP POLICY IF EXISTS "Admin faz upload de imagens"              ON storage.objects;
DROP POLICY IF EXISTS "Admin faz upload projetos"                ON storage.objects;
DROP POLICY IF EXISTS "Imagens são públicas"                     ON storage.objects;
DROP POLICY IF EXISTS "Imagens projetos são públicas"            ON storage.objects;
DROP POLICY IF EXISTS "Admin deleta imagens"                     ON storage.objects;
DROP POLICY IF EXISTS "Admin deleta imagens projetos"            ON storage.objects;
DROP POLICY IF EXISTS "Qualquer pessoa pode enviar foto de depoimento" ON storage.objects;
DROP POLICY IF EXISTS "Fotos de depoimentos são públicas"        ON storage.objects;
DROP POLICY IF EXISTS "Admin deleta fotos de depoimentos"        ON storage.objects;
DROP POLICY IF EXISTS "projetos_storage_read"                    ON storage.objects;
DROP POLICY IF EXISTS "projetos_storage_insert"                  ON storage.objects;
DROP POLICY IF EXISTS "projetos_storage_delete"                  ON storage.objects;
DROP POLICY IF EXISTS "depoimentos_storage_read"                 ON storage.objects;
DROP POLICY IF EXISTS "depoimentos_storage_insert"               ON storage.objects;
DROP POLICY IF EXISTS "depoimentos_storage_delete"               ON storage.objects;

-- ---------------------------------------------------------
-- PASSO 2: Apagar tabelas (CASCADE remove dependências)
-- ---------------------------------------------------------
DROP TABLE IF EXISTS servicos   CASCADE;
DROP TABLE IF EXISTS depoimentos CASCADE;
DROP TABLE IF EXISTS sobre      CASCADE;
DROP TABLE IF EXISTS mensagens  CASCADE;
DROP TABLE IF EXISTS projetos   CASCADE;

-- ---------------------------------------------------------
-- PASSO 3: Criar tabelas
-- ---------------------------------------------------------

-- projetos
CREATE TABLE projetos (
  id                  uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo              text NOT NULL,
  slug                text NOT NULL UNIQUE,
  descricao           text,
  descricao_completa  text,
  categoria           text,
  area                text,
  ano                 integer,
  localidade          text,
  imagem_capa         text,
  imagens             text[] DEFAULT '{}',
  ordem               integer DEFAULT 0,
  destaque            boolean DEFAULT false,
  publicado           boolean DEFAULT true,
  created_at          timestamp with time zone DEFAULT now(),
  updated_at          timestamp with time zone DEFAULT now()
);

-- mensagens
CREATE TABLE mensagens (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nome       text NOT NULL,
  email      text NOT NULL,
  telefone   text,
  assunto    text,
  mensagem   text NOT NULL,
  lida       boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- sobre
CREATE TABLE sobre (
  id                  uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo              text DEFAULT 'Sobre Mim',
  subtitulo           text,
  texto               text,
  foto                text,
  foto_hero           text,
  whatsapp            text,
  anos_experiencia    integer DEFAULT 5,
  projetos_entregues  integer DEFAULT 25,
  updated_at          timestamp with time zone DEFAULT now()
);

-- depoimentos
CREATE TABLE depoimentos (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nome         text NOT NULL,
  cargo        text,
  texto        text NOT NULL,
  foto_perfil  text,
  imagens      text[] DEFAULT '{}',
  link_projeto text,
  ordem        integer DEFAULT 0,
  publicado    boolean DEFAULT false,
  created_at   timestamp with time zone DEFAULT now()
);

-- servicos
CREATE TABLE servicos (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  icone      text NOT NULL DEFAULT 'Home',
  titulo     text NOT NULL,
  descricao  text,
  ordem      integer DEFAULT 0,
  ativo      boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- ---------------------------------------------------------
-- PASSO 4: Habilitar RLS
-- ---------------------------------------------------------
ALTER TABLE projetos   ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensagens  ENABLE ROW LEVEL SECURITY;
ALTER TABLE sobre      ENABLE ROW LEVEL SECURITY;
ALTER TABLE depoimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicos   ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------
-- PASSO 5: Policies
-- ---------------------------------------------------------

-- projetos
CREATE POLICY "projetos_public_read"
  ON projetos FOR SELECT USING (true);
CREATE POLICY "projetos_admin_all"
  ON projetos FOR ALL USING (auth.role() = 'authenticated');

-- mensagens
CREATE POLICY "mensagens_public_insert"
  ON mensagens FOR INSERT WITH CHECK (true);
CREATE POLICY "mensagens_admin_all"
  ON mensagens FOR ALL USING (auth.role() = 'authenticated');

-- sobre
CREATE POLICY "sobre_public_read"
  ON sobre FOR SELECT USING (true);
CREATE POLICY "sobre_admin_all"
  ON sobre FOR ALL USING (auth.role() = 'authenticated');

-- depoimentos
CREATE POLICY "depoimentos_public_read"
  ON depoimentos FOR SELECT USING (publicado = true);
CREATE POLICY "depoimentos_public_insert"
  ON depoimentos FOR INSERT WITH CHECK (true);
CREATE POLICY "depoimentos_admin_all"
  ON depoimentos FOR ALL USING (auth.role() = 'authenticated');

-- servicos
CREATE POLICY "servicos_public_read"
  ON servicos FOR SELECT USING (ativo = true);
CREATE POLICY "servicos_admin_all"
  ON servicos FOR ALL USING (auth.role() = 'authenticated');

-- ---------------------------------------------------------
-- PASSO 6: Dados padrão
-- ---------------------------------------------------------

INSERT INTO sobre (titulo, subtitulo, texto, anos_experiencia, projetos_entregues)
VALUES (
  'Sobre Mim',
  'Arquiteta apaixonada por criar espaços que acolhem, inspiram e transformam a rotina das pessoas.',
  'Formada em Arquitetura e Urbanismo, atuo há mais de 5 anos desenvolvendo projetos residenciais e comerciais com foco em funcionalidade, estética e bem-estar. Cada projeto é uma nova oportunidade de transformar sonhos em realidade.',
  5,
  25
);

INSERT INTO servicos (icone, titulo, descricao, ordem, ativo) VALUES
  ('Home',          'Projetos Residenciais',  'Criação de ambientes que refletem a personalidade e o estilo de vida dos moradores, do conceito à entrega.',          0, true),
  ('Building2',     'Projetos Comerciais',    'Espaços corporativos e comerciais planejados para potencializar resultados e criar experiências únicas.',              1, true),
  ('Sofa',          'Interiores',             'Desenvolvimento completo de interiores com seleção de materiais, móveis, iluminação e acabamentos.',                   2, true),
  ('MessageCircle', 'Consultoria Online',     'Orientação especializada à distância para decisões de projeto, decoração e reformas.',                                 3, true),
  ('HardHat',       'Acompanhamento de Obra', 'Supervisão técnica durante a execução para garantir fidelidade ao projeto e qualidade na entrega.',                   4, true);

-- ---------------------------------------------------------
-- PASSO 7: Storage buckets e policies
-- ---------------------------------------------------------

-- Bucket projetos (upload apenas admin)
INSERT INTO storage.buckets (id, name, public)
VALUES ('projetos', 'projetos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "projetos_storage_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'projetos');

CREATE POLICY "projetos_storage_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'projetos' AND auth.role() = 'authenticated');

CREATE POLICY "projetos_storage_delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'projetos' AND auth.role() = 'authenticated');

-- Bucket depoimentos (upload público)
INSERT INTO storage.buckets (id, name, public)
VALUES ('depoimentos', 'depoimentos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "depoimentos_storage_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'depoimentos');

CREATE POLICY "depoimentos_storage_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'depoimentos');

CREATE POLICY "depoimentos_storage_delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'depoimentos' AND auth.role() = 'authenticated');
