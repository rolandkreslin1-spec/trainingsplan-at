import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

// ====== OpenAI-Client ======
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) throw new Error("OPENAI_API_KEY fehlt. Lege .env.local mit OPENAI_API_KEY=sk-... an und starte neu.");
const client = new OpenAI({ apiKey });

// ====== Schemas ======
const AvailabilitySchema = z.object({
  mo: z.boolean().optional().default(false),
  di: z.boolean().optional().default(false),
  mi: z.boolean().optional().default(false),
  do: z.boolean().optional().default(false),
  fr: z.boolean().optional().default(false),
  sa: z.boolean().optional().default(false),
  so: z.boolean().optional().default(false),
});

const InputSchema = z.object({
  // Basis
  age: z.number().int().min(13).max(100),
  sex: z.enum(["male", "female", "diverse"]).default("diverse"),
  height_cm: z.number().min(100).max(250),
  weight_kg: z.number().min(30).max(250),
  sport: z.string().min(2),
  experience: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
  days_per_week: z.number().int().min(1).max(7),
  time_per_session_min: z.number().int().min(15).max(180),
  target_weeks: z.number().int().min(2).max(52),
  goals: z.array(z.string()).min(1).max(5),
  equipment: z.array(z.string()).optional().default([]),

  // Gesundheit / Risiken
  sleep_hours: z.number().nullable().optional(),
  stress_level: z.number().int().min(1).max(5).nullable().optional(),
  injuries: z.string().optional(),
  conditions: z.string().optional(),
  red_flags: z.string().optional(),

  // Leistung
  hr_max: z.number().nullable().optional(),
  ftp: z.number().nullable().optional(),
  run_5k_time: z.string().optional(),

  // Verfügbarkeit & Präferenzen
  availability: AvailabilitySchema.optional().default({}),
  time_window: z.string().optional(),
  likes: z.string().optional(),
  dislikes: z.string().optional(),

  // Rechtliches
  consent_to_process_health_data: z.boolean(),
  accept_disclaimer: z.boolean(),
});

type Input = z.infer<typeof InputSchema>;

// ====== Helper ======
function boolDaysToString(a?: z.infer<typeof AvailabilitySchema>) {
  if (!a) return "nicht angegeben";
  const map: Record<keyof typeof a, string> = { mo: "Mo", di: "Di", mi: "Mi", do: "Do", fr: "Fr", sa: "Sa", so: "So" };
  const active = Object.entries(a)
    .filter(([, v]) => v)
    .map(([k]) => map[k as keyof typeof a]);
  return active.length ? active.join(", ") : "keine Präferenz";
}

function buildInputSummary(d: Input) {
  return `# Eingabedaten (verwendet)

- Alter/Geschlecht: **${d.age}**, **${d.sex}**
- Größe/Gewicht: **${d.height_cm} cm**, **${d.weight_kg} kg**
- Sport/Level: **${d.sport}**, **${d.experience}**
- Ziele: **${d.goals.join(", ")}**
- Zielzeitraum: **${d.target_weeks} Wochen**
- Verfügbarkeit: **${d.days_per_week}×/Woche**, bevorzugte Tage: **${boolDaysToString(d.availability)}**, Zeitfenster: **${d.time_window || "–"}**
- Zeitbudget: **≤ ${d.time_per_session_min} min/Einheit**
- Equipment: **${(d.equipment || []).join(", ") || "kein"}**
- Gesundheit: Schlaf **${d.sleep_hours ?? "–"} h**, Stress **${d.stress_level ?? "–"} /5**, Erkrankungen **${d.conditions || "–"}**, Verletzungen **${d.injuries || "–"}**, Red Flags **${d.red_flags || "–"}**
- Leistung: HRmax **${d.hr_max ?? "–"}**, FTP **${d.ftp ?? "–"} W**, 5-km-Zeit **${d.run_5k_time || "–"}**
- Präferenzen: mag **${d.likes || "–"}**, No-Gos **${d.dislikes || "–"}**

`;
}

// Ernährungshinweise abhängig von Zielen
function getNutritionTips(goals: string[]): string {
  const g = goals.map((s) => s.toLowerCase()).join(" ");
  if (g.includes("muskel") || g.includes("kraft") || g.includes("hypertroph")) {
    return `
## Ernährungstipps (Muskelaufbau)
- **Protein:** 1.6–2.2 g/kg KG pro Tag (Fisch, Fleisch, Eier, Milchprodukte, Hülsenfrüchte).
- **Energie:** moderater Kalorienüberschuss (ca. +300–500 kcal/Tag).
- **Timing:** 3–5 Mahlzeiten/Tag; 20–40 g Protein pro Mahlzeit; KH rund ums Training.
- **Qualität:** überwiegend unverarbeitete Lebensmittel; ausreichend Obst/Gemüse; Omega-3-Quellen.`;
  }
  if (g.includes("ausdauer") || g.includes("leistung") || g.includes("ftp")) {
    return `
## Ernährungstipps (Ausdauer/Leistungssteigerung)
- **Kohlenhydrate:** Basisenergie (Vollkorn, Reis, Kartoffeln, Hafer). Lange Einheiten: KH-Zufuhr währenddessen (30–60 g/h).
- **Vor der Einheit:** leicht verdauliche KH + etwas Protein (z. B. Banane + Joghurt).
- **Nach der Einheit:** KH + Protein (z. B. Nudeln mit Gemüse + Thunfisch; Quark + Obst).
- **Hydration:** 2–3 l/Tag; >90 min oder Hitze: Elektrolyte/Sodium zuführen.`;
  }
  if (g.includes("abnehmen") || g.includes("gewicht") || g.includes("fett")) {
    return `
## Ernährungstipps (Gewichtsreduktion)
- **Kaloriendefizit:** ca. −300 bis −500 kcal/Tag, langsam & nachhaltig.
- **Protein hoch:** 1.6–2.0 g/kg KG für Muskelerhalt; viel Gemüse & Ballaststoffe für Sättigung.
- **Getränke/Snacks:** Zuckerhaltiges & Alkohol reduzieren; Wasser, ungesüßter Tee.
- **Alltag:** proteinreiche Hauptmahlzeiten; Snacks nach Bedarf durch Obst/Quark/Nüsse ersetzen.`;
  }
  return `
## Ernährungstipps (allgemein)
- **Protein täglich abdecken** (1.2–2.0 g/kg KG je nach Ziel), **Gemüse/Obst reichlich**, Ballaststoffe >25 g/Tag.
- Ausreichend trinken (i. d. R. 30–40 ml/kg KG/Tag).
- Timing an Training anpassen: vor/nach Einheiten KH+Protein bevorzugen.`;
}

// ====== Route ======
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = InputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Ungültige Eingaben", details: parsed.error.flatten() }, { status: 400 });
    }
    const d = parsed.data;

    // Zustimmung prüfen
    if (!d.accept_disclaimer || !d.consent_to_process_health_data) {
      return NextResponse.json(
        { error: "Zustimmung erforderlich", message: "Bitte Zustimmung/Einwilligung setzen." },
        { status: 400 }
      );
    }

    // Sicherheits-Check: Red Flags
    const red = /(brustschmerz|brustschmerzen|schwindel|ohnmacht|herzerkrank|schwanger|schwangerschaft|operation|\bop\b|verletzung\s*schwer|starke\s*schmerzen|instabilität\s*knie|akuter?\s*rückenschmerz|unbehandelt(er)?\s*hochdruck)/i;
    if (d.red_flags && red.test(d.red_flags)) {
      const md =
        buildInputSummary(d) +
        "\n**Wichtiger Hinweis:** Deine Angaben deuten auf mögliche Risiken hin. Bitte zuerst ärztlich abklären (kein Plan generiert).";
      return NextResponse.json({ plan_markdown: md }, { status: 200 });
    }

    // ----- Prompt -----
    const system = `Du bist ein lizenzierter Fitness-Coach. Du erstellst sichere, evidenzbasierte Trainingspläne.
- Ergebnis **in sauberem Markdown** mit Abschnitten:
  # Kurzbegründung
  # Wochenplan (Übersicht)
  # Übungsdetails (mit kurzen ÜBUNGSBESCHREIBUNGEN)
  # 4-Wochen-Progression
  # Alternativen & Skalierung
  # Technik- & Sicherheitshinweise

**WICHTIG – Tabellenformat (strikt!):**
- Für jede Woche eine **eigene Markdown-Tabelle** mit **korrekten Zeilenumbrüchen**.
- JEDE Tabelle beginnt GENAU so:
| Tag | Einheit/Ziel | Hauptübungen | Sätze×Wdh. | Pause | RPE/Tempo | Dauer (min) |
|---|---|---|---|---|---|---|
- Danach **eine Zeile pro Tag** (Mo–So). Keine mehreren Tage in einer Zeile.
- Ruhetag: 'Einheit/Ziel' = 'Pause', andere Spalten '-'.
- Verteile die Einheiten auf die **bevorzugten Tage**, an den übrigen Tagen ggf. 'Pause'.

**Sicherheitshinweise je nach Trainingsstand:**
- Anfänger: ausführlich (Grundspannung, Atmung, Bewegungsradius, typische Fehler).
- Fortgeschrittene: kompakt (RPE/Laststeuerung, Technik-Checks, Deload).

**Hard Constraints:**
- Max. Dauer **≤ ${d.time_per_session_min} min/Einheit**.
- Nutze **nur** angegebenes Equipment: ${d.equipment?.join(", ") || "kein Equipment"}.
- Sprache: Deutsch (Österreich), metrisch.`;

    const user = `Nutzerprofil
Alter: ${d.age}
Geschlecht: ${d.sex}
Größe: ${d.height_cm} cm
Gewicht: ${d.weight_kg} kg
Sportart: ${d.sport}
Trainingsstand: ${d.experience}
Ziele: ${d.goals.join(", ")}
Zielzeitraum: ${d.target_weeks} Wochen
Verfügbarkeit: ${d.days_per_week}×/Woche; bevorzugte Tage: ${boolDaysToString(d.availability)}; Zeitfenster: ${d.time_window || "–"}
Zeitbudget: ≤ ${d.time_per_session_min} min/Einheit
Equipment: ${d.equipment?.join(", ") || "kein"}
Gesundheit: Schlaf ${d.sleep_hours ?? "–"} h; Stress ${d.stress_level ?? "–"} /5; Krankheiten ${d.conditions || "–"}; Verletzungen ${d.injuries || "–"}
Leistung: HRmax ${d.hr_max ?? "–"}; FTP ${d.ftp ?? "–"} W; 5-km ${d.run_5k_time || "–"}
Präferenzen: mag ${d.likes || "–"}; No-Gos ${d.dislikes || "–"}

**Aufgabe:** Erstelle einen **periodisierten Plan für ${d.target_weeks} Wochen**.
- Jede Woche **7 Zeilen (Mo–So)**, mit 'Pause' falls Ruhetag.
- In 'Übungsdetails' zu jeder Hauptübung **2–4 kurze Ausführungshinweise**.
- Sicherheitshinweise entsprechend dem Level (${d.experience}).`;

    // ----- OpenAI-Aufruf -----
    let core = "";
    if ((client as any).responses?.create) {
      const r = await (client as any).responses.create({
        model: "gpt-4.1-mini",
        input: [{ role: "system", content: system }, { role: "user", content: user }],
        max_output_tokens: 2500,
      });
      core = (r as any).output_text || "";
    } else {
      const r = await client.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        max_tokens: 2500,
      });
      core = r.choices?.[0]?.message?.content || "";
    }

    // ----- Serverseitige Checks / Hinweise -----
    const notes: string[] = [];

    // 1) Dauer (min) überschreitet Budget?
    try {
      const over = [...core.matchAll(/\|\s*(\d+)\s*$/gm)]
        .map((m) => Number(m[1]))
        .filter((n) => !Number.isNaN(n) && n > d.time_per_session_min);
      if (over.length)
        notes.push(
          `Hinweis: ${over.length} Eintrag(e) überschreiten das Zeitbudget von ${d.time_per_session_min} min.`
        );
    } catch {
      /* ignore */
    }

    // 2) Kurzer Table-Shape-Hinweis (heuristisch)
    const badTable = /\|.+\|.+\|.+\|.+\|.+\|.+\|.+\|.*\n\|[-:\s|]+\|\n([^\n]*\|){6,}/.test(core) === false;
    if (badTable) {
      notes.push("Hinweis: Tabellenformat konnte nicht eindeutig verifiziert werden (Mo–So je eine Zeile).");
    }

    // Ernährungsteil
    const nutrition = getNutritionTips(d.goals);

    // Finales Markdown zusammensetzen
    const header = buildInputSummary(d);
    const validations = notes.length ? `\n## Validierung (Server)\n- ${notes.join("\n- ")}\n` : "";
    const finalMd = `${header}${validations}\n${core}\n\n${nutrition}\n`;

    return NextResponse.json({ plan_markdown: finalMd }, { status: 200 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: "Serverfehler", details: e?.message || String(e) }, { status: 500 });
  }
}
