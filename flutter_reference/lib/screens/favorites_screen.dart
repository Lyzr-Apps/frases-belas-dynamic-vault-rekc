import 'package:flutter/material.dart';
import '../models/phrase.dart';
import '../widgets/phrase_card.dart';
import '../theme/app_theme.dart';

/// Tela de favoritos — recurso Pro
/// Equivale ao FavoritesView do React
class FavoritesScreen extends StatelessWidget {
  final List<Phrase> phrases;
  final List<String> favorites;
  final ValueChanged<String> onToggleFavorite;
  final ValueChanged<Phrase> onCardTap;
  final bool isPro;
  final VoidCallback onProUpsell;
  final int selectedFont;

  const FavoritesScreen({
    super.key,
    required this.phrases,
    required this.favorites,
    required this.onToggleFavorite,
    required this.onCardTap,
    required this.isPro,
    required this.onProUpsell,
    required this.selectedFont,
  });

  List<Phrase> get _favoritePhrases =>
      phrases.where((p) => favorites.contains(p.id)).toList();

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: [
        // Header
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
            child: Row(
              children: [
                const Icon(Icons.favorite, color: AppTheme.primary, size: 20),
                const SizedBox(width: 8),
                Text(
                  'Favoritos',
                  style: Theme.of(context).textTheme.headlineMedium,
                ),
                if (isPro && _favoritePhrases.isNotEmpty) ...[
                  const SizedBox(width: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(
                      color: AppTheme.divider,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Text(
                      '${_favoritePhrases.length}',
                      style: const TextStyle(fontSize: 12),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),

        // Content
        if (!isPro)
          // Free user upsell
          SliverFillRemaining(
            hasScrollBody: false,
            child: Center(
              child: Padding(
                padding: const EdgeInsets.all(32),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      width: 64,
                      height: 64,
                      decoration: BoxDecoration(
                        color: AppTheme.primary.withValues(alpha: 0.1),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.lock,
                        color: AppTheme.primary,
                        size: 32,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Recurso exclusivo Pro',
                      style: Theme.of(context).textTheme.headlineSmall,
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Assine o plano Pro para salvar suas frases favoritas e acessa-las sempre que quiser!',
                      style: Theme.of(context).textTheme.bodyMedium,
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 24),
                    ElevatedButton.icon(
                      onPressed: onProUpsell,
                      icon: const Icon(Icons.workspace_premium),
                      label: const Text('Conhecer o Pro'),
                    ),
                  ],
                ),
              ),
            ),
          )
        else if (_favoritePhrases.isNotEmpty)
          SliverPadding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 100),
            sliver: SliverGrid(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
                childAspectRatio: 0.85,
              ),
              delegate: SliverChildBuilderDelegate(
                (context, index) {
                  final phrase = _favoritePhrases[index];
                  return PhraseCard(
                    phrase: phrase,
                    isFavorited: true,
                    onToggleFavorite: () => onToggleFavorite(phrase.id),
                    onTap: () => onCardTap(phrase),
                    isPro: isPro,
                    selectedFont: selectedFont,
                  );
                },
                childCount: _favoritePhrases.length,
              ),
            ),
          )
        else
          // Empty favorites
          SliverFillRemaining(
            hasScrollBody: false,
            child: Center(
              child: Padding(
                padding: const EdgeInsets.all(32),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.favorite_border,
                      size: 48,
                      color: AppTheme.textMuted,
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Nenhum favorito ainda',
                      style: TextStyle(
                        color: AppTheme.textMuted,
                        fontWeight: FontWeight.w500,
                        fontSize: 16,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Favorite imagens para encontra-las aqui! Toque no coracao em qualquer frase.',
                      style: TextStyle(fontSize: 12, color: AppTheme.textMuted),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
            ),
          ),
      ],
    );
  }
}
