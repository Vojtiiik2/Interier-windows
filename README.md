# Interier Windows

Statický prezentační web společnosti Interier Windows. Projekt používá čisté HTML, CSS a JavaScript bez build procesu a je připravený k nasazení na běžný webhosting nebo GitHub Pages.

## Struktura

- `index.html` – úvodní stránka
- `sluzby.html` – řešení a orientační ceny
- `realizace.html` – přehled realizací a filtrování
- `architekti.html` – spolupráce s architekty a designéry
- `kontakt.html` – kontakty a poptávkový formulář
- `cenik.html` – přesměrování na cenovou sekci stránky Řešení
- `style.css` – společné styly a responzivní rozvržení
- `app.js` – navigace, animace, filtrování, formulář a hero slider

## Lokální spuštění

Web nevyžaduje instalaci závislostí. Kvůli správnému chování formuláře a relativních cest je vhodné spustit lokální HTTP server, například:

```bash
python3 -m http.server 8080
```

Web bude dostupný na `http://localhost:8080`.

## Nasazení

Na FTP nahrajte celý obsah této složky při zachování adresářové struktury. Před ostrým spuštěním je nutné nahradit zástupné telefonní číslo, e-mail a adresu showroomu skutečnými údaji a ověřit cílovou Make.com automatizaci kontaktního formuláře.

## Údržba kódu

Zdrojové soubory používají jednotné odsazení dvěma mezerami, UTF-8 a LF konce řádků. Tato pravidla jsou uložená v `.editorconfig`, který podporuje většina běžných editorů. HTML, CSS, JavaScript a Markdown jsou formátované pomocí Prettier 3.3.3.
