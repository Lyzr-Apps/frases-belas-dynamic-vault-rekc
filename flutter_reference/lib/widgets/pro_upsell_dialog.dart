import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

/// Dialog de upsell para o plano Pro
/// Equivale ao ProUpsellModal do React
class ProUpsellDialog extends StatelessWidget {
  final VoidCallback onSubscribe;
  final VoidCallback onClose;

  const ProUpsellDialog({
    super.key,
    required this.onSubscribe,
    required this.onClose,
  });

  /// Mostra o dialog
  static Future<void> show(BuildContext context, {required VoidCallback onSubscribe}) {
    return showDialog(
      context: context,
      builder: (ctx) => ProUpsellDialog(
        onSubscribe: () {
          Navigator.of(ctx).pop();
          onSubscribe();
        },
        onClose: () => Navigator.of(ctx).pop(),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final benefits = [
      "Imagens sem marca d'agua",
      'Salve seus favoritos',
      'Sem anuncios',
      'Novos conteudos exclusivos',
    ];

    return Dialog(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
      ),
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Icone
            Container(
              width: 64,
              height: 64,
              decoration: BoxDecoration(
                color: AppTheme.primary.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.workspace_premium,
                color: AppTheme.primary,
                size: 32,
              ),
            ),
            const SizedBox(height: 16),

            // Titulo
            Text(
              'Desbloqueie o Plano Pro',
              style: Theme.of(context).textTheme.headlineSmall,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 4),
            Text(
              'Aproveite ao maximo o Frases & Imagens',
              style: Theme.of(context).textTheme.bodyMedium,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 20),

            // Beneficios
            ...benefits.map((benefit) => Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: Row(
                    children: [
                      Container(
                        width: 24,
                        height: 24,
                        decoration: BoxDecoration(
                          color: Colors.green.shade50,
                          shape: BoxShape.circle,
                        ),
                        child: Icon(
                          Icons.check,
                          color: Colors.green.shade600,
                          size: 14,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Text(
                        benefit,
                        style: const TextStyle(fontSize: 14),
                      ),
                    ],
                  ),
                )),
            const SizedBox(height: 8),

            // Preco
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.primary.withValues(alpha: 0.05),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(
                  color: AppTheme.primary.withValues(alpha: 0.1),
                ),
              ),
              child: RichText(
                textAlign: TextAlign.center,
                text: TextSpan(
                  children: [
                    TextSpan(
                      text: 'R\$ 9,90',
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.textPrimary,
                      ),
                    ),
                    TextSpan(
                      text: '/mes',
                      style: TextStyle(
                        fontSize: 14,
                        color: AppTheme.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Botao CTA
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton.icon(
                onPressed: onSubscribe,
                icon: const Icon(Icons.workspace_premium),
                label: const Text(
                  'Assinar Pro',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                ),
              ),
            ),
            const SizedBox(height: 8),

            // Botao secundario
            TextButton(
              onPressed: onClose,
              child: Text(
                'Continuar gratis',
                style: TextStyle(
                  color: AppTheme.textMuted,
                  fontSize: 14,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
