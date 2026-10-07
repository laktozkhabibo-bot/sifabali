import type { Metadata } from "next";
import { Toaster } from "sonner";
import "../globals.css";
import { fontVariables } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Şifa Balı — Yönetim",
  robots: { index: false, follow: false, nocache: true },
};

/** Root layout for the host (owner) area — separate from the storefront, always Turkish */
export default function HostLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" dir="ltr" className={fontVariables}>
      <body className="min-h-screen bg-[#F7F4EE] text-charcoal antialiased">
        {children}
        <Toaster position="top-center" richColors closeButton toastOptions={{ className: "!rounded-2xl !font-sans" }} />
      </body>
    </html>
  );
}
