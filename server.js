const express = require('express');
const path = require('path');
const app = express();

// servir arquivos estáticos da sua pasta de build
app.use(express.static(path.join(__dirname, 'public')));

// rota catch‑all (caso use SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor pronto na porta ${PORT}`);
});
