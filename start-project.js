const { exec } = require('child_process');

// Asegúrate de que las barras invertidas estén escapadas correctamente en la ruta de Windows
const serverProcess = exec('npm start', { cwd: 'C:\\Users\\nmart\\repos\\proyectos\\react_apps\\nmtech_v1' });

// Muestra la salida del servidor en la consola
serverProcess.stdout.on('data', (data) => {
  console.log(data.toString());
});

serverProcess.stderr.on('data', (data) => {
  console.error(data.toString());
});

serverProcess.on('close', (code) => {
  console.log(`El servidor React se cerró con el código ${code}`);
});

// Usa `import()` dinámico para importar `open`
setTimeout(async () => {
  console.log('Abriendo el navegador en http://localhost:3000...');
  const open = (await import('open')).default;
  open('http://localhost:3000');
}, 10000); // Ajusta el tiempo según la velocidad de inicio de tu servidor

// Evita que el script termine inmediatamente
setTimeout(() => {
  console.log('Presiona Ctrl + C para salir.');
}, 60000);
