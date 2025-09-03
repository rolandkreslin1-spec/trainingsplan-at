"use client";

import { useState } from "react";

export default function HomePage() {
  const [plan, setPlan] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setPlan("");
    setLoading(true);

    const fd = new FormData(e.currentTarget as HTMLFormElement);

    const availability = {
      mo: Boolean(fd.get("avail_mo")),
      di: Boolean(fd.get("avail_di")),
      mi: Boolean(fd.get("avail_mi")),
      do: Boolean(fd.get("avail_do")),
      fr: Boolean(fd.get("avail_fr")),
      sa: Boolean(fd.get("avail_sa")),
      so: Boolean(fd.get("avail_so")),
    };

    const payload = {
      // Basis
      age: Number(fd.get("age")),
      sex: String(fd.get("sex")),
      height_cm: Number(fd.get("height_cm")),
      weight_kg: Number(fd.get("weight_kg")),
      sport: String(fd.get("sport")),
      experience: String(fd.get("experience")),
      days_per_week: Number(fd.get("days_per_week")),
      time_per_session_min: Number(fd.get("time_per_session_min")),
      target_weeks: Number(fd.get("target_weeks")),

      goals: String(fd.get("goals") || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),

      equipment: String(fd.get("equipment") || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),

      // Optional
      availability,
      time_window: String(fd.get("time_window") || ""),

      sleep_hours: fd.get("sleep_hours") ? Number(fd.get("sleep_hours")) : null,
      stress_level: fd.get("stress_level") ? Number(fd.get("stress_level")) : null,
      hr_max: fd.get("hr_max") ? Number(fd.get("hr_max")) : null,

      injuries: String(fd.get("injuries") || ""),
      conditions: String(fd.get("conditions") || ""),
      red_flags: String(fd.get("red_flags") || ""),

      ftp: fd.get("ftp") ? Number(fd.get("ftp")) : null,
      run_5k_time: String(fd.get("run_5k_time") || ""),

      likes: String(fd.get("likes") || ""),
      dislikes: String(fd.get("dislikes") || ""),

      // Rechtliches
      consent_to_process_health_data: Boolean(fd.get("consent")),
      accept_disclaimer: Boolean(fd.get("disclaimer")),
    };

    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.message || data?.error || `HTTP ${res.status}`);
      } else {
        setPlan(data?.plan_markdown || "Kein Inhalt");
      }
    } catch (err: any) {
      setError(`Netzwerkfehler: ${err?.message || err}`);
    } finally {
      setLoading(false);
    }
  }

  async function downloadPDF() {
    if (!plan.trim()) return;
    try {
      const res = await fetch("/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markdown: plan }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "trainingsplan.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      alert("PDF konnte nicht erstellt werden: " + err?.message);
    }
  }

  return (
    <main className="wrap">
      <h1 className="title">Dein persönlicher Trainingsplan (kostenlos / ohne Registrierung)</h1>

      <form className="card" onSubmit={onSubmit}>
        {/* Basis */}
        <section className="section">
          <h2>Basis</h2>
          <div className="grid">
            <label className="field">
              <span>Alter</span>
              <input type="number" name="age" required min={13} max={100} />
            </label>
            <label className="field">
              <span>Geschlecht</span>
              <select name="sex">
                <option value="male">Männlich</option>
                <option value="female">Weiblich</option>
                <option value="diverse">Divers</option>
              </select>
            </label>
            <label className="field">
              <span>Größe (cm)</span>
              <input type="number" name="height_cm" required min={100} max={250} />
            </label>
            <label className="field">
              <span>Gewicht (kg)</span>
              <input type="number" name="weight_kg" required min={30} max={250} />
            </label>
            <label className="field">
              <span>Sportart</span>
              <input type="text" name="sport" required placeholder="z. B. Radsport, Laufen, Fitness" />
            </label>
            <label className="field">
              <span>Trainingsstand</span>
              <select name="experience">
                <option value="beginner">Anfänger</option>
                <option value="intermediate">Fortgeschritten</option>
                <option value="advanced">Profi</option>
              </select>
            </label>
            <label className="field">
              <span>Trainingshäufigkeit (Tage pro Woche)</span>
              <input type="number" name="days_per_week" required min={1} max={7} />
            </label>
            <label className="field">
              <span>Zeit pro Einheit (Min.)</span>
              <input type="number" name="time_per_session_min" required min={15} max={180} />
            </label>
            <label className="field">
              <span>Zielzeitraum (Anzahl der Wochen bis zum erreichen Deines Zieles)</span>
              <input type="number" name="target_weeks" required min={2} max={52} />
            </label>
            <label className="field">
              <span>Ziele (Mehrfachangabe durch Komma getrennt möglich)</span>
              <input type="text" name="goals" required placeholder="z. B. Ausdauer, Muskelaufbau, Gewicht verlieren" />
            </label>
            <label className="field col-2">
              <span>Equipment (Mehrfachangabe durch Komma getrennt möglich)</span>
              <input type="text" name="equipment" placeholder="z. B. Hanteln, TRX, Heimtrainer" />
            </label>
          </div>
        </section>

        {/* Verfügbarkeit */}
        <section className="section">
          <h2>Verfügbarkeit</h2>
          <div className="grid">
            <div className="field col-2">
              <span>Bevorzugte Tage</span>
              <div className="days">
                <label><input type="checkbox" name="avail_mo" /> Mo</label>
                <label><input type="checkbox" name="avail_di" /> Di</label>
                <label><input type="checkbox" name="avail_mi" /> Mi</label>
                <label><input type="checkbox" name="avail_do" /> Do</label>
                <label><input type="checkbox" name="avail_fr" /> Fr</label>
                <label><input type="checkbox" name="avail_sa" /> Sa</label>
                <label><input type="checkbox" name="avail_so" /> So</label>
              </div>
            </div>
            <label className="field col-2">
              <span>Bevorzugtes Zeitfenster</span>
              <input type="text" name="time_window" placeholder="z. B. 06:30–07:30, abends" />
            </label>
          </div>
        </section>

        {/* Gesundheit */}
        <section className="section">
          <h2>Gesundheit (optional)</h2>
          <div className="grid">
            <label className="field">
              <span>Schlaf (Std/Nacht)</span>
              <input type="number" name="sleep_hours" min={0} max={12} step="0.5" />
            </label>
            <label className="field">
              <span>Stress (1–5; 1=kein Stress, 5=hohes Stresslevel)</span>
              <input type="number" name="stress_level" min={1} max={5} />
            </label>
            <label className="field">
              <span>HRmax (=maximale Herzfrequenz)</span>
              <input type="number" name="hr_max" min={100} max={220} />
            </label>
            <label className="field col-2">
              <span>Erkrankungen/Medikation</span>
              <textarea name="conditions" rows={2} placeholder="optional" />
            </label>
            <label className="field col-2">
              <span>Verletzungen/Besonderheiten</span>
              <textarea name="injuries" rows={2} placeholder="optional" />
            </label>
            <label className="field col-2">
              <span>Red Flags (z. B. Brustschmerzen, jüngste OP, Schwangerschaft)</span>
              <textarea name="red_flags" rows={2} placeholder="Achtung: Bei Red Flags wird kein Plan erzeugt." />
            </label>
          </div>
        </section>

        {/* Leistung */}
        <section className="section">
          <h2>Aktuelle Leistung (optional)</h2>
          <div className="grid">
            <label className="field">
              <span>FTP (Watt, Rad)</span>
              <input type="number" name="ftp" min={50} max={500} />
            </label>
            <label className="field">
              <span>5-km-Zeit</span>
              <input type="text" name="run_5k_time" placeholder="z. B. 28:30" />
            </label>
          </div>
        </section>

        {/* Präferenzen */}
        <section className="section">
          <h2>Präferenzen</h2>
          <div className="grid">
            <label className="field col-2">
              <span>Mag ich</span>
              <input type="text" name="likes" placeholder="z. B. Ruderergometer, Outdoor" />
            </label>
            <label className="field col-2">
              <span>Mag ich nicht / No-Gos</span>
              <input type="text" name="dislikes" placeholder="z. B. Burpees, Sprünge" />
            </label>
          </div>
        </section>

        {/* Rechtliches + Aktion */}
        <section className="section">
          <div className="grid">
            <label className="check col-2">
              <input type="checkbox" name="consent" required />{" "}
              <span>Ich willige in die Verarbeitung (möglicher) Gesundheitsdaten zur Planerstellung ein.</span>
            </label>
            <label className="check col-2">
              <input type="checkbox" name="disclaimer" required />{" "}
              <span>Ich verstehe, dass dies keine medizinische Beratung ist.</span>
            </label>

            <div className="actions col-2">
              <button type="submit" disabled={loading}>
                {loading ? <span className="spinner" aria-label="Lädt..." /> : "Plan erstellen"}
              </button>
            </div>
          </div>
        </section>
      </form>

      {loading && (
        <div className="loading-box">
          <div className="spinner" />
          <span>Dein Plan wird erstellt…</span>
        </div>
      )}

      {error && <div className="alert">{error}</div>}

      {plan && (
        <section className="result">
          <h2>Generierter Plan</h2>
          <pre>{plan}</pre>
          <button onClick={downloadPDF}>Als PDF speichern</button>
        </section>
      )}

      {/* Styles nur für diese Seite */}
      <style jsx>{`
        .wrap { max-width: 980px; margin: 0 auto; padding: 24px; }
        .title { font-size: 28px; font-weight: 800; margin-bottom: 12px; }
        .card { border: 1px solid #e5e7eb; border-radius: 10px; background: #fff; }
        .section { padding: 16px; border-top: 1px solid #f3f4f6; }
        .section:first-of-type { border-top: 0; }
        .section h2 { font-size: 16px; font-weight: 700; margin: 0 0 10px; color: #111827; }

        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 16px; }
        .col-2 { grid-column: 1 / -1; }

        .field { display: flex; flex-direction: column; gap: 6px; }
        .field span { font-size: 14px; color: #374151; }
        .field input, .field select, .field textarea {
          width: 100%; box-sizing: border-box; border: 1px solid #d1d5db;
          border-radius: 8px; padding: 10px 12px; font-size: 14px; background: #fff;
        }
        .field textarea { resize: vertical; }

        /* === Nur diese 3 Regeln geändert/ergänzt für Mobile-Optimierung der Wochentage === */
        .days {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(84px, 1fr));
          gap: 10px;
          margin-top: 6px;
        }
        .days label {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;              /* größere Touch-Fläche */
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background: #fff;
          font-size: 14px;
          color: #374151;
        }
        .days input { width: 18px; height: 18px; }
        /* ============================================================================== */

        .check { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; }
        .check input { margin-top: 4px; }

        .actions { display: flex; justify-content: flex-end; }
        .actions button {
          background: #2563eb; color: #fff; border: none; border-radius: 10px;
          padding: 10px 16px; font-size: 14px; cursor: pointer;
        }
        .actions button:disabled { opacity: .6; cursor: not-allowed; }
        .actions button:hover:not(:disabled) { background: #1e4fd4; }

        .loading-box { display: flex; align-items: center; gap: 10px; margin-top: 12px; color: #374151; }
        .spinner {
          border: 3px solid #e5e7eb; border-top: 3px solid #2563eb;
          border-radius: 50%; width: 18px; height: 18px; animation: spin 1s linear infinite;
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }

        .alert {
          margin-top: 16px; padding: 12px 14px; background: #fee2e2; color: #b91c1c;
          border: 1px solid #fecaca; border-radius: 10px;
        }
        .result {
          margin-top: 20px; background: #f8fafc; border: 1px solid #e5e7eb;
          border-radius: 10px; padding: 16px;
        }
        .result h2 { margin: 0 0 10px; font-size: 18px; font-weight: 700; }
        .result pre {
          white-space: pre-wrap;
          font: 14px/1.5 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        }
        .result button { margin-top: 10px; background: #111827; color: #fff; border: 0; border-radius: 8px; padding: 8px 12px; }
        .result button:hover { background: #000; }

        @media (max-width: 760px) { .grid { grid-template-columns: 1fr; } }
      `}</style>
    </main>
  );
}
