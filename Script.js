// ESTADO DO JOGO
const TOTAL_EXERCISES = 10;
let currentPhase = 1;
let exerciseCount = 0;
let score = 0;
let errors = 0;
let totalPoints = 0;
let timeElapsed = 0;
let timerInterval = null;
let isPaused = false;
let currentTask = {};
const PAGE_SIZE = 100;

// SISTEMA DE PROGRESSO E RECORDES DO MODO INFINITO (Salvo no Navegador)
let phase2Unlocked = localStorage.getItem('mmu_phase2_unlocked') === 'true';
let phase1SecretUnlocked = localStorage.getItem('mmu_p1_sec_unlocked') === 'true';
let phase2SecretUnlocked = localStorage.getItem('mmu_p2_sec_unlocked') === 'true';

// Recordes do Modo Infinito - Fase 1
let bestInf1Points = parseInt(localStorage.getItem('mmu_best_inf1_points')) || 0;
let bestInf1Tasks = parseInt(localStorage.getItem('mmu_best_inf1_tasks')) || 0;

// Recordes do Modo Infinito - Fase 2
let bestInf2Points = parseInt(localStorage.getItem('mmu_best_inf2_points')) || 0;
let bestInf2Tasks = parseInt(localStorage.getItem('mmu_best_inf2_tasks')) || 0;

// ELEMENTOS DO DOM
const mainMenuScreen = document.getElementById('main-menu-screen');
const tutorialScreen = document.getElementById('tutorial-screen');
const gameScreen = document.getElementById('game-screen');
const phaseSummaryScreen = document.getElementById('phase-summary-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const pauseOverlay = document.getElementById('pause-overlay');
const modalTutorial = document.getElementById('modal-tutorial');

const btnPhase1Sec = document.getElementById('btn-phase-1-sec');
const btnPhase2 = document.getElementById('btn-phase-2');
const btnPhase2Sec = document.getElementById('btn-phase-2-sec');

const exerciseCounter = document.getElementById('exercise-counter');
const scoreVal = document.getElementById('score-val');
const timerVal = document.getElementById('timer-val');
const phaseTitle = document.getElementById('phase-title');
const requestDisplay = document.getElementById('request-display');
const hardwareDisplay = document.getElementById('hardware-display');
const physicalInput = document.getElementById('physical-input');
const systemLog = document.getElementById('system-log');
const btnFinishMmu = document.getElementById('btn-finish-mmu');

// INICIALIZAR MENU E BOTÕES DE FASE (BLOQUEIOS / EXIBIÇÃO)
function updateMenuButtons() {
  if (phase2Unlocked) {
    btnPhase2.classList.remove('btn-disabled');
    btnPhase2.innerHTML = '2️⃣ Fase 2: Paginação';
    btnPhase2.disabled = false;
  } else {
    btnPhase2.classList.add('btn-disabled');
    btnPhase2.innerHTML = '🔒 Fase 2: Paginação (Bloqueada)';
    btnPhase2.disabled = true;
  }

  if (phase2Unlocked) {
    btnPhase1Sec.style.display = 'block';
  } else {
    btnPhase1Sec.style.display = 'none';
  }

  if (phase2SecretUnlocked) {
    btnPhase2Sec.style.display = 'block';
  } else {
    btnPhase2Sec.style.display = 'none';
  }
}

// RETORNAR AO MENU PRINCIPAL
function goToMainMenu() {
  clearInterval(timerInterval);
  hideAllScreens();
  updateMenuButtons();
  mainMenuScreen.classList.add('active');
}

// EXIBIR TUTORIAL
function showInitialTutorial() {
  hideAllScreens();
  tutorialScreen.classList.add('active');
}

function hideAllScreens() {
  mainMenuScreen.classList.remove('active');
  tutorialScreen.classList.remove('active');
  gameScreen.classList.remove('active');
  phaseSummaryScreen.classList.remove('active');
  gameOverScreen.classList.remove('active');
  pauseOverlay.classList.remove('active');
  modalTutorial.classList.remove('active');
}

// INICIAR FASE (Suporta 1, 2, '1-sec', '2-sec')
function startPhase(phaseNum) {
  if (phaseNum === 2 && !phase2Unlocked) return;
  if (phaseNum === '1-sec' && !phase2Unlocked) return;
  if (phaseNum === '2-sec' && !phase2SecretUnlocked) return;

  currentPhase = phaseNum;
  exerciseCount = 0;
  score = 0;
  errors = 0;
  totalPoints = 0;
  timeElapsed = 0;
  isPaused = false;

  hideAllScreens();
  gameScreen.classList.add('active');

  if (currentPhase === 1) {
    phaseTitle.textContent = "Fase 1: Registrador Base";
    btnFinishMmu.style.display = 'none';
  } else if (currentPhase === '1-sec') {
    phaseTitle.textContent = "♾️ Fase 1: Modo Infinito";
    btnFinishMmu.style.display = 'block';
  } else if (currentPhase === 2) {
    phaseTitle.textContent = "Fase 2: Paginação";
    btnFinishMmu.style.display = 'none';
  } else if (currentPhase === '2-sec') {
    phaseTitle.textContent = "♾️ Fase 2: Modo Infinito";
    btnFinishMmu.style.display = 'block';
  }

  updateDashboard();
  generateTask();
  startTimer();
}

// CRONÔMETRO
function startTimer() {
  clearInterval(timerInterval);
  timerVal.textContent = "0s";
  timerInterval = setInterval(() => {
    if (!isPaused) {
      timeElapsed++;
      timerVal.textContent = timeElapsed + "s";
    }
  }, 1000);
}

// CONTROLE DE PAUSE
function pauseGame() {
  isPaused = true;
  pauseOverlay.classList.add('active');
  logSystem("SISTEMA PAUSADO: Cronômetro e simulação congelados.");
}

function resumeGame() {
  isPaused = false;
  pauseOverlay.classList.remove('active');
  modalTutorial.classList.remove('active');
  physicalInput.focus();
  logSystem("SISTEMA RETOMADO: Execução continuada.");
}

function openPauseTutorial() { modalTutorial.classList.add('active'); }
function closePauseTutorial() { modalTutorial.classList.remove('active'); }

function surrenderGame() {
  isPaused = false;
  clearInterval(timerInterval);
  goToMainMenu();
}

// GERAR TAREFAS
function generateTask() {
  exerciseCount++;
  
  if ((currentPhase === 1 || currentPhase === 2) && exerciseCount > TOTAL_EXERCISES) {
    finishPhase();
    return;
  }

  if (currentPhase === 1 || currentPhase === 2) {
    exerciseCounter.textContent = `${exerciseCount}/${TOTAL_EXERCISES}`;
  } else {
    exerciseCounter.textContent = `${exerciseCount} (Infinito)`;
  }
  
  physicalInput.value = '';
  if (!isPaused) physicalInput.focus();

  if (currentPhase === 1 || currentPhase === '1-sec') {
    const logicalAddr = Math.floor(Math.random() * 90) + 10;
    const baseReg = Math.floor(Math.random() * 8 + 1) * 1000;
    const correctPhysical = logicalAddr + baseReg;

    currentTask = { logicalAddr, baseReg, correctPhysical };

    requestDisplay.innerHTML = `Processo solicita acesso ao <strong>Endereço Lógico: ${logicalAddr}</strong>`;
    hardwareDisplay.innerHTML = `
      <div class="info-pill">
        <strong>Registrador Base (SO):</strong> ${baseReg}
      </div>
    `;
  } else {
    const numPagesInTable = 4; 
    let pageTable = [];
    let usedFrames = [];

    for (let i = 0; i < numPagesInTable; i++) {
      let pageNum, frameNum;
      do { pageNum = Math.floor(Math.random() * 15) + 1; } while (pageTable.some(p => p.page === pageNum));
      do { frameNum = Math.floor(Math.random() * 15) + 1; } while (usedFrames.includes(frameNum));
      usedFrames.push(frameNum);
      pageTable.push({ page: pageNum, frame: frameNum });
    }

    const randomRow = pageTable[Math.floor(Math.random() * pageTable.length)];
    const targetPage = randomRow.page;
    const selectedFrame = randomRow.frame;
    const offset = Math.floor(Math.random() * 90) + 10;
    const correctPhysical = (selectedFrame * PAGE_SIZE) + offset;

    currentTask = { pageNum: targetPage, offset, correctPhysical, pageTable };

    requestDisplay.innerHTML = `Pedido: <strong>Página ${targetPage}</strong> | Deslocamento: <strong>${offset}</strong>`;
    
    let tableHTML = `
      <div style="width: 100%;">
        <div style="font-size: 0.85rem; margin-bottom: 5px; text-align: center;">Tabela de Páginas (MMU)</div>
        <table class="page-table">
          <tr><th>Página Lógica</th><th>Quadro Físico (RAM)</th></tr>
    `;
    
    pageTable.forEach(row => {
      tableHTML += `<tr><td>${row.page}</td><td>${row.frame}</td></tr>`;
    });
    
    tableHTML += `</table></div>`;
    hardwareDisplay.innerHTML = tableHTML;
  }
}

// RESPOSTA DO JOGADOR
function submitTranslation() {
  if (isPaused) return;

  const userVal = parseInt(physicalInput.value);

  if (isNaN(userVal)) {
    logSystem("ERRO: Digite um valor numérico válido.");
    return;
  }

  const isInfiniteMode = (currentPhase === '1-sec' || currentPhase === '2-sec');

  if (userVal === currentTask.correctPhysical) {
    score++;
    if (isInfiniteMode) totalPoints += 100;
    logSystem(`SUCESSO${isInfiniteMode ? ' (+100 pts)' : ''}: Endereço ${userVal} verificado com sucesso.`);
  } else {
    errors++;
    if (isInfiniteMode) totalPoints = Math.max(0, totalPoints - 35);
    logSystem(`FALHA${isInfiniteMode ? ' (-35 pts)' : ''}: Incorreto! O correto era ${currentTask.correctPhysical}.`);
  }

  updateDashboard();
  generateTask();
}

physicalInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') submitTranslation();
});

function updateDashboard() {
  scoreVal.textContent = score;
}

function logSystem(msg) {
  const time = new Date().toLocaleTimeString().split(' ')[0];
  systemLog.innerHTML = `[${time}] ${msg}<br>` + systemLog.innerHTML;
}

// FINALIZAR MODO INFINITO MANUALMENTE ("Finalizar MMU")
function finishInfiniteMode() {
  clearInterval(timerInterval);
  hideAllScreens();
  gameOverScreen.classList.add('active');

  const tasksDone = exerciseCount - 1;
  let isNewRecord = false;

  // Verificação e salvamento de recordes no Modo Infinito
  if (currentPhase === '1-sec') {
    if (totalPoints > bestInf1Points || (totalPoints === bestInf1Points && tasksDone > bestInf1Tasks)) {
      bestInf1Points = totalPoints;
      bestInf1Tasks = tasksDone;
      localStorage.setItem('mmu_best_inf1_points', bestInf1Points);
      localStorage.setItem('mmu_best_inf1_tasks', bestInf1Tasks);
      isNewRecord = true;
    }
  } else if (currentPhase === '2-sec') {
    if (totalPoints > bestInf2Points || (totalPoints === bestInf2Points && tasksDone > bestInf2Tasks)) {
      bestInf2Points = totalPoints;
      bestInf2Tasks = tasksDone;
      localStorage.setItem('mmu_best_inf2_points', bestInf2Points);
      localStorage.setItem('mmu_best_inf2_tasks', bestInf2Tasks);
      isNewRecord = true;
    }
  }

  document.getElementById('game-over-title').textContent = "📊 Relatório Final (Modo Infinito)";
  document.getElementById('final-score').textContent = `${totalPoints} pts`;
  document.getElementById('final-acc').textContent = `${tasksDone} tarefas`;
  document.getElementById('final-time').textContent = `${timeElapsed}s`;

  const recordPoints = currentPhase === '1-sec' ? bestInf1Points : bestInf2Points;
  const recordTasks = currentPhase === '1-sec' ? bestInf1Tasks : bestInf2Tasks;

  document.getElementById('final-feedback').innerHTML = `
    <h3>Sessão Infinita Encerrada</h3>
    <p>Você processou <strong>${tasksDone} tarefas</strong> em ${timeElapsed} segundos e acumulou <strong>${totalPoints} pontos</strong> na MMU!</p>
    <div style="margin-top: 15px; padding: 10px; background: rgba(16, 185, 129, 0.1); border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.3);">
      🏆 <strong>Recorde do Modo Infinito:</strong> ${recordPoints} pts (${recordTasks} tarefas)
      ${isNewRecord ? '<br><span style="color: #10b981; font-weight: bold;">✨ Novo Recorde Pessoal Alcançado!</span>' : ''}
    </div>
  `;

// Esconder todos os botões específicos primeiro
    const btnInf1 = document.getElementById('btn-retry-fase1');
    const btnInf2 = document.getElementById('btn-retry-fase2');
    const btnNorm1 = document.getElementById('btn-normal-fase1');
    const btnNorm2 = document.getElementById('btn-normal-fase2');

    if (btnInf1) btnInf1.style.display = 'none';
    if (btnInf2) btnInf2.style.display = 'none';
    if (btnNorm1) btnNorm1.style.display = 'none';
    if (btnNorm2) btnNorm2.style.display = 'none';

    // Mostrar apenas o botão infinito correspondente
    if (currentPhase === '1-sec' && btnInf1) {
        btnInf1.style.display = 'inline-block';
    } else if (currentPhase === '2-sec' && btnInf2) {
        btnInf2.style.display = 'inline-block';
    }
}

// FINALIZAR FASE NORMAL (APÓS 10 EXERCÍCIOS)
function finishPhase() {
  clearInterval(timerInterval);
  hideAllScreens();

  const accuracy = Math.round((score / TOTAL_EXERCISES) * 100);

  if (currentPhase === 1) {
    phase2Unlocked = true;
    localStorage.setItem('mmu_phase2_unlocked', 'true');

    document.getElementById('f1-acc').textContent = accuracy + "%";
    document.getElementById('f1-time').textContent = timeElapsed + "s";
    document.getElementById('f1-score-val').textContent = `${score}/${TOTAL_EXERCISES}`;

    const recordDisplay = document.getElementById('f1-record-display');
    recordDisplay.innerHTML = `
      🚀 <strong>Fase 1 Concluída com Sucesso!</strong><br>
      <span style="color: #10b981;">O Modo Infinito da Fase 1 foi desbloqueado no menu principal. Teste suas habilidades e bata recordes lá!</span>
    `;

    phaseSummaryScreen.classList.add('active');
  } else if (currentPhase === 2) {
    phase2SecretUnlocked = true;
    localStorage.setItem('mmu_p2_sec_unlocked', 'true');

    gameOverScreen.classList.add('active');
    document.getElementById('game-over-title').textContent = "Fim da Simulação (Fase 2)!";
    document.getElementById('final-score').textContent = `${score}/${TOTAL_EXERCISES} acertos`;
    document.getElementById('final-acc').textContent = accuracy + "%";
    document.getElementById('final-time').textContent = timeElapsed + "s";

    document.getElementById('final-feedback').innerHTML = `
      <h3>Parabéns! Modo Infinito da Fase 2 Desbloqueado<br>
      🚀 <strong>Fase 2 Concluída com Sucesso!</strong><br></h3>
      <p>Você concluiu a paginação com ${accuracy}% de precisão. O Modo Infinito da Fase 2 já está visível no menu principal!</p>
    `;
    // encerramento da Fase 2 Normal:

      const btnInf1 = document.getElementById('btn-retry-fase1');
      const btnInf2 = document.getElementById('btn-retry-fase2');
      const btnNorm1 = document.getElementById('btn-normal-fase1');
      const btnNorm2 = document.getElementById('btn-normal-fase2');

    // 1. Esconder os botões do Modo Infinito
      if (btnInf1) btnInf1.style.display = 'none';
      if (btnInf2) btnInf2.style.display = 'none';

    // 2. Exibir os botões do Modo Normal da Fase 2
      if (btnNorm1) btnNorm1.style.display = 'inline-block'; // "Ir para a Fase 1"
      if (btnNorm2) btnNorm2.style.display = 'inline-block'; // "Refazer Fase 2"

    // O botão "Voltar ao Menu Principal" não possui ID restritivo e permanece sempre visível.
  }
}

// Inicializar estado dos botões ao carregar a página
updateMenuButtons();