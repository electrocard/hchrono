let timer;
let elapsedTime = 0;
let running = false;
let isPause = false;
let remainingTime = 0;
let settingsVisible = false;

let serieDuration = 30 * 1000; 
let pauseDuration = 10 * 1000; 
let totalRepetitions = 5;
let currentRepetition = 0;

const chronoContainer = document.getElementById("chrono-container");
const settingsContainer = document.getElementById("settings-container");
const chronoDisplay = document.getElementById("chrono");
const statusDisplay = document.getElementById("status");

const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const resetButton = document.getElementById("reset");
const settingsButton = document.getElementById("settings");

const serieInput = document.getElementById("serieTime");
const pauseInput = document.getElementById("pauseTime");
const repeatInput = document.getElementById("repeats");

const sounds = {
    start: new Audio("resource/sound/start.mp3"),
    pause: new Audio("resource/sound/pause.mp3"),
    newSerie: new Audio("new_serie.mp3"),
    half: new Audio("resource/sound/half.mp3"),
};

function playSound(sound) {
    if (sounds[sound]) {
        sounds[sound].play();
    }
}

function formatTime(ms) {
    let minutes = Math.floor(ms / 60000);
    let seconds = Math.floor((ms % 60000) / 1000);
    let milliseconds = ms % 1000;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(3, '0')}`;
}

function updateChrono() {
    elapsedTime -= 10;

    if (elapsedTime === Math.floor(serieDuration / 2) && !isPause) {
        playSound("half"); 
    }

    if (elapsedTime <= 0) {
        clearInterval(timer);
        if (isPause) {
            startSeries();
        } else {
            startPause();
        }
        return;
    }

    chronoDisplay.textContent = formatTime(elapsedTime);
}

function startTimer(duration, mode, resume = false) {
    if (!resume) {
        elapsedTime = duration;
    } else {
        elapsedTime = remainingTime;
    }

    clearInterval(timer);
    running = true;
    isPause = mode === "pause";

    if (isPause) {
        statusDisplay.textContent = `Pause ${currentRepetition + 1}/${totalRepetitions}`;
        playSound("pause"); 
    } else {
        statusDisplay.textContent = `Série ${currentRepetition + 1}/${totalRepetitions}`;
        playSound("newSerie"); 
    }

    timer = setInterval(updateChrono, 10);
}

function startSeries(resume = false) {
    if (currentRepetition < totalRepetitions) {
        startTimer(serieDuration, "serie", resume);
    } else {
        statusDisplay.textContent = "Terminé !";
    }
}

function startPause(resume = false) {
    currentRepetition++;
    if (currentRepetition < totalRepetitions) {
        startTimer(pauseDuration, "pause", resume);
    } else {
        statusDisplay.textContent = "Terminé !";
    }
}

function startWorkout() {
    if (running) return; 

    playSound("start"); 

    serieDuration = parseInt(serieInput.value) * 1000;
    pauseDuration = parseInt(pauseInput.value) * 1000;
    totalRepetitions = parseInt(repeatInput.value);

    if (remainingTime > 0) {
        if (isPause) {
            startPause(true);
        } else {
            startSeries(true);
        }
    } else {
        currentRepetition = 0;
        startSeries();
    }
}

function stopChrono() {
    if (running) {
        clearInterval(timer);
        running = false;
        remainingTime = elapsedTime; 
        statusDisplay.textContent = "Pause";
    }
}

function resetChrono() {
    clearInterval(timer);
    running = false;
    isPause = false;
    elapsedTime = 0;
    remainingTime = 0;
    currentRepetition = 0;
    chronoDisplay.textContent = "00:00:000";
    statusDisplay.textContent = "Prêt";
}

// 🎛️ Affichage des paramètres
function toggleSettings() {
    settingsVisible = !settingsVisible;
    if (settingsVisible) {
        settingsContainer.style.display = "block";
        chronoContainer.style.display = "none";
    } else {
        settingsContainer.style.display = "none";
        chronoContainer.style.display = "block";
    }
}

startButton.addEventListener("click", startWorkout);
stopButton.addEventListener("click", stopChrono);
resetButton.addEventListener("click", resetChrono);
settingsButton.addEventListener("click", toggleSettings);





