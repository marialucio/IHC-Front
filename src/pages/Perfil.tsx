import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../components/DashboardLayout'
import { ItemCard } from '../components/ItemCard'
import { useApp } from '../context/AppContext'
import type { Item, TrocaStatus } from '../types'
import './Perfil.css'

type Secao = 'itens' | 'trocas'
type FiltroTroca = 'todas' | TrocaStatus

/**
 * Frames 2 e 6 — área direita do perfil.
 * Select alterna entre "Seus itens" (Frame 2) e "Minhas trocas" (Frame 6).
 * Em "Minhas trocas" aparecem os filtros Finalizado / Em espera ao lado do select.
 */
export function Perfil() {
  const { meusItens, trocas, removeItem } = useApp()
  const navigate = useNavigate()
  const [secao, setSecao] = useState<Secao>('itens')
  const [filtro, setFiltro] = useState<FiltroTroca>('todas')

  const trocasFiltradas = useMemo(() => {
    if (filtro === 'todas') return trocas
    return trocas.filter((t) => t.status === filtro)
  }, [filtro, trocas])

  // Trocas viram itens visuais (mesmo card de "Seus itens").
  const trocasComoItens: Item[] = trocasFiltradas.map((t) => ({
    id: t.id,
    titulo: t.itemTitulo,
    descricao: t.descricao,
    imagem: t.itemImagem,
    dono: '',
  }))

  return (
    <DashboardLayout>
      <div className="secao-toolbar">
        <div className="secao-select">
          <select
            value={secao}
            onChange={(e) => {
              setSecao(e.target.value as Secao)
              setFiltro('todas')
            }}
            aria-label="Selecionar seção"
          >
            <option value="itens">Seus itens</option>
            <option value="trocas">Minhas trocas</option>
          </select>
          <span className="secao-select__chevron" aria-hidden>
            ⌄
          </span>
        </div>

        {secao === 'trocas' && (
          <div className="troca-chips">
            <button
              className={`chip ${filtro === 'finalizado' ? 'chip--finalizado' : ''}`}
              onClick={() =>
                setFiltro((f) => (f === 'finalizado' ? 'todas' : 'finalizado'))
              }
            >
              Finalizado
            </button>
            <button
              className={`chip ${filtro === 'em_espera' ? 'chip--espera' : ''}`}
              onClick={() =>
                setFiltro((f) => (f === 'em_espera' ? 'todas' : 'em_espera'))
              }
            >
              Em espera
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-itens">
        {secao === 'itens'
          ? meusItens.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                variant="meu"
                showOwnerActions
                onEdit={() => navigate('/cadastrar-item')}
                onDelete={(i) => removeItem(i.id)}
              />
            ))
          : trocasComoItens.map((item) => (
              <ItemCard key={item.id} item={item} variant="meu" showOwnerActions />
            ))}
      </div>
    </DashboardLayout>
  )
}
