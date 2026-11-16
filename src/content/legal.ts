import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/format";

/**
 * Juridische teksten voor de webshop.
 *
 * Bedrijfs-, contact- en verzendgegevens komen uit `siteConfig`. Een gegeven dat
 * daar nog `null` is, wordt hier weggelaten in plaats van verzonnen.
 * Deze teksten zijn geen juridisch advies.
 */
export type LegalSection = {
  title: string;
  body: string[];
};

export type LegalDoc = {
  title: string;
  intro: string;
  sections: LegalSection[];
};

type LegalDocKey = "verzending" | "voorwaarden" | "privacy";

const { company, contact, shipping } = siteConfig;

const shopName = siteConfig.name;
const companyName = company.legalName ?? shopName;
const contactLine = contact.email
  ? `via ${contact.email}`
  : "via de gegevens op onze contactpagina";

const present = (lines: (string | null | false)[]) => lines.filter((l): l is string => Boolean(l));

const companyDetails = present([
  `Bedrijfsnaam: ${companyName}`,
  company.address && `Vestigingsadres: ${company.address}`,
  contact.email && `E-mailadres: ${contact.email}`,
  contact.phone && `Telefoonnummer: ${contact.phone}`,
  company.kvk && `KvK-nummer: ${company.kvk}`,
  company.btw && `Btw-identificatienummer: ${company.btw}`,
]);

const shippingCost =
  `Verzending kost ${formatPrice(shipping.costCents)} per bestelling.` +
  (shipping.freeFromCents !== null
    ? ` Vanaf een bestelbedrag van ${formatPrice(shipping.freeFromCents)} verzenden we gratis.`
    : "");

export const legal: Record<LegalDocKey, LegalDoc> = {
  verzending: {
    title: "Verzending & Retourneren",
    intro:
      "Elke bestelling maken we met de hand en met zorg. Hier lees je hoe verzending, levertijd en retourneren werken, en wat je kunt doen als iets niet naar wens is.",
    sections: [
      {
        title: "Verwerking en levertijd",
        body: [
          shipping.leadTime ??
            "Onze producten worden met de hand gemaakt. De verwachte levertijd staat bij het product.",
          "Loopt je bestelling onverwacht vertraging op, dan laten we je dat zo snel mogelijk weten. Je houdt daarbij je wettelijke rechten bij een te late levering.",
        ],
      },
      {
        title: "Verzendkosten en bezorging",
        body: [
          "We verzenden naar Nederland en België.",
          `${shippingCost} De verzendkosten zie je altijd in de winkelwagen voordat je betaalt.`,
          "Zodra je bestelling is verzonden, laten we je dat per e-mail weten. Is de zending te volgen, dan krijg je de track-en-tracecode erbij.",
          "Het risico van beschadiging of verlies onderweg ligt bij ons, totdat jij of iemand die je daarvoor hebt aangewezen het pakket heeft ontvangen.",
        ],
      },
      {
        title: "Gepersonaliseerde producten",
        body: [
          "Een geboortelijst maken we speciaal voor jou, met de naam, geboortedatum, tijd, het gewicht en de lengte die je opgeeft.",
          "Voor producten die volgens jouw specificaties zijn gemaakt en duidelijk voor één persoon bestemd zijn, geldt het wettelijke herroepingsrecht niet. Je kunt een gepersonaliseerd product daarom niet zonder reden retourneren.",
          "Controleer namen, datums en spelling goed voordat je bestelt.",
          `Zie je na het bestellen toch een fout? Neem dan zo snel mogelijk contact met ons op ${contactLine}. Zolang we nog niet aan je bestelling zijn begonnen, passen we de gegevens graag aan.`,
          "Deze uitzondering geldt niet als het product beschadigd is of als wij een fout hebben gemaakt. Je wettelijke rechten blijven dan gewoon gelden.",
        ],
      },
      {
        title: "Niet-gepersonaliseerde producten retourneren",
        body: [
          "Voor producten die niet op maat zijn gemaakt heb je 14 dagen bedenktijd vanaf de dag van ontvangst. Binnen die termijn kun je de aankoop zonder opgave van reden herroepen.",
          `Laat ons binnen die 14 dagen ${contactLine} weten dat je de aankoop wilt herroepen. Je mag daarvoor het Europese modelformulier voor herroeping gebruiken, maar dat hoeft niet.`,
          "Na je melding heb je nog 14 dagen om het product terug te sturen. Het retouradres krijg je van ons bij de bevestiging van je melding.",
          "Je mag het product bekijken en beoordelen zoals je dat in een winkel zou doen. Gebruik je het verder dan daarvoor nodig is, dan kunnen we de waardevermindering in rekening brengen.",
          "De kosten van het terugsturen zijn voor jouw rekening. Hebben wij een verkeerd of gebrekkig product geleverd, dan betalen wij de retourkosten.",
        ],
      },
      {
        title: "Terugbetaling",
        body: [
          "Na een geldige herroeping betalen we het aankoopbedrag binnen 14 dagen na je melding terug, inclusief de standaardverzendkosten van de oorspronkelijke bestelling.",
          "We mogen met terugbetalen wachten totdat we het product terug hebben, of totdat je hebt aangetoond dat je het hebt verstuurd.",
          "Je krijgt het bedrag terug via de betaalmethode waarmee je hebt betaald. Daarvoor rekenen we geen kosten.",
        ],
      },
      {
        title: "Beschadigd, verkeerd of onvolledig ontvangen",
        body: [
          "We verpakken elke bestelling zorgvuldig. Toch kan er onderweg of bij het maken iets misgaan.",
          `Heb je een beschadigd, verkeerd of onvolledig product ontvangen? Neem dan contact met ons op ${contactLine}. Met een foto en je bestelnummer kunnen we je het snelst helpen.`,
          "Voldoet het product niet aan wat je ervan mocht verwachten, dan zorgen we kosteloos voor herstel of vervanging. Is dat niet mogelijk, dan krijg je je geld terug.",
        ],
      },
      {
        title: "Contact over je bestelling",
        body: [
          `Heb je een vraag over je levering, de personalisatie of een retour? Je bereikt ons ${contactLine}.`,
          "Vermeld je bestelnummer, dan kunnen we je sneller helpen.",
        ],
      },
    ],
  },

  voorwaarden: {
    title: "Algemene Voorwaarden",
    intro: `Deze voorwaarden gelden voor elke bestelling bij ${shopName}. Zo weet je vooraf wat je van ons kunt verwachten en welke rechten je hebt.`,
    sections: [
      {
        title: "Bedrijfsgegevens",
        body: companyDetails,
      },
      {
        title: "Toepasselijkheid",
        body: [
          `Deze voorwaarden gelden voor elk aanbod van ${shopName} en voor elke overeenkomst die via deze webshop tot stand komt.`,
          "Je kunt de voorwaarden op deze pagina altijd nalezen en opslaan of afdrukken via je browser.",
          "Is een bepaling in strijd met dwingend consumentenrecht, dan gaat de wet voor.",
        ],
      },
      {
        title: "Producten en aanbod",
        body: [
          "We omschrijven en tonen onze producten zo nauwkeurig mogelijk.",
          "Onze producten zijn handgemaakt. Daardoor kunnen kleine verschillen in afwerking en plaatsing voorkomen. Kleuren kunnen op je scherm iets anders lijken dan in het echt.",
          "Zulke verschillen doen niets af aan de kwaliteit die je op basis van het aanbod mag verwachten.",
        ],
      },
      {
        title: "Bestellen en overeenkomst",
        body: [
          "Je bestelt door een product te kiezen, bij een gepersonaliseerd product de gegevens in te vullen en de bestelling af te rekenen. De overeenkomst komt tot stand zodra je betaling is gelukt.",
          "Voordat je betaalt, zie je een overzicht van je bestelling en kun je je gegevens nog aanpassen.",
          "Na het afrekenen krijg je per e-mail een bevestiging met je bestelnummer en een overzicht van je bestelling.",
          "Ontbreekt er informatie die we nodig hebben om je product te maken, dan nemen we contact met je op.",
          "Kunnen we een bestelling niet uitvoeren, dan laten we je dat weten en betalen we het volledige bedrag terug.",
        ],
      },
      {
        title: "Prijzen en betalen",
        body: [
          "Alle prijzen zijn in euro en inclusief btw.",
          "Verzendkosten zie je in de winkelwagen voordat je betaalt. Na het afrekenen komen er geen kosten meer bij.",
          "Je betaalt online met een van de betaalmethoden die bij het afrekenen worden aangeboden. Betalingen worden verwerkt door Stripe.",
        ],
      },
      {
        title: "Personalisatie en maatwerk",
        body: [
          "Een gepersonaliseerd product maken we met de gegevens die jij bij het bestellen opgeeft. Je bent zelf verantwoordelijk voor de juistheid en de spelling daarvan.",
          "Een wijziging is mogelijk zolang we nog niet aan je bestelling zijn begonnen.",
          "Voor producten die op maat voor jou zijn gemaakt geldt het herroepingsrecht niet.",
          "Maken wij een fout, dan herstellen we die kosteloos.",
        ],
      },
      {
        title: "Levering",
        body: [
          "De levertijd staat op de productpagina en op de pagina Verzending & Retourneren. Is er geen levertijd genoemd, dan leveren we uiterlijk binnen 30 dagen.",
          "Halen we de levertijd niet, dan kun je ons een redelijke extra termijn geven. Leveren we ook dan niet, dan mag je de bestelling kosteloos annuleren en krijg je je geld terug.",
          "Het risico van beschadiging of verlies ligt bij ons totdat de bestelling bij jou of bij een door jou aangewezen persoon is bezorgd.",
        ],
      },
      {
        title: "Herroepingsrecht en retourneren",
        body: [
          "Voor producten die niet op maat zijn gemaakt heb je 14 dagen bedenktijd vanaf de dag van ontvangst.",
          "Voor gepersonaliseerde producten geldt dit herroepingsrecht niet.",
          "De volledige procedure en de regels voor terugbetaling staan op de pagina Verzending & Retourneren.",
        ],
      },
      {
        title: "Wettelijke garantie",
        body: [
          "Je hebt recht op een product dat goed is en dat doet wat je ervan mag verwachten.",
          "Is dat niet zo, dan herstellen of vervangen we het product kosteloos. Lukt dat niet binnen een redelijke termijn, dan heb je recht op een lagere prijs of op je geld terug.",
          "Hoe lang deze garantie geldt, hangt af van het soort product en van wat je er redelijkerwijs van mag verwachten.",
        ],
      },
      {
        title: "Klachten",
        body: [
          `Ben je ergens niet tevreden over? Laat het ons weten ${contactLine}. Beschrijf wat er aan de hand is en vermeld je bestelnummer.`,
          "We reageren binnen 14 dagen inhoudelijk op je klacht. Hebben we meer tijd nodig, dan laten we je dat binnen die termijn weten.",
          "Komen we er samen niet uit, dan kun je het geschil voorleggen aan de bevoegde rechter.",
        ],
      },
      {
        title: "Intellectueel eigendom",
        body: [
          `De teksten, ontwerpen en foto's op deze website zijn van ${shopName}. Je mag ze niet zonder onze toestemming kopiëren, verspreiden of commercieel gebruiken.`,
        ],
      },
      {
        title: "Persoonsgegevens",
        body: [
          "We gebruiken je gegevens alleen om je bestelling te maken, te verzenden en om er contact met je over te hebben. Hoe we daarmee omgaan, lees je in ons privacybeleid.",
        ],
      },
      {
        title: "Toepasselijk recht",
        body: [
          `Op elke overeenkomst met ${shopName} is Nederlands recht van toepassing.`,
          "Woon je in België, dan houd je daarnaast de bescherming van het Belgische consumentenrecht waar niet van mag worden afgeweken.",
        ],
      },
    ],
  },

  privacy: {
    title: "Privacybeleid",
    intro: `Bij ${shopName} gaan we zorgvuldig om met je gegevens. Hier lees je welke gegevens we verwerken, waarom, hoe lang we ze bewaren en welke rechten je hebt.`,
    sections: [
      {
        title: "Wie is verantwoordelijk?",
        body: [
          `${companyName} is verantwoordelijk voor de verwerking van je persoonsgegevens.`,
          ...companyDetails.slice(1),
          `Met vragen over privacy of een verzoek over je gegevens kun je bij ons terecht ${contactLine}.`,
        ],
      },
      {
        title: "Welke gegevens verwerken we?",
        body: [
          "Voor een bestelling vragen we je naam, e-mailadres, bezorgadres en, als je dat wilt invullen, je telefoonnummer. We bewaren ook wat je hebt besteld en wat we daarover met je bespreken.",
          "Bij een geboortelijst komen daar de gegevens bij die op de lijst komen te staan: de naam van het kindje, de geboortedatum, de geboortetijd, het gewicht en de lengte.",
          "De server waarop de website draait houdt technische loggegevens bij, zoals een IP-adres en het tijdstip van een bezoek. Die zijn nodig om de website te laten werken en te beveiligen.",
        ],
      },
      {
        title: "Waarom verwerken we je gegevens?",
        body: [
          "We gebruiken je gegevens om je bestelling te maken, de betaling af te handelen, het pakket te bezorgen en je vragen of klachten te beantwoorden. Dat is nodig om de overeenkomst met jou uit te voeren.",
          "Daarnaast bewaren we bestelgegevens voor onze administratie, omdat de wet dat van ons vraagt.",
          "Technische loggegevens verwerken we op grond van ons gerechtvaardigd belang om de website veilig te houden.",
          "We gebruiken je gegevens niet voor reclame en we verkopen ze niet.",
        ],
      },
      {
        title: "Gegevens van kinderen",
        body: [
          "Op een geboortelijst staan gegevens van een kind. We gebruiken die alleen om de lijst te maken.",
          "We gebruiken een gemaakte lijst of de gegevens erop niet als voorbeeld op de website of op sociale media, tenzij je daar zelf toestemming voor hebt gegeven.",
        ],
      },
      {
        title: "Betalingen via Stripe",
        body: [
          "Betalingen worden verwerkt door Stripe. Stripe ontvangt de gegevens die nodig zijn om de betaling uit te voeren en fraude te voorkomen.",
          "Wij zien alleen het bedrag, de betaalstatus en een kenmerk van de betaling. Rekening- en kaartnummers zien en bewaren we niet.",
          "Op de verwerking door Stripe is het privacybeleid van Stripe van toepassing: https://stripe.com/nl/privacy",
        ],
      },
      {
        title: "Met wie delen we gegevens?",
        body: [
          "We delen je gegevens alleen met partijen die we nodig hebben om je bestelling uit te voeren: de betaaldienst, de bezorgdienst, de dienst waarmee we e-mails over je bestelling versturen en de partijen die de website en de database voor ons hosten.",
          "Deze partijen krijgen alleen de gegevens die ze voor hun werk nodig hebben. Met partijen die gegevens in onze opdracht verwerken, hebben we afspraken over de beveiliging daarvan.",
          "Sommige van deze dienstverleners kunnen gegevens buiten de Europese Economische Ruimte verwerken. Dat gebeurt alleen met de waarborgen die de wet daarvoor eist.",
        ],
      },
      {
        title: "Cookies en lokale opslag",
        body: [
          "Je winkelwagen en favorieten worden in je eigen browser bewaard, niet bij ons. Je kunt ze verwijderen via de instellingen van je browser.",
          "Deze website gebruikt geen trackingcookies en geen advertentiecookies.",
          "Tijdens het betalen kom je op een pagina van Stripe. Stripe plaatst daar cookies die nodig zijn voor een veilige betaling.",
        ],
      },
      {
        title: "Hoe lang bewaren we je gegevens?",
        body: [
          "Bestelgegevens die bij onze administratie horen bewaren we zeven jaar. Dat is de wettelijke fiscale bewaarplicht.",
          "Andere gegevens, zoals berichten die je ons stuurt, bewaren we niet langer dan nodig is om je bestelling af te handelen en je daarna nog te kunnen helpen.",
          "Gegevens die we niet meer nodig hebben, verwijderen we.",
        ],
      },
      {
        title: "Beveiliging",
        body: [
          "We beveiligen je gegevens tegen verlies en tegen toegang door onbevoegden. De verbinding met de website is versleuteld en alleen wij kunnen bij de bestelgegevens.",
        ],
      },
      {
        title: "Jouw rechten",
        body: [
          "Je mag ons vragen welke gegevens we van je hebben, en je mag ze laten verbeteren of verwijderen. Je kunt ook vragen om het gebruik te beperken, bezwaar maken tegen een verwerking of je gegevens opvragen om ze mee te nemen.",
          `Stuur je verzoek ${contactLine}. We reageren binnen één maand.`,
          "Om misbruik te voorkomen kunnen we je vragen te laten zien dat het verzoek echt van jou komt.",
        ],
      },
      {
        title: "Een klacht over privacy",
        body: [
          "Ben je het niet eens met hoe we met je gegevens omgaan? Neem dan eerst contact met ons op, dan zoeken we een oplossing.",
          "Je mag ook altijd een klacht indienen bij de Autoriteit Persoonsgegevens: https://autoriteitpersoonsgegevens.nl",
        ],
      },
      {
        title: "Wijzigingen",
        body: [
          "We kunnen dit privacybeleid aanpassen als onze werkwijze of de wet verandert. De actuele versie staat altijd op deze pagina.",
        ],
      },
    ],
  },
};
