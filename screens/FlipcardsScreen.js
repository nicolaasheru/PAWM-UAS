//FlipcardsScreen.ks

import React, { useState, useCallback } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar, 
  Animated,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const flashcardsData = [
  { front: "Apple", back: "Apel" },
  { front: "Dog", back: "Anjing" },
  { front: "Book", back: "Buku" },
  { front: "Cat", back: "Kucing" },
  { front: "House", back: "Rumah" },
  { front: "Car", back: "Mobil" },
  { front: "Water", back: "Air" },
  { front: "Phone", back: "Telepon" },
  { front: "Tree", back: "Pohon" },
  { front: "Sky", back: "Langit" },
];

const FlipCard = ({ front, back, theme }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const animatedValue = new Animated.Value(0);
  
  const frontInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg']
  });
  
  const backInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg']
  });

  const flipCard = useCallback(() => {
    Animated.spring(animatedValue, {
      toValue: isFlipped ? 0 : 180,
      friction: 8,
      tension: 10,
      useNativeDriver: true
    }).start();
    setIsFlipped(!isFlipped);
  }, [isFlipped, animatedValue]);

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }]
  };
  
  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }]
  };

  return (
    <TouchableOpacity onPress={flipCard} style={styles.cardContainer}>
      <Animated.View 
        style={[
          styles.card, 
          { backgroundColor: theme.cardColor },
          frontAnimatedStyle
        ]}
      >
        <Text style={[styles.cardText, { color: theme.textColor }]}>{front}</Text>
      </Animated.View>
      <Animated.View 
        style={[
          styles.card, 
          { backgroundColor: theme.cardBackColor },
          backAnimatedStyle
        ]}
      >
        <Text style={[styles.cardText, { color: theme.textColor }]}>{back}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

function FlipcardsScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigation = useNavigation();
  
  const theme = {
    backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
    headerColor: isDarkMode ? '#12284d' : '#ffffff',
    textColor: isDarkMode ? '#e2e8f0' : '#1e293b',
    cardColor: isDarkMode ? '#12284d' : '#ffffff',
    cardBackColor: isDarkMode ? '#07132c' : '#eff4ff',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      <View style={[styles.header, { backgroundColor: theme.headerColor }]}>
        <Text style={[styles.title, { color: theme.textColor }]}>Fliplingo by Nico</Text>
        <TouchableOpacity 
          style={[styles.themeButton, { borderColor: theme.textColor }]} 
          onPress={() => setIsDarkMode(!isDarkMode)}
        >
          <Text style={[styles.themeButtonText, { color: theme.textColor }]}>
            {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.homeButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.homeButtonText}>Home</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.cardsGrid}>
          {flashcardsData.map((card, index) => (
            <FlipCard 
              key={index}
              front={card.front}
              back={card.back}
              theme={theme}
            />
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.headerColor }]}>
        <Text style={[styles.footerText, { color: theme.textColor }]}>
          © 2024 Fliplingo by Nico. All rights reserved.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  themeButton: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  themeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  homeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#2563eb',
  },
  homeButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  scrollContent: {
    padding: 16,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  cardContainer: {
    width: cardWidth,
    height: cardWidth * 1.5,
    marginBottom: 16,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardText: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    padding: 16,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    textAlign: 'center',
  },
});

export default FlipcardsScreen;