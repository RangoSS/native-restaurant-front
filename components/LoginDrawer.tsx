import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Modal, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage'; // To use AsyncStorage for storing user info
import { useNavigation } from '@react-navigation/native'; // To navigate to client page

const LoginDrawer = ({ visible, onClose }) => {

  const navigation = useNavigation();
  const [isRegister, setIsRegister] = useState(false); // Toggle between login/register
  const [form, setForm] = useState({
    name: '',
    surname: '',
    idNumber: '',
    email: '',
    password: '',
    role: 'user', // Default role
    designation: '',
    joining_date: '',
    salary: '',
    phone: '',
    address: '',
    active: true,
  });

  const handleInputChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    if (isRegister) {
      try {
        const response = await fetch('https://native-restaurant-back-end.onrender.com/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          alert('Registration successful!');
          setIsRegister(false); // Switch to login mode after successful registration
        } else {
          alert(`Error: ${data.message || 'Registration failed'}`);
        }
      } catch (error) {
        alert(`Network Error: ${error.message}`);
      }
    } else {
      try {
        const response = await fetch('https://native-restaurant-back-end.onrender.com/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
          }),
        });
  
        const data = await response.json();
         console.log('my datas',data,response)
        if (response.ok) {
          const { token } = data;
  
          // Decode token to get user info (assuming it's a JWT token)
          const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode base64 part of JWT
          const userId = decodedToken.id;
          const username = decodedToken.name;
  
          // Save user info in localStorage
          await AsyncStorage.setItem('userId', userId.toString());
          await AsyncStorage.setItem('username', username);
          await AsyncStorage.setItem('userToken',token);
      

           // Close modal after login
        onClose();

           // Navigate to the client page (or the page you want after login)
           navigation.navigate('Restaurant'); // Make sure you have the 'Client' screen set up in your navigator
        } else {
          alert(`Error: ${data.message || 'Login failed'}`);
        }
      } catch (error) {
        alert(`Network Error: ${error.message}`);
      }
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{isRegister ? 'Register' : 'Login'}</Text>

          <ScrollView style={{ width: '100%' }}>
            {isRegister && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  value={form.name}
                  onChangeText={(text) => handleInputChange('name', text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Surname"
                  value={form.surname}
                  onChangeText={(text) => handleInputChange('surname', text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="ID Number"
                  value={form.idNumber}
                  onChangeText={(text) => handleInputChange('idNumber', text)}
                  keyboardType="numeric"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Designation"
                  value={form.designation}
                  onChangeText={(text) => handleInputChange('designation', text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Joining Date (YYYY-MM-DD)"
                  value={form.joining_date}
                  onChangeText={(text) => handleInputChange('joining_date', text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Salary"
                  value={form.salary}
                  onChangeText={(text) => handleInputChange('salary', text)}
                  keyboardType="numeric"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Phone"
                  value={form.phone}
                  onChangeText={(text) => handleInputChange('phone', text)}
                  keyboardType="phone-pad"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Address"
                  value={form.address}
                  onChangeText={(text) => handleInputChange('address', text)}
                />
              </>
            )}

            <TextInput
              style={styles.input}
              placeholder="Email"
              value={form.email}
              onChangeText={(text) => handleInputChange('email', text)}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={form.password}
              onChangeText={(text) => handleInputChange('password', text)}
              secureTextEntry
            />

            <Button mode="contained" onPress={handleSubmit} style={styles.button}>
              {isRegister ? 'Register' : 'Login'}
            </Button>

            <Button onPress={() => setIsRegister(!isRegister)} style={styles.switchButton}>
              {isRegister ? 'Already have an account? Login' : 'New user? Register'}
            </Button>

            <Button onPress={onClose} style={styles.closeButton}>Close</Button>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    maxHeight: '90%',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
  },
  button: {
    marginVertical: 10,
  },
  switchButton: {
    marginVertical: 5,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: 'red',
  },
});

export default LoginDrawer;
