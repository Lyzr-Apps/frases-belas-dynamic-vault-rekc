'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  FiShare2,
  FiDownload,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiArrowLeft,
  FiImage,
  FiBell,
  FiAward,
  FiCheck,
  FiLock,
} from 'react-icons/fi'
import { FaHeart, FaRegHeart } from 'react-icons/fa'

// ─── Agent IDs (kept as reference — agents used offline to pre-populate content) ──
// const AGENT_ID = '699a74a9c2eec05acd279d41'
// const IMAGE_AGENT_ID = '699a77b7b0da46f6ada21c31'

// ─── Constants ───────────────────────────────────────────────────────
const FAVORITES_KEY = 'frases-favoritos'
const PLAN_KEY = 'frases-user-plan'
const FONT_KEY = 'frases-selected-font'

// ─── Types ───────────────────────────────────────────────────────────
type UserPlan = 'free' | 'pro'

interface Phrase {
  id: string
  text: string
  categoria: string
  emoji: string
  isNew?: boolean
  imageUrl: string
  gradientIndex: number
  createdAt: number
}

interface Category {
  name: string
  icon: React.ReactNode
  description: string
}

interface FontOption {
  name: string
  family: string
}

// ─── Font Options ────────────────────────────────────────────────────
const FONT_OPTIONS: FontOption[] = [
  { name: 'Classica', family: 'Georgia, "Times New Roman", serif' },
  { name: 'Moderna', family: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' },
  { name: 'Elegante', family: '"Palatino Linotype", Palatino, "Book Antiqua", serif' },
  { name: 'Manuscrita', family: '"Brush Script MT", "Segoe Script", cursive' },
  { name: 'Impacto', family: 'Impact, "Arial Black", sans-serif' },
  { name: 'Suave', family: 'Cambria, Cochin, Georgia, serif' },
  { name: 'Minimalista', family: '"Trebuchet MS", "Lucida Sans", Arial, sans-serif' },
  { name: 'Retro', family: '"Courier New", Courier, monospace' },
  { name: 'Delicada', family: '"Lucida Calligraphy", "Apple Chancery", cursive' },
  { name: 'Forte', family: '"Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif' },
  { name: 'Romantica', family: 'Garamond, "Hoefler Text", "Times New Roman", serif' },
  { name: 'Divertida', family: '"Comic Sans MS", "Chalkboard SE", cursive' },
]

// ─── Card Gradients ──────────────────────────────────────────────────
const CARD_GRADIENTS = [
  'linear-gradient(135deg, #e84393 0%, #fd79a8 100%)',
  'linear-gradient(135deg, #e17055 0%, #fab1a0 100%)',
  'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
  'linear-gradient(135deg, #be123c 0%, #9f1239 100%)',
  'linear-gradient(135deg, #fda4af 0%, #fff1f2 100%)',
  'linear-gradient(135deg, #d4a574 0%, #e8a87c 100%)',
]

// ─── Categories ──────────────────────────────────────────────────────
const CATEGORIES: Category[] = [
  { name: 'Bom Dia', icon: <FiSun className="w-4 h-4" />, description: 'Frases de bom dia' },
  { name: 'Boa Noite', icon: <FiMoon className="w-4 h-4" />, description: 'Frases de boa noite' },
  { name: 'Amor', icon: <FiHeart className="w-4 h-4" />, description: 'Frases de amor' },
  { name: 'F\u00e9', icon: <FiStar className="w-4 h-4" />, description: 'Frases de f\u00e9' },
  { name: 'Anivers\u00e1rio', icon: <FiGift className="w-4 h-4" />, description: 'Frases de anivers\u00e1rio' },
  { name: 'Amizade', icon: <FiUsers className="w-4 h-4" />, description: 'Frases de amizade' },
  { name: 'Fam\u00edlia', icon: <FiHome className="w-4 h-4" />, description: 'Frases de fam\u00edlia' },
  { name: 'Reflex\u00e3o', icon: <FiBookOpen className="w-4 h-4" />, description: 'Frases de reflex\u00e3o' },
  { name: 'Gratid\u00e3o', icon: <FiStar className="w-4 h-4" />, description: 'Frases de gratid\u00e3o' },
  { name: 'Religioso', icon: <FiBookOpen className="w-4 h-4" />, description: 'Frases religiosas' },
  { name: 'Humor', icon: <FiSmile className="w-4 h-4" />, description: 'Frases de humor' },
  { name: 'Sexta-feira', icon: <FiMusic className="w-4 h-4" />, description: 'Frases de sexta-feira' },
]

// ─── Content Bank (48 phrases) ──────────────────────────────────────
const CONTENT_BANK: Phrase[] = [
  // Bom Dia (4)
  { id: 'bd01', text: 'Que o sol deste novo dia ilumine seus caminhos e aque\u00e7a seu cora\u00e7\u00e3o com esperan\u00e7a e gratid\u00e3o.', categoria: 'Bom Dia', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=600&h=600&fit=crop', gradientIndex: 0, createdAt: 1700000001000, isNew: true },
  { id: 'bd02', text: 'Bom dia! Que cada passo de hoje te leve mais perto dos seus sonhos. A vida \u00e9 bela demais para ser desperdi\u00e7ada.', categoria: 'Bom Dia', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=600&fit=crop', gradientIndex: 1, createdAt: 1700000002000 },
  { id: 'bd03', text: 'Acorde com gratid\u00e3o no cora\u00e7\u00e3o e um sorriso no rosto. Hoje \u00e9 um presente que merece ser vivido intensamente.', categoria: 'Bom Dia', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=600&h=600&fit=crop', gradientIndex: 2, createdAt: 1700000003000 },
  { id: 'bd04', text: 'Bom dia! Lembre-se: voc\u00ea \u00e9 mais forte do que imagina e mais amado do que sabe.', categoria: 'Bom Dia', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=600&h=600&fit=crop', gradientIndex: 3, createdAt: 1700000004000, isNew: true },

  // Boa Noite (4)
  { id: 'bn01', text: 'Que a noite traga paz ao seu cora\u00e7\u00e3o e que os sonhos sejam t\u00e3o lindos quanto voc\u00ea merece.', categoria: 'Boa Noite', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=600&h=600&fit=crop', gradientIndex: 3, createdAt: 1700000005000, isNew: true },
  { id: 'bn02', text: 'Boa noite! Descanse com a certeza de que amanh\u00e3 ser\u00e1 um dia cheio de novas possibilidades.', categoria: 'Boa Noite', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1475274047050-1d0c55b7b10c?w=600&h=600&fit=crop', gradientIndex: 4, createdAt: 1700000006000 },
  { id: 'bn03', text: 'Durma em paz sabendo que voc\u00ea fez o seu melhor hoje. O universo cuida de quem tem f\u00e9.', categoria: 'Boa Noite', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&h=600&fit=crop', gradientIndex: 5, createdAt: 1700000007000 },
  { id: 'bn04', text: 'A noite \u00e9 o momento de agradecer pelas b\u00ean\u00e7\u00e3os do dia e confiar que amanh\u00e3 ser\u00e1 ainda melhor.', categoria: 'Boa Noite', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1532767153582-b1a0e5145009?w=600&h=600&fit=crop', gradientIndex: 0, createdAt: 1700000008000, isNew: true },

  // Amor (4)
  { id: 'am01', text: 'O amor \u00e9 a for\u00e7a mais poderosa do universo. Quando amamos de verdade, tudo se transforma.', categoria: 'Amor', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&h=600&fit=crop', gradientIndex: 0, createdAt: 1700000009000, isNew: true },
  { id: 'am02', text: 'Amar \u00e9 encontrar no outro a metade que completa nosso cora\u00e7\u00e3o. Voc\u00ea \u00e9 o meu mundo inteiro.', categoria: 'Amor', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=600&h=600&fit=crop', gradientIndex: 1, createdAt: 1700000010000 },
  { id: 'am03', text: 'O verdadeiro amor n\u00e3o conhece dist\u00e2ncia, tempo ou obst\u00e1culos. Ele simplesmente existe e persiste.', categoria: 'Amor', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=600&fit=crop', gradientIndex: 2, createdAt: 1700000011000 },
  { id: 'am04', text: 'O amor que a gente d\u00e1 \u00e9 o \u00fanico que a gente leva. Ame sem medo, viva sem arrependimento.', categoria: 'Amor', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=600&h=600&fit=crop', gradientIndex: 3, createdAt: 1700000012000, isNew: true },

  // Fe (4)
  { id: 'fe01', text: 'A f\u00e9 move montanhas e transforma o imposs\u00edvel em poss\u00edvel. Confie sempre na vontade de Deus.', categoria: 'F\u00e9', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=600&h=600&fit=crop', gradientIndex: 3, createdAt: 1700000013000 },
  { id: 'fe02', text: 'Quando a f\u00e9 fala mais alto que o medo, milagres acontecem. Acredite no poder da sua ora\u00e7\u00e3o.', categoria: 'F\u00e9', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&h=600&fit=crop', gradientIndex: 4, createdAt: 1700000014000, isNew: true },
  { id: 'fe03', text: 'Entregue seus planos nas m\u00e3os de Deus e Ele far\u00e1 infinitamente mais do que voc\u00ea pode imaginar.', categoria: 'F\u00e9', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&h=600&fit=crop', gradientIndex: 5, createdAt: 1700000015000 },
  { id: 'fe04', text: 'N\u00e3o tenha medo, pois Deus est\u00e1 contigo em cada passo. A f\u00e9 \u00e9 o caminho que nos leva adiante.', categoria: 'F\u00e9', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=600&fit=crop', gradientIndex: 0, createdAt: 1700000016000 },

  // Aniversario (4)
  { id: 'an01', text: 'Feliz anivers\u00e1rio! Que este novo ciclo seja repleto de realiza\u00e7\u00f5es, sa\u00fade e muito amor.', categoria: 'Anivers\u00e1rio', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=600&fit=crop', gradientIndex: 0, createdAt: 1700000017000 },
  { id: 'an02', text: 'Parab\u00e9ns! Que cada ano que passa te traga mais sabedoria, alegria e motivos para sorrir.', categoria: 'Anivers\u00e1rio', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&h=600&fit=crop', gradientIndex: 1, createdAt: 1700000018000, isNew: true },
  { id: 'an03', text: 'Neste dia especial, desejo que todos os seus sonhos ganhem asas e alcancem o c\u00e9u.', categoria: 'Anivers\u00e1rio', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&h=600&fit=crop', gradientIndex: 2, createdAt: 1700000019000 },
  { id: 'an04', text: 'Que a vida te surpreenda com as maiores e mais bonitas b\u00ean\u00e7\u00e3os. Feliz anivers\u00e1rio!', categoria: 'Anivers\u00e1rio', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=600&h=600&fit=crop', gradientIndex: 3, createdAt: 1700000020000 },

  // Amizade (4)
  { id: 'az01', text: 'Amigos verdadeiros s\u00e3o como estrelas: nem sempre os vemos, mas sabemos que est\u00e3o l\u00e1.', categoria: 'Amizade', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=600&fit=crop', gradientIndex: 3, createdAt: 1700000021000 },
  { id: 'az02', text: 'A amizade \u00e9 um tesouro que o tempo n\u00e3o desgasta. Obrigado por ser parte da minha hist\u00f3ria.', categoria: 'Amizade', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1522543558187-768b6df7c25c?w=600&h=600&fit=crop', gradientIndex: 4, createdAt: 1700000022000, isNew: true },
  { id: 'az03', text: 'Um amigo de verdade \u00e9 aquele que te faz rir quando voc\u00ea s\u00f3 quer chorar. Gratid\u00e3o por voc\u00ea!', categoria: 'Amizade', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?w=600&h=600&fit=crop', gradientIndex: 5, createdAt: 1700000023000 },
  { id: 'az04', text: 'A dist\u00e2ncia n\u00e3o separa amigos de verdade. O cora\u00e7\u00e3o sabe encurtar qualquer caminho.', categoria: 'Amizade', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1506869640319-fe1a24fd76cb?w=600&h=600&fit=crop', gradientIndex: 0, createdAt: 1700000024000 },

  // Familia (4)
  { id: 'fm01', text: 'Fam\u00edlia \u00e9 onde a vida come\u00e7a e o amor nunca termina. Nosso la\u00e7o \u00e9 eterno e inquebr\u00e1vel.', categoria: 'Fam\u00edlia', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&h=600&fit=crop', gradientIndex: 0, createdAt: 1700000025000 },
  { id: 'fm02', text: 'O maior patrim\u00f4nio que possu\u00edmos \u00e9 a nossa fam\u00edlia. Cuide com carinho de quem te ama.', categoria: 'Fam\u00edlia', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1475503572774-15a45e5d60b9?w=600&h=600&fit=crop', gradientIndex: 1, createdAt: 1700000026000, isNew: true },
  { id: 'fm03', text: 'Fam\u00edlia n\u00e3o \u00e9 sobre sangue. \u00c9 sobre quem est\u00e1 disposto a segurar sua m\u00e3o nos dias dif\u00edceis.', categoria: 'Fam\u00edlia', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=600&h=600&fit=crop', gradientIndex: 2, createdAt: 1700000027000 },
  { id: 'fm04', text: 'Lar \u00e9 onde o cora\u00e7\u00e3o encontra paz. Minha fam\u00edlia \u00e9 meu porto seguro.', categoria: 'Fam\u00edlia', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1484665005710-1e86252a3fde?w=600&h=600&fit=crop', gradientIndex: 3, createdAt: 1700000028000 },

  // Reflexao (4)
  { id: 'rf01', text: 'A vida \u00e9 um espelho: reflete de volta o que voc\u00ea mostra a ela. Escolha sempre o melhor.', categoria: 'Reflex\u00e3o', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop', gradientIndex: 2, createdAt: 1700000029000, isNew: true },
  { id: 'rf02', text: 'N\u00e3o espere o momento perfeito. Tome o momento e fa\u00e7a-o perfeito com sua atitude.', categoria: 'Reflex\u00e3o', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=600&fit=crop', gradientIndex: 3, createdAt: 1700000030000 },
  { id: 'rf03', text: 'Cada dia \u00e9 uma nova chance de reescrever sua hist\u00f3ria. N\u00e3o desista do seu cap\u00edtulo mais bonito.', categoria: 'Reflex\u00e3o', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&h=600&fit=crop', gradientIndex: 4, createdAt: 1700000031000 },
  { id: 'rf04', text: 'O segredo da vida n\u00e3o \u00e9 ter tudo que voc\u00ea quer, mas amar tudo que voc\u00ea tem.', categoria: 'Reflex\u00e3o', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&h=600&fit=crop', gradientIndex: 5, createdAt: 1700000032000 },

  // Gratidao (4)
  { id: 'gr01', text: 'Gratid\u00e3o transforma o que temos em suficiente. Agrade\u00e7a por cada b\u00ean\u00e7\u00e3o, grande ou pequena.', categoria: 'Gratid\u00e3o', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&h=600&fit=crop', gradientIndex: 5, createdAt: 1700000033000 },
  { id: 'gr02', text: 'Ser grato n\u00e3o \u00e9 apenas dizer obrigado, \u00e9 viver reconhecendo que cada dia \u00e9 um presente divino.', categoria: 'Gratid\u00e3o', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=600&h=600&fit=crop', gradientIndex: 0, createdAt: 1700000034000, isNew: true },
  { id: 'gr03', text: 'Comece cada dia agradecendo. A gratid\u00e3o abre portas que o dinheiro n\u00e3o consegue abrir.', categoria: 'Gratid\u00e3o', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=600&h=600&fit=crop', gradientIndex: 1, createdAt: 1700000035000 },
  { id: 'gr04', text: 'A vida \u00e9 feita de pequenos momentos que merecem nossa gratid\u00e3o eterna.', categoria: 'Gratid\u00e3o', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop', gradientIndex: 2, createdAt: 1700000036000 },

  // Religioso (4)
  { id: 'rg01', text: 'Deus n\u00e3o te trouxe at\u00e9 aqui para te abandonar. Confie no Seu plano, Ele sabe o que faz.', categoria: 'Religioso', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=600&h=600&fit=crop', gradientIndex: 1, createdAt: 1700000037000 },
  { id: 'rg02', text: 'O Senhor \u00e9 meu pastor e nada me faltar\u00e1. Em verdes pastos me faz repousar. Salmo 23.', categoria: 'Religioso', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600&h=600&fit=crop', gradientIndex: 2, createdAt: 1700000038000 },
  { id: 'rg03', text: 'Porque Deus tanto amou o mundo que deu o Seu Filho, para que todo o que nele cr\u00ea n\u00e3o pere\u00e7a.', categoria: 'Religioso', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=600&fit=crop', gradientIndex: 3, createdAt: 1700000039000, isNew: true },
  { id: 'rg04', text: 'Tudo posso naquele que me fortalece. A Sua gra\u00e7a me basta em todos os momentos.', categoria: 'Religioso', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=600&fit=crop', gradientIndex: 4, createdAt: 1700000040000 },

  // Humor (4)
  { id: 'hm01', text: 'A vida \u00e9 curta demais para n\u00e3o rir das coisas bobas. Sorria, pois o riso \u00e9 o melhor rem\u00e9dio!', categoria: 'Humor', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?w=600&h=600&fit=crop', gradientIndex: 4, createdAt: 1700000041000 },
  { id: 'hm02', text: 'Se a vida te der lim\u00f5es, fa\u00e7a uma caipirinha! Afinal, estamos no Brasil.', categoria: 'Humor', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=600&h=600&fit=crop', gradientIndex: 5, createdAt: 1700000042000, isNew: true },
  { id: 'hm03', text: 'Meu plano de dieta: como o que quiser e tor\u00e7o pra dar certo. Funcionou at\u00e9 agora!', categoria: 'Humor', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1517960413843-0aee8e2b3285?w=600&h=600&fit=crop', gradientIndex: 0, createdAt: 1700000043000 },
  { id: 'hm04', text: 'N\u00e3o \u00e9 pregui\u00e7a, \u00e9 modo economia de energia. O planeta agradece!', categoria: 'Humor', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=600&h=600&fit=crop', gradientIndex: 1, createdAt: 1700000044000 },

  // Sexta-feira (4)
  { id: 'sx01', text: 'Sexta-feira chegou! Hora de guardar os problemas na gaveta e abrir a porta da alegria.', categoria: 'Sexta-feira', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=600&fit=crop', gradientIndex: 0, createdAt: 1700000045000, isNew: true },
  { id: 'sx02', text: 'Sextou! Que este final de semana seja regado de boas risadas, boa m\u00fasica e muita paz.', categoria: 'Sexta-feira', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1496024840928-4c417adf211d?w=600&h=600&fit=crop', gradientIndex: 1, createdAt: 1700000046000 },
  { id: 'sx03', text: 'A melhor hora da semana chegou! Bora celebrar a vida nesta sexta-feira maravilhosa.', categoria: 'Sexta-feira', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600&h=600&fit=crop', gradientIndex: 2, createdAt: 1700000047000 },
  { id: 'sx04', text: 'Sexta \u00e9 dia de agradecer pela semana e se preparar para um final de semana incr\u00edvel!', categoria: 'Sexta-feira', emoji: '', imageUrl: 'https://images.unsplash.com/photo-1528495612343-9ca9f4a4de28?w=600&h=600&fit=crop', gradientIndex: 3, createdAt: 1700000048000 },
]

// ─── Helpers ─────────────────────────────────────────────────────────
function getGreeting(hour: number): { text: string; icon: React.ReactNode } {
  if (hour >= 5 && hour < 12) {
    return { text: 'Bom Dia', icon: <FiSun className="w-6 h-6 text-amber-500" /> }
  }
  if (hour >= 12 && hour < 18) {
    return { text: 'Boa Tarde', icon: <FiSun className="w-6 h-6 text-orange-500" /> }
  }
  return { text: 'Boa Noite', icon: <FiMoon className="w-6 h-6 text-indigo-400" /> }
}

function loadPlan(): UserPlan {
  if (typeof window === 'undefined') return 'free'
  return (localStorage.getItem(PLAN_KEY) as UserPlan) || 'free'
}

function savePlan(plan: UserPlan) {
  if (typeof window === 'undefined') return
  localStorage.setItem(PLAN_KEY, plan)
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

function loadFont(): number {
  if (typeof window === 'undefined') return 0
  try {
    const saved = localStorage.getItem(FONT_KEY)
    if (saved !== null) {
      const idx = parseInt(saved, 10)
      if (!isNaN(idx) && idx >= 0 && idx < FONT_OPTIONS.length) return idx
    }
  } catch {
    // silent
  }
  return 0
}

function saveFont(index: number) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(FONT_KEY, String(index))
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

// ─── Ad Slot Placeholder ────────────────────────────────────────────
function AdSlot() {
  return (
    <div className="col-span-2 my-2 py-6 px-4 rounded-[0.875rem] border-2 border-dashed border-border/50 bg-white/30 backdrop-blur-sm flex flex-col items-center justify-center gap-1">
      <span className="text-xs text-muted-foreground/60 font-medium">Espa\u00e7o publicit\u00e1rio</span>
      <span className="text-[10px] text-muted-foreground/40">Ad</span>
    </div>
  )
}

// ─── Notification Banner ────────────────────────────────────────────
function NotificationBanner({ onAccept, onDismiss }: { onAccept: () => void; onDismiss: () => void }) {
  return (
    <div className="mx-4 mb-3 p-3 rounded-[0.875rem] bg-primary/10 border border-primary/20 flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
        <FiBell className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">Receba frases todos os dias!</p>
        <p className="text-xs text-muted-foreground mt-0.5">Ative as notifica\u00e7\u00f5es para n\u00e3o perder nenhuma</p>
      </div>
      <div className="flex flex-col gap-1.5">
        <Button size="sm" className="text-xs h-7 px-3" onClick={onAccept}>Ativar</Button>
        <button className="text-[10px] text-muted-foreground hover:text-foreground" onClick={onDismiss}>Agora n\u00e3o</button>
      </div>
    </div>
  )
}

// ─── Pro Upsell Modal ───────────────────────────────────────────────
function ProUpsellModal({
  isOpen,
  onClose,
  onSubscribe,
}: {
  isOpen: boolean
  onClose: () => void
  onSubscribe: () => void
}) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="sm:max-w-sm p-0 overflow-hidden border-0 bg-card">
        <DialogTitle className="sr-only">Desbloqueie o Plano Pro</DialogTitle>
        <div className="p-6">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <FiAward className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-serif font-bold text-xl text-foreground">Desbloqueie o Plano Pro</h3>
            <p className="text-sm text-muted-foreground mt-1">Aproveite ao m\u00e1ximo o Frases & Imagens</p>
          </div>

          {/* Benefits */}
          <div className="space-y-3 mb-6">
            {[
              "Imagens sem marca d'\u00e1gua",
              'Salve seus favoritos',
              'Sem an\u00fancios',
              'Novos conte\u00fados exclusivos',
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <FiCheck className="w-3.5 h-3.5 text-green-600" />
                </div>
                <span className="text-sm text-foreground">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Price */}
          <div className="text-center mb-5 p-4 rounded-[0.875rem] bg-primary/5 border border-primary/10">
            <span className="text-3xl font-bold text-foreground">R$ 9,90</span>
            <span className="text-sm text-muted-foreground">/m\u00eas</span>
          </div>

          {/* CTA */}
          <Button onClick={onSubscribe} className="w-full h-12 text-base font-semibold gap-2">
            <FiAward className="w-5 h-5" />
            Assinar Pro
          </Button>
          <button
            onClick={onClose}
            className="w-full mt-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors text-center"
          >
            Continuar gr\u00e1tis
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Pro Status Pill ────────────────────────────────────────────────
function ProStatusPill({
  isPro,
  notifEnabled,
  onClick,
}: {
  isPro: boolean
  notifEnabled: boolean
  onClick: () => void
}) {
  return (
    <div className="flex items-center gap-2">
      {notifEnabled && (
        <div className="p-1.5 rounded-full bg-primary/10" title="Notifica\u00e7\u00f5es ativas">
          <FiBell className="w-3.5 h-3.5 text-primary" />
        </div>
      )}
      <button
        onClick={onClick}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${isPro ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25' : 'bg-white/60 backdrop-blur-sm text-muted-foreground border border-border hover:bg-white/80'}`}
      >
        {isPro ? (
          <>
            <FiAward className="w-3.5 h-3.5" />
            <span>PRO</span>
          </>
        ) : (
          <span>Gr\u00e1tis</span>
        )}
      </button>
    </div>
  )
}

// ─── Font Selector Strip ────────────────────────────────────────────
function FontSelectorStrip({
  selectedFont,
  onFontChange,
}: {
  selectedFont: number
  onFontChange: (index: number) => void
}) {
  return (
    <div className="px-4 py-2">
      <div className="overflow-x-auto flex gap-2 no-scrollbar pb-1">
        {FONT_OPTIONS.map((font, idx) => (
          <button
            key={font.name}
            onClick={() => onFontChange(idx)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${selectedFont === idx ? 'bg-white/40 text-white shadow-md' : 'bg-white/15 text-white/70 hover:bg-white/25 hover:text-white'}`}
            style={{
              fontFamily: font.family,
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          >
            {font.name}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Phrase Card ─────────────────────────────────────────────────────
function PhraseCard({
  phrase,
  isFavorited,
  onToggleFavorite,
  onCardClick,
  isPro,
  selectedFont,
}: {
  phrase: Phrase
  isFavorited: boolean
  onToggleFavorite: (id: string) => void
  onCardClick: (phrase: Phrase) => void
  isPro: boolean
  selectedFont: number
}) {
  const gradient = CARD_GRADIENTS[phrase.gradientIndex % CARD_GRADIENTS.length]
  const hasImage = !!phrase.imageUrl
  const fontFamily = FONT_OPTIONS[selectedFont]?.family ?? FONT_OPTIONS[0].family

  return (
    <div
      className="relative rounded-[0.875rem] overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform duration-300 shadow-md"
      style={{
        backgroundImage: hasImage ? `url(${phrase.imageUrl})` : undefined,
        background: hasImage ? undefined : gradient,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
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
          <p className="text-sm font-medium leading-relaxed tracking-tight text-white" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)', fontFamily }}>
            {phrase.text.length > 120 ? phrase.text.substring(0, 120) + '...' : phrase.text}
          </p>
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs font-medium opacity-80 text-white">
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
              <FaRegHeart className="w-3.5 h-3.5 text-white" />
            )}
          </button>
        </div>
      </div>
      {/* Watermark for free users */}
      {!isPro && (
        <div className="absolute bottom-1 right-2 z-10 flex items-center gap-1 opacity-50">
          <FiImage className="w-2.5 h-2.5 text-white" />
          <span className="text-[8px] text-white font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
            Frases & Imagens
          </span>
        </div>
      )}
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
  isPro,
  onProUpsell,
  selectedFont,
  onFontChange,
}: {
  phrase: Phrase
  phrases: Phrase[]
  isFavorited: boolean
  onToggleFavorite: (id: string) => void
  onClose: () => void
  onNavigate: (direction: 'prev' | 'next') => void
  isPro: boolean
  onProUpsell: () => void
  selectedFont: number
  onFontChange: (index: number) => void
}) {
  const gradient = CARD_GRADIENTS[phrase.gradientIndex % CARD_GRADIENTS.length]
  const currentIndex = phrases.findIndex((p) => p.id === phrase.id)
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < phrases.length - 1
  const hasImage = !!phrase.imageUrl
  const fontFamily = FONT_OPTIONS[selectedFont]?.family ?? FONT_OPTIONS[0].family

  const handleFavoriteClick = useCallback(() => {
    if (!isPro) {
      onProUpsell()
      return
    }
    onToggleFavorite(phrase.id)
  }, [isPro, onProUpsell, onToggleFavorite, phrase.id])

  const handleDownloadClick = useCallback(() => {
    if (!isPro) {
      onProUpsell()
      return
    }
    // Simulated download for pro users
    if (phrase.imageUrl) {
      const link = document.createElement('a')
      link.href = phrase.imageUrl
      link.target = '_blank'
      link.download = `frase-${phrase.id}.jpg`
      link.click()
    }
  }, [isPro, onProUpsell, phrase.imageUrl, phrase.id])

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{
        backgroundImage: hasImage ? `url(${phrase.imageUrl})` : undefined,
        background: hasImage ? undefined : gradient,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
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
            <p className="text-2xl md:text-3xl font-semibold text-white leading-relaxed tracking-tight" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)', fontFamily }}>
              &ldquo;{phrase.text}&rdquo;
            </p>
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

        {/* Watermark for free users */}
        {!isPro && (
          <div className="absolute bottom-44 right-4 z-10 flex items-center gap-1.5 opacity-40">
            <FiImage className="w-3 h-3 text-white" />
            <span className="text-xs text-white font-medium" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
              Frases & Imagens
            </span>
          </div>
        )}

        {/* Font selector strip */}
        <FontSelectorStrip selectedFont={selectedFont} onFontChange={onFontChange} />

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
              onClick={handleFavoriteClick}
              className="p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200 hover:scale-110 relative"
            >
              {isPro && isFavorited ? (
                <FaHeart className="w-5 h-5" />
              ) : (
                <FaRegHeart className="w-5 h-5" />
              )}
              {!isPro && (
                <FiLock className="w-2.5 h-2.5 absolute -top-0.5 -right-0.5 text-white" />
              )}
            </button>
            <Button
              onClick={handleDownloadClick}
              className="flex-1 bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm relative"
            >
              <FiDownload className="w-4 h-4 mr-2" />
              Baixar
              {!isPro && <FiLock className="w-3 h-3 ml-1 opacity-60" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Home Feed View ──────────────────────────────────────────────────
function HomeFeedView({
  phrases,
  favorites,
  onToggleFavorite,
  onCardClick,
  greeting,
  isPro,
  showNotifBanner,
  onNotifAccept,
  onNotifDismiss,
  notifEnabled,
  onProPillClick,
  selectedFont,
}: {
  phrases: Phrase[]
  favorites: string[]
  onToggleFavorite: (id: string) => void
  onCardClick: (phrase: Phrase) => void
  greeting: { text: string; icon: React.ReactNode }
  isPro: boolean
  showNotifBanner: boolean
  onNotifAccept: () => void
  onNotifDismiss: () => void
  notifEnabled: boolean
  onProPillClick: () => void
  selectedFont: number
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
          <ProStatusPill isPro={isPro} notifEnabled={notifEnabled} onClick={onProPillClick} />
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

      {/* Notification Banner */}
      {showNotifBanner && (
        <NotificationBanner onAccept={onNotifAccept} onDismiss={onNotifDismiss} />
      )}

      {/* Phrase grid */}
      <ScrollArea className="flex-1 px-4 pb-20">
        <div className="grid grid-cols-2 gap-3 pb-4">
          {filteredPhrases.map((phrase, idx) => (
            <React.Fragment key={phrase.id}>
              <PhraseCard
                phrase={phrase}
                isFavorited={favorites.includes(phrase.id)}
                onToggleFavorite={onToggleFavorite}
                onCardClick={onCardClick}
                isPro={isPro}
                selectedFont={selectedFont}
              />
              {!isPro && (idx + 1) % 8 === 0 && idx < filteredPhrases.length - 1 && <AdSlot />}
            </React.Fragment>
          ))}
        </div>
        {filteredPhrases.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FiBookOpen className="w-10 h-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground font-medium">Nenhuma frase nesta categoria.</p>
            <p className="text-xs text-muted-foreground mt-1">Tente outra categoria!</p>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

// ─── Categories Grid View ────────────────────────────────────────────
function CategoriesGridView({
  phrases,
  onCategorySelect,
}: {
  phrases: Phrase[]
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
  isPro,
  selectedFont,
}: {
  categoryName: string
  phrases: Phrase[]
  favorites: string[]
  onToggleFavorite: (id: string) => void
  onCardClick: (phrase: Phrase) => void
  onBack: () => void
  isPro: boolean
  selectedFont: number
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
      <ScrollArea className="flex-1 px-4 pb-20">
        <div className="grid grid-cols-2 gap-3 pb-4">
          {categoryPhrases.map((phrase, idx) => (
            <React.Fragment key={phrase.id}>
              <PhraseCard
                phrase={phrase}
                isFavorited={favorites.includes(phrase.id)}
                onToggleFavorite={onToggleFavorite}
                onCardClick={onCardClick}
                isPro={isPro}
                selectedFont={selectedFont}
              />
              {!isPro && (idx + 1) % 8 === 0 && idx < categoryPhrases.length - 1 && <AdSlot />}
            </React.Fragment>
          ))}
        </div>
        {categoryPhrases.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FiBookOpen className="w-10 h-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground font-medium">Nenhuma frase nesta categoria ainda.</p>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

// ─── Search View ─────────────────────────────────────────────────────
function SearchView({
  phrases,
  favorites,
  onToggleFavorite,
  onCardClick,
  isPro,
  selectedFont,
}: {
  phrases: Phrase[]
  favorites: string[]
  onToggleFavorite: (id: string) => void
  onCardClick: (phrase: Phrase) => void
  isPro: boolean
  selectedFont: number
}) {
  const [query, setQuery] = useState('')
  const suggestions = ['bom dia', 'Deus', 'saudade', 'anivers\u00e1rio', 'amor', 'f\u00e9']

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
              isPro={isPro}
              selectedFont={selectedFont}
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
            <p className="text-xs text-muted-foreground mt-1">Digite palavras-chave ou escolha uma sugest\u00e3o acima</p>
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
  isPro,
  onProUpsell,
  selectedFont,
}: {
  phrases: Phrase[]
  favorites: string[]
  onToggleFavorite: (id: string) => void
  onCardClick: (phrase: Phrase) => void
  isPro: boolean
  onProUpsell: () => void
  selectedFont: number
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
          {isPro && favoritePhrases.length > 0 && (
            <Badge variant="secondary" className="text-xs">{favoritePhrases.length}</Badge>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1 px-4 pb-20">
        {!isPro ? (
          /* Free user upsell */
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <FiLock className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-serif font-semibold text-foreground mb-2">Recurso exclusivo Pro</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">Assine o plano Pro para salvar suas frases favoritas e acess\u00e1-las sempre que quiser!</p>
            <Button onClick={onProUpsell} className="gap-2">
              <FiAward className="w-4 h-4" />
              Conhecer o Pro
            </Button>
          </div>
        ) : favoritePhrases.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 pb-4">
            {favoritePhrases.map((phrase) => (
              <div key={phrase.id} className="relative">
                <PhraseCard
                  phrase={phrase}
                  isFavorited={true}
                  onToggleFavorite={onToggleFavorite}
                  onCardClick={onCardClick}
                  isPro={isPro}
                  selectedFont={selectedFont}
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
            <p className="text-xs text-muted-foreground mt-2 max-w-xs">Favorite imagens para encontr\u00e1-las aqui! Toque no cora\u00e7\u00e3o em qualquer frase.</p>
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
    { id: 'home', label: 'In\u00edcio', icon: <FiHome className="w-5 h-5" /> },
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

// ─── Pro Confirmation Dialog ────────────────────────────────────────
function ProConfirmationDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="sm:max-w-xs p-0 overflow-hidden border-0 bg-card">
        <DialogTitle className="sr-only">Voc\u00ea \u00e9 Pro</DialogTitle>
        <div className="p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <FiAward className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-serif font-bold text-lg text-foreground mb-1">Voc\u00ea \u00e9 Pro!</h3>
          <p className="text-sm text-muted-foreground mb-4">Aproveite todos os recursos sem restri\u00e7\u00f5es.</p>
          <Button onClick={onClose} className="w-full">Entendi</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────
export default function Page() {
  const [phrases] = useState<Phrase[]>(CONTENT_BANK)
  const [favorites, setFavorites] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState('home')
  const [selectedPhrase, setSelectedPhrase] = useState<Phrase | null>(null)
  const [greeting, setGreeting] = useState<{ text: string; icon: React.ReactNode }>({ text: 'Bom Dia', icon: <FiSun className="w-6 h-6 text-amber-500" /> })
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Plan state
  const [isPro, setIsPro] = useState(false)
  const [showProModal, setShowProModal] = useState(false)
  const [showProConfirm, setShowProConfirm] = useState(false)

  // Notification state
  const [showNotifBanner, setShowNotifBanner] = useState(false)
  const [notifEnabled, setNotifEnabled] = useState(false)

  // Font state
  const [selectedFont, setSelectedFont] = useState(0)

  // Initialize greeting, favorites, plan, notifications, font
  useEffect(() => {
    const hour = new Date().getHours()
    setGreeting(getGreeting(hour))
    setFavorites(loadFavorites())

    const plan = loadPlan()
    setIsPro(plan === 'pro')

    const asked = localStorage.getItem('frases-notif-asked')
    const enabled = localStorage.getItem('frases-notif-enabled')
    if (enabled === 'true') setNotifEnabled(true)
    if (!asked && !enabled) setShowNotifBanner(true)

    setSelectedFont(loadFont())
  }, [])

  // Font change handler
  const handleFontChange = useCallback((index: number) => {
    setSelectedFont(index)
    saveFont(index)
  }, [])

  // Notification handlers
  const handleNotifAccept = useCallback(() => {
    if ('Notification' in window) {
      Notification.requestPermission().then((perm) => {
        if (perm === 'granted') {
          localStorage.setItem('frases-notif-enabled', 'true')
          setNotifEnabled(true)
        }
      })
    }
    localStorage.setItem('frases-notif-asked', 'true')
    setShowNotifBanner(false)
  }, [])

  const handleNotifDismiss = useCallback(() => {
    localStorage.setItem('frases-notif-asked', 'true')
    setShowNotifBanner(false)
  }, [])

  // Pro subscription handler
  const handleSubscribe = useCallback(() => {
    savePlan('pro')
    setIsPro(true)
    setShowProModal(false)
  }, [])

  // Pro pill click handler
  const handleProPillClick = useCallback(() => {
    if (isPro) {
      setShowProConfirm(true)
    } else {
      setShowProModal(true)
    }
  }, [isPro])

  // Favorite handler (gated behind isPro)
  const toggleFavorite = useCallback((id: string) => {
    if (!isPro) {
      setShowProModal(true)
      return
    }
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
      saveFavorites(next)
      return next
    })
  }, [isPro])

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

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab)
    setSelectedCategory(null)
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
          isPro={isPro}
          selectedFont={selectedFont}
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
            greeting={greeting}
            isPro={isPro}
            showNotifBanner={showNotifBanner}
            onNotifAccept={handleNotifAccept}
            onNotifDismiss={handleNotifDismiss}
            notifEnabled={notifEnabled}
            onProPillClick={handleProPillClick}
            selectedFont={selectedFont}
          />
        )
      case 'categories':
        return (
          <CategoriesGridView
            phrases={phrases}
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
            isPro={isPro}
            selectedFont={selectedFont}
          />
        )
      case 'favorites':
        return (
          <FavoritesView
            phrases={phrases}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onCardClick={handleCardClick}
            isPro={isPro}
            onProUpsell={() => setShowProModal(true)}
            selectedFont={selectedFont}
          />
        )
      default:
        return null
    }
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground font-sans max-w-lg mx-auto relative">
        {/* Main content area */}
        <div className="h-screen flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            {renderContent()}
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
            isPro={isPro}
            onProUpsell={() => setShowProModal(true)}
            selectedFont={selectedFont}
            onFontChange={handleFontChange}
          />
        )}

        {/* Pro Upsell Modal */}
        <ProUpsellModal
          isOpen={showProModal}
          onClose={() => setShowProModal(false)}
          onSubscribe={handleSubscribe}
        />

        {/* Pro Confirmation Dialog */}
        <ProConfirmationDialog
          isOpen={showProConfirm}
          onClose={() => setShowProConfirm(false)}
        />
      </div>
    </ErrorBoundary>
  )
}
