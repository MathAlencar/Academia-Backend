import app from './App'; // Ele já está sendo exportado e executado ao mesmo tempo.

const port = 3010;

app.listen(port, () => {
  console.log(`O App está rodando na porta ${port}...`);
  console.log(`Clique: http://localhost:${port}`);
});
