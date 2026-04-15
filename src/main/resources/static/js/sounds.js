// ==========================================
// SONIDOS - Academia Gondor 5B
// Web Audio API para generar sonidos
// ==========================================

const sounds = {
    addPoints: null,
    subtractPoints: null,
    currentVolume: 50
};

// Cargar sonidos
function loadSounds() {
    sounds.addPoints = createCoinSound;
    sounds.subtractPoints = createThunderSound;
}

// Generar sonido de monedas girando + impacto metálico
function createCoinSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const now = audioContext.currentTime;
        
        // Sonido de moneda girando (frecuencia ascendente)
        const spinner = audioContext.createOscillator();
        const spinnerGain = audioContext.createGain();
        
        spinner.connect(spinnerGain);
        spinnerGain.connect(audioContext.destination);
        
        spinner.frequency.setValueAtTime(400, now);
        spinner.frequency.exponentialRampToValueAtTime(800, now + 0.2);
        
        spinnerGain.gain.setValueAtTime(0.3 * (sounds.currentVolume / 100), now);
        spinnerGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        
        spinner.start(now);
        spinner.stop(now + 0.2);
        
        // Impacto metálico final
        setTimeout(() => {
            playMetallicImpact(audioContext);
        }, 200);
    } catch (e) {
        console.log('Error al reproducir sonido de monedas');
    }
}

// Sonido metálico de impacto
function playMetallicImpact(audioContext) {
    try {
        const now = audioContext.currentTime;
        const impact = audioContext.createOscillator();
        const impactGain = audioContext.createGain();
        
        impact.connect(impactGain);
        impactGain.connect(audioContext.destination);
        
        impact.frequency.setValueAtTime(1200, now);
        impact.frequency.exponentialRampToValueAtTime(600, now + 0.1);
        
        impactGain.gain.setValueAtTime(0.5 * (sounds.currentVolume / 100), now);
        impactGain.gain.exponentialRampToValueAtTime(0, now + 0.1);
        
        impact.start(now);
        impact.stop(now + 0.1);
    } catch (e) {
        console.log('Error al reproducir sonido metálico');
    }
}

// Generar sonido de trueno profundo
function createThunderSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const now = audioContext.currentTime;
        
        // Crear ruido blanco para simular trueno
        const bufferSize = audioContext.sampleRate * 0.5;
        const noiseBuf = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const output = noiseBuf.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        
        const noiseSource = audioContext.createBufferSource();
        const noiseGain = audioContext.createGain();
        const filter = audioContext.createBiquadFilter();
        
        noiseSource.buffer = noiseBuf;
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(50, now);
        
        noiseSource.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(audioContext.destination);
        
        noiseGain.gain.setValueAtTime(0.5 * (sounds.currentVolume / 100), now);
        noiseGain.gain.exponentialRampToValueAtTime(0, now + 0.5);
        
        noiseSource.start(now);
        noiseSource.stop(now + 0.5);
    } catch (e) {
        console.log('Error al reproducir sonido de trueno');
    }
}

// Función para reproducir sonido de añadir puntos
window.playAddPointsSound = function() {
    if (sounds.currentVolume > 0) {
        createCoinSound();
    }
};

// Función para reproducir sonido de restar puntos
window.playSubtractPointsSound = function() {
    if (sounds.currentVolume > 0) {
        createThunderSound();
    }
};

// Actualizar volumen
window.updateVolume = function(volume) {
    sounds.currentVolume = volume;
    localStorage.setItem('volume', volume);
};

// Inicializar sonidos
loadSounds();

// Cargar volumen guardado
const savedVolume = localStorage.getItem('volume');
if (savedVolume) {
    sounds.currentVolume = parseInt(savedVolume);
}
