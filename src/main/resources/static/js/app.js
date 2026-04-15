// ==========================================
// MAIN APP - Academia Gondor 5B
// ==========================================

const API_URL = 'http://localhost:8080/api';
let students = [];
let currentStudentModal = null;
let chartsInstances = {};

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    loadStudents();
    setupEventListeners();
    loadSettings();
    renderDashboard();
});

// =============== CARGAR ESTUDIANTES ===============
async function loadStudents() {
    try {
        const response = await fetch(`${API_URL}/alumnos`);
        if (response.ok) {
            students = await response.json();
        } else {
            loadStudentsFromLocalStorage();
        }
    } catch (error) {
        console.error('Error cargando estudiantes:', error);
        loadStudentsFromLocalStorage();
    }
    renderDashboard();
}

// Cargar estudiantes del localStorage como fallback
function loadStudentsFromLocalStorage() {
    const stored = localStorage.getItem('students');
    if (stored) {
        students = JSON.parse(stored);
    } else {
        // Crear 21 estudiantes de prueba
        students = [];
        for (let i = 1; i <= 21; i++) {
            const esChico = i <= 10;
            students.push({
                id: i,
                nombre: esChico ? `Noi ${i}` : `Noia ${i - 10}`,
                genero: esChico ? 'chico' : 'chica',
                puntos: Math.floor(Math.random() * 50),
                urlFoto: null,
                fechaCreacion: new Date().toISOString()
            });
        }
    }
    renderDashboard();
}

// Guardar estudiantes en localStorage
function saveStudentsToLocalStorage() {
    localStorage.setItem('students', JSON.stringify(students));
}

// =============== CONFIGURAR EVENT LISTENERS ===============
function setupEventListeners() {
    // Tema oscuro/claro
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Volumen
    const volumeToggle = document.getElementById('volume-toggle');
    if (volumeToggle) {
        volumeToggle.addEventListener('click', toggleVolume);
    }
    
    const volumeSlider = document.getElementById('volumeSlider');
    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            updateVolume(e.target.value);
            document.getElementById('volumeValue').textContent = e.target.value + '%';
        });
    }
    
    // Añadir alumno
    const addForm = document.getElementById('addStudentForm');
    if (addForm) {
        addForm.addEventListener('submit', addStudent);
    }
    
    // Brillo
    const brightnessSlider = document.getElementById('brightnessSlider');
    if (brightnessSlider) {
        brightnessSlider.addEventListener('input', (e) => {
            document.body.style.filter = `brightness(${e.target.value}%)`;
            document.getElementById('brightnessValue').textContent = e.target.value + '%';
            localStorage.setItem('brightness', e.target.value);
        });
    }
    
    // Tamaño de fuente
    const fontSizeSelect = document.getElementById('fontSizeSelect');
    if (fontSizeSelect) {
        fontSizeSelect.addEventListener('change', updateFontSize);
    }
    
    // Tipo de fuente
    const fontFamilySelect = document.getElementById('fontFamilySelect');
    if (fontFamilySelect) {
        fontFamilySelect.addEventListener('change', updateFontFamily);
    }
    
    // Modal
    const modal = document.getElementById('pointsModal');
    if (modal) {
        const closeBtn = modal.querySelector('.close');
        closeBtn.addEventListener('click', closeModal);
        window.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        
        // Botones del modal
        const addBtn = document.getElementById('addBtn');
        if (addBtn) {
            addBtn.addEventListener('click', addPointsFromModal);
        }
        
        const subtractBtn = document.getElementById('subtractBtn');
        if (subtractBtn) {
            subtractBtn.addEventListener('click', subtractPointsFromModal);
        }
    }
}

// =============== RENDERIZAR DASHBOARD ===============
function renderDashboard() {
    const container = document.getElementById('cardsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Asegurar que tenemos 21 estudiantes
    while (students.length < 21) {
        const newStudent = {
            id: students.length + 1,
            nombre: students.length % 2 === 0 ? `Noi ${Math.ceil(students.length / 2)}` : `Noia ${Math.ceil((students.length - 1) / 2)}`,
            genero: students.length % 2 === 0 ? 'chico' : 'chica',
            puntos: 0,
            urlFoto: null
        };
        students.push(newStudent);
    }
    
    students.forEach((student) => {
        const card = createFlipCard(student);
        container.appendChild(card);
    });
    
    saveStudentsToLocalStorage();
}

// Crear tarjeta volteable
function createFlipCard(student) {
    const card = document.createElement('div');
    card.className = 'flip-card';
    
    const emoji = student.genero === 'chico' ? '👦' : '👧';
    
    card.innerHTML = `
        <div class="flip-card-inner">
            <div class="flip-card-front">
                <div style="font-size: 60px; margin-bottom: 0.5rem;">${emoji}</div>
                <p class="student-name">${student.nombre}</p>
                <p class="student-points"><i class="fas fa-star"></i> ${student.puntos} punts</p>
            </div>
            <div class="flip-card-back">
                <button class="btn-add-points" onclick="openPointsModal(${student.id}, true)">
                    <i class="fas fa-plus"></i> Afegir
                </button>
                <button class="btn-subtract-points" onclick="openPointsModal(${student.id}, false)">
                    <i class="fas fa-minus"></i> Restar
                </button>
            </div>
        </div>
    `;
    
    // Evento de click para voltear
    card.addEventListener('click', function(e) {
        if (!e.target.closest('button')) {
            this.classList.toggle('flipped');
        }
    });
    
    return card;
}

// =============== GESTIÓN DE PUNTOS ===============
function openPointsModal(studentId, isAdd) {
    currentStudentModal = { studentId, isAdd };
    const student = students.find(s => s.id === studentId);
    
    if (student) {
        document.getElementById('currentPoints').textContent = student.puntos;
        document.getElementById('pointsAmount').value = 1;
        
        const addBtn = document.getElementById('addBtn');
        const subtractBtn = document.getElementById('subtractBtn');
        
        if (isAdd) {
            addBtn.style.display = 'inline-block';
            subtractBtn.style.display = 'none';
            addBtn.textContent = '+ Afegir Punts';
        } else {
            addBtn.style.display = 'none';
            subtractBtn.style.display = 'inline-block';
            subtractBtn.textContent = '- Restar Punts';
        }
        
        document.getElementById('pointsModal').classList.add('show');
    }
}

function closeModal() {
    document.getElementById('pointsModal').classList.remove('show');
}

function addPointsFromModal() {
    const amount = parseInt(document.getElementById('pointsAmount').value);
    const studentId = currentStudentModal.studentId;
    
    if (isNaN(amount) || amount <= 0) {
        alert('Ingresa una cantidad válida');
        return;
    }
    
    addPointsToStudent(studentId, amount);
    playAddPointsSound();
    closeModal();
}

function subtractPointsFromModal() {
    const amount = parseInt(document.getElementById('pointsAmount').value);
    const studentId = currentStudentModal.studentId;
    
    if (isNaN(amount) || amount <= 0) {
        alert('Ingresa una cantidad válida');
        return;
    }
    
    subtractPointsFromStudent(studentId, amount);
    playSubtractPointsSound();
    closeModal();
}

function addPointsToStudent(studentId, amount) {
    const student = students.find(s => s.id === studentId);
    if (student) {
        student.puntos += amount;
        saveStudentsToLocalStorage();
        renderDashboard();
    }
}

function subtractPointsFromStudent(studentId, amount) {
    const student = students.find(s => s.id === studentId);
    if (student) {
        student.puntos = Math.max(0, student.puntos - amount);
        saveStudentsToLocalStorage();
        renderDashboard();
    }
}

// =============== RECLUTAMIENTO ===============
function addStudent(e) {
    e.preventDefault();
    
    if (students.length >= 21) {
        alert('Ya tienes 21 alumnos. No puedes agregar más.');
        return;
    }
    
    const name = document.getElementById('studentName').value;
    const gender = document.getElementById('studentGender').value;
    
    if (!name || !gender) {
        alert('Por favor completa todos los campos');
        return;
    }
    
    const newStudent = {
        id: students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1,
        nombre: name,
        genero: gender,
        puntos: 0,
        urlFoto: null
    };
    
    students.push(newStudent);
    saveStudentsToLocalStorage();
    renderDashboard();
    renderStudentsList();
    
    document.getElementById('addStudentForm').reset();
    alert('Alumno añadido correctamente');
}

function renderStudentsList() {
    const list = document.getElementById('studentsList');
    if (!list) return;
    
    list.innerHTML = '';
    
    if (students.length === 0) {
        list.innerHTML = '<p style="text-align: center; color: #FFD700;">No hay alumnos agregados</p>';
        return;
    }
    
    students.forEach(student => {
        const item = document.createElement('div');
        item.className = 'student-item';
        item.innerHTML = `
            <div class="student-info">
                <strong>${student.nombre}</strong> <span style="color: #B8860B;">(${student.genero === 'chico' ? 'Noi' : 'Noia'})</span>
                <br><small style="color: #28a745;">Punts: ${student.puntos}</small>
            </div>
            <button class="btn-delete" onclick="deleteStudent(${student.id})">Eliminar</button>
        `;
        list.appendChild(item);
    });
}

function deleteStudent(studentId) {
    if (confirm('¿Estás seguro de que quieres eliminar este alumno?')) {
        students = students.filter(s => s.id !== studentId);
        saveStudentsToLocalStorage();
        renderDashboard();
        renderStudentsList();
    }
}

// =============== RANKING ===============
function updateRanking() {
    const tbody = document.getElementById('rankingBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const sorted = [...students].sort((a, b) => b.puntos - a.puntos);
    
    sorted.forEach((student, index) => {
        const row = tbody.insertRow();
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
        row.innerHTML = `
            <td class="rank">${medal} ${index + 1}</td>
            <td><strong>${student.nombre}</strong></td>
            <td>${student.genero === 'chico' ? 'Noi' : 'Noia'}</td>
            <td><strong style="color: #FFD700; font-size: 1.2rem;">${student.puntos}</strong></td>
        `;
    });
}

// =============== ESTADÍSTICAS ===============
function updateStatistics() {
    const totalPoints = students.reduce((sum, s) => sum + s.puntos, 0);
    const avgPoints = students.length > 0 ? (totalPoints / students.length).toFixed(1) : 0;
    const boys = students.filter(s => s.genero === 'chico').length;
    const girls = students.filter(s => s.genero === 'chica').length;
    
    document.getElementById('totalStudents').textContent = students.length;
    document.getElementById('totalPoints').textContent = totalPoints;
    document.getElementById('averagePoints').textContent = avgPoints;
    
    // Gráfico de puntos
    updatePointsChart(students, totalPoints);
    
    // Gráfico de género
    updateGenderChart(boys, girls);
}

function updatePointsChart(data, total) {
    const ctx = document.getElementById('pointsChart');
    if (!ctx) return;
    
    // Destruir gráfico anterior si existe
    if (chartsInstances.pointsChart) {
        chartsInstances.pointsChart.destroy();
    }
    
    chartsInstances.pointsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(s => s.nombre.substring(0, 10)),
            datasets: [{
                label: 'Punts',
                data: data.map(s => s.puntos),
                backgroundColor: '#FFD700',
                borderColor: '#B8860B',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: true }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function updateGenderChart(boys, girls) {
    const ctx = document.getElementById('genderChart');
    if (!ctx) return;
    
    // Destruir gráfico anterior si existe
    if (chartsInstances.genderChart) {
        chartsInstances.genderChart.destroy();
    }
    
    chartsInstances.genderChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Nois', 'Noies'],
            datasets: [{
                data: [boys, girls],
                backgroundColor: ['#DC143C', '#FFD700'],
                borderColor: '#B8860B',
                borderWidth: 2
            }]
        }
    });
}

// =============== TEMAS Y PERSONALIZACIONES ===============
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
}

function toggleVolume() {
    const btn = document.getElementById('volume-toggle');
    btn.classList.toggle('muted');
    const slider = document.getElementById('volumeSlider');
    if (slider) {
        slider.value = btn.classList.contains('muted') ? 0 : 50;
        updateVolume(slider.value);
    }
}

function updateFontSize() {
    const size = document.getElementById('fontSizeSelect').value;
    document.body.className = document.body.className.replace(/font-\w+/g, '') + ` font-${size}`;
    localStorage.setItem('fontSize', size);
}

function updateFontFamily() {
    const family = document.getElementById('fontFamilySelect').value;
    document.body.style.fontFamily = family;
    localStorage.setItem('fontFamily', family);
}

function updateTitle() {
    const newTitle = document.getElementById('titleCustom').value;
    const titleEl = document.querySelector('.golden-title');
    if (titleEl) {
        titleEl.textContent = newTitle;
        localStorage.setItem('appTitle', newTitle);
    }
}

function updateMotto() {
    const newMotto = document.getElementById('mottoCustom').value;
    const mottoEl = document.querySelector('.motto');
    if (mottoEl) {
        mottoEl.textContent = `"${newMotto}"`;
        localStorage.setItem('appMotto', newMotto);
    }
}

function updateColors() {
    const primaryColor = document.getElementById('primaryColor').value;
    const bgColor = document.getElementById('bgColor').value;
    
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    document.documentElement.style.setProperty('--bg-dark', bgColor);
    
    localStorage.setItem('primaryColor', primaryColor);
    localStorage.setItem('bgColor', bgColor);
}

// =============== CARGAR CONFIGURACIONES ===============
function loadSettings() {
    // Tema
    const theme = localStorage.getItem('theme');
    if (theme === 'light') {
        document.body.classList.add('light-theme');
    }
    
    // Tamaño de fuente
    const fontSize = localStorage.getItem('fontSize');
    if (fontSize) {
        const select = document.getElementById('fontSizeSelect');
        if (select) {
            select.value = fontSize;
            updateFontSize();
        }
    }
    
    // Tipo de fuente
    const fontFamily = localStorage.getItem('fontFamily');
    if (fontFamily) {
        const select = document.getElementById('fontFamilySelect');
        if (select) {
            select.value = fontFamily;
            updateFontFamily();
        }
    }
    
    // Título
    const title = localStorage.getItem('appTitle');
    if (title) {
        const input = document.getElementById('titleCustom');
        if (input) input.value = title;
        updateTitle();
    }
    
    // Lema
    const motto = localStorage.getItem('appMotto');
    if (motto) {
        const input = document.getElementById('mottoCustom');
        if (input) input.value = motto;
        updateMotto();
    }
    
    // Brillo
    const brightness = localStorage.getItem('brightness');
    if (brightness) {
        const slider = document.getElementById('brightnessSlider');
        if (slider) {
            slider.value = brightness;
            document.body.style.filter = `brightness(${brightness}%)`;
        }
    }
    
    // Volumen
    const volume = localStorage.getItem('volume');
    if (volume) {
        const slider = document.getElementById('volumeSlider');
        if (slider) {
            slider.value = volume;
            document.getElementById('volumeValue').textContent = volume + '%';
        }
    }
    
    // Colores
    const primaryColor = localStorage.getItem('primaryColor');
    if (primaryColor) {
        const input = document.getElementById('primaryColor');
        if (input) input.value = primaryColor;
    }
    
    const bgColor = localStorage.getItem('bgColor');
    if (bgColor) {
        const input = document.getElementById('bgColor');
        if (input) input.value = bgColor;
    }
}

// =============== EXPORTAR DATOS ===============
function exportData() {
    const dataStr = JSON.stringify(students, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `academiagondor-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    alert('Datos exportados correctamente');
}

// =============== REINICIAR DATOS ===============
function resetData() {
    if (confirm('¿Estás seguro de que quieres reiniciar TODOS los datos? Esta acción NO se puede deshacer.')) {
        if (confirm('¿Estás completamente seguro? ¡Se perderán todos los puntos de los alumnos!')) {
            students = [];
            localStorage.clear();
            location.reload();
        }
    }
}
