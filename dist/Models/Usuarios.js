"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);
var _bcrypt = require('bcrypt'); var _bcrypt2 = _interopRequireDefault(_bcrypt);

 class Usuarios extends _sequelize.Model {
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
        type: _sequelize2.default.STRING,
      },
      sobrenome: {
        defaultValue: '',
        validate: {
          len: {
            args: [3, 255],
            msg: 'Campo sobrenome deve ter entre 3 e 255 caracteres',
          },
        },
        type: _sequelize2.default.STRING,
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
        type: _sequelize2.default.STRING,
      },
      password_hash: {
        defaultValue: '',
        type: _sequelize2.default.STRING,
      },
      password: {
        defaultValue: '',
        validate: { // Aqui você está usando a biblioteca padrão de validação do JS, sendo assim você está usando os seus métodos.
          len: { // Usando o método padrão para verificar o tamanho do input enviado do usuário
            args: [6, 50], // Aqui você está passando os argumentos ( tamanho minimo e máximo);
            msg: 'Campo senha deve ter entre 3 a 255 caracteres',
          },
        },
        type: _sequelize2.default.VIRTUAL, // o VIRTUAL significa que ele é um campo que só existe neste ambiente, por tant não é enviado ao banco de dados.
      },
    }, {
      sequelize,
    });

    // Criando um hook que irá aribuir a senha ao campo de hash, o motivo é por conta do bcrypt, onde ele irá criptografar a senha.
    this.addHook('beforeSave', async (usuario) => {
      if (usuario.password) {
        usuario.password_hash = await _bcrypt2.default.hash(usuario.password, 8);
      }
    });

    return this;
  }

  // Função que realiza o compare da senha enviada com a senha do banco de dados, o this se referencia ao corpo, por conta disso o this.password_hash funciona.
  passwordIsValida(password) {
    return _bcrypt2.default.compare(password, this.password_hash);
  }
} exports.default = Usuarios;
