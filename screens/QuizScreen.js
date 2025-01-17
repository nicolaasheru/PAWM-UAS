//QuizScreen.js

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  useColorScheme,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Questions data
const questions = [
  { level: 1, word: "Apple", translation: "Apel" },
  { level: 2, word: "Banana", translation: "Pisang" },
  { level: 3, word: "Car", translation: "Mobil" },
  { level: 4, word: "Dog", translation: "Anjing" },
  { level: 5, word: "Cat", translation: "Kucing" },
  { level: 6, word: "Bird", translation: "Burung" },
  { level: 7, word: "Tree", translation: "Pohon" },
  { level: 8, word: "House", translation: "Rumah" },
  { level: 9, word: "Computer", translation: "Komputer" },
  { level: 10, word: "The cat is sitting near the door", translation: "Kucing duduk di dekat pintu" },
  { level: 11, word: "The apple is on the table", translation: "Apel ada di atas meja" },
  { level: 12, word: "The bird is in the tree", translation: "Burung ada di pohon" },
  { level: 13, word: "The car is parked near the house", translation: "Mobil diparkir di dekat rumah" },
  { level: 14, word: "I need a pen", translation: "Saya butuh sebuah pena" },
  { level: 15, word: "I have a new computer", translation: "Saya punya komputer baru" },
];

export default function App() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionsForLevel, setQuestionsForLevel] = useState([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [resultMessage, setResultMessage] = useState('');
  const [isAnswerDisabled, setIsAnswerDisabled] = useState(false);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    loadUserProgress();
  }, []);

  useEffect(() => {
    loadQuestionsForLevel(currentLevel);
  }, [currentLevel]);

  const loadUserProgress = async () => {
    try {
      const savedLevel = await AsyncStorage.getItem('userLevel');
      if (savedLevel) {
        setCurrentLevel(parseInt(savedLevel));
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  };

  const loadQuestionsForLevel = (level) => {
    const levelQuestions = questions.filter(q => q.level === level);
    setQuestionsForLevel(levelQuestions);
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setResultMessage('');
    setIsAnswerDisabled(false);
    setIsNextDisabled(true);
  };

  const handleSubmit = async () => {
    const currentQuestion = questionsForLevel[currentQuestionIndex];
    if (userAnswer.toLowerCase() === currentQuestion.translation.toLowerCase()) {
      setResultMessage('Correct! 🎉');
      setIsAnswerDisabled(true);
      setIsNextDisabled(false);
      const newLevel = currentLevel + 1;
      setCurrentLevel(newLevel);
      try {
        await AsyncStorage.setItem('userLevel', newLevel.toString());
      } catch (error) {
        console.error('Failed to save progress:', error);
      }
    } else {
      setResultMessage(`Wrong! The correct answer is: ${currentQuestion.translation}`);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex + 1 < questionsForLevel.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer('');
      setResultMessage('');
      setIsAnswerDisabled(false);
      setIsNextDisabled(true);
    } else {
      loadQuestionsForLevel(currentLevel);
    }
  };

  const progressPercentage = (currentLevel / questions.length) * 100;

  const theme = {
    background: isDarkMode ? '#1a1a1a' : '#ffffff',
    text: isDarkMode ? '#ffffff' : '#000000',
    card: isDarkMode ? '#2d2d2d' : '#f5f5f5',
    button: isDarkMode ? '#4a90e2' : '#007AFF',
    progressBar: isDarkMode ? '#4a90e2' : '#007AFF',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Fliplingo Quiz</Text>
          <TouchableOpacity
            style={styles.themeButton}
            onPress={() => setIsDarkMode(!isDarkMode)}
          >
            <Text style={styles.themeButtonText}>
              {isDarkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.levelContainer}>
          <Text style={[styles.levelText, { color: theme.text }]}>
            Level: {currentLevel}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${progressPercentage}%`,
                  backgroundColor: theme.progressBar,
                },
              ]}
            />
          </View>
        </View>

        <View style={[styles.quizCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.wordText, { color: theme.text }]}>
            {questionsForLevel[currentQuestionIndex]?.word}
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.text }]}
            value={userAnswer}
            onChangeText={setUserAnswer}
            placeholder="Type your answer here"
            placeholderTextColor={isDarkMode ? '#888' : '#666'}
            editable={!isAnswerDisabled}
          />
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.button }]}
            onPress={handleSubmit}
            disabled={isAnswerDisabled}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>

        {resultMessage && (
          <Text
            style={[
              styles.resultMessage,
              {
                color: resultMessage.includes('Correct')
                  ? '#4CAF50'
                  : '#f44336',
              },
            ]}
          >
            {resultMessage}
          </Text>
        )}

        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: theme.button,
              opacity: isNextDisabled ? 0.5 : 1,
            },
          ]}
          onPress={handleNext}
          disabled={isNextDisabled}
        >
          <Text style={styles.buttonText}>Next Question</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  themeButton: {
    padding: 10,
  },
  themeButtonText: {
    fontSize: 16,
  },
  levelContainer: {
    marginBottom: 20,
  },
  levelText: {
    fontSize: 18,
    marginBottom: 10,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  quizCard: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  wordText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
});