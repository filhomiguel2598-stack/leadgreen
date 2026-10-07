lucide.createIcons();

// Mapeamento completo de DDDs por Estado no Brasil
const dddPorEstado = {
  SP: ["11", "12", "13", "14", "15", "16", "17", "18", "19"],
  RJ: ["21", "22", "24"],
  MG: ["31", "32", "33", "34", "35", "37", "38"],
  ES: ["27", "28"],
  PR: ["41", "42", "43", "44", "45", "46"],
  SC: ["47", "48", "49"],
  RS: ["51", "53", "54", "55"],
  BA: ["71", "73", "74", "75", "77"],
  PE: ["81", "87"],
  CE: ["85", "88"],
  PA: ["91", "93", "94"],
  MA: ["98", "99"],
  GO: ["62", "64"],
  DF: ["61"],
  AM: ["92", "97"],
  PB: ["83"],
  RN: ["84"],
  AL: ["82"],
  PI: ["86", "89"],
  MT: ["65", "66"],
  MS: ["67"],
  SE: ["79"],
  RO: ["69"],
  TO: ["63"],
  AC: ["68"],
  AP: ["96"],
  RR: ["95"]
};

// Prefixos reais de 3 dígitos das operadoras (após o 9 obrigatório)
const prefixosOperadoras = [
  "912", "913", "914", "915", "916", "917", "918", "919",
  "811", "812", "813", "814", "815", "816", "817", "818",
  "881", "882", "883", "884", "885", "886", "887", "888",
  "961", "962", "963", "964", "965", "966", "967", "968",
  "921", "922", "923", "924", "925", "926", "927", "928"
];

// Elementos da página
const selectUF = document.getElementById('uf');
const selectDDD = document.getElementById('ddd');
const btnStart = document.getElementById('btnStart');
const btnStop = document.getElementById('btnStop');
const statusBadge = document.getElementById('statusBadge');
const loadingSpinner = document.getElementById('loadingSpinner');
const leadsTable = document.getElementById('leadsTable');
const countElement = document.getElementById('count');

let botInterval = null;
let totalLeads = 0;
const numerosJaProcessados = new Set();

// Atualiza a lista de DDDs ao trocar o Estado
function atualizarDDDs() {
  const ufSelecionada = selectUF.value;
  const ddds = dddPorEstado[ufSelecionada] || ["11"];
  
  selectDDD.innerHTML = "";
  ddds.forEach(ddd => {
    const option = document.createElement('option');
    option.value = ddd;
    option.textContent = ddd;
    selectDDD.appendChild(option);
  });
}

selectUF.addEventListener('change', atualizarDDDs);
atualizarDDDs();

// Gera exatamente 11 dígitos nacionais: DDD + 9 + Prefixo(3) + Final(4) = (XX) 9XXXX-XXXX
function gerarNumeroCelularCompleto(ddd) {
  const prefixo = prefixosOperadoras[Math.floor(Math.random() * prefixosOperadoras.length)];
  const final = String(Math.floor(1000 + Math.random() * 9000)); // 4 dígitos finais
  return `55${ddd}9${prefixo}${final}`;
}

// Formata para exibição visual: (XX) 9XXXX-XXXX
function formatarParaExibicao(numRaw) {
  const ddd = numRaw.substring(2, 4);
  const parte1 = numRaw.substring(4, 9);  // 9 + 4 dígitos (ex: 99123)
  const parte2 = numRaw.substring(9, 13); // 4 dígitos finais (ex: 4567)
  return `(${ddd}) ${parte1}-${parte2}`;
}

// Adiciona o contato na tabela
function adicionarLeadNaTabela(numeroRaw) {
  if (numerosJaProcessados.has(numeroRaw)) return;
  numerosJaProcessados.add(numeroRaw);

  const numeroFormatado = formatarParaExibicao(numeroRaw);
  const whatsappLink = `https://wa.me/${numeroRaw}`;

  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><strong>${numeroFormatado}</strong></td>
    <td>
      <a href="${whatsappLink}" target="_blank" class="btn-wsp">
        Chamar no WhatsApp
      </a>
    </td>
  `;

  leadsTable.prepend(tr);
  totalLeads++;
  countElement.textContent = totalLeads;
}

// Botão Iniciar
btnStart.addEventListener('click', () => {
  const ddd = selectDDD.value;

  btnStart.disabled = true;
  btnStop.disabled = false;
  statusBadge.textContent = "Status: Buscando contatos...";
  statusBadge.style.borderColor = "#00ff66";
  loadingSpinner.style.display = "block";

  // Gera 1 número a cada 2.5 segundos
  botInterval = setInterval(() => {
    const numero = gerarNumeroCelularCompleto(ddd);
    adicionarLeadNaTabela(numero);
  }, 2500);
});

// Botão Pausar
btnStop.addEventListener('click', () => {
  clearInterval(botInterval);
  btnStart.disabled = false;
  btnStop.disabled = true;
  statusBadge.textContent = "Status: Pausado";
  statusBadge.style.borderColor = "#ff3333";
  loadingSpinner.style.display = "none";
});
