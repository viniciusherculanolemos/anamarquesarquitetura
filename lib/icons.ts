import {
  Home,
  Building2,
  Sofa,
  MessageCircle,
  HardHat,
  Ruler,
  Sparkles,
  Sun,
  Star,
  Heart,
  Leaf,
  Layers,
  Lightbulb,
  Pencil,
  Palette,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const AVAILABLE_ICONS: { name: string; label: string; icon: LucideIcon }[] = [
  { name: "Home", label: "Casa", icon: Home },
  { name: "Building2", label: "Edifício", icon: Building2 },
  { name: "Sofa", label: "Interiores", icon: Sofa },
  { name: "MessageCircle", label: "Consultoria", icon: MessageCircle },
  { name: "HardHat", label: "Obra", icon: HardHat },
  { name: "Ruler", label: "Projeto", icon: Ruler },
  { name: "Pencil", label: "Design", icon: Pencil },
  { name: "Palette", label: "Paleta", icon: Palette },
  { name: "Sparkles", label: "Especial", icon: Sparkles },
  { name: "Sun", label: "Iluminação", icon: Sun },
  { name: "Star", label: "Destaque", icon: Star },
  { name: "Heart", label: "Preferido", icon: Heart },
  { name: "Leaf", label: "Sustentável", icon: Leaf },
  { name: "Layers", label: "Layers", icon: Layers },
  { name: "Lightbulb", label: "Conceito", icon: Lightbulb },
];

export function getIcon(name: string): LucideIcon {
  return AVAILABLE_ICONS.find((i) => i.name === name)?.icon ?? Home;
}
