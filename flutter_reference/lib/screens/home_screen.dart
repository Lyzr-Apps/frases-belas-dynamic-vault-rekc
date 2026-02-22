import 'package:flutter/material.dart';
import '../models/phrase.dart';
import '../data/categories.dart' as cat_data;
import '../data/content_bank.dart';
import '../widgets/phrase_card.dart';
import '../widgets/category_chip.dart';
import '../theme/app_theme.dart';

/// Tela principal (Home Feed)
/// Equivale ao HomeFeedView do React
class HomeScreen extends StatefulWidget {
  final List<Phrase> phrases;
  final List<String> favorites;
  final ValueChanged<String> onToggleFavorite;
  final ValueChanged<Phrase> onCardTap;
  final bool isPro;
  final int selectedFont;
  final bool showNotifBanner;
  final VoidCallback onNotifAccept;
  final VoidCallback onNotifDismiss;
  final bool notifEnabled;
  final VoidCallback onProPillTap;

  const HomeScreen({
    super.key,
    required this.phrases,
    required this.favorites,
    required this.onToggleFavorite,
    required this.onCardTap,
    required this.isPro,
    required this.selectedFont,
    required this.showNotifBanner,
    required this.onNotifAccept,
    required this.onNotifDismiss,
    required this.notifEnabled,
    required this.onProPillTap,
  });

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String? _activeCategory;

  String _getGreeting() {
    final hour = DateTime.now().hour;
    if (hour >= 5 && hour < 12) return 'Bom Dia';
    if (hour >= 12 && hour < 18) return 'Boa Tarde';
    return 'Boa Noite';
  }

  IconData _getGreetingIcon() {
    final hour = DateTime.now().hour;
    if (hour >= 5 && hour < 12) return Icons.wb_sunny;
    if (hour >= 12 && hour < 18) return Icons.wb_sunny;
    return Icons.nights_stay;
  }

  Color _getGreetingColor() {
    final hour = DateTime.now().hour;
    if (hour >= 5 && hour < 12) return Colors.amber;
    if (hour >= 12 && hour < 18) return Colors.orange;
    return Colors.indigo.shade300;
  }

  List<Phrase> get _filteredPhrases {
    if (_activeCategory == null) return widget.phrases;
    return widget.phrases.where((p) => p.categoria == _activeCategory).toList();
  }

  Map<String, int> get _categoryCounts {
    final counts = <String, int>{};
    for (final p in widget.phrases) {
      counts[p.categoria] = (counts[p.categoria] ?? 0) + 1;
    }
    return counts;
  }

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: [
        // ─── Header ──────────────────────────────────────────
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Frases & Imagens',
                      style: Theme.of(context).textTheme.headlineMedium,
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        Icon(_getGreetingIcon(), size: 20, color: _getGreetingColor()),
                        const SizedBox(width: 6),
                        Text(
                          '${_getGreeting()}!',
                          style: Theme.of(context).textTheme.bodyMedium,
                        ),
                      ],
                    ),
                  ],
                ),
                // Pro status pill
                GestureDetector(
                  onTap: widget.onProPillTap,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: widget.isPro
                          ? AppTheme.primary
                          : Colors.white.withValues(alpha: 0.6),
                      borderRadius: BorderRadius.circular(20),
                      border: widget.isPro ? null : Border.all(color: AppTheme.border),
                      boxShadow: widget.isPro
                          ? [
                              BoxShadow(
                                color: AppTheme.primary.withValues(alpha: 0.25),
                                blurRadius: 8,
                              ),
                            ]
                          : null,
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        if (widget.isPro) ...[
                          const Icon(Icons.workspace_premium, size: 14, color: Colors.white),
                          const SizedBox(width: 4),
                          const Text(
                            'PRO',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ] else
                          Text(
                            'Gratis',
                            style: TextStyle(
                              color: AppTheme.textMuted,
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),

        // ─── Category chips ──────────────────────────────────
        SliverToBoxAdapter(
          child: SizedBox(
            height: 48,
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              children: [
                // "Todos" chip
                Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: GestureDetector(
                    onTap: () => setState(() => _activeCategory = null),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                      decoration: BoxDecoration(
                        color: _activeCategory == null
                            ? AppTheme.primary
                            : Colors.white.withValues(alpha: 0.75),
                        borderRadius: BorderRadius.circular(20),
                        border: _activeCategory == null
                            ? null
                            : Border.all(color: AppTheme.border),
                      ),
                      child: Text(
                        'Todos',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w500,
                          color: _activeCategory == null
                              ? Colors.white
                              : AppTheme.textPrimary,
                        ),
                      ),
                    ),
                  ),
                ),
                // Category chips
                ...cat_data.categories.map((category) {
                  final isActive = _activeCategory == category.name;
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: CategoryChip(
                      category: category,
                      isActive: isActive,
                      onTap: () {
                        setState(() {
                          _activeCategory = isActive ? null : category.name;
                        });
                      },
                      count: _categoryCounts[category.name] ?? 0,
                    ),
                  );
                }),
              ],
            ),
          ),
        ),

        const SliverToBoxAdapter(child: SizedBox(height: 8)),

        // ─── Notification banner ─────────────────────────────
        if (widget.showNotifBanner)
          SliverToBoxAdapter(
            child: Container(
              margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppTheme.primary.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(
                  color: AppTheme.primary.withValues(alpha: 0.2),
                ),
              ),
              child: Row(
                children: [
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: AppTheme.primary.withValues(alpha: 0.2),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.notifications, color: AppTheme.primary, size: 20),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Receba frases todos os dias!',
                          style: TextStyle(fontSize: 13, fontWeight: FontWeight.w500),
                        ),
                        Text(
                          'Ative as notificacoes para nao perder nenhuma',
                          style: TextStyle(fontSize: 11, color: AppTheme.textMuted),
                        ),
                      ],
                    ),
                  ),
                  Column(
                    children: [
                      SizedBox(
                        height: 28,
                        child: ElevatedButton(
                          onPressed: widget.onNotifAccept,
                          style: ElevatedButton.styleFrom(
                            padding: const EdgeInsets.symmetric(horizontal: 12),
                            textStyle: const TextStyle(fontSize: 11),
                          ),
                          child: const Text('Ativar'),
                        ),
                      ),
                      TextButton(
                        onPressed: widget.onNotifDismiss,
                        child: Text(
                          'Agora nao',
                          style: TextStyle(fontSize: 9, color: AppTheme.textMuted),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),

        // ─── Phrase grid ─────────────────────────────────────
        SliverPadding(
          padding: const EdgeInsets.fromLTRB(16, 8, 16, 100),
          sliver: _filteredPhrases.isEmpty
              ? SliverToBoxAdapter(
                  child: Center(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(vertical: 64),
                      child: Column(
                        children: [
                          Icon(Icons.menu_book, size: 40, color: AppTheme.textMuted),
                          const SizedBox(height: 12),
                          Text(
                            'Nenhuma frase nesta categoria.',
                            style: TextStyle(color: AppTheme.textMuted, fontWeight: FontWeight.w500),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Tente outra categoria!',
                            style: TextStyle(fontSize: 12, color: AppTheme.textMuted),
                          ),
                        ],
                      ),
                    ),
                  ),
                )
              : SliverGrid(
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
      ],
    );
  }
}
