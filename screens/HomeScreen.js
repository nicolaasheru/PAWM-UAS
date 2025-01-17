import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userName, setUserName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Load theme preference and login state
    const loadPreferencesAndStatus = async () => {
      try {
        const theme = await AsyncStorage.getItem('theme');
        setIsDarkMode(theme === 'dark');

        const token = await AsyncStorage.getItem('token');
        const storedName = await AsyncStorage.getItem('userName');
        setIsLoggedIn(!!token);
        setUserName(storedName || '');
      } catch (error) {
        console.error('Error loading preferences or login status:', error);
      }
    };

    loadPreferencesAndStatus();
  }, []);

  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode;
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
      setIsDarkMode(newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userName');
      setIsLoggedIn(false);
      setUserName('');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const colors = {
    primary: isDarkMode ? '#12284d' : '#2563eb',
    primaryDark: isDarkMode ? '#07132c' : '#1d4ed8',
    text: isDarkMode ? '#e2e8f0' : '#1e293b',
    background: isDarkMode ? '#0f172a' : '#f8fafc',
    card: isDarkMode ? '#1e293b' : '#ffffff',
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={styles.headerTitle}>Fliplingo</Text>
        <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
          <Text style={styles.themeButtonText}>
            {isDarkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Hero Section */}
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.heroSection}
      >
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>
            {isLoggedIn ? `Hi, ${userName}` : 'Master Languages Effortlessly'}
          </Text>
          <Text style={styles.heroDescription}>
            Learn vocabulary through interactive flashcards and engaging quizzes.
            Start your language journey today.
          </Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {!isLoggedIn ? (
              <>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: colors.card, marginBottom: 16 }]}
                  onPress={() => navigation.navigate('SignUp')}
                >
                  <Text style={[styles.buttonText, { color: colors.primary }]}>Sign Up</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: colors.card, marginBottom: 16 }]}
                  onPress={() => navigation.navigate('LogIn')}
                >
                  <Text style={[styles.buttonText, { color: colors.primary }]}>Login</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.card, marginBottom: 16 }]}
                onPress={handleLogout}
              >
                <Text style={[styles.buttonText, { color: colors.primary }]}>Logout</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.card, marginBottom: 16 }]}
              onPress={() => navigation.navigate('FlipCards')}
            >
              <Text style={[styles.buttonText, { color: colors.primary }]}>Start Learning</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.card }]}
              onPress={() => navigation.navigate('Quiz')}
            >
              <Text style={[styles.buttonText, { color: colors.primary }]}>Take a Quiz</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  themeButton: {
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    padding: 8,
    borderRadius: 8,
  },
  themeButtonText: {
    color: '#ffffff',
  },
  heroSection: {
    minHeight: 500,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroContent: {
    alignItems: 'center',
    padding: 20,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  heroDescription: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.9,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 16,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;
