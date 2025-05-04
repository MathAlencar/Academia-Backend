import Sequelize, { Model } from 'sequelize';

export default class Enderecos extends Model {
  static init(sequelize) {
    super.init({
      aluno_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      personal_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      rua: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [3, 255],
            msg: ['Rua informada inválida'],
          },
        },
      },
      numero: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          len: {
            args: [3, 255],
            msg: ['Rua informada inválida'],
          },
        },
      },
      complemento: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          len: {
            args: [2, 255],
            msg: ['Complemento informada inválida'],
          },
        },
      },
      bairro: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [3, 255],
            msg: ['Bairro informada inválida'],
          },
        },
      },
      cidade: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [3, 255],
            msg: ['Cidade informada inválida'],
          },
        },
      },
      estado: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [3, 255],
            msg: ['Estado informada inválida'],
          },
        },
      },
      cep: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [9, 9],
            msg: ['Cep informado inválida'],
          },
        },
      },
    }, {
      sequelize,
      tableName: 'enderecos',
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Personal, { foreignKey: 'personal_id' });
    this.belongsTo(models.Alunos, { foreignKey: 'aluno_id' });
  }
}
