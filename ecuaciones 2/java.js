let timerInterval;
let seconds = 0;
let correctAnswerIndex;
let isGameActive = true;

// Inicia y actualiza el cronómetro cada segundo
function startTimer() {
    clearInterval(timerInterval);
    seconds = 0;
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        seconds++;
        updateTimerDisplay();
    }, 1000);
}

// Formatea los segundos al formato "Minutos:Segundos" (ej. 0:10)
function updateTimerDisplay() {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    // Si los segundos son menores a 10, le agrega un 0 a la izquierda
    const formattedSecs = secs < 10 ? '0' + secs : secs;
    document.getElementById('timer-display').innerText = `${minutes}:${formattedSecs}`;
}

// Genera una ecuación lineal (aX + b = c) asegurando que X sea entero
function generateEquation() {
    // 1. Generamos "X" como un entero aleatorio entre -10 y 10
    const x = Math.floor(Math.random() * 21) - 10;
    
    // 2. Generamos "a" (coeficiente de X) entre 1 y 15
    const a = Math.floor(Math.random() * 15) + 1;
    
    // 3. Generamos "b" (constante) entre -25 y 25
    const b = Math.floor(Math.random() * 51) - 25;
    
    // 4. Calculamos "c" (el resultado final) para que X encaje perfectamente
    const c = (a * x) + b;

    // Formateamos el string visual (si b es negativo, ajustamos el signo)
    const sign = b < 0 ? '-' : '+';
    const bAbsolute = Math.abs(b);
    
    const equationString = `${a}X ${sign} ${bAbsolute} = ${c}`;
    document.getElementById('equation-display').innerText = equationString;

    return x; // Retornamos el valor real de X
}

// Función principal que inicializa una nueva partida
function initGame() {
    isGameActive = true;
    document.getElementById('next-btn').style.display = 'none';

    // Restaurar los colores naranjas de los círculos
    for (let i = 0; i < 3; i++) {
        document.getElementById(`circle-${i}`).style.backgroundColor = '#f97316';
    }

    const correctValue = generateEquation();

    // Generar opciones posibles (1 correcta y 2 falsas)
    let options = [correctValue];
    
    while (options.length < 3) {
        // Genera un distractor sumando o restando un valor pequeño a la respuesta correcta
        let fakeValue = correctValue + (Math.floor(Math.random() * 11) - 5);
        
        // Se asegura de que no haya opciones repetidas y de que el distractor no sea igual a la respuesta
        if (!options.includes(fakeValue) && fakeValue !== correctValue) {
            options.push(fakeValue);
        }
    }

    // Mezclar las 3 opciones de forma aleatoria para que la correcta no esté siempre en A
    options.sort(() => Math.random() - 0.5);
    correctAnswerIndex = options.indexOf(correctValue); // Guarda la posición de la correcta

    // Imprimir los valores en el HTML
    for (let i = 0; i < 3; i++) {
        document.getElementById(`val-${i}`).innerText = options[i];
    }

    startTimer();
}

// Valida si la opción clickeada es la correcta
function checkAnswer(selectedIndex) {
    if (!isGameActive) return; // Si ya ganó, bloquea más clicks

    if (selectedIndex === correctAnswerIndex) {
        // ¡Respuesta correcta!
        document.getElementById(`circle-${selectedIndex}`).style.backgroundColor = '#10b981'; // Verde
        clearInterval(timerInterval); // Detiene el tiempo
        isGameActive = false;
        document.getElementById('next-btn').style.display = 'inline-block'; // Muestra botón de siguiente
    } else {
        // ¡Respuesta incorrecta!
        document.getElementById(`circle-${selectedIndex}`).style.backgroundColor = '#ef4444'; // Rojo
    }
}

// Al refrescar o cargar la página web por primera vez, ejecuta el juego
window.onload = initGame;