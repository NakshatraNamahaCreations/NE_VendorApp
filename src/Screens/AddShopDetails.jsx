import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
// import {Checkbox} from 'react-native-paper';
import THEMECOLOR from '../utilities/color';
// import {Picker} from '@react-native-picker/picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import * as ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import { RadioButton } from 'react-native-paper';
import { apiUrl } from '../api-services/api-constants';
import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
// import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
// import Geocoder from 'react-native-geocoding';

export default function AddShopDetails() {
  const navigation = useNavigation();
  const route = useRoute();
  const vendor = route.params?.vendorData || {};
  console.log('vendor in addshopdetails page for vendor&seller', vendor);
  const [hasNavigated, setHasNavigated] = useState(false);

  const [businessName, setBusinessName] = useState('');
  const [godownName, setGodownName] = useState('');
  const [godownLink, setGodownLink] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [numberPlate, setNumberPlate] = useState('');
  // const [imageUri, setImageUri] = useState('');
  // const [imageFileName, setImageFileName] = useState('');
  const [logoOrImageUri, setLogoOrImageUri] = useState('');
  const [logoOrImageFileName, setLogoOrImageFileName] = useState('');
  const [vehicleUri, setVehicleUri] = useState('');
  const [vehicleFileName, setVehicleFileName] = useState('');
  const [aadhaarFrontUri, setAadhaarFrontUri] = useState('');
  const [aadhaarFrontName, setAadhaarFrontName] = useState('');
  const [aadhaarBackUri, setAadhaarBackUri] = useState('');
  const [aadhaarBackName, setAadhaarBackName] = useState('');
  const [panFrontUri, setPanFrontUri] = useState('');
  const [panFrontName, setPanFrontName] = useState('');
  const [panBackUri, setPanBackUri] = useState('');
  const [panBackName, setPanBackName] = useState('');

  const [checked, setChecked] = useState('');
  const [rcCardNumber, setRcCardNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [region, setRegion] = useState({
    latitude: 12.900724675418454,
    longitude: 77.52341310849678,
    latitudeDelta: 0.015, // Zoom level
    longitudeDelta: 0.0121, // Zoom level
  });
  const [searchText, setSearchText] = useState('');

  const asterisk = () => <Text style={{ color: '#f44336' }}>*</Text>;

  const splCharSanitized = val => {
    return val.replace(/[^a-zA-Z0-9]/g, '')
  };

  const sanitizeGST = val => val.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 15);
  const sanitizePAN = val => val.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
  const sanitizeAadhaar = val => val.replace(/\D/g, '').slice(0, 12);
  const sanitizeBusinessName = val => val.replace(/\s+/g, '').slice(0, 50);
  const isValidGSTIN = gst =>
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[1-9A-Z]{1}$/.test(gst);
  const isValidPAN = pan => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan);
  const isValidAadhaar = num => /^[2-9][0-9]{11}$/.test(num);


  const resizeImage = async imageUri => {
    const resizedImage = await ImageResizer.createResizedImage(
      imageUri,
      800,
      600,
      'JPEG',
      80,
      0,
    );
    return resizedImage.uri;
  };

  const uploadBussinessLogo = () => {
    ImagePicker.launchImageLibrary({ noData: true }, async response => {
      if (response.assets) {
        // console.log('Gellery image:', response);
        const fileNAME = response.assets[0].fileName;
        const galleryPic = response.assets[0].uri;
        const resizedImageUri = await resizeImage(galleryPic);
        setLogoOrImageUri(resizedImageUri);
        setLogoOrImageFileName(fileNAME);
      }
    });
  };

  const uploadVehicleImage = () => {
    ImagePicker.launchImageLibrary({ noData: true }, async response => {
      if (response.assets) {
        // console.log('Gellery image:', response);
        const fileNAME = response.assets[0].fileName;
        const galleryPic = response.assets[0].uri;
        const resizedImageUri = await resizeImage(galleryPic);
        setVehicleUri(resizedImageUri);
        setVehicleFileName(fileNAME);
      }
    });
  };

  const uploadAadhaarFrontPart = () => {
    ImagePicker.launchImageLibrary({ noData: true }, async response => {
      if (response.assets) {
        // console.log('Gellery image:', response);
        const fileNAME = response.assets[0].fileName;
        const galleryPic = response.assets[0].uri;
        const resizedImageUri = await resizeImage(galleryPic);
        setAadhaarFrontUri(resizedImageUri);
        setAadhaarFrontName(fileNAME);
      }
    });
  };
  const uploadAadhaarBackPart = () => {
    ImagePicker.launchImageLibrary({ noData: true }, async response => {
      if (response.assets) {
        // console.log('Gellery image:', response);
        const fileNAME = response.assets[0].fileName;
        const galleryPic = response.assets[0].uri;
        const resizedImageUri = await resizeImage(galleryPic);
        setAadhaarBackUri(resizedImageUri);
        setAadhaarBackName(fileNAME);
      }
    });
  };
  const uploadPanFrontPart = () => {
    ImagePicker.launchImageLibrary({ noData: true }, async response => {
      if (response.assets) {
        const fileNAME = response.assets[0].fileName;
        const galleryPic = response.assets[0].uri;
        const resizedImageUri = await resizeImage(galleryPic);
        setPanFrontUri(resizedImageUri);
        setPanFrontName(fileNAME);
      }
    });
  };
  const uploadPanBackPart = () => {
    ImagePicker.launchImageLibrary({ noData: true }, async response => {
      if (response.assets) {
        const fileNAME = response.assets[0].fileName;
        const galleryPic = response.assets[0].uri;
        const resizedImageUri = await resizeImage(galleryPic);
        setPanBackUri(resizedImageUri);
        setPanBackName(fileNAME);
      }
    });
  };
  // console.log('checked', checked);

  const handleAddShopDetails = async () => {
    setIsLoading(true);
    // if (
    //   !businessName ||
    //   !logoOrImageFileName ||
    //   !aadhaarFrontName ||
    //   !aadhaarBackName ||
    //   !gstNumber ||
    //   !panNumber ||
    //   !checked
    // ) {
    //   Alert.alert('Please fill all the mandotary fields');
    //   setIsLoading(false);
    //   return;
    // }
    if (!businessName) {
      Alert.alert('Warning', 'Business Name is required');
      setIsLoading(false);
      return;
    }
    if (businessName.length < 3 || businessName.length > 50) {
      Alert.alert(
        'Warning',
        'Business Name must be between 3 and 50 characters',
      );
      setIsLoading(false);
      return;
    }
    if (/\s/.test(businessName)) {
      Alert.alert('Warning', 'Business Name cannot contain spaces');
      setIsLoading(false);
      return;
    }
    if (!logoOrImageUri) {
      Alert.alert('Warning', 'Business logo is required');
      setIsLoading(false);
      return;
    }
    if (!aadhaarFrontUri) {
      Alert.alert('Warning', 'Aadhaar front side image is required');
      setIsLoading(false);
      return;
    }
    if (!aadhaarBackUri) {
      Alert.alert('Warning', 'aadhaar back side image is required');
      setIsLoading(false);
      return;
    }
    if (!aadhaarNumber) {
      Alert.alert('Warning', 'Aadhaar Number is required');
      setIsLoading(false);
      return;
    }
    if (!isValidAadhaar(aadhaarNumber)) {
      Alert.alert('Error', 'Please enter a valid 12-digit Aadhaar number');
      setIsLoading(false);
      return;
    }
    if (!gstNumber) {
      Alert.alert('Warning', 'GST Number is required');
      setIsLoading(false);
      return;
    }
    if (!isValidGSTIN(gstNumber)) {
      Alert.alert('Error', 'Please enter a valid 15-character GSTIN (e.g. 22AAAAA0000A1Z5)');
      setIsLoading(false);
      return;
    }
    if (gstNumber.slice(-1) === '0') {
      Alert.alert('Error', 'GST number last digit cannot be "0"');
      setIsLoading(false);
      return;
    }
    if (!panNumber) {
      Alert.alert('Warning', 'PAN Number is required');
      setIsLoading(false);
      return;
    }
    if (!isValidPAN(panNumber)) {
      Alert.alert('Error', 'Please enter a valid 10-character PAN (e.g. ABCDE1234F)');
      setIsLoading(false);
      return;
    }
    if (!panFrontUri) {
      Alert.alert('Warning', 'PAN front side image is required');
      setIsLoading(false);
      return;
    }
    if (!panBackUri) {
      Alert.alert('Warning', 'PAN back side image is required');
      setIsLoading(false);
      return;
    }
    if (checked === 'own') {
      const requiredFields = [
        { value: vehicleFileName, name: 'Vehicle File Name' },
        { value: vehicleType, name: 'Vehicle Type' },
        { value: numberPlate, name: 'Number Plate' },
        { value: rcCardNumber, name: 'RC Card Number' },
        { value: vehicleUri, name: 'Vehicle Image/URI' },
      ];
      const isAnyFieldEmpty = requiredFields.find(fields => !fields.value);
      if (isAnyFieldEmpty) {
        Alert.alert('Error', `Please fill the ${isAnyFieldEmpty.name}.`);
        setIsLoading(false);
        return;
      }
    }
    try {
      const formData = new FormData();
      formData.append('shop_name', businessName);
      formData.append('godown_name', godownName);
      formData.append('godown_pin', godownLink);
      formData.append('gst_number', gstNumber);
      formData.append('pan_number', panNumber);
      formData.append('aadhaar_number', aadhaarNumber);
      formData.append('vehicle_name', vehicleType);
      formData.append('number_plate', numberPlate);
      formData.append('vehicle_by', checked);

      formData.append('shop_image_or_logo', {
        uri: logoOrImageUri,
        type: 'image/jpeg',
        name: logoOrImageFileName || 'image.jpg',
      });

      if (vehicleUri && vehicleFileName) {
        formData.append('vehicle_image', {
          uri: vehicleUri,
          type: 'image/jpeg',
          name: vehicleFileName || 'image.jpg',
        });
      }

      if (aadhaarFrontUri && aadhaarFrontName) {
        formData.append('aadhaar_front', {
          uri: aadhaarFrontUri,
          type: 'image/jpeg',
          name: aadhaarFrontName || 'image.jpg',
        });
      }
      if (aadhaarBackUri && aadhaarBackName) {
        formData.append('aadhaar_back', {
          uri: aadhaarBackUri,
          type: 'image/jpeg',
          name: aadhaarBackName || 'image.jpg',
        });
      }
      if (panFrontUri && panFrontName) {
        formData.append('pan_front', {
          uri: panFrontUri,
          type: 'image/jpeg',
          name: panFrontName || 'image.jpg',
        });
      }
      if (panBackUri && panBackName) {
        formData.append('pan_back', {
          uri: panBackUri,
          type: 'image/jpeg',
          name: panBackName || 'image.jpg',
        });
      }

      const response = await axios.put(
        `${apiUrl.BASEURL}${apiUrl.ADD_VENDOR_BUSINESS_DETAILS}${vendor._id}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );
      console.log('response', response.data);

      if (response.status === 200) {
        if (!hasNavigated) {
          setHasNavigated(true);
          Alert.alert('Success', response.data.message);
          navigation.navigate('AddShopAddress', {
            vendorData: response.data.vendorShop,
          });
        }
      }
    } catch (error) {
      console.log('Unknown error:', error);
      if (error.response && error.response.data) {
        Alert.alert('Error', error.response.data.message);
      } else {
        Alert.alert('Error', 'An unknown error occurred', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // below one need for later use-fullfilled
  // const handleAddShopDetails = async () => {
  //   setIsLoading(true);
  //   if (
  //     !businessName ||
  //     // !gstNumber ||
  //     !logoOrImageFileName ||
  //     !checked
  //   ) {
  //     Alert.alert('Please fill all the fields');
  //   }
  //   if (checked === 'own') {
  //     const requiredFields = [
  //       vehicleFileName,
  //       vehicleType,
  //       numberPlate,
  //       rcCardNumber,
  //       vehicleUri,
  //     ];
  //     const isAnyFieldEmpty = requiredFields.some(fields => !fields);
  //     if (isAnyFieldEmpty) {
  //       Alert.alert('Please fill all the fields');
  //     }
  //   }
  //   try {
  //     const formData = new FormData();
  //     formData.append('shop_name', businessName);
  //     formData.append('godown_name', godownName);
  //     formData.append('godown_pin', godownLink);
  //     formData.append('gst_number', gstNumber);
  //     formData.append('pan_number', panNumber);
  //     formData.append('vehicle_name', vehicleType);
  //     formData.append('number_plate', numberPlate);
  //     formData.append('vehicle_by', checked);
  //     formData.append('shop_image_or_logo', {
  //       uri: logoOrImageUri,
  //       type: 'image/jpeg',
  //       name: logoOrImageFileName || 'image.jpg',
  //     });
  //     formData.append('vehicle_image', {
  //       uri: vehicleUri,
  //       type: 'image/jpeg',
  //       name: vehicleFileName || 'image.jpg',
  //     });

  //     const response = await axios.put(
  //       `${apiUrl.BASEURL}${apiUrl.ADD_VENDOR_BUSINESS_DETAILS}${vendor._id}`,
  //       formData,
  //       {
  //         headers: {'Content-Type': 'multipart/form-data'},
  //       },
  //     );
  //     console.log('response', response.data);

  //     if (response.status === 200) {
  //       // Alert.alert('Success', response.data.message);
  //       // console.log('AsyncStorage', response.data.vendorShop);
  //       // navigation.navigate('AddShopAddress', {
  //       //   vendorData: response.data.vendorShop,
  //       // });
  //       if (!hasNavigated) {
  //         // Only navigate if not already navigated
  //         setHasNavigated(true);
  //         Alert.alert('Success', response.data.message);
  //         navigation.navigate('AddShopAddress', {
  //           vendorData: response.data.vendorShop,
  //         });
  //       }
  //     }
  //   } catch (error) {
  //     console.log('Unknown error:', error);
  //     if (error.response && error.response.data) {
  //       Alert.alert('Error', error.response.data.message);
  //     } else {
  //       Alert.alert('Error', 'An unknown error occurred', error);
  //     }
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  useEffect(() => {
    if (!hasNavigated) {
      // Add further logic here if needed
      setHasNavigated(false);
    }
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        Alert.alert(
          'Exit App',
          'Do you want to exit the app?',
          [
            { text: 'Cancel', onPress: () => null, style: 'cancel' },
            { text: 'Yes', onPress: () => BackHandler.exitApp() },
          ],
          { cancelable: false },
        );
        return true;
      },
    );

    // Clean up the event listener
    return () => backHandler.remove();
  }, []);

  return (
    <View
      style={{
        padding: 15,
        backgroundColor: 'white',
        height: '100%',
        paddingTop: 20,
      }}>
      <ScrollView>
        <Text
          style={{
            fontSize: 15,
            fontFamily: 'Montserrat-SemiBold',
            marginBottom: 10,
            // letterSpacing: 1,
            color: 'black',
          }}>
          Bussiness Details
        </Text>
        <Text
          style={{
            color: 'black',
            fontSize: 14,
            marginBottom: 5,
            fontFamily: 'Montserrat-Medium',
            // letterSpacing: 1,
          }}>
          Business Name {asterisk()}
        </Text>
        <TextInput
          placeholderTextColor="#757575"
          placeholder="Enter business name"
          value={businessName}
          maxLength={50}
          onChangeText={val => setBusinessName(sanitizeBusinessName(val))}
          style={{
            borderWidth: 1,
            borderColor: '#d5d5d5',
            color: 'black',
            fontSize: 14,
            borderRadius: 10,
            paddingLeft: 15,
            backgroundColor: 'white',
            marginBottom: 10,
            fontFamily: 'Montserrat-Medium',
            // letterSpacing: 1,
          }}
        />
        {/* <View style={{flexDirection: 'row', marginBottom: 5}}> */}
        {/* <View style={{flex: 0.6, marginRight: 2}}>
            <Text
              style={{
                color: 'black',
                fontSize: 14,
                fontFamily: 'Montserrat-Medium',
                // letterSpacing: 1,
                marginBottom: 5,
              }}>
              Godown Name
            </Text>
            <TextInput
              placeholderTextColor="#757575"
              placeholder="Godown Name"
              value={godownName}
              // maxLength={10}
              onChangeText={val => setGodownName(val)}
              // keyboardType="number-pad"
              style={{
                borderWidth: 1,
                // width: '100%',
                borderColor: '#d5d5d5',
                color: 'black',
                fontSize: 14,
                borderRadius: 10,
                paddingLeft: 15,
                backgroundColor: 'white',
                marginBottom: 10,
                fontFamily: 'Montserrat-Medium',
                // letterSpacing: 1,
              }}
            />
          </View> */}
        {/* <View>
          <Text
            style={{
              color: 'black',
              fontSize: 14,
              fontFamily: 'Montserrat-Medium',
              // letterSpacing: 1,
              marginBottom: 5,
            }}>
            <Ionicons name="location" size={15} color="black" /> Godown Pin
          </Text> */}
        {/* <TextInput
            placeholderTextColor="#757575"
            placeholder="Google map link"
            value={godownLink}
            // maxLength={10}
            onChangeText={val => setGodownLink(val)}
            // keyboardType="number-pad"
            style={{
              borderWidth: 1,
              // width: '100%',
              borderColor: '#d5d5d5',
              color: 'black',
              fontSize: 14,
              borderRadius: 10,
              paddingLeft: 15,
              backgroundColor: 'white',
              marginBottom: 10,
              fontFamily: 'Montserrat-Medium',
              // letterSpacing: 1,
            }}
          /> */}
        {/* <GooglePlacesAutocomplete
            placeholder="Search"
            onPress={(data, details = null) => {
              // console.log('data', data);
              // console.log('details>>>>', details);
              if (details) {
                const {lat, lng} = details.geometry?.location;
                setRegion({
                  latitude: lat,
                  longitude: lng,
                  latitudeDelta: 0.015,
                  longitudeDelta: 0.0121,
                });
                setMarkerPosition({latitude: lat, longitude: lng});
                setSelectedRegion(data.description);
              }
            }}
            fetchDetails={true} // Fetch details like lat/lng
            query={{
              key: 'AIzaSyDLyeYKWC3vssuRVGXktAT_cY-8-qHEA_g',
              language: 'en',
            }}
            styles={{
              textInput: {
                borderColor: '#7a7a7a',
                borderWidth: 1,
                borderRadius: 15,
                // width: '100%',
                height: 50,
                padding: 5,
                flex: 0.9,
                color: 'black',
                fontFamily: 'Montserrat-Medium',
                fontSize: 16,
                paddingLeft: 16,
              },
              predefinedPlacesDescription: {
                color: '#1faadb',
              },
              container: {
                flex: 1, // Allow GooglePlacesAutocomplete to take up remaining space
                zIndex: 1, // Ensure suggestions appear above other elements
              },
              listView: {
                zIndex: 2, // Ensure that the listView appears above other elements
              },
              row: {
                backgroundColor: '#ffffff', // Background color of suggestion rows
                padding: 13,
                height: 44,
                flexDirection: 'row',
              },
              description: {
                color: 'black', // This sets the text color of the suggestion results to black
                fontFamily: 'Montserrat-Medium', // Optional: Keep font consistent
              },
              separator: {
                height: 0.5,
                backgroundColor: '#c8c7cc', // Line between suggestions
              },
            }}
            textInputProps={{
              value: searchText,
              onChangeText: text => setSearchText(text),
              placeholderTextColor: '#999999',
            }}
          /> */}
        {/* </View> */}
        {/* </View> */}
        {/* <View
          style={{
            flexDirection: 'row',
            marginBottom: 15,
            alignItems: 'center',
          }}>
          <View style={{flex: 0.6}}>
            <Text
              style={{
                color: 'black',
                fontSize: 14,
                // marginBottom: 5,
                fontFamily: 'Montserrat-Medium',
                // letterSpacing: 1,
              }}>
              Business Image
            </Text>
          </View>
          <View
            style={{
              flex: 0.6,
              marginLeft: 2,
              // alignItems: 'flex-start',
              // justifyContent: 'center',
            }}>
            <TouchableOpacity onPress={uploadBussinessImage}>
              <Text
                style={{
                  color: 'black',
                  fontSize: 14,
                  marginLeft: 5,
                  fontFamily: 'Montserrat-Medium',
                }}>
                {imageFileName ? (
                  imageFileName
                ) : (
                  <>
                    <Feather name="upload" size={25} color="black" /> Upload
                    Image
                  </>
                )}
              </Text>
            </TouchableOpacity>
          </View>
        </View> */}
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 15,
            alignItems: 'center',
          }}>
          <View style={{ flex: 0.6 }}>
            <Text
              style={{
                color: 'black',
                fontSize: 14,
                // marginBottom: 5,
                fontFamily: 'Montserrat-Medium',
                // letterSpacing: 1,
              }}>
              Business or shop Image/Logo {asterisk()}
            </Text>
          </View>
          <View
            style={{
              flex: 0.6,
              marginLeft: 2,
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
            }}>
            <TouchableOpacity onPress={uploadBussinessLogo}>
              <Text
                style={{
                  color: 'black',
                  fontSize: 14,
                  marginLeft: 5,
                  fontFamily: 'Montserrat-Medium',
                }}>
                {logoOrImageFileName ? (
                  logoOrImageFileName
                ) : (
                  <>
                    <Feather name="upload" size={25} color="black" /> Upload
                  </>
                )}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text
          style={{
            color: 'black',
            fontSize: 15,
            fontFamily: 'Montserrat-SemiBold',
            // letterSpacing: 1,
            marginTop: 5,
            marginBottom: 10,
          }}>
          Documents {asterisk()}
        </Text>

        {/* <View
          style={{
            flexDirection: 'row',
            marginBottom: 10,
            alignItems: 'center',
          }}> */}
        <View style={{ marginBottom: 10 }}>
          <TextInput
            placeholderTextColor="#757575"
            placeholder="GST number"
            value={gstNumber}
            autoCapitalize="characters"
            maxLength={15}
            onChangeText={val => setGstNumber(sanitizeGST(val))}
            // keyboardType="number-pad"
            style={{
              borderWidth: 1,
              // width: '100%',
              borderColor: '#d5d5d5',
              color: 'black',
              fontSize: 14,
              borderRadius: 10,
              paddingLeft: 15,
              backgroundColor: 'white',
              // marginBottom: 10,
              fontFamily: 'Montserrat-Medium',
              // letterSpacing: 1,
            }}
          />
        </View>
        <View style={{ marginBottom: 10 }}>
          <TextInput
            placeholderTextColor="#757575"
            placeholder="PAN number"
            value={panNumber}
            autoCapitalize="characters"
            maxLength={10}
            onChangeText={val => setPanNumber(sanitizePAN(val))}
            // keyboardType="number-pad"
            style={{
              borderWidth: 1,
              // width: '100%',
              borderColor: '#d5d5d5',
              color: 'black',
              fontSize: 14,
              borderRadius: 10,
              paddingLeft: 15,
              backgroundColor: 'white',
              // marginBottom: 10,
              fontFamily: 'Montserrat-Medium',
              // letterSpacing: 1,
            }}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 15,
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: 'black',
              fontSize: 14,
              flex: 0.6,
              fontFamily: 'Montserrat-Medium',
            }}>
            Aadhaar Front Side Image {asterisk()}
          </Text>
          <View
            style={{
              flex: 0.6,
              marginLeft: 2,
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
            }}>
            <TouchableOpacity onPress={uploadAadhaarFrontPart}>
              <Text
                style={{
                  color: 'black',
                  fontSize: 14,
                  marginLeft: 5,
                  fontFamily: 'Montserrat-Medium',
                }}>
                {aadhaarFrontName ? (
                  aadhaarFrontName
                ) : (
                  <>
                    <Feather name="upload" size={25} color="black" /> Upload
                  </>
                )}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 15,
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: 'black',
              fontSize: 14,
              flex: 0.6,
              fontFamily: 'Montserrat-Medium',
            }}>
            Aadhaar Back Side Image {asterisk()}
          </Text>
          <View
            style={{
              flex: 0.6,
              marginLeft: 2,
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
            }}>
            <TouchableOpacity onPress={uploadAadhaarBackPart}>
              <Text
                style={{
                  color: 'black',
                  fontSize: 14,
                  marginLeft: 5,
                  fontFamily: 'Montserrat-Medium',
                }}>
                {aadhaarBackName ? (
                  aadhaarBackName
                ) : (
                  <>
                    <Feather name="upload" size={25} color="black" /> Upload
                  </>
                )}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            marginBottom: 15,
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: 'black',
              fontSize: 14,
              flex: 0.6,
              fontFamily: 'Montserrat-Medium',
            }}>
            PAN Front Side Image {asterisk()}
          </Text>
          <View
            style={{
              flex: 0.6,
              marginLeft: 2,
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
            }}>
            <TouchableOpacity onPress={uploadPanFrontPart}>
              <Text
                style={{
                  color: 'black',
                  fontSize: 14,
                  marginLeft: 5,
                  fontFamily: 'Montserrat-Medium',
                }}>
                {panFrontName ? (
                  panFrontName
                ) : (
                  <>
                    <Feather name="upload" size={25} color="black" /> Upload
                  </>
                )}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 15,
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: 'black',
              fontSize: 14,
              flex: 0.6,
              fontFamily: 'Montserrat-Medium',
            }}>
            PAN Back Side Image {asterisk()}
          </Text>
          <View
            style={{
              flex: 0.6,
              marginLeft: 2,
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
            }}>
            <TouchableOpacity onPress={uploadPanBackPart}>
              <Text
                style={{
                  color: 'black',
                  fontSize: 14,
                  marginLeft: 5,
                  fontFamily: 'Montserrat-Medium',
                }}>
                {panBackName ? (
                  panBackName
                ) : (
                  <>
                    <Feather name="upload" size={25} color="black" /> Upload
                  </>
                )}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* <View
          style={{
            flexDirection: 'row',
            marginBottom: 15,
            alignItems: 'center',
          }}> */}

        {/* <View
            style={{
              flex: 0.6,
              marginLeft: 2,
              // alignItems: 'flex-start',
              // justifyContent: 'center',
            }}>
            <TouchableOpacity onPress={uploadGSTCert}>
              <Text
                style={{
                  color: 'black',
                  fontSize: 14,
                  marginLeft: 5,
                  fontFamily: 'Montserrat-Medium',
                }}>
                {gstFileName ? (
                  gstFileName
                ) : (
                  <>
                    <Feather name="upload" size={25} color="black" /> Upload PAN
                  </>
                )}
              </Text>
            </TouchableOpacity>
          </View>
        </View> */}
        <Text
          style={{
            color: 'black',
            fontSize: 14,
            fontFamily: 'Montserrat-Medium',
            marginBottom: 5,
          }}>
          Aadhaar Number {asterisk()}
        </Text>
        <TextInput
          placeholderTextColor="#757575"
          placeholder="Enter 12-digit Aadhaar number"
          value={aadhaarNumber}
          maxLength={12}
          keyboardType="number-pad"
          onChangeText={val => setAadhaarNumber(sanitizeAadhaar(val))}
          style={{
            borderWidth: 1,
            borderColor: '#d5d5d5',
            color: 'black',
            fontSize: 14,
            borderRadius: 10,
            paddingLeft: 15,
            backgroundColor: 'white',
            marginBottom: 10,
            fontFamily: 'Montserrat-Medium',
          }}
        />
        <Text
          style={{
            color: 'black',
            fontSize: 15,
            fontFamily: 'Montserrat-SemiBold',
            // letterSpacing: 1,
            marginTop: 5,
            marginBottom: 10,
          }}>
          Vehicle {asterisk()}
        </Text>
        <View
          style={{
            marginBottom: 10,
            flexDirection: 'row',
          }}>
          <RadioButton
            value="own"
            status={checked === 'own' ? 'checked' : 'unchecked'}
            onPress={() => setChecked('own')}
          />
          <Text
            style={{
              color: 'black',
              fontSize: 14,
              fontFamily: 'Montserrat-Medium',
              marginTop: 7,
            }}>
            Own Vehicle
          </Text>
          <RadioButton
            value="others"
            status={checked === 'others' ? 'checked' : 'unchecked'}
            onPress={() => setChecked('others')}
          />
          <Text
            style={{
              color: 'black',
              fontSize: 14,
              fontFamily: 'Montserrat-Medium',
              marginTop: 7,
            }}>
            Other's Vehicle
          </Text>
          {/* </View> */}
        </View>
        <View
          style={{
            marginBottom: 10,
          }}>
          <Text
            style={{
              color: 'black',
              fontSize: 14,
              fontFamily: 'Montserrat-Medium',
              // letterSpacing: 1,
              marginBottom: 5,
            }}>
            Vehicle Type/Name
          </Text>
          <TextInput
            placeholderTextColor="#757575"
            placeholder="e.g. Tata Ace EV"
            value={vehicleType}
            // maxLength={10}
            onChangeText={val => setVehicleType(splCharSanitized(val))}
            // keyboardType="number-pad"
            style={{
              borderWidth: 1,
              // width: '100%',
              borderColor: '#d5d5d5',
              color: 'black',
              fontSize: 14,
              borderRadius: 10,
              paddingLeft: 15,
              backgroundColor: 'white',
              // marginBottom: 10,
              fontFamily: 'Montserrat-Medium',
              // letterSpacing: 1,
            }}
          />
        </View>
        <View
          style={{
            marginBottom: 10,
          }}>
          <Text
            style={{
              color: 'black',
              fontSize: 14,
              fontFamily: 'Montserrat-Medium',
              // letterSpacing: 1,
              marginBottom: 5,
            }}>
            RC Card Number
          </Text>
          <TextInput
            placeholderTextColor="#757575"
            placeholder="Enter RC Card Number"
            value={rcCardNumber}
            // maxLength={10}
            onChangeText={val => setRcCardNumber(splCharSanitized(val))}
            // keyboardType="number-pad"
            style={{
              borderWidth: 1,
              // width: '100%',
              borderColor: '#d5d5d5',
              color: 'black',
              fontSize: 14,
              borderRadius: 10,
              paddingLeft: 15,
              backgroundColor: 'white',
              // marginBottom: 10,
              fontFamily: 'Montserrat-Medium',
              // letterSpacing: 1,
            }}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            marginBottom: 10,
            alignItems: 'center',
          }}>
          <View style={{ flex: 0.6 }}>
            <Text
              style={{
                color: 'black',
                fontSize: 14,
                fontFamily: 'Montserrat-Medium',
                // letterSpacing: 1,
                marginBottom: 5,
              }}>
              Vehicle Number Plate
            </Text>
            <TextInput
              placeholderTextColor="#757575"
              placeholder="e.g. KA05MM1234"
              value={numberPlate}
              // maxLength={10}
              onChangeText={val => setNumberPlate(splCharSanitized(val))}
              // keyboardType="number-pad"
              style={{
                borderWidth: 1,
                // width: '100%',
                borderColor: '#d5d5d5',
                color: 'black',
                fontSize: 14,
                borderRadius: 10,
                paddingLeft: 15,
                backgroundColor: 'white',
                // marginBottom: 10,
                fontFamily: 'Montserrat-Medium',
                // letterSpacing: 1,
              }}
            />
          </View>
          <View
            style={{
              flex: 0.6,
              marginLeft: 2,
              marginTop: 10,
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
            }}>
            <TouchableOpacity onPress={uploadVehicleImage}>
              <Text
                style={{
                  color: 'black',
                  fontSize: 14,
                  marginLeft: 5,
                  fontFamily: 'Montserrat-Medium',
                }}>
                {vehicleFileName ? (
                  vehicleFileName
                ) : (
                  <>
                    <Feather name="upload" size={25} color="black" /> Vehicle
                    Image
                  </>
                )}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* <Text
        style={{
          color: THEMECOLOR.helperTextGray,
          fontSize: 16,
          marginBottom: 5,
          textAlign: 'center',
        }}>
        You will get OTP on this number
      </Text> */}
        <TouchableOpacity
          style={{
            backgroundColor: THEMECOLOR.mainColor,
            paddingVertical: 10,
            borderRadius: 10,
            // elevation: 3,
            marginHorizontal: 100,
            marginTop: 20,
          }}
          disabled={isLoading}
          onPress={!isLoading ? handleAddShopDetails : null}>
          {isLoading ? (
            <ActivityIndicator color="white" /> // Show loader
          ) : (
            <Text
              style={{
                color: THEMECOLOR.textColor,
                fontSize: 14,
                textAlign: 'center',
                fontFamily: 'Montserrat-Medium',
              }}>
              Add Address
            </Text>
          )}
        </TouchableOpacity>
        {/* <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 15,
        }}>
        <Checkbox
          status={checked ? 'checked' : 'unchecked'}
          onPress={() => {
            setChecked(!checked);
          }}
        />

        <Text
          style={{
            color: 'black',
            fontSize: 12,
            fontFamily: 'Montserrat-Regular',
            marginLeft: 10,
          }}>
          By sign up, you are agree out terms of condition{' '}
        </Text>
      </View> */}
      </ScrollView>
    </View>
  );
}
