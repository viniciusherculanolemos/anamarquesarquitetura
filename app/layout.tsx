import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { createClient } from "@/lib/supabase/server";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ana Marques Arquitetura",
  description:
    "Projetos que transformam espaços em experiências. Arquitetura acolhedora para viver bem.",
  keywords: ["arquitetura", "interiores", "projetos residenciais", "projetos comerciais", "Rio de Janeiro"],
};

async function getWhatsApp(): Promise<string | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("sobre").select("whatsapp").single();
    return data?.whatsapp ?? null;
  } catch {
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const whatsapp = await getWhatsApp();

  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${jost.variable}`}>
      <body className="min-h-screen antialiased">
        {children}
        {whatsapp && <WhatsAppFloat phone={whatsapp} />}
      </body>
    </html>
  );
}
