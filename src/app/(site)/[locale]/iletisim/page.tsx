import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { ContactForm } from "@/components/contact/ContactForm";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ClockIcon, FacebookIcon, InstagramIcon, MailIcon, PhoneIcon, PinIcon, TiktokIcon, WhatsAppIcon, YoutubeIcon } from "@/components/ui/Icons";
import { getSiteContent } from "@/lib/data";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveLocale } from "@/lib/page-locale";
import { pageMetadata } from "@/lib/seo";
import { t, whatsappLink } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return pageMetadata({ locale, path: "/iletisim", title: dict.contact.title, description: dict.contact.subtitle });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const { contact: c } = await getSiteContent();

  const cards = [
    c.phone && { Icon: PhoneIcon, label: dict.contact.phoneLabel, value: c.phone, href: `tel:${c.phone.replace(/\s/g, "")}`, ltr: true },
    c.email && { Icon: MailIcon, label: dict.contact.emailLabel, value: c.email, href: `mailto:${c.email}`, ltr: true },
    t(c.address, locale) && { Icon: PinIcon, label: dict.contact.addressLabel, value: t(c.address, locale), href: c.mapUrl || undefined },
    t(c.hours, locale) && { Icon: ClockIcon, label: dict.contact.hoursLabel, value: t(c.hours, locale) },
  ].filter(Boolean) as { Icon: typeof PhoneIcon; label: string; value: string; href?: string; ltr?: boolean }[];

  const socials = [
    { href: c.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: c.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: c.youtube, label: "YouTube", Icon: YoutubeIcon },
    { href: c.tiktok, label: "TikTok", Icon: TiktokIcon },
  ].filter((s) => s.href);

  return (
    <>
      <PageHeader eyebrow={dict.contact.title} title={dict.contact.formTitle} subtitle={dict.contact.subtitle} />
      <section className="container grid gap-12 py-20 md:py-28 lg:grid-cols-[1fr_1.1fr]">
        <div>
          {c.whatsapp && (
            <Reveal>
              <a
                href={whatsappLink(c.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-4 rounded-[28px] bg-[#25D366] p-6 text-white shadow-[0_20px_50px_-20px_rgba(37,211,102,.7)] transition-colors hover:bg-[#1ebe5b]"
              >
                <span className="flex items-center gap-4">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-white/20"><WhatsAppIcon width={28} /></span>
                  <span>
                    <span className="block text-sm opacity-80">{dict.contact.whatsapp}</span>
                    <span className="block text-xl font-semibold" dir="ltr">{c.whatsapp}</span>
                  </span>
                </span>
                <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#128C7E]">{dict.contact.whatsappCta}</span>
              </a>
            </Reveal>
          )}
          <Stagger className="mt-6 grid gap-4 sm:grid-cols-2">
            {cards.map(({ Icon, label, value, href, ltr }) => (
              <StaggerItem key={label}>
                <div className="card h-full p-6">
                  <Icon className="h-7 w-7 text-honey-600" />
                  <p className="mt-4 text-xs uppercase tracking-widest text-charcoal-400 rtl:tracking-normal">{label}</p>
                  {href ? (
                    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="mt-1 block font-semibold hover:text-honey-700" dir={ltr ? "ltr" : undefined}>
                      {value}
                    </a>
                  ) : (
                    <p className="mt-1 font-semibold">{value}</p>
                  )}
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          {socials.length > 0 && (
            <Reveal delay={0.2}>
              <p className="mt-10 font-serif text-xl">{dict.contact.social}</p>
              <div className="mt-4 flex gap-3">
                {socials.map(({ href, label, Icon }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="grid h-12 w-12 place-items-center rounded-full bg-charcoal text-cream transition hover:bg-honey-500 hover:text-charcoal">
                    <Icon width={20} />
                  </a>
                ))}
              </div>
            </Reveal>
          )}
        </div>
        <Reveal delay={0.1}>
          <ContactForm />
        </Reveal>
      </section>
    </>
  );
}
