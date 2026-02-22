'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { callAIAgent } from '@/lib/aiAgent'
import parseLLMJson from '@/lib/jsonParser'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import {
  FiHome,
  FiSearch,
  FiHeart,
  FiGrid,
  FiSun,
  FiMoon,
  FiStar,
  FiGift,
  FiUsers,
  FiBookOpen,
  FiSmile,
  FiMusic,
  FiZap,
  FiShare2,
  FiDownload,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
  FiArrowLeft,
  FiImage,
} from 'react-icons/fi'
import { FaHeart, FaRegHeart } from 'react-icons/fa'

// ─── Constants ───────────────────────────────────────────────────────
const AGENT_ID = '699a74a9c2eec05acd279d41'
const IMAGE_AGENT_ID = '699a77b7b0da46f6ada21c31'
const FAVORITES_KEY = 'frases-favoritos'

// ─── Types ───────────────────────────────────────────────────────────
interface Phrase {
  id: string
  text: string
  categoria: string
  emoji: string
  isNew?: boolean
  isAIGenerated?: boolean
  imageUrl?: string
  gradientIndex: number
  createdAt: number
}

interface Category {
  name: string
  icon: React.ReactNode
  description: string
}

// ─── Card Gradients ──────────────────────────────────────────────────
const CARD_GRADIENTS = [
  'linear-gradient(135deg, #e84393 0%, #fd79a8 100%)',
  'linear-gradient(135deg, #e17055 0%, #fab1a0 100%)',
  'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
  'linear-gradient(135deg, #be123c 0%, #9f1239 100%)',
  'linear-gradient(135deg, #fda4af 0%, #fff1f2 100%)',
  'linear-gradient(135deg, #d4a574 0%, #e8a87c 100%)',
]

const CARD_TEXT_COLORS = [
  'text-white',
  'text-white',
  'text-white',
  'text-white',
  'text-rose-900',
  'text-white',
]

// ─── Categories ──────────────────────────────────────────────────────
const CATEGORIES: Category[] = [
  { name: 'Bom Dia', icon: <FiSun className="w-4 h-4" />, description: 'Frases de bom dia' },
  { name: 'Boa Noite', icon: <FiMoon className="w-4 h-4" />, description: 'Frases de boa noite' },
  { name: 'Amor', icon: <FiHeart className="w-4 h-4" />, description: 'Frases de amor' },
  { name: 'Fe', icon: <FiStar className="w-4 h-4" />, description: 'Frases de fe' },
  { name: 'Aniversario', icon: <FiGift className="w-4 h-4" />, description: 'Frases de aniversario' },
  { name: 'Amizade', icon: <FiUsers className="w-4 h-4" />, description: 'Frases de amizade' },
  { name: 'Familia', icon: <FiHome className="w-4 h-4" />, description: 'Frases de familia' },
  { name: 'Reflexao', icon: <FiBookOpen className="w-4 h-4" />, description: 'Frases de reflexao' },
  { name: 'Gratidao', icon: <FiStar className="w-4 h-4" />, description: 'Frases de gratidao' },
  { name: 'Religioso', icon: <FiBookOpen className="w-4 h-4" />, description: 'Frases religiosas' },
  { name: 'Humor', icon: <FiSmile className="w-4 h-4" />, description: 'Frases de humor' },
  { name: 'Sexta-feira', icon: <FiMusic className="w-4 h-4" />, description: 'Frases de sexta-feira' },
]

// ─── Seed Phrases ────────────────────────────────────────────────────
const SEED_PHRASES: Phrase[] = [
  { id: 'sd01', text: 'Que o sol deste novo dia ilumine seus caminhos e aqueca seu coracao com esperanca e gratidao.', categoria: 'Bom Dia', emoji: '', gradientIndex: 0, createdAt: 1700000001000, isNew: true, imageUrl: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=600&h=600&fit=crop' },
  { id: 'sd02', text: 'Bom dia! Que cada passo de hoje te leve mais perto dos seus sonhos. A vida e bela demais para ser desperdicada.', categoria: 'Bom Dia', emoji: '', gradientIndex: 1, createdAt: 1700000002000 },
  { id: 'sd03', text: 'Acorde com gratidao no coracao e um sorriso no rosto. Hoje e um presente que merece ser vivido intensamente.', categoria: 'Bom Dia', emoji: '', gradientIndex: 2, createdAt: 1700000003000 },
  { id: 'sd04', text: 'Que a noite traga paz ao seu coracao e que os sonhos sejam tao lindos quanto voce merece.', categoria: 'Boa Noite', emoji: '', gradientIndex: 3, createdAt: 1700000004000, isNew: true, imageUrl: 'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=600&h=600&fit=crop' },
  { id: 'sd05', text: 'Boa noite! Descanse com a certeza de que amanha sera um dia cheio de novas possibilidades.', categoria: 'Boa Noite', emoji: '', gradientIndex: 4, createdAt: 1700000005000 },
  { id: 'sd06', text: 'Durma em paz sabendo que voce fez o seu melhor hoje. O universo cuida de quem tem fe.', categoria: 'Boa Noite', emoji: '', gradientIndex: 5, createdAt: 1700000006000 },
  { id: 'sd07', text: 'O amor e a forca mais poderosa do universo. Quando amamos de verdade, tudo se transforma.', categoria: 'Amor', emoji: '', gradientIndex: 0, createdAt: 1700000007000, isNew: true, imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&h=600&fit=crop' },
  { id: 'sd08', text: 'Amar e encontrar no outro a metade que completa nosso coracao. Voce e o meu mundo inteiro.', categoria: 'Amor', emoji: '', gradientIndex: 1, createdAt: 1700000008000 },
  { id: 'sd09', text: 'O verdadeiro amor nao conhece distancia, tempo ou obstaculos. Ele simplesmente existe e persiste.', categoria: 'Amor', emoji: '', gradientIndex: 2, createdAt: 1700000009000 },
  { id: 'sd10', text: 'A fe move montanhas e transforma o impossivel em possivel. Confie sempre na vontade de Deus.', categoria: 'Fe', emoji: '', gradientIndex: 3, createdAt: 1700000010000, imageUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=600&h=600&fit=crop' },
  { id: 'sd11', text: 'Quando a fe fala mais alto que o medo, milagres acontecem. Acredite no poder da sua oracao.', categoria: 'Fe', emoji: '', gradientIndex: 4, createdAt: 1700000011000, isNew: true },
  { id: 'sd12', text: 'Entregue seus planos nas maos de Deus e Ele fara infinitamente mais do que voce pode imaginar.', categoria: 'Fe', emoji: '', gradientIndex: 5, createdAt: 1700000012000 },
  { id: 'sd13', text: 'Feliz aniversario! Que este novo ciclo seja repleto de realizacoes, saude e muito amor.', categoria: 'Aniversario', emoji: '', gradientIndex: 0, createdAt: 1700000013000 },
  { id: 'sd14', text: 'Parabens! Que cada ano que passa te traga mais sabedoria, alegria e motivos para sorrir.', categoria: 'Aniversario', emoji: '', gradientIndex: 1, createdAt: 1700000014000 },
  { id: 'sd15', text: 'Neste dia especial, desejo que todos os seus sonhos ganhem asas e alcancem o ceu.', categoria: 'Aniversario', emoji: '', gradientIndex: 2, createdAt: 1700000015000, isNew: true },
  { id: 'sd16', text: 'Amigos verdadeiros sao como estrelas: nem sempre os vemos, mas sabemos que estao la.', categoria: 'Amizade', emoji: '', gradientIndex: 3, createdAt: 1700000016000, imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=600&fit=crop' },
  { id: 'sd17', text: 'A amizade e um tesouro que o tempo nao desgasta. Obrigado por ser parte da minha historia.', categoria: 'Amizade', emoji: '', gradientIndex: 4, createdAt: 1700000017000 },
  { id: 'sd18', text: 'Um amigo de verdade e aquele que te faz rir quando voce so quer chorar. Gratidao por voce!', categoria: 'Amizade', emoji: '', gradientIndex: 5, createdAt: 1700000018000, isNew: true },
  { id: 'sd19', text: 'Familia e onde a vida comeca e o amor nunca termina. Nosso laco e eterno e inquebravel.', categoria: 'Familia', emoji: '', gradientIndex: 0, createdAt: 1700000019000, imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&h=600&fit=crop' },
  { id: 'sd20', text: 'O maior patrimonio que possuimos e a nossa familia. Cuide com carinho de quem te ama.', categoria: 'Familia', emoji: '', gradientIndex: 1, createdAt: 1700000020000 },
  { id: 'sd21', text: 'A vida e um espelho: reflete de volta o que voce mostra a ela. Escolha sempre o melhor.', categoria: 'Reflexao', emoji: '', gradientIndex: 2, createdAt: 1700000021000, isNew: true, imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop' },
  { id: 'sd22', text: 'Nao espere o momento perfeito. Tome o momento e faca-o perfeito com sua atitude.', categoria: 'Reflexao', emoji: '', gradientIndex: 3, createdAt: 1700000022000 },
  { id: 'sd23', text: 'Cada dia e uma nova chance de reescrever sua historia. Nao desista do seu capitulo mais bonito.', categoria: 'Reflexao', emoji: '', gradientIndex: 4, createdAt: 1700000023000 },
  { id: 'sd24', text: 'Gratidao transforma o que temos em suficiente. Agradeca por cada bencao, grande ou pequena.', categoria: 'Gratidao', emoji: '', gradientIndex: 5, createdAt: 1700000024000 },
  { id: 'sd25', text: 'Ser grato nao e apenas dizer obrigado, e viver reconhecendo que cada dia e um presente divino.', categoria: 'Gratidao', emoji: '', gradientIndex: 0, createdAt: 1700000025000, isNew: true },
  { id: 'sd26', text: 'Deus nao te trouxe ate aqui para te abandonar. Confie no Seu plano, Ele sabe o que faz.', categoria: 'Religioso', emoji: '', gradientIndex: 1, createdAt: 1700000026000 },
  { id: 'sd27', text: 'O Senhor e meu pastor e nada me faltara. Em verdes pastos me faz repousar. Salmo 23.', categoria: 'Religioso', emoji: '', gradientIndex: 2, createdAt: 1700000027000 },
  { id: 'sd28', text: 'Porque Deus tanto amou o mundo que deu o Seu Filho, para que todo o que nele cre nao pereca.', categoria: 'Religioso', emoji: '', gradientIndex: 3, createdAt: 1700000028000, isNew: true },
  { id: 'sd29', text: 'A vida e curta demais para nao rir das coisas bobas. Sorria, pois o riso e o melhor remedio!', categoria: 'Humor', emoji: '', gradientIndex: 4, createdAt: 1700000029000 },
  { id: 'sd30', text: 'Se a vida te der limoes, faca uma caipirinha! Afinal, estamos no Brasil.', categoria: 'Humor', emoji: '', gradientIndex: 5, createdAt: 1700000030000 },
  { id: 'sd31', text: 'Sexta-feira chegou! Hora de guardar os problemas na gaveta e abrir a porta da alegria.', categoria: 'Sexta-feira', emoji: '', gradientIndex: 0, createdAt: 1700000031000, isNew: true, imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=600&fit=crop' },
  { id: 'sd32', text: 'Sextou! Que este final de semana seja regado de boas risadas, boa musica e muita paz.', categoria: 'Sexta-feira', emoji: '', gradientIndex: 1, createdAt: 1700000032000 },
  { id: 'sd33', text: 'A melhor hora da semana chegou! Bora celebrar a vida nesta sexta-feira maravilhosa.', categoria: 'Sexta-feira', emoji: '', gradientIndex: 2, createdAt: 1700000033000 },
  { id: 'sd34', text: 'Bom dia! Lembre-se: voce e mais forte do que imagina e mais amado do que sabe.', categoria: 'Bom Dia', emoji: '', gradientIndex: 3, createdAt: 1700000034000 },
  { id: 'sd35', text: 'O amor que a gente da e o unico que a gente leva. Ame sem medo, viva sem arrependimento.', categoria: 'Amor', emoji: '', gradientIndex: 4, createdAt: 1700000035000 },
  { id: 'sd36', text: 'Familia nao e sobre sangue. E sobre quem esta disposto a segurar sua mao nos dias dificeis.', categoria: 'Familia', emoji: '', gradientIndex: 5, createdAt: 1700000036000, isNew: true },
]

// ─── Helpers ─────────────────────────────────────────────────────────
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8)
}

function getGreeting(hour: number): { text: string; icon: React.ReactNode } {
  if (hour >= 5 && hour < 12) {
    return { text: 'Bom Dia', icon: <FiSun className="w-6 h-6 text-amber-500" /> }
  }
  if (hour >= 12 && hour < 18) {
    return { text: 'Boa Tarde', icon: <FiSun className="w-6 h-6 text-orange-500" /> }
  }
  return { text: 'Boa Noite', icon: <FiMoon className="w-6 h-6 text-indigo-400" /> }
}

function loadFavorites(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const saved = localStorage.getItem(FAVORITES_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

function saveFavorites(ids: string[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids))
  } catch {
    // silent
  }
}

function shareOnWhatsApp(text: string, imageUrl?: string) {
  const shareText = imageUrl
    ? `${text}\n\n${imageUrl}`
    : text
  const encodedText = encodeURIComponent(shareText)
  window.open(`https://wa.me/?text=${encodedText}`, '_blank')
}

// ─── ErrorBoundary ───────────────────────────────────────────────────
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: '' }
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
          <div className="text-center p-8 max-w-md">
            <h2 className="text-xl font-semibold mb-2">Algo deu errado</h2>
            <p className="text-muted-foreground mb-4 text-sm">{this.state.error}</p>
            <button
              onClick={() => this.setState({ hasError: false, error: '' })}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

// ─── Loading Dots ────────────────────────────────────────────────────
function LoadingDots() {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="w-2 h-2 rounded-full bg-primary animate-bounce" />
      <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.15s' }} />
      <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.3s' }} />
    </span>
  )
}

// ─── Phrase Card ─────────────────────────────────────────────────────
function PhraseCard({
  phrase,
  isFavorited,
  onToggleFavorite,
  onCardClick,
}: {
  phrase: Phrase
  isFavorited: boolean
  onToggleFavorite: (id: string) => void
  onCardClick: (phrase: Phrase) => void
}) {
  const gradient = CARD_GRADIENTS[phrase.gradientIndex % CARD_GRADIENTS.length]
  const textColorClass = CARD_TEXT_COLORS[phrase.gradientIndex % CARD_TEXT_COLORS.length]
  const hasImage = !!phrase.imageUrl

  return (
    <div
      className="relative rounded-[0.875rem] overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform duration-300 shadow-md"
      style={{
        background: hasImage ? `url(${phrase.imageUrl})` : gradient,
        backgroundSize: hasImage ? 'cover' : undefined,
        backgroundPosition: hasImage ? 'center' : undefined,
        minHeight: hasImage ? '200px' : '180px',
      }}
      onClick={() => onCardClick(phrase)}
    >
      <div className={`absolute inset-0 ${hasImage ? 'bg-gradient-to-t from-black/70 via-black/20 to-transparent' : 'bg-black/5'}`} />
      <div className={`relative p-4 flex flex-col justify-between h-full ${hasImage ? 'min-h-[200px]' : 'min-h-[180px]'}`}>
        <div>
          {phrase.isNew && (
            <Badge className="mb-2 bg-white/25 text-white border-white/30 text-[10px] backdrop-blur-sm">
              Novo
            </Badge>
          )}
          {phrase.isAIGenerated && (
            <Badge className="mb-2 ml-1 bg-white/25 text-white border-white/30 text-[10px] backdrop-blur-sm">
              <FiZap className="w-3 h-3 mr-1" /> IA
            </Badge>
          )}
          {hasImage && phrase.isAIGenerated && (
            <Badge className="mb-2 ml-1 bg-white/25 text-white border-white/30 text-[10px] backdrop-blur-sm">
              <FiImage className="w-3 h-3 mr-1" /> DALL-E
            </Badge>
          )}
          <p className={`text-sm font-medium leading-relaxed tracking-tight ${hasImage ? 'text-white' : textColorClass}`} style={{ textShadow: hasImage ? '0 1px 4px rgba(0,0,0,0.5)' : (phrase.gradientIndex === 4 ? 'none' : '0 1px 3px rgba(0,0,0,0.2)') }}>
            {phrase.text.length > 120 ? phrase.text.substring(0, 120) + '...' : phrase.text}
          </p>
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className={`text-xs font-medium opacity-80 ${hasImage ? 'text-white' : textColorClass}`}>
            {phrase.categoria}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleFavorite(phrase.id)
            }}
            className="p-1.5 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 hover:scale-110"
          >
            {isFavorited ? (
              <FaHeart className="w-3.5 h-3.5 text-white" />
            ) : (
              <FaRegHeart className={`w-3.5 h-3.5 ${hasImage ? 'text-white' : textColorClass}`} />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Category Chip ───────────────────────────────────────────────────
function CategoryChip({
  category,
  isActive,
  onClick,
  count,
}: {
  category: Category
  isActive: boolean
  onClick: () => void
  count?: number
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 text-sm font-medium ${isActive ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25' : 'bg-white/75 backdrop-blur-sm text-foreground border border-border hover:bg-white/90'}`}
    >
      {category.icon}
      <span>{category.name}</span>
      {typeof count === 'number' && (
        <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-muted'}`}>
          {count}
        </span>
      )}
    </button>
  )
}

// ─── Full Screen Viewer ──────────────────────────────────────────────
function FullScreenViewer({
  phrase,
  phrases,
  isFavorited,
  onToggleFavorite,
  onClose,
  onNavigate,
}: {
  phrase: Phrase
  phrases: Phrase[]
  isFavorited: boolean
  onToggleFavorite: (id: string) => void
  onClose: () => void
  onNavigate: (direction: 'prev' | 'next') => void
}) {
  const gradient = CARD_GRADIENTS[phrase.gradientIndex % CARD_GRADIENTS.length]
  const currentIndex = phrases.findIndex((p) => p.id === phrase.id)
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < phrases.length - 1
  const hasImage = !!phrase.imageUrl

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{
        background: hasImage ? `url(${phrase.imageUrl})` : gradient,
        backgroundSize: hasImage ? 'cover' : undefined,
        backgroundPosition: hasImage ? 'center' : undefined,
      }}
    >
      <div className={`absolute inset-0 ${hasImage ? 'bg-black/30' : 'bg-black/10'}`} />
      <div className="relative flex-1 flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between p-4">
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/30 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/20 backdrop-blur-sm text-white text-sm">
            {hasImage && <FiImage className="w-3.5 h-3.5" />}
            <span>{phrase.categoria}</span>
          </div>
        </div>

        {/* Phrase content */}
        <div className="flex-1 flex items-center justify-center px-8">
          <div className="max-w-lg text-center">
            <p className="text-2xl md:text-3xl font-serif font-semibold text-white leading-relaxed tracking-tight" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
              &ldquo;{phrase.text}&rdquo;
            </p>
            {phrase.emoji && (
              <p className="mt-4 text-3xl">{phrase.emoji}</p>
            )}
          </div>
        </div>

        {/* Navigation arrows */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2">
          {hasPrev && (
            <button
              onClick={() => onNavigate('prev')}
              className="p-2 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/30 transition-colors"
            >
              <FiChevronLeft className="w-6 h-6" />
            </button>
          )}
        </div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          {hasNext && (
            <button
              onClick={() => onNavigate('next')}
              className="p-2 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/30 transition-colors"
            >
              <FiChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Bottom action bar */}
        <div className="p-4 pb-6">
          <div className="flex items-center justify-center gap-3 p-3 rounded-2xl bg-black/20 backdrop-blur-md max-w-md mx-auto">
            <Button
              onClick={() => shareOnWhatsApp(phrase.text, phrase.imageUrl)}
              className="flex-1 bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
            >
              <FiShare2 className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>
            <button
              onClick={() => onToggleFavorite(phrase.id)}
              className="p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200 hover:scale-110"
            >
              {isFavorited ? (
                <FaHeart className="w-5 h-5" />
              ) : (
                <FaRegHeart className="w-5 h-5" />
              )}
            </button>
            <Button
              onClick={() => {
                // Simulated download
              }}
              className="flex-1 bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
            >
              <FiDownload className="w-4 h-4 mr-2" />
              Baixar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── AI Generation Bottom Sheet ──────────────────────────────────────
function AIGenerationSheet({
  isOpen,
  onClose,
  categoryName,
  onPhraseGenerated,
  onStepChange,
}: {
  isOpen: boolean
  onClose: () => void
  categoryName: string
  onPhraseGenerated: (phrase: Phrase) => void
  onStepChange?: (step: 'frase' | 'imagem' | null) => void
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generatedPhrase, setGeneratedPhrase] = useState<Phrase | null>(null)
  const [generationStep, setGenerationStep] = useState<'frase' | 'imagem' | null>(null)

  const updateStep = useCallback((step: 'frase' | 'imagem' | null) => {
    setGenerationStep(step)
    onStepChange?.(step)
  }, [onStepChange])

  const handleGenerate = useCallback(async () => {
    setLoading(true)
    setError(null)
    setGeneratedPhrase(null)
    updateStep('frase')

    try {
      // STEP 1: Generate the phrase
      const phraseMessage = `Gere uma frase inspiracional na categoria: ${categoryName}. Tom: inspiracional e emotivo. Responda em JSON com os campos: frase, categoria, emoji.`
      const phraseResult = await callAIAgent(phraseMessage, AGENT_ID)

      if (!phraseResult.success) {
        setError(phraseResult?.error || 'Erro ao gerar frase. Tente novamente.')
        setLoading(false)
        updateStep(null)
        return
      }

      let parsed = phraseResult?.response?.result
      if (typeof parsed === 'string') {
        parsed = parseLLMJson(parsed)
      }
      const frase = parsed?.frase || ''
      const categoria = parsed?.categoria || categoryName
      const emoji = parsed?.emoji || ''

      if (!frase) {
        setError('Nao foi possivel gerar a frase. Tente novamente.')
        setLoading(false)
        updateStep(null)
        return
      }

      // STEP 2: Generate the image
      updateStep('imagem')

      const imageMessage = `Crie uma imagem artistica e bonita para acompanhar esta frase inspiracional. Categoria: ${categoria}. Frase: "${frase}". A imagem deve ser uma paisagem ou arte bonita que combine com o tema. NAO inclua texto na imagem. Estilo: fotorrealista, cores vibrantes, composicao impactante. Formato quadrado.`
      const imageResult = await callAIAgent(imageMessage, IMAGE_AGENT_ID)

      let imageUrl = ''
      if (imageResult.success) {
        // Image is at TOP LEVEL: result.module_outputs?.artifact_files
        const artifactFiles = imageResult?.module_outputs?.artifact_files
        if (Array.isArray(artifactFiles) && artifactFiles.length > 0) {
          imageUrl = artifactFiles[0]?.file_url || ''
        }
      }
      // Note: If image generation fails, we still show the phrase with a gradient fallback

      const newPhrase: Phrase = {
        id: generateId(),
        text: frase,
        categoria: categoria,
        emoji: emoji,
        isAIGenerated: true,
        isNew: true,
        imageUrl: imageUrl || undefined,
        gradientIndex: Math.floor(Math.random() * CARD_GRADIENTS.length),
        createdAt: Date.now(),
      }
      setGeneratedPhrase(newPhrase)
    } catch {
      setError('Erro de conexao. Tente novamente.')
    } finally {
      setLoading(false)
      updateStep(null)
    }
  }, [categoryName, updateStep])

  useEffect(() => {
    if (isOpen && !generatedPhrase && !loading && !error) {
      handleGenerate()
    }
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = useCallback(() => {
    if (generatedPhrase) {
      onPhraseGenerated(generatedPhrase)
      onClose()
      setGeneratedPhrase(null)
      setError(null)
    }
  }, [generatedPhrase, onPhraseGenerated, onClose])

  const handleGenerateAnother = useCallback(() => {
    setGeneratedPhrase(null)
    setError(null)
    handleGenerate()
  }, [handleGenerate])

  if (!isOpen) return null

  const gradient = generatedPhrase
    ? CARD_GRADIENTS[generatedPhrase.gradientIndex % CARD_GRADIENTS.length]
    : CARD_GRADIENTS[0]

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { onClose(); setGeneratedPhrase(null); setError(null); updateStep(null); } }}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-0 bg-card">
        <DialogTitle className="sr-only">Gerar Frase com IA</DialogTitle>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <FiZap className="w-5 h-5 text-primary" />
            <h3 className="font-serif font-semibold text-lg text-foreground">Gerar Frase com IA</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Categoria: <span className="font-medium text-foreground">{categoryName}</span>
          </p>

          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                {generationStep === 'imagem' ? (
                  <FiImage className="w-6 h-6 text-primary animate-pulse" />
                ) : (
                  <FiZap className="w-6 h-6 text-primary animate-pulse" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {generationStep === 'imagem' ? 'Criando imagem bonita...' : 'Gerando frase...'}
              </p>
              <LoadingDots />
              {/* Step indicators */}
              <div className="flex items-center gap-3 mt-4">
                <div className={`flex items-center gap-1.5 text-xs ${generationStep === 'frase' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${generationStep === 'frase' ? 'bg-primary animate-pulse' : generationStep === 'imagem' ? 'bg-green-500' : 'bg-muted'}`} />
                  Frase
                </div>
                <div className="w-4 h-px bg-border" />
                <div className={`flex items-center gap-1.5 text-xs ${generationStep === 'imagem' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${generationStep === 'imagem' ? 'bg-primary animate-pulse' : 'bg-muted'}`} />
                  Imagem
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="py-8 text-center">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                <FiX className="w-6 h-6 text-destructive" />
              </div>
              <p className="text-sm text-destructive mb-4">{error}</p>
              <Button onClick={handleGenerate} variant="outline" className="gap-2">
                <FiRefreshCw className="w-4 h-4" />
                Tentar novamente
              </Button>
            </div>
          )}

          {generatedPhrase && !loading && !error && (
            <div className="space-y-4">
              <div
                className="rounded-[0.875rem] overflow-hidden min-h-[220px] flex flex-col justify-end relative"
                style={{
                  background: generatedPhrase.imageUrl
                    ? `url(${generatedPhrase.imageUrl})`
                    : gradient,
                  backgroundSize: generatedPhrase.imageUrl ? 'cover' : undefined,
                  backgroundPosition: generatedPhrase.imageUrl ? 'center' : undefined,
                }}
              >
                {/* Overlay for text readability */}
                <div className={`absolute inset-0 ${generatedPhrase.imageUrl ? 'bg-gradient-to-t from-black/70 via-black/30 to-transparent' : ''}`} />
                <div className="relative p-5">
                  <p className="text-white font-serif font-medium text-base leading-relaxed tracking-tight text-center" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
                    &ldquo;{generatedPhrase.text}&rdquo;
                  </p>
                  {generatedPhrase.emoji && (
                    <p className="text-center mt-2 text-xl">{generatedPhrase.emoji}</p>
                  )}
                </div>
              </div>
              {generatedPhrase.imageUrl && (
                <div className="flex items-center gap-1.5 justify-center">
                  <FiImage className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Imagem gerada por DALL-E 3</span>
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  onClick={() => shareOnWhatsApp(generatedPhrase.text, generatedPhrase.imageUrl)}
                  variant="outline"
                  className="flex-1 gap-2"
                >
                  <FiShare2 className="w-4 h-4" />
                  Compartilhar
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex-1 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <FaHeart className="w-4 h-4" />
                  Salvar
                </Button>
              </div>
              <Button
                onClick={handleGenerateAnother}
                variant="ghost"
                className="w-full gap-2 text-muted-foreground"
              >
                <FiZap className="w-4 h-4" />
                Gerar outra
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Home Feed View ──────────────────────────────────────────────────
function HomeFeedView({
  phrases,
  favorites,
  onToggleFavorite,
  onCardClick,
  onCategoryClick,
  greeting,
  onRefresh,
}: {
  phrases: Phrase[]
  favorites: string[]
  onToggleFavorite: (id: string) => void
  onCardClick: (phrase: Phrase) => void
  onCategoryClick: (cat: string) => void
  greeting: { text: string; icon: React.ReactNode }
  onRefresh: () => void
}) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filteredPhrases = useMemo(() => {
    if (!activeCategory) return phrases
    return phrases.filter((p) => p.categoria === activeCategory)
  }, [phrases, activeCategory])

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    phrases.forEach((p) => {
      counts[p.categoria] = (counts[p.categoria] || 0) + 1
    })
    return counts
  }, [phrases])

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground tracking-tight">Frases & Imagens</h1>
            <div className="flex items-center gap-2 mt-1">
              {greeting.icon}
              <span className="text-sm text-muted-foreground font-medium">{greeting.text}!</span>
            </div>
          </div>
          <button
            onClick={onRefresh}
            className="p-2 rounded-full bg-white/60 backdrop-blur-sm border border-border hover:bg-white/80 transition-colors"
          >
            <FiRefreshCw className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Category chips */}
        <div className="overflow-x-auto pb-2 -mx-4 px-4 flex gap-2 no-scrollbar">
          <button
            onClick={() => setActiveCategory(null)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 text-sm font-medium ${!activeCategory ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25' : 'bg-white/75 backdrop-blur-sm text-foreground border border-border hover:bg-white/90'}`}
          >
            Todos
          </button>
          {CATEGORIES.map((cat) => (
            <CategoryChip
              key={cat.name}
              category={cat}
              isActive={activeCategory === cat.name}
              onClick={() => {
                if (activeCategory === cat.name) {
                  setActiveCategory(null)
                } else {
                  setActiveCategory(cat.name)
                }
              }}
              count={categoryCounts[cat.name] || 0}
            />
          ))}
        </div>
      </div>

      {/* Phrase grid */}
      <ScrollArea className="flex-1 px-4 pb-20">
        <div className="grid grid-cols-2 gap-3 pb-4">
          {filteredPhrases.map((phrase) => (
            <PhraseCard
              key={phrase.id}
              phrase={phrase}
              isFavorited={favorites.includes(phrase.id)}
              onToggleFavorite={onToggleFavorite}
              onCardClick={onCardClick}
            />
          ))}
        </div>
        {filteredPhrases.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FiBookOpen className="w-10 h-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground font-medium">Nenhuma frase nesta categoria.</p>
            <p className="text-xs text-muted-foreground mt-1">Tente outra categoria ou gere uma com IA!</p>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

// ─── Categories Grid View ────────────────────────────────────────────
function CategoriesGridView({
  phrases,
  favorites,
  onToggleFavorite,
  onCardClick,
  onCategorySelect,
}: {
  phrases: Phrase[]
  favorites: string[]
  onToggleFavorite: (id: string) => void
  onCardClick: (phrase: Phrase) => void
  onCategorySelect: (name: string) => void
}) {
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    phrases.forEach((p) => {
      counts[p.categoria] = (counts[p.categoria] || 0) + 1
    })
    return counts
  }, [phrases])

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-3">
        <h2 className="text-xl font-serif font-bold text-foreground tracking-tight">Categorias</h2>
        <p className="text-sm text-muted-foreground mt-1">Explore frases por categoria</p>
      </div>
      <ScrollArea className="flex-1 px-4 pb-20">
        <div className="grid grid-cols-2 gap-3 pb-4">
          {CATEGORIES.map((cat, idx) => {
            const gradient = CARD_GRADIENTS[idx % CARD_GRADIENTS.length]
            const count = categoryCounts[cat.name] || 0
            return (
              <button
                key={cat.name}
                onClick={() => onCategorySelect(cat.name)}
                className="rounded-[0.875rem] overflow-hidden text-left hover:scale-[1.02] transition-transform duration-300 shadow-md"
                style={{ background: gradient }}
              >
                <div className="p-4 min-h-[120px] flex flex-col justify-between">
                  <div className="w-8 h-8 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center text-white">
                    {cat.icon}
                  </div>
                  <div className="mt-3">
                    <p className="text-white font-semibold text-sm" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
                      {cat.name}
                    </p>
                    <p className="text-white/70 text-xs mt-0.5">{count} frases</p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}

// ─── Category Detail View ────────────────────────────────────────────
function CategoryDetailView({
  categoryName,
  phrases,
  favorites,
  onToggleFavorite,
  onCardClick,
  onBack,
  onGeneratePhrase,
}: {
  categoryName: string
  phrases: Phrase[]
  favorites: string[]
  onToggleFavorite: (id: string) => void
  onCardClick: (phrase: Phrase) => void
  onBack: () => void
  onGeneratePhrase: () => void
}) {
  const categoryPhrases = useMemo(
    () => phrases.filter((p) => p.categoria === categoryName),
    [phrases, categoryName]
  )
  const category = CATEGORIES.find((c) => c.name === categoryName)

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={onBack}
            className="p-2 rounded-full bg-white/60 backdrop-blur-sm border border-border hover:bg-white/80 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4 text-foreground" />
          </button>
          <div className="flex items-center gap-2">
            {category?.icon}
            <h2 className="text-xl font-serif font-bold text-foreground tracking-tight">{categoryName}</h2>
          </div>
        </div>
        <p className="text-sm text-muted-foreground ml-11">{categoryPhrases.length} frases</p>
      </div>

      {/* Grid */}
      <ScrollArea className="flex-1 px-4 pb-24">
        <div className="grid grid-cols-2 gap-3 pb-4">
          {categoryPhrases.map((phrase) => (
            <PhraseCard
              key={phrase.id}
              phrase={phrase}
              isFavorited={favorites.includes(phrase.id)}
              onToggleFavorite={onToggleFavorite}
              onCardClick={onCardClick}
            />
          ))}
        </div>
        {categoryPhrases.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FiBookOpen className="w-10 h-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground font-medium">Nenhuma frase nesta categoria ainda.</p>
            <p className="text-xs text-muted-foreground mt-2">Use o botao abaixo para gerar uma com IA!</p>
          </div>
        )}
      </ScrollArea>

      {/* FAB */}
      <button
        onClick={onGeneratePhrase}
        className="absolute bottom-24 right-4 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-105 transition-transform duration-200 animate-pulse"
      >
        <FiZap className="w-6 h-6" />
      </button>
    </div>
  )
}

// ─── Search View ─────────────────────────────────────────────────────
function SearchView({
  phrases,
  favorites,
  onToggleFavorite,
  onCardClick,
}: {
  phrases: Phrase[]
  favorites: string[]
  onToggleFavorite: (id: string) => void
  onCardClick: (phrase: Phrase) => void
}) {
  const [query, setQuery] = useState('')
  const suggestions = ['bom dia', 'Deus', 'saudade', 'aniversario', 'amor', 'fe']

  const filteredPhrases = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return phrases.filter((p) =>
      p.text.toLowerCase().includes(q) || p.categoria.toLowerCase().includes(q)
    )
  }, [phrases, query])

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-3">
        <h2 className="text-xl font-serif font-bold text-foreground tracking-tight mb-3">Busca</h2>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar frases..."
            className="pl-10 bg-white/70 backdrop-blur-sm border-border"
          />
        </div>
        {!query.trim() && (
          <div className="flex flex-wrap gap-2 mt-3">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => setQuery(s)}
                className="px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-border text-xs font-medium text-foreground hover:bg-white/90 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 px-4 pb-20">
        {query.trim() && filteredPhrases.length > 0 && (
          <div className="mb-2">
            <p className="text-xs text-muted-foreground">{filteredPhrases.length} resultado(s)</p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-3 pb-4">
          {filteredPhrases.map((phrase) => (
            <PhraseCard
              key={phrase.id}
              phrase={phrase}
              isFavorited={favorites.includes(phrase.id)}
              onToggleFavorite={onToggleFavorite}
              onCardClick={onCardClick}
            />
          ))}
        </div>
        {query.trim() && filteredPhrases.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FiSearch className="w-10 h-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground font-medium">Nenhuma frase encontrada.</p>
            <p className="text-xs text-muted-foreground mt-1">Tente outra busca!</p>
          </div>
        )}
        {!query.trim() && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FiSearch className="w-10 h-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground font-medium">Busque frases inspiracionais</p>
            <p className="text-xs text-muted-foreground mt-1">Digite palavras-chave ou escolha uma sugestao acima</p>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

// ─── Favorites View ──────────────────────────────────────────────────
function FavoritesView({
  phrases,
  favorites,
  onToggleFavorite,
  onCardClick,
}: {
  phrases: Phrase[]
  favorites: string[]
  onToggleFavorite: (id: string) => void
  onCardClick: (phrase: Phrase) => void
}) {
  const favoritePhrases = useMemo(
    () => phrases.filter((p) => favorites.includes(p.id)),
    [phrases, favorites]
  )

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <FaHeart className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-serif font-bold text-foreground tracking-tight">Favoritos</h2>
          {favoritePhrases.length > 0 && (
            <Badge variant="secondary" className="text-xs">{favoritePhrases.length}</Badge>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1 px-4 pb-20">
        {favoritePhrases.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 pb-4">
            {favoritePhrases.map((phrase) => (
              <div key={phrase.id} className="relative">
                <PhraseCard
                  phrase={phrase}
                  isFavorited={true}
                  onToggleFavorite={onToggleFavorite}
                  onCardClick={onCardClick}
                />
                <button
                  onClick={() => shareOnWhatsApp(phrase.text, phrase.imageUrl)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-white/25 backdrop-blur-sm text-white hover:bg-white/40 transition-colors"
                >
                  <FiShare2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FaRegHeart className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground font-medium text-base">Nenhum favorito ainda</p>
            <p className="text-xs text-muted-foreground mt-2 max-w-xs">Favorite imagens para encontra-las aqui! Toque no coracao em qualquer frase.</p>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

// ─── Bottom Navigation ───────────────────────────────────────────────
function BottomNav({
  activeTab,
  onTabChange,
}: {
  activeTab: string
  onTabChange: (tab: string) => void
}) {
  const tabs = [
    { id: 'home', label: 'Inicio', icon: <FiHome className="w-5 h-5" /> },
    { id: 'categories', label: 'Categorias', icon: <FiGrid className="w-5 h-5" /> },
    { id: 'search', label: 'Busca', icon: <FiSearch className="w-5 h-5" /> },
    { id: 'favorites', label: 'Favoritos', icon: <FiHeart className="w-5 h-5" /> },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-2xl border-t border-white/20 shadow-lg">
      <div className="flex items-center justify-around py-2 pb-3 max-w-lg mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 ${activeTab === tab.id ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {tab.icon}
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Agent Status Section ────────────────────────────────────────────
function AgentStatus({ activeAgentId, generationStep }: { activeAgentId: string | null; generationStep: 'frase' | 'imagem' | null }) {
  return (
    <div className="px-4 pb-24">
      <div className="mt-4 p-3 rounded-[0.875rem] bg-white/60 backdrop-blur-sm border border-border">
        <div className="flex items-center gap-2 mb-2">
          <FiZap className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold text-foreground">Agentes de IA</span>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${generationStep === 'frase' ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground/40'}`} />
            <span className="text-xs text-muted-foreground">Gerador de Frases</span>
            <span className="text-[10px] text-muted-foreground ml-auto">
              {generationStep === 'frase' ? 'Processando...' : 'Pronto'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${generationStep === 'imagem' ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground/40'}`} />
            <span className="text-xs text-muted-foreground">Gerador de Imagens</span>
            <span className="text-[10px] text-muted-foreground ml-auto">
              {generationStep === 'imagem' ? 'Criando imagem...' : 'Pronto'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────
export default function Page() {
  const [phrases, setPhrases] = useState<Phrase[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState('home')
  const [selectedPhrase, setSelectedPhrase] = useState<Phrase | null>(null)
  const [showSampleData, setShowSampleData] = useState(false)
  const [greeting, setGreeting] = useState<{ text: string; icon: React.ReactNode }>({ text: 'Bom Dia', icon: <FiSun className="w-6 h-6 text-amber-500" /> })
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showAISheet, setShowAISheet] = useState(false)
  const [aiCategoryName, setAICategoryName] = useState('Bom Dia')
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null)
  const [generationStep, setGenerationStep] = useState<'frase' | 'imagem' | null>(null)

  // Initialize greeting, favorites
  useEffect(() => {
    const hour = new Date().getHours()
    setGreeting(getGreeting(hour))
    setFavorites(loadFavorites())
  }, [])

  // Toggle sample data
  useEffect(() => {
    if (showSampleData) {
      setPhrases(SEED_PHRASES)
    } else {
      setPhrases([])
    }
  }, [showSampleData])

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
      saveFavorites(next)
      return next
    })
  }, [])

  const handleCardClick = useCallback((phrase: Phrase) => {
    setSelectedPhrase(phrase)
  }, [])

  const handleNavigate = useCallback(
    (direction: 'prev' | 'next') => {
      if (!selectedPhrase) return
      const currentIndex = phrases.findIndex((p) => p.id === selectedPhrase.id)
      if (direction === 'prev' && currentIndex > 0) {
        setSelectedPhrase(phrases[currentIndex - 1])
      } else if (direction === 'next' && currentIndex < phrases.length - 1) {
        setSelectedPhrase(phrases[currentIndex + 1])
      }
    },
    [selectedPhrase, phrases]
  )

  const handleCategorySelect = useCallback((name: string) => {
    setSelectedCategory(name)
  }, [])

  const handleGeneratePhrase = useCallback((categoryName: string) => {
    setAICategoryName(categoryName)
    setShowAISheet(true)
  }, [])

  const handlePhraseGenerated = useCallback((phrase: Phrase) => {
    setPhrases((prev) => [phrase, ...prev])
  }, [])

  const handleRefresh = useCallback(() => {
    // Shuffle the order
    setPhrases((prev) => {
      const shuffled = [...prev]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      return shuffled
    })
  }, [])

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab)
    setSelectedCategory(null)
  }, [])

  const handleStepChange = useCallback((step: 'frase' | 'imagem' | null) => {
    setGenerationStep(step)
    if (step === 'frase') {
      setActiveAgentId(AGENT_ID)
    } else if (step === 'imagem') {
      setActiveAgentId(IMAGE_AGENT_ID)
    } else {
      setActiveAgentId(null)
    }
  }, [])

  // Determine which view to show
  const renderContent = () => {
    // If in category detail
    if (selectedCategory && (activeTab === 'home' || activeTab === 'categories')) {
      return (
        <CategoryDetailView
          categoryName={selectedCategory}
          phrases={phrases}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onCardClick={handleCardClick}
          onBack={() => setSelectedCategory(null)}
          onGeneratePhrase={() => handleGeneratePhrase(selectedCategory)}
        />
      )
    }

    switch (activeTab) {
      case 'home':
        return (
          <HomeFeedView
            phrases={phrases}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onCardClick={handleCardClick}
            onCategoryClick={handleCategorySelect}
            greeting={greeting}
            onRefresh={handleRefresh}
          />
        )
      case 'categories':
        return (
          <CategoriesGridView
            phrases={phrases}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onCardClick={handleCardClick}
            onCategorySelect={handleCategorySelect}
          />
        )
      case 'search':
        return (
          <SearchView
            phrases={phrases}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onCardClick={handleCardClick}
          />
        )
      case 'favorites':
        return (
          <FavoritesView
            phrases={phrases}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onCardClick={handleCardClick}
          />
        )
      default:
        return null
    }
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground font-sans max-w-lg mx-auto relative">
        {/* Sample Data Toggle */}
        <div className="fixed top-3 right-3 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-xl border border-border shadow-sm">
          <span className="text-xs font-medium text-muted-foreground">Sample Data</span>
          <Switch
            checked={showSampleData}
            onCheckedChange={setShowSampleData}
          />
        </div>

        {/* Main content area */}
        <div className="h-screen flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            {renderContent()}
            <AgentStatus activeAgentId={activeAgentId} generationStep={generationStep} />
          </div>
        </div>

        {/* Bottom Nav */}
        <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Full Screen Viewer */}
        {selectedPhrase && (
          <FullScreenViewer
            phrase={selectedPhrase}
            phrases={phrases}
            isFavorited={favorites.includes(selectedPhrase.id)}
            onToggleFavorite={toggleFavorite}
            onClose={() => setSelectedPhrase(null)}
            onNavigate={handleNavigate}
          />
        )}

        {/* AI Generation Sheet */}
        <AIGenerationSheet
          isOpen={showAISheet}
          onClose={() => setShowAISheet(false)}
          categoryName={aiCategoryName}
          onPhraseGenerated={handlePhraseGenerated}
          onStepChange={handleStepChange}
        />
      </div>
    </ErrorBoundary>
  )
}
