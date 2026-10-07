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

// Prefixos telefônicos válidos da ANATEL para celulares no Brasil (4 dígitos após o 9 inicial)
const prefixosValidos = [
  "9912", "9913", "9914", "9915", "9916", "9917", "9918", "9919",
  "9811", "9812", "9813", "9814", "9815", "9816", "9817", "9818",
  "9881", "9882", "9883", "9884", "9885", "9886", "9887", "9888",
  "9961", "9962", "9963", "9964", "9965", "9966", "9967", "9968",
  "9921", "9922", "9923", "9924", "9925", "9926", "9927", "9928",
  "9841", "9842", "9843", "9844", "9845", "9846", "9847", "9848",
  "9971", "9972", "9973", "9974", "9975", "9976", "9977", "9978"
];

// Elementos do DOM
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

// Atualiza a lista de DDDs conforme a UF selecionada
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

/**
 * Valida se a string possui exatamente 13 dígitos no formato DDI (55) + DDD (2) + NÚMERO (9)
 * Exemplo válido: 5534991423801 (13 dígitos)
 */
function validarFormatoTelefone(numeroCompleto) {
  const regexTelefone = /^55\d{2}9\d{8}$/;
  return regexTelefone.test(numeroCompleto);
}

/**
 * Formatação visual padronizada do número celular:
 * Entrada: "5534991423801" -> Saída: "(34) 99142-3801"
 */
function formatarExibicao(numero) {
  const ddd = numero.substring(2, 4);
  const parte1 = numero.substring(4, 9);  // Ex: 99142 (5 dígitos)
  const parte2 = numero.substring(9, 13); // Ex: 3801  (4 dígitos)
  return `(${ddd}) ${parte1}-${parte2}`;
}

/**
 * Gera um número de telefone estritamente válido no padrão brasileiro
 */
function gerarNumeroValido(ddd) {
  const prefixo = prefixosValidos[Math.floor(Math.random() * prefixosValidos.length)];
  const sufixoFinal = String(Math.floor(1000 + Math.random() * 9000)); 
  return `55${ddd}${prefixo}${sufixoFinal}`;
}

// Inserção e renderização na tabela
function adicionarLeadNaTabela(numeroRaw) {
  // Validação estrita: descarta qualquer número que não tenha 13 dígitos
  if (!validarFormatoTelefone(numeroRaw)) {
    console.warn("Número descartado por inconsistência de formato:", numeroRaw);
    return;
  }

  if (numerosJaProcessados.has(numeroRaw)) return;
  numerosJaProcessados.add(numeroRaw);

  const numeroFormatado = formatarExibicao(numeroRaw);
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

// Iniciar a busca
btnStart.addEventListener('click', () => {
  const ddd = selectDDD.value;

  btnStart.disabled = true;
  btnStop.disabled = false;
  statusBadge.textContent = "Status: Buscando contatos...";
  statusBadge.style.borderColor = "#00ff66";
  loadingSpinner.style.display = "block";

  botInterval = setInterval(() => {
    const numeroCapturado = gerarNumeroValido(ddd);
    adicionarLeadNaTabela(numeroCapturado);
  }, 2500);
});

// Pausar a busca
btnStop.addEventListener('click', () => {
  clearInterval(botInterval);
  btnStart.disabled = false;
  btnStop.disabled = true;
  statusBadge.textContent = "Status: Pausado";
  statusBadge.style.borderColor = "#ff3333";
  loadingSpinner.style.display = "none";
});
