import { BffApiError, sendWsRequest } from './wsClient'

interface RegisterPayload {
  id: string
  name: string
  email: string
  phone: string
}

interface LoginPayload {
  access_token: string
  token_type: string
}

interface ProfilePayload {
  id: string
  name: string
  email: string
  phone: string
}

export interface AuthProfile {
  id: string
  name: string
  email: string
  phone: string
}

export interface LoginResult {
  accessToken: string
  profile: AuthProfile
}

export interface UpdateProfileResult {
  profile: AuthProfile
  failed: boolean
}

function parseErrorReason(payload: unknown) {
  if (!payload || typeof payload !== 'object') return undefined
  const reason = (payload as { reason?: unknown }).reason
  return typeof reason === 'string' ? reason : undefined
}

export async function registerUser(params: {
  name: string
  email: string
  phone: string
  password: string
}): Promise<RegisterPayload> {
  const response = await sendWsRequest({
    tipo: 'Comando',
    topico: 'users.usuario.cadastrar',
    payload: params,
  })

  if (response.topico === 'users.usuario.cadastro_falhou') {
    throw new BffApiError('Falha no cadastro.', response.topico, parseErrorReason(response.payload))
  }

  if (response.topico !== 'users.usuario.cadastrado') {
    throw new BffApiError('Resposta inesperada ao cadastrar.', response.topico, parseErrorReason(response.payload))
  }

  return response.payload as RegisterPayload
}

export async function loginUser(params: {
  email: string
  password: string
}): Promise<LoginResult> {
  const authResponse = await sendWsRequest({
    tipo: 'Comando',
    topico: 'users.usuario.autenticar',
    payload: params,
  })

  if (authResponse.topico === 'users.usuario.autenticacao_falhou') {
    throw new BffApiError('Credenciais invalidas.', authResponse.topico, parseErrorReason(authResponse.payload))
  }

  if (authResponse.topico !== 'users.usuario.autenticado') {
    throw new BffApiError('Resposta inesperada ao autenticar.', authResponse.topico, parseErrorReason(authResponse.payload))
  }

  const loginPayload = authResponse.payload as LoginPayload

  if (!loginPayload.access_token || loginPayload.token_type !== 'bearer') {
    throw new BffApiError('Token de autenticacao invalido.', authResponse.topico)
  }

  const profileResponse = await sendWsRequest(
    {
      tipo: 'Consulta',
      topico: 'users.perfil.consultar',
      payload: {},
    },
    { token: loginPayload.access_token },
  )

  if (profileResponse.topico.endsWith('_nao_autorizado')) {
    throw new BffApiError('Sessao nao autorizada.', profileResponse.topico, parseErrorReason(profileResponse.payload))
  }

  if (profileResponse.topico !== 'users.perfil.encontrado') {
    throw new BffApiError('Resposta inesperada ao carregar perfil.', profileResponse.topico, parseErrorReason(profileResponse.payload))
  }

  const profile = profileResponse.payload as ProfilePayload

  return {
    accessToken: loginPayload.access_token,
    profile: {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
    },
  }
}

export async function updateProfileUser(params: {
  token: string
  name: string
  email: string
  phone: string
}): Promise<UpdateProfileResult> {
  const response = await sendWsRequest(
    {
      tipo: 'Comando',
      topico: 'users.perfil.atualizar',
      payload: {
        name: params.name,
        email: params.email,
        phone: params.phone,
      },
    },
    { token: params.token },
  )

  if (response.topico.endsWith('_nao_autorizado')) {
    throw new BffApiError('Sessao nao autorizada.', response.topico, parseErrorReason(response.payload))
  }

  if (response.topico === 'users.perfil.atualizacao_falhou') {
    return {
      failed: true,
      profile: {
        id: '',
        name: params.name,
        email: params.email,
        phone: params.phone,
      },
    }
  }

  if (response.topico !== 'users.perfil.atualizado') {
    throw new BffApiError('Resposta inesperada ao atualizar perfil.', response.topico, parseErrorReason(response.payload))
  }

  const profile = response.payload as ProfilePayload

  return {
    failed: false,
    profile: {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
    },
  }
}
