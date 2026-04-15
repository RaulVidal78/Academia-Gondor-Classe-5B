// ==========================================
// TAB NAVIGATION - Academia Gondor 5B
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    setupTabNavigation();
});

function setupTabNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Obtener la pestaña activa
            const tabName = this.getAttribute('data-tab');
            
            // Remover clase active de todos los links y pestañas
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
            
            // Añadir clase active al link y pestaña actual
            this.classList.add('active');
            document.getElementById(tabName).classList.add('active');
            
            // Ejecutar funciones específicas de cada pestaña
            onTabChange(tabName);
        });
    });
}

function onTabChange(tabName) {
    switch(tabName) {
        case 'dashboard':
            renderDashboard();
            break;
        case 'ranking':
            updateRanking();
            break;
        case 'statistics':
            updateStatistics();
            break;
        case 'recruitment':
            renderStudentsList();
            break;
        default:
            break;
    }
}
