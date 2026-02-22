class Phrase {
  final String id;
  final String text;
  final String categoria;
  final String imageUrl;
  final int gradientIndex;
  final bool isNew;

  const Phrase({
    required this.id,
    required this.text,
    required this.categoria,
    required this.imageUrl,
    required this.gradientIndex,
    this.isNew = false,
  });
}

class Category {
  final String name;
  final String iconName;
  final String description;

  const Category({
    required this.name,
    required this.iconName,
    required this.description,
  });
}
