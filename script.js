// ===== CÓDIGO PARA LA PANTALLA DE INICIO =====
document.addEventListener('DOMContentLoaded', function() {
    const startScreen = document.getElementById('start-screen');
    const startBtn = document.getElementById('start-btn');
    const birthdayAudio = document.getElementById('birthdayAudio');
    const container = document.querySelector('.container');
    
    // Configurar el botón de inicio
    startBtn.addEventListener('click', function() {
        // Intentar reproducir audio
        const playAudio = () => {
            birthdayAudio.play()
                .then(() => {
                    console.log("Audio reproducido correctamente");
                })
                .catch(error => {
                    console.log("Error al reproducir audio:", error);
                    showAudioButton();
                });
        };
        
        // Intentar reproducir después de un breve retraso
        setTimeout(playAudio, 100);
        
        // Ocultar pantalla de inicio con efecto de desvanecimiento
        startScreen.style.opacity = '0';
        
        // Después de la transición, ocultar completamente y mostrar la animación
        setTimeout(function() {
            startScreen.style.display = 'none';
            container.style.display = 'flex';
            
            // Iniciar la animación del pastel
            startAnimation();
        }, 1000);
    });
    
    // Agregar elementos flotantes dinámicamente
    const floatingElements = document.querySelector('.floating-elements');
    const symbols = ['🎂', '🎁', '🎉', '🎈', '✨', '⭐', '❤️', '🥳'];
    
    for (let i = 0; i < 12; i++) {
        const element = document.createElement('div');
        element.classList.add('floating-element');
        element.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        element.style.top = Math.random() * 80 + 10 + '%';
        element.style.left = Math.random() * 80 + 10 + '%';
        element.style.animationDelay = Math.random() * 5 + 's';
        element.style.fontSize = (Math.random() * 1.5 + 1.5) + 'em';
        floatingElements.appendChild(element);
    }
});

// Función para mostrar botón de activación de audio
function showAudioButton() {
    const audioButton = document.createElement('button');
    audioButton.textContent = '🔊 Activar Audio';
    audioButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 10px 20px;
        background: #ff6b6b;
        color: white;
        border: none;
        border-radius: 20px;
        z-index: 1001;
        font-size: 16px;
    `;
    
    audioButton.addEventListener('click', function() {
        document.getElementById('birthdayAudio').play()
            .then(() => audioButton.remove())
            .catch(error => console.log("Error al activar audio:", error));
    });
    
    document.body.appendChild(audioButton);
}

// ===== CÓDIGO DE LA ANIMACIÓN DEL PASTEL =====
let confettiInterval;
let isExploded = false;

// Iniciar la animación
function startAnimation() {
    // Crear el efecto de dibujado con neón
    createNeonDrawing();
}

// Event listener para el botón de reinicio
document.getElementById('restartBtn').addEventListener('click', function() {
    resetAnimation();
    startAnimation();
});

function createNeonDrawing() {
    const animationContainer = document.querySelector('.animation-container');
    
    // Crear SVG para el efecto de dibujado
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "320");
    svg.setAttribute("height", "160");
    svg.setAttribute("viewBox", "0 0 320 160");
    svg.classList.add("neon-svg");
    
    // Dibujar la base del pastel
    const basePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    basePath.setAttribute("d", "M20,120 H300 A10,10 0 0,1 310,130 V140 A10,10 0 0,1 300,150 H20 A10,10 0 0,1 10,140 V130 A10,10 0 0,1 20,120");
    basePath.classList.add("neon-path");
    basePath.style.stroke = "#00ffff";
    svg.appendChild(basePath);
    
    // Dibujar la parte superior del pastel
    const topPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    topPath.setAttribute("d", "M10,100 H310 A10,10 0 0,1 320,110 V120 A10,10 0 0,1 310,130 H10 A10,10 0 0,1 0,120 V110 A10,10 0 0,1 10,100");
    topPath.classList.add("neon-path");
    topPath.style.stroke = "#ff00ff";
    topPath.style.animationDelay = "2.5s";
    svg.appendChild(topPath);
    
    animationContainer.appendChild(svg);
    
    // Mostrar el pastel real después de que termine la animación de dibujado
    setTimeout(() => {
        document.querySelector('.cake').style.opacity = "1";
        svg.style.opacity = "0";
        
        // Crear 11 velas
        createCandles();
        
        // Iniciar animación de velas después de que aparezca el pastel
        setTimeout(startCandleAnimation, 1500);
        
        // Eliminar el SVG después de la animación
        setTimeout(() => {
            if (svg.parentNode) {
                svg.remove();
            }
        }, 5000);
    }, 6000);
}

function createCandles() {
    const cake = document.querySelector('.cake');
    
    // Limpiar velas existentes
    const existingCandles = document.querySelectorAll('.candle');
    existingCandles.forEach(candle => candle.remove());
    
    const totalCandles = 11;
    const cakeWidth = cake.offsetWidth;
    const candleWidth = 10;
    
    // Calcular el espacio total que ocuparán las velas
    const totalCandlesWidth = totalCandles * candleWidth;
    
    // Calcular el espacio sobrante para distribuir
    const remainingSpace = cakeWidth - totalCandlesWidth;
    
    // Calcular el espacio entre velas
    const spacing = remainingSpace / (totalCandles + 1);
    
    for (let i = 0; i < totalCandles; i++) {
        const candle = document.createElement('div');
        candle.className = 'candle';
        
        // Posición: espacio inicial + (vela * ancho) + (espacio entre velas * posición)
        const position = spacing + (i * (candleWidth + spacing));
        candle.style.left = `${position}px`;
        
        const flame = document.createElement('div');
        flame.className = 'flame';
        
        candle.appendChild(flame);
        cake.appendChild(candle);
    }
}

function startCandleAnimation() {
    const candles = document.querySelectorAll('.candle');
    const flames = document.querySelectorAll('.flame');
    
    // Animación de caída con rebote para cada vela
    candles.forEach((candle, index) => {
        setTimeout(() => {
            // Aplicar animación de caída con rebote
            candle.style.animation = `candleFall 1.2s ease-out forwards`;
            candle.style.opacity = '1';
            
            // Encender la llama después de que la vela se estabilice
            setTimeout(() => {
                flames[index].style.animation = `flameAppear 0.8s ease-out forwards, flicker 0.8s infinite alternate 0.8s`;
                flames[index].style.opacity = '1';
            }, 1200);
            
        }, index * 600);
    });
    
    // Iniciar cuenta regresiva después de que aparezcan todas las velas
    setTimeout(startCountdown, 8000);
}

function startCountdown() {
    const countdown = document.getElementById('countdown');
    countdown.style.opacity = '1';
    
    let seconds = 5;
    const countdownInterval = setInterval(() => {
        countdown.textContent = seconds;
        
        if (seconds === 0) {
            clearInterval(countdownInterval);
            explodeCake();
        }
        
        seconds--;
    }, 1000);
}

function explodeCake() {
    const cake = document.querySelector('.cake');
    const countdown = document.getElementById('countdown');
    const message = document.getElementById('message');
    const restartBtn = document.getElementById('restartBtn');
    
    isExploded = true;
    
    // Ocultar pastel y cuenta regresiva
    cake.style.opacity = '0';
    countdown.style.opacity = '0';
    
    // Mostrar mensaje
    setTimeout(() => {
        message.style.opacity = '1';
        
        // Iniciar confeti continuo alrededor del mensaje
        startContinuousConfetti();
        
        // Mostrar botón de reinicio
        setTimeout(() => {
            restartBtn.style.opacity = '1';
        }, 1000);
    }, 1000);
}

function startContinuousConfetti() {
    const message = document.getElementById('message');
    const container = document.querySelector('.container');
    
    // Crear confeti inicial
    createConfetti();
    
    // Continuar creando confeti cada 500ms
    confettiInterval = setInterval(createConfetti, 500);
    
    function createConfetti() {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        const messageRect = message.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        // Calcular posición alrededor del mensaje
        const messageX = messageRect.left - containerRect.left + messageRect.width / 2;
        const messageY = messageRect.top - containerRect.top + messageRect.height / 2;
        
        for (let i = 0; i < 20; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            // Posicionar alrededor del mensaje
            const angle = Math.random() * Math.PI * 2;
            const distance = 100 + Math.random() * 50;
            const x = messageX + Math.cos(angle) * distance;
            const y = messageY + Math.sin(angle) * distance;
            
            confetti.style.left = `${x}px`;
            confetti.style.top = `${y}px`;
            
            // Efecto neón para el confeti
            confetti.style.boxShadow = `0 0 5px ${confetti.style.backgroundColor}, 0 0 10px ${confetti.style.backgroundColor}`;
            
            // Propiedades aleatorias para la animación
            const tx = (Math.random() - 0.5) * 200;
            const ty = (Math.random() - 0.5) * 200 - 100;
            const r = Math.random() * 360;
            
            confetti.style.setProperty('--tx', `${tx}px`);
            confetti.style.setProperty('--ty', `${ty}px`);
            confetti.style.setProperty('--r', `${r}deg`);
            
            confetti.style.animation = `explode ${Math.random() * 1.5 + 1}s forwards`;
            confetti.style.opacity = '1';
            
            container.appendChild(confetti);
            
            // Eliminar el confeti después de la animación
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.remove();
                }
            }, 3000);
        }
    }
}

function resetAnimation() {
    const cake = document.querySelector('.cake');
    const countdown = document.getElementById('countdown');
    const message = document.getElementById('message');
    const restartBtn = document.getElementById('restartBtn');
    
    // Detener confeti continuo
    if (confettiInterval) {
        clearInterval(confettiInterval);
    }
    
    // Limpiar confeti existente
    document.querySelectorAll('.confetti').forEach(confetti => confetti.remove());
    
    // Resetear estados
    cake.style.opacity = '0';
    countdown.style.opacity = '0';
    message.style.opacity = '0';
    restartBtn.style.opacity = '0';
    countdown.textContent = '5';
    
    // Limpiar SVG existente
    document.querySelectorAll('.neon-svg').forEach(svg => svg.remove());
    
    // Limpiar animaciones de velas
    const candles = document.querySelectorAll('.candle');
    const flames = document.querySelectorAll('.flame');
    
    candles.forEach(candle => {
        candle.style.animation = '';
        candle.style.opacity = '0';
    });
    
    flames.forEach(flame => {
        flame.style.animation = '';
        flame.style.opacity = '0';
    });
    
    isExploded = false;
}

// Centrar elementos en redimensionamiento de ventana
window.addEventListener('resize', function() {
    if (isExploded) {
        document.querySelectorAll('.confetti').forEach(confetti => confetti.remove());
        if (confettiInterval) {
            clearInterval(confettiInterval);
            startContinuousConfetti();
        }
    }
});