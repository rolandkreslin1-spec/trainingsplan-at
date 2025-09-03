// app/page.tsx
"use client";

import { useState } from "react";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResult("");
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      setResult(json.plan || "Fehler bei der Erstellung des Plans");
    } catch (err) {
      setResult("Fehler bei der Erstellung des Plans");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px" }}>
      <h1 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: 20 }}>
        Dein Trainingsplan
      </h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Name */}
        <div>
          <label style={{ fontWeight: 600, display: "block" }}>Name</label>
          <input
            type="text"
            name="name"
            required
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: 4,
            }}
          />
        </div>

        {/* Alter */}
        <div>
          <label style={{ fontWeight: 600, display: "block" }}>Alter</label>
          <input
            type="number"
            name="age"
            min="13"
            max="100"
            required
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: 4,
            }}
          />
        </div>

        {/* Ziel */}
        <div>
          <label style={{ fontWeight: 600, display: "block" }}>Ziel</label>
          <select
            name="goal"
            required
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: 4,
            }}
          >
            <option value="ausdauer">Ausdauer verbessern</option>
            <option value="kraft">Kraft steigern</option>
            <option value="muskelaufbau">Muskelaufbau</option>
          </select>
        </div>

        {/* Verfügbarkeit */}
        <div>
          <label style={{ fontWeight: 600, display: "block", marginBottom: "8px" }}>
            Verfügbarkeit (Wochentage)
          </label>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
              gap: "10px",
              marginTop: "6px",
            }}
          >
            {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((day) => (
              <label
                key={day}
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <input type="checkbox" name={`avail_${day.toLowerCase()}`} /> {day}
              </label>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 20px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          {loading ? "Plan wird erstellt..." : "Plan erstellen"}
        </button>
      </form>

      {/* Ergebnis */}
      {result && (
        <div
          style={{
            marginTop: 20,
            padding: 16,
            background: "#f9f9f9",
            border: "1px solid #ddd",
            borderRadius: 4,
          }}
        >
          <h2 style={{ marginBottom: 10 }}>Dein Plan:</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>{result}</pre>
        </div>
      )}
    </div>
  );
}
