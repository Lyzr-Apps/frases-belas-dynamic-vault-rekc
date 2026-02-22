import 'package:flutter/material.dart';

/// Gradientes dos cards — mesmos do app Next.js
const List<List<Color>> cardGradients = [
  [Color(0xFFe84393), Color(0xFFfd79a8)], // Rosa vibrante
  [Color(0xFFe17055), Color(0xFFfab1a0)], // Coral
  [Color(0xFFa855f7), Color(0xFFec4899)], // Roxo-rosa
  [Color(0xFFbe123c), Color(0xFF9f1239)], // Vermelho escuro
  [Color(0xFFfda4af), Color(0xFFfff1f2)], // Rosa claro
  [Color(0xFFd4a574), Color(0xFFe8a87c)], // Dourado
];

/// Retorna o LinearGradient para o indice dado
LinearGradient getCardGradient(int index) {
  final colors = cardGradients[index % cardGradients.length];
  return LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: colors,
  );
}
