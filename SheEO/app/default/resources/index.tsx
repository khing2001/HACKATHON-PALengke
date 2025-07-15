import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Image,
  Linking, 
  Alert, 
  Animated, 
  Easing,
  Dimensions,
  Platform,
  BackHandler
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getFontFamily } from '../../../components/FontConfig';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface Article {
  id: string;
  title: string;
  preview: string;
  readTime: string;
  date: string;
  category: string;
  url: string;
  imageUrl: string;
  featured?: boolean;
}

interface ResourcesProps {
  fontsLoaded?: boolean;
  onBack?: () => void;
}

const articles: Article[] = [
  {
    id: '1',
    title: 'From Domestic Helper to Construction CEO: Lyn Macanas Success Story',
    preview: 'Samar-born entrepreneur built thriving construction empire, now launching beauty line...',
    readTime: '6 min read',
    date: 'Mar 12, 2025',
    category: 'Business Setup',
    url: 'https://manilastandard.net/lifestyle/314567801/how-lyn-macanas-scripts-her-teleserye-worthy-success-story.html',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=200&fit=crop',
    featured: true
  },
  {
    id: '2',
    title: 'Filipina Rises to McDonald\'s National Field President in US',
    preview: 'Myra Doria from Pampanga now oversees 14,000 restaurants after 40-year journey...',
    readTime: '8 min read',
    date: 'Mar 28, 2025',
    category: 'Operations',
    url: 'https://manilastandard.net/lifestyle/314573590/the-inspiring-story-of-myra-doria.html',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop'
  },
  {
    id: '3',
    title: 'OFW Returns Home to Create Opportunities for Women Farmers',
    preview: 'Evelyn de Guzman Breguera built Abundance Agri-Tourism after 17 years abroad...',
    readTime: '7 min read',
    date: 'Nov 23, 2024',
    category: 'Customer Relations',
    url: 'https://manilastandard.net/business/314527249/ofw-creates-opportunities-for-women-farmers-youth.html',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=200&fit=crop'
  },
  {
    id: '4',
    title: 'Pampangueña Rises Above Poverty, Builds P50K Sari-Sari Business',
    preview: 'Maryjoy Delara started with P500, now supports family through store success...',
    readTime: '5 min read',
    date: 'Mar 31, 2025',
    category: 'Finance',
    url: 'https://manilastandard.net/lifestyle/314574642/from-struggle-to-success-pampanguena-rises-above-poverty-builds-biz.html',
    imageUrl: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=400&h=200&fit=crop'
  },
  {
    id: '5',
    title: 'TinapaIsLife: E-Commerce Fish Processing Empowers Local Communities',
    preview: 'Elizabeth M. and team bring healthy tinapa products from Bataan to Metro Manila...',
    readTime: '6 min read',
    date: 'Aug 15, 2024',
    category: 'Technology',
    url: 'https://www.linkedin.com/company/tinapaislife-fish-processing',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=200&fit=crop'
  },
  {
    id: '6',
    title: 'Filipino Women Dominate Sari-Sari Store Ownership, Boost Economy',
    preview: 'Women own 75% of sari-sari stores, control local economy...',
    readTime: '5 min read',
    date: 'Mar 24, 2023',
    category: 'Marketing',
    url: 'https://newsinfo.inquirer.net/1747639/filipino-women-take-charge-of-local-economy-as-study-finds-them-dominating-sari-sari-store-ownership',
    imageUrl: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&h=200&fit=crop'
  }
];

const categoryColors: { [key: string]: [string, string] } = {
  'Business Setup': ['#FF6B6B', '#FF8E85'],
  'Operations': ['#4ECDC4', '#45B7D1'],
  'Customer Relations': ['#45B7D1', '#667EEA'],
  'Finance': ['#96CEB4', '#FECA57'],
  'Technology': ['#FECA57', '#FF9FF3'],
  'Marketing': ['#FF9FF3', '#F093FB']
};

const Resources: React.FC<ResourcesProps> = ({ fontsLoaded = true, onBack }) => {
  const [searchText, setSearchText] = useState('');
  const [filteredArticles, setFilteredArticles] = useState(articles);
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});

  // Animation refs
  const headerAnimation = useRef(new Animated.Value(0)).current;
  const searchAnimation = useRef(new Animated.Value(0)).current;
  const articlesAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Stagger animations for smooth entrance
    const animations = [
      { animation: headerAnimation, delay: 0 },
      { animation: searchAnimation, delay: 200 },
      { animation: articlesAnimation, delay: 400 },
    ];

    animations.forEach(({ animation, delay }) => {
      Animated.timing(animation, {
        toValue: 1,
        duration: 800,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    });
  }, []);

  useEffect(() => {
    // Handle Android back button
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (onBack) {
        onBack();
        return true; // Prevent default behavior
      }
      return false; // Allow default behavior
    });

    return () => backHandler.remove();
  }, [onBack]);

  useEffect(() => {
    const filtered = articles.filter(article =>
      article.title.toLowerCase().includes(searchText.toLowerCase()) ||
      article.preview.toLowerCase().includes(searchText.toLowerCase()) ||
      article.category.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredArticles(filtered);
  }, [searchText]);

  const handleArticlePress = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open this URL');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while opening the link');
    }
  };

  const handleImageError = (articleId: string) => {
    setImageErrors(prev => ({ ...prev, [articleId]: true }));
  };

  const renderArticle = (article: Article, index: number) => {
    const isEven = index % 2 === 0;
    const hasImageError = imageErrors[article.id];
    const categoryGradient: [string, string] = categoryColors[article.category] || ['#666', '#888'];
    
    return (
      <Animated.View
        key={article.id}
        style={[
          {
            opacity: articlesAnimation,
            transform: [
              {
                translateY: articlesAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30 + index * 10, 0],
                }),
              },
              {
                scale: articlesAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.articleCard,
            article.featured && styles.featuredCard,
            isEven ? styles.leftCard : styles.rightCard
          ]}
          onPress={() => handleArticlePress(article.url)}
          activeOpacity={0.9}
        >
          {article.featured ? (
            <LinearGradient
              colors={['#4D0045', '#7B1FA2', '#9C27B0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.featuredGradient}
            >
              <View style={styles.featuredBadge}>
                <Ionicons name="star" size={14} color="#FFD700" />
                <Text style={[styles.featuredText, { fontFamily: getFontFamily('bold', fontsLoaded) }]}>
                  Featured
                </Text>
              </View>
              
              <View style={styles.imageContainer}>
                {hasImageError ? (
                  <View style={styles.imagePlaceholder}>
                    <Ionicons name="newspaper-outline" size={32} color="#FFFFFF" />
                  </View>
                ) : (
                  <>
                    <Image
                      source={{ uri: article.imageUrl }}
                      style={styles.articleImage}
                      resizeMode="cover"
                      onError={() => handleImageError(article.id)}
                    />
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.4)']}
                      style={styles.imageOverlay}
                    />
                  </>
                )}
              </View>

              <View style={styles.articleContent}>
                <LinearGradient
                  colors={categoryGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.categoryBadge}
                >
                  <Text style={[styles.categoryText, { fontFamily: getFontFamily('bold', fontsLoaded) }]}>
                    {article.category}
                  </Text>
                </LinearGradient>

                <Text style={[styles.articleTitle, styles.featuredTitle, { fontFamily: getFontFamily('bold', fontsLoaded) }]}>
                  {article.title}
                </Text>

                <Text style={[styles.articlePreview, styles.featuredPreview, { fontFamily: getFontFamily('regular', fontsLoaded) }]}>
                  {article.preview}
                </Text>

                <View style={styles.articleFooter}>
                  <Text style={[styles.readTime, styles.featuredReadTime, { fontFamily: getFontFamily('medium', fontsLoaded) }]}>
                    {article.readTime}
                  </Text>
                  <View style={styles.readMoreButton}>
                    <Text style={[styles.readMoreText, { fontFamily: getFontFamily('bold', fontsLoaded) }]}>
                      Read
                    </Text>
                    <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                  </View>
                </View>
              </View>
            </LinearGradient>
          ) : (
            <View style={styles.regularCard}>
              <View style={styles.imageContainer}>
                {hasImageError ? (
                  <View style={styles.imagePlaceholder}>
                    <Ionicons name="newspaper-outline" size={32} color="#4D0045" />
                  </View>
                ) : (
                  <>
                    <Image
                      source={{ uri: article.imageUrl }}
                      style={styles.articleImage}
                      resizeMode="cover"
                      onError={() => handleImageError(article.id)}
                    />
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.2)']}
                      style={styles.imageOverlay}
                    />
                  </>
                )}
              </View>

              <View style={styles.articleContent}>
                <LinearGradient
                  colors={categoryGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.categoryBadge}
                >
                  <Text style={[styles.categoryText, { fontFamily: getFontFamily('bold', fontsLoaded) }]}>
                    {article.category}
                  </Text>
                </LinearGradient>

                <Text style={[styles.articleTitle, { fontFamily: getFontFamily('bold', fontsLoaded) }]}>
                  {article.title}
                </Text>

                <Text style={[styles.articlePreview, { fontFamily: getFontFamily('regular', fontsLoaded) }]}>
                  {article.preview}
                </Text>

                <View style={styles.articleFooter}>
                  <Text style={[styles.readTime, { fontFamily: getFontFamily('medium', fontsLoaded) }]}>
                    {article.readTime}
                  </Text>
                  <View style={styles.readMoreButtonRegular}>
                    <Text style={[styles.readMoreTextRegular, { fontFamily: getFontFamily('bold', fontsLoaded) }]}>
                      Read
                    </Text>
                    <Ionicons name="arrow-forward" size={16} color="#4D0045" />
                  </View>
                </View>
              </View>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: headerAnimation,
            transform: [
              {
                translateY: headerAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-30, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#4D0045" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { fontFamily: getFontFamily('bold', fontsLoaded) }]}>
          Resources
        </Text>
        <View style={styles.headerSpacer} />
      </Animated.View>

      {/* Search Bar */}
      <Animated.View 
        style={[
          styles.searchContainer,
          {
            opacity: searchAnimation,
            transform: [
              {
                translateY: searchAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
          style={styles.searchBar}
        >
          <Ionicons name="search" size={22} color="#4D0045" style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { fontFamily: getFontFamily('regular', fontsLoaded) }]}
            placeholder="Search inspiring stories..."
            placeholderTextColor="#8E8E93"
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')} style={styles.clearButton}>
              <Ionicons name="close-circle" size={22} color="#8E8E93" />
            </TouchableOpacity>
          )}
        </LinearGradient>
      </Animated.View>

      {/* Articles Grid */}
      <View style={styles.articlesContainer}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.articlesGrid}>
            {filteredArticles.map((article, index) => renderArticle(article, index))}
          </View>
          
          {filteredArticles.length === 0 && (
            <Animated.View 
              style={[
                styles.noResultsContainer,
                {
                  opacity: articlesAnimation,
                  transform: [
                    {
                      translateY: articlesAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [30, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
                style={styles.noResultsCard}
              >
                <Ionicons name="search-outline" size={64} color="#4D0045" />
                <Text style={[styles.noResultsText, { fontFamily: getFontFamily('bold', fontsLoaded) }]}>
                  No articles found
                </Text>
                <Text style={[styles.noResultsSubtext, { fontFamily: getFontFamily('regular', fontsLoaded) }]}>
                  Try different keywords to discover more stories
                </Text>
              </LinearGradient>
            </Animated.View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default Resources;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0.05,
    shadowRadius: Platform.OS === 'ios' ? 6 : 4,
    elevation: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 22,
    color: '#1E293B',
    flex: 1,
    textAlign: 'center',
    marginRight: 40,
  },
  headerSpacer: {
    width: 40,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
    shadowColor: '#4D0045',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  clearButton: {
    padding: 4,
  },
  articlesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  articlesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  articleCard: {
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    width: (width - 60) / 2,
  },
  featuredCard: {
    shadowColor: '#4D0045',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  regularCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  featuredGradient: {
    flex: 1,
  },
  leftCard: {
    marginRight: 10,
  },
  rightCard: {
    marginLeft: 10,
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    zIndex: 2,
  },
  featuredText: {
    fontSize: 11,
    color: '#FFFFFF',
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  imageContainer: {
    height: 120,
    position: 'relative',
  },
  articleImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  articleContent: {
    padding: 16,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  articleTitle: {
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 18,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  featuredTitle: {
    color: '#FFFFFF',
    fontSize: 15,
  },
  articlePreview: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
    marginBottom: 14,
  },
  featuredPreview: {
    color: 'rgba(255,255,255,0.9)',
  },
  articleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  readTime: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  featuredReadTime: {
    color: 'rgba(255,255,255,0.8)',
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  readMoreButtonRegular: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(77,0,69,0.1)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  readMoreText: {
    fontSize: 11,
    color: '#FFFFFF',
    marginRight: 4,
    fontWeight: 'bold',
  },
  readMoreTextRegular: {
    fontSize: 11,
    color: '#4D0045',
    marginRight: 4,
    fontWeight: 'bold',
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noResultsCard: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 30,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  noResultsText: {
    fontSize: 20,
    color: '#4D0045',
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
}); 