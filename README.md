# Interier Windows – web v5 UX/profi

Tato verze propojuje služby a orientační ceny do jedné stránky `sluzby.html`. Samostatný `cenik.html` zůstává jen jako přesměrování kvůli starým odkazům.

## Struktura
- `index.html` – hlavní prodejní stránka
- `sluzby.html` – řešení + orientační ceny + proces
- `realizace.html` – ukázky realizací s filtrem
- `architekti.html` – spolupráce pro architekty/projektanty
- `kontakt.html` – formulář připravený pro Make webhook
- `style.css` – celý vzhled a responzivita
- `app.js` – mobilní menu, animace, filtr realizací, demo formulář

## Před ostrým spuštěním
1. Doplnit skutečný telefon, e-mail a adresu showroomu.
2. Vyměnit AI/render fotky za reálné realizace, detaily montáže, textilu a showroomu.
3. Potvrdit orientační ceny.
4. Napojit formulář na Make webhook a případně upravit `form action`.
5. Doplnit odkazy na Mottura CZ / Mottura katalogy tam, kde budou finální URL.
