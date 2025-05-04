import jwt from 'jsonwebtoken';
import Personal from '../../Models/Personal';

class TokenControllersPersonal {
  async store(req, res) {
    try {
      const { email = '', password = '' } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          errors: ['Credenciais inválidas'],
        });
      }

      const user = await Personal.findOne({ where: { email } });

      if (!user) {
        return res.status(400).json({
          errors: ['Credenciais inválidas'],
        });
      }

      if (!(await user.passwordIsValida(password))) {
        return res.status(400).json({
          errors: ['Usuário inválido'],
        });
      }

      const { id } = user;

      const token = jwt.sign({ id, email }, process.env.TOKEN_SECRET_USER, {
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

export default new TokenControllersPersonal();
