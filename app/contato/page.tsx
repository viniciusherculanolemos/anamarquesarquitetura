import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { MapPin, Phone, Mail } from "lucide-react";

export default function ContatoPage() {
  return (
    <>
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-16 bg-beige border-b border-taupe-light/30 text-center">
        <p className="text-[10px] tracking-[0.4em] uppercase text-taupe mb-3">Fale Comigo</p>
        <h1
          className="text-5xl font-light text-dark"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          Contato
        </h1>
        <div className="w-12 h-px bg-taupe mx-auto mt-4" />
      </section>

      {/* Contact Content */}
      <section className="py-20 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Info */}
        <div className="lg:col-span-1">
          <h2
            className="text-3xl font-light text-dark mb-6"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            Vamos criar algo incrível juntos?
          </h2>
          <p className="text-sm text-dark/60 leading-relaxed mb-10">
            Entre em contato para conversarmos sobre o seu projeto. Estou aqui para
            transformar seus sonhos em espaços reais e acolhedores.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-full bg-beige border border-taupe-light/40 flex items-center justify-center shrink-0">
                <Phone size={15} className="text-taupe" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[10px] tracking-wider uppercase text-taupe mb-1">WhatsApp</p>
                <a
                  href="https://wa.me/5521964883818"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-dark hover:text-taupe-dark transition-colors"
                >
                  (21) 96488-3818
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-full bg-beige border border-taupe-light/40 flex items-center justify-center shrink-0">
                <Mail size={15} className="text-taupe" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[10px] tracking-wider uppercase text-taupe mb-1">E-mail</p>
                <a
                  href="mailto:contato@anamarques.arq"
                  className="text-sm text-dark hover:text-taupe-dark transition-colors"
                >
                  contato@anamarques.arq
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-full bg-beige border border-taupe-light/40 flex items-center justify-center shrink-0">
                <MapPin size={15} className="text-taupe" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[10px] tracking-wider uppercase text-taupe mb-1">Localização</p>
                <p className="text-sm text-dark">Rio de Janeiro — RJ</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2">
          <ContactForm />
        </div>
      </section>

      <Footer />
    </>
  );
}
