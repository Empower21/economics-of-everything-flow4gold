export const mediaPlan={
  "concert": {
    "title": "The Economics of Everything — How it works",
    "steps": [
      {
        "view": "scene",
        "title": "The Economics of Everything",
        "card": {
          "en": "Run a concert. Test a decision. Understand the trade-off.",
          "de": "Ein Konzert. Eine Entscheidung. Ihre Folgen."
        },
        "values": {},
        "en": "Meet The Economics of Everything: an interactive economics lab built around everyday decisions. In this chapter, you are the concert promoter. Your mission is to put on a great night without losing money. This is a playable model, not a ticket shop or a sales forecast. Change an assumption, see the consequences, then ask why.",
        "de": "Das ist The Economics of Everything: ein interaktives Wirtschaftslabor für alltägliche Entscheidungen. In diesem Kapitel bist du Konzertveranstalter. Deine Mission: ein großartiger Abend ohne Verlust. Dies ist ein spielbares Modell, kein Ticketshop und keine Verkaufsprognose. Ändere eine Annahme, beobachte die Folgen und frage nach dem Warum.",
        "titleDe": "The Economics of Everything"
      },
      {
        "view": "mixer",
        "title": "01 / Work the levers",
        "card": {
          "en": "Drag a fader or type a number. Start with ticket price.",
          "de": "Regler bewegen oder Zahl eingeben. Starte beim Ticketpreis."
        },
        "values": {},
        "en": "Start in Mix Your Margins. Drag the ticket-price fader or type an exact number. The second fader sets venue capacity. The animated dance floor and five signs turn your inputs into guests, revenue, costs and profit. At twenty dollars, our example has a hundred and fifty guests and seven hundred and fifty dollars profit.",
        "de": "Starte unter Mixe deine Gewinne. Bewege den Ticketpreis-Regler oder gib eine genaue Zahl ein. Der zweite Regler bestimmt die Saalgröße. Tanzfläche und fünf Anzeigen übersetzen deine Eingaben in Gäste, Umsatz, Kosten und Gewinn. Bei zwanzig Dollar kommen im Beispiel hundertfünfzig Gäste. Der Gewinn beträgt siebenhundertfünfzig Dollar.",
        "titleDe": "01 / Nutze die Regler"
      },
      {
        "view": "scene",
        "title": "02 / Price changes demand",
        "card": {
          "en": "$20 → $30 · 150 → 100 guests · $750 → $1,000 profit",
          "de": "$20 → $30 · 150 → 100 Gäste · $750 → $1.000 Gewinn"
        },
        "values": {
          "ticketPrice": 30
        },
        "en": "Now raise the price to thirty dollars. In this model, fewer people buy: attendance falls to one hundred. Revenue stays at three thousand dollars, but per-guest costs fall, so profit rises to one thousand. That is price elasticity in action. A bigger crowd and a better business are not always the same thing.",
        "de": "Erhöhe den Preis auf dreißig Dollar. Im Modell kaufen nun weniger Menschen: Die Gästezahl sinkt auf hundert. Der Umsatz bleibt bei dreitausend Dollar, doch die Kosten je Gast entfallen für die fehlenden Gäste. Der Gewinn steigt auf tausend Dollar. Das zeigt Preiselastizität. Mehr Publikum bedeutet nicht automatisch mehr Gewinn.",
        "titleDe": "02 / Preis verändert Nachfrage"
      },
      {
        "view": "scene",
        "title": "03 / Capacity is not demand",
        "card": {
          "en": "1,000 places · 150 guests · $1,250 loss",
          "de": "1.000 Plätze · 150 Gäste · $1.250 Verlust"
        },
        "values": {
          "ticketPrice": 20,
          "capacity": 1000
        },
        "en": "Next, return the price to twenty and increase capacity to one thousand. You still have only a hundred and fifty buyers. Venue costs rise, and profit becomes a twelve-hundred-and-fifty-dollar loss. Capacity is a constraint, not a demand generator. Use this lever when testing the cost of expanding before assuming the room will fill.",
        "de": "Setze den Preis wieder auf zwanzig und erhöhe die Kapazität auf tausend. Es bleiben hundertfünfzig Käufer. Die Saalkosten steigen, und das Ergebnis wird zu einem Verlust von eintausendzweihundertfünfzig Dollar. Kapazität begrenzt den Absatz, erzeugt aber keine Nachfrage. Prüfe damit die Kosten einer Erweiterung, bevor du ein volles Haus erwartest.",
        "titleDe": "03 / Kapazität ist keine Nachfrage"
      },
      {
        "view": "costs",
        "title": "04 / Follow the money",
        "card": {
          "en": "Revenue − total costs = profit. Inspect what you pay for.",
          "de": "Umsatz − Gesamtkosten = Gewinn. Prüfe die Ausgaben."
        },
        "values": {
          "capacity": 200
        },
        "en": "Open the cost breakdown to see where the money goes. In Add a variable, expose stage and sound, venue costs, cost per guest, promotion or sponsorship. Change one assumption at a time. Fixed and variable costs explain why revenue is not profit. The break-even message helps you see what must change to cover your costs.",
        "de": "Öffne die Kostenübersicht und verfolge das Geld. Über Variable hinzufügen kannst du Bühne und Ton, Saalkosten, Kosten je Gast, Werbung oder Sponsoring einblenden. Ändere jeweils eine Annahme. Fixe und variable Kosten erklären, warum Umsatz nicht Gewinn ist. Der Break-even-Hinweis zeigt, was zur Kostendeckung nötig ist.",
        "titleDe": "04 / Verfolge das Geld"
      },
      {
        "view": "audience",
        "title": "05 / Make assumptions explicit",
        "card": {
          "en": "Estimated audience or manual attendance. Neither is a forecast.",
          "de": "Geschätztes Publikum oder eigene Gästezahl. Keine Prognose."
        },
        "values": {},
        "en": "Use the Audience selector to choose price-based demand or set attendance yourself. Venue setup loads illustrative assumptions. Promotion spending and its assumed audience boost are separate: spending does not guarantee buyers. These controls let you test uncertainty, rather than disguise it as a prediction. All financial amounts remain in U.S. dollars.",
        "de": "Wähle unter Publikum zwischen preisabhängiger Nachfrage und einer selbst festgelegten Gästezahl. Das Veranstaltungsprofil lädt Beispielannahmen. Werbeausgaben und angenommener Nachfragezuwachs sind getrennt: Ausgaben garantieren keine Käufer. So prüfst du Unsicherheit, statt sie als Vorhersage zu tarnen. Alle Geldbeträge bleiben in US-Dollar.",
        "titleDe": "05 / Annahmen sichtbar machen"
      },
      {
        "view": "planner",
        "title": "06 / Check the competing bill",
        "card": {
          "en": "Atlanta · Berlin · Kingston, Jamaica / Choose a date, then check.",
          "de": "Atlanta · Berlin · Kingston, Jamaika / Datum wählen und prüfen."
        },
        "values": {},
        "en": "Before choosing your date, open Who else is on the bill. Pick Atlanta, Berlin or Kingston, Jamaica, choose a date, then press Check this date. Simulation mode uses clearly labeled made-up events; live mode requests sourced research. This introduces competition for scarce audience attention. Listings do not automatically change attendance: decide which assumptions you want to test.",
        "de": "Prüfe vor der Terminwahl, wer sonst noch spielt. Wähle Atlanta, Berlin oder Kingston in Jamaika, ein Datum und dann Datum prüfen. Der Simulationsmodus zeigt gekennzeichnete erfundene Veranstaltungen; der Live-Modus recherchiert mit Quellen. Hier geht es um Wettbewerb um begrenzte Aufmerksamkeit. Einträge ändern die Gästezahl nicht automatisch: Entscheide selbst, welche Annahmen du testen möchtest.",
        "titleDe": "06 / Prüfe die Konkurrenz"
      },
      {
        "view": "comparison",
        "title": "07 / Compare before you commit",
        "card": {
          "en": "Save this mix → change one input → compare outcomes.",
          "de": "Mix speichern → eine Eingabe ändern → Ergebnisse vergleichen."
        },
        "values": {},
        "en": "Save this mix before your next experiment. Then change one input and compare the saved and current results. Restore the saved mix to return to your baseline, or reset the concert to start over. This is the economic habit we want to teach: compare alternatives, make assumptions visible, and understand what you give up for what you gain.",
        "de": "Speichere deinen Mix vor dem nächsten Experiment. Ändere eine Eingabe und vergleiche gespeicherte und aktuelle Ergebnisse. Lade den Mix, um zur Ausgangslage zurückzukehren, oder setze das Konzert zurück. Das ist die wirtschaftliche Denkweise dahinter: Alternativen vergleichen, Annahmen sichtbar machen und verstehen, was du für einen Vorteil aufgibst.",
        "titleDe": "07 / Vergleiche Alternativen"
      },
      {
        "view": "coach",
        "title": "08 / Ask why",
        "card": {
          "en": "Type a question or use the microphone. Enable Speak replies to listen.",
          "de": "Frage tippen oder Mikrofon nutzen. Antworten vorlesen aktivieren."
        },
        "values": {},
        "en": "When a result surprises you, ask your concert coach. Type a question, choose a suggested question, or use the microphone, review the transcript and send it. Enable Speak replies to hear the answer. The coach explains this bounded concert model using your current scenario, helping connect the numbers to the economic idea.",
        "de": "Wenn dich ein Ergebnis überrascht, frage den Konzert-Coach. Tippe eine Frage, wähle einen Vorschlag oder nutze das Mikrofon, prüfe den erkannten Text und sende ihn. Aktiviere Antworten vorlesen, um zuzuhören. Der Coach erklärt dieses begrenzte Konzertmodell anhand deines aktuellen Szenarios und verbindet Zahlen mit wirtschaftlichen Zusammenhängen.",
        "titleDe": "08 / Frage nach dem Warum"
      },
      {
        "view": "model",
        "title": "09 / The engine behind the experience",
        "card": {
          "en": "Deterministic math · Blender + Babylon.js · n8n + TypeSafe AI",
          "de": "Berechenbare Formeln · Blender + Babylon.js · n8n + TypeSafe AI"
        },
        "values": {},
        "en": "For the builders in the room: shared deterministic formulas own the money. Blender assets and Babylon render the world. One n8n workflow handles coaching and event research; TypeSafe AI classifies concert questions, and the coach selects approved explanations. AI helps interpret the model; it does not invent the financial results. That separation makes the learning experience inspectable.",
        "de": "Für die Entwickler im Raum: Gemeinsame deterministische Formeln berechnen das Geld. Blender-Assets und Babylon stellen die Welt dar. Ein n8n-Workflow übernimmt Coaching und Event-Recherche. TypeSafe AI ordnet Konzertfragen ein; der Coach wählt freigegebene Erklärungen. KI hilft bei der Interpretation, erfindet aber keine Finanzergebnisse. Diese Trennung macht das Lernmodell nachvollziehbar.",
        "titleDe": "09 / Die Technik dahinter"
      },
      {
        "view": "scene",
        "title": "Your next move: test one decision",
        "card": {
          "en": "The Economics of Everything / Learn the principle. Use it beyond the concert.",
          "de": "The Economics of Everything / Das Prinzip verstehen. Im Alltag anwenden."
        },
        "values": {
          "ticketPrice": 20,
          "capacity": 200
        },
        "en": "The Economics of Everything starts with a familiar experience and makes its hidden economics visible. The concert is the working chapter: demand, constraints, costs and trade-offs you can manipulate, not just read about. Try your first decision now. Move the price fader, watch the result, and ask why. The outcome is not a perfect concert forecast. It is a better economic question.",
        "de": "The Economics of Everything beginnt mit einer vertrauten Erfahrung und macht die Wirtschaft dahinter sichtbar. Das Konzert ist das funktionierende Kapitel: Nachfrage, Grenzen, Kosten und Abwägungen zum Ausprobieren statt nur zum Lesen. Teste jetzt eine Entscheidung. Bewege den Preisregler, beobachte das Ergebnis und frage warum. Das Ziel ist keine perfekte Konzertprognose, sondern eine bessere wirtschaftliche Frage.",
        "titleDe": "Teste jetzt eine Entscheidung"
      }
    ]
  }
};
