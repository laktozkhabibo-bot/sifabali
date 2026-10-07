import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { HexPattern } from "@/components/ui/HexPattern";
import { FacebookIcon, InstagramIcon, MailIcon, PhoneIcon, PinIcon, TiktokIcon, WhatsAppIcon, YoutubeIcon } from "@/components/ui/Icons";
import { localePath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { CategoryDTO, SiteContent } from "@/lib/types";
import { t, whatsappLink } from "@/lib/utils";

export function Footer({ locale, content, categories }: { locale: Locale; content: SiteContent; categories: CategoryDTO[] }) {
  const dict = getDictionary(locale);
  const c = content.contact;
  const socials = [
    { href: c.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: c.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: c.youtube, label: "YouTube", Icon: YoutubeIcon },
    { href: c.tiktok, label: "TikTok", Icon: TiktokIcon },
    { href: c.whatsapp ? whatsappLink(c.whatsapp) : "", label: "WhatsApp", Icon: WhatsAppIcon },
  ].filter((s) => s.href);

  return (
    <footer className="relative overflow-hidden bg-charcoal text-cream/80">
      <HexPattern color="#E0961A" opacity={0.06} id="footer-hex" />
      <div className="pointer-events-none absolute -top-40 start-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-honey-500/10 blur-3xl" />
      <div className="container relative grid gap-12 py-20 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Logo tone="light" className="h-16" />
          <p className="mt-6 max-w-sm leading-relaxed text-cream/60">{t(content.brand.footerText, locale)}</p>
          <div className="mt-8 flex gap-3">
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid h-11 w-11 place-items-center rounded-full border border-cream/15 text-cream/70 transition hover:border-honey-500 hover:bg-honey-500 hover:text-charcoal"
              >
                <Icon width={18} height={18} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-serif text-lg text-cream">{dict.footer.shop}</h2>
          <ul className="mt-5 space-y-3 text-sm">
            <li><Link className="hover:text-honey-300" href={localePath(locale, "/magaza")}>{dict.shop.all}</Link></li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link className="hover:text-honey-300" href={`${localePath(locale, "/magaza")}?kategori=${cat.slug}`}>
                  {t(cat.name, locale)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-serif text-lg text-cream">{dict.footer.company}</h2>
          <ul className="mt-5 space-y-3 text-sm">
            <li><Link className="hover:text-honey-300" href={localePath(locale, "/")}>{dict.nav.home}</Link></li>
            <li><Link className="hover:text-honey-300" href={localePath(locale, "/hakkimizda")}>{dict.nav.about}</Link></li>
            <li><Link className="hover:text-honey-300" href={localePath(locale, "/iletisim")}>{dict.nav.contact}</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="font-serif text-lg text-cream">{dict.footer.contact}</h2>
          <ul className="mt-5 space-y-4 text-sm">
            {c.phone && (
              <li className="flex items-start gap-3"><PhoneIcon width={18} className="mt-0.5 shrink-0 text-honey-400" /><a dir="ltr" className="hover:text-honey-300" href={`tel:${c.phone.replace(/\s/g, "")}`}>{c.phone}</a></li>
            )}
            {c.email && (
              <li className="flex items-start gap-3"><MailIcon width={18} className="mt-0.5 shrink-0 text-honey-400" /><a className="hover:text-honey-300" href={`mailto:${c.email}`}>{c.email}</a></li>
            )}
            {t(c.address, locale) && (
              <li className="flex items-start gap-3"><PinIcon width={18} className="mt-0.5 shrink-0 text-honey-400" /><span>{t(c.address, locale)}</span></li>
            )}
          </ul>
        </div>
      </div>
      <div className="relative border-t border-cream/10">
        <div className="container flex flex-col items-center justify-between gap-2 py-6 text-xs text-cream/45 sm:flex-row">
          <p>© {new Date().getFullYear()} Şifa Balı. {dict.footer.rights}</p>
          <p>{dict.footer.madeWith} 🐝</p>
        </div>
      </div>
    </footer>
  );
}
