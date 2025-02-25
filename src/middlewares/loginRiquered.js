import jwt from 'jsonwebtoken'; // Importanto a biblioteca para validação do token.

// Exportando a função que irá fazer a vaidação do meu token.

export default (req, res, next) => {
  const { authorization } = req.headers; // recebendo o meu token que vem do header

  // Caso for falso ele irá reorna ruma mensagem ao usuário.
  if (!authorization) {
    return res.status(401).json({
      errors: ['Login required'],
    });
  }

  // Separando o texto do token ou seja o  bearer do próprio token.
  const [, token] = authorization.split(' ');

  // Fazendo um try catch, onde ele irá verificar se o token é valido ou não, caso não ele irá receber uma mensagem e cairá no catch
  try {
    // usando o metódo da classe jwt para realizar a validação do token enviado pelo usuário.
    const dados = jwt.verify(token, process.env.TOKEN_SECRET); // Aqui ele irá retornar os dados do usuário, que será retirado do prórpio token
    const { id, email } = dados; // realizando a desestruturação do objeto.

    // Aqui quando for passar para o próxima requisição, esses dados já estarão sendo enviados tbm.
    req.userId = id;
    req.userEmail = email;

    return next(); // next para a próxima requisição.
  } catch (e) {
    return res.status(401).json({
      errors: ['Token expirado ou inválido'],
    });
  }
};
