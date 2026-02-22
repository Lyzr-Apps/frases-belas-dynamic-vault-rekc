import 'dart:io';
import 'dart:typed_data';
import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:path_provider/path_provider.dart';
import 'package:share_plus/share_plus.dart';
import 'package:screenshot/screenshot.dart';
import '../models/phrase.dart';
import '../data/gradients.dart';

/// Servico de compartilhamento e download
/// No Flutter nao tem CORS! Tudo funciona nativamente.
///
/// Usa o package screenshot para capturar um widget como imagem,
/// e share_plus para compartilhar via sistema nativo do Android/iOS.
class ShareService {
  static final ScreenshotController _screenshotController = ScreenshotController();

  /// Gera a imagem composta (frase + background) como bytes
  /// Usa ScreenshotController.captureFromWidget() para renderizar
  /// um widget off-screen como imagem.
  static Future<Uint8List?> generateCompositeImage({
    required Phrase phrase,
    required String fontFamily,
    required bool isPro,
    required BuildContext context,
  }) async {
    try {
      // Cria o widget da imagem composta
      final widget = _buildCompositeWidget(
        phrase: phrase,
        fontFamily: fontFamily,
        isPro: isPro,
      );

      // Captura o widget como imagem (1080x1080)
      final Uint8List imageBytes = await _screenshotController.captureFromWidget(
        widget,
        pixelRatio: 1.0, // 1080px porque o widget ja tem 1080x1080
        delay: const Duration(milliseconds: 100),
      );

      return imageBytes;
    } catch (e) {
      debugPrint('Erro ao gerar imagem: $e');
      return null;
    }
  }

  /// Compartilha a frase como imagem
  /// 1. Gera a imagem composta
  /// 2. Salva em arquivo temporario
  /// 3. Usa share_plus para compartilhar
  static Future<void> sharePhrase({
    required Phrase phrase,
    required String fontFamily,
    required bool isPro,
    required BuildContext context,
  }) async {
    final imageBytes = await generateCompositeImage(
      phrase: phrase,
      fontFamily: fontFamily,
      isPro: isPro,
      context: context,
    );

    if (imageBytes == null) {
      // Fallback: compartilha so o texto
      await Share.share(
        phrase.text,
        subject: 'Frases & Imagens',
      );
      return;
    }

    // Salva em arquivo temporario
    final tempDir = await getTemporaryDirectory();
    final file = File('${tempDir.path}/frase-${phrase.id}.jpg');
    await file.writeAsBytes(imageBytes);

    // Compartilha via sistema nativo
    await Share.shareXFiles(
      [XFile(file.path)],
      text: phrase.text,
      subject: 'Frases & Imagens',
    );
  }

  /// Baixa/salva a imagem na galeria
  /// Requer permissao de armazenamento no Android
  static Future<bool> downloadImage({
    required Phrase phrase,
    required String fontFamily,
    required bool isPro,
    required BuildContext context,
  }) async {
    final imageBytes = await generateCompositeImage(
      phrase: phrase,
      fontFamily: fontFamily,
      isPro: isPro,
      context: context,
    );

    if (imageBytes == null) return false;

    try {
      // Salva na pasta de downloads ou galeria
      // Para salvar na galeria, use o package image_gallery_saver
      // ou gal (mais simples)
      final tempDir = await getTemporaryDirectory();
      final file = File('${tempDir.path}/frase-${phrase.id}.jpg');
      await file.writeAsBytes(imageBytes);

      // Opcional: salvar na galeria com image_gallery_saver
      // await ImageGallerySaver.saveFile(file.path);

      return true;
    } catch (e) {
      debugPrint('Erro ao salvar imagem: $e');
      return false;
    }
  }

  /// Constroi o widget da imagem composta (1080x1080)
  /// Este widget e renderizado off-screen pelo ScreenshotController
  static Widget _buildCompositeWidget({
    required Phrase phrase,
    required String fontFamily,
    required bool isPro,
  }) {
    final gradient = getCardGradient(phrase.gradientIndex);

    return SizedBox(
      width: 1080,
      height: 1080,
      child: Stack(
        fit: StackFit.expand,
        children: [
          // 1. Gradient background (sempre presente)
          Container(
            decoration: BoxDecoration(gradient: gradient),
          ),

          // 2. Imagem de fundo (se disponivel)
          if (phrase.imageUrl.isNotEmpty)
            Image.network(
              phrase.imageUrl,
              fit: BoxFit.cover,
              errorBuilder: (_, __, ___) => const SizedBox.shrink(),
            ),

          // 3. Overlay escuro para legibilidade
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Colors.black.withValues(alpha: 0.10),
                  Colors.black.withValues(alpha: 0.20),
                  Colors.black.withValues(alpha: 0.45),
                  Colors.black.withValues(alpha: 0.70),
                ],
                stops: const [0.0, 0.35, 0.65, 1.0],
              ),
            ),
          ),

          // 4. Categoria no topo
          Positioned(
            top: 40,
            left: 0,
            right: 0,
            child: Center(
              child: Text(
                phrase.categoria,
                style: TextStyle(
                  color: Colors.white.withValues(alpha: 0.7),
                  fontSize: 24,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ),

          // 5. Texto da frase centralizado
          Center(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 60),
              child: Text(
                '\u201C${phrase.text}\u201D',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontFamily: fontFamily,
                  fontSize: phrase.text.length > 150 ? 38 : phrase.text.length > 100 ? 42 : 48,
                  fontWeight: FontWeight.w600,
                  color: Colors.white,
                  height: 1.5,
                  shadows: const [
                    Shadow(
                      color: Color(0x80000000),
                      blurRadius: 12,
                      offset: Offset(0, 2),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // 6. Marca d'agua para usuarios free
          if (!isPro)
            Positioned(
              bottom: 30,
              right: 30,
              child: Opacity(
                opacity: 0.45,
                child: Text(
                  'Frases & Imagens',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 22,
                    fontWeight: FontWeight.w500,
                    shadows: const [
                      Shadow(
                        color: Color(0x80000000),
                        blurRadius: 4,
                        offset: Offset(0, 1),
                      ),
                    ],
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
