import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput, Modal, ScrollView } from 'react-native';
import { Button, Card, Title, Paragraph } from 'react-native-paper';


const HomeScreen = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await fetch(`https://native-restaurant-back-end.onrender.com/api/restall`);
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
      const filtered = restaurants.filter((restaurant) =>
        restaurant.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredRestaurants(filtered);
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

  const renderRestaurant = ({ item }) => (
    <Card style={styles.card}>
      <Card.Cover source={{ uri: item.image }} style={styles.cardImage} />
      <Card.Content>
        <Title>{item.name}</Title>
        <Paragraph numberOfLines={2}>{item.description}</Paragraph>
        <Text style={styles.service}>Service: {item.service}</Text>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => openModal(item)}>View More</Button>
        <Button mode="contained" onPress={() => alert('Booking functionality coming soon!')}>
          Book
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search restaurants..."
        value={searchText}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredRestaurants}
        renderItem={renderRestaurant}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
      />

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    elevation: 3,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    marginBottom: 15,
    elevation: 4,
  },
  cardImage: {
    height: 150,
  },
  service: {
    marginTop: 5,
    fontStyle: 'italic',
  },
  modalContent: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  modalImage: {
    width: '100%',
    height: 200,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default HomeScreen;
