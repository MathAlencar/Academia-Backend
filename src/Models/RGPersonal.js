import Sequelize, { Model } from 'sequelize';
import appConfig from '../config/appConfig';

export default class RgPersonal extends Model {
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
      status: {
        type: Sequelize.ENUM('Aprovado', 'Validação', "Negado"),
        allowNull: false,
        defaultValue: 'Validação',
        validate: {
            isIn: {
                args: [['Aprovado', 'Validação', 'Negado']],
                msg: 'Status deve ser "Aprovado", "Validação" ou "Negado".',
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
      tableName: 'documento_pessoal_RG',
    });
    
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Personal, { foreignKey: 'personal_id' });
  }
}
