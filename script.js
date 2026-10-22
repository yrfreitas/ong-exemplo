// ─── Contador animado das estatísticas do hero ──────────────────────
// Cada <strong> guarda o valor final em data-contador; a gente anima de
// 0 até ele quando o elemento entra na tela, em vez de já nascer com o
// número pronto (chama mais atenção e mostra uso de IntersectionObserver).
function animarContador(elemento) {
  const alvo = Number(elemento.dataset.contador);
  const duracaoMs = 1200;
  const inicio = performance.now();

  function passo(agora) {
    const progresso = Math.min((agora - inicio) / duracaoMs, 1);
    elemento.textContent = Math.floor(progresso * alvo);
    if (progresso < 1) requestAnimationFrame(passo);
  }
  requestAnimationFrame(passo);
}

const observadorContadores = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (entrada.isIntersecting) {
      animarContador(entrada.target);
      observadorContadores.unobserve(entrada.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('[data-contador]').forEach((el) => observadorContadores.observe(el));


// ─── Calculadora de impacto ──────────────────────────────────────────
// Converte o valor escolhido no slider numa frase concreta, trocando de
// faixa conforme o valor sobe — é só uma cadeia de "if" comparando o
// número com as faixas definidas abaixo.
const sliderDoacao = document.getElementById('valor-doacao');
const valorExibido = document.getElementById('valor-exibido');
const resultadoImpacto = document.getElementById('resultado-impacto');

function descreverImpacto(valor) {
  if (valor < 30) return `R$ ${valor} ajuda a montar um kit de material escolar básico.`;
  if (valor < 80) return `R$ ${valor} é o suficiente pra uma cesta básica completa.`;
  if (valor < 200) return `R$ ${valor} cobre um mês de reforço escolar pra uma criança.`;
  return `R$ ${valor} garante uma vaga inteira numa oficina profissionalizante.`;
}

function atualizarCalculadora() {
  const valor = Number(sliderDoacao.value);
  valorExibido.textContent = `R$ ${valor}`;
  resultadoImpacto.textContent = descreverImpacto(valor);
}

sliderDoacao.addEventListener('input', atualizarCalculadora);
atualizarCalculadora(); // mostra o resultado já no carregamento, sem esperar o primeiro arraste


// ─── Formulário de doação ────────────────────────────────────────────
// Validação na mão (sem lib): cada campo tem sua própria regra, e o erro
// aparece embaixo do campo específico em vez de um alerta genérico.
const formDoacao = document.getElementById('form-doacao');
const confirmacaoEnvio = document.getElementById('confirmacao-envio');

const validadores = {
  nome: (v) => v.trim().length >= 3 || 'Digite seu nome completo.',
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'E-mail inválido.',
  'tipo-apoio': (v) => v !== '' || 'Escolha uma forma de ajudar.',
};

function validarCampo(input) {
  const regra = validadores[input.name];
  const resultado = regra(input.value);
  const campo = input.closest('.campo');
  const spanErro = campo.querySelector('.erro');

  if (resultado === true) {
    campo.classList.remove('invalido');
    spanErro.textContent = '';
    return true;
  }
  campo.classList.add('invalido');
  spanErro.textContent = resultado;
  return false;
}

formDoacao.querySelectorAll('input, select').forEach((input) => {
  input.addEventListener('blur', () => validarCampo(input));
});

formDoacao.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const campos = [...formDoacao.querySelectorAll('input, select')];
  const todosValidos = campos.map(validarCampo).every(Boolean);

  if (!todosValidos) {
    confirmacaoEnvio.textContent = '';
    return;
  }

  // Projeto de exemplo: não existe backend, então só confirma na tela.
  confirmacaoEnvio.textContent = 'Obrigado! Entraremos em contato em breve.';
  formDoacao.reset();
});
