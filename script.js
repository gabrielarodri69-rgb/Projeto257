// 1. Configurações e Elementos do Jogo
const board = document.getElementById('puzzle-board');
const gameContainer = document.getElementById('game-container');
const secretContainer = document.getElementById('secret-container');
const music = document.getElementById('love-song');

// Ordem correta das peças (0 a 8) e ordem embaralhada inicial
const correctOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let currentOrder = [2, 0, 5, 1, 4, 8, 3, 6, 7]; 

let firstSelectedPiece = null;
let heartsInterval = null; // Variável global para controlar os corações

// 2. Inicializa o tabuleiro do quebra-cabeça
function initGame() {
    board.innerHTML = '';
    currentOrder.forEach((posIndex, currentGridPosition) => {
        const piece = document.createElement('div');
        piece.classList.add('puzzle-piece');
        piece.dataset.correctIndex = posIndex;
        piece.dataset.currentGridPos = currentGridPosition;

        // Recorta a imagem do Murdoc
        const row = Math.floor(posIndex / 3);
        const col = posIndex % 3;
        piece.style.backgroundPosition = `${col * 50}% ${row * 50}%`;

        // Evento de clique para celular e PC
        piece.addEventListener('click', handlePieceClick);
        board.appendChild(piece);
    });
}

// 3. Gerencia o clique nas peças
function handlePieceClick(e) {
    const clickedPiece = e.currentTarget;

    if (!firstSelectedPiece) {
        firstSelectedPiece = clickedPiece;
        firstSelectedPiece.classList.add('selected');
    } else {
        if (firstSelectedPiece === clickedPiece) {
            firstSelectedPiece.classList.remove('selected');
            firstSelectedPiece = null;
            return;
        }

        const pos1 = parseInt(firstSelectedPiece.dataset.currentGridPos);
        const pos2 = parseInt(clickedPiece.dataset.currentGridPos);
        
        let temp = currentOrder[pos1];
        currentOrder[pos1] = currentOrder[pos2];
        currentOrder[pos2] = temp;

        firstSelectedPiece.classList.remove('selected');
        firstSelectedPiece = null;

        initGame();
        checkWin();
    }
}

// 4. Verifica se o quebra-cabeça foi montado certo
function checkWin() {
    const isWin = currentOrder.every((val, index) => val === correctOrder[index]);
    if (isWin) {
        setTimeout(revealSurprise, 400);
    }
}

function revealSurprise() {
    // 1. Esconde o tabuleiro e mostra a cartinha
    gameContainer.classList.add('hidden');
    secretContainer.classList.remove('hidden');

    // 2. Toca a música (Feel Good Inc.) após a interação do clique de vitória
    if (music) {
        music.play().then(() => {
            console.log("Música iniciada com sucesso!");
        }).catch(error => {
            // Caso o navegador ainda bloqueie por segurança, este plano B resolve:
            console.log("O navegador barrou o som automático. Ativando liberação por clique.");
            
            // Cria um evento temporário: assim que ele tocar em qualquer lugar da tela da carta, o som toca
            document.body.addEventListener('click', () => {
                music.play();
            }, { once: true }); // O 'once: true' faz o evento disparar apenas uma vez
        });
    }

    // 3. Ativa a chuva de corações e brilhos na tela toda
    if (heartsInterval) clearInterval(heartsInterval);
    heartsInterval = setInterval(() => {
        createHeart();
        createSparkle();
    }, 150); 
}

// Cria Corações espalhados pela tela toda
// --- No script.js, substitua a função createHeart ---
function createHeart() {
    const heartsLayer = document.getElementById('hearts-layer');
    if (!heartsLayer) return;

    const heart = document.createElement('div');
    heart.classList.add('floating-heart');
    
    const heartTypes = ['❤️', '💖', '💘', '💝'];
    heart.innerHTML = heartTypes[Math.floor(Math.random() * heartTypes.length)];
    
    // CORREÇÃO: Espalha o nascimento de 0% a 100% da largura da tela (vw)
    heart.style.left = Math.random() * 100 + 'vw';
    
    heart.style.fontSize = Math.random() * 20 + 15 + 'px';
    heart.style.animationDuration = Math.random() * 2 + 3 + 's';

    // CORREÇÃO: Faz o coração subir meio "tortinho" para a esquerda OU direita de forma aleatória
    heart.style.setProperty('--randomX', (Math.random() * 300 - 150) + 'px');

    heartsLayer.appendChild(heart);
    setTimeout(() => { heart.remove(); }, 5000);
}

// Nova função para criar os Brilhos subindo
// --- No script.js, substitua a função createSparkle ---
function createSparkle() {
    const heartsLayer = document.getElementById('hearts-layer');
    if (!heartsLayer) return;

    const sparkle = document.createElement('div');
    sparkle.classList.add('floating-sparkle');
    
    const sparkleTypes = ['✨', '⭐', '🌟'];
    sparkle.innerHTML = sparkleTypes[Math.floor(Math.random() * sparkleTypes.length)];
    
    // CORREÇÃO: Espalha o nascimento de 0% a 100% da largura da tela (vw)
    sparkle.style.left = Math.random() * 100 + 'vw';
    
    sparkle.style.fontSize = Math.random() * 12 + 10 + 'px';
    sparkle.style.animationDuration = Math.random() * 2 + 2 + 's';

    // CORREÇÃO: Movimento lateral aleatório para os brilhos também
    sparkle.style.setProperty('--randomX', (Math.random() * 200 - 100) + 'px');

    heartsLayer.appendChild(sparkle);
    setTimeout(() => { sparkle.remove(); }, 4000);
}

// 7. FUNÇÃO DO BOTÃO DE CORAÇÃO (REINICIAR)
function resetarJogo() {
    // Para a música e volta pro início
  if (music) {
    music.pause();
    music.currentTime = 0; // Volta para o início da música [00:00:00]
}

    // Para de criar novos corações
    if (heartsInterval) clearInterval(heartsInterval);

    // Limpa os corações que ficaram soltos na tela
    const heartsLayer = document.getElementById('hearts-layer');
    if (heartsLayer) heartsLayer.innerHTML = '';

    // Alterna a exibição das telas
    secretContainer.classList.add('hidden');
    gameContainer.classList.remove('hidden');

    // Embaralha as peças novamente
    currentOrder.sort(() => Math.random() - 0.5);

    // Recria o tabuleiro do zero
    initGame();
}

// Inicializa o jogo automaticamente assim que a página carregar
window.onload = initGame;
