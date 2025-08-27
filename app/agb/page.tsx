export default function AgbPage() {
  const today = new Date().toLocaleDateString("de-AT");

  const H1: React.CSSProperties = { fontSize: 28, fontWeight: 800, marginBottom: 12 };
  const H2: React.CSSProperties = { fontSize: 20, fontWeight: 700, marginTop: 18 };
  const UL: React.CSSProperties = { paddingLeft: 20 };

  return (
    <div>
      <h1 style={H1}>Allgemeine Geschäftsbedingungen (AGB)</h1>
      <p><strong>Stand:</strong> {today}</p>

      <h2 style={H2}>1. Geltungsbereich</h2>
      <p>
        Diese AGB gelten für alle Nutzungen der Website <strong>trainingsplan.at</strong> sowie für alle darüber
        angebotenen Leistungen, insbesondere die Erstellung personalisierter Trainingspläne („Leistungen“).
        Abweichende Bedingungen der Nutzer:innen finden keine Anwendung, außer wir stimmen ausdrücklich schriftlich zu.
      </p>

      <h2 style={H2}>2. Anbieter / Kontakt</h2>
      <p>
        Roland Kreslin, Hütterweg 9b, 4820 Bad Ischl, Österreich. Tel.: +43 664 4056041,
        E-Mail: <a href="mailto:office@trainingsplan.at">office@trainingsplan.at</a>.
        Weitere Angaben im <a href="/impressum">Impressum</a>.
      </p>

      <h2 style={H2}>3. Leistungsbeschreibung</h2>
      <ul style={UL}>
        <li>Generierung von Trainingsplänen mit Hilfe von KI auf Basis der Nutzereingaben.</li>
        <li>Inhalte dienen Information & Motivation; sie ersetzen keine medizinische Behandlung.</li>
        <li>Umfang, Laufzeit und Funktionsweise sind auf der Website beschrieben.</li>
      </ul>

      <h2 style={H2}>4. Registrierung & Nutzung</h2>
      <ul style={UL}>
        <li>Wahrheitsgemäße Angaben; Gesundheitsdaten nur mit ausdrücklicher Einwilligung.</li>
        <li>Keine Weitergabe von Zugängen an Dritte.</li>
        <li>Sperre/Löschung rechtswidriger Inhalte bzw. bei AGB-Verstößen möglich.</li>
      </ul>

      <h2 style={H2}>5. Preise & Zahlung</h2>
      <p>
        Sofern kostenpflichtige Leistungen angeboten werden, gelten die auf der Website ausgewiesenen Preise inkl. USt
        (sofern anwendbar). Abrechnung über die angegebenen Zahlungswege; Rechnungen elektronisch.
      </p>

      <h2 style={H2}>6. Widerrufsrecht (Verbraucher:innen)</h2>
      <p>
        Grundsätzlich 14 Tage (FAGG). <strong>Digitale Leistungen:</strong> Widerruf erlischt, wenn Sie (i) dem
        vorzeitigen Beginn ausdrücklich zustimmen und (ii) bestätigen, dass Sie den Verlust des Widerrufsrechts kennen
        (§ 18 Abs 1 Z 11 FAGG).
      </p>

      <h2 style={H2}>7. Gesundheits-Hinweise & Haftungsausschluss</h2>
      <ul style={UL}>
        <li>Kein Ersatz für ärztliche Untersuchung/Behandlung; bei Beschwerden vorher abklären.</li>
        <li>Training in eigener Verantwortung; Haftung (außer Personenschäden) nur bei Vorsatz/grober Fahrlässigkeit.</li>
        <li>Bei „Red Flags“ (z. B. Brustschmerz, Schwindel, frische OP) Nutzung unterlassen.</li>
      </ul>

      <h2 style={H2}>8. Verfügbarkeit & Änderungen</h2>
      <ul style={UL}>
        <li>Hohe Verfügbarkeit wird angestrebt, Unterbrechungsfreiheit kann nicht zugesichert werden.</li>
        <li>Anpassungen bei berechtigtem Interesse (Sicherheit, Weiterentwicklung) möglich.</li>
      </ul>

      <h2 style={H2}>9. Rechte an Inhalten / Lizenz</h2>
      <ul style={UL}>
        <li>Plattforminhalte sind urheberrechtlich geschützt.</li>
        <li>Für generierte Pläne: einfache, nicht übertragbare Lizenz zur privaten Nutzung.</li>
        <li>Kommerzielle Weitergabe/Verkauf ohne Zustimmung unzulässig.</li>
      </ul>

      <h2 style={H2}>10. Datenschutz</h2>
      <p>
        Details in der <a href="/datenschutz">Datenschutzerklärung</a>; Verarbeitung u. a. auf Basis der Einwilligung
        (Art. 6 Abs. 1 lit. a, Art. 9 Abs. 2 lit. a DSGVO).
      </p>

      <h2 style={H2}>11. Gewährleistung & Haftung</h2>
      <ul style={UL}>
        <li>Keine Gewähr für das Erreichen individueller Ziele.</li>
        <li>Haftung – außer bei Personenschäden – auf Vorsatz/grobe Fahrlässigkeit beschränkt.</li>
        <li>Dienste Dritter (z. B. KI-Provider) unterliegen deren Bedingungen.</li>
      </ul>

      <h2 style={H2}>12. Laufzeit & Kündigung</h2>
      <ul style={UL}>
        <li>Unentgeltliche Nutzung jederzeit kündbar.</li>
        <li>Entgeltliche Abos gem. Laufzeiten/Kündigungsfristen im Bestellprozess.</li>
        <li>Fristlose Kündigung aus wichtigem Grund (z. B. Rechtsverstöße) möglich.</li>
      </ul>

      <h2 style={H2}>13. Streitbeilegung / Gerichtsstand</h2>
      <ul style={UL}>
        <li>Österreichisches Recht, ohne Kollisionsnormen/UN-Kaufrecht.</li>
        <li>Gerichtsstand – soweit zulässig – Bad Ischl; für Verbraucher:innen gesetzlicher Gerichtsstand.</li>
        <li>EU-OS-Plattform: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noreferrer">ec.europa.eu/consumers/odr</a></li>
      </ul>

      <h2 style={H2}>14. Änderungen dieser AGB</h2>
      <p>Bei berechtigten Gründen (Gesetz, Funktionen) Anpassungen möglich; wesentliche Änderungen werden mitgeteilt.</p>

      <h2 style={H2}>15. Kontakt</h2>
      <p><a href="mailto:office@trainingsplan.at">office@trainingsplan.at</a></p>
    </div>
  );
}
