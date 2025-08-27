export default function ImpressumPage() {
  return (
    <main className="max-w-3xl mx-auto p-6 text-gray-800">
      <h1 className="text-2xl font-bold mb-4">Impressum</h1>

      <p><strong>Betreiber dieser Website:</strong><br />
      Roland Kreslin<br />
      Hütterweg 9b<br />
      4820 Bad Ischl<br />
      Österreich</p>

      <p className="mt-4"><strong>Kontakt:</strong><br />
      Tel.: +43 664 4056041<br />
      E-Mail: <a href="mailto:office@trainingsplan.at" className="text-blue-600 underline">office@trainingsplan.at</a></p>

      <p className="mt-4"><strong>Unternehmensgegenstand:</strong><br />
      Bereitstellung einer Online-Plattform zur Erstellung personalisierter Trainingspläne.</p>

      <p className="mt-4"><strong>Haftung für Inhalte:</strong><br />
      Alle Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität wird jedoch keine Gewähr übernommen.</p>

      <p className="mt-4"><strong>Gerichtsstand:</strong> Bad Ischl (Österreich)</p>
    </main>
  );
}
