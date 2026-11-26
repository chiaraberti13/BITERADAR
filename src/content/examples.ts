const samples = [
  [
    'Conferma biblioteca',
    'Library receipt',
    'segreteria@biblioteca.example',
    'pass',
    'Ricevuta per il prestito di oggi.',
    'Receipt for today’s loan.'
  ],
  [
    'Mittente discordante',
    'Sender mismatch',
    'ufficio@officina.example',
    'fail',
    'Conferma della variazione.',
    'Confirmation of the change.'
  ],
  [
    'Richiesta amministrativa',
    'Finance request',
    'Direzione <ufficio.esempio@gmail.com>',
    'pass',
    'Possiamo modificare le coordinate di pagamento?',
    'Can we change the payment details?'
  ],
  [
    'Newsletter',
    'Newsletter',
    'eventi@spazio.example',
    'pass',
    'Il programma della settimana.',
    'This week’s programme.'
  ],
  [
    'Estratto incompleto',
    'Incomplete extract',
    '',
    '',
    'Puoi verificare questo messaggio?',
    'Can you check this message?'
  ]
] as const;
export const examples = samples.map(([it, en, from, auth, bodyIt, bodyEn], i) => {
  const domain = from.split('@').pop()?.replace('>', '');
  const message = (lang: 'it' | 'en') => {
    const body = lang === 'it' ? bodyIt : bodyEn;
    if (!from) return body;
    return [
      'Authentication-Results: mx.google.com; dmarc=' + auth + ' header.from=' + domain,
      'Received: from relay.example by mx.google.com; Wed, 4 Mar 2026 12:00:00 +0000',
      'From: ' + from,
      'To: learner@lab.example',
      'Subject: ' + (lang === 'it' ? it : en),
      ...(i === 3 ? ['Return-Path: <bounce@mailer.example>', 'List-Id: <news.spazio.example>'] : []),
      '',
      body
    ].join('\r\n');
  };
  return { title: { it, en }, message };
});
