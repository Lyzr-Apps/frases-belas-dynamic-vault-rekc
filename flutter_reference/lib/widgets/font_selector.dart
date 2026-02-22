import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../data/fonts.dart';

/// Strip horizontal de selecao de fonte
/// Equivale ao FontSelectorStrip do React
class FontSelector extends StatelessWidget {
  final int selectedFont;
  final ValueChanged<int> onFontChange;

  const FontSelector({
    super.key,
    required this.selectedFont,
    required this.onFontChange,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 44,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: fontOptions.length,
        itemBuilder: (context, index) {
          final font = fontOptions[index];
          final isSelected = selectedFont == index;

          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: GestureDetector(
              onTap: () => onFontChange(index),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                decoration: BoxDecoration(
                  color: isSelected
                      ? Colors.white.withValues(alpha: 0.4)
                      : Colors.white.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: isSelected
                      ? [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.1),
                            blurRadius: 4,
                          ),
                        ]
                      : null,
                ),
                alignment: Alignment.center,
                child: Text(
                  font.name,
                  style: GoogleFonts.getFont(
                    font.fontFamily,
                    textStyle: TextStyle(
                      color: isSelected
                          ? Colors.white
                          : Colors.white.withValues(alpha: 0.7),
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
