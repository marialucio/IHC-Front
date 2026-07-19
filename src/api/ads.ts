import { BffApiError, sendWsRequest } from './wsClient'

interface BackendAd {
	id: string
	title: string
	description: string
	is_available?: boolean
	owner_id?: string
	owner_name?: string
	image?: string
	image_position?: string | null
	category?: string
	condition?: string
	location?: string
	trade_terms?: string | null
}

export interface CreateOrUpdateAdParams {
	title: string
	description: string
	image: string
	image_position?: string
	category: string
	condition: string
	location: string
	trade_terms?: string
}

function parseErrorReason(payload: unknown) {
	if (!payload || typeof payload !== 'object') return undefined
	const reason = (payload as { reason?: unknown }).reason
	return typeof reason === 'string' ? reason : undefined
}

function ensureListPayload(payload: unknown): BackendAd[] {
	return Array.isArray(payload) ? (payload as BackendAd[]) : []
}

export async function listAvailableAds(token: string): Promise<BackendAd[]> {
	const response = await sendWsRequest(
		{
			tipo: 'Consulta',
			topico: 'ads.anuncio.consultar_disponiveis',
			payload: {},
		},
		{ token },
	)

	if (response.topico.endsWith('_nao_autorizado')) {
		throw new BffApiError('Sessao nao autorizada.', response.topico, parseErrorReason(response.payload))
	}

	if (response.topico !== 'ads.anuncio.disponiveis_listados') {
		throw new BffApiError('Resposta inesperada ao listar catalogo.', response.topico, parseErrorReason(response.payload))
	}

	return ensureListPayload(response.payload)
}

export async function listMyAds(token: string): Promise<BackendAd[]> {
	const response = await sendWsRequest(
		{
			tipo: 'Consulta',
			topico: 'ads.anuncio.consultar_proprios',
			payload: {},
		},
		{ token },
	)

	if (response.topico.endsWith('_nao_autorizado')) {
		throw new BffApiError('Sessao nao autorizada.', response.topico, parseErrorReason(response.payload))
	}

	if (response.topico !== 'ads.anuncio.listado') {
		throw new BffApiError('Resposta inesperada ao listar seus itens.', response.topico, parseErrorReason(response.payload))
	}

	return ensureListPayload(response.payload)
}

export async function createAd(token: string, params: CreateOrUpdateAdParams): Promise<BackendAd> {
	const response = await sendWsRequest(
		{
			tipo: 'Comando',
			topico: 'ads.anuncio.criar',
			payload: {
				...params,
			},
		},
		{ token },
	)

	if (response.topico.endsWith('_nao_autorizado')) {
		throw new BffApiError('Sessao nao autorizada.', response.topico, parseErrorReason(response.payload))
	}

	if (response.topico !== 'ads.anuncio.criado') {
		throw new BffApiError('Resposta inesperada ao criar item.', response.topico, parseErrorReason(response.payload))
	}

	return response.payload as BackendAd
}

export async function updateAd(token: string, id: string, params: CreateOrUpdateAdParams): Promise<BackendAd> {
	const response = await sendWsRequest(
		{
			tipo: 'Comando',
			topico: 'ads.anuncio.atualizar',
			payload: {
				id,
				...params,
			},
		},
		{ token },
	)

	if (response.topico.endsWith('_nao_autorizado')) {
		throw new BffApiError('Sessao nao autorizada.', response.topico, parseErrorReason(response.payload))
	}

	if (response.topico === 'ads.anuncio.operacao_falhou') {
		throw new BffApiError('Nao foi possivel atualizar item.', response.topico, parseErrorReason(response.payload))
	}

	if (response.topico !== 'ads.anuncio.atualizado') {
		throw new BffApiError('Resposta inesperada ao atualizar item.', response.topico, parseErrorReason(response.payload))
	}

	return response.payload as BackendAd
}

export async function deleteAd(token: string, id: string): Promise<void> {
	const response = await sendWsRequest(
		{
			tipo: 'Comando',
			topico: 'ads.anuncio.remover',
			payload: { id },
		},
		{ token },
	)

	if (response.topico.endsWith('_nao_autorizado')) {
		throw new BffApiError('Sessao nao autorizada.', response.topico, parseErrorReason(response.payload))
	}

	if (response.topico === 'ads.anuncio.operacao_falhou') {
		throw new BffApiError('Nao foi possivel remover item.', response.topico, parseErrorReason(response.payload))
	}

	if (response.topico !== 'ads.anuncio.removido') {
		throw new BffApiError('Resposta inesperada ao remover item.', response.topico, parseErrorReason(response.payload))
	}
}

export async function searchAvailableAds(token: string, q: string): Promise<BackendAd[]> {
	const response = await sendWsRequest(
		{
			tipo: 'Consulta',
			topico: 'ads.anuncio.buscar',
			payload: { q },
		},
		{ token },
	)

	if (response.topico.endsWith('_nao_autorizado')) {
		throw new BffApiError('Sessao nao autorizada.', response.topico, parseErrorReason(response.payload))
	}

	if (response.topico !== 'ads.anuncio.busca_concluida') {
		throw new BffApiError('Resposta inesperada ao buscar no catalogo.', response.topico, parseErrorReason(response.payload))
	}

	return ensureListPayload(response.payload)
}

export async function favoriteAd(token: string, adId: string): Promise<void> {
	const response = await sendWsRequest(
		{
			tipo: 'Comando',
			topico: 'ads.anuncio.favoritar',
			payload: { ad_id: adId },
		},
		{ token },
	)

	if (response.topico.endsWith('_nao_autorizado')) {
		throw new BffApiError('Sessao nao autorizada.', response.topico, parseErrorReason(response.payload))
	}

	if (response.topico === 'ads.anuncio.operacao_falhou') {
		throw new BffApiError('Nao foi possivel favoritar agora.', response.topico, parseErrorReason(response.payload))
	}

	if (response.topico !== 'ads.anuncio.favoritado') {
		throw new BffApiError('Resposta inesperada ao favoritar item.', response.topico, parseErrorReason(response.payload))
	}
}

export async function unfavoriteAd(token: string, adId: string): Promise<void> {
	const response = await sendWsRequest(
		{
			tipo: 'Comando',
			topico: 'ads.anuncio.desfavoritar',
			payload: { ad_id: adId },
		},
		{ token },
	)

	if (response.topico.endsWith('_nao_autorizado')) {
		throw new BffApiError('Sessao nao autorizada.', response.topico, parseErrorReason(response.payload))
	}

	if (response.topico === 'ads.anuncio.operacao_falhou') {
		throw new BffApiError('Nao foi possivel desfavoritar agora.', response.topico, parseErrorReason(response.payload))
	}

	if (response.topico !== 'ads.anuncio.desfavoritado') {
		throw new BffApiError('Resposta inesperada ao desfavoritar item.', response.topico, parseErrorReason(response.payload))
	}
}

export async function listFavoriteAdIds(token: string): Promise<string[]> {
	const response = await sendWsRequest(
		{
			tipo: 'Consulta',
			topico: 'ads.anuncio.consultar_favoritos',
			payload: {},
		},
		{ token },
	)

	if (response.topico.endsWith('_nao_autorizado')) {
		throw new BffApiError('Sessao nao autorizada.', response.topico, parseErrorReason(response.payload))
	}

	if (response.topico !== 'ads.anuncio.favoritos_listados') {
		throw new BffApiError('Resposta inesperada ao consultar favoritos.', response.topico, parseErrorReason(response.payload))
	}

	const payload = response.payload as { ad_ids?: unknown }
	const adIds = payload?.ad_ids
	return Array.isArray(adIds) ? adIds.filter((id): id is string => typeof id === 'string') : []
}

export type { BackendAd }
