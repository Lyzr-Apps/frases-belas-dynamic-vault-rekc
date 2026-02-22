import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/phrase.dart';
import '../data/gradients.dart';
import '../data/fonts.dart';
import '../theme/app_theme.dart';

/// Card de frase — exibe frase com imagem de fundo ou gradiente
/// Equivale ao PhraseCard do React
class PhraseCard extends StatelessWidget {
  final Phrase phrase;
  final bool isFavorited;
  final VoidCallback onToggleFavorite;
  final VoidCallback onTap;
  final bool isPro;
  final int selectedFont;

  const PhraseCard({
    super.key,
    required this.phrase,
    required this.isFavorited,
    required this.onToggleFavorite,
    required this.onTap,
    required this.isPro,
    required this.selectedFont,
  });

  @override
  Widget build(BuildContext context) {
    final gradient = getCardGradient(phrase.gradientIndex);
    final hasImage = phrase.imageUrl.isNotEmpty;
    final fontFamily = fontOptions[selectedFont].fontFamily;
    final displayText = phrase.text.length > 120
        ? '${phrase.text.substring(0, 120)}...'
        : phrase.text;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        constraints: BoxConstraints(
          minHeight: hasImage ? 200 : 180,
        ),
        decoration: BoxDecoration(
          gradient: gradient,
          borderRadius: BorderRadius.circular(14),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.12),
              blurRadius: 8,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        clipBehavior: Clip.antiAlias,
        child: Stack(
          children: [
            // Imagem de fundo
            if (hasImage)
              Positioned.fill(
                child: CachedNetworkImage(
                  imageUrl: phrase.imageUrl,
                  fit: BoxFit.cover,
                  placeholder: (context, url) => Container(
                    decoration: BoxDecoration(gradient: gradient),
                  ),
                  errorWidget: (context, url, error) => Container(
                    decoration: BoxDecoration(gradient: gradient),
                  ),
                ),
              ),

            // Overlay escuro
            Positioned.fill(
              child: Container(
                decoration: BoxDecoration(
                  gradient: hasImage
                      ? LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [
                            Colors.transparent,
                            Colors.black.withValues(alpha: 0.2),
                            Colors.black.withValues(alpha: 0.7),
                          ],
                          stops: const [0.0, 0.3, 1.0],
                        )
                      : LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [
                            Colors.black.withValues(alpha: 0.0),
                            Colors.black.withValues(alpha: 0.05),
                          ],
                        ),
                ),
              ),
            ),

            // Conteudo
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Badge "Novo" + Texto
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      if (phrase.isNew)
                        Container(
                          margin: const EdgeInsets.only(bottom: 8),
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 3,
                          ),
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.25),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(
                              color: Colors.white.withValues(alpha: 0.3),
                            ),
                          ),
                          child: const Text(
                            'Novo',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 10,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                      Text(
                        displayText,
                        style: GoogleFonts.getFont(
                          fontFamily,
                          textStyle: const TextStyle(
                            color: Colors.white,
                            fontSize: 13,
                            fontWeight: FontWeight.w500,
                            height: 1.4,
                            shadows: [
                              Shadow(
                                color: Color(0x80000000),
                                blurRadius: 4,
                                offset: Offset(0, 1),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 12),

                  // Categoria + Favorito
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        phrase.categoria,
                        style: TextStyle(
                          color: Colors.white.withValues(alpha: 0.8),
                          fontSize: 11,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      GestureDetector(
                        onTap: onToggleFavorite,
                        child: Container(
                          padding: const EdgeInsets.all(6),
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.2),
                            shape: BoxShape.circle,
                          ),
                          child: Icon(
                            isFavorited ? Icons.favorite : Icons.favorite_border,
                            color: Colors.white,
                            size: 14,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // Marca d'agua para free users
            if (!isPro)
              Positioned(
                bottom: 4,
                right: 8,
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      Icons.image,
                      color: Colors.white.withValues(alpha: 0.5),
                      size: 10,
                    ),
                    const SizedBox(width: 2),
                    Text(
                      'Frases & Imagens',
                      style: TextStyle(
                        color: Colors.white.withValues(alpha: 0.5),
                        fontSize: 7,
                        fontWeight: FontWeight.w500,
                        shadows: const [
                          Shadow(
                            color: Color(0x80000000),
                            blurRadius: 2,
                            offset: Offset(0, 1),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }
}
