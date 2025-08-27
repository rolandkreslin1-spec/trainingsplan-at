# trainingsplan.at — MVP v3
Verbesserungen:
- Hübsches PDF mit Kopf (fettes Logo „trainingsplan.at“) und Fuß (Datum)
- PDF-Erzeugung mit `pdf-lib` auf `/api/pdf`
- Schönes Markdown-Rendering im Browser
- Planprompt strukturiert Überschriften & Tabelle

## Start
npm install
# .env.local mit OPENAI_API_KEY=sk-... anlegen
npm run dev

## PDF
Im UI auf „Als PDF speichern“ klicken — lädt trainingsplan.pdf herunter.
