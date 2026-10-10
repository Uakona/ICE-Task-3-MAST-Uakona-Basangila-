import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  KeyboardAvoidingView, // or Platform
  Platform,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Define the structure of an Album object using TypeScript
interface Album {
  id: string;
  title: string;
  artist: string;
  year: string;
  genre: string;
  rating: string;
}

export default function App() {
  // State for form inputs
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');
  const [rating, setRating] = useState('');

  // State for the collection of albums
  const [albums, setAlbums] = useState<Album[]>([]);

  // Function to validate and add an album
  const handleAddAlbum = () => {
    // Basic validation
    if (!title.trim() || !artist.trim() || !year.trim() || !genre.trim() || !rating.trim()) {
      Alert.alert('Validation Error', 'Please fill in all fields before adding an album.');
      return;
    }

    // Validate year (must be a 4-digit number)
    const yearNum = parseInt(year, 10);
    if (isNaN(yearNum) || year.trim().length !== 4) {
      Alert.alert('Validation Error', 'Please enter a valid 4-digit year.');
      return;
    }

    // Validate rating (must be a number between 1 and 5)
    const ratingNum = parseFloat(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      Alert.alert('Validation Error', 'Rating must be a number between 1 and 5.');
      return;
    }

    // Create new album object
    const newAlbum: Album = {
      id: Date.now().toString(),
      title: title.trim(),
      artist: artist.trim(),
      year: year.trim(),
      genre: genre.trim(),
      rating: rating.trim(),
    };

    // Update state immutably
    setAlbums((prevAlbums) => [newAlbum, ...prevAlbums]);

    // Reset form fields
    setTitle('');
    setArtist('');
    setYear('');
    setGenre('');
    setRating('');

    Alert.alert('Success', 'Album added to your collection!');
  };

  // Function to remove an album by id
  const handleDeleteAlbum = (id: string) => {
    Alert.alert(
      'Delete Album',
      'Are you sure you want to remove this album from your collection?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setAlbums((prevAlbums) => prevAlbums.filter((album) => album.id !== id));
          },
        },
      ]
    );
  };

  // Render individual album item
  const renderAlbumItem = ({ item }: { item: Album }) => (
    <View style={styles.albumCard}>
      <View style={styles.albumInfo}>
        <Text style={styles.albumTitle}>{item.title}</Text>
        <Text style={styles.albumDetail}><Text style={styles.bold}>Artist:</Text> {item.artist}</Text>
        <Text style={styles.albumDetail}><Text style={styles.bold}>Year:</Text> {item.year} | <Text style={styles.bold}>Genre:</Text> {item.genre}</Text>
        <Text style={styles.albumDetail}><Text style={styles.bold}>Rating:</Text> ⭐ {item.rating} / 5</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteAlbum(item.id)}
      >
        <Text style={styles.deleteButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎵 Album Collection</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.contentContainer}
      >
        {/* Form Section */}
        <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Add New Album</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Album Title"
            placeholderTextColor="#888"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Artist Name"
            placeholderTextColor="#888"
            value={artist}
            onChangeText={setArtist}
          />
          <TextInput
            style={styles.input}
            placeholder="Release Year (e.g., 2024)"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={year}
            onChangeText={setYear}
          />
          <TextInput
            style={styles.input}
            placeholder="Genre (e.g., Rock, Pop, Jazz)"
            placeholderTextColor="#888"
            value={genre}
            onChangeText={setGenre}
          />
          <TextInput
            style={styles.input}
            placeholder="Rating (1 to 5)"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={rating}
            onChangeText={setRating}
          />

          <TouchableOpacity style={styles.addButton} onPress={handleAddAlbum}>
            <Text style={styles.addButtonText}>Add to Collection</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Collection List Section */}
        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>My Favourites ({albums.length})</Text>
          <FlatList
            data={albums}
            renderItem={renderAlbumItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No albums in your collection yet. Add one above!</Text>
            }
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    paddingVertical: 16,
    backgroundColor: '#1f1f1f',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#2c2c2c',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  formContainer: {
    paddingBottom: 16,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333333',
  },
  addButton: {
    backgroundColor: '#1db954',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  listSection: {
    flex: 1,
    marginTop: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  albumCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2c2c2c',
  },
  albumInfo: {
    flex: 1,
    marginRight: 10,
  },
  albumTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  albumDetail: {
    color: '#b3b3b3',
    fontSize: 13,
    marginBottom: 2,
  },
  bold: {
    color: '#ffffff',
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#e91429',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#777777',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
});