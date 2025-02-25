import Aluno from '../Models/Alunos';

class Homeconstrollers {
  async index(req, res) {
    const newAluno = await Aluno.create({
      nome: 'Matheus',
      sobrenome: 'nascimento',
      email: 'matheus@gmail.com',
      peso: 67,
      idade: 22,
      altura: 1.75,
    });
    res.json(newAluno);
  }
}

export default new Homeconstrollers();
