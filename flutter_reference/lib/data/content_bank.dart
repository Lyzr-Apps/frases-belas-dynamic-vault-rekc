import '../models/phrase.dart';

/// Banco de conteudo com 48 frases pre-definidas
/// Cada frase tem imagem Unsplash correspondente ao tema
const List<Phrase> contentBank = [
  // ─── Bom Dia (4) ───────────────────────────────────────────
  Phrase(
    id: 'bd01',
    text: 'Que o sol deste novo dia ilumine seus caminhos e aqueça seu coração com esperança e gratidão.',
    categoria: 'Bom Dia',
    imageUrl: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=600&h=600&fit=crop',
    gradientIndex: 0,
    isNew: true,
  ),
  Phrase(
    id: 'bd02',
    text: 'Bom dia! Que cada passo de hoje te leve mais perto dos seus sonhos. A vida é bela demais para ser desperdiçada.',
    categoria: 'Bom Dia',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=600&fit=crop',
    gradientIndex: 1,
  ),
  Phrase(
    id: 'bd03',
    text: 'Acorde com gratidão no coração e um sorriso no rosto. Hoje é um presente que merece ser vivido intensamente.',
    categoria: 'Bom Dia',
    imageUrl: 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=600&h=600&fit=crop',
    gradientIndex: 2,
  ),
  Phrase(
    id: 'bd04',
    text: 'Bom dia! Lembre-se: você é mais forte do que imagina e mais amado do que sabe.',
    categoria: 'Bom Dia',
    imageUrl: 'https://images.unsplash.com/photo-1501973801540-537f08ccae7b?w=600&h=600&fit=crop',
    gradientIndex: 3,
    isNew: true,
  ),

  // ─── Boa Noite (4) ─────────────────────────────────────────
  Phrase(
    id: 'bn01',
    text: 'Que a noite traga paz ao seu coração e que os sonhos sejam tão lindos quanto você merece.',
    categoria: 'Boa Noite',
    imageUrl: 'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=600&h=600&fit=crop',
    gradientIndex: 3,
    isNew: true,
  ),
  Phrase(
    id: 'bn02',
    text: 'Boa noite! Descanse com a certeza de que amanhã será um dia cheio de novas possibilidades.',
    categoria: 'Boa Noite',
    imageUrl: 'https://images.unsplash.com/photo-1444080748397-f442aa95c3e5?w=600&h=600&fit=crop',
    gradientIndex: 4,
  ),
  Phrase(
    id: 'bn03',
    text: 'Durma em paz sabendo que você fez o seu melhor hoje. O universo cuida de quem tem fé.',
    categoria: 'Boa Noite',
    imageUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&h=600&fit=crop',
    gradientIndex: 5,
  ),
  Phrase(
    id: 'bn04',
    text: 'A noite é o momento de agradecer pelas bênçãos do dia e confiar que amanhã será ainda melhor.',
    categoria: 'Boa Noite',
    imageUrl: 'https://images.unsplash.com/photo-1532767153582-b1a0e5145009?w=600&h=600&fit=crop',
    gradientIndex: 0,
    isNew: true,
  ),

  // ─── Amor (4) ──────────────────────────────────────────────
  Phrase(
    id: 'am01',
    text: 'O amor é a força mais poderosa do universo. Quando amamos de verdade, tudo se transforma.',
    categoria: 'Amor',
    imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&h=600&fit=crop',
    gradientIndex: 0,
    isNew: true,
  ),
  Phrase(
    id: 'am02',
    text: 'Amar é encontrar no outro a metade que completa nosso coração. Você é o meu mundo inteiro.',
    categoria: 'Amor',
    imageUrl: 'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=600&h=600&fit=crop',
    gradientIndex: 1,
  ),
  Phrase(
    id: 'am03',
    text: 'O verdadeiro amor não conhece distância, tempo ou obstáculos. Ele simplesmente existe e persiste.',
    categoria: 'Amor',
    imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=600&fit=crop',
    gradientIndex: 2,
  ),
  Phrase(
    id: 'am04',
    text: 'O amor que a gente dá é o único que a gente leva. Ame sem medo, viva sem arrependimento.',
    categoria: 'Amor',
    imageUrl: 'https://images.unsplash.com/photo-1494972308805-463bc619d34e?w=600&h=600&fit=crop',
    gradientIndex: 3,
    isNew: true,
  ),

  // ─── Fé (4) ────────────────────────────────────────────────
  Phrase(
    id: 'fe01',
    text: 'A fé move montanhas e transforma o impossível em possível. Confie sempre na vontade de Deus.',
    categoria: 'Fé',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=600&fit=crop',
    gradientIndex: 3,
  ),
  Phrase(
    id: 'fe02',
    text: 'Quando a fé fala mais alto que o medo, milagres acontecem. Acredite no poder da sua oração.',
    categoria: 'Fé',
    imageUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&h=600&fit=crop',
    gradientIndex: 4,
    isNew: true,
  ),
  Phrase(
    id: 'fe03',
    text: 'Entregue seus planos nas mãos de Deus e Ele fará infinitamente mais do que você pode imaginar.',
    categoria: 'Fé',
    imageUrl: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&h=600&fit=crop',
    gradientIndex: 5,
  ),
  Phrase(
    id: 'fe04',
    text: 'Não tenha medo, pois Deus está contigo em cada passo. A fé é o caminho que nos leva adiante.',
    categoria: 'Fé',
    imageUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=600&h=600&fit=crop',
    gradientIndex: 0,
  ),

  // ─── Aniversário (4) ───────────────────────────────────────
  Phrase(
    id: 'an01',
    text: 'Feliz aniversário! Que este novo ciclo seja repleto de realizações, saúde e muito amor.',
    categoria: 'Aniversário',
    imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=600&fit=crop',
    gradientIndex: 0,
  ),
  Phrase(
    id: 'an02',
    text: 'Parabéns! Que cada ano que passa te traga mais sabedoria, alegria e motivos para sorrir.',
    categoria: 'Aniversário',
    imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&h=600&fit=crop',
    gradientIndex: 1,
    isNew: true,
  ),
  Phrase(
    id: 'an03',
    text: 'Neste dia especial, desejo que todos os seus sonhos ganhem asas e alcancem o céu.',
    categoria: 'Aniversário',
    imageUrl: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&h=600&fit=crop',
    gradientIndex: 2,
  ),
  Phrase(
    id: 'an04',
    text: 'Que a vida te surpreenda com as maiores e mais bonitas bênçãos. Feliz aniversário!',
    categoria: 'Aniversário',
    imageUrl: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=600&h=600&fit=crop',
    gradientIndex: 3,
  ),

  // ─── Amizade (4) ───────────────────────────────────────────
  Phrase(
    id: 'az01',
    text: 'Amigos verdadeiros são como estrelas: nem sempre os vemos, mas sabemos que estão lá.',
    categoria: 'Amizade',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=600&fit=crop',
    gradientIndex: 3,
  ),
  Phrase(
    id: 'az02',
    text: 'A amizade é um tesouro que o tempo não desgasta. Obrigado por ser parte da minha história.',
    categoria: 'Amizade',
    imageUrl: 'https://images.unsplash.com/photo-1522543558187-768b6df7c25c?w=600&h=600&fit=crop',
    gradientIndex: 4,
    isNew: true,
  ),
  Phrase(
    id: 'az03',
    text: 'Um amigo de verdade é aquele que te faz rir quando você só quer chorar. Gratidão por você!',
    categoria: 'Amizade',
    imageUrl: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?w=600&h=600&fit=crop',
    gradientIndex: 5,
  ),
  Phrase(
    id: 'az04',
    text: 'A distância não separa amigos de verdade. O coração sabe encurtar qualquer caminho.',
    categoria: 'Amizade',
    imageUrl: 'https://images.unsplash.com/photo-1516939884455-1445c8652f83?w=600&h=600&fit=crop',
    gradientIndex: 0,
  ),

  // ─── Família (4) ───────────────────────────────────────────
  Phrase(
    id: 'fm01',
    text: 'Família é onde a vida começa e o amor nunca termina. Nosso laço é eterno e inquebrável.',
    categoria: 'Família',
    imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&h=600&fit=crop',
    gradientIndex: 0,
  ),
  Phrase(
    id: 'fm02',
    text: 'O maior patrimônio que possuímos é a nossa família. Cuide com carinho de quem te ama.',
    categoria: 'Família',
    imageUrl: 'https://images.unsplash.com/photo-1475503572774-15a45e5d60b9?w=600&h=600&fit=crop',
    gradientIndex: 1,
    isNew: true,
  ),
  Phrase(
    id: 'fm03',
    text: 'Família não é sobre sangue. É sobre quem está disposto a segurar sua mão nos dias difíceis.',
    categoria: 'Família',
    imageUrl: 'https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=600&h=600&fit=crop',
    gradientIndex: 2,
  ),
  Phrase(
    id: 'fm04',
    text: 'Lar é onde o coração encontra paz. Minha família é meu porto seguro.',
    categoria: 'Família',
    imageUrl: 'https://images.unsplash.com/photo-1523301343968-6a6ebf63c672?w=600&h=600&fit=crop',
    gradientIndex: 3,
  ),

  // ─── Reflexão (4) ──────────────────────────────────────────
  Phrase(
    id: 'rf01',
    text: 'A vida é um espelho: reflete de volta o que você mostra a ela. Escolha sempre o melhor.',
    categoria: 'Reflexão',
    imageUrl: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&h=600&fit=crop',
    gradientIndex: 2,
    isNew: true,
  ),
  Phrase(
    id: 'rf02',
    text: 'Não espere o momento perfeito. Tome o momento e faça-o perfeito com sua atitude.',
    categoria: 'Reflexão',
    imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=600&fit=crop',
    gradientIndex: 3,
  ),
  Phrase(
    id: 'rf03',
    text: 'Cada dia é uma nova chance de reescrever sua história. Não desista do seu capítulo mais bonito.',
    categoria: 'Reflexão',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop',
    gradientIndex: 4,
  ),
  Phrase(
    id: 'rf04',
    text: 'O segredo da vida não é ter tudo que você quer, mas amar tudo que você tem.',
    categoria: 'Reflexão',
    imageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&h=600&fit=crop',
    gradientIndex: 5,
  ),

  // ─── Gratidão (4) ──────────────────────────────────────────
  Phrase(
    id: 'gr01',
    text: 'Gratidão transforma o que temos em suficiente. Agradeça por cada bênção, grande ou pequena.',
    categoria: 'Gratidão',
    imageUrl: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=600&h=600&fit=crop',
    gradientIndex: 5,
  ),
  Phrase(
    id: 'gr02',
    text: 'Ser grato não é apenas dizer obrigado, é viver reconhecendo que cada dia é um presente divino.',
    categoria: 'Gratidão',
    imageUrl: 'https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?w=600&h=600&fit=crop',
    gradientIndex: 0,
    isNew: true,
  ),
  Phrase(
    id: 'gr03',
    text: 'Comece cada dia agradecendo. A gratidão abre portas que o dinheiro não consegue abrir.',
    categoria: 'Gratidão',
    imageUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&h=600&fit=crop',
    gradientIndex: 1,
  ),
  Phrase(
    id: 'gr04',
    text: 'A vida é feita de pequenos momentos que merecem nossa gratidão eterna.',
    categoria: 'Gratidão',
    imageUrl: 'https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=600&h=600&fit=crop',
    gradientIndex: 2,
  ),

  // ─── Religioso (4) ─────────────────────────────────────────
  Phrase(
    id: 'rg01',
    text: 'Deus não te trouxe até aqui para te abandonar. Confie no Seu plano, Ele sabe o que faz.',
    categoria: 'Religioso',
    imageUrl: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=600&h=600&fit=crop',
    gradientIndex: 1,
  ),
  Phrase(
    id: 'rg02',
    text: 'O Senhor é meu pastor e nada me faltará. Em verdes pastos me faz repousar. Salmo 23.',
    categoria: 'Religioso',
    imageUrl: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600&h=600&fit=crop',
    gradientIndex: 2,
  ),
  Phrase(
    id: 'rg03',
    text: 'Porque Deus tanto amou o mundo que deu o Seu Filho, para que todo o que nele crê não pereça.',
    categoria: 'Religioso',
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=600&fit=crop',
    gradientIndex: 3,
    isNew: true,
  ),
  Phrase(
    id: 'rg04',
    text: 'Tudo posso naquele que me fortalece. A Sua graça me basta em todos os momentos.',
    categoria: 'Religioso',
    imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=600&fit=crop',
    gradientIndex: 4,
  ),

  // ─── Humor (4) ─────────────────────────────────────────────
  Phrase(
    id: 'hm01',
    text: 'A vida é curta demais para não rir das coisas bobas. Sorria, pois o riso é o melhor remédio!',
    categoria: 'Humor',
    imageUrl: 'https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?w=600&h=600&fit=crop',
    gradientIndex: 4,
  ),
  Phrase(
    id: 'hm02',
    text: 'Se a vida te der limões, faça uma caipirinha! Afinal, estamos no Brasil.',
    categoria: 'Humor',
    imageUrl: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=600&h=600&fit=crop',
    gradientIndex: 5,
    isNew: true,
  ),
  Phrase(
    id: 'hm03',
    text: 'Meu plano de dieta: como o que quiser e torço pra dar certo. Funcionou até agora!',
    categoria: 'Humor',
    imageUrl: 'https://images.unsplash.com/photo-1517960413843-0aee8e2b3285?w=600&h=600&fit=crop',
    gradientIndex: 0,
  ),
  Phrase(
    id: 'hm04',
    text: 'Não é preguiça, é modo economia de energia. O planeta agradece!',
    categoria: 'Humor',
    imageUrl: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=600&h=600&fit=crop',
    gradientIndex: 1,
  ),

  // ─── Sexta-feira (4) ───────────────────────────────────────
  Phrase(
    id: 'sx01',
    text: 'Sexta-feira chegou! Hora de guardar os problemas na gaveta e abrir a porta da alegria.',
    categoria: 'Sexta-feira',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=600&fit=crop',
    gradientIndex: 0,
    isNew: true,
  ),
  Phrase(
    id: 'sx02',
    text: 'Sextou! Que este final de semana seja regado de boas risadas, boa música e muita paz.',
    categoria: 'Sexta-feira',
    imageUrl: 'https://images.unsplash.com/photo-1476673160081-cf065607f449?w=600&h=600&fit=crop',
    gradientIndex: 1,
  ),
  Phrase(
    id: 'sx03',
    text: 'A melhor hora da semana chegou! Bora celebrar a vida nesta sexta-feira maravilhosa.',
    categoria: 'Sexta-feira',
    imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=600&fit=crop',
    gradientIndex: 2,
  ),
  Phrase(
    id: 'sx04',
    text: 'Sexta é dia de agradecer pela semana e se preparar para um final de semana incrível!',
    categoria: 'Sexta-feira',
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=600&fit=crop',
    gradientIndex: 3,
  ),
];
