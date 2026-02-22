import 'package:flutter/material.dart';
import '../models/phrase.dart';

/// Lista de categorias com icones Material Design
/// No Flutter usamos IconData ao inves de React components
const List<Category> categories = [
  Category(name: 'Bom Dia', iconName: 'wb_sunny', description: 'Frases de bom dia'),
  Category(name: 'Boa Noite', iconName: 'nights_stay', description: 'Frases de boa noite'),
  Category(name: 'Amor', iconName: 'favorite', description: 'Frases de amor'),
  Category(name: 'Fé', iconName: 'star', description: 'Frases de fé'),
  Category(name: 'Aniversário', iconName: 'card_giftcard', description: 'Frases de aniversário'),
  Category(name: 'Amizade', iconName: 'people', description: 'Frases de amizade'),
  Category(name: 'Família', iconName: 'home', description: 'Frases de família'),
  Category(name: 'Reflexão', iconName: 'menu_book', description: 'Frases de reflexão'),
  Category(name: 'Gratidão', iconName: 'stars', description: 'Frases de gratidão'),
  Category(name: 'Religioso', iconName: 'auto_stories', description: 'Frases religiosas'),
  Category(name: 'Humor', iconName: 'sentiment_very_satisfied', description: 'Frases de humor'),
  Category(name: 'Sexta-feira', iconName: 'music_note', description: 'Frases de sexta-feira'),
];

/// Mapeia nome do icone para IconData do Material Design
IconData getCategoryIcon(String iconName) {
  switch (iconName) {
    case 'wb_sunny':
      return Icons.wb_sunny;
    case 'nights_stay':
      return Icons.nights_stay;
    case 'favorite':
      return Icons.favorite;
    case 'star':
      return Icons.star;
    case 'card_giftcard':
      return Icons.card_giftcard;
    case 'people':
      return Icons.people;
    case 'home':
      return Icons.home;
    case 'menu_book':
      return Icons.menu_book;
    case 'stars':
      return Icons.stars;
    case 'auto_stories':
      return Icons.auto_stories;
    case 'sentiment_very_satisfied':
      return Icons.sentiment_very_satisfied;
    case 'music_note':
      return Icons.music_note;
    default:
      return Icons.format_quote;
  }
}
