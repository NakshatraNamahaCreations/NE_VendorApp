import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';

const GoogleMap = () => {
  const [address, setAddress] = useState('');

  const [coordinates, setCoordinates] = useState(null);
  const [houseFlatBlock, setHouseFlatBlock] = useState('');
  const [distric, setDistric] = useState('');
  const [cityDownVillage, setCityDownVillage] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  const getCoordinatesFromAddress = async () => {
    const fullAddress = `${cityDownVillage}, ${distric}, ${state}`;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          fullAddress,
        )}`,
        {
          headers: {
            'User-Agent': 'Nithyaevent/1.0 nithyaevents24@gmail.com',
            'Accept-Language': 'en',
          },
        },
      );

      const text = await response.text();
      console.log('Raw response:', text);

      const data = JSON.parse(text);

      if (data && data.length > 0) {
        const {lat, lon} = data[0];
        console.log('Lat:', lat, 'Long:', lon);
        setCoordinates({lat, lon});
      } else {
        console.log("Couldn't find coordinates for the address.");
        setCoordinates(null);
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Business Address</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 123 Main St, Bangalore"
        value={address}
        onChangeText={setAddress}
      />
      <View style={{marginRight: 2}}>
        <TextInput
          style={{
            backgroundColor: 'transparent',
            borderRadius: 6,
            borderWidth: 1,
            borderColor: '#b7b4b4',
            color: 'black',
            fontSize: 13,
            padding: 10,
            marginBottom: 10,
            fontFamily: 'Montserrat-Medium',
            marginVertical: 10,
            textAlignVertical: 'top',
          }}
          placeholderTextColor="#757575"
          placeholder="Enter your address here"
          multiline
          numberOfLines={4}
          value={houseFlatBlock}
          onChangeText={message => setHouseFlatBlock(message)}
        />
      </View>
      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 0.6, marginRight: 2}}>
          <Text
            style={{
              color: 'black',
              fontSize: 12,
              fontFamily: 'Montserrat-Medium',
              marginBottom: 5,
            }}>
            STATE
          </Text>
          <TextInput
            placeholderTextColor="#757575"
            placeholder="e.g. Karnataka"
            value={state}
            onChangeText={val => setState(val)}
            style={{
              borderWidth: 1,
              borderColor: '#d5d5d5',
              color: 'black',
              fontSize: 13,
              borderRadius: 10,
              paddingLeft: 15,
              backgroundColor: 'white',
              marginBottom: 10,
              fontFamily: 'Montserrat-Medium',
            }}
          />
        </View>
        <View style={{flex: 0.6, marginRight: 2}}>
          <Text
            style={{
              color: 'black',
              fontSize: 12,
              fontFamily: 'Montserrat-Medium',
              marginBottom: 5,
            }}>
            DISTRIC
          </Text>
          <TextInput
            placeholderTextColor="#757575"
            placeholder="e.g. Bangalore"
            value={distric}
            onChangeText={val => setDistric(val)}
            style={{
              borderWidth: 1,
              borderColor: '#d5d5d5',
              color: 'black',
              fontSize: 13,
              borderRadius: 10,
              paddingLeft: 15,
              backgroundColor: 'white',
              marginBottom: 10,
              fontFamily: 'Montserrat-Medium',
            }}
          />
        </View>
      </View>
      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 0.6, marginRight: 2}}>
          <Text
            style={{
              color: 'black',
              fontSize: 12,
              fontFamily: 'Montserrat-Medium',
              marginBottom: 5,
            }}>
            CITY
          </Text>
          <TextInput
            placeholderTextColor="#757575"
            placeholder="e.g. Electronic City"
            value={cityDownVillage}
            onChangeText={val => setCityDownVillage(val)}
            style={{
              borderWidth: 1,
              borderColor: '#d5d5d5',
              color: 'black',
              fontSize: 12,
              borderRadius: 10,
              paddingLeft: 15,
              backgroundColor: 'white',
              marginBottom: 10,
              fontFamily: 'Montserrat-Medium',
            }}
          />
        </View>

        <View style={{flex: 0.6, marginLeft: 2}}>
          <Text
            style={{
              color: 'black',
              fontSize: 12,
              fontFamily: 'Montserrat-Medium',
              marginBottom: 5,
            }}>
            PINCODE
          </Text>
          <TextInput
            placeholderTextColor="#757575"
            placeholder="e.g. 560100"
            value={pincode}
            maxLength={6}
            onChangeText={val => setPincode(val)}
            keyboardType="number-pad"
            style={{
              borderWidth: 1,
              borderColor: '#d5d5d5',
              color: 'black',
              fontSize: 12,
              borderRadius: 10,
              paddingLeft: 15,
              backgroundColor: 'white',
              marginBottom: 10,
              fontFamily: 'Montserrat-Medium',
            }}
          />
        </View>
      </View>
      <Button title="Get Coordinates" onPress={getCoordinatesFromAddress} />
      {coordinates && (
        <View style={styles.result}>
          <Text>Latitude: {coordinates.lat}</Text>
          <Text>Longitude: {coordinates.lon}</Text>
        </View>
      )}
    </View>
  );
};

export default GoogleMap;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    // marginTop: 10,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  result: {
    marginTop: 15,
  },
});
