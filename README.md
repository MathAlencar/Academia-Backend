Academia-Backend é uma API RESTful desenvolvida em Node.js voltada para o gerenciamento de academias, construída com foco em escalabilidade, segurança e boas práticas de desenvolvimento.

Ela utiliza bibliotecas modernas e consolidadas no ecossistema JavaScript para entregar um backend robusto, modular e preparado para integrações com sistemas web ou mobile.

Bibliotecas utilizadas ->

Express – Framework minimalista e flexível para construção de APIs HTTP.
Sequelize – ORM poderoso para interação com bancos de dados relacionais, utilizado aqui com MariaDB.
Sequelize CLI – Facilita a geração de models, migrations e seeders.
JWT (jsonwebtoken) – Gerenciamento de autenticação segura via tokens.
Bcrypt – Criptografia de senhas para segurança dos usuários.
Multer – Middleware para upload de arquivos (imagens, documentos etc.).
Dotenv – Gerenciamento de variáveis de ambiente.
Nodemon – Monitoramento de alterações para recarregar automaticamente o servidor em desenvolvimento.
Sucrase – Transpilador leve para uso de features modernas de JavaScript sem overhead desnecessário.

Funcionalidades Possíveis (adaptável ao escopo do projeto) ->

Cadastro e autenticação de usuários (com JWT e senha criptografada)
Gestão de alunos, planos, treinos e horários
Upload de arquivos (ex: fotos de perfil ou documentos)
Relatórios e integração com frontend/mobile
