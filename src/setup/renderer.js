// Escuchar el evento 'submit' del formulario
document.getElementById('setupForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevenir el envío tradicional del formulario

    // Obtener los valores de los inputs
    const DBhost = document.getElementById('DBhost').value;
    const DBport = document.getElementById('DBport').value;
    const DBname = document.getElementById('DBname').value;
    const DBuser = document.getElementById('DBuser').value;
    const DBpassword = document.getElementById('DBpassword').value;
    const apiBaseUrl = document.getElementById('apiBaseUrl').value;
    const submitBtn = document.getElementById('submitBtn');
    const messageDiv = document.getElementById('message');

    // Validación simple
    if (!DBhost || !DBport || !DBname || !DBuser || !DBpassword || !apiBaseUrl) {
        messageDiv.textContent = 'Por favor, completa todos los campos.';
        messageDiv.className = 'message error';
        return;
    }

    // Deshabilitar botón para evitar múltiples envíos
    submitBtn.disabled = true;
    submitBtn.textContent = 'Guardando...';

    try {
        const config = {
            DBhost,
            DBport: parseInt(DBport, 10),
            DBname,
            DBuser,
            DBpassword,
            apiBaseUrl
        };

        // Llamar a la API expuesta en preload.js (window.api.saveConfig)
        // Esto envía los datos al proceso principal (main.js)
        const result = await window.api.saveConfig(config);

        if (result.success) {
            messageDiv.textContent = 'Configuración guardada correctamente. Iniciando...';
            messageDiv.className = 'message success';
            // El proceso principal se encargará de cerrar esta ventana y abrir la app principal
        } else {
            throw new Error(result.error || 'Error desconocido al guardar.');
        }

    } catch (error) {
        console.error(error);
        messageDiv.textContent = 'Error: ' + error.message;
        messageDiv.className = 'message error';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Guardar y Continuar';
    }
});
