import type { Metadata } from 'next';
import LegalShell, { H2 } from '../LegalShell';

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Como a Dalivim coleta, usa e protege seus dados pessoais no pagamento protegido por escrow via Pix.',
  alternates: { canonical: '/privacidade' },
  openGraph: {
    title: 'Política de Privacidade | Dalivim',
    description: 'Como a Dalivim coleta, usa e protege seus dados pessoais.',
    url: '/privacidade',
    type: 'article',
  },
};

export default function Privacidade() {
  return (
    <LegalShell title="Política de Privacidade" updated="28 de junho de 2026">
      <p>
        Esta Política descreve como a <strong>Dalivim</strong> (&ldquo;Dalivim&rdquo;, &ldquo;nós&rdquo;) coleta, usa,
        compartilha e protege os dados pessoais de quem usa nossa plataforma de pagamento protegido por
        escrow via Pix. Ao usar a Dalivim, você concorda com as práticas aqui descritas.
      </p>

      <H2>1. Dados que coletamos</H2>
      <ul>
        <li><strong>Cadastro:</strong> nome, e-mail e senha.</li>
        <li><strong>Verificação de identidade (KYC):</strong> CPF e data de nascimento, quando exigido para liberar recebimentos.</li>
        <li><strong>Pagamento:</strong> chave Pix de recebimento e dados das transações (valores, status, partes envolvidas).</li>
        <li><strong>Uso:</strong> registros de acesso, endereço IP e informações técnicas do dispositivo, para segurança e prevenção a fraudes.</li>
      </ul>

      <H2>2. Como usamos seus dados</H2>
      <ul>
        <li>Prestar o serviço de custódia (escrow) e processar pagamentos via Pix.</li>
        <li>Verificar identidade e cumprir obrigações legais e regulatórias.</li>
        <li>Enviar notificações sobre suas transações (e-mail) e dar suporte.</li>
        <li>Prevenir fraudes, abusos e proteger a plataforma e seus usuários.</li>
      </ul>

      <H2>3. Compartilhamento</H2>
      <p>
        Compartilhamos dados apenas quando necessário para operar o serviço: com nosso provedor de
        pagamentos Pix e com nosso provedor de envio de e-mails. Também podemos divulgar dados a
        autoridades quando exigido por lei ou ordem judicial. Não vendemos seus dados pessoais.
      </p>

      <H2>4. Login com Google</H2>
      <p>
        Se você optar por entrar com o Google, recebemos seu nome e e-mail da conta Google para criar
        ou vincular sua conta Dalivim. Não acessamos sua senha do Google nem outros dados além dos
        necessários para autenticação.
      </p>

      <H2>5. Seus direitos (LGPD)</H2>
      <p>
        Você pode solicitar acesso, correção, exclusão, portabilidade e informações sobre o tratamento
        dos seus dados, nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018). Para exercer
        esses direitos, escreva para <a href="mailto:contato@dalivim.com.br">contato@dalivim.com.br</a>.
      </p>

      <H2>6. Retenção e segurança</H2>
      <p>
        Mantemos seus dados pelo tempo necessário para prestar o serviço e cumprir obrigações legais.
        Adotamos medidas técnicas e organizacionais para proteger seus dados; valores em custódia ficam
        em conta segregada, separada da operação da Dalivim.
      </p>

      <H2>7. Alterações</H2>
      <p>
        Podemos atualizar esta Política periodicamente. Mudanças relevantes serão comunicadas pelos
        nossos canais. O uso continuado após a atualização significa concordância com a nova versão.
      </p>

      <H2>8. Contato</H2>
      <p>
        Dúvidas sobre privacidade? Fale com a gente em{' '}
        <a href="mailto:contato@dalivim.com.br">contato@dalivim.com.br</a>.
      </p>
    </LegalShell>
  );
}
