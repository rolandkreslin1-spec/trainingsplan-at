export default function DatenschutzPage() {
  return (
    <main className="max-w-3xl mx-auto p-6 text-gray-800">
      <h1 className="text-2xl font-bold mb-4">Datenschutzerklärung</h1>

      <p>Der Schutz Ihrer persönlichen Daten ist uns ein besonderes Anliegen. Wir verarbeiten Ihre Daten daher ausschließlich auf Grundlage der gesetzlichen Bestimmungen (DSGVO, TKG 2003).</p>

      <h2 className="text-xl font-semibold mt-6">Verarbeitung personenbezogener Daten</h2>
      <p>Im Rahmen dieser Website werden folgende personenbezogene Daten verarbeitet:</p>
      <ul className="list-disc list-inside">
        <li>Stammdaten (Alter, Geschlecht, Größe, Gewicht)</li>
        <li>Gesundheitsdaten (Trainingsstand, Verletzungen, Erkrankungen, Schlaf, Stress) – nur mit ausdrücklicher Einwilligung</li>
        <li>Leistungsdaten (z. B. FTP-Wert, 5-km-Zeit)</li>
        <li>Präferenzen & Ziele (Sportart, gewünschte Dauer, Zielsetzung)</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6">Zweck der Verarbeitung</h2>
      <p>Die Daten werden ausschließlich zur Erstellung eines personalisierten Trainingsplans genutzt. Eine Speicherung über die Nutzung hinaus erfolgt nicht.</p>

      <h2 className="text-xl font-semibold mt-6">Weitergabe an Dritte</h2>
      <p>Zur Generierung des Trainingsplans wird die KI-Schnittstelle der Firma <strong>OpenAI, L.L.C. (USA)</strong> verwendet. Die von Ihnen angegebenen Daten können dabei an OpenAI übertragen werden. Eine Verarbeitung erfolgt auf Grundlage Ihrer ausdrücklichen Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO i. V. m. Art. 9 Abs. 2 lit. a DSGVO.</p>

      <h2 className="text-xl font-semibold mt-6">Speicherdauer</h2>
      <p>Die Daten werden nach Erstellung des Plans gelöscht und nicht dauerhaft gespeichert.</p>

      <h2 className="text-xl font-semibold mt-6">Ihre Rechte</h2>
      <p>Ihnen stehen nach DSGVO grundsätzlich folgende Rechte zu: Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit und Widerspruch. Sie können Ihre Einwilligung jederzeit widerrufen.</p>

      <p className="mt-4">Kontakt für Datenschutzanliegen: <a href="mailto:office@trainingsplan.at" className="text-blue-600 underline">office@trainingsplan.at</a></p>
    </main>
  );
}
