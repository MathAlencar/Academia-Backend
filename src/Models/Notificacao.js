import Sequelize, { Model } from 'sequelize';

export default class Notificacao extends Model {
  static init(sequelize) {
    super.init({
      destinatario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      tipo_destinatario: {
        type: Sequelize.ENUM('aluno', 'personal', 'admin'),
        allowNull: false,
      },
      tipo: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      titulo: {
        type: Sequelize.STRING(120),
        allowNull: false,
      },
      mensagem: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      entidade_tipo: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      entidade_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      dados: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      lida_em: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    }, {
      sequelize,
      tableName: 'notificacoes',
    });

    return this;
  }
}
