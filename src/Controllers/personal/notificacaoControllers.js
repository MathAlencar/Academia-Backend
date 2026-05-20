import NotificacaoService from '../../services/notificacao/notificacao_service.js';

class NotificacaoControllers {
  async index(req, res) {
    try {
      const resultado = await NotificacaoService.listarDoPersonal(
        req.userID,
        req.query,
      );

      return res.status(200).json(resultado);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors?.map((err) => err.message) || [e.message],
      });
    }
  }

  async marcarComoLida(req, res) {
    try {
      const notificacao = await NotificacaoService.marcarComoLidaDoPersonal(
        req.userID,
        req.params.id,
      );

      if (!notificacao) {
        return res.status(404).json({
          errors: ['Notificação não encontrada'],
        });
      }

      return res.status(200).json(notificacao);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors?.map((err) => err.message) || [e.message],
      });
    }
  }
}

export default new NotificacaoControllers();
