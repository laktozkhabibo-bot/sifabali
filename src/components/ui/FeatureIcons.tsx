/** Icon set for the "Neden Şifa Balı?" cards — chosen per card in the host panel */
import type { SVGProps } from "react";
import type { FeatureIconName } from "@/lib/types";
import {
  BeeIcon,
  ClockIcon,
  FlaskIcon,
  FlowerIcon,
  HarvestIcon,
  HoneycombIcon,
  JarIcon,
  LeafIcon,
  MountainIcon,
  PinIcon,
  ShieldIcon,
  StarOutlineIcon,
  TruckIcon,
} from "./Icons";

type P = SVGProps<SVGSVGElement>;
const base = (p: P) => ({ width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true, ...p });

const SproutIcon = (p: P) => (<svg {...base(p)}><path d="M12 21v-9" /><path d="M12 12C12 8 9 5.5 4.5 5.5 4.5 10 7.5 12 12 12z" /><path d="M12 14c0-3.5 2.5-6 7-6 0 4-2.5 6-7 6z" /></svg>);
const TreeIcon = (p: P) => (<svg {...base(p)}><path d="M12 22v-6" /><path d="M12 2a6 6 0 0 0-5.6 8.2A4.5 4.5 0 0 0 8.5 18h7a4.5 4.5 0 0 0 2.1-7.8A6 6 0 0 0 12 2z" /></svg>);
const SunIcon = (p: P) => (<svg {...base(p)}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>);
const DropletIcon = (p: P) => (<svg {...base(p)}><path d="M12 3s6 6.6 6 11a6 6 0 0 1-12 0c0-4.4 6-11 6-11z" /><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5" /></svg>);
const HiveIcon = (p: P) => (<svg {...base(p)}><path d="M8 5h8M6 9h12M5 13h14M5 17h14" /><path d="M8 5a4 2 0 0 1 8 0l2 4 1 4v4a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-4l1-4z" /><path d="M10.5 20v-2.5a1.5 1.5 0 0 1 3 0V20" /></svg>);
const DipperIcon = (p: P) => (<svg {...base(p)}><path d="M3 21l8.5-8.5" /><rect x="11" y="4" width="7" height="9" rx="3.5" transform="rotate(45 14.5 8.5)" /><path d="M12.3 6.6l5.1 5.1M10.9 8l5.1 5.1" /></svg>);
const MicroscopeIcon = (p: P) => (<svg {...base(p)}><path d="M6 21h12M9 18h6" /><path d="M10 4l4 2-3 6-4-2z" /><path d="M12.5 10.5a5 5 0 0 1 2 8.5" /><path d="M9 3l1 1" /></svg>);
const BadgeIcon = (p: P) => (<svg {...base(p)}><path d="M12 2l2.4 1.8 3-.1.9 2.9 2.4 1.8-1 2.8 1 2.8-2.4 1.8-.9 2.9-3-.1L12 22l-2.4-1.8-3 .1-.9-2.9-2.4-1.8 1-2.8-1-2.8 2.4-1.8.9-2.9 3 .1z" /><path d="M8.5 12l2.5 2.5 4.5-5" /></svg>);
const AwardIcon = (p: P) => (<svg {...base(p)}><circle cx="12" cy="9" r="6" /><path d="M8.5 13.9L7 22l5-3 5 3-1.5-8.1" /><path d="M12 6.5l.8 1.6 1.7.3-1.2 1.2.3 1.7-1.6-.8-1.6.8.3-1.7-1.2-1.2 1.7-.3z" /></svg>);
const CrownIcon = (p: P) => (<svg {...base(p)}><path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z" /><path d="M5 19h14" /></svg>);
const HeartIcon = (p: P) => (<svg {...base(p)}><path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z" /></svg>);
const HandHeartIcon = (p: P) => (<svg {...base(p)}><path d="M2 15h3l4.5 1.5h3.5a1.5 1.5 0 0 1 0 3H9" /><path d="M5 21h8.5l7-3.5a1.6 1.6 0 0 0-1.5-2.8L14 17" /><path d="M14.5 11.5S10 9 10 6a2.2 2.2 0 0 1 4.5-.8A2.2 2.2 0 0 1 19 6c0 3-4.5 5.5-4.5 5.5z" /></svg>);
const SmileIcon = (p: P) => (<svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M8.5 14a4.5 4.5 0 0 0 7 0M9 9.5h.01M15 9.5h.01" /></svg>);
const UsersIcon = (p: P) => (<svg {...base(p)}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18.5 14a6.5 6.5 0 0 1 3 6" /></svg>);
const PackageIcon = (p: P) => (<svg {...base(p)}><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" /><path d="M4 7.5l8 4.5 8-4.5M12 12v9M8 5.2l8 4.6" /></svg>);
const GiftIcon = (p: P) => (<svg {...base(p)}><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M5 12v9h14v-9M12 8v13" /><path d="M12 8S10.5 3.5 8 4.5 8.5 8 12 8zM12 8s1.5-4.5 4-3.5S15.5 8 12 8z" /></svg>);
const GlobeIcon = (p: P) => (<svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></svg>);
const SparkleIcon = (p: P) => (<svg {...base(p)}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" /><path d="M19 15l.7 1.8 1.8.7-1.8.7L19 20l-.7-1.8-1.8-.7 1.8-.7z" /></svg>);
const RecycleIcon = (p: P) => (<svg {...base(p)}><path d="M7 19H4.5a1.5 1.5 0 0 1-1.3-2.3l3.3-5.5" /><path d="M11 19h8.5a1.5 1.5 0 0 0 1.3-2.3l-1.6-2.7" /><path d="M14 16l-3 3 3 3" /><path d="M8.6 7.3l1.9-3.2a1.5 1.5 0 0 1 2.6 0l3.8 6.4" /><path d="M13.6 10.7l3.1-.2.2-3.1M3.5 9.5l3 1.7 1.7-3" /></svg>);
const NoHeatIcon = (p: P) => (<svg {...base(p)}><path d="M10 13.5V5a2 2 0 0 1 4 0v8.5a4 4 0 1 1-4 0z" /><path d="M3 3l18 18" /></svg>);
const ThumbsUpIcon = (p: P) => (<svg {...base(p)}><path d="M7 10v11H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1z" /><path d="M7 10l4-7a2.5 2.5 0 0 1 2.5 3L13 10h6a2 2 0 0 1 2 2.3l-1.2 7A2 2 0 0 1 17.8 21H7" /></svg>);

export const FEATURE_ICON_MAP: Record<FeatureIconName, (p: P) => React.JSX.Element> = {
  leaf: LeafIcon,
  sprout: SproutIcon,
  flower: FlowerIcon,
  tree: TreeIcon,
  mountain: MountainIcon,
  sun: SunIcon,
  droplet: DropletIcon,
  bee: BeeIcon,
  honeycomb: HoneycombIcon,
  hive: HiveIcon,
  jar: JarIcon,
  dipper: DipperIcon,
  harvest: HarvestIcon,
  flask: FlaskIcon,
  microscope: MicroscopeIcon,
  shield: ShieldIcon,
  badge: BadgeIcon,
  award: AwardIcon,
  star: StarOutlineIcon,
  crown: CrownIcon,
  heart: HeartIcon,
  "hand-heart": HandHeartIcon,
  smile: SmileIcon,
  users: UsersIcon,
  truck: TruckIcon,
  package: PackageIcon,
  gift: GiftIcon,
  clock: ClockIcon,
  globe: GlobeIcon,
  pin: PinIcon,
  sparkle: SparkleIcon,
  recycle: RecycleIcon,
  "no-heat": NoHeatIcon,
  "thumbs-up": ThumbsUpIcon,
};

/** Turkish names shown in the host panel's icon picker */
export const FEATURE_ICON_LABELS: Record<FeatureIconName, string> = {
  leaf: "Yaprak",
  sprout: "Filiz",
  flower: "Çiçek",
  tree: "Ağaç",
  mountain: "Dağ / Yayla",
  sun: "Güneş",
  droplet: "Damla",
  bee: "Arı",
  honeycomb: "Petek",
  hive: "Kovan",
  jar: "Kavanoz",
  dipper: "Bal kaşığı",
  harvest: "Hasat",
  flask: "Laboratuvar",
  microscope: "Mikroskop / Analiz",
  shield: "Güvence",
  badge: "Onay rozeti",
  award: "Ödül / Madalya",
  star: "Yıldız",
  crown: "Taç / Premium",
  heart: "Kalp",
  "hand-heart": "Özen / Sevgi",
  smile: "Mutlu müşteri",
  users: "Aile / Ekip",
  truck: "Kargo",
  package: "Paket",
  gift: "Hediye",
  clock: "Hızlı / Zaman",
  globe: "Dünya",
  pin: "Konum",
  sparkle: "Parıltı / Saflık",
  recycle: "Geri dönüşüm",
  "no-heat": "Isıl işlem yok",
  "thumbs-up": "Beğeni",
};

/** Renders the chosen icon (falls back to the leaf for unknown names) */
export function FeatureIcon({ name, ...props }: { name: FeatureIconName | string } & P) {
  const Icon = FEATURE_ICON_MAP[name as FeatureIconName] ?? LeafIcon;
  return <Icon {...props} />;
}
