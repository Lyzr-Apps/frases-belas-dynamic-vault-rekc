import 'package:flutter/material.dart';
import '../models/phrase.dart';
import '../widgets/phrase_card.dart';
import '../theme/app_theme.dart';

/// Tela de busca
/// Equivale ao SearchView do React
class SearchScreen extends StatefulWidget {
  final List<Phrase> phrases;
  final List<String> favorites;
  final ValueChanged<String> onToggleFavorite;
  final ValueChanged<Phrase> onCardTap;
  final bool isPro;
  final int selectedFont;

  const SearchScreen({
    super.key,
    required this.phrases,
    required this.favorites,
    required this.onToggleFavorite,
    required this.onCardTap,
    required this.isPro,
    required this.selectedFont,
  });

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final _controller = TextEditingController();
  String _query = '';

  final _suggestions = ['bom dia', 'Deus', 'saudade', 'aniversario', 'amor', 'fe'];

  List<Phrase> get _filteredPhrases {
    if (_query.trim().isEmpty) return [];
    final q = _query.toLowerCase();
    return widget.phrases
        .where((p) =>
            p.text.toLowerCase().contains(q) ||
            p.categoria.toLowerCase().contains(q))
        .toList();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: [
        // Header + Search
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Busca',
                  style: Theme.of(context).textTheme.headlineMedium,
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: _controller,
                  onChanged: (value) => setState(() => _query = value),
                  decoration: InputDecoration(
                    hintText: 'Buscar frases...',
                    prefixIcon: Icon(Icons.search, color: AppTheme.textMuted),
                  ),
                ),

                // Sugestoes
                if (_query.trim().isEmpty) ...[
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: _suggestions.map((s) {
                      return GestureDetector(
                        onTap: () {
                          _controller.text = s;
                          setState(() => _query = s);
                        },
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 6,
                          ),
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.7),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: AppTheme.border),
                          ),
                          child: Text(
                            s,
                            style: const TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                ],
              ],
            ),
          ),
        ),

        // Results count
        if (_query.trim().isNotEmpty && _filteredPhrases.isNotEmpty)
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Text(
                '${_filteredPhrases.length} resultado(s)',
                style: TextStyle(fontSize: 12, color: AppTheme.textMuted),
              ),
            ),
          ),

        // Results grid
        if (_filteredPhrases.isNotEmpty)
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
                  final phrase = _filteredPhrases[index];
                  return PhraseCard(
                    phrase: phrase,
                    isFavorited: widget.favorites.contains(phrase.id),
                    onToggleFavorite: () => widget.onToggleFavorite(phrase.id),
                    onTap: () => widget.onCardTap(phrase),
                    isPro: widget.isPro,
                    selectedFont: widget.selectedFont,
                  );
                },
                childCount: _filteredPhrases.length,
              ),
            ),
          ),

        // Empty states
        if (_query.trim().isNotEmpty && _filteredPhrases.isEmpty)
          SliverToBoxAdapter(
            child: _emptyState(
              icon: Icons.search_off,
              title: 'Nenhuma frase encontrada.',
              subtitle: 'Tente outra busca!',
            ),
          ),

        if (_query.trim().isEmpty)
          SliverToBoxAdapter(
            child: _emptyState(
              icon: Icons.search,
              title: 'Busque frases inspiracionais',
              subtitle: 'Digite palavras-chave ou escolha uma sugestao acima',
            ),
          ),
      ],
    );
  }

  Widget _emptyState({
    required IconData icon,
    required String title,
    required String subtitle,
  }) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 64),
        child: Column(
          children: [
            Icon(icon, size: 40, color: AppTheme.textMuted),
            const SizedBox(height: 12),
            Text(
              title,
              style: TextStyle(
                color: AppTheme.textMuted,
                fontWeight: FontWeight.w500,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              subtitle,
              style: TextStyle(fontSize: 12, color: AppTheme.textMuted),
            ),
          ],
        ),
      ),
    );
  }
}
