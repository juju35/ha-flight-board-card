/*
 * Flight Board Card for Home Assistant
 * https://github.com/juju35/ha-flight-board-card
 *
 * An airport departures and arrivals board for the FlightRadar24 integration
 * (https://github.com/AlexandrErohin/home-assistant-flightradar24): the `flights` attribute of its
 * « Airport departures » and « Airport arrivals » sensors, under an animated illustration of the airport.
 * The sensors are discovered through the entity registry (platform and translation key), whatever their
 * names, or from their default entity ids.
 */

const VERSION = "__VERSION__";

// mdi icon paths: the cards draw their icons themselves (no <ha-icon>, nothing to load).
const ICONS = {
  // mdi:airplane-takeoff and mdi:airplane-landing (the header icon, by tab).
  departures: "M2.5,19H21.5V21H2.5V19M22.07,9.64C21.86,8.84 21.03,8.36 20.23,8.58L14.92,10L8,3.57L6.09,4.08L10.23,11.25L5.26,12.58L3.29,11.04L1.84,11.43L3.66,14.59L4.43,15.92L6.03,15.5L11.34,14.07L15.69,12.91L21,11.5C21.81,11.26 22.28,10.44 22.07,9.64Z",
  arrivals: "M2.5,19H21.5V21H2.5V19M9.68,13.27L14.03,14.43L19.34,15.85C20.14,16.06 20.96,15.59 21.18,14.79C21.39,14 20.92,13.17 20.12,12.95L14.81,11.53L12.05,2.5L10.12,2V10.28L5.15,8.95L4.22,6.63L2.77,6.24V11.41L4.37,11.84L9.68,13.27Z",
  // mdi:arrow-expand and mdi:arrow-collapse: the mini card's detail button.
  expand: "M10,21V19H6.41L10.91,14.5L9.5,13.09L5,17.59V14H3V21H10M14.5,10.91L19,6.41V10H21V3H14V5H17.59L13.09,9.5L14.5,10.91Z",
  collapse: "M19.5,3.09L15,7.59V4H13V11H20V9H16.41L20.91,4.5L19.5,3.09M4,13V15H7.59L3.09,19.5L4.5,20.91L9,16.41V20H11V13H4Z",
  // mdi:close: the detail popup's close button.
  close: "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",
  // mdi:airplane: the detail popup's title.
  plane: "M20.56,3.91C21.15,4.5 21.15,5.45 20.56,6.03L16.67,9.92L18.79,19.11L17.38,20.53L13.5,13.1L9.6,17L9.96,19.47L8.89,20.53L7.13,17.35L3.94,15.58L5,14.5L7.5,14.87L11.37,11L3.94,7.09L5.36,5.68L14.55,7.8L18.44,3.91C19,3.33 20,3.33 20.56,3.91Z",
};

const STRINGS = {
  en: {
    departures: "Departures",
    arrivals: "Arrivals",
    airport: "Airport",
    flights_one: "{n} flight",
    flights_other: "{n} flights",
    on_time_pct: "{pct} on time",
    avg_delay: "avg {delay}",
    minutes: "{n} min",
    to_city: "to {city}",
    from_city: "from {city}",
    in_minutes: "in {n} min",
    in_hours: "in {h} h {m}",
    now: "now",
    minutes_ago: "{n} min ago",
    no_flights: "No upcoming flights",
    no_entities: "No FlightRadar24 airport sensors found. Is the FlightRadar24 integration installed?",
    not_tracked: "No airport tracked: enter an airport code in the FlightRadar24 « Airport track » entity.",
    status_on_time: "On time",
    status_delayed: "Delayed",
    status_boarding: "Boarding",
    status_departed: "Departed",
    status_landed: "Landed",
    status_estimated: "Estimated",
    status_canceled: "Canceled",
    status_diverted: "Diverted",
    status_unknown: "Unknown",
    flight: "Flight",
    airline: "Airline",
    aircraft: "Aircraft",
    registration: "Registration",
    callsign: "Callsign",
    scheduled: "Scheduled",
    estimated: "Estimated",
    actual: "Actual",
    destination: "Destination",
    origin: "Origin",
    close: "Close",
    zoom_in: "Show the full card",
    zoom_out: "Back to the compact view",
    departures_entity: "Departures sensor",
    arrivals_entity: "Arrivals sensor",
    airport_entity: "Airport track entity",
    title: "Title",
    default_tab: "Default tab",
    show_departures: "Departures tab",
    show_arrivals: "Arrivals tab",
    max_flights: "Flights shown",
    hours_ahead: "Hours ahead",
    show_past: "Past flights",
    show_airline: "Airline name",
    show_aircraft: "Aircraft type",
    show_stats: "Statistics",
    illustration: "Illustration",
    illustration_theme: "Illustration theme",
    theme_auto: "Automatic",
    theme_day: "Day",
    theme_night: "Night",
    zoom: "Detail button",
    language: "Language",
    lang_auto: "Automatic",
  },
  fr: {
    departures: "Départs",
    arrivals: "Arrivées",
    airport: "Aéroport",
    flights_one: "{n} vol",
    flights_other: "{n} vols",
    on_time_pct: "{pct} à l'heure",
    avg_delay: "moy. {delay}",
    minutes: "{n} min",
    to_city: "vers {city}",
    from_city: "depuis {city}",
    in_minutes: "dans {n} min",
    in_hours: "dans {h} h {m}",
    now: "maintenant",
    minutes_ago: "il y a {n} min",
    no_flights: "Aucun vol à venir",
    no_entities: "Aucun capteur d'aéroport FlightRadar24 trouvé. L'intégration FlightRadar24 est-elle installée ?",
    not_tracked: "Aucun aéroport suivi : saisissez un code d'aéroport dans l'entité FlightRadar24 « Airport track ».",
    status_on_time: "À l'heure",
    status_delayed: "Retardé",
    status_boarding: "Embarquement",
    status_departed: "Parti",
    status_landed: "Atterri",
    status_estimated: "Estimé",
    status_canceled: "Annulé",
    status_diverted: "Dérouté",
    status_unknown: "Inconnu",
    flight: "Vol",
    airline: "Compagnie",
    aircraft: "Avion",
    registration: "Immatriculation",
    callsign: "Indicatif",
    scheduled: "Prévu",
    estimated: "Estimé",
    actual: "Réel",
    destination: "Destination",
    origin: "Provenance",
    close: "Fermer",
    zoom_in: "Afficher la carte complète",
    zoom_out: "Revenir à la vue compacte",
    departures_entity: "Capteur des départs",
    arrivals_entity: "Capteur des arrivées",
    airport_entity: "Entité de l'aéroport suivi",
    title: "Titre",
    default_tab: "Onglet par défaut",
    show_departures: "Onglet Départs",
    show_arrivals: "Onglet Arrivées",
    max_flights: "Vols affichés",
    hours_ahead: "Heures à venir",
    show_past: "Vols passés",
    show_airline: "Nom de la compagnie",
    show_aircraft: "Type d'avion",
    show_stats: "Statistiques",
    illustration: "Illustration",
    illustration_theme: "Thème de l'illustration",
    theme_auto: "Automatique",
    theme_day: "Jour",
    theme_night: "Nuit",
    zoom: "Bouton détail",
    language: "Langue",
    lang_auto: "Automatique",
  },
  de: {
    departures: "Abflüge",
    arrivals: "Ankünfte",
    airport: "Flughafen",
    flights_one: "{n} Flug",
    flights_other: "{n} Flüge",
    on_time_pct: "{pct} pünktlich",
    avg_delay: "Ø {delay}",
    minutes: "{n} Min.",
    to_city: "nach {city}",
    from_city: "aus {city}",
    in_minutes: "in {n} Min.",
    in_hours: "in {h} Std. {m}",
    now: "jetzt",
    minutes_ago: "vor {n} Min.",
    no_flights: "Keine anstehenden Flüge",
    no_entities: "Keine FlightRadar24-Flughafensensoren gefunden. Ist die FlightRadar24-Integration installiert?",
    not_tracked: "Kein Flughafen verfolgt: Gib einen Flughafencode in der FlightRadar24-Entität « Airport track » ein.",
    status_on_time: "Pünktlich",
    status_delayed: "Verspätet",
    status_boarding: "Boarding",
    status_departed: "Gestartet",
    status_landed: "Gelandet",
    status_estimated: "Erwartet",
    status_canceled: "Annulliert",
    status_diverted: "Umgeleitet",
    status_unknown: "Unbekannt",
    flight: "Flug",
    airline: "Fluggesellschaft",
    aircraft: "Flugzeug",
    registration: "Kennzeichen",
    callsign: "Rufzeichen",
    scheduled: "Planmäßig",
    estimated: "Erwartet",
    actual: "Tatsächlich",
    destination: "Ziel",
    origin: "Herkunft",
    close: "Schließen",
    zoom_in: "Vollständige Karte anzeigen",
    zoom_out: "Zurück zur kompakten Ansicht",
    departures_entity: "Abflug-Sensor",
    arrivals_entity: "Ankunfts-Sensor",
    airport_entity: "Entität des verfolgten Flughafens",
    title: "Titel",
    default_tab: "Standard-Tab",
    show_departures: "Tab Abflüge",
    show_arrivals: "Tab Ankünfte",
    max_flights: "Angezeigte Flüge",
    hours_ahead: "Stunden voraus",
    show_past: "Vergangene Flüge",
    show_airline: "Name der Fluggesellschaft",
    show_aircraft: "Flugzeugtyp",
    show_stats: "Statistiken",
    illustration: "Illustration",
    illustration_theme: "Thema der Illustration",
    theme_auto: "Automatisch",
    theme_day: "Tag",
    theme_night: "Nacht",
    zoom: "Detail-Schaltfläche",
    language: "Sprache",
    lang_auto: "Automatisch",
  },
  es: {
    departures: "Salidas",
    arrivals: "Llegadas",
    airport: "Aeropuerto",
    flights_one: "{n} vuelo",
    flights_other: "{n} vuelos",
    on_time_pct: "{pct} puntuales",
    avg_delay: "media {delay}",
    minutes: "{n} min",
    to_city: "a {city}",
    from_city: "desde {city}",
    in_minutes: "en {n} min",
    in_hours: "en {h} h {m}",
    now: "ahora",
    minutes_ago: "hace {n} min",
    no_flights: "No hay próximos vuelos",
    no_entities: "No se han encontrado sensores de aeropuerto de FlightRadar24. ¿Está instalada la integración FlightRadar24?",
    not_tracked: "Ningún aeropuerto seguido: introduce un código de aeropuerto en la entidad « Airport track » de FlightRadar24.",
    status_on_time: "Puntual",
    status_delayed: "Retrasado",
    status_boarding: "Embarcando",
    status_departed: "Despegado",
    status_landed: "Aterrizado",
    status_estimated: "Estimado",
    status_canceled: "Cancelado",
    status_diverted: "Desviado",
    status_unknown: "Desconocido",
    flight: "Vuelo",
    airline: "Aerolínea",
    aircraft: "Avión",
    registration: "Matrícula",
    callsign: "Indicativo",
    scheduled: "Programado",
    estimated: "Estimado",
    actual: "Real",
    destination: "Destino",
    origin: "Origen",
    close: "Cerrar",
    zoom_in: "Mostrar la tarjeta completa",
    zoom_out: "Volver a la vista compacta",
    departures_entity: "Sensor de salidas",
    arrivals_entity: "Sensor de llegadas",
    airport_entity: "Entidad del aeropuerto seguido",
    title: "Título",
    default_tab: "Pestaña predeterminada",
    show_departures: "Pestaña Salidas",
    show_arrivals: "Pestaña Llegadas",
    max_flights: "Vuelos mostrados",
    hours_ahead: "Horas por delante",
    show_past: "Vuelos pasados",
    show_airline: "Nombre de la aerolínea",
    show_aircraft: "Tipo de avión",
    show_stats: "Estadísticas",
    illustration: "Ilustración",
    illustration_theme: "Tema de la ilustración",
    theme_auto: "Automático",
    theme_day: "Día",
    theme_night: "Noche",
    zoom: "Botón de detalle",
    language: "Idioma",
    lang_auto: "Automático",
  },
  sr: {
    departures: "Поласци",
    arrivals: "Доласци",
    airport: "Аеродром",
    flights_one: "{n} лет",
    flights_few: "{n} лета",
    flights_other: "{n} летова",
    on_time_pct: "{pct} на време",
    avg_delay: "прос. {delay}",
    minutes: "{n} мин",
    to_city: "за {city}",
    from_city: "из {city}",
    in_minutes: "за {n} мин",
    in_hours: "за {h} ч {m}",
    now: "сада",
    minutes_ago: "пре {n} мин",
    no_flights: "Нема предстојећих летова",
    no_entities: "Нису пронађени сензори аеродрома FlightRadar24. Да ли је интеграција FlightRadar24 инсталирана?",
    not_tracked: "Ниједан аеродром се не прати: унесите код аеродрома у FlightRadar24 ентитет « Airport track ».",
    status_on_time: "На време",
    status_delayed: "Касни",
    status_boarding: "Укрцавање",
    status_departed: "Полетео",
    status_landed: "Слетео",
    status_estimated: "Процењено",
    status_canceled: "Отказан",
    status_diverted: "Преусмерен",
    status_unknown: "Непознато",
    flight: "Лет",
    airline: "Авио-компанија",
    aircraft: "Авион",
    registration: "Регистрација",
    callsign: "Позивни знак",
    scheduled: "Планирано",
    estimated: "Процењено",
    actual: "Стварно",
    destination: "Одредиште",
    origin: "Полазиште",
    close: "Затвори",
    zoom_in: "Прикажи целу картицу",
    zoom_out: "Назад на компактни приказ",
    departures_entity: "Сензор полазака",
    arrivals_entity: "Сензор долазака",
    airport_entity: "Ентитет праћеног аеродрома",
    title: "Наслов",
    default_tab: "Подразумевана картица",
    show_departures: "Картица Поласци",
    show_arrivals: "Картица Доласци",
    max_flights: "Приказани летови",
    hours_ahead: "Сати унапред",
    show_past: "Прошли летови",
    show_airline: "Назив авио-компаније",
    show_aircraft: "Тип авиона",
    show_stats: "Статистика",
    illustration: "Илустрација",
    illustration_theme: "Тема илустрације",
    theme_auto: "Аутоматски",
    theme_day: "Дан",
    theme_night: "Ноћ",
    zoom: "Дугме за детаље",
    language: "Језик",
    lang_auto: "Аутоматски",
  },
  "sr-Latn": {
    departures: "Polasci",
    arrivals: "Dolasci",
    airport: "Aerodrom",
    flights_one: "{n} let",
    flights_few: "{n} leta",
    flights_other: "{n} letova",
    on_time_pct: "{pct} na vreme",
    avg_delay: "pros. {delay}",
    minutes: "{n} min",
    to_city: "za {city}",
    from_city: "iz {city}",
    in_minutes: "za {n} min",
    in_hours: "za {h} č {m}",
    now: "sada",
    minutes_ago: "pre {n} min",
    no_flights: "Nema predstojećih letova",
    no_entities: "Nisu pronađeni senzori aerodroma FlightRadar24. Da li je integracija FlightRadar24 instalirana?",
    not_tracked: "Nijedan aerodrom se ne prati: unesite kod aerodroma u FlightRadar24 entitet « Airport track ».",
    status_on_time: "Na vreme",
    status_delayed: "Kasni",
    status_boarding: "Ukrcavanje",
    status_departed: "Poleteo",
    status_landed: "Sleteo",
    status_estimated: "Procenjeno",
    status_canceled: "Otkazan",
    status_diverted: "Preusmeren",
    status_unknown: "Nepoznato",
    flight: "Let",
    airline: "Avio-kompanija",
    aircraft: "Avion",
    registration: "Registracija",
    callsign: "Pozivni znak",
    scheduled: "Planirano",
    estimated: "Procenjeno",
    actual: "Stvarno",
    destination: "Odredište",
    origin: "Polazište",
    close: "Zatvori",
    zoom_in: "Prikaži celu karticu",
    zoom_out: "Nazad na kompaktni prikaz",
    departures_entity: "Senzor polazaka",
    arrivals_entity: "Senzor dolazaka",
    airport_entity: "Entitet praćenog aerodroma",
    title: "Naslov",
    default_tab: "Podrazumevana kartica",
    show_departures: "Kartica Polasci",
    show_arrivals: "Kartica Dolasci",
    max_flights: "Prikazani letovi",
    hours_ahead: "Sati unapred",
    show_past: "Prošli letovi",
    show_airline: "Naziv avio-kompanije",
    show_aircraft: "Tip aviona",
    show_stats: "Statistika",
    illustration: "Ilustracija",
    illustration_theme: "Tema ilustracije",
    theme_auto: "Automatski",
    theme_day: "Dan",
    theme_night: "Noć",
    zoom: "Dugme za detalje",
    language: "Jezik",
    lang_auto: "Automatski",
  },
  it: {
    departures: "Partenze",
    arrivals: "Arrivi",
    airport: "Aeroporto",
    flights_one: "{n} volo",
    flights_other: "{n} voli",
    on_time_pct: "{pct} in orario",
    avg_delay: "media {delay}",
    minutes: "{n} min",
    to_city: "per {city}",
    from_city: "da {city}",
    in_minutes: "tra {n} min",
    in_hours: "tra {h} h {m}",
    now: "ora",
    minutes_ago: "{n} min fa",
    no_flights: "Nessun volo in programma",
    no_entities: "Nessun sensore aeroporto di FlightRadar24 trovato. L'integrazione FlightRadar24 è installata?",
    not_tracked: "Nessun aeroporto seguito: inserisci un codice aeroporto nell'entità « Airport track » di FlightRadar24.",
    status_on_time: "In orario",
    status_delayed: "In ritardo",
    status_boarding: "Imbarco",
    status_departed: "Partito",
    status_landed: "Atterrato",
    status_estimated: "Stimato",
    status_canceled: "Cancellato",
    status_diverted: "Dirottato",
    status_unknown: "Sconosciuto",
    flight: "Volo",
    airline: "Compagnia aerea",
    aircraft: "Aereo",
    registration: "Immatricolazione",
    callsign: "Nominativo",
    scheduled: "Programmato",
    estimated: "Stimato",
    actual: "Effettivo",
    destination: "Destinazione",
    origin: "Provenienza",
    close: "Chiudi",
    zoom_in: "Mostra la scheda completa",
    zoom_out: "Torna alla vista compatta",
    departures_entity: "Sensore partenze",
    arrivals_entity: "Sensore arrivi",
    airport_entity: "Entità dell'aeroporto seguito",
    title: "Titolo",
    default_tab: "Scheda predefinita",
    show_departures: "Scheda Partenze",
    show_arrivals: "Scheda Arrivi",
    max_flights: "Voli mostrati",
    hours_ahead: "Ore successive",
    show_past: "Voli passati",
    show_airline: "Nome della compagnia",
    show_aircraft: "Tipo di aereo",
    show_stats: "Statistiche",
    illustration: "Illustrazione",
    illustration_theme: "Tema dell'illustrazione",
    theme_auto: "Automatico",
    theme_day: "Giorno",
    theme_night: "Notte",
    zoom: "Pulsante dettagli",
    language: "Lingua",
    lang_auto: "Automatica",
  },
  nl: {
    departures: "Vertrek",
    arrivals: "Aankomst",
    airport: "Luchthaven",
    flights_one: "{n} vlucht",
    flights_other: "{n} vluchten",
    on_time_pct: "{pct} op tijd",
    avg_delay: "gem. {delay}",
    minutes: "{n} min",
    to_city: "naar {city}",
    from_city: "uit {city}",
    in_minutes: "over {n} min",
    in_hours: "over {h} u {m}",
    now: "nu",
    minutes_ago: "{n} min geleden",
    no_flights: "Geen komende vluchten",
    no_entities: "Geen FlightRadar24-luchthavensensoren gevonden. Is de FlightRadar24-integratie geïnstalleerd?",
    not_tracked: "Geen luchthaven gevolgd: voer een luchthavencode in bij de FlightRadar24-entiteit « Airport track ».",
    status_on_time: "Op tijd",
    status_delayed: "Vertraagd",
    status_boarding: "Boarding",
    status_departed: "Vertrokken",
    status_landed: "Geland",
    status_estimated: "Verwacht",
    status_canceled: "Geannuleerd",
    status_diverted: "Omgeleid",
    status_unknown: "Onbekend",
    flight: "Vlucht",
    airline: "Luchtvaartmaatschappij",
    aircraft: "Vliegtuig",
    registration: "Registratie",
    callsign: "Roepnaam",
    scheduled: "Gepland",
    estimated: "Verwacht",
    actual: "Werkelijk",
    destination: "Bestemming",
    origin: "Herkomst",
    close: "Sluiten",
    zoom_in: "Volledige kaart tonen",
    zoom_out: "Terug naar de compacte weergave",
    departures_entity: "Vertreksensor",
    arrivals_entity: "Aankomstsensor",
    airport_entity: "Entiteit van de gevolgde luchthaven",
    title: "Titel",
    default_tab: "Standaardtabblad",
    show_departures: "Tabblad Vertrek",
    show_arrivals: "Tabblad Aankomst",
    max_flights: "Getoonde vluchten",
    hours_ahead: "Uren vooruit",
    show_past: "Vertrokken vluchten",
    show_airline: "Naam van de maatschappij",
    show_aircraft: "Vliegtuigtype",
    show_stats: "Statistieken",
    illustration: "Illustratie",
    illustration_theme: "Thema van de illustratie",
    theme_auto: "Automatisch",
    theme_day: "Dag",
    theme_night: "Nacht",
    zoom: "Detailknop",
    language: "Taal",
    lang_auto: "Automatisch",
  },
  pt: {
    departures: "Partidas",
    arrivals: "Chegadas",
    airport: "Aeroporto",
    flights_one: "{n} voo",
    flights_other: "{n} voos",
    on_time_pct: "{pct} à hora",
    avg_delay: "média {delay}",
    minutes: "{n} min",
    to_city: "para {city}",
    from_city: "de {city}",
    in_minutes: "dentro de {n} min",
    in_hours: "dentro de {h} h {m}",
    now: "agora",
    minutes_ago: "há {n} min",
    no_flights: "Sem voos previstos",
    no_entities: "Nenhum sensor de aeroporto do FlightRadar24 encontrado. A integração FlightRadar24 está instalada?",
    not_tracked: "Nenhum aeroporto seguido: introduza um código de aeroporto na entidade « Airport track » do FlightRadar24.",
    status_on_time: "À hora",
    status_delayed: "Atrasado",
    status_boarding: "Embarque",
    status_departed: "Partiu",
    status_landed: "Aterrou",
    status_estimated: "Estimado",
    status_canceled: "Cancelado",
    status_diverted: "Desviado",
    status_unknown: "Desconhecido",
    flight: "Voo",
    airline: "Companhia aérea",
    aircraft: "Avião",
    registration: "Matrícula",
    callsign: "Indicativo",
    scheduled: "Previsto",
    estimated: "Estimado",
    actual: "Real",
    destination: "Destino",
    origin: "Origem",
    close: "Fechar",
    zoom_in: "Mostrar o cartão completo",
    zoom_out: "Voltar à vista compacta",
    departures_entity: "Sensor de partidas",
    arrivals_entity: "Sensor de chegadas",
    airport_entity: "Entidade do aeroporto seguido",
    title: "Título",
    default_tab: "Separador predefinido",
    show_departures: "Separador Partidas",
    show_arrivals: "Separador Chegadas",
    max_flights: "Voos mostrados",
    hours_ahead: "Horas seguintes",
    show_past: "Voos passados",
    show_airline: "Nome da companhia",
    show_aircraft: "Tipo de avião",
    show_stats: "Estatísticas",
    illustration: "Ilustração",
    illustration_theme: "Tema da ilustração",
    theme_auto: "Automático",
    theme_day: "Dia",
    theme_night: "Noite",
    zoom: "Botão de detalhe",
    language: "Idioma",
    lang_auto: "Automático",
  },
  pl: {
    departures: "Odloty",
    arrivals: "Przyloty",
    airport: "Lotnisko",
    flights_one: "{n} lot",
    flights_few: "{n} loty",
    flights_many: "{n} lotów",
    flights_other: "{n} lotu",
    on_time_pct: "{pct} punktualnie",
    avg_delay: "śr. {delay}",
    minutes: "{n} min",
    to_city: "do {city}",
    from_city: "z {city}",
    in_minutes: "za {n} min",
    in_hours: "za {h} h {m}",
    now: "teraz",
    minutes_ago: "{n} min temu",
    no_flights: "Brak nadchodzących lotów",
    no_entities: "Nie znaleziono czujników lotniska FlightRadar24. Czy integracja FlightRadar24 jest zainstalowana?",
    not_tracked: "Brak śledzonego lotniska: wpisz kod lotniska w encji « Airport track » FlightRadar24.",
    status_on_time: "Planowo",
    status_delayed: "Opóźniony",
    status_boarding: "Boarding",
    status_departed: "Wystartował",
    status_landed: "Wylądował",
    status_estimated: "Szacowany",
    status_canceled: "Odwołany",
    status_diverted: "Przekierowany",
    status_unknown: "Nieznany",
    flight: "Lot",
    airline: "Linia lotnicza",
    aircraft: "Samolot",
    registration: "Rejestracja",
    callsign: "Znak wywoławczy",
    scheduled: "Wg rozkładu",
    estimated: "Szacowany",
    actual: "Rzeczywisty",
    destination: "Kierunek",
    origin: "Skąd",
    close: "Zamknij",
    zoom_in: "Pokaż pełną kartę",
    zoom_out: "Wróć do widoku kompaktowego",
    departures_entity: "Czujnik odlotów",
    arrivals_entity: "Czujnik przylotów",
    airport_entity: "Encja śledzonego lotniska",
    title: "Tytuł",
    default_tab: "Domyślna karta",
    show_departures: "Karta Odloty",
    show_arrivals: "Karta Przyloty",
    max_flights: "Wyświetlane loty",
    hours_ahead: "Godziny naprzód",
    show_past: "Minione loty",
    show_airline: "Nazwa linii lotniczej",
    show_aircraft: "Typ samolotu",
    show_stats: "Statystyki",
    illustration: "Ilustracja",
    illustration_theme: "Motyw ilustracji",
    theme_auto: "Automatycznie",
    theme_day: "Dzień",
    theme_night: "Noc",
    zoom: "Przycisk szczegółów",
    language: "Język",
    lang_auto: "Automatycznie",
  },
  ro: {
    departures: "Plecări",
    arrivals: "Sosiri",
    airport: "Aeroport",
    flights_one: "{n} zbor",
    flights_few: "{n} zboruri",
    flights_other: "{n} de zboruri",
    on_time_pct: "{pct} la timp",
    avg_delay: "medie {delay}",
    minutes: "{n} min",
    to_city: "spre {city}",
    from_city: "din {city}",
    in_minutes: "în {n} min",
    in_hours: "în {h} h {m}",
    now: "acum",
    minutes_ago: "acum {n} min",
    no_flights: "Niciun zbor programat",
    no_entities: "Nu s-au găsit senzori de aeroport FlightRadar24. Este instalată integrarea FlightRadar24?",
    not_tracked: "Niciun aeroport urmărit: introduceți un cod de aeroport în entitatea FlightRadar24 « Airport track ».",
    status_on_time: "La timp",
    status_delayed: "Întârziat",
    status_boarding: "Îmbarcare",
    status_departed: "Plecat",
    status_landed: "Aterizat",
    status_estimated: "Estimat",
    status_canceled: "Anulat",
    status_diverted: "Redirecționat",
    status_unknown: "Necunoscut",
    flight: "Zbor",
    airline: "Companie aeriană",
    aircraft: "Avion",
    registration: "Înmatriculare",
    callsign: "Indicativ",
    scheduled: "Programat",
    estimated: "Estimat",
    actual: "Real",
    destination: "Destinație",
    origin: "Proveniență",
    close: "Închide",
    zoom_in: "Afișează cardul complet",
    zoom_out: "Înapoi la vizualizarea compactă",
    departures_entity: "Senzor plecări",
    arrivals_entity: "Senzor sosiri",
    airport_entity: "Entitatea aeroportului urmărit",
    title: "Titlu",
    default_tab: "Fila implicită",
    show_departures: "Fila Plecări",
    show_arrivals: "Fila Sosiri",
    max_flights: "Zboruri afișate",
    hours_ahead: "Ore înainte",
    show_past: "Zboruri trecute",
    show_airline: "Numele companiei",
    show_aircraft: "Tipul avionului",
    show_stats: "Statistici",
    illustration: "Ilustrație",
    illustration_theme: "Tema ilustrației",
    theme_auto: "Automat",
    theme_day: "Zi",
    theme_night: "Noapte",
    zoom: "Buton de detalii",
    language: "Limbă",
    lang_auto: "Automat",
  },
  da: {
    departures: "Afgange",
    arrivals: "Ankomster",
    airport: "Lufthavn",
    flights_one: "{n} fly",
    flights_other: "{n} fly",
    on_time_pct: "{pct} til tiden",
    avg_delay: "gns. {delay}",
    minutes: "{n} min",
    to_city: "til {city}",
    from_city: "fra {city}",
    in_minutes: "om {n} min",
    in_hours: "om {h} t {m}",
    now: "nu",
    minutes_ago: "for {n} min siden",
    no_flights: "Ingen kommende fly",
    no_entities: "Ingen FlightRadar24-lufthavnssensorer fundet. Er FlightRadar24-integrationen installeret?",
    not_tracked: "Ingen lufthavn fulgt: indtast en lufthavnskode i FlightRadar24-enheden « Airport track ».",
    status_on_time: "Til tiden",
    status_delayed: "Forsinket",
    status_boarding: "Boarding",
    status_departed: "Afgået",
    status_landed: "Landet",
    status_estimated: "Forventet",
    status_canceled: "Aflyst",
    status_diverted: "Omdirigeret",
    status_unknown: "Ukendt",
    flight: "Flyvning",
    airline: "Flyselskab",
    aircraft: "Fly",
    registration: "Registrering",
    callsign: "Kaldesignal",
    scheduled: "Planlagt",
    estimated: "Forventet",
    actual: "Faktisk",
    destination: "Destination",
    origin: "Afgangssted",
    close: "Luk",
    zoom_in: "Vis hele kortet",
    zoom_out: "Tilbage til kompakt visning",
    departures_entity: "Afgangssensor",
    arrivals_entity: "Ankomstsensor",
    airport_entity: "Enhed for fulgt lufthavn",
    title: "Titel",
    default_tab: "Standardfane",
    show_departures: "Fanen Afgange",
    show_arrivals: "Fanen Ankomster",
    max_flights: "Viste fly",
    hours_ahead: "Timer frem",
    show_past: "Tidligere fly",
    show_airline: "Flyselskabets navn",
    show_aircraft: "Flytype",
    show_stats: "Statistik",
    illustration: "Illustration",
    illustration_theme: "Illustrationstema",
    theme_auto: "Automatisk",
    theme_day: "Dag",
    theme_night: "Nat",
    zoom: "Detaljeknap",
    language: "Sprog",
    lang_auto: "Automatisk",
  },
  sv: {
    departures: "Avgångar",
    arrivals: "Ankomster",
    airport: "Flygplats",
    flights_one: "{n} flyg",
    flights_other: "{n} flyg",
    on_time_pct: "{pct} i tid",
    avg_delay: "snitt {delay}",
    minutes: "{n} min",
    to_city: "till {city}",
    from_city: "från {city}",
    in_minutes: "om {n} min",
    in_hours: "om {h} h {m}",
    now: "nu",
    minutes_ago: "för {n} min sedan",
    no_flights: "Inga kommande flyg",
    no_entities: "Inga flygplatssensorer från FlightRadar24 hittades. Är FlightRadar24-integrationen installerad?",
    not_tracked: "Ingen flygplats följs: ange en flygplatskod i FlightRadar24-entiteten « Airport track ».",
    status_on_time: "I tid",
    status_delayed: "Försenad",
    status_boarding: "Boarding",
    status_departed: "Avgått",
    status_landed: "Landat",
    status_estimated: "Beräknad",
    status_canceled: "Inställd",
    status_diverted: "Omdirigerad",
    status_unknown: "Okänd",
    flight: "Flyg",
    airline: "Flygbolag",
    aircraft: "Flygplan",
    registration: "Registrering",
    callsign: "Anropssignal",
    scheduled: "Planerad",
    estimated: "Beräknad",
    actual: "Faktisk",
    destination: "Destination",
    origin: "Ursprung",
    close: "Stäng",
    zoom_in: "Visa hela kortet",
    zoom_out: "Tillbaka till kompakt vy",
    departures_entity: "Avgångssensor",
    arrivals_entity: "Ankomstsensor",
    airport_entity: "Entitet för följd flygplats",
    title: "Titel",
    default_tab: "Standardflik",
    show_departures: "Fliken Avgångar",
    show_arrivals: "Fliken Ankomster",
    max_flights: "Visade flyg",
    hours_ahead: "Timmar framåt",
    show_past: "Tidigare flyg",
    show_airline: "Flygbolagets namn",
    show_aircraft: "Flygplanstyp",
    show_stats: "Statistik",
    illustration: "Illustration",
    illustration_theme: "Illustrationstema",
    theme_auto: "Automatiskt",
    theme_day: "Dag",
    theme_night: "Natt",
    zoom: "Detaljknapp",
    language: "Språk",
    lang_auto: "Automatiskt",
  },
  bg: {
    departures: "Заминаващи",
    arrivals: "Пристигащи",
    airport: "Летище",
    flights_one: "{n} полет",
    flights_other: "{n} полета",
    on_time_pct: "{pct} навреме",
    avg_delay: "ср. {delay}",
    minutes: "{n} мин",
    to_city: "за {city}",
    from_city: "от {city}",
    in_minutes: "след {n} мин",
    in_hours: "след {h} ч {m}",
    now: "сега",
    minutes_ago: "преди {n} мин",
    no_flights: "Няма предстоящи полети",
    no_entities: "Не са намерени сензори за летище от FlightRadar24. Инсталирана ли е интеграцията FlightRadar24?",
    not_tracked: "Не се следи летище: въведете код на летище в обекта « Airport track » на FlightRadar24.",
    status_on_time: "Навреме",
    status_delayed: "Закъснява",
    status_boarding: "Качване",
    status_departed: "Излетял",
    status_landed: "Кацнал",
    status_estimated: "Очакван",
    status_canceled: "Отменен",
    status_diverted: "Пренасочен",
    status_unknown: "Неизвестно",
    flight: "Полет",
    airline: "Авиокомпания",
    aircraft: "Самолет",
    registration: "Регистрация",
    callsign: "Позивна",
    scheduled: "По разписание",
    estimated: "Очаквано",
    actual: "Действително",
    destination: "Дестинация",
    origin: "Произход",
    close: "Затвори",
    zoom_in: "Покажи пълната карта",
    zoom_out: "Назад към компактния изглед",
    departures_entity: "Сензор за заминаващи",
    arrivals_entity: "Сензор за пристигащи",
    airport_entity: "Обект на следеното летище",
    title: "Заглавие",
    default_tab: "Раздел по подразбиране",
    show_departures: "Раздел Заминаващи",
    show_arrivals: "Раздел Пристигащи",
    max_flights: "Показани полети",
    hours_ahead: "Часове напред",
    show_past: "Минали полети",
    show_airline: "Име на авиокомпанията",
    show_aircraft: "Тип самолет",
    show_stats: "Статистика",
    illustration: "Илюстрация",
    illustration_theme: "Тема на илюстрацията",
    theme_auto: "Автоматично",
    theme_day: "Ден",
    theme_night: "Нощ",
    zoom: "Бутон за подробности",
    language: "Език",
    lang_auto: "Автоматично",
  },
  ru: {
    departures: "Вылет",
    arrivals: "Прилёт",
    airport: "Аэропорт",
    flights_one: "{n} рейс",
    flights_few: "{n} рейса",
    flights_many: "{n} рейсов",
    flights_other: "{n} рейса",
    on_time_pct: "{pct} вовремя",
    avg_delay: "ср. {delay}",
    minutes: "{n} мин",
    to_city: "в {city}",
    from_city: "из {city}",
    in_minutes: "через {n} мин",
    in_hours: "через {h} ч {m}",
    now: "сейчас",
    minutes_ago: "{n} мин назад",
    no_flights: "Нет предстоящих рейсов",
    no_entities: "Сенсоры аэропорта FlightRadar24 не найдены. Установлена ли интеграция FlightRadar24?",
    not_tracked: "Аэропорт не отслеживается: введите код аэропорта в сущность FlightRadar24 « Airport track ».",
    status_on_time: "Вовремя",
    status_delayed: "Задерживается",
    status_boarding: "Посадка",
    status_departed: "Вылетел",
    status_landed: "Приземлился",
    status_estimated: "Ожидается",
    status_canceled: "Отменён",
    status_diverted: "Перенаправлен",
    status_unknown: "Неизвестно",
    flight: "Рейс",
    airline: "Авиакомпания",
    aircraft: "Самолёт",
    registration: "Бортовой номер",
    callsign: "Позывной",
    scheduled: "По расписанию",
    estimated: "Ожидаемое",
    actual: "Фактическое",
    destination: "Пункт назначения",
    origin: "Пункт отправления",
    close: "Закрыть",
    zoom_in: "Показать полную карточку",
    zoom_out: "Вернуться к компактному виду",
    departures_entity: "Сенсор вылетов",
    arrivals_entity: "Сенсор прилётов",
    airport_entity: "Сущность отслеживаемого аэропорта",
    title: "Заголовок",
    default_tab: "Вкладка по умолчанию",
    show_departures: "Вкладка Вылет",
    show_arrivals: "Вкладка Прилёт",
    max_flights: "Показанные рейсы",
    hours_ahead: "Часов вперёд",
    show_past: "Прошедшие рейсы",
    show_airline: "Название авиакомпании",
    show_aircraft: "Тип самолёта",
    show_stats: "Статистика",
    illustration: "Иллюстрация",
    illustration_theme: "Тема иллюстрации",
    theme_auto: "Автоматически",
    theme_day: "День",
    theme_night: "Ночь",
    zoom: "Кнопка подробностей",
    language: "Язык",
    lang_auto: "Автоматически",
  },
  uk: {
    departures: "Виліт",
    arrivals: "Приліт",
    airport: "Аеропорт",
    flights_one: "{n} рейс",
    flights_few: "{n} рейси",
    flights_many: "{n} рейсів",
    flights_other: "{n} рейсу",
    on_time_pct: "{pct} вчасно",
    avg_delay: "сер. {delay}",
    minutes: "{n} хв",
    to_city: "до {city}",
    from_city: "з {city}",
    in_minutes: "через {n} хв",
    in_hours: "через {h} год {m}",
    now: "зараз",
    minutes_ago: "{n} хв тому",
    no_flights: "Немає майбутніх рейсів",
    no_entities: "Сенсори аеропорту FlightRadar24 не знайдено. Чи встановлено інтеграцію FlightRadar24?",
    not_tracked: "Аеропорт не відстежується: введіть код аеропорту в сутність FlightRadar24 « Airport track ».",
    status_on_time: "Вчасно",
    status_delayed: "Затримується",
    status_boarding: "Посадка",
    status_departed: "Вилетів",
    status_landed: "Приземлився",
    status_estimated: "Очікується",
    status_canceled: "Скасовано",
    status_diverted: "Перенаправлено",
    status_unknown: "Невідомо",
    flight: "Рейс",
    airline: "Авіакомпанія",
    aircraft: "Літак",
    registration: "Бортовий номер",
    callsign: "Позивний",
    scheduled: "За розкладом",
    estimated: "Очікуваний",
    actual: "Фактичний",
    destination: "Пункт призначення",
    origin: "Пункт відправлення",
    close: "Закрити",
    zoom_in: "Показати повну картку",
    zoom_out: "Повернутися до компактного вигляду",
    departures_entity: "Сенсор вильотів",
    arrivals_entity: "Сенсор прильотів",
    airport_entity: "Сутність відстежуваного аеропорту",
    title: "Заголовок",
    default_tab: "Вкладка за замовчуванням",
    show_departures: "Вкладка Виліт",
    show_arrivals: "Вкладка Приліт",
    max_flights: "Показані рейси",
    hours_ahead: "Годин наперед",
    show_past: "Минулі рейси",
    show_airline: "Назва авіакомпанії",
    show_aircraft: "Тип літака",
    show_stats: "Статистика",
    illustration: "Ілюстрація",
    illustration_theme: "Тема ілюстрації",
    theme_auto: "Автоматично",
    theme_day: "День",
    theme_night: "Ніч",
    zoom: "Кнопка деталей",
    language: "Мова",
    lang_auto: "Автоматично",
  },
  hu: {
    departures: "Indulások",
    arrivals: "Érkezések",
    airport: "Repülőtér",
    flights_one: "{n} járat",
    flights_other: "{n} járat",
    on_time_pct: "{pct} pontos",
    avg_delay: "átl. {delay}",
    minutes: "{n} perc",
    to_city: "{city} felé",
    from_city: "{city} felől",
    in_minutes: "{n} perc múlva",
    in_hours: "{h} ó {m} múlva",
    now: "most",
    minutes_ago: "{n} perce",
    no_flights: "Nincs közelgő járat",
    no_entities: "Nem található FlightRadar24 repülőtér-érzékelő. Telepítve van a FlightRadar24 integráció?",
    not_tracked: "Nincs követett repülőtér: adjon meg egy repülőtérkódot a FlightRadar24 « Airport track » entitásában.",
    status_on_time: "Pontos",
    status_delayed: "Késik",
    status_boarding: "Beszállás",
    status_departed: "Elindult",
    status_landed: "Leszállt",
    status_estimated: "Várható",
    status_canceled: "Törölve",
    status_diverted: "Elterelve",
    status_unknown: "Ismeretlen",
    flight: "Járat",
    airline: "Légitársaság",
    aircraft: "Repülőgép",
    registration: "Lajstromjel",
    callsign: "Hívójel",
    scheduled: "Menetrend szerint",
    estimated: "Várható",
    actual: "Tényleges",
    destination: "Úti cél",
    origin: "Indulási hely",
    close: "Bezárás",
    zoom_in: "Teljes kártya megjelenítése",
    zoom_out: "Vissza a kompakt nézethez",
    departures_entity: "Indulások érzékelője",
    arrivals_entity: "Érkezések érzékelője",
    airport_entity: "A követett repülőtér entitása",
    title: "Cím",
    default_tab: "Alapértelmezett lap",
    show_departures: "Indulások lap",
    show_arrivals: "Érkezések lap",
    max_flights: "Megjelenített járatok",
    hours_ahead: "Előretekintés (óra)",
    show_past: "Korábbi járatok",
    show_airline: "Légitársaság neve",
    show_aircraft: "Repülőgép típusa",
    show_stats: "Statisztika",
    illustration: "Illusztráció",
    illustration_theme: "Az illusztráció témája",
    theme_auto: "Automatikus",
    theme_day: "Nappal",
    theme_night: "Éjszaka",
    zoom: "Részletek gomb",
    language: "Nyelv",
    lang_auto: "Automatikus",
  },
  sk: {
    departures: "Odlety",
    arrivals: "Prílety",
    airport: "Letisko",
    flights_one: "{n} let",
    flights_few: "{n} lety",
    flights_many: "{n} letu",
    flights_other: "{n} letov",
    on_time_pct: "{pct} načas",
    avg_delay: "priem. {delay}",
    minutes: "{n} min",
    to_city: "do {city}",
    from_city: "z {city}",
    in_minutes: "o {n} min",
    in_hours: "o {h} h {m}",
    now: "teraz",
    minutes_ago: "pred {n} min",
    no_flights: "Žiadne nadchádzajúce lety",
    no_entities: "Nenašli sa letiskové senzory FlightRadar24. Je nainštalovaná integrácia FlightRadar24?",
    not_tracked: "Nesleduje sa žiadne letisko: zadajte kód letiska do entity FlightRadar24 « Airport track ».",
    status_on_time: "Načas",
    status_delayed: "Meškanie",
    status_boarding: "Nástup",
    status_departed: "Odletel",
    status_landed: "Pristál",
    status_estimated: "Očakávaný",
    status_canceled: "Zrušený",
    status_diverted: "Presmerovaný",
    status_unknown: "Neznámy",
    flight: "Let",
    airline: "Letecká spoločnosť",
    aircraft: "Lietadlo",
    registration: "Registrácia",
    callsign: "Volacia značka",
    scheduled: "Plánovaný",
    estimated: "Očakávaný",
    actual: "Skutočný",
    destination: "Cieľ",
    origin: "Pôvod",
    close: "Zavrieť",
    zoom_in: "Zobraziť celú kartu",
    zoom_out: "Späť na kompaktné zobrazenie",
    departures_entity: "Senzor odletov",
    arrivals_entity: "Senzor príletov",
    airport_entity: "Entita sledovaného letiska",
    title: "Názov",
    default_tab: "Predvolená karta",
    show_departures: "Karta Odlety",
    show_arrivals: "Karta Prílety",
    max_flights: "Zobrazené lety",
    hours_ahead: "Hodiny dopredu",
    show_past: "Minulé lety",
    show_airline: "Názov leteckej spoločnosti",
    show_aircraft: "Typ lietadla",
    show_stats: "Štatistiky",
    illustration: "Ilustrácia",
    illustration_theme: "Téma ilustrácie",
    theme_auto: "Automaticky",
    theme_day: "Deň",
    theme_night: "Noc",
    zoom: "Tlačidlo podrobností",
    language: "Jazyk",
    lang_auto: "Automaticky",
  },
  cs: {
    departures: "Odlety",
    arrivals: "Přílety",
    airport: "Letiště",
    flights_one: "{n} let",
    flights_few: "{n} lety",
    flights_many: "{n} letu",
    flights_other: "{n} letů",
    on_time_pct: "{pct} včas",
    avg_delay: "prům. {delay}",
    minutes: "{n} min",
    to_city: "do {city}",
    from_city: "z {city}",
    in_minutes: "za {n} min",
    in_hours: "za {h} h {m}",
    now: "nyní",
    minutes_ago: "před {n} min",
    no_flights: "Žádné nadcházející lety",
    no_entities: "Nenalezeny letištní senzory FlightRadar24. Je nainstalována integrace FlightRadar24?",
    not_tracked: "Nesleduje se žádné letiště: zadejte kód letiště do entity FlightRadar24 « Airport track ».",
    status_on_time: "Včas",
    status_delayed: "Zpoždění",
    status_boarding: "Nástup",
    status_departed: "Odletěl",
    status_landed: "Přistál",
    status_estimated: "Očekávaný",
    status_canceled: "Zrušen",
    status_diverted: "Odkloněn",
    status_unknown: "Neznámý",
    flight: "Let",
    airline: "Letecká společnost",
    aircraft: "Letadlo",
    registration: "Registrace",
    callsign: "Volací znak",
    scheduled: "Plánovaný",
    estimated: "Očekávaný",
    actual: "Skutečný",
    destination: "Cíl",
    origin: "Původ",
    close: "Zavřít",
    zoom_in: "Zobrazit celou kartu",
    zoom_out: "Zpět na kompaktní zobrazení",
    departures_entity: "Senzor odletů",
    arrivals_entity: "Senzor příletů",
    airport_entity: "Entita sledovaného letiště",
    title: "Název",
    default_tab: "Výchozí karta",
    show_departures: "Karta Odlety",
    show_arrivals: "Karta Přílety",
    max_flights: "Zobrazené lety",
    hours_ahead: "Hodiny dopředu",
    show_past: "Minulé lety",
    show_airline: "Název letecké společnosti",
    show_aircraft: "Typ letadla",
    show_stats: "Statistiky",
    illustration: "Ilustrace",
    illustration_theme: "Motiv ilustrace",
    theme_auto: "Automaticky",
    theme_day: "Den",
    theme_night: "Noc",
    zoom: "Tlačítko podrobností",
    language: "Jazyk",
    lang_auto: "Automaticky",
  },
  sl: {
    departures: "Odhodi",
    arrivals: "Prihodi",
    airport: "Letališče",
    flights_one: "{n} let",
    flights_two: "{n} leta",
    flights_few: "{n} leti",
    flights_other: "{n} letov",
    on_time_pct: "{pct} točno",
    avg_delay: "povp. {delay}",
    minutes: "{n} min",
    to_city: "v {city}",
    from_city: "iz {city}",
    in_minutes: "čez {n} min",
    in_hours: "čez {h} h {m}",
    now: "zdaj",
    minutes_ago: "pred {n} min",
    no_flights: "Ni prihajajočih letov",
    no_entities: "Ni najdenih letaliških senzorjev FlightRadar24. Ali je integracija FlightRadar24 nameščena?",
    not_tracked: "Nobeno letališče ni spremljano: vnesite kodo letališča v entiteto FlightRadar24 « Airport track ».",
    status_on_time: "Točno",
    status_delayed: "Zamuda",
    status_boarding: "Vkrcavanje",
    status_departed: "Vzletel",
    status_landed: "Pristal",
    status_estimated: "Predviden",
    status_canceled: "Odpovedan",
    status_diverted: "Preusmerjen",
    status_unknown: "Neznano",
    flight: "Let",
    airline: "Letalski prevoznik",
    aircraft: "Letalo",
    registration: "Registracija",
    callsign: "Klicni znak",
    scheduled: "Po voznem redu",
    estimated: "Predvideno",
    actual: "Dejansko",
    destination: "Cilj",
    origin: "Izvor",
    close: "Zapri",
    zoom_in: "Prikaži celotno kartico",
    zoom_out: "Nazaj na kompaktni pogled",
    departures_entity: "Senzor odhodov",
    arrivals_entity: "Senzor prihodov",
    airport_entity: "Entiteta spremljanega letališča",
    title: "Naslov",
    default_tab: "Privzeti zavihek",
    show_departures: "Zavihek Odhodi",
    show_arrivals: "Zavihek Prihodi",
    max_flights: "Prikazani leti",
    hours_ahead: "Ure vnaprej",
    show_past: "Pretekli leti",
    show_airline: "Ime prevoznika",
    show_aircraft: "Tip letala",
    show_stats: "Statistika",
    illustration: "Ilustracija",
    illustration_theme: "Tema ilustracije",
    theme_auto: "Samodejno",
    theme_day: "Dan",
    theme_night: "Noč",
    zoom: "Gumb za podrobnosti",
    language: "Jezik",
    lang_auto: "Samodejno",
  },
  lv: {
    departures: "Izlidošana",
    arrivals: "Ielidošana",
    airport: "Lidosta",
    flights_zero: "{n} lidojumu",
    flights_one: "{n} lidojums",
    flights_other: "{n} lidojumi",
    on_time_pct: "{pct} laikā",
    avg_delay: "vid. {delay}",
    minutes: "{n} min",
    to_city: "uz {city}",
    from_city: "no {city}",
    in_minutes: "pēc {n} min",
    in_hours: "pēc {h} h {m}",
    now: "tagad",
    minutes_ago: "pirms {n} min",
    no_flights: "Nav gaidāmu lidojumu",
    no_entities: "FlightRadar24 lidostas sensori nav atrasti. Vai FlightRadar24 integrācija ir instalēta?",
    not_tracked: "Neviena lidosta netiek sekota: ievadiet lidostas kodu FlightRadar24 entītijā « Airport track ».",
    status_on_time: "Laikā",
    status_delayed: "Kavējas",
    status_boarding: "Iekāpšana",
    status_departed: "Izlidojis",
    status_landed: "Nolaidies",
    status_estimated: "Paredzēts",
    status_canceled: "Atcelts",
    status_diverted: "Novirzīts",
    status_unknown: "Nezināms",
    flight: "Lidojums",
    airline: "Aviokompānija",
    aircraft: "Lidmašīna",
    registration: "Reģistrācija",
    callsign: "Izsaukuma signāls",
    scheduled: "Pēc saraksta",
    estimated: "Paredzētais",
    actual: "Faktiskais",
    destination: "Galamērķis",
    origin: "Izcelsme",
    close: "Aizvērt",
    zoom_in: "Rādīt pilno karti",
    zoom_out: "Atpakaļ uz kompakto skatu",
    departures_entity: "Izlidošanas sensors",
    arrivals_entity: "Ielidošanas sensors",
    airport_entity: "Sekotās lidostas entītija",
    title: "Virsraksts",
    default_tab: "Noklusējuma cilne",
    show_departures: "Cilne Izlidošana",
    show_arrivals: "Cilne Ielidošana",
    max_flights: "Rādītie lidojumi",
    hours_ahead: "Stundas uz priekšu",
    show_past: "Pagājušie lidojumi",
    show_airline: "Aviokompānijas nosaukums",
    show_aircraft: "Lidmašīnas tips",
    show_stats: "Statistika",
    illustration: "Ilustrācija",
    illustration_theme: "Ilustrācijas tēma",
    theme_auto: "Automātiski",
    theme_day: "Diena",
    theme_night: "Nakts",
    zoom: "Detaļu poga",
    language: "Valoda",
    lang_auto: "Automātiski",
  },
  el: {
    departures: "Αναχωρήσεις",
    arrivals: "Αφίξεις",
    airport: "Αεροδρόμιο",
    flights_one: "{n} πτήση",
    flights_other: "{n} πτήσεις",
    on_time_pct: "{pct} στην ώρα τους",
    avg_delay: "μ.ό. {delay}",
    minutes: "{n} λεπ.",
    to_city: "προς {city}",
    from_city: "από {city}",
    in_minutes: "σε {n} λεπ.",
    in_hours: "σε {h} ώ. {m}",
    now: "τώρα",
    minutes_ago: "πριν από {n} λεπ.",
    no_flights: "Δεν υπάρχουν επερχόμενες πτήσεις",
    no_entities: "Δεν βρέθηκαν αισθητήρες αεροδρομίου του FlightRadar24. Είναι εγκατεστημένη η ενσωμάτωση FlightRadar24;",
    not_tracked: "Δεν παρακολουθείται αεροδρόμιο: εισαγάγετε έναν κωδικό αεροδρομίου στην οντότητα « Airport track » του FlightRadar24.",
    status_on_time: "Στην ώρα της",
    status_delayed: "Καθυστέρηση",
    status_boarding: "Επιβίβαση",
    status_departed: "Αναχώρησε",
    status_landed: "Προσγειώθηκε",
    status_estimated: "Εκτιμώμενη",
    status_canceled: "Ακυρώθηκε",
    status_diverted: "Εκτράπηκε",
    status_unknown: "Άγνωστο",
    flight: "Πτήση",
    airline: "Αεροπορική εταιρεία",
    aircraft: "Αεροσκάφος",
    registration: "Νηολόγιο",
    callsign: "Διακριτικό κλήσης",
    scheduled: "Προγραμματισμένη",
    estimated: "Εκτιμώμενη",
    actual: "Πραγματική",
    destination: "Προορισμός",
    origin: "Προέλευση",
    close: "Κλείσιμο",
    zoom_in: "Εμφάνιση πλήρους κάρτας",
    zoom_out: "Επιστροφή στη συμπαγή προβολή",
    departures_entity: "Αισθητήρας αναχωρήσεων",
    arrivals_entity: "Αισθητήρας αφίξεων",
    airport_entity: "Οντότητα παρακολουθούμενου αεροδρομίου",
    title: "Τίτλος",
    default_tab: "Προεπιλεγμένη καρτέλα",
    show_departures: "Καρτέλα Αναχωρήσεις",
    show_arrivals: "Καρτέλα Αφίξεις",
    max_flights: "Εμφανιζόμενες πτήσεις",
    hours_ahead: "Ώρες μπροστά",
    show_past: "Παλαιότερες πτήσεις",
    show_airline: "Όνομα αεροπορικής",
    show_aircraft: "Τύπος αεροσκάφους",
    show_stats: "Στατιστικά",
    illustration: "Εικονογράφηση",
    illustration_theme: "Θέμα εικονογράφησης",
    theme_auto: "Αυτόματο",
    theme_day: "Ημέρα",
    theme_night: "Νύχτα",
    zoom: "Κουμπί λεπτομερειών",
    language: "Γλώσσα",
    lang_auto: "Αυτόματα",
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const esc = (v) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const lang = (hass, config) => {
  const l = config?.language || (hass && (hass.locale?.language || hass.language)) || "en";
  return STRINGS[l] ? l : STRINGS[l.split("-")[0]] ? l.split("-")[0] : "en";
};

// Locale for Intl: Home Assistant's full locale when its base matches the card's resolved language (keeps the
// region, e.g. pt-BR or de-CH), otherwise the resolved language. Home Assistant's "pt" is European Portuguese,
// which Intl would format as Brazilian, so bare "pt" becomes "pt-PT".
const fmtLang = (hass, config) => {
  const l = lang(hass, config);
  const ha = hass && (hass.locale?.language || hass.language);
  const loc = ha && ha.split("-")[0] === l.split("-")[0] && l !== "sr-Latn" ? ha : l;
  return loc === "pt" ? "pt-PT" : loc;
};

// A text of the card's language, English when missing, with its {placeholders} filled.
const t = (hass, config, key, vars = {}) => {
  const s = STRINGS[lang(hass, config)][key] ?? STRINGS.en[key] ?? key;
  return String(s).replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
};

// "12 flights": the plural form of the card's language (Intl.PluralRules), the `_other` form when the language has
// no text for that form.
const plural = (hass, config, key, n) => {
  let cat = "other";
  try {
    cat = new Intl.PluralRules(fmtLang(hass, config)).select(n);
  } catch (_e) {
    /* default form */
  }
  const table = STRINGS[lang(hass, config)];
  const k = `${key}_${cat}` in table ? `${key}_${cat}` : `${key}_other`;
  return t(hass, config, k, { n });
};

// The FlightRadar24 radar mark (images/flightradar24-mark.svg), the brand badge of the header icon.
const FR24_MARK = `<svg class="mark" viewBox="0 0 45 45" fill="#1d1d1b" aria-hidden="true"><path d="M22.204,2.826C11.336,2.826,2.5,11.663,2.5,22.53c0,10.867,8.836,19.704,19.704,19.704s19.704-8.837,19.704-19.704C41.907,11.663,33.071,2.826,22.204,2.826zM22.204,39.27c-0.988,0-1.921-0.11-2.909-0.274l0.823-4.995c0.659,0.11,1.317,0.165,2.031,0.165c6.476,0,11.745-5.269,11.745-11.745c0-6.477-5.269-11.746-11.745-11.746c-6.477,0-11.746,5.269-11.746,11.746c0,3.787,1.811,7.135,4.555,9.275l-3.238,3.897c-3.897-3.074-6.421-7.849-6.421-13.172c0-9.276,7.519-16.795,16.794-16.795s16.795,7.519,16.795,16.795C38.889,31.696,31.479,39.27,22.204,39.27zM19.13,26.811c-1.372-0.933-2.25-2.525-2.25-4.281c0-2.909,2.36-5.269,5.269-5.269c2.908,0,5.269,2.36,5.269,5.269c0,2.909-2.36,5.269-5.269,5.269c-0.33,0-0.659-0.055-0.934-0.11l0.714-4.336L19.13,26.811zM22.204,29.062c2.964,0,5.489-1.977,6.257-4.666c0.11,0.165,0.33,0.274,0.549,0.274c0.384,0,0.769-0.329,0.769-0.769c0-0.439-0.33-0.768-0.769-0.768c-0.11,0-0.219,0.055-0.329,0.11c0.055-0.274,0.055-0.494,0.055-0.769c0-3.623-2.964-6.532-6.531-6.532s-6.531,2.964-6.531,6.532c0,2.195,1.043,4.116,2.689,5.269l-2.25,2.744c-2.415-1.866-3.952-4.775-3.952-8.013c0-0.988,0.165-1.976,0.439-2.909c0.11,0.055,0.22,0.11,0.33,0.11c0.384,0,0.768-0.329,0.768-0.768c0-0.33-0.219-0.604-0.549-0.714c1.592-3.458,5.104-5.818,9.166-5.818c5.543,0,10.099,4.556,10.099,10.099c0,4.116-2.47,7.684-6.037,9.275c-0.055-0.329-0.385-0.604-0.714-0.604c-0.384,0-0.768,0.329-0.768,0.768c0,0.11,0.055,0.274,0.11,0.384c-0.878,0.219-1.756,0.384-2.689,0.384c-0.604,0-1.208-0.055-1.756-0.165l0.604-3.512C21.435,29.006,21.819,29.062,22.204,29.062L22.204,29.062z"/><circle cx="11.775" cy="33.287" r="0.769"/><circle cx="22.204" cy="22.64" r="0.769"/><circle cx="28.131" cy="9.302" r="0.768"/><circle cx="14.958" cy="18.688" r="0.769"/></svg>`;
const brandBadge = () => `<span class="brand" title="FlightRadar24">${FR24_MARK}</span>`;

const svgIcon = (path, cls = "") => `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg>`;

// ---------------------------------------------------------------------------
// FlightRadar24 entities
// ---------------------------------------------------------------------------

const PLATFORM = "flightradar24";
// Translation keys of the integration's airport entities, and their default entity ids (const.py,
// STABLE_ENTITY_OBJECT_IDS: the delay and canceled sensors have no "airport_" in their ids).
const KEYS = {
  departures: ["airport_departures", "sensor.flightradar24_airport_departures"],
  arrivals: ["airport_arrivals", "sensor.flightradar24_airport_arrivals"],
  departures_on_time: ["airport_departures_on_time", "sensor.flightradar24_departures_on_time"],
  departures_delayed: ["airport_departures_delayed", "sensor.flightradar24_departures_delayed"],
  departures_delay_average: ["airport_departures_delay_average", "sensor.flightradar24_departures_delay_average"],
  departures_canceled: ["airport_departures_canceled", "sensor.flightradar24_departures_canceled"],
  arrivals_on_time: ["airport_arrivals_on_time", "sensor.flightradar24_airport_arrivals_on_time"],
  arrivals_delayed: ["airport_arrivals_delayed", "sensor.flightradar24_airport_arrivals_delayed"],
  arrivals_delay_average: ["airport_arrivals_delay_average", "sensor.flightradar24_arrivals_delay_average"],
  arrivals_canceled: ["airport_arrivals_canceled", "sensor.flightradar24_arrivals_canceled"],
  track: ["airport_track", "text.flightradar24_airport_track"],
};
// Older releases of the integration named the departures stats like the arrivals ones.
const LEGACY_IDS = {
  departures_on_time: "sensor.flightradar24_airport_departures_on_time",
  departures_delayed: "sensor.flightradar24_airport_departures_delayed",
};

const _found = new Map();
// The airport entities: the configured ones, else those of the integration's registry entries (on the same device
// as the configured departures or arrivals sensor when one is set), else the default entity ids.
const discover = (hass, config = {}) => {
  const states = hass?.states || {};
  const entities = hass?.entities;
  const key = [config.departures_entity, config.arrivals_entity, config.airport_entity].join("|");
  const cached = _found.get(key);
  if (cached && cached.entities === entities && cached.count === Object.keys(states).length) return cached.out;
  const out = {};
  const reg = Object.values(entities || {}).filter((e) => e && e.platform === PLATFORM && e.translation_key);
  const anchor = [config.departures_entity, config.arrivals_entity].map((id) => entities?.[id]).find(Boolean);
  const device = anchor?.device_id;
  for (const [k, [tk, id]] of Object.entries(KEYS)) {
    const matches = reg.filter((e) => e.translation_key === tk);
    const pick = matches.find((e) => device && e.device_id === device && states[e.entity_id]) || matches.find((e) => states[e.entity_id]);
    out[k] = pick?.entity_id || (states[id] ? id : LEGACY_IDS[k] && states[LEGACY_IDS[k]] ? LEGACY_IDS[k] : undefined);
  }
  if (config.departures_entity) out.departures = config.departures_entity;
  if (config.arrivals_entity) out.arrivals = config.arrivals_entity;
  if (config.airport_entity) out.track = config.airport_entity;
  _found.set(key, { entities, count: Object.keys(states).length, out });
  return out;
};

// ---------------------------------------------------------------------------
// Flights
// ---------------------------------------------------------------------------

// A delay of this many minutes or more is shown as a delay.
const DELAY_MIN = 15;
// A departure is shown as boarding from this long before its expected time (FlightRadar24 has no boarding status).
const BOARDING_S = 30 * 60;
const num = (v) => (v === null || v === undefined || v === "" || !Number.isFinite(Number(v)) ? null : Number(v));

// What the card shows of a flight of the departures ("dep") or arrivals ("arr") board, at `now` (seconds):
// its times, its delay in minutes (estimated or actual time against the scheduled one) and its status:
// `key` (translation key), `cls` (colour: ok, warn, accent, danger, na).
const flightInfo = (f, kind, now) => {
  const dep = kind === "dep";
  const scheduled = num(dep ? f.time_scheduled_departure : f.time_scheduled_arrival);
  const estimated = num(dep ? f.time_estimated_departure : f.time_estimated_arrival);
  const actual = num(dep ? f.time_real_departure : f.time_real_arrival);
  const expected = actual ?? estimated ?? scheduled;
  const later = actual ?? estimated;
  const delay = scheduled !== null && later !== null ? Math.round((later - scheduled) / 60) : null;
  const generic = String(f.status ?? "").toLowerCase();
  const text = String(f.status_text ?? "").toLowerCase();
  let key;
  let cls;
  if (/cancel/.test(generic) || /cancel/.test(text)) [key, cls] = ["canceled", "danger"];
  else if (/divert/.test(generic) || /divert/.test(text)) [key, cls] = ["diverted", "danger"];
  else if (!dep && (actual !== null || generic === "landed" || /^landed/.test(text))) [key, cls] = ["landed", "accent"];
  else if (dep && (actual !== null || generic === "departed" || /^departed/.test(text))) [key, cls] = ["departed", "accent"];
  else if ((delay !== null && delay >= DELAY_MIN) || generic === "delayed") [key, cls] = ["delayed", "warn"];
  else if (dep && (/boarding/.test(text) || (expected !== null && expected - now <= BOARDING_S && expected - now > -BOARDING_S)))
    [key, cls] = ["boarding", "accent"];
  else if (!dep && estimated !== null && (generic === "estimated" || num(f.time_real_departure) !== null)) [key, cls] = ["estimated", "accent"];
  else if (scheduled === null && (generic === "unknown" || !generic)) [key, cls] = ["unknown", "na"];
  else [key, cls] = ["on_time", "ok"];
  return { f, scheduled, estimated, actual, expected, delay, key, cls };
};

// A flight that has left (departed, landed), or whose time is long gone (canceled, no news).
const isPast = (info, now) => info.key === "departed" || info.key === "landed" || (info.expected !== null && info.expected < now - 3600);

// The flights of a board as shown: sorted by scheduled time, past ones left out unless `show_past`, those beyond
// `hours_ahead` left out.
const boardFlights = (flights, kind, now, config = {}) => {
  const hours = num(config.hours_ahead);
  return (Array.isArray(flights) ? flights : [])
    .filter((f) => f && typeof f === "object")
    .map((f) => flightInfo(f, kind, now))
    .filter((i) => config.show_past === true || !isPast(i, now))
    .filter((i) => !hours || i.expected === null || i.expected <= now + hours * 3600)
    .sort((a, b) => (a.scheduled ?? a.expected ?? Infinity) - (b.scheduled ?? b.expected ?? Infinity));
};

// Board statistics: on-time share and average delay, from the integration's statistics sensors (today at the
// airport) when they have values, else computed from the listed flights.
const boardStats = (flights, sensors = {}) => {
  const onTime = num(sensors.on_time);
  const delayed = num(sensors.delayed);
  let pct = onTime !== null && delayed !== null && onTime + delayed > 0 ? onTime / (onTime + delayed) : null;
  let avg = num(sensors.delay_average);
  const known = flights.filter((i) => i.key !== "canceled" && i.key !== "diverted" && i.key !== "unknown");
  if (pct === null && known.length) pct = known.filter((i) => !(i.delay >= DELAY_MIN) && i.key !== "delayed").length / known.length;
  if (avg === null) {
    const delays = known.map((i) => i.delay).filter((d) => d !== null);
    avg = delays.length ? Math.round(delays.reduce((a, d) => a + Math.max(0, d), 0) / delays.length) : null;
  }
  return { count: flights.length, pct, avg };
};

const flightLabel = (f) => String(f.flight_number || f.callsign || "").trim();
const cityOf = (f) => f.airport_city || f.airport_name || f.airport_code_iata || f.airport_code_icao || "";

// ---------------------------------------------------------------------------
// Shadow DOM patching (kept nodes keep their focus, hover and running animations)
// ---------------------------------------------------------------------------

const patchAttrs = (cur, next) => {
  for (const { name } of [...cur.attributes]) if (!next.hasAttribute(name)) cur.removeAttribute(name);
  for (const { name, value } of next.attributes) if (cur.getAttribute(name) !== value) cur.setAttribute(name, value);
};
const keyOf = (n) => (n.nodeType === 1 ? n.getAttribute("data-key") : null);
const sameNode = (a, b) => !!a && a.nodeType === b.nodeType && a.nodeName === b.nodeName;
const patchChildren = (cur, next) => {
  const old = [...cur.childNodes];
  const fresh = [...next.childNodes];
  const byKey = new Map();
  for (const o of old) {
    const k = keyOf(o);
    if (k !== null && !byKey.has(k)) byKey.set(k, o);
  }
  const used = new Set();
  fresh.forEach((n, i) => {
    const k = keyOf(n);
    let o = k !== null ? byKey.get(k) : old[i];
    if (!sameNode(o, n) || used.has(o) || (k === null && keyOf(o) !== null)) o = null;
    const ref = cur.childNodes[i] ?? null;
    if (!o) {
      cur.insertBefore(n, ref);
      return;
    }
    used.add(o);
    if (o !== ref) cur.insertBefore(o, ref);
    if (n.nodeType === 1) {
      patchAttrs(o, n);
      patchChildren(o, n);
    } else if (o.nodeValue !== n.nodeValue) o.nodeValue = n.nodeValue;
  });
  while (cur.childNodes.length > fresh.length) cur.removeChild(cur.lastChild);
};
const morph = (root, html) => {
  const tpl = document.createElement("template");
  tpl.innerHTML = html;
  patchChildren(root, tpl.content);
};

// A click inside a dialog (more-info opened from the card) is not a click outside the card.
const inDialog = (ev) => ev.composedPath().some((n) => ["ha-more-info-dialog", "ha-dialog", "dialog"].includes(n.localName));

// "A click elsewhere" is caught on the pointer, not only on the click event: on iOS (Safari and the companion app)
// a tap on something that is not clickable sends no click to the page. The handler runs when the press and the
// release are both outside the card; keyboard clicks (no click count) still go through the click event.
const watchOutside = (card, handler) => {
  let downOutside = false;
  const outside = (ev) => !ev.composedPath().includes(card);
  const onDown = (ev) => {
    downOutside = outside(ev);
  };
  const onUp = (ev) => {
    if (downOutside && outside(ev)) handler(ev);
    downOutside = false;
  };
  const onClick = (ev) => {
    if (ev.detail === 0 && outside(ev)) handler(ev);
  };
  return {
    on() {
      document.addEventListener("pointerdown", onDown, true);
      document.addEventListener("pointerup", onUp, true);
      document.addEventListener("click", onClick, true);
    },
    off() {
      document.removeEventListener("pointerdown", onDown, true);
      document.removeEventListener("pointerup", onUp, true);
      document.removeEventListener("click", onClick, true);
    },
    tap(ev) {
      onDown(ev);
      onUp(ev);
    },
  };
};

// ---------------------------------------------------------------------------
// The illustration: sky, airport scenery, runway and the plane of the tab
// ---------------------------------------------------------------------------

// Every animation of the illustration lasts a divisor of 8 s: the plane's 8 s cycle, so a recording of 8 s loops.
// The scenery is drawn in a 200 × 80 box whose bottom edge stands on the runway strip.
const PLANE = `
  <g class="gear">
    <path d="M-2.5,-3 L-2.5,-1.2 M14,-3 L14,-1.2" stroke="#59626c" stroke-width=".8"/>
    <circle cx="-2.5" cy="-1" r="1" fill="#2c3238"/><circle cx="14" cy="-1" r=".9" fill="#2c3238"/>
  </g>
  <path d="M-19.5,-6.6 L-24.5,-5.6 L-23.5,-4.9 L-16,-5.4 Z" fill="#cfd7e0"/>
  <path d="M-14,-9 L-19.8,-17.5 L-16.3,-17.5 L-9,-9 Z" fill="#ff7a1a"/>
  <path d="M-20,-6.2 C-20,-8.2 -18,-9.1 -14,-9.1 L12,-9.1 C17,-9.1 21,-7.6 22.2,-5.6 C22.7,-4.4 21.2,-3 18,-3 L-15.5,-3 C-18.4,-3 -20,-4.2 -20,-6.2 Z" fill="#ffffff" stroke="#c4ced8" stroke-width=".4"/>
  <path d="M-18.6,-5.7 L19.8,-5.7 L21.4,-4.7 L-18.4,-4.7 Z" fill="#2f80ed"/>
  <path d="M15.6,-8.2 L18.6,-7.8 L20,-6.7 L16,-6.7 Z" fill="#1d3557"/>
  <g fill="#1d3557">${Array.from({ length: 11 }, (_, i) => `<rect x="${(-12 + i * 2.5).toFixed(1)}" y="-8" width="1.2" height="1.2" rx=".3"/>`).join("")}</g>
  <path d="M-3,-4.4 L5,-4.4 L-6.5,.2 L-9.5,.2 Z" fill="#8d99a6"/>
  <rect x="-1.5" y="-3.4" width="7" height="2.8" rx="1.4" fill="#6c7884"/>
  <ellipse cx="5.4" cy="-2" rx=".7" ry="1.3" fill="#38424d"/>`;

const cloud = (x, y, s) =>
  `<path transform="translate(${x} ${y}) scale(${s})" d="M-14,4 C-17,4 -18,0 -14.5,-1 C-14,-5 -8,-6 -6,-3 C-4,-8 4,-8 5,-2 C9,-3 12,0 10,4 Z"/>`;

// Stars of the night sky (fixed places, a few of them twinkling).
const STARS = [
  [8, 8, 0.6], [26, 20, 0.5], [44, 6, 0.7], [62, 26, 0.5], [78, 12, 0.6], [98, 5, 0.5], [108, 30, 0.6], [146, 8, 0.7],
  [160, 22, 0.5], [178, 6, 0.6], [192, 16, 0.5], [118, 18, 0.4], [36, 32, 0.4], [86, 36, 0.4],
];

// The scenery: hills, terminal, control tower, windsock, sun or moon, clouds, the plane taking off (departures) or
// landing (arrivals). `run` changes when the tab changes: a new plane element, so its animation starts again.
const sceneSvg = (kind, night, run) => {
  const win = night ? "#ffcf6e" : "#86b9de";
  const dark = night ? "#3b4b5e" : "#86b9de";
  const windows = Array.from({ length: 9 }, (_, i) => {
    const lit = !night || ![2, 6].includes(i);
    return `<rect x="${84 + i * 6.8}" y="66" width="4.4" height="5.6" rx=".6" fill="${lit ? win : dark}"/>`;
  }).join("");
  const sky = night
    ? `<g class="stars">${STARS.map(([x, y, r], i) => `<circle class="${i % 3 === 0 ? "tw" : ""}" cx="${x}" cy="${y}" r="${r}"/>`).join("")}</g>
       <mask id="fb-moon"><rect width="200" height="80" fill="#fff"/><circle cx="119.5" cy="13.5" r="5.4" fill="#000"/></mask>
       <circle cx="116" cy="16" r="9" fill="#f3eed2" opacity=".12"/>
       <circle cx="116" cy="16" r="6" fill="#f3eed2" mask="url(#fb-moon)"/>`
    : `<circle cx="116" cy="17" r="11" fill="#ffd65a" opacity=".28"/><circle cx="116" cy="17" r="7" fill="#ffd65a"/>`;
  return `<svg class="scene" viewBox="0 0 200 80" preserveAspectRatio="xMaxYMax meet" aria-hidden="true" focusable="false">
    ${sky}
    <g class="clouds">
      <g class="cloud c1">${cloud(56, 14, 1)}</g>
      <g class="cloud c2">${cloud(184, 44, 0.7)}</g>
    </g>
    <path class="hill far" d="M0,80 C22,76 40,66 70,67 C96,68 110,59 140,61 C166,63 184,56 200,58 L200,80 Z"/>
    <path class="hill near" d="M24,80 C56,73 80,75 102,73.5 C132,71.5 162,70 200,72 L200,80 Z"/>
    <g class="terminal">
      <path d="M78,62.5 L148,62.5 L144,57.5 L82,57.5 Z" class="roof"/>
      <rect x="80" y="62" width="66" height="18" class="body"/>
      ${windows}
      <rect x="80" y="74.5" width="66" height="1.2" class="trim"/>
    </g>
    <g class="tower">
      <path d="M154.5,80 L161.5,80 L160.6,38 L155.4,38 Z" class="body"/>
      <path d="M149.5,38.5 L166.5,38.5 L164.6,28.5 L151.4,28.5 Z" class="cab"/>
      <rect x="151.8" y="30.4" width="12.4" height="4.6" rx=".6" fill="${night ? "#ffd27a" : "#a6dbf5"}"/>
      <rect x="150.4" y="26.4" width="15.2" height="2.6" rx=".8" class="cap"/>
      <path d="M158,26.5 L158,20.5" stroke="#6b7480" stroke-width=".7"/>
      <circle class="beacon-glow" cx="158" cy="19.4" r="3.8" fill="#ff3b30"/>
      <circle class="beacon" cx="158" cy="19.4" r="1.5" fill="#ff3b30"/>
    </g>
    <g class="windsock">
      <path d="M22,80 L22,61.5" stroke="#8a939c" stroke-width="1.1"/>
      <g transform="translate(22 62.4)"><g class="sock">
        <path d="M0,0 L4.6,.5 L4.6,4.6 L0,5.4 Z" fill="#ff7a1a"/>
        <path d="M4.6,.5 L9.2,1 L9.2,3.8 L4.6,4.6 Z" fill="#ffffff"/>
        <path d="M9.2,1 L13.6,1.5 L13.6,3.1 L9.2,3.8 Z" fill="#ff7a1a"/>
      </g></g>
    </g>
    <g class="flight" data-key="plane-${kind}-${run}"><g class="plane ${kind}">${PLANE}</g></g>
  </svg>`;
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const STYLE = `
  :host { --fb-accent: #2f80ed; --fb-ok: var(--success-color, #43a047); --fb-warn: var(--warning-color, #ffa600);
          --fb-danger: var(--error-color, #db4437); --fb-na: var(--disabled-text-color, #9e9e9e); display: block; }
  ha-card { overflow: hidden; position: relative; container-type: inline-size; }
  /* A size container has no width of its own content: in a parent sized by its content the card would fall to a
     few pixels. This empty grid gives it a natural width of 400 px without any minimum. */
  :host::before { content: ""; display: grid; grid-template-columns: minmax(0, 400px); height: 0; }
  .icon { width: 18px; height: 18px; fill: currentColor; flex: none; }
  .muted { color: var(--secondary-text-color); }
  [role="button"] { cursor: pointer; }
  [role="button"]:focus-visible, button:focus-visible { outline: 2px solid var(--primary-color, #03a9f4); outline-offset: 2px; }
  .ok { --c: var(--fb-ok); } .warn { --c: var(--fb-warn); } .accent { --c: var(--fb-accent); } .danger { --c: var(--fb-danger); } .na { --c: var(--fb-na); }
  /* Status pill: the state colour on a tint, the text mixed with the text colour to stay readable. */
  .chip { display: inline-flex; align-items: center; gap: 4px; padding: 1px 8px; border-radius: 12px; font-size: 11px; font-weight: 500;
          line-height: 16px; white-space: nowrap; min-width: 0; max-width: 100%; box-sizing: border-box; overflow: hidden;
          background: color-mix(in srgb, var(--c) 15%, transparent); color: color-mix(in srgb, var(--c) 40%, var(--primary-text-color, #212121)); }
  .chip .txt { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
  .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--c); flex: none; }
  .warning { padding: 16px; color: color-mix(in srgb, var(--fb-warn) 40%, var(--primary-text-color, #212121)); }

  /* ── Illustrated header ── */
  .banner { position: relative; height: var(--banner-h, 90px); overflow: hidden; --runway-h: 10px;
            --sky-text: #0d2a45; --sky-muted: #3b5b78;
            background: linear-gradient(90deg, #f1f8ff 0%, #e2f1fd 34%, #b9def8 70%, #9fd0f3 100%); }
  .banner.night { --sky-text: #ffffff; --sky-muted: rgba(255,255,255,.78);
                  background: linear-gradient(90deg, #1b2f52 0%, #15284a 36%, #0f1f3d 72%, #0a1830 100%); }
  .banner .scene { position: absolute; right: 0; bottom: var(--runway-h); height: calc(100% - var(--runway-h));
                   width: min(calc((var(--banner-h, 90px) - var(--runway-h)) * 2.5), var(--scene-max, 58%)); overflow: hidden; }
  .runway { position: absolute; left: 0; right: 0; bottom: 0; height: var(--runway-h); background: #858c94;
            box-shadow: inset 0 1px 0 #6f767d, inset 0 -1px 0 #6f767d; }
  .night .runway { background: #2c323b; box-shadow: inset 0 1px 0 #1f242b, inset 0 -1px 0 #1f242b; }
  /* Centre line markings, then the edge lights of both sides. */
  .runway .marks { position: absolute; left: 0; right: 0; top: calc(50% - .8px); height: 1.6px;
                   background: repeating-linear-gradient(90deg, rgba(255,255,255,.85) 0 9px, transparent 9px 18px); }
  .night .runway .marks { background: repeating-linear-gradient(90deg, rgba(255,255,255,.45) 0 9px, transparent 9px 18px); }
  .runway .lights { position: absolute; left: 0; right: 0; height: 3px;
                    background: radial-gradient(circle, #fff1b8 0 1.1px, transparent 1.5px) 4px 0 / 16px 3px repeat-x;
                    opacity: .55; animation: fb-pulse 2s ease-in-out infinite; }
  .runway .lights.top { top: 0; } .runway .lights.bottom { bottom: 0; animation-delay: -1s; }
  .night .runway .lights { background: radial-gradient(circle, #ffd27a 0 1.3px, rgba(255,210,122,.35) 1.6px, transparent 2.4px) 4px 0 / 16px 3px repeat-x; opacity: 1;
                           animation-name: fb-pulse-night; }
  .head { position: absolute; z-index: 1; left: 0; top: 0; bottom: var(--runway-h); box-sizing: border-box;
          right: min(calc((var(--banner-h, 90px) - var(--runway-h)) * 2.5), var(--scene-max, 58%));
          display: flex; align-items: center; gap: 10px; padding: 8px 8px 8px 14px; min-width: 0; color: var(--sky-text); }
  .badge { width: 40px; height: 40px; flex: none; border-radius: 50%; display: grid; place-items: center; color: var(--fb-accent);
           background: rgba(255,255,255,.62); box-shadow: inset 0 0 0 1px rgba(47,128,237,.18); }
  .night .badge { background: rgba(255,255,255,.12); color: #8fbaff; box-shadow: inset 0 0 0 1px rgba(255,255,255,.14); }
  .badge .icon { width: 24px; height: 24px; }
  /* Brand badge on the header icon (FlightRadar24 radar mark): on a white rounded tile, readable in both themes. */
  .badge { position: relative; }
  .badge .brand { position: absolute; right: -4px; bottom: -4px; width: 18px; height: 18px; border-radius: 5px; padding: 2px; box-sizing: border-box;
                  display: grid; place-items: center; background: #fff;
                  box-shadow: 0 0 0 1px var(--divider-color, rgba(0,0,0,.12)), 0 0 0 3px var(--card-background-color, #fff); }
  .banner .badge .brand { box-shadow: 0 0 0 1px rgba(13,42,69,.16), 0 1px 3px rgba(13,42,69,.18); }
  .badge .brand .mark { width: 100%; height: 100%; }
  .titles { flex: 1 1 0; min-width: 0; overflow: hidden; }
  .name { font-size: 16px; font-weight: 500; line-height: 1.25; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .name .code { font-weight: 400; opacity: .7; }
  /* The statistics on two lines at most: a part that does not fit goes to a third line, clipped away; the "·" that
     starts a line sits in the negative margin, clipped too. */
  .stats { display: flex; flex-wrap: wrap; max-height: 32px; overflow: hidden; margin-left: -10px; font-size: 12px; line-height: 16px; color: var(--sky-muted); }
  .stats span { white-space: nowrap; }
  .stats span::before { content: "·"; display: inline-block; width: 10px; text-align: center; }
  /* Scenery colours, day and night. */
  .scene .hill.far { fill: #a7d39f; } .scene .hill.near { fill: #86c27f; }
  .night .scene .hill.far { fill: #1d3a4a; } .night .scene .hill.near { fill: #17303d; }
  .scene .terminal .body { fill: #eef2f6; } .scene .terminal .roof { fill: #b3bfcb; } .scene .terminal .trim { fill: #c9d2db; }
  .night .scene .terminal .body { fill: #2a3646; } .night .scene .terminal .roof { fill: #3a4759; } .night .scene .terminal .trim { fill: #344154; }
  .scene .tower .body { fill: #e3e8ed; } .scene .tower .cab { fill: #5d6b7a; } .scene .tower .cap { fill: #4a5563; }
  .night .scene .tower .body { fill: #303c4b; } .night .scene .tower .cab { fill: #232d3a; } .night .scene .tower .cap { fill: #1c2530; }
  .scene .clouds { fill: #ffffff; opacity: .92; } .night .scene .clouds { opacity: .1; }
  .scene .stars { fill: #ffffff; opacity: .85; }
  /* ── Animations (each one a divisor of the plane's 8 s) ── */
  .scene .beacon, .scene .beacon-glow { animation: fb-blink 1s steps(1, end) infinite; }
  .scene .beacon-glow { opacity: .3; }
  .scene .sock { animation: fb-sock 2s ease-in-out infinite; }
  .scene .cloud { animation: fb-drift 4s ease-in-out infinite alternate; }
  .scene .cloud.c2 { animation-delay: -2s; animation-direction: alternate-reverse; }
  .scene .stars .tw { animation: fb-twinkle 4s ease-in-out infinite; }
  .scene .stars .tw:nth-child(2n) { animation-delay: -2s; }
  .scene .plane.dep { transform: translate(128px, 52px) rotate(-13deg); animation: fb-takeoff 8s linear infinite; }
  .scene .plane.dep .gear { animation: fb-gear 8s linear infinite; }
  .scene .plane.arr { transform: translate(52px, 70px) rotate(5deg); animation: fb-landing 8s linear infinite; }
  @keyframes fb-blink { 0% { opacity: 1; } 50% { opacity: .15; } }
  @keyframes fb-pulse { 0%, 100% { opacity: .35; } 50% { opacity: .8; } }
  @keyframes fb-pulse-night { 0%, 100% { opacity: .65; } 50% { opacity: 1; } }
  @keyframes fb-twinkle { 0%, 100% { opacity: 1; } 50% { opacity: .25; } }
  @keyframes fb-sock { 0%, 100% { transform: rotate(-3deg) scaleX(.9); } 50% { transform: rotate(5deg) scaleX(1); } }
  @keyframes fb-drift { from { transform: translateX(-7px); } to { transform: translateX(7px); } }
  @keyframes fb-takeoff {
    0% { transform: translate(-26px, 80px) rotate(0deg); opacity: 0; animation-timing-function: ease-in; }
    6% { transform: translate(-14px, 80px) rotate(0deg); opacity: 1; animation-timing-function: ease-in; }
    44% { transform: translate(72px, 80px) rotate(0deg); }
    52% { transform: translate(98px, 78.5px) rotate(-11deg); }
    68% { transform: translate(146px, 58px) rotate(-14deg); }
    82% { transform: translate(214px, 30px) rotate(-14deg); opacity: 1; }
    83%, 100% { transform: translate(220px, 28px) rotate(-14deg); opacity: 0; }
  }
  @keyframes fb-gear { 0%, 58% { opacity: 1; } 62%, 100% { opacity: 0; } }
  @keyframes fb-landing {
    0% { transform: translate(-36px, 44px) rotate(6deg); opacity: 0; }
    6% { transform: translate(-22px, 48px) rotate(6deg); opacity: 1; }
    44% { transform: translate(80px, 79.6px) rotate(-2deg); animation-timing-function: ease-out; }
    50% { transform: translate(94px, 80px) rotate(0deg); animation-timing-function: ease-out; }
    80% { transform: translate(140px, 80px) rotate(0deg); opacity: 1; }
    90%, 100% { transform: translate(144px, 80px) rotate(0deg); opacity: 0; }
  }
  @media (prefers-reduced-motion: reduce) {
    .scene *, .runway .lights { animation: none !important; }
  }
  /* A narrow card keeps the sky and the runway for its texts: no scenery. */
  @container (max-width: 300px) {
    .banner .scene { display: none; }
    .head { right: 0; }
  }

  /* ── Classic header (illustration: false) ── */
  .header { display: flex; align-items: center; gap: 10px; padding: 12px 14px 8px; }
  .header .badge { color: var(--fb-accent); background: color-mix(in srgb, var(--fb-accent) 16%, transparent); box-shadow: none; }
  .header .stats { color: var(--secondary-text-color); }

  /* ── Tabs, right under the header ── */
  .tabs { display: flex; gap: 18px; padding: 0 16px; border-bottom: 1px solid var(--divider-color, rgba(127,127,127,.2)); }
  .tab { all: unset; cursor: pointer; padding: 9px 0 7px; font-size: 14px; font-weight: 500; color: var(--secondary-text-color);
         border-bottom: 2px solid transparent; margin-bottom: -1px; white-space: nowrap; }
  .tab:hover { color: var(--primary-text-color); }
  .tab[aria-selected="true"] { color: var(--primary-text-color); border-bottom-color: var(--fb-accent); }

  /* ── Flights ── */
  .list { padding: 4px 0 8px; }
  .row { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 10px; padding: 7px 16px; }
  .row + .row { border-top: 1px solid color-mix(in srgb, var(--divider-color, rgba(127,127,127,.2)) 70%, transparent); }
  .row:hover { background: color-mix(in srgb, var(--fb-accent) 6%, transparent); }
  .row .time { font-weight: 600; font-variant-numeric: tabular-nums; min-width: 2.9em; }
  .row .where { min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 14px; }
  .row .where .muted { font-size: 13px; }
  .row .chip { max-width: 46cqw; }
  .empty { padding: 14px 16px; font-size: 13px; color: var(--secondary-text-color); }

  /* ── Flight detail popup, at the top of the card ── */
  .backdrop { position: absolute; inset: 0; background: rgba(0,0,0,.4); display: flex; align-items: flex-start; justify-content: center;
              padding-top: 10px; box-sizing: border-box; z-index: 9; border-radius: inherit; }
  .modal { background: var(--card-background-color, #fff); color: var(--primary-text-color); width: min(94%, 380px); max-height: calc(100% - 20px);
           overflow: auto; box-sizing: border-box; border-radius: 14px; padding: 14px; box-shadow: 0 8px 30px rgba(0,0,0,.35);
           display: flex; flex-direction: column; gap: 10px; }
  .mhead { display: flex; align-items: flex-start; gap: 10px; }
  .mhead .badge { width: 36px; height: 36px; color: var(--fb-accent); background: color-mix(in srgb, var(--fb-accent) 16%, transparent); box-shadow: none; }
  .mhead .badge .icon { width: 20px; height: 20px; }
  .mhead h3 { margin: 0; font-size: 16px; font-weight: 500; line-height: 1.3; overflow-wrap: anywhere; }
  .mhead .sub { font-size: 12px; color: var(--secondary-text-color); overflow-wrap: anywhere; }
  .mhead > div:not(.badge) { flex: 1 1 auto; min-width: 0; }
  .close { all: unset; flex: none; cursor: pointer; width: 28px; height: 28px; border-radius: 50%; display: grid; place-items: center;
           color: var(--secondary-text-color); box-shadow: inset 0 0 0 1px var(--divider-color, rgba(127,127,127,.3)); }
  .close:hover { color: var(--primary-text-color); background: color-mix(in srgb, var(--secondary-text-color) 12%, transparent); }
  .close .icon { width: 16px; height: 16px; }
  .facts { display: grid; grid-template-columns: max-content minmax(0, 1fr); gap: 5px 12px; margin: 0; font-size: 13px; }
  .facts dt { color: var(--secondary-text-color); }
  .facts dd { margin: 0; overflow-wrap: anywhere; }
  .facts .t { font-variant-numeric: tabular-nums; }
`;

// The mini card: a lower banner, the next flight laid on the sky.
const MINI_STYLE = `
  .banner { --banner-h: 90px; --runway-h: 10px; --scene-max: 40%; }
  .head { padding-right: 6px; }
  .next { display: flex; flex-direction: column; gap: 1px; flex: 1 1 0; min-width: 0; }
  .next .l1 { display: flex; align-items: center; gap: 8px; min-width: 0; white-space: nowrap; }
  .next .clock { font-size: 22px; font-weight: 600; line-height: 26px; font-variant-numeric: tabular-nums; flex: none; }
  .next .chip { flex: 0 1 auto; }
  .next .city { font-size: 13px; line-height: 17px; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .next .what { font-size: 12px; line-height: 16px; color: var(--sky-muted); min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .header { --sky-muted: var(--secondary-text-color); }
  .next .none { font-size: 13px; color: var(--sky-muted); }
  /* Pills on the sky: a frosted glass under the tint. */
  .banner .chip { background: color-mix(in srgb, var(--c) 18%, rgba(255,255,255,.78)); color: color-mix(in srgb, var(--c) 45%, #0d2a45); }
  .banner.night .chip { background: color-mix(in srgb, var(--c) 30%, rgba(8,18,38,.55)); color: color-mix(in srgb, var(--c) 35%, #ffffff); }
  .zoom { all: unset; position: absolute; z-index: 2; top: 5px; right: 5px; cursor: pointer; width: 24px; height: 24px; border-radius: 50%;
          display: grid; place-items: center; color: #33506b; background: rgba(255,255,255,.55); box-shadow: inset 0 0 0 1px rgba(255,255,255,.7);
          backdrop-filter: blur(4px); }
  .night .zoom, .zoom.on-night { color: #ffffff; background: rgba(255,255,255,.12); box-shadow: inset 0 0 0 1px rgba(255,255,255,.2); }
  .zoom:hover { background: rgba(255,255,255,.75); }
  .night .zoom:hover, .zoom.on-night:hover { background: rgba(255,255,255,.22); }
  .zoom .icon { width: 16px; height: 16px; }
  @container (max-width: 280px) { .banner .scene { display: none; } .head { right: 0; padding-right: 40px; } }
`;
// The zoomed mini card: the full card, with the detail button over its banner.
const ZOOM_STYLE = `
  .zoom { all: unset; position: absolute; z-index: 2; top: 5px; right: 5px; cursor: pointer; width: 24px; height: 24px; border-radius: 50%;
          display: grid; place-items: center; color: #33506b; background: rgba(255,255,255,.55); box-shadow: inset 0 0 0 1px rgba(255,255,255,.7); }
  .zoom.on-night { color: #ffffff; background: rgba(255,255,255,.12); box-shadow: inset 0 0 0 1px rgba(255,255,255,.2); }
  .zoom.plain { color: var(--secondary-text-color); background: none; box-shadow: inset 0 0 0 1px var(--divider-color, rgba(127,127,127,.3)); top: 18px; right: 12px; }
  .zoom .icon { width: 16px; height: 16px; }
  .header { position: relative; padding-right: 48px; }
`;

// ---------------------------------------------------------------------------
// The full card
// ---------------------------------------------------------------------------

class FlightBoardCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._html = "";
    this._tab = null;
    this._run = 0;
    this._detail = null;
    this.shadowRoot.addEventListener("click", (ev) => this._click(ev));
    this.shadowRoot.addEventListener("keydown", (ev) => {
      if ((ev.key === "Enter" || ev.key === " ") && ev.target.getAttribute?.("role") === "button") {
        ev.preventDefault();
        ev.target.click();
      }
    });
    this._onKey = (ev) => {
      if (this._detail && ev.key === "Escape") {
        ev.stopPropagation();
        this._closeDetail(true);
      }
    };
    // A click elsewhere on the page closes the flight popup (and only that: a zoomed mini card stays zoomed).
    this._onOutside = (ev) => {
      if (this._detail && !inDialog(ev)) {
        this._detailClosedBy = ev;
        this._closeDetail(false);
      }
    };
  }

  static getConfigElement() {
    return document.createElement("flight-board-card-editor");
  }

  static getStubConfig() {
    return {};
  }

  getCardSize() {
    return 2 + Math.min(20, Math.max(1, num(this._config?.max_flights) ?? 6));
  }

  // 8 columns: 208 px on a phone.
  getGridOptions() {
    return { columns: 12, min_columns: 8 };
  }

  setConfig(config) {
    if (!config) throw new Error("Invalid configuration");
    this._config = { ...config };
    this._tab = null;
    this._html = "";
    this._update();
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._config) return;
    const sig = this._signature();
    if (this._sig && sig.length === this._sig.length && sig.every((v, i) => v === this._sig[i])) return;
    this._update(sig);
  }

  get hass() {
    return this._hass;
  }

  connectedCallback() {
    (this._outsideWatch ??= watchOutside(this, (ev) => this._onOutside(ev))).on();
    // The times ("in 23 min", boarding, past flights) follow the clock: checked every 30 s.
    clearInterval(this._timer);
    this._timer = setInterval(() => this._hass && this._config && (this.hass = this._hass), 30000);
    this._update();
  }

  disconnectedCallback() {
    this._outsideWatch?.off();
    clearInterval(this._timer);
    // Left (another view, a conditional card hidden): the popup closes without anything else.
    this._detail = null;
    window.removeEventListener("keydown", this._onKey);
  }

  _t(key, vars) {
    return t(this._hass, this._config, key, vars);
  }

  _loc() {
    return fmtLang(this._hass, this._config);
  }

  _s(id) {
    return id ? this._hass?.states?.[id] : undefined;
  }

  _now() {
    return Date.now() / 1000;
  }

  // The tabs shown: departures and arrivals unless one is turned off (both off: departures).
  _tabs() {
    const c = this._config;
    const tabs = [];
    if (c.show_departures !== false) tabs.push("dep");
    if (c.show_arrivals !== false) tabs.push("arr");
    return tabs.length ? tabs : ["dep"];
  }

  _activeTab() {
    const tabs = this._tabs();
    if (this._tab && tabs.includes(this._tab)) return this._tab;
    const def = this._config.default_tab === "arrivals" ? "arr" : "dep";
    return tabs.includes(def) ? def : tabs[0];
  }

  // What the render depends on: language, dark mode, the sun, the airport entities and the minute.
  _signature() {
    const h = this._hass;
    const e = discover(h, this._config);
    return [
      h.language,
      h.locale,
      h.themes?.darkMode,
      h.states["sun.sun"]?.state,
      ...Object.values(e).map((id) => h.states[id]),
      Math.floor(Date.now() / 60000),
    ];
  }

  _update(sig) {
    if (!this._hass || !this._config) return;
    this._sig = sig ?? this._signature();
    const html = this._render();
    if (html !== this._html) {
      this._html = html;
      morph(this.shadowRoot, html);
    }
  }

  // Night illustration: forced by illustration_theme, else the sun below the horizon, else the dark theme.
  _night() {
    const mode = this._config.illustration_theme;
    if (mode === "night") return true;
    if (mode === "day") return false;
    const sun = this._s("sun.sun")?.state;
    if (sun === "below_horizon") return true;
    if (sun === "above_horizon") return false;
    return !!this._hass?.themes?.darkMode;
  }

  // Formats a Unix time (seconds) in the time zone and the 12/24 h setting of Home Assistant; the weekday when
  // it is not today.
  _time(sec, withDay = false) {
    if (sec === null || sec === undefined) return "—";
    const h = this._hass;
    const opts = { hour: "2-digit", minute: "2-digit" };
    const tf = h?.locale?.time_format;
    if (tf === "12") opts.hour12 = true;
    else if (tf === "24") opts.hourCycle = "h23";
    const tz = h?.locale?.time_zone === "local" ? undefined : h?.config?.time_zone;
    if (tz) opts.timeZone = tz;
    const d = new Date(sec * 1000);
    try {
      if (withDay) {
        const day = (x) => new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(x);
        if (day(d) !== day(new Date(this._now() * 1000))) opts.weekday = "short";
      }
      return new Intl.DateTimeFormat(this._loc(), opts).format(d);
    } catch (_e) {
      return d.toISOString().slice(11, 16);
    }
  }

  _board(kind) {
    const e = discover(this._hass, this._config);
    const id = kind === "dep" ? e.departures : e.arrivals;
    const s = this._s(id);
    const prefix = kind === "dep" ? "departures" : "arrivals";
    const v = (k) => this._s(e[`${prefix}_${k}`])?.state;
    const tracked = !!s && !["unavailable", "unknown"].includes(s.state) && Array.isArray(s.attributes?.flights);
    const flights = tracked ? boardFlights(s.attributes.flights, kind, this._now(), this._config) : [];
    const stats = boardStats(flights, { on_time: v("on_time"), delayed: v("delayed"), delay_average: v("delay_average") });
    return { id, entity: s, tracked, flights, stats };
  }

  // The airport: the title, else the tracked code, else "Airport".
  _airport() {
    const e = discover(this._hass, this._config);
    const code = this._s(e.track)?.state;
    const known = code && !["unavailable", "unknown", ""].includes(code) ? String(code).toUpperCase() : "";
    const title = this._config.title || "";
    return { title: title || known || this._t("airport"), code: title && known && title.toUpperCase() !== known ? known : "" };
  }

  _statsText(board) {
    if (this._config.show_stats === false || !board.tracked) return [];
    const { count, pct, avg } = board.stats;
    const parts = [plural(this._hass, this._config, "flights", count)];
    if (pct !== null) {
      const p = new Intl.NumberFormat(this._loc(), { style: "percent", maximumFractionDigits: 0 }).format(pct);
      parts.push(this._t("on_time_pct", { pct: p }));
    }
    if (avg !== null) parts.push(this._t("avg_delay", { delay: this._t("minutes", { n: `${avg > 0 ? "+" : ""}${avg}` }) }));
    return parts;
  }

  // The pill of a flight: the delay ("+25 min"), else its status (with the estimated time unless `short`).
  _pill(info, short = false) {
    const text =
      info.key === "delayed" && info.delay > 0
        ? this._t("minutes", { n: `+${info.delay}` })
        : info.key === "estimated" && info.estimated !== null && !short
          ? `${this._t("status_estimated")} ${this._time(info.estimated)}`
          : this._t(`status_${info.key}`);
    const title = info.key === "delayed" ? `${this._t("status_delayed")} · ${text}` : text;
    return `<span class="chip ${info.cls}" title="${esc(title)}"><span class="dot"></span><span class="txt">${esc(text)}</span></span>`;
  }

  _banner(kind, inner, extraClass = "") {
    const night = this._night();
    return `<div class="banner${night ? " night" : ""}${extraClass}">
      ${sceneSvg(kind, night, this._run)}
      <div class="runway"><div class="marks"></div><div class="lights top"></div><div class="lights bottom"></div></div>
      ${inner}
    </div>`;
  }

  _titleBlock(kind, board) {
    const a = this._airport();
    const stats = this._statsText(board);
    return `<div class="badge">${svgIcon(kind === "dep" ? ICONS.departures : ICONS.arrivals)}${brandBadge()}</div>
      <div class="titles">
        <div class="name">${esc(a.title)}${a.code ? ` <span class="code">${esc(a.code)}</span>` : ""}</div>
        ${stats.length ? `<div class="stats">${stats.map((s) => `<span>${esc(s)}</span>`).join("")}</div>` : ""}
      </div>`;
  }

  _header(kind, board) {
    if (this._config.illustration === false)
      return `<div class="header">${this._titleBlock(kind, board)}${this._zoomButton("plain")}</div>`;
    return this._banner(kind, `<div class="head">${this._titleBlock(kind, board)}</div>${this._zoomButton(this._night() ? "on-night" : "")}`);
  }

  _tabsHtml(kind) {
    const tabs = this._tabs();
    if (tabs.length < 2) return "";
    return `<div class="tabs" role="tablist">${tabs
      .map(
        (k) =>
          `<button class="tab" role="tab" data-tab="${k}" aria-selected="${k === kind}">${esc(this._t(k === "dep" ? "departures" : "arrivals"))}</button>`,
      )
      .join("")}</div>`;
  }

  _row(info, kind) {
    const f = info.f;
    const parts = [flightLabel(f)];
    if (this._config.show_airline === true && (f.airline_short || f.airline)) parts.push(f.airline_short || f.airline);
    if (this._config.show_aircraft === true && (f.aircraft_code || f.aircraft_model)) parts.push(f.aircraft_code || f.aircraft_model);
    const extra = parts.filter(Boolean).join(" · ");
    const key = String(f.flight_id || `${flightLabel(f)}-${info.scheduled}`);
    const label = `${this._time(info.scheduled ?? info.expected)} ${cityOf(f)} ${extra}`;
    return `<div class="row" role="button" tabindex="0" data-key="${esc(key)}" data-flight="${esc(key)}" data-kind="${kind}" aria-label="${esc(label)}">
      <span class="time">${esc(this._time(info.scheduled ?? info.expected))}</span>
      <span class="where">${esc(cityOf(f) || "—")}${extra ? ` <span class="muted">· ${esc(extra)}</span>` : ""}</span>
      ${this._pill(info)}
    </div>`;
  }

  _list(kind, board) {
    if (!board.entity) return `<div class="empty">${esc(this._t("no_entities"))}</div>`;
    if (!board.tracked) return `<div class="empty">${esc(this._t("not_tracked"))}</div>`;
    const max = Math.max(1, Math.min(50, Math.round(num(this._config.max_flights) ?? 6)));
    const shown = board.flights.slice(0, max);
    if (!shown.length) return `<div class="empty">${esc(this._t("no_flights"))}</div>`;
    return `<div class="list">${shown.map((i) => this._row(i, kind)).join("")}</div>`;
  }

  _noEntities() {
    return `<style>${STYLE}</style><ha-card><div class="warning">${esc(this._t("no_entities"))}</div></ha-card>`;
  }

  _render() {
    const e = discover(this._hass, this._config);
    if (!e.departures && !e.arrivals) return this._noEntities();
    const kind = this._activeTab();
    const board = this._board(kind);
    return `<style>${STYLE}${this._extraStyle()}</style>
      <ha-card>
        ${this._header(kind, board)}
        ${this._tabsHtml(kind)}
        ${this._list(kind, board)}
        ${this._detailHtml()}
      </ha-card>`;
  }

  _extraStyle() {
    return "";
  }

  // The full card has no detail button.
  _zoomButton() {
    return "";
  }

  _findFlight(kind, key) {
    const s = this._s(discover(this._hass, this._config)[kind === "dep" ? "departures" : "arrivals"]);
    const f = (s?.attributes?.flights || []).find((x) => x && String(x.flight_id || `${flightLabel(x)}-${flightInfo(x, kind, 0).scheduled}`) === key);
    return f ? flightInfo(f, kind, this._now()) : null;
  }

  _detailHtml() {
    const d = this._detail;
    if (!d) return "";
    const info = this._findFlight(d.kind, d.key);
    if (!info) return "";
    const f = info.f;
    const dep = d.kind === "dep";
    const city = cityOf(f);
    const codes = [f.airport_code_iata, f.airport_code_icao].filter(Boolean).join(" / ");
    const airline = [f.airline, [f.airline_iata, f.airline_icao].filter(Boolean).join(" / ")].filter(Boolean);
    const aircraft = [f.aircraft_model || f.aircraft_code, f.aircraft_model && f.aircraft_code ? `(${f.aircraft_code})` : ""].filter(Boolean).join(" ");
    const place = [f.airport_name, f.airport_city && f.airport_city !== f.airport_name ? f.airport_city : "", f.airport_country_name].filter(Boolean).join(", ");
    const facts = [
      [this._t("airline"), airline.length > 1 ? `${airline[0]} (${airline[1]})` : airline[0]],
      [this._t("aircraft"), aircraft],
      [this._t("registration"), f.aircraft_registration],
      [this._t("callsign"), f.callsign],
      [this._t("scheduled"), info.scheduled !== null ? this._time(info.scheduled, true) : null, true],
      [this._t("estimated"), info.estimated !== null ? this._time(info.estimated, true) : null, true],
      [this._t("actual"), info.actual !== null ? this._time(info.actual, true) : null, true],
      [this._t(dep ? "destination" : "origin"), [place, codes ? `(${codes})` : ""].filter(Boolean).join(" ")],
    ].filter(([, v]) => v);
    const title = this._t(dep ? "to_city" : "from_city", { city: city || codes || "—" });
    const sub = [flightLabel(f), f.airline_short || f.airline].filter(Boolean).join(" · ") || this._t("flight");
    return `<div class="backdrop" data-action="backdrop">
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="fb-dlg-title">
        <div class="mhead">
          <div class="badge">${svgIcon(dep ? ICONS.departures : ICONS.arrivals)}</div>
          <div><h3 id="fb-dlg-title">${esc(title)}</h3><div class="sub">${esc(sub)}</div></div>
          <button class="close" data-action="close" title="${esc(this._t("close"))}" aria-label="${esc(this._t("close"))}">${svgIcon(ICONS.close)}</button>
        </div>
        <div>${this._pill(info)}</div>
        <dl class="facts">${facts.map(([k, v, time]) => `<dt>${esc(k)}</dt><dd${time ? ' class="t"' : ""}>${esc(v)}</dd>`).join("")}</dl>
      </div>
    </div>`;
  }

  // Opens the flight popup; from the keyboard (no click count), the focus goes to its close button.
  _openDetail(kind, key, keyboard = false) {
    this._detail = { kind, key };
    window.addEventListener("keydown", this._onKey);
    this._update(this._sig);
    if (keyboard) this.shadowRoot.querySelector?.(".modal .close")?.focus({ preventScroll: true });
  }

  _closeDetail(refocus) {
    if (!this._detail) return;
    const { key } = this._detail;
    this._detail = null;
    window.removeEventListener("keydown", this._onKey);
    this._update(this._sig);
    if (refocus) this.shadowRoot.querySelector?.(`.row[data-flight="${CSS.escape(key)}"]`)?.focus({ preventScroll: true });
  }

  _click(ev) {
    const path = ev.composedPath();
    const action = path.find((n) => n.dataset?.action);
    if (this._detail) {
      // While the popup is open, its close button and the backdrop close it; a click in it does nothing else.
      if (action?.dataset.action === "close" || (action?.dataset.action === "backdrop" && path[0] === action)) this._closeDetail(true);
      return;
    }
    const tab = path.find((n) => n.dataset?.tab);
    if (tab) {
      if (tab.dataset.tab !== this._activeTab()) {
        this._tab = tab.dataset.tab;
        // A new plane: its animation starts again with the tab.
        this._run++;
        this._update(this._sig);
      }
      return;
    }
    const row = path.find((n) => n.dataset?.flight);
    if (row) this._openDetail(row.dataset.kind, row.dataset.flight, ev.detail === 0);
  }
}

// ---------------------------------------------------------------------------
// The mini card: the next flight on the banner; its detail button unfolds the full card
// ---------------------------------------------------------------------------

class FlightBoardMiniCard extends FlightBoardCard {
  constructor() {
    super();
    this._zoomed = false;
    this._onFold = (ev) => {
      // The click that closed the flight popup only closes the popup.
      if (this._detailClosedBy === ev) return;
      if (this._zoomed && !inDialog(ev)) this._setZoom(false);
    };
  }

  static getConfigElement() {
    return document.createElement("flight-board-mini-card-editor");
  }

  connectedCallback() {
    super.connectedCallback();
    (this._foldWatch ??= watchOutside(this, (ev) => this._onFold(ev))).on();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._foldWatch?.off();
    this._zoomed = false;
  }

  getCardSize() {
    return this._zoomed ? super.getCardSize() : 2;
  }

  getGridOptions() {
    return this._zoomed ? super.getGridOptions() : { columns: 6, min_columns: 6 };
  }

  _setZoom(zoomed) {
    this._zoomed = zoomed;
    if (!zoomed) {
      this._detail = null;
      window.removeEventListener("keydown", this._onKey);
    }
    this._run++;
    this._update(this._sig);
  }

  _click(ev) {
    if (!this._detail && ev.composedPath().some((n) => n.classList?.contains("zoom"))) {
      ev.stopPropagation();
      this._setZoom(!this._zoomed);
      if (ev.detail === 0) this.shadowRoot.querySelector(".zoom")?.focus({ preventScroll: true });
      return;
    }
    super._click(ev);
  }

  _extraStyle() {
    return this._zoomed ? ZOOM_STYLE : "";
  }

  _zoomButton(cls = "") {
    if (this._config.zoom === false) return "";
    const z = this._zoomed;
    const label = esc(this._t(z ? "zoom_out" : "zoom_in"));
    return `<button class="zoom ${cls}" title="${label}" aria-label="${label}" aria-expanded="${z}">${svgIcon(z ? ICONS.collapse : ICONS.expand)}</button>`;
  }

  // "in 23 min", "in 1 h 05", "now", "12 min ago".
  _until(sec) {
    if (sec === null) return "";
    const m = Math.round((sec - this._now()) / 60);
    if (m < 0) return this._t("minutes_ago", { n: -m });
    if (m === 0) return this._t("now");
    if (m < 60) return this._t("in_minutes", { n: m });
    return this._t("in_hours", { h: Math.floor(m / 60), m: String(m % 60).padStart(2, "0") });
  }

  _next(kind, board) {
    if (!board.entity) return `<div class="next"><div class="none">${esc(this._t("no_entities"))}</div></div>`;
    if (!board.tracked) return `<div class="next"><div class="none">${esc(this._t("not_tracked"))}</div></div>`;
    const now = this._now();
    // The next flight still to come (the first of the board when every one has gone).
    const info = board.flights.find((i) => !isPast(i, now) && (i.expected ?? 0) >= now - 300) || board.flights.find((i) => !isPast(i, now));
    if (!info) return `<div class="next"><div class="none">${esc(this._t("no_flights"))}</div></div>`;
    const f = info.f;
    const city = cityOf(f) || "—";
    const what = [flightLabel(f), this._until(info.expected)].filter(Boolean).join(" · ");
    return `<div class="next" data-key="next-${esc(String(f.flight_id || flightLabel(f)))}">
      <div class="l1"><span class="clock">${esc(this._time(info.scheduled ?? info.expected))}</span>${this._pill(info, true)}</div>
      <div class="city">${esc(this._t(kind === "dep" ? "to_city" : "from_city", { city }))}</div>
      <div class="what">${esc(what)}</div>
    </div>`;
  }

  _render() {
    if (this._zoomed) return super._render();
    const e = discover(this._hass, this._config);
    if (!e.departures && !e.arrivals) return this._noEntities();
    const kind = this._activeTab();
    const board = this._board(kind);
    const badge = `<div class="badge">${svgIcon(kind === "dep" ? ICONS.departures : ICONS.arrivals)}${brandBadge()}</div>`;
    const inner = `<div class="head">${badge}${this._next(kind, board)}</div>`;
    const header =
      this._config.illustration === false
        ? `<div class="header plainmini">${badge}${this._next(kind, board)}${this._zoomButton("plain")}</div>`
        : this._banner(kind, `${inner}${this._zoomButton(this._night() ? "on-night" : "")}`);
    return `<style>${STYLE}${MINI_STYLE}${this._config.illustration === false ? ZOOM_STYLE : ""}</style>
      <ha-card>${header}</ha-card>`;
  }
}

// ---------------------------------------------------------------------------
// Visual editors (ha-form)
// ---------------------------------------------------------------------------

// Options on by default (left out of the YAML while on), and off by default (left out while off).
const ON_BY_DEFAULT = ["show_departures", "show_arrivals", "show_stats", "illustration", "zoom"];
const OFF_BY_DEFAULT = ["show_past", "show_airline", "show_aircraft"];
const LANGUAGES = [
  ["en", "English"], ["fr", "Français"], ["de", "Deutsch"], ["es", "Español"], ["sr", "Српски"], ["sr-Latn", "Srpski (latinica)"],
  ["it", "Italiano"], ["nl", "Nederlands"], ["pt", "Português (Portugal)"], ["pl", "Polski"], ["ro", "Română"], ["da", "Dansk"],
  ["sv", "Svenska"], ["bg", "Български"], ["ru", "Русский"], ["uk", "Українська"], ["hu", "Magyar"], ["sk", "Slovenčina"],
  ["cs", "Čeština"], ["sl", "Slovenščina"], ["lv", "Latviešu"], ["el", "Ελληνικά"],
];

class FlightBoardCardEditor extends HTMLElement {
  static get mini() {
    return false;
  }

  setConfig(config) {
    this._config = { ...config };
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  _schema() {
    const tr = (k) => t(this._hass, this._config, k);
    const toggles = ["show_departures", "show_arrivals", "show_stats", "show_past", "show_airline", "show_aircraft", "illustration"];
    if (this.constructor.mini) toggles.push("zoom");
    return [
      { name: "departures_entity", selector: { entity: { domain: "sensor", integration: PLATFORM } } },
      { name: "arrivals_entity", selector: { entity: { domain: "sensor", integration: PLATFORM } } },
      { name: "airport_entity", selector: { entity: { domain: "text", integration: PLATFORM } } },
      { name: "title", selector: { text: {} } },
      {
        type: "grid",
        name: "",
        schema: [
          {
            name: "default_tab",
            selector: { select: { mode: "dropdown", options: [{ value: "departures", label: tr("departures") }, { value: "arrivals", label: tr("arrivals") }] } },
          },
          {
            name: "illustration_theme",
            selector: {
              select: {
                mode: "dropdown",
                options: ["auto", "day", "night"].map((v) => ({ value: v, label: tr(`theme_${v}`) })),
              },
            },
          },
          { name: "max_flights", selector: { number: { min: 1, max: 50, step: 1, mode: "box" } } },
          { name: "hours_ahead", selector: { number: { min: 1, max: 48, step: 1, mode: "box", unit_of_measurement: "h" } } },
        ],
      },
      { type: "grid", name: "", schema: toggles.map((name) => ({ name, selector: { boolean: {} } })) },
      {
        name: "language",
        selector: { select: { mode: "dropdown", options: [{ value: "", label: tr("lang_auto") }, ...LANGUAGES.map(([value, label]) => ({ value, label }))] } },
      },
    ];
  }

  _render() {
    if (!this._hass || !this._config) return;
    if (!this._form) {
      this._form = document.createElement("ha-form");
      this._form.computeLabel = (s) => t(this._hass, this._config, s.name);
      this._form.addEventListener("value-changed", (ev) => {
        ev.stopPropagation();
        const config = { ...ev.detail.value };
        for (const [k, v] of Object.entries(config)) {
          // A minimal YAML: no empty values, no options left at their default.
          if (
            v === "" ||
            v === undefined ||
            v === null ||
            (ON_BY_DEFAULT.includes(k) && v === true) ||
            (OFF_BY_DEFAULT.includes(k) && v === false) ||
            (k === "default_tab" && v === "departures") ||
            (k === "illustration_theme" && v === "auto") ||
            (k === "max_flights" && v === 6)
          )
            delete config[k];
        }
        this._config = config;
        this.dispatchEvent(new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }));
      });
      this.appendChild(this._form);
    }
    const data = { default_tab: "departures", illustration_theme: "auto", max_flights: 6, ...this._config };
    for (const k of ON_BY_DEFAULT) if (data[k] === undefined) data[k] = true;
    for (const k of OFF_BY_DEFAULT) if (data[k] === undefined) data[k] = false;
    this._form.hass = this._hass;
    this._form.data = data;
    this._form.schema = this._schema();
  }
}

class FlightBoardMiniCardEditor extends FlightBoardCardEditor {
  static get mini() {
    return true;
  }
}

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------

const define = (name, cls) => {
  if (!customElements.get(name)) customElements.define(name, cls);
};
define("flight-board-card", FlightBoardCard);
define("flight-board-mini-card", FlightBoardMiniCard);
define("flight-board-card-editor", FlightBoardCardEditor);
define("flight-board-mini-card-editor", FlightBoardMiniCardEditor);

window.customCards = window.customCards || [];
for (const card of [
  {
    type: "flight-board-card",
    name: "Flight Board Card",
    description: "Airport departures and arrivals board for the FlightRadar24 integration, under an animated airport illustration.",
  },
  {
    type: "flight-board-mini-card",
    name: "Flight Board Mini Card",
    description: "The next departure or arrival of an airport (FlightRadar24), with a detail button to the full board.",
  },
]) {
  if (!window.customCards.some((c) => c.type === card.type))
    window.customCards.push({ ...card, preview: true, documentationURL: "https://github.com/juju35/ha-flight-board-card" });
}

console.info(
  `%c FLIGHT-BOARD-CARD %c v${VERSION} `,
  "color: white; background: #2f80ed; font-weight: 700;",
  "color: #2f80ed; background: white; font-weight: 700;",
);
