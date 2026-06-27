// Dalivim app — domain data, status model, copy helpers.
// Language is deliberately non-technical: "pagamento protegido", "dinheiro
// reservado", "aguardando confirmação" — never escrow / hold / liquidação.

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ── Money ────────────────────────────────────────────────────────────
function brl(n, { cents = true } = {}) {
  return 'R$\u00A0' + Number(n).toLocaleString('pt-BR', {
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  });
}
const feeOf = (v) => Math.round(v * 0.018 * 100) / 100; // 1,8% — discreet platform fee

// ── Status model ─────────────────────────────────────────────────────
// One vocabulary, learned fast. Color carries meaning:
//   blue   = dinheiro protegido / em andamento
//   amber  = aguardando uma ação
//   green  = concluído
//   red    = disputa
const STATUS = {
  'aguardando-pagamento': {
    label: 'Aguardando pagamento',
    tone: 'amber',
    // where the money is, in one line
    money: 'O dinheiro ainda não foi enviado.',
  },
  'protegido': {
    label: 'Pagamento protegido',
    tone: 'blue',
    money: 'O dinheiro está reservado com a Dalivim.',
  },
  'aguardando-confirmacao': {
    label: 'Aguardando confirmação',
    tone: 'amber',
    money: 'O dinheiro está reservado, aguardando o aceite.',
  },
  'liberado': {
    label: 'Finalizada',
    tone: 'green',
    money: 'O dinheiro foi liberado para o prestador.',
  },
  'disputa': {
    label: 'Em disputa',
    tone: 'red',
    money: 'O dinheiro segue reservado até a disputa terminar.',
  },
  'reembolsado': {
    label: 'Reembolsado',
    tone: 'green',
    money: 'O dinheiro foi devolvido ao cliente.',
  },
};

// ── Dispute model ────────────────────────────────────────────────────
// Mediation is the moment trust is tested. Language stays calm and concrete:
// the money is safe, here's what happens, here's what to do.
const DISPUTE_REASONS = [
  { k: 'nao-recebi', icon: 'package',        label: 'Não recebi', sub: 'O prazo passou e nada chegou.' },
  { k: 'diferente',  icon: 'alert-triangle', label: 'Veio diferente do combinado', sub: 'Não é o que foi descrito no acordo.' },
  { k: 'defeito',    icon: 'x',              label: 'Chegou com defeito', sub: 'Veio danificado ou não funciona.' },
  { k: 'incompleto', icon: 'scale',          label: 'Entrega incompleta', sub: 'Faltam itens ou etapas do combinado.' },
  { k: 'outro',      icon: 'message',        label: 'Outro motivo', sub: 'Explico nos detalhes.' },
];
const DISPUTE_REASON_LABEL = Object.fromEntries(DISPUTE_REASONS.map(r => [r.k, r.label]));

const DISPUTE_OUTCOMES = [
  { k: 'reembolso', icon: 'refresh', label: 'Reembolso total', sub: 'Quero o dinheiro de volta.' },
  { k: 'parcial',   icon: 'scale',   label: 'Reembolso parcial', sub: 'Fico com o item por um valor menor.' },
  { k: 'reenvio',   icon: 'package', label: 'Reenvio ou correção', sub: 'Quero que resolvam e entreguem certo.' },
];
const DISPUTE_OUTCOME_LABEL = Object.fromEntries(DISPUTE_OUTCOMES.map(o => [o.k, o.label]));

// Four mediation stages, always the same order.
const DISPUTE_STAGES = [
  { key: 'aberta',    label: 'Disputa aberta',          hint: 'Você registrou o problema.' },
  { key: 'resposta',  label: 'Resposta da outra parte', hint: 'A outra parte tem até 5 dias para responder.' },
  { key: 'analise',   label: 'Análise da Dalivim',      hint: 'Nossa equipe avalia as duas versões e as provas.' },
  { key: 'resolucao', label: 'Resolução',               hint: 'Uma decisão é tomada e o dinheiro é destinado.' },
];
function disputeProgress(stage) {
  const cur = Math.max(0, DISPUTE_STAGES.findIndex(s => s.key === stage));
  return DISPUTE_STAGES.map((s, i) => ({
    ...s, state: i < cur ? 'done' : i === cur ? 'current' : 'pending',
  }));
}

const TONES = {
  blue:  { bg: '#EEF3FB', fg: '#1E4BA0', dot: '#1E4BA0' },
  amber: { bg: '#FBF1E3', fg: '#A1620B', dot: '#C77A12' },
  green: { bg: '#E8F2EC', fg: '#16794C', dot: '#1E8A5A' },
  red:   { bg: '#FBEAE5', fg: '#B42318', dot: '#C0450F' },
  gray:  { bg: '#F4F4F5', fg: '#52525B', dot: '#A1A1AA' },
};

const TIPO_META = {
  produto: { icon: 'package',   label: 'Produto' },
  servico: { icon: 'briefcase', label: 'Serviço' },
  outro:   { icon: 'handshake', label: 'Outro acordo' },
};

// ── Milestones (faseamento) ──────────────────────────────────────────
// A service paid in phases. Each phase is delivered, then approved (released)
// independently — escrow liberado fase a fase. Same calm vocabulary.
const MILESTONE_STATUS = {
  'aguardando': { label: 'Aguardando entrega', tone: 'amber' },
  'entregue':   { label: 'Entregue · a aprovar', tone: 'blue' },
  'aprovado':   { label: 'Aprovada · liberada', tone: 'green' },
  'disputa':    { label: 'Em disputa', tone: 'red' },
};
// The index of the phase that needs attention now (first not-approved).
function activeMilestone(ms) {
  return ms.findIndex(m => m.status !== 'aprovado');
}
function milestoneMoney(n) {
  const ms = n.milestones || [];
  const liberado = ms.filter(m => m.status === 'aprovado').reduce((s, m) => s + m.value, 0);
  return { liberado, emCustodia: n.value - liberado, total: n.value,
    aprovadas: ms.filter(m => m.status === 'aprovado').length, fases: ms.length };
}

// ── Next action ──────────────────────────────────────────────────────
// The single most important computation in the product. Given the viewer's
// side (comprador/vendedor) and the status, return what they must do now.
//   kind: 'do' (a real action button) | 'wait' (nothing to do)
function nextAction(persona, status, n) {
  const buyer = persona === 'comprador';

  // Milestone transactions: the next action is about the active phase.
  if (n && n.milestones && n.milestones.length && status !== 'disputa') {
    const ms = n.milestones;
    const i = activeMilestone(ms);
    if (i === -1) return { kind: 'wait', line: 'Todas as fases foram aprovadas. Negociação finalizada.' };
    const m = ms[i];
    const nth = `fase ${i + 1} · ${m.title}`;
    if (m.status === 'aguardando') {
      return buyer
        ? { kind: 'wait', line: `Aguardando ${m.title.toLowerCase()}. O valor da fase já está reservado.` }
        : { kind: 'do', verb: 'deliver-ms', msIndex: i, cta: `Marcar “${m.title}” como entregue`, line: `Entregue a ${nth}. O pagamento já está reservado.` };
    }
    if (m.status === 'entregue') {
      return buyer
        ? { kind: 'do', verb: 'approve-ms', msIndex: i, cta: `Aprovar e liberar ${brl(m.value, { cents: false })}`, line: `${cap(m.title)} foi entregue. Aprove para liberar ${brl(m.value, { cents: false })}.` }
        : { kind: 'wait', line: `Aguardando o cliente aprovar a ${nth}.` };
    }
  }

  const map = {
    'aguardando-pagamento': buyer
      ? { kind: 'do',   verb: 'pay',     cta: `Pagar ${brl(n.total, { cents: false })}`, line: 'Envie o pagamento. Ele fica reservado até você receber.' }
      : { kind: 'wait', line: 'Aguardando o pagamento do cliente.' },
    'protegido': buyer
      ? { kind: 'wait', line: 'Nenhuma ação agora. Avisamos quando for entregue.' }
      : { kind: 'do',   verb: 'deliver', cta: 'Marcar como entregue', line: 'O dinheiro já está reservado. Pode entregar com segurança.' },
    'aguardando-confirmacao': buyer
      ? { kind: 'do',   verb: 'release', cta: 'Confirmar recebimento', line: 'Recebeu tudo certo? Confirme para liberar o pagamento.' }
      : { kind: 'wait', line: 'Aguardando o cliente confirmar o recebimento.' },
    'liberado': buyer
      ? { kind: 'wait', line: 'Tudo certo. Esta negociação foi finalizada.' }
      : { kind: 'wait', line: 'Pagamento recebido. Negociação finalizada.' },
    'disputa': { kind: 'wait', line: 'Nossa equipe está analisando a disputa.' },
  };
  return map[status] || { kind: 'wait', line: '' };
}

// ── Timeline ─────────────────────────────────────────────────────────
// Six fixed milestones. Each is done / current / pending for a given status.
const TIMELINE_STEPS = [
  { key: 'criada',     label: 'Negociação criada' },
  { key: 'pago',       label: 'Pagamento recebido' },
  { key: 'protegido',  label: 'Dinheiro reservado' },
  { key: 'entrega',    label: 'Aguardando entrega' },
  { key: 'confirmacao',label: 'Confirmação do cliente' },
  { key: 'liberacao',  label: 'Pagamento liberado' },
];
// index of the "current" step per status (everything before = done)
const STATUS_PROGRESS = {
  'aguardando-pagamento':   1, // waiting on payment
  'protegido':              3, // waiting on delivery
  'aguardando-confirmacao': 4, // waiting on confirmation
  'liberado':               6, // all done
  'disputa':                4,
};
function timeline(status) {
  const cur = STATUS_PROGRESS[status] ?? 0;
  return TIMELINE_STEPS.map((s, i) => ({
    ...s,
    state: i < cur ? 'done' : i === cur ? 'current' : 'pending',
  }));
}

// ── Seed negotiations ────────────────────────────────────────────────
// Jean is the viewer. counterpart = the other side. Same data reads from
// either persona — the lens flips, the facts don't.
function seedNegotiations() {
  const mk = (o) => ({ ...o, fee: feeOf(o.value), total: o.value + feeOf(o.value) });
  return [
    mk({ id: 'NG-4193', title: 'Notebook Dell Latitude 5420', tipo: 'produto', value: 2500,
      counterpart: 'Maria Santos', status: 'aguardando-confirmacao', when: 'há 2 horas',
      desc: 'Notebook Dell Latitude 5420, i5, 16 GB RAM. Envio pelos Correios com rastreio.' }),
    mk({ id: 'NG-2774', title: 'Site institucional', tipo: 'servico', value: 4000,
      counterpart: 'Caio Almeida', status: 'protegido', when: 'ontem',
      desc: 'Site institucional de 5 páginas, responsivo, entregue publicado com domínio configurado.' }),
    mk({ id: 'NG-9821', title: 'Consultoria de marketing — mensal', tipo: 'servico', value: 1800,
      counterpart: 'Rafael Lemos', status: 'aguardando-pagamento', when: 'há 3 dias',
      desc: 'Pacote mensal: estratégia, gestão de tráfego e relatório de resultados.' }),
    mk({ id: 'NG-0442', title: 'Identidade visual', tipo: 'servico', value: 800,
      counterpart: 'João Pereira', status: 'liberado', when: 'há 1 semana',
      desc: 'Logo, paleta e manual de marca em PDF, com arquivos editáveis.' }),
    mk({ id: 'NG-5511', title: 'Landing page — campanha', tipo: 'servico', value: 3500,
      counterpart: 'Beatriz Costa', status: 'disputa', when: 'há 2 semanas',
      desc: 'Landing page de campanha com copy, design e publicação. Entrega em até 10 dias.',
      dispute: {
        reason: 'diferente', outcome: 'reembolso', openedBy: 'comprador', openedWhen: 'há 3 dias',
        stage: 'resposta', deadline: 'em 2 dias',
        claim: 'A página entregue não corresponde ao briefing aprovado — faltam seções e o layout está diferente do que foi combinado.',
        evidence: ['Briefing aprovado', 'Print da entrega', 'Conversa do acordo'],
        thread: [
          { from: 'comprador', when: 'há 3 dias', text: 'Abri a disputa. A entrega está diferente do briefing aprovado.' },
        ],
      } }),
    mk({ id: 'NG-6182', title: 'Casa de temporada — praia', tipo: 'outro', value: 1800,
      counterpart: 'Lucas Moura', status: 'liberado', when: 'há 1 mês',
      desc: 'Diária de fim de semana, casa com 3 quartos, check-in sexta 15h.' }),
    mk({ id: 'NG-7345', title: 'Site institucional — por fases', tipo: 'servico', value: 5000,
      counterpart: 'Caio Almeida', status: 'protegido', when: 'há 4 dias',
      desc: 'Site institucional de 5 páginas, entregue em fases: wireframes, layout e implementação.',
      milestones: [
        { id: 'M1', title: 'Wireframes', value: 1000, status: 'aprovado' },
        { id: 'M2', title: 'Layout aprovado', value: 1500, status: 'entregue' },
        { id: 'M3', title: 'Implementação', value: 2000, status: 'aguardando' },
        { id: 'M4', title: 'Publicação + ajustes', value: 500, status: 'aguardando' },
      ] }),
  ];
}

// ── Invoices (cobranças) ─────────────────────────────────────────────
// Seller bills a specific buyer. type 'escrow' = held until approval;
// 'direct' = settles straight to the seller. One status vocabulary.
const INVOICE_STATUS = {
  'pendente':  { label: 'Aguardando pagamento', tone: 'amber', money: 'A cobrança foi enviada. Aguardando o pagamento.' },
  'pago':      { label: 'Pago · em custódia',   tone: 'blue',  money: 'O cliente pagou. O valor está reservado.' },
  'liberado':  { label: 'Liberado',             tone: 'green', money: 'O pagamento foi liberado para você.' },
  'cancelada': { label: 'Cancelada',            tone: 'gray',  money: 'Esta cobrança foi cancelada.' },
};
function seedInvoices() {
  const mk = (o) => ({ ...o, fee: feeOf(o.value), total: o.value + feeOf(o.value) });
  return [
    mk({ id: 'COB-7781', buyer: 'Carolina Dias', buyerEmail: 'carolina.dias@email.com',
      title: 'Consultoria de marketing — junho', value: 1800, type: 'escrow', status: 'pago', when: 'há 2 dias',
      desc: 'Pacote mensal de consultoria, 4 sessões e relatório final.' }),
    mk({ id: 'COB-7754', buyer: 'Rafael Lemos', buyerEmail: 'rafael.lemos@email.com',
      title: 'Edição de vídeo — 3 reels', value: 900, type: 'direct', status: 'liberado', when: 'há 5 dias',
      desc: 'Três reels editados com legendas e trilha.' }),
    mk({ id: 'COB-7798', buyer: 'Tatiana Rocha', buyerEmail: 'tati.rocha@email.com',
      title: 'Mentoria de carreira — pacote 4h', value: 1200, type: 'escrow', status: 'pendente', when: 'há 6 horas',
      desc: 'Quatro encontros de 1h, com plano de ação por escrito.' }),
    mk({ id: 'COB-7702', buyer: 'Eduardo Pires', buyerEmail: 'edu.pires@email.com',
      title: 'Logo + identidade visual', value: 2500, type: 'escrow', status: 'pendente', when: 'ontem',
      desc: 'Logo, paleta, tipografia e manual de marca.' }),
    mk({ id: 'COB-7690', buyer: 'Marina Souza', buyerEmail: 'marina.souza@email.com',
      title: 'Tradução de contrato (EN→PT)', value: 650, type: 'direct', status: 'cancelada', when: 'há 1 semana',
      desc: 'Tradução juramentada de contrato comercial, 8 páginas.' }),
  ];
}
const cap = (s) => s ? s[0].toUpperCase() + s.slice(1) : s;

Object.assign(window, {
  brl, feeOf, cap, STATUS, TONES, TIPO_META,
  nextAction, TIMELINE_STEPS, timeline, seedNegotiations,
  DISPUTE_REASONS, DISPUTE_REASON_LABEL, DISPUTE_OUTCOMES, DISPUTE_OUTCOME_LABEL,
  DISPUTE_STAGES, disputeProgress,
  MILESTONE_STATUS, activeMilestone, milestoneMoney,
  INVOICE_STATUS, seedInvoices,
});
