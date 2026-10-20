import type { CSSProperties } from "react";
import {
  UserRound,
  Phone,
  UsersRound,
  BadgeEuro,
  TrendingUp,
  MapPin,
  Globe2,
  ArrowUpRight,
  X,
  RefreshCw,
  ChevronRight,
  Mail,
} from "lucide-react";
const icons = {
  person: UserRound,
  phone: Phone,
  people: UsersRound,
  revenue: BadgeEuro,
  growth: TrendingUp,
  location: MapPin,
  globe: Globe2,
  arrow: ArrowUpRight,
  close: X,
  refresh: RefreshCw,
  chevron: ChevronRight,
  mail: Mail,
};
export type CompanyIconName = keyof typeof icons;
export function CompanyIcon({ name, style }: { name: CompanyIconName; style?: CSSProperties }) {
  const Icon = icons[name];
  return <Icon className="company-icon" width={16} height={16} aria-hidden="true" style={style} />;
}
