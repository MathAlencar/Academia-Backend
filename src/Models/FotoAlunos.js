import Sequelize, { Model } from 'sequelize';
import appConfig from '../config/appConfig';

export default class AlunoFoto extends Model {
  static init(sequelize) {
    super.init({
      originalname: {
        type: Sequelize.STRING,
        defaultValue: '',
        validate: {
          notEmpty: {
            msg: 'Campo não pode ficar vazio',
          },
        },
      },
      filename: {
        type: Sequelize.STRING,
        defaultValue: '',
        validate: {
          notEmpty: {
            msg: 'Campo não pode ficar vazio',
          },
        },
      },
      url: {
        type: Sequelize.VIRTUAL,
        get() {
          return `${appConfig.url}/images/${this.getDataValue('filename')}`;
        },
      },
    }, {
      sequelize,
      tableName: 'alunosFotos',
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Alunos, { foreignKey: 'aluno_id' });
    this.belongsTo(models.Conversa, { foreignKey: 'usuario1_id' });
  }
}
