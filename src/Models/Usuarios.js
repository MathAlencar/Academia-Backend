import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcrypt';

export default class Usuarios extends Model {
  static init(sequelize) {
    super.init({
      nome: {
        defaultValue: '',
        validate: { // Aqui você está usando a biblioteca padrão de validação do JS, sendo assim você está usando os seus métodos.
          len: { // Usando o método padrão para verificar o tamanho do input enviado do usuário
            args: [3, 255], // Aqui você está passando os argumentos ( tamanho minimo e máximo);
            msg: 'Campo nome deve ter entre 3 a 255 caracteres',
          },
        },
        type: Sequelize.STRING,
      },
      sobrenome: {
        defaultValue: '',
        validate: {
          len: {
            args: [3, 255],
            msg: 'Campo sobrenome deve ter entre 3 e 255 caracteres',
          },
        },
        type: Sequelize.STRING,
      },
      email: {
        defaultValue: '',
        unique: {
          msg: 'Email já existe',
        },
        validate: { // Aqui você está usando a biblioteca padrão de validação do JS, sendo assim você está usando os seus métodos.
          isEmail: { // Usando o método padrão para verificar o tamanho do input enviado do usuário
            msg: 'Campo e-mail inválido',
          },
        },
        type: Sequelize.STRING,
      },
      password_hash: {
        defaultValue: '',
        type: Sequelize.STRING,
      },
      password: {
        defaultValue: '',
        validate: { // Aqui você está usando a biblioteca padrão de validação do JS, sendo assim você está usando os seus métodos.
          len: { // Usando o método padrão para verificar o tamanho do input enviado do usuário
            args: [6, 50], // Aqui você está passando os argumentos ( tamanho minimo e máximo);
            msg: 'Campo senha deve ter entre 3 a 255 caracteres',
          },
        },
        type: Sequelize.VIRTUAL, // o VIRTUAL significa que ele é um campo que só existe neste ambiente, por tant não é enviado ao banco de dados.
      },
    }, {
      sequelize,
    });

    // Criando um hook que irá aribuir a senha ao campo de hash, o motivo é por conta do bcrypt, onde ele irá criptografar a senha.
    this.addHook('beforeSave', async (usuario) => {
      if (usuario.password) {
        usuario.password_hash = await bcrypt.hash(usuario.password, 8);
      }
    });

    return this;
  }

  // Função que realiza o compare da senha enviada com a senha do banco de dados, o this se referencia ao corpo, por conta disso o this.password_hash funciona.
  passwordIsValida(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}
