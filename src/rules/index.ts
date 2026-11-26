import { bi, type Rule, type Localized, type Severity } from '../types';

function rule(
  id: string,
  group: string,
  severity: Severity,
  evidence: Localized,
  interpretation: Localized,
  limits: Localized,
  legitimate: Localized
): Rule {
  return {
    id,
    version: 1,
    correlationGroup: group,
    severity,
    evidence,
    interpretation,
    limits,
    legitimateExplanations: { it: [legitimate.it], en: [legitimate.en] }
  };
}
export const rules = {
  dmarc: rule(
    'auth.dmarc.fail',
    'auth-from',
    'high',
    bi('DMARC fallito per il dominio From', 'DMARC failed for the From domain'),
    bi('Il ricevente riporta un problema di autenticazione.', 'The receiver reports an authentication problem.'),
    bi('Nessuna firma viene ricalcolata.', 'Signatures are not recalculated.'),
    bi('Un inoltro può modificare il messaggio.', 'Forwarding can modify a message.')
  ),
  alignment: rule(
    'auth.alignment',
    'auth-from',
    'medium',
    bi('Identità autenticata su un altro dominio', 'A different domain authenticated'),
    bi(
      'Il dominio autenticato differisce da quello visibile.',
      'The authenticated domain differs from the visible sender.'
    ),
    bi('Confronto organizzativo con la Public Suffix List.', 'Organisational comparison uses the Public Suffix List.'),
    bi('Servizio di invio esterno.', 'External mailing service.')
  ),
  conflict: rule(
    'auth.conflict',
    'auth-conflict',
    'medium',
    bi('Risultati di autenticazione discordanti', 'Conflicting authentication results'),
    bi(
      'Due header riportano esiti diversi per la stessa identità.',
      'Two headers report different results for the same identity.'
    ),
    bi('Gli header esterni al confine possono essere inventati.', 'Headers outside the boundary can be fabricated.'),
    bi('Gateway intermedi.', 'Intermediate gateways.')
  ),
  bec: rule(
    'identity.role',
    'identity',
    'medium',
    bi('Ruolo aziendale su casella gratuita', 'Business role on a free mailbox'),
    bi('Chiunque può dichiarare quel ruolo nel nome visualizzato.', 'Anyone can claim this role in a display name.'),
    bi(
      'L’autenticazione del provider non identifica la persona.',
      'Provider authentication cannot identify the person.'
    ),
    bi('Piccola attività con casella personale.', 'Small business using a personal mailbox.')
  ),
  reply: rule(
    'identity.reply',
    'reply',
    'medium',
    bi('Risposta su un dominio diverso', 'Reply goes to a different domain'),
    bi('Una risposta potrebbe raggiungere un terzo.', 'A reply may reach a third party.'),
    bi('Il percorso di risposta da solo è ambiguo.', 'A reply path alone is ambiguous.'),
    bi('Sistema di ticketing.', 'Ticketing system.')
  ),
  bounce: rule(
    'identity.return',
    'return',
    'low',
    bi('Dominio di rimbalzo diverso', 'Different bounce domain'),
    bi('Gli errori di consegna tornano altrove.', 'Delivery failures go elsewhere.'),
    bi('Indizio debole.', 'Weak indication.'),
    bi('Newsletter distribuita da un fornitore.', 'Newsletter sent by a vendor.')
  ),
  link: rule(
    'link.mismatch',
    'links',
    'medium',
    bi('Il link mostra un dominio diverso dalla destinazione', 'Link label and destination differ'),
    bi('Il lettore si aspetta di aprire un altro sito.', 'The reader expects a different website.'),
    bi('La destinazione non viene visitata.', 'The destination is never visited.'),
    bi('Reindirizzamento per statistiche.', 'Click tracking redirect.')
  ),
  lookalike: rule(
    'link.confusable',
    'idn',
    'medium',
    bi('Caratteri simili a lettere latine', 'Characters resemble Latin letters'),
    bi('La grafia può confondere due domini.', 'The spelling can make domains look alike.'),
    bi('Lo scheletro Unicode indica somiglianza visiva.', 'The Unicode skeleton indicates visual similarity.'),
    bi('Nome legittimo in un’altra lingua.', 'Legitimate name in another language.')
  ),
  dkim: rule(
    'auth.dkim.missing',
    'dkim',
    'low',
    bi('Firma DKIM assente', 'DKIM signature absent'),
    bi('Nessuna firma DKIM visibile nel messaggio.', 'There is no visible DKIM signature.'),
    bi('Un estratto può omettere la firma.', 'An excerpt may omit the signature.'),
    bi('Server senza firma DKIM.', 'Unsigned legitimate mail.')
  ),
  urgency: rule(
    'body.urgency',
    'language',
    'low',
    bi('Richiesta urgente', 'Urgent language'),
    bi('La pressione può ridurre il tempo per verificare.', 'Pressure can reduce time to check.'),
    bi('Una parola da sola ha poco peso.', 'A single word has little weight.'),
    bi('Scadenza reale.', 'Real deadline.')
  ),
  file: rule(
    'attachment.flags',
    'file',
    'medium',
    bi('Allegato da esaminare', 'Attachment needs review'),
    bi(
      'Firma, nome o funzioni incorporate richiedono attenzione.',
      'Signature, name or embedded features need review.'
    ),
    bi(
      'Ispezione limitata dei metadati, nessuna scansione antivirus.',
      'Limited metadata inspection, no antivirus scan.'
    ),
    bi('Documento aziendale con macro.', 'Business document with a macro.')
  )
};
export const dmarcFailAligned = rules.dmarc;
export const RULES = Object.values(rules);
