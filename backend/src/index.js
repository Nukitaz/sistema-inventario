const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/api', (req, res) => {
  res.json({ status: "OK", message: "API de Inventario lista" });
});

app.listen(port, () => {
  console.log(`Backend escuchando en el puerto ${port}`);
});
