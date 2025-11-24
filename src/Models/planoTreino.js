import Sequelize, { Model } from 'sequelize';

/*
Neste arquivo realizamos as configurações das colunas de dados da nossa tabela.
Sua função envolve a validação de dados inputados, assim como o manuseio da senha que será enviada ao banco de dados via Hash.
O hook abaixo irá manipular uma variável virtual (não salva no banco de dados), que armazenará a senha temporariamente.
*/

export default class planoTreino extends Model {
  static init(sequelize) {
    super.init({
      personal_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      aluno_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      data_inicio: {
        defaultValue: null,
        type: Sequelize.DATE,
      },
      data_fim: {
        defaultValue: null,
        type: Sequelize.DATE,
      },
      nome: {
        type: Sequelize.STRING,
        defaultValue: '',
      },
      status: {
        type: Sequelize.ENUM('Ativo', 'Concluido', 'Futuro'),
        allowNull: false,
        defaultValue: 'Ativo',
        validate: {
          isIn: {
            args: [['Ativo', 'Concluido', 'Futuro']],
            msg: 'Status deve ser "ativo", "concluido" ou "futuro".',
          },
        },
      },
      observacoes_gerais: {
        type: Sequelize.STRING,
        defaultValue: '',
      },
    }, {
      sequelize,
      tableName: 'planoTreino',
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Personal, { foreignKey: 'personal_id' });
    this.belongsTo(models.Alunos, { foreignKey: 'aluno_id' });
    this.hasMany(models.SessaoTreino, { foreignKey: 'plano_treino_id' });
  }
}
