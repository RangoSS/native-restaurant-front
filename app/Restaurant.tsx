import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput, ScrollView, Alert, TouchableOpacity, Image, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker'; // Import image picker

const Clients = () => {
  const [restaurants, setRestaurants] = useState([]); // Initialize as an empty array
  const [isAddingRestaurant, setIsAddingRestaurant] = useState(false);
  const [restaurantForm, setRestaurantForm] = useState({
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
    imageUrl: '', // Will hold the image URL or file path
  });
  const navigation = useNavigation();

  // Fetch current user token from AsyncStorage
  const getUserToken = async () => {
    const token = await AsyncStorage.getItem('userToken');
    return token;
  };

  // Fetch all restaurants
  const fetchRestaurants = async () => {
    try {
      const token = await getUserToken();
      console.log('token infor',token)
      const response = await fetch('https://native-restaurant-back-end.onrender.com/api/restaurants', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log('Fetched restaurants:', data); // Log the data to check if it's an array
      setRestaurants(Array.isArray(data) ? data : []); // Ensure it's an array
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  // Handle form input changes
  const handleInputChange = (key, value) => {
    setRestaurantForm({ ...restaurantForm, [key]: value });
  };

  // Handle image picker for mobile
  const handleImagePick = () => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.5 }, // Customize the options as needed
      (response) => {
        if (response.didCancel) {
          console.log('Image picker canceled');
        } else if (response.errorCode) {
          console.error('Image picker error:', response.errorMessage);
        } else {
          // Save the image URI to the form state
          setRestaurantForm({ ...restaurantForm, imageUrl: response.assets[0].uri });
        }
      }
    );
  };

  // Handle image picker for desktop
  const handleFilePick = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setRestaurantForm({ ...restaurantForm, imageUrl });
    }
  };

  // Handle submit (add or update restaurant)
  const handleSubmitRestaurant = async () => {
    const token = await getUserToken();
    const url = isAddingRestaurant
      ? 'https://native-restaurant-back-end.onrender.com/api/restaurants'
      : `https://native-restaurant-back-end.onrender.com/api/restaurants/${restaurantForm.id}`;
    const method = isAddingRestaurant ? 'POST' : 'PUT';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...restaurantForm,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(isAddingRestaurant ? 'Restaurant added successfully!' : 'Restaurant updated successfully!');
        setIsAddingRestaurant(false);
        fetchRestaurants(); // Refresh restaurant list
      } else {
        alert(`Error: ${data.message || 'Failed to save restaurant'}`);
      }
    } catch (error) {
      alert('Network Error:', error.message);
    }
  };

  // Handle delete restaurant
  const handleDeleteRestaurant = async (restaurantId) => {
    const token = await getUserToken();
    try {
      const response = await fetch(`https://native-restaurant-back-end.onrender.com/api/restaurants/${restaurantId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('Restaurant deleted successfully!');
        fetchRestaurants(); // Refresh restaurant list
      } else {
        alert('Failed to delete restaurant');
      }
    } catch (error) {
      alert('Error deleting restaurant:', error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="Add Restaurant" onPress={() => setIsAddingRestaurant(!isAddingRestaurant)} />
        <Button title="Profile" onPress={() => navigation.navigate('Profile')} />
      </View>

      {isAddingRestaurant && (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Restaurant Name"
            value={restaurantForm.name}
            onChangeText={(text) => handleInputChange('name', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={restaurantForm.description}
            onChangeText={(text) => handleInputChange('description', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={restaurantForm.address}
            onChangeText={(text) => handleInputChange('address', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Contact"
            value={restaurantForm.contact}
            onChangeText={(text) => handleInputChange('contact', text)}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={restaurantForm.email}
            onChangeText={(text) => handleInputChange('email', text)}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Service"
            value={restaurantForm.service}
            onChangeText={(text) => handleInputChange('service', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Type"
            value={restaurantForm.type}
            onChangeText={(text) => handleInputChange('type', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Price of Booking"
            value={restaurantForm.priceOfBooking}
            onChangeText={(text) => handleInputChange('priceOfBooking', text)}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Number of Days Booked"
            value={restaurantForm.numberOfDaysBooked}
            onChangeText={(text) => handleInputChange('numberOfDaysBooked', text)}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Number of People Booked"
            value={restaurantForm.numberOfPeopleBooked}
            onChangeText={(text) => handleInputChange('numberOfPeopleBooked', text)}
            keyboardType="numeric"
          />

          {/* Image Picker for Mobile */}
          {Platform.OS !== 'web' ? (
            <>
              <Button title="Pick an Image" onPress={handleImagePick} />
              {restaurantForm.imageUrl ? (
                <Image source={{ uri: restaurantForm.imageUrl }} style={styles.image} />
              ) : (
                <Text>No image selected</Text>
              )}
            </>
          ) : (
            // File input for desktop
            <>
              <Button title="Pick an Image" onPress={() => document.getElementById('fileInput').click()} />
              <input
                type="file"
                id="fileInput"
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleFilePick}
              />
              {restaurantForm.imageUrl ? (
                <Image source={{ uri: restaurantForm.imageUrl }} style={styles.image} />
              ) : (
                <Text>No image selected</Text>
              )}
            </>
          )}

          <Button title={isAddingRestaurant ? 'Add Restaurant' : 'Update Restaurant'} onPress={handleSubmitRestaurant} />
        </View>
      )}

      <View style={styles.restaurantList}>
        {Array.isArray(restaurants) && restaurants.length > 0 ? (
          restaurants.map((restaurant) => (
            <View key={restaurant.id} style={styles.restaurantItem}>
              <Text>{restaurant.name}</Text>
              <Text>{restaurant.description}</Text>
              <TouchableOpacity onPress={() => handleDeleteRestaurant(restaurant.id)}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text>No restaurants found</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  form: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 10,
    marginBottom: 10,
  },
  restaurantList: {
    marginTop: 20,
  },
  restaurantItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  deleteText: {
    color: 'red',
    fontWeight: 'bold',
    marginTop: 5,
  },
});

export default Clients;
