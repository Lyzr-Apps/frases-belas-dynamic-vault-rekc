import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../models/phrase.dart';
import '../data/gradients.dart';
import '../data/fonts.dart';
import '../widgets/font_selector.dart';
import '../services/share_service.dart';
import '../theme/app_theme.dart';

/// Visualizador em tela cheia — abre ao clicar em um card
/// Equivale ao FullScreenViewer do React
class FullscreenViewer extends StatefulWidget {
  final Phrase phrase;
  final List<Phrase> phrases;
  final bool isFavorited;
  final ValueChanged<String> onToggleFavorite;
  final bool isPro;
  final VoidCallback onProUpsell;
  final int selectedFont;
  final ValueChanged<int> onFontChange;

  const FullscreenViewer({
    super.key,
    required this.phrase,
    required this.phrases,
    required this.isFavorited,
    required this.onToggleFavorite,
    required this.isPro,
    required this.onProUpsell,
    required this.selectedFont,
    required this.onFontChange,
  });

  @override
  State<FullscreenViewer> createState() => _FullscreenViewerState();
}

class _FullscreenViewerState extends State<FullscreenViewer> {
  late PageController _pageController;
  late int _currentIndex;
  bool _isSharing = false;
  bool _isDownloading = false;

  @override
  void initState() {
    super.initState();
    _currentIndex = widget.phrases.indexWhere((p) => p.id == widget.phrase.id);
    if (_currentIndex < 0) _currentIndex = 0;
    _pageController = PageController(initialPage: _currentIndex);
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  Phrase get _currentPhrase => widget.phrases[_currentIndex];

  Future<void> _handleShare() async {
    setState(() => _isSharing = true);
    try {
      final fontFamily = fontOptions[widget.selectedFont].fontFamily;
      await ShareService.sharePhrase(
        phrase: _currentPhrase,
        fontFamily: fontFamily,
        isPro: widget.isPro,
        context: context,
      );
    } finally {
      if (mounted) setState(() => _isSharing = false);
    }
  }

  Future<void> _handleDownload() async {
    if (!widget.isPro) {
      widget.onProUpsell();
      return;
    }
    setState(() => _isDownloading = true);
    try {
      final fontFamily = fontOptions[widget.selectedFont].fontFamily;
      final success = await ShareService.downloadImage(
        phrase: _currentPhrase,
        fontFamily: fontFamily,
        isPro: widget.isPro,
        context: context,
      );
      if (mounted && success) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Imagem salva!')),
        );
      }
    } finally {
      if (mounted) setState(() => _isDownloading = false);
    }
  }

  void _handleFavorite() {
    if (!widget.isPro) {
      widget.onProUpsell();
      return;
    }
    widget.onToggleFavorite(_currentPhrase.id);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: PageView.builder(
        controller: _pageController,
        onPageChanged: (index) {
          setState(() => _currentIndex = index);
        },
        itemCount: widget.phrases.length,
        itemBuilder: (context, index) {
          final phrase = widget.phrases[index];
          return _buildPhraseView(phrase);
        },
      ),
    );
  }

  Widget _buildPhraseView(Phrase phrase) {
    final gradient = getCardGradient(phrase.gradientIndex);
    final hasImage = phrase.imageUrl.isNotEmpty;
    final fontFamily = fontOptions[widget.selectedFont].fontFamily;
    final isFav = widget.favorites.contains(phrase.id);

    return Stack(
      fit: StackFit.expand,
      children: [
        // 1. Gradient background
        Container(decoration: BoxDecoration(gradient: gradient)),

        // 2. Background image
        if (hasImage)
          CachedNetworkImage(
            imageUrl: phrase.imageUrl,
            fit: BoxFit.cover,
            placeholder: (_, __) => const SizedBox.shrink(),
            errorWidget: (_, __, ___) => const SizedBox.shrink(),
          ),

        // 3. Dark overlay
        Container(
          color: hasImage
              ? Colors.black.withValues(alpha: 0.3)
              : Colors.black.withValues(alpha: 0.1),
        ),

        // 4. Content
        SafeArea(
          child: Column(
            children: [
              // Top bar
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    _circleButton(
                      icon: Icons.close,
                      onTap: () => Navigator.of(context).pop(),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: Colors.black.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          if (hasImage) ...[
                            const Icon(Icons.image, size: 14, color: Colors.white),
                            const SizedBox(width: 4),
                          ],
                          Text(
                            phrase.categoria,
                            style: const TextStyle(color: Colors.white, fontSize: 13),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              // Phrase text centered
              Expanded(
                child: Center(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 32),
                    child: Text(
                      '\u201C${phrase.text}\u201D',
                      textAlign: TextAlign.center,
                      style: GoogleFonts.getFont(
                        fontFamily,
                        textStyle: TextStyle(
                          color: Colors.white,
                          fontSize: phrase.text.length > 150 ? 20 : 24,
                          fontWeight: FontWeight.w600,
                          height: 1.5,
                          shadows: const [
                            Shadow(
                              color: Color(0x4D000000),
                              blurRadius: 8,
                              offset: Offset(0, 2),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),
              ),

              // Watermark for free
              if (!widget.isPro)
                Padding(
                  padding: const EdgeInsets.only(right: 16, bottom: 4),
                  child: Align(
                    alignment: Alignment.centerRight,
                    child: Opacity(
                      opacity: 0.4,
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.image, size: 12, color: Colors.white),
                          const SizedBox(width: 4),
                          const Text(
                            'Frases & Imagens',
                            style: TextStyle(color: Colors.white, fontSize: 11),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),

              // Font selector
              FontSelector(
                selectedFont: widget.selectedFont,
                onFontChange: widget.onFontChange,
              ),

              const SizedBox(height: 8),

              // Action bar
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.black.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Row(
                    children: [
                      // Compartilhar
                      Expanded(
                        child: _actionButton(
                          icon: Icons.share,
                          label: _isSharing ? 'Gerando...' : 'Compartilhar',
                          isLoading: _isSharing,
                          onTap: _isSharing ? null : _handleShare,
                        ),
                      ),
                      const SizedBox(width: 8),

                      // Favoritar
                      _circleButton(
                        icon: isFav && widget.isPro
                            ? Icons.favorite
                            : Icons.favorite_border,
                        onTap: _handleFavorite,
                        showLock: !widget.isPro,
                      ),
                      const SizedBox(width: 8),

                      // Baixar
                      Expanded(
                        child: _actionButton(
                          icon: Icons.download,
                          label: _isDownloading ? 'Gerando...' : 'Baixar',
                          isLoading: _isDownloading,
                          onTap: _isDownloading ? null : _handleDownload,
                          showLock: !widget.isPro,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  // Getter para acessar favoritos do widget pai
  // No app real, isso viria de um Provider/Riverpod
  List<String> get favorites => []; // TODO: Conectar ao estado real via Provider

  Widget _circleButton({
    required IconData icon,
    required VoidCallback onTap,
    bool showLock = false,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Stack(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.2),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: Colors.white, size: 20),
          ),
          if (showLock)
            Positioned(
              top: 0,
              right: 0,
              child: Icon(Icons.lock, color: Colors.white, size: 10),
            ),
        ],
      ),
    );
  }

  Widget _actionButton({
    required IconData icon,
    required String label,
    bool isLoading = false,
    VoidCallback? onTap,
    bool showLock = false,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 10),
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.2),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (isLoading)
              const SizedBox(
                width: 16,
                height: 16,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  color: Colors.white,
                ),
              )
            else
              Icon(icon, color: Colors.white, size: 16),
            const SizedBox(width: 6),
            Text(
              label,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 13,
                fontWeight: FontWeight.w500,
              ),
            ),
            if (showLock && !isLoading) ...[
              const SizedBox(width: 4),
              Opacity(
                opacity: 0.6,
                child: Icon(Icons.lock, color: Colors.white, size: 12),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
