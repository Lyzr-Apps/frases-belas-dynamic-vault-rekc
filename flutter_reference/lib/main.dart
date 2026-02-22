import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'models/phrase.dart';
import 'data/content_bank.dart';
import 'services/storage_service.dart';
import 'theme/app_theme.dart';
import 'screens/home_screen.dart';
import 'screens/categories_screen.dart';
import 'screens/search_screen.dart';
import 'screens/favorites_screen.dart';
import 'screens/fullscreen_viewer.dart';
import 'widgets/pro_upsell_dialog.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Status bar transparente
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
    ),
  );

  // Inicializa SharedPreferences
  await StorageService.init();

  runApp(const FrasesApp());
}

class FrasesApp extends StatelessWidget {
  const FrasesApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Frases & Imagens',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      home: const MainPage(),
    );
  }
}

/// Pagina principal com bottom navigation
/// Equivale ao Page() do React (page.tsx)
class MainPage extends StatefulWidget {
  const MainPage({super.key});

  @override
  State<MainPage> createState() => _MainPageState();
}

class _MainPageState extends State<MainPage> {
  // ─── Estado ────────────────────────────────────────────────
  int _currentTab = 0;
  final List<Phrase> _phrases = contentBank;
  List<String> _favorites = [];
  bool _isPro = false;
  int _selectedFont = 0;
  bool _showNotifBanner = false;
  bool _notifEnabled = false;
  String? _selectedCategory;

  @override
  void initState() {
    super.initState();
    _loadState();
  }

  void _loadState() {
    setState(() {
      _favorites = StorageService.loadFavorites();
      _isPro = StorageService.isPro;
      _selectedFont = StorageService.loadFont();
      _notifEnabled = StorageService.notifEnabled;
      _showNotifBanner = !StorageService.notifAsked && !_notifEnabled;
    });
  }

  // ─── Handlers ──────────────────────────────────────────────

  void _toggleFavorite(String id) {
    if (!_isPro) {
      ProUpsellDialog.show(context, onSubscribe: _handleSubscribe);
      return;
    }
    setState(() {
      if (_favorites.contains(id)) {
        _favorites.remove(id);
      } else {
        _favorites.add(id);
      }
      StorageService.saveFavorites(_favorites);
    });
  }

  void _handleCardTap(Phrase phrase) {
    Navigator.of(context).push(
      MaterialPageRoute(
        fullscreenDialog: true,
        builder: (_) => FullscreenViewer(
          phrase: phrase,
          phrases: _phrases,
          isFavorited: _favorites.contains(phrase.id),
          onToggleFavorite: _toggleFavorite,
          isPro: _isPro,
          onProUpsell: () {
            Navigator.of(context).pop();
            ProUpsellDialog.show(context, onSubscribe: _handleSubscribe);
          },
          selectedFont: _selectedFont,
          onFontChange: _handleFontChange,
        ),
      ),
    );
  }

  void _handleSubscribe() {
    setState(() {
      _isPro = true;
      StorageService.savePlan('pro');
    });
  }

  void _handleProPillTap() {
    if (_isPro) {
      // Mostra confirmacao de que ja e Pro
      showDialog(
        context: context,
        builder: (ctx) => AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
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
              const SizedBox(height: 12),
              Text(
                'Voce e Pro!',
                style: Theme.of(context).textTheme.headlineSmall,
              ),
              const SizedBox(height: 4),
              Text(
                'Aproveite todos os recursos sem restricoes.',
                style: Theme.of(context).textTheme.bodyMedium,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () => Navigator.of(ctx).pop(),
                  child: const Text('Entendi'),
                ),
              ),
            ],
          ),
        ),
      );
    } else {
      ProUpsellDialog.show(context, onSubscribe: _handleSubscribe);
    }
  }

  void _handleFontChange(int index) {
    setState(() {
      _selectedFont = index;
      StorageService.saveFont(index);
    });
  }

  void _handleNotifAccept() {
    // No Flutter, usar firebase_messaging ou flutter_local_notifications
    // Por agora, apenas marca como aceito
    setState(() {
      _notifEnabled = true;
      _showNotifBanner = false;
      StorageService.setNotifAsked(true);
      StorageService.setNotifEnabled(true);
    });
  }

  void _handleNotifDismiss() {
    setState(() {
      _showNotifBanner = false;
      StorageService.setNotifAsked(true);
    });
  }

  void _handleCategorySelect(String name) {
    setState(() {
      _selectedCategory = name;
      _currentTab = 0; // Volta pra home com filtro
    });
  }

  // ─── Build ─────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: IndexedStack(
          index: _currentTab,
          children: [
            // Home
            HomeScreen(
              phrases: _phrases,
              favorites: _favorites,
              onToggleFavorite: _toggleFavorite,
              onCardTap: _handleCardTap,
              isPro: _isPro,
              selectedFont: _selectedFont,
              showNotifBanner: _showNotifBanner,
              onNotifAccept: _handleNotifAccept,
              onNotifDismiss: _handleNotifDismiss,
              notifEnabled: _notifEnabled,
              onProPillTap: _handleProPillTap,
            ),

            // Categories
            CategoriesScreen(
              phrases: _phrases,
              onCategorySelect: _handleCategorySelect,
            ),

            // Search
            SearchScreen(
              phrases: _phrases,
              favorites: _favorites,
              onToggleFavorite: _toggleFavorite,
              onCardTap: _handleCardTap,
              isPro: _isPro,
              selectedFont: _selectedFont,
            ),

            // Favorites
            FavoritesScreen(
              phrases: _phrases,
              favorites: _favorites,
              onToggleFavorite: _toggleFavorite,
              onCardTap: _handleCardTap,
              isPro: _isPro,
              onProUpsell: () {
                ProUpsellDialog.show(context, onSubscribe: _handleSubscribe);
              },
              selectedFont: _selectedFont,
            ),
          ],
        ),
      ),

      // Bottom Navigation
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.8),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.05),
              blurRadius: 10,
              offset: const Offset(0, -2),
            ),
          ],
        ),
        child: BottomNavigationBar(
          currentIndex: _currentTab,
          onTap: (index) {
            setState(() {
              _currentTab = index;
              _selectedCategory = null;
            });
          },
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.home_outlined),
              activeIcon: Icon(Icons.home),
              label: 'Inicio',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.grid_view_outlined),
              activeIcon: Icon(Icons.grid_view),
              label: 'Categorias',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.search),
              activeIcon: Icon(Icons.search),
              label: 'Busca',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.favorite_border),
              activeIcon: Icon(Icons.favorite),
              label: 'Favoritos',
            ),
          ],
        ),
      ),
    );
  }
}
