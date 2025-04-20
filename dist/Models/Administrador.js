"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);
var _bcrypt = require('bcrypt'); var _bcrypt2 = _interopRequireDefault(_bcrypt);

/* Neste arquivo realizamos a condifgurações das colunas de dados da nossa tabela
Sua função envolve a validação de dado inputado, assim como o manuseio da senha que será enviada ao banco de dados via Hash,
o hook abaixo irá manipular uma variável virutal(não tem no banco de dados, somente no ambiente abaixo), onde sua função é armazenar a senha enviada
pelo usuário, a qual será transformada em hash com esse hook que irá realizar esse procedimento antes de salvar o usuário no banco de dados.
*/

 class Administrador extends _sequelize.Model {
  static init(sequelize) {
    super.init({
      nome: {
        defaultValue: '',
        validate: {
          len: {
            args: [3, 255],
            msg: 'Campo nome deve ter entre 3 a 255 caracteres',
          },
        },
        type: _sequelize2.default.STRING,
      },
      email: {
        defaultValue: '',
        unique: {
          msg: 'Email já existe',
        },
        validate: {
          isEmail: {
            msg: 'Campo e-mail inválido',
          },
        },
        type: _sequelize2.default.STRING,
      },
      password_hash: {
        defaultValue: '',
        type: _sequelize2.default.INTEGER,
      },
      password: {
        defaultValue: '',
        validate: {
          len: {
            args: [6, 50],
            msg: 'Campo senha deve ter entre 6 a 50 caracteres',
          },
        },
        type: _sequelize2.default.VIRTUAL,
      },
    }, {
      sequelize,
      tableName: 'administrador',
    });

    this.addHook('beforeSave', async (usuario) => {
      if (usuario.password) {
        usuario.password_hash = await _bcrypt2.default.hash(usuario.password, 8);
      }
    });

    return this;
  }

  // Função responsável por realizar a validação do usuário.
  passwordIsValida(password) {
    return _bcrypt2.default.compare(password, this.password_hash);
  }
} exports.default = Administrador;
