import app from './App'; // Ele já está sendo exportado e executado ao mesmo tempo.

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`O App está rodando na porta ${port}...`);
});
