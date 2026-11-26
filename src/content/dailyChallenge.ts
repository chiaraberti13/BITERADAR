import { bi, type Localized } from '../types';
export type GameAnswer = 'legitimate' | 'phishing' | 'verify-elsewhere';
export type Level = 1 | 2 | 3;
export interface Scenario {
  id: string;
  level: Level;
  title: Localized;
  observed: Localized;
  whyItMatters: Localized;
  whatYouCannotConclude: Localized;
  safeAction: Localized;
  answer: GameAnswer;
}
const rows: [string, string, string, string, GameAnswer, string, string][] = [
  [
    'Prestito rinnovato',
    'Renewed loan',
    'Hai rinnovato un libro. La ricevuta riporta lo stesso prestito già visibile nel tuo account Biblioteca Riva.',
    'You renewed a book. The receipt matches the loan in your independently opened Riva Library account.',
    'legitimate',
    'La conferma indipendente collega messaggio e operazione.',
    'Independent confirmation links the message to the transaction.'
  ],
  [
    'Buono del circolo',
    'Club voucher',
    'Un buono del Circolo Gesso richiede la password della tua casella. La segreteria conferma che il buono è inventato.',
    'A Chalk Club voucher asks for your mailbox password. The club office confirms the offer is fabricated.',
    'phishing',
    'Una fonte indipendente smentisce la richiesta di credenziali.',
    'An independent source disowns the credential request.'
  ],
  [
    'Cambio IBAN',
    'New bank details',
    'Studio Ninfea annuncia un nuovo IBAN. L’email è firmata, ma non hai ancora chiamato il tuo referente.',
    'Waterlily Studio announces new bank details. The message is signed but you have not called your contact.',
    'verify-elsewhere',
    'Una firma non autorizza il cambio di coordinate.',
    'A signature does not authorize a change in bank details.'
  ],
  [
    'Promemoria urgente',
    'Urgent reminder',
    'Una scadenza urgente coincide con la prenotazione che hai verificato direttamente nell’agenda del Centro Selce.',
    'An urgent deadline matches the reservation you independently checked in Flint Centre’s calendar.',
    'legitimate',
    'La scadenza è coerente con un impegno verificato.',
    'The deadline matches a verified commitment.'
  ],
  [
    'Supporto in chat',
    'Chat support',
    'Un finto tecnico chiede il codice monouso. Il tuo help desk verifica l’identificativo e conferma l’impersonificazione.',
    'A purported technician asks for a one-time code. Your help desk checks the case ID and confirms impersonation.',
    'phishing',
    'Il caso risulta inventato e il codice è personale.',
    'The case is fabricated and the code is personal.'
  ],
  [
    'Fattura inattesa',
    'Unexpected invoice',
    'Officina Luna invia un PDF. È un fornitore abituale, ma non riconosci il numero d’ordine.',
    'Moon Workshop sends a PDF. It is a regular supplier but the purchase order is unfamiliar.',
    'verify-elsewhere',
    'Il rapporto commerciale non convalida questo ordine.',
    'A supplier relationship does not validate this order.'
  ],
  [
    'Recapito newsletter',
    'Newsletter sender',
    'La newsletter che hai richiesto usa un dominio di rimbalzo diverso. Il bollettino è identico a quello nel portale ufficiale.',
    'Your subscribed newsletter uses a different bounce domain. Its bulletin matches the one in the official portal.',
    'legitimate',
    'Il dominio di rimbalzo è compatibile con un distributore.',
    'A separate bounce domain is consistent with a mailing vendor.'
  ],
  [
    'Archivio condiviso',
    'Shared archive',
    'Una notifica di Archivio Corallo richiede il login su un altro dominio. Il proprietario conferma di non avere condiviso nulla.',
    'A Coral Archive notice asks you to sign in on another domain. The owner confirms nothing was shared.',
    'phishing',
    'La smentita e la destinazione diversa si rafforzano.',
    'The denial and the different destination reinforce each other.'
  ],
  [
    'Nuova responsabile',
    'New manager',
    'Una persona si presenta come direttrice da una casella gratuita. Ti chiede l’elenco dei fornitori.',
    'Someone using a free mailbox introduces herself as the new director and asks for the supplier list.',
    'verify-elsewhere',
    'Il ruolo dichiarato non è stato confermato.',
    'The claimed role is unconfirmed.'
  ],
  [
    'Ticket chiuso',
    'Closed ticket',
    'Il Reply-To è esterno. Aprendo il portale già noto ritrovi il tuo ticket, il testo e la risposta.',
    'Reply-To is external. Your bookmarked portal shows the same ticket, text and reply.',
    'legitimate',
    'Il portale conferma l’evento e il contenuto.',
    'The portal confirms the event and content.'
  ],
  [
    'Pratica di rimborso',
    'Refund case',
    'Un avviso di rimborso chiede il PIN. Il registro dell’emittente e l’operatore confermano una falsa pratica.',
    'A refund notice asks for your PIN. The issuer’s register and operator confirm a fabricated case.',
    'phishing',
    'Il controllo esterno conferma l’inganno.',
    'The independent check confirms deception.'
  ],
  [
    'Invito di calendario',
    'Calendar invite',
    'Un invito arriva da un organizzatore sconosciuto. Esiste una riunione simile ma l’orario è diverso.',
    'An unknown organizer sends an invitation. A similar meeting exists but the time differs.',
    'verify-elsewhere',
    'Il contesto è plausibile ma manca la conferma.',
    'The context is plausible but unconfirmed.'
  ],
  [
    'Avviso inoltrato',
    'Forwarded notice',
    'La lista altera la firma originale. Nel registro ufficiale trovi lo stesso avviso firmato dal coordinatore.',
    'A list changes the original signature. The official register contains the same notice signed by the coordinator.',
    'legitimate',
    'Gli inoltri possono cambiare il contenuto firmato.',
    'Forwarding can change the signed content.'
  ],
  [
    'Messaggio del fornitore',
    'Supplier message',
    'DMARC passa sul dominio del fornitore. Il suo reparto sicurezza conferma che questa richiesta di bonifico è partita da un account rubato.',
    'DMARC passes for the supplier. Its security team confirms this transfer request came from a stolen account.',
    'phishing',
    'Un account compromesso può inviare posta autenticata.',
    'A compromised account can send authenticated mail.'
  ],
  [
    'Foto del corso',
    'Course photos',
    'Un collega invia un archivio senza spiegazioni dopo un corso. Il nome file coincide con il titolo del corso.',
    'A colleague sends an unexplained archive after a course. Its filename matches the course title.',
    'verify-elsewhere',
    'Il nome file è un dato modificabile.',
    'A filename can be chosen freely.'
  ],
  [
    'Modulo bilingue',
    'Bilingual form',
    'Una mail contiene errori di traduzione. La scuola contattata dal numero in rubrica conferma il modulo e la consegna.',
    'A message contains translation mistakes. The school, called at its saved number, confirms the form and delivery.',
    'legitimate',
    'Una traduzione imperfetta ha scarso valore da sola.',
    'Translation errors alone carry little weight.'
  ],
  [
    'Accesso al portale',
    'Portal access',
    'Il portale segnalato usa lettere somiglianti. Il titolare del servizio e il SOC confermano una copia non autorizzata.',
    'The advertised portal uses lookalike letters. The service owner and SOC confirm an unauthorized copy.',
    'phishing',
    'La somiglianza è accompagnata da una conferma indipendente.',
    'Visual similarity is backed by independent confirmation.'
  ],
  [
    'Inoltro in lista',
    'Mailing-list forward',
    'Un messaggio della lista ha DMARC fallito e header ARC. Non hai l’originale né una conferma del moderatore.',
    'A list message shows DMARC failure and ARC headers. You lack the original and moderator confirmation.',
    'verify-elsewhere',
    'La presenza di ARC non convalida la catena.',
    'The presence of ARC does not validate its chain.'
  ],
  [
    'Ricevuta senza firma',
    'Unsigned receipt',
    'Nessuna firma DKIM. Il tuo ordine esiste e l’esercente conferma l’invio di questa ricevuta al banco.',
    'No DKIM signature. Your order exists and the merchant confirms sending this receipt at the counter.',
    'legitimate',
    'Una firma assente non annulla la verifica indipendente.',
    'An absent signature does not invalidate independent verification.'
  ],
  [
    'Portale stipendi',
    'Payroll portal',
    'Il testo del link promette il portale paghe. Il SOC ha identificato la destinazione come una copia che raccoglie password.',
    'The link label promises the payroll portal. The SOC identified its destination as a copy collecting passwords.',
    'phishing',
    'L’identificazione indipendente sostiene l’esito.',
    'Independent identification supports the outcome.'
  ],
  [
    'Archivio protetto',
    'Protected archive',
    'Un archivio cifrato è atteso, ma il mittente ti manda una password diversa da quella concordata.',
    'An encrypted archive is expected, but the sender gives a different password from the agreed one.',
    'verify-elsewhere',
    'Lo scostamento dalla procedura richiede conferma.',
    'The departure from the agreement needs confirmation.'
  ],
  [
    'Link di tracciamento',
    'Tracking link',
    'Il link della newsletter passa da un dominio diverso. L’editore conferma la campagna e puoi leggere l’articolo dalla sua home.',
    'A newsletter link uses another domain. The publisher confirms the campaign and the article is on its homepage.',
    'legitimate',
    'Un link di tracciamento può essere legittimo.',
    'A tracking link can be legitimate.'
  ],
  [
    'Avviso di consegna',
    'Delivery notice',
    'Una richiesta di sblocco spedizione usa un codice che il corriere conferma come parte di una campagna fraudolenta.',
    'A delivery-release request uses a code the courier confirms belongs to a fraudulent campaign.',
    'phishing',
    'Il corriere ha verificato lo specifico identificativo.',
    'The courier checked the specific identifier.'
  ],
  [
    'Header incollati',
    'Pasted headers',
    'Ricevi solo una schermata con SPF pass e una richiesta di dati. Mancano il messaggio originale e il dominio verificato.',
    'You receive only a screenshot showing SPF pass and a data request. The original message and checked domain are missing.',
    'verify-elsewhere',
    'Una schermata non stabilisce il confine di fiducia.',
    'A screenshot does not establish the trust boundary.'
  ]
];
const limits = {
  legitimate: bi(
    'La conferma riguarda questa operazione. Non estenderla ai messaggi futuri.',
    'Confirmation covers this transaction. Do not extend it to future messages.'
  ),
  phishing: bi(
    'Gli stessi indizi isolati possono avere spiegazioni diverse in altri casi.',
    'The same isolated clues can have other explanations in other cases.'
  ),
  'verify-elsewhere': bi(
    'I dati disponibili non stabiliscono l’identità o l’intenzione del mittente.',
    'Available data do not establish the sender’s identity or intent.'
  )
};
const actions = {
  legitimate: bi(
    'Prosegui dal portale o dal canale già verificato.',
    'Continue through the verified portal or channel.'
  ),
  phishing: bi(
    'Interrompi la richiesta e segnala il messaggio tramite il canale aziendale.',
    'Stop the request and report the message through your organization’s channel.'
  ),
  'verify-elsewhere': bi(
    'Chiedi conferma usando un recapito già noto, prima di agire.',
    'Confirm through a known contact before acting.'
  )
};
export const SCENARIOS: Scenario[] = rows.map(([it, en, obsIt, obsEn, answer, whyIt, whyEn], i) => ({
  id: 'BR-' + String(i + 1).padStart(2, '0'),
  level: (1 + Math.floor(i / 8)) as Level,
  title: bi(it, en),
  observed: bi(obsIt, obsEn),
  whyItMatters: bi(whyIt, whyEn),
  answer,
  whatYouCannotConclude: limits[answer],
  safeAction: actions[answer]
}));
export function dailyScenario(date: Date, pool = SCENARIOS) {
  const day = Math.floor(date.getTime() / 86400000);
  return pool[((day % pool.length) + pool.length) % pool.length] ?? null;
}
