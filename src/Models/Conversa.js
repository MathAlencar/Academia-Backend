import { Model, DataTypes } from 'sequelize';

export default class Conversa extends Model {
  static init(sequelize) {
    super.init({
      usuario1_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tipo_usuario1: {
        type: DataTypes.ENUM('aluno', 'personal'),
        allowNull: false,
      },
      usuario2_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tipo_usuario2: {
        type: DataTypes.ENUM('aluno', 'personal'),
        allowNull: false,
      },
    }, {
      sequelize,
      tableName: 'conversas',
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Alunos, {
      foreignKey: 'usuario1_id',
      as: 'aluno_1',
      constraints: false,
    });

    this.belongsTo(models.Alunos, {
      foreignKey: 'usuario2_id',
      as: 'aluno_2',
      constraints: false,
    });

    this.belongsTo(models.Personal, {
      foreignKey: 'usuario1_id',
      as: 'personal_1',
      constraints: false,
    });

    this.belongsTo(models.Personal, {
      foreignKey: 'usuario2_id',
      as: 'personal_2',
      constraints: false,
    });

    this.hasMany(models.Mensagem, {
      foreignKey: 'conversa_id',
      as: 'mensagens',
    });
  }
}
