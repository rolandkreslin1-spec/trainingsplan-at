// app/layout.tsx
import Script from "next/script";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "trainingsplan.at – Personalisierte Trainingspläne",
  description:
    "Dein personalisierter Trainingsplan für Ausdauer, Muskelaufbau und Fitness. Einfach Ziel eingeben und sofort starten.",
  keywords: [
    "Trainingsplan",
    "Fitness",
    "Muskelaufbau",
    "Ausdauertraining",
    "Sport",
    "Online Trainingsplan",
    "Personal Trainer",
  ],
  authors: [{ name: "Roland Kreslin", url: "https://trainingsplan.at" }],
  openGraph: {
    title: "trainingsplan.at – Dein personalisierter Trainingsplan",
    description:
      "Maßgeschneiderte Trainingspläne für jedes Ziel: Muskelaufbau, Ausdauer oder Gesundheit.",
    url: "https://trainingsplan.at",
    siteName: "trainingsplan.at",
    type: "website",
    images: [
      {
        url: "https://trainingsplan.at/bilder/logo-rot.jpg",
        width: 800,
        height: 600,
        alt: "trainingsplan.at Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "trainingsplan.at",
    description:
      "Individuelle Trainingspläne online erstellen – schnell, einfach und kostenlos starten!",
    images: ["https://trainingsplan.at/bilder/logo-rot.jpg"],
  },
  alternates: {
    canonical: "https://trainingsplan.at",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#2563eb" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />

        {/* Structured Data für Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "trainingsplan.at",
              url: "https://trainingsplan.at",
              logo: "https://trainingsplan.at/bilder/logo-rot.jpg",
              sameAs: [
                "https://www.facebook.com/trainingsplan",
                "https://www.instagram.com/trainingsplan",
              ],
            }),
          }}
        />

        {/* Umami Analytics */}
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id="51460c59-9ad2-4d11-b7a3-5f20ee0daf14"
          data-domains="trainingsplan.at,www.trainingsplan.at"
          strategy="afterInteractive"
        />
      </head>
      <body
        style={{
          fontFamily:
            "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
          color: "#1f2937",
        }}
      >
        <div
          style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}
        >
          {/* Header */}
          <header style={{ borderBottom: "1px solid #eee", background: "#fff" }}>
            <div
              style={{
                maxWidth: 980,
                margin: "0 auto",
                padding: "12px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <a href="/" style={{ display: "flex", alignItems: "center" }}>
                <img
                  src="/bilder/logo-rot.jpg"
                  alt="trainingsplan.at Logo"
                  style={{ height: 60, marginLeft: "60px" }}
                />
              </a>
              <nav style={{ display: "flex", gap: 16 }}>
                <a href="/" style={{ color: "#2563eb", textDecoration: "none" }}>
                  Start
                </a>
                <a
                  href="/impressum"
                  style={{ color: "#2563eb", textDecoration: "none" }}
                >
                  Impressum
                </a>
                <a
                  href="/datenschutz"
                  style={{ color: "#2563eb", textDecoration: "none" }}
                >
                  Datenschutz
                </a>
                <a
                  href="/agb"
                  style={{ color: "#2563eb", textDecoration: "none" }}
                >
                  AGB
                </a>
              </nav>
            </div>
          </header>

          {/* Content */}
          <main
            style={{
              flex: 1,
              maxWidth: 980,
              margin: "0 auto",
              width: "100%",
              padding: "24px",
            }}
          >
            {children}
          </main>

          {/* Footer */}
          <footer style={{ borderTop: "1px solid #eee", background: "#fafafa" }}>
            <div
              style={{
                maxWidth: 980,
                margin: "0 auto",
                padding: "16px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: 13,
                color: "#555",
              }}
            >
              <div>© {new Date().getFullYear()} trainingsplan.at</div>
              <div style={{ display: "flex", gap: 12 }}>
                <a href="/impressum" style={{ color: "#2563eb" }}>
                  Impressum
                </a>
                <a href="/datenschutz" style={{ color: "#2563eb" }}>
                  Datenschutz
                </a>
                <a href="/agb" style={{ color: "#2563eb" }}>
                  AGB
                </a>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
