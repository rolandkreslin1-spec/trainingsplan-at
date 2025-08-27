// app/layout.tsx
import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "trainingsplan.at",
  description: "Personalisierte Trainingspläne – schnell & einfach",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif", color: "#1f2937" }}>
        <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
          {/* Globaler Header */}
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
              <div style={{ fontWeight: 900, fontSize: 22, letterSpacing: 0.2 }}>trainingsplan.at</div>
              <nav style={{ display: "flex", gap: 16 }}>
                <a href="/" style={{ color: "#2563eb", textDecoration: "none" }}>Start</a>
                <a href="/impressum" style={{ color: "#2563eb", textDecoration: "none" }}>Impressum</a>
                <a href="/datenschutz" style={{ color: "#2563eb", textDecoration: "none" }}>Datenschutz</a>
                <a href="/agb" style={{ color: "#2563eb", textDecoration: "none" }}>AGB</a>
              </nav>
            </div>
          </header>

          {/* Seiteninhalt */}
          <main style={{ flex: 1, maxWidth: 980, margin: "0 auto", width: "100%", padding: "24px" }}>
            {children}
          </main>

          {/* Globaler Footer */}
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
                <a href="/impressum" style={{ color: "#2563eb" }}>Impressum</a>
                <a href="/datenschutz" style={{ color: "#2563eb" }}>Datenschutz</a>
                <a href="/agb" style={{ color: "#2563eb" }}>AGB</a>
              </div>
            </div>
          </footer>
        </div>

        {/* Umami Analytics */}
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id="51460c59-9ad2-4d11-b7a3-5f20ee0daf14"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
