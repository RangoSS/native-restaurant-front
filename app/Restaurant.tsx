import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TextInput, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { Button, Card, Title, Paragraph } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

const API_URL = "https://native-restaurant-back-end.onrender.com/api";

const RestaurantScreen = () => {

  const navigation = useNavigation();
  
  const [restaurants, setRestaurants] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    contact: '',
    email: '',
    service: '',
    type: '',
    priceOfBooking: '',
    numberOfDaysBooked: '',
    numberOfPeopleBooked: '',
    image: null
  });

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    const token = localStorage.getItem('token'); // Get token from localStorage
    try {
      const response = await fetch(`${API_URL}/restall`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setRestaurants(data);
      setFilteredRestaurants(data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim() === '') {
      setFilteredRestaurants(restaurants);
    } else {
      setFilteredRestaurants(
        restaurants.filter((r) => r.name.toLowerCase().includes(text.toLowerCase()))
      );
    }
  };

  const openModal = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedRestaurant(null);
  };

  const handleImageUpload = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setFormData({ ...formData, image: result.assets[0].uri });
    }
  };

  const handleAddRestaurant = async () => {
    const token = localStorage.getItem('token');
    const newRestaurant = { ...formData };

    try {
      const response = await fetch(`${API_URL}/restaurants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newRestaurant),
      });

      if (response.ok) {
        fetchRestaurants();
        setAddModalVisible(false);
      }
    } catch (error) {
      console.error('Error adding restaurant:', error);
    }
  };

  const handleDeleteRestaurant = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`${API_URL}/restaurants/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRestaurants();
    } catch (error) {
      console.error('Error deleting restaurant:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search restaurants..."
        value={searchText}
        onChangeText={handleSearch}
      />

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={() => setAddModalVisible(true)}>Add Restaurant</Button>
        <Button mode="contained" onPress={() => navigation.navigate('Profile')}>Go to Profile</Button>
      </View>

      {/* Restaurant List */}
      <FlatList
        data={filteredRestaurants}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Cover source={{ uri: item.image }} style={styles.cardImage} />
            <Card.Content>
              <Title>{item.name}</Title>
              <Paragraph numberOfLines={2}>{item.description}</Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => openModal(item)}>View More</Button>
              <Button mode="contained" onPress={() => handleDeleteRestaurant(item._id)}>Delete</Button>
            </Card.Actions>
          </Card>
        )}
        keyExtractor={(item) => item._id}
      />

      {/* Modal for Restaurant Details */}
      {selectedRestaurant && (
        <Modal visible={modalVisible} animationType="slide" onRequestClose={closeModal}>
          <ScrollView style={styles.modalContent}>
            <Image source={{ uri: selectedRestaurant.image }} style={styles.modalImage} />
            <Text style={styles.modalTitle}>{selectedRestaurant.name}</Text>
            <Text style={styles.modalText}>{selectedRestaurant.description}</Text>
            <Text style={styles.modalText}>Service: {selectedRestaurant.service}</Text>
            <Text style={styles.modalText}>Address: {selectedRestaurant.address}</Text>
            <Text style={styles.modalText}>Contact: {selectedRestaurant.contact}</Text>
            <Text style={styles.modalText}>Email: {selectedRestaurant.email}</Text>
            <Text style={styles.modalText}>Price of Booking: ${selectedRestaurant.priceOfBooking}</Text>
            <Text style={styles.modalText}>Days Booked: {selectedRestaurant.numberOfDaysBooked}</Text>
            <Text style={styles.modalText}>People Booked: {selectedRestaurant.numberOfPeopleBooked}</Text>
            <Button onPress={closeModal}>Close</Button>
          </ScrollView>
        </Modal>
      )}

      {/* Modal for Adding a Restaurant */}
      <Modal visible={addModalVisible} animationType="slide" onRequestClose={() => setAddModalVisible(false)}>
        <ScrollView style={styles.modalContent}>
          <TextInput placeholder="Name" onChangeText={(text) => setFormData({ ...formData, name: text })} />
          <TextInput placeholder="Description" onChangeText={(text) => setFormData({ ...formData, description: text })} />
          <Button onPress={handleImageUpload}>Upload Image</Button>
          <Button mode="contained" onPress={handleAddRestaurant}>Add Restaurant</Button>
          <Button onPress={() => setAddModalVisible(false)}>Close</Button>
        </ScrollView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f5f5f5' },
  searchBar: { backgroundColor: '#fff', padding: 10, borderRadius: 8, marginBottom: 10 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  card: { marginBottom: 15 },
  cardImage: { height: 150 },
  modalContent: { flex: 1, padding: 15, backgroundColor: '#fff' },
  modalImage: { width: '100%', height: 200 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
});

export default RestaurantScreen;
