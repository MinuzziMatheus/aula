jest.mock('../../src/models/usuarioModel', () => ({
  listarTodos: jest.fn(),
  buscarPorId: jest.fn(),
  criar: jest.fn()
}));

const usuarioModel = require('../../src/models/usuarioModel');
const usuarioService = require('../../src/services/usuarioService');

describe('usuarioService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('10. deve listar usuarios', async () => {
    const usuarios = [{ id: 1, nome: 'Admin' }];
    usuarioModel.listarTodos.mockResolvedValue(usuarios);

    const resultado = await usuarioService.listarUsuarios();

    expect(usuarioModel.listarTodos).toHaveBeenCalled();
    expect(resultado).toEqual(usuarios);
  });

  test('11. deve rejeitar id de usuario invalido', async () => {
    await expect(usuarioService.buscarUsuarioPorId(-1)).rejects.toMatchObject({
      message: 'Id de usuario invalido.'
    });
  });

  test('12. deve retornar erro quando usuario nao existir', async () => {
    usuarioModel.buscarPorId.mockResolvedValue(null);

    await expect(usuarioService.buscarUsuarioPorId(1)).rejects.toMatchObject({
      message: 'Usuario nao encontrado.'
    });
  });

  test('13. deve validar payload obrigatorio ao criar usuario', async () => {
    await expect(
      usuarioService.criarUsuario({
        login: 'admin',
        senha: '123456',
        situacao: 'ATIVO'
      })
    ).rejects.toMatchObject({
      message: 'O campo nome e obrigatorio.'
    });
  });

  test('14. deve criar usuario com sucesso', async () => {
    const payload = {
      nome: 'Administrador',
      login: 'admin',
      senha: '123456',
      situacao: 'ATIVO'
    };
    const usuario = { id: 1, ...payload };
    usuarioModel.criar.mockResolvedValue(usuario);

    const resultado = await usuarioService.criarUsuario(payload);

    expect(usuarioModel.criar).toHaveBeenCalledWith(payload);
    expect(resultado).toEqual(usuario);
  });
});
