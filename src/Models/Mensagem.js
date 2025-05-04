import { Model, DataTypes } from 'sequelize';

export default class Mensagem extends Model {
  static init(sequelize) {
    super.init({
      remetente_id: DataTypes.INTEGER,
      tipo_remetente: DataTypes.ENUM('aluno', 'personal'),
      conteudo: DataTypes.TEXT,
    }, {
      sequelize,
      tableName: 'mensagens',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Conversa, { foreignKey: 'conversa_id' });
  }
}
