import LegalShell, { H2 } from '../LegalShell';

export const metadata = {
  title: 'Termos de Serviço — Dalivim',
  description: 'As regras de uso da plataforma Dalivim.',
};

export default function Termos() {
  return (
    <LegalShell title="Termos de Serviço" updated="28 de junho de 2026">
      <p>
        Estes Termos regem o uso da <strong>Dalivim</strong>, plataforma que mantém pagamentos via Pix
        em custódia (escrow) até que o combinado entre as partes seja cumprido. Ao criar uma conta ou
        usar a plataforma, você concorda com estes Termos.
      </p>

      <H2>1. O que é a Dalivim</H2>
      <p>
        A Dalivim intermedeia negociações: o comprador paga via Pix, o valor fica retido em conta de
        garantia e só é liberado ao vendedor quando o comprador confirma a entrega (ou quando uma fase
        de um projeto é aprovada). Não somos parte da negociação entre comprador e vendedor.
      </p>

      <H2>2. Cadastro e verificação</H2>
      <p>
        Você deve fornecer informações verdadeiras e manter sua conta segura. Para receber valores,
        pode ser necessário concluir a verificação de identidade (KYC). Você é responsável por toda
        atividade realizada na sua conta.
      </p>

      <H2>3. Como funciona o pagamento protegido</H2>
      <ul>
        <li>O vendedor cria uma cobrança ou link de pagamento.</li>
        <li>O comprador paga via Pix; o valor fica em custódia na Dalivim.</li>
        <li>O valor é liberado ao vendedor mediante confirmação da entrega ou aprovação de uma fase.</li>
        <li>Em caso de impasse, qualquer parte pode abrir uma disputa.</li>
      </ul>

      <H2>4. Taxas</H2>
      <p>
        A Dalivim cobra uma taxa de serviço sobre as transações protegidas, informada no momento da
        criação da cobrança. Os valores e condições aplicáveis são exibidos antes da confirmação.
      </p>

      <H2>5. Disputas</H2>
      <p>
        Se houver desacordo sobre uma entrega, a disputa é registrada e analisada pela equipe da
        Dalivim com base nas informações e provas enviadas pelas partes. O valor permanece retido até a
        resolução. A decisão da mediação destina o valor a uma das partes (liberação ou reembolso).
      </p>

      <H2>6. Condutas proibidas</H2>
      <p>
        É proibido usar a Dalivim para atividades ilícitas, fraude, lavagem de dinheiro, venda de itens
        proibidos ou qualquer uso que viole leis aplicáveis. Podemos suspender ou encerrar contas que
        violem estes Termos.
      </p>

      <H2>7. Limitação de responsabilidade</H2>
      <p>
        A Dalivim atua como intermediária de custódia e não garante a qualidade, legalidade ou entrega
        dos bens e serviços negociados entre as partes. Na máxima extensão permitida em lei, nossa
        responsabilidade limita-se aos valores efetivamente mantidos em custódia na transação em questão.
      </p>

      <H2>8. Encerramento</H2>
      <p>
        Você pode encerrar sua conta a qualquer momento. Podemos suspender ou encerrar o acesso em caso
        de violação destes Termos ou de exigência legal, preservando as transações em andamento até sua
        conclusão.
      </p>

      <H2>9. Lei aplicável</H2>
      <p>
        Estes Termos são regidos pelas leis do Brasil. Fica eleito o foro do domicílio do usuário para
        dirimir eventuais controvérsias, quando aplicável.
      </p>

      <H2>10. Contato</H2>
      <p>
        Dúvidas sobre estes Termos? Fale com a gente em{' '}
        <a href="mailto:contato@dalivim.com.br">contato@dalivim.com.br</a>.
      </p>
    </LegalShell>
  );
}
