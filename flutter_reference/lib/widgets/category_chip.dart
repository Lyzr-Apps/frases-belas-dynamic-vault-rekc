import 'package:flutter/material.dart';
import '../models/phrase.dart';
import '../data/categories.dart';
import '../theme/app_theme.dart';

/// Chip de categoria — usado no scroll horizontal
class CategoryChip extends StatelessWidget {
  final Category category;
  final bool isActive;
  final VoidCallback onTap;
  final int? count;

  const CategoryChip({
    super.key,
    required this.category,
    required this.isActive,
    required this.onTap,
    this.count,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        decoration: BoxDecoration(
          color: isActive ? AppTheme.primary : Colors.white.withValues(alpha: 0.75),
          borderRadius: BorderRadius.circular(20),
          border: isActive ? null : Border.all(color: AppTheme.border),
          boxShadow: isActive
              ? [
                  BoxShadow(
                    color: AppTheme.primary.withValues(alpha: 0.25),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ]
              : null,
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              getCategoryIcon(category.iconName),
              size: 16,
              color: isActive ? Colors.white : AppTheme.textPrimary,
            ),
            const SizedBox(width: 8),
            Text(
              category.name,
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w500,
                color: isActive ? Colors.white : AppTheme.textPrimary,
              ),
            ),
            if (count != null) ...[
              const SizedBox(width: 6),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: isActive
                      ? Colors.white.withValues(alpha: 0.2)
                      : AppTheme.divider,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  '$count',
                  style: TextStyle(
                    fontSize: 11,
                    color: isActive ? Colors.white : AppTheme.textMuted,
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
