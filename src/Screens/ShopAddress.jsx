import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  BackHandler,
  PermissionsAndroid,
  Platform,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {apiUrl} from '../api-services/api-constants';
import THEMECOLOR from '../utilities/color';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, useRoute} from '@react-navigation/native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

const GOOGLE_MAPS_API_KEY = 'AIzaSyDLyeYKWC3vssuRVGXktAT_cY-8-qHEA_g';

function ShopAddress() {
  const navigation = useNavigation();
  const route = useRoute();
  const vendor = route.params?.vendorData || {};
  const mapRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [directions, setDirections] = useState('');
  const [houseFlatBlock, setHouseFlatBlock] = useState('');
  const [cityDownVillage, setCityDownVillage] = useState('');
  const [distric, setDistric] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [region, setRegion] = useState({
    latitude: 12.900724675418454,
    longitude: 77.52341310849678,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });
  const [marker, setMarker] = useState({
    latitude: 12.900724675418454,
    longitude: 77.52341310849678,
  });

  const asterisk = () => <Text style={{color: '#f44336'}}>*</Text>;
  const textFieldSanitized = val => val.replace(/[^a-zA-Z ]/g, '');
  const numericFieldSanitized = val => val.replace(/[^0-9]/g, '');
  const splCharSanitized = val => val.replace(/[^a-zA-Z0-9 ,./-]/g, '');

  useEffect(() => {
    Geocoder.init(GOOGLE_MAPS_API_KEY);
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        Alert.alert(
          'Exit App',
          'Do you want to exit the app?',
          [
            {text: 'Cancel', onPress: () => null, style: 'cancel'},
            {text: 'Yes', onPress: () => BackHandler.exitApp()},
          ],
          {cancelable: false},
        );
        return true;
      },
    );
    return () => backHandler.remove();
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS !== 'android') return true;
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ]);
      return (
        granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
          PermissionsAndroid.RESULTS.GRANTED ||
        granted[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] ===
          PermissionsAndroid.RESULTS.GRANTED
      );
    } catch (e) {
      console.log('Permission error:', e);
      return false;
    }
  };

  const fillFromGeocode = json => {
    if (!json?.results?.length) return;
    const first = json.results[0];
    const components = first.address_components || [];
    const get = type =>
      components.find(c => c.types.includes(type))?.long_name || '';

    const stateName = get('administrative_area_level_1');
    const districtName =
      get('administrative_area_level_2') || get('administrative_area_level_3');
    const cityName =
      get('locality') ||
      get('sublocality') ||
      get('sublocality_level_1') ||
      get('administrative_area_level_3');
    const pin = get('postal_code');
    const route = get('route');
    const subloc = get('sublocality') || get('sublocality_level_1');
    const premise = get('premise') || get('subpremise') || get('street_number');

    const line = [premise, route, subloc].filter(Boolean).join(', ');
    if (line) setHouseFlatBlock(splCharSanitized(line));
    else if (first.formatted_address) {
      setHouseFlatBlock(splCharSanitized(first.formatted_address));
    }
    if (stateName) setState(textFieldSanitized(stateName));
    if (districtName) setDistric(textFieldSanitized(districtName));
    if (cityName) setCityDownVillage(textFieldSanitized(cityName));
    if (pin) setPincode(numericFieldSanitized(pin));
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const json = await Geocoder.from(lat, lng);
      fillFromGeocode(json);
      return true;
    } catch (e) {
      console.log('Geocoder error:', e);
      return false;
    }
  };

  const moveTo = (lat, lng) => {
    const next = {
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    setRegion(next);
    setMarker({latitude: lat, longitude: lng});
    mapRef.current?.animateToRegion(next, 600);
  };

  const fetchPosition = options =>
    new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(resolve, reject, options);
    });

  const handleUseCurrentLocation = async () => {
    const ok = await requestLocationPermission();
    if (!ok) {
      Alert.alert(
        'Permission denied',
        'Location permission is required. Please enable it from app settings.',
      );
      return;
    }
    setLocating(true);
    try {
      let pos;
      try {
        pos = await fetchPosition({
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        });
      } catch (highAccErr) {
        console.log('High-accuracy fix failed, retrying coarse:', highAccErr);
        pos = await fetchPosition({
          enableHighAccuracy: false,
          timeout: 20000,
          maximumAge: 60000,
        });
      }
      const {latitude, longitude} = pos.coords;
      moveTo(latitude, longitude);
      const reversed = await reverseGeocode(latitude, longitude);
      if (!reversed) {
        Alert.alert(
          'Address lookup failed',
          'We got your location but could not auto-fill the address. Please enter it manually or try again.',
        );
      }
    } catch (err) {
      console.log('Geolocation error:', err);
      Alert.alert(
        'Location error',
        err?.message ||
          'Could not fetch your location. Make sure GPS/Location is turned on and try again.',
      );
    } finally {
      setLocating(false);
    }
  };

  const handleMarkerDragEnd = async e => {
    const {latitude, longitude} = e.nativeEvent.coordinate;
    setMarker({latitude, longitude});
    await reverseGeocode(latitude, longitude);
  };

  const handleAddAddress = async () => {
    if (!houseFlatBlock) {
      Alert.alert('Warning', 'Address details are required');
      return;
    }
    if (!state) {
      Alert.alert('Warning', 'State is required');
      return;
    }
    if (!distric) {
      Alert.alert('Warning', 'District is required');
      return;
    }
    if (!cityDownVillage) {
      Alert.alert('Warning', 'City is required');
      return;
    }
    if (!pincode) {
      Alert.alert('Warning', 'Pincode is required');
      return;
    }
    if (pincode.length !== 6) {
      Alert.alert('Warning', 'Pincode should be 6 digits');
      return;
    }

    setLoading(true);
    try {
      const config = {
        url: `${apiUrl.ADD_SHIPPING_ADDRESS}${vendor._id}`,
        method: 'put',
        baseURL: apiUrl.BASEURL,
        headers: {'Content-Type': 'application/json'},
        data: {
          address: {
            fullName: vendor.vendor_name,
            mobileNumber: vendor.mobile_number,
            houseFlatBlock,
            cityDownVillage,
            distric,
            state,
            pincode,
            directions,
            latitude: marker.latitude,
            longitude: marker.longitude,
          },
        },
      };
      const response = await axios(config);
      if (response.status === 200) {
        await AsyncStorage.setItem('vendor', JSON.stringify(vendor));
        navigation.navigate('Waiting');
      }
    } catch (error) {
      console.log('Add address error:', error);
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'An unknown error occurred',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={{paddingBottom: 30}}
        keyboardShouldPersistTaps="handled">
        <View style={{height: 260, width: '100%'}}>
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={StyleSheet.absoluteFillObject}
            region={region}
            onRegionChangeComplete={setRegion}>
            <Marker
              draggable
              coordinate={marker}
              onDragEnd={handleMarkerDragEnd}
            />
          </MapView>
          <TouchableOpacity
            onPress={handleUseCurrentLocation}
            disabled={locating}
            style={styles.gpsBtn}>
            {locating ? (
              <ActivityIndicator size="small" color={THEMECOLOR.textColor} />
            ) : (
              <>
                <MaterialCommunityIcons
                  name="crosshairs-gps"
                  size={16}
                  color={THEMECOLOR.textColor}
                />
                <Text style={styles.gpsBtnText}>Use Current Location</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={{paddingHorizontal: 15, paddingTop: 12, zIndex: 10}}>
          <Text style={styles.searchLabel}>
            <Ionicons name="search" size={13} color="black" /> Search Location
          </Text>
          <GooglePlacesAutocomplete
            placeholder="Search address, area or landmark"
            fetchDetails
            enablePoweredByContainer={false}
            onPress={(data, details = null) => {
              if (details?.geometry?.location) {
                const {lat, lng} = details.geometry.location;
                moveTo(lat, lng);
                fillFromGeocode({results: [details]});
              }
            }}
            query={{
              key: GOOGLE_MAPS_API_KEY,
              language: 'en',
              components: 'country:in',
            }}
            styles={{
              textInput: styles.placesInput,
              listView: styles.placesList,
              row: {backgroundColor: 'white'},
              description: {color: 'black', fontFamily: 'Montserrat-Medium'},
            }}
            textInputProps={{placeholderTextColor: '#757575'}}
          />
        </View>

        <View style={{paddingHorizontal: 15, paddingTop: 8}}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="location" size={15} color="black" /> Address
          </Text>

          <Text style={styles.label}>ADDRESS DETAILS {asterisk()}</Text>
          <TextInput
            style={styles.multilineInput}
            placeholderTextColor="#757575"
            placeholder="House / Flat / Block, Road / Area"
            multiline
            numberOfLines={4}
            value={houseFlatBlock}
            onChangeText={val => setHouseFlatBlock(splCharSanitized(val))}
          />

          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 0.6, marginRight: 4}}>
              <Text style={styles.label}>STATE {asterisk()}</Text>
              <TextInput
                placeholderTextColor="#757575"
                placeholder="e.g. Karnataka"
                value={state}
                onChangeText={val => setState(textFieldSanitized(val))}
                style={styles.input}
              />
            </View>
            <View style={{flex: 0.6, marginLeft: 4}}>
              <Text style={styles.label}>DISTRICT {asterisk()}</Text>
              <TextInput
                placeholderTextColor="#757575"
                placeholder="e.g. Bangalore"
                value={distric}
                onChangeText={val => setDistric(textFieldSanitized(val))}
                style={styles.input}
              />
            </View>
          </View>

          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 0.6, marginRight: 4}}>
              <Text style={styles.label}>CITY {asterisk()}</Text>
              <TextInput
                placeholderTextColor="#757575"
                placeholder="e.g. Electronic City"
                value={cityDownVillage}
                onChangeText={val =>
                  setCityDownVillage(textFieldSanitized(val))
                }
                style={styles.input}
              />
            </View>
            <View style={{flex: 0.6, marginLeft: 4}}>
              <Text style={styles.label}>PINCODE {asterisk()}</Text>
              <TextInput
                placeholderTextColor="#757575"
                placeholder="e.g. 560100"
                value={pincode}
                maxLength={6}
                keyboardType="number-pad"
                onChangeText={val => setPincode(numericFieldSanitized(val))}
                style={styles.input}
              />
            </View>
          </View>

          <Text style={styles.label}>LANDMARK (optional)</Text>
          <TextInput
            placeholderTextColor="#757575"
            placeholder="Landmark or directions"
            value={directions}
            onChangeText={setDirections}
            style={styles.input}
          />

          <TouchableOpacity
            style={styles.submitBtn}
            disabled={loading}
            onPress={!loading ? handleAddAddress : null}>
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.submitText}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  gpsBtn: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEMECOLOR.mainColor,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    elevation: 3,
  },
  gpsBtnText: {
    color: THEMECOLOR.textColor,
    fontSize: 12,
    marginLeft: 6,
    fontFamily: 'Montserrat-Medium',
  },
  searchLabel: {
    color: 'black',
    fontSize: 13,
    fontFamily: 'Montserrat-SemiBold',
    marginBottom: 6,
  },
  placesInput: {
    borderWidth: 1,
    borderColor: '#d5d5d5',
    color: 'black',
    fontSize: 13,
    borderRadius: 10,
    paddingLeft: 15,
    backgroundColor: 'white',
    fontFamily: 'Montserrat-Medium',
    height: 44,
  },
  placesList: {
    backgroundColor: 'white',
    borderColor: '#d5d5d5',
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 4,
  },
  sectionTitle: {
    color: 'black',
    fontSize: 15,
    fontFamily: 'Montserrat-SemiBold',
    marginTop: 10,
    marginBottom: 10,
  },
  label: {
    color: 'black',
    fontSize: 12,
    fontFamily: 'Montserrat-Medium',
    marginBottom: 5,
    marginTop: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d5d5d5',
    color: 'black',
    fontSize: 13,
    borderRadius: 10,
    paddingLeft: 15,
    backgroundColor: 'white',
    marginBottom: 6,
    fontFamily: 'Montserrat-Medium',
  },
  multilineInput: {
    backgroundColor: 'transparent',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#b7b4b4',
    color: 'black',
    fontSize: 13,
    padding: 10,
    marginBottom: 6,
    fontFamily: 'Montserrat-Medium',
    textAlignVertical: 'top',
  },
  submitBtn: {
    backgroundColor: THEMECOLOR.mainColor,
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 80,
    marginTop: 20,
  },
  submitText: {
    color: THEMECOLOR.textColor,
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Montserrat-Medium',
  },
});

export default ShopAddress;
