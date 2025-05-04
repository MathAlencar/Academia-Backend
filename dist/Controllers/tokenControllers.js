Object.defineProperty(exports, '__esModule', { value: true }); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } const _jsonwebtoken = require('jsonwebtoken');

const _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);
const _Administrador = require('../Models/Administrador');

const _Administrador2 = _interopRequireDefault(_Administrador);

class TokenControllers {
  async store(req, res) {
    try {
      const { email = '', password = '' } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          errors: ['Credenciais inválidas'],
        });
      }

      const user = await _Administrador2.default.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({
          errors: ['Usuário não existe'],
        });
      }

      if (!(await user.passwordIsValida(password))) {
        return res.status(400).json({
          errors: ['Usuário inválido'],
        });
      }

      const { id } = user;
      const token = _jsonwebtoken2.default.sign({ id, email }, process.env.TOKEN_SECRET, {
        expiresIn: process.env.TOKEN_EXPIRATION,
      });

      return res.status(200).json({ token });
    } catch (e) {
      return res.status(400).json({
        errors: e,
      });
    }
  }
}

exports.default = new TokenControllers();
