/// Opcoes de fonte para o seletor de fontes
/// No Flutter, usamos Google Fonts ou fontes do sistema
class FontOption {
  final String name;
  final String fontFamily;

  const FontOption({required this.name, required this.fontFamily});
}

const List<FontOption> fontOptions = [
  FontOption(name: 'Classica', fontFamily: 'Merriweather'),
  FontOption(name: 'Moderna', fontFamily: 'Roboto'),
  FontOption(name: 'Elegante', fontFamily: 'Playfair Display'),
  FontOption(name: 'Manuscrita', fontFamily: 'Dancing Script'),
  FontOption(name: 'Impacto', fontFamily: 'Oswald'),
  FontOption(name: 'Suave', fontFamily: 'Lora'),
  FontOption(name: 'Minimalista', fontFamily: 'Montserrat'),
  FontOption(name: 'Retro', fontFamily: 'Courier Prime'),
  FontOption(name: 'Delicada', fontFamily: 'Great Vibes'),
  FontOption(name: 'Forte', fontFamily: 'Raleway'),
  FontOption(name: 'Romantica', fontFamily: 'Cormorant Garamond'),
  FontOption(name: 'Divertida', fontFamily: 'Patrick Hand'),
];
