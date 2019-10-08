# Kapla #

## Projektbeschreibung ##

Mit Kapla verwaltet die Abteilung Recht des AWEL (Amt für Abfall, Wasser, Energie und Luft) des Kantons Zürich ihre Geschäfte.

Erfasst werden:

- Rechtsgeschäfte
- Rekurse, Beschwerden
- Parlamentarische Vorstösse
- Vernehmlassungen und Anhörungen
- Strafverfahren von besonderem Interesse

Kapla gibt eine Übersicht über:

- alle Geschäfte,
- den aktuellen Stand der Bearbeitung,
- wer sie bearbeitet,
- wo die Akten liegen,
- Fristen

Mehr Info hier: [Projektbeschreibung.pdf](https://github.com/barbalex/kapla3/raw/master/app/etc/Projektbeschreibung.pdf)

## Technische Umsetzung

Kapla löst ein FileMaker Projekt ab.
Es ist in JavaScript geschrieben und benutzt unter anderem:

- [sqlite](http://sqlite.org): simpler lagern Daten nimmer :-)
- [electron](http://electron.atom.io): JavaScript-Anwendung lokal installieren
- [nodejs](https://nodejs.org): JavaScript kommuniziert mit dem PC
- [React](https://facebook.github.io/react): die Benutzeroberfläche ist eine Funktion der Anwendungs-Daten! Und erst noch modular
- [MobX](https://github.com/mobxjs/mobx): Anwendungs-Daten managen wie ein Profi
- [recompose](https://github.com/acdlite/recompose): Logik sauber von Daten und Benutzeroberfläche trennen
- [styled components](https://github.com/styled-components/styled-components): Styling für Module
- [CSS Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/grid): anspruchsvolle Layouts gestalten

Ich will diese Kombination nachfolgend der Einfachheit halber "electron-Anwendung" nennen. Und FileMaker ist bei der Erwähnung von Access immer mit gemeint.

## Electron- versus Access-Anwendung

Für die BenutzerInnen:

- die Benutzeroberfläche kann so einfach und intuitiv gebaut werden, wie es das Budget und das Knowhow des Entwicklers zulassen. Im Gegensatz zu Access gibt es kaum Einschränkungen
- beispielsweise wäre die in Kapla verwendete Kombination von Listen- und Detailansicht mit Access in dieser Art nicht möglich gewesen

Im Betrieb:

- installiert wird die Anwendung wahlweise durch simples Kopieren eines Dateiordners oder mit Hilfe einer Installations-Routine
- electron-Anwendung und sqlite-Datei bringen alles mit: Ausser dem Betriebssystem gibt es keine Software-Abhängigkeiten!
- electron-Anwendung und sqlite-Datei funktionieren auf allen aktuellen 64bit-Versionen von Windows. Daher kann man davon ausgehen, dass sie noch längere Zeit unverändert weiter benutzt werden können
- electron-Anwendungen können so gebaut werden, dass sie sich bei Vorliegen eines Updates automatisch aktualisieren
- es wird ausschliesslich open source Software verwendet. Daher fallen keine Lizenzgebühren an
- weder Datenbank noch Anwendung brauchen Unterhalt. Das gilt natürlich nur, solange nicht sehr viele Benutzer gleichzeitig schreibend auf die Datenbank zugreifen. In diesem Fall müsste statt sqlite ein Datenbank-Server benutzt werden

Für die Entwicklung:

- die verwendeten Technologien sind viel moderner und geben dem Entwickler viel mehr Möglichkeiten als Access. Anwendungen können massgeschneidert(er) und leistungsfähig(er) gebaut werden
- was diese Technologien besonders auszeichnet und meines Wissens in keiner anderen Programmiersprache bisher existiert (aber bestimmt bald nachgeholt wird):
  - die saubere Trennung von Daten und Logik
  - die Benutzeroberfläche als eine Funktion der Daten
  - dass Daten immer nur in einer Richtung fliessen ([flux](https://github.com/facebook/flux/tree/master/examples/flux-concepts#overview))
- ab einer gewissen Komplexität sind die verwendeten Werkzeuge viel besser geeignet, um eine Anwendung zu entwickeln. Mit der rasanten technologischen Entwicklung sinkt die minimale Komplexität, ab der sich ihre Verwendung lohnt
- ganz einfache Anwendungen sind in Access schneller und einfacher gebaut
- das Know-How für die Entwicklung moderner JavaScript-Anwendungen inklusive einer komplexen Entwicklungsumgebung wird vorausgesetzt. Im Gegensatz zu Access können (noch-)Nicht-Entwickler (momentan noch) kaum eine electron-Anwendung aufbauen. Bei der rasanten Entwicklung im ganzen JavaScript-Ökosystem und angesichts der Tatsache, dass z.B. Access schon lange nicht mehr wesentlich weiter entwickelt wurde, könnte sich das aber ändern
- JavaScript ist heute schon weit verbreitet und stark im Kommen. Entwickler mit dem nötigen Know-How um eine electron-Anwendung zu bauen oder unterhalten sind verhältnismässig einfach zu finden

Für den künftigen Unterhalt/Ausbau:

- im Prinzip ist nach Bereinigung der Kinderkrankheiten kaum je Unterhalt nötig. Im Gegensatz zu Web-Anwendungen kann darauf verzichtet werden, die verwendeten Fremd-Module laufend zu aktualisieren. Die Anwendung wird ja hinter der Firmen-Firewall betrieben
- aufgrund der modernen Architektur ist eine electron-Anwendung im Bedarfsfall für professionelle JavaScript-Entwickler wesentlich einfacher zu unterhalten
- electron-Anwendungen können wenn nötig zu Server-Client-Anwendungen oder gar Web-Applikationen ausgebaut werden, wobei der grösste Teil des Codes unangetastet bleibt
- die Funktionalität kann wenn gewünscht mit automatisierten Test hinterlegt werden, was die Unterhalt- und Erweiterbarkeit nochmals stark verbessert

Für die Allgemeinheit:

In node.js und JavaScript gibt es eine starke Tradition von open source und Arbeiten mit kleinen Modulen, die nur etwas machen, aber das richtig. Entsprechend bestehen JavaScript-Anwendungen so weit wie möglich aus solchen freien Modulen. Und sie werden schon während der Entwicklung auf Plattformen publiziert, die eine offene Zusammenarbeit ermöglichen. In diesem Sinne steht der Code von Kapla auch auf GitHub zur freien Verfügung. Und ich habe während der Entwicklung von Kapla mit mehreren Entwicklern von verwendeten Modulen zusammengearbeitet, um Fehler in diesen Modulen zu korrigieren oder neue Fähigkeiten zu ergänzen. Am Ende profitieren alle :-)

**Fazit:**

Ich habe früher diverse teilweise recht anspruchsvolle Access-Anwendungen gebaut, danach Web-Anwendungen und nun mit Kapla die erste electron-Anwendung.

- Access würde ich - in meiner jetzigen Rolle als externer Entwickler und mit meinem JavaScript Know-How - nur noch für _sehr_ einfache Anwendungsfälle benutzen
- Access ist technisch gesehen am ehesten geeignet, wenn die Anwender den Umgang damit gewohnt sind und daher auf einen grossen Teil der Funktionalität einer eigentlichen Anwendung verzichtet werden kann (Automatisierung, Benutzerführung, individualisierte Benutzeroberfläche). In diesem Fall stellt die Access-Anwendung vor allem die benötigte Datenstruktur inklusive Abfragen bereit
- Access ist ideal, wenn:
  - die Anwendung technisch keine zu hohen Anforderungen stellt
  - und dank ihrer einfachen Entwicklungsumgebung von einer technisch versierten firmen- bzw. abteilungsinternen Person entwickelt werden kann, die das zu lösende Problem sehr gut versteht und dank ihrer dauernden Anwesenheit die Anwendung schrittweise verbessern kann.<br/>Das war meine frühere Rolle und ich finde sie nach wie vor ideal. Denn das grösste Problem beim Aufbau einer neuen Anwendung ist die Kommunikation zwischen den künftigen Benutzern und den Entwicklern
- wird eine intuitive, minimalistische und übersichtliche Benutzeroberfläche benötigt, ist die Grenze schnell erreicht, ab der sich eine electron-Anwendung lohnt
- eine JavaScript-Anwendung drängt sich geradezu auf, wenn es gut möglich ist, dass sie später erweitert wird, von sehr vielen Benutzern genutzt wird oder gar über das Internet

## Entwicklungsumgebung installieren ##
```
# Ordner schaffen, z.B. "kapla"
cd kapla
git clone https://github.com/barbalex/kapla3.git
yarn
yarn dev
```

## Release produzieren ##
```
cd kapla
yarn package-win
```