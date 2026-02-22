import 'package:flutter/material.dart';
import '../models/phrase.dart';
import '../data/categories.dart';
import '../data/gradients.dart';
import '../theme/app_theme.dart';

/// Tela de categorias em grid
/// Equivale ao CategoriesGridView do React
class CategoriesScreen extends StatelessWidget {
  final List<Phrase> phrases;
  final ValueChanged<String> onCategorySelect;

  const CategoriesScreen({
    super.key,
    required this.phrases,
    required this.onCategorySelect,
  });

  Map<String, int> get _categoryCounts {
    final counts = <String, int>{};
    for (final p in phrases) {
      counts[p.categoria] = (counts[p.categoria] ?? 0) + 1;
    }
    return counts;
  }

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: [
        // Header
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Categorias',
                  style: Theme.of(context).textTheme.headlineMedium,
                ),
                const SizedBox(height: 4),
                Text(
                  'Explore frases por categoria',
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
              ],
            ),
          ),
        ),

        // Grid
        SliverPadding(
          padding: const EdgeInsets.fromLTRB(16, 8, 16, 100),
          sliver: SliverGrid(
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              childAspectRatio: 1.2,
            ),
            delegate: SliverChildBuilderDelegate(
              (context, index) {
                final category = categories[index];
                final gradient = getCardGradient(index);
                final count = _categoryCounts[category.name] ?? 0;

                return GestureDetector(
                  onTap: () => onCategorySelect(category.name),
                  child: Container(
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
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        // Icon
                        Container(
                          width: 32,
                          height: 32,
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.25),
                            shape: BoxShape.circle,
                          ),
                          child: Icon(
                            getCategoryIcon(category.iconName),
                            color: Colors.white,
                            size: 16,
                          ),
                        ),

                        // Name + count
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              category.name,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                                shadows: [
                                  Shadow(
                                    color: Color(0x33000000),
                                    blurRadius: 3,
                                    offset: Offset(0, 1),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              '$count frases',
                              style: TextStyle(
                                color: Colors.white.withValues(alpha: 0.7),
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                );
              },
              childCount: categories.length,
            ),
          ),
        ),
      ],
    );
  }
}
