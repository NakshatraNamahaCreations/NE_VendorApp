import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import Feather from 'react-native-vector-icons/Feather';
import * as ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import THEMECOLOR from '../utilities/color';
import {apiUrl} from '../api-services/api-constants';
import axios from 'axios';
import moment from 'moment';

export default function BusinessDetails() {
  const navigation = useNavigation();
  const route = useRoute();

  const serviceRes = route.params?.serverResponse || {};
  const vendorData = route.params?.vendorData || {};
  // console.log('vendorData in business detailed page', vendorData);
  // console.log('serviceRes in business detailed page', serviceRes);

  const [businessName, setBusinessName] = useState('');
  const [pricing, setPricing] = useState('');
  const [logoOrImageUri, setLogoOrImageUri] = useState('');
  const [logoOrImageFileName, setLogoOrImageFileName] = useState('');
  const [businessExperience, setBusinessExperience] = useState('');
  const [yearOfEstablishment, setYearOfEstablishment] = useState('');
  const [website, setWebsite] = useState('');
  const [gstNumber, setGSTNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [currentDay, setCurrentDay] = useState('');
  const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aadhaarFrontUri, setAadhaarFrontUri] = useState('');
  const [aadhaarFrontName, setAadhaarFrontName] = useState('');
  const [aadhaarBackUri, setAadhaarBackUri] = useState('');
  const [aadhaarBackName, setAadhaarBackName] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [panFrontUri, setPanFrontUri] = useState('');
  const [panFrontName, setPanFrontName] = useState('');
  const [panBackUri, setPanBackUri] = useState('');
  const [panBackName, setPanBackName] = useState('');

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
    ImagePicker.launchImageLibrary({noData: true}, async response => {
      if (response.assets) {
        console.log('Gellery image:', response);
        const fileNAME = response.assets[0].fileName;
        const galleryPic = response.assets[0].uri;
        const resizedImageUri = await resizeImage(galleryPic);
        setLogoOrImageUri(resizedImageUri);
        setLogoOrImageFileName(fileNAME);
      }
    });
  };

  const uploadAadhaarFrontPart = () => {
    ImagePicker.launchImageLibrary({noData: true}, async response => {
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
    ImagePicker.launchImageLibrary({noData: true}, async response => {
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
    ImagePicker.launchImageLibrary({noData: true}, async response => {
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
    ImagePicker.launchImageLibrary({noData: true}, async response => {
      if (response.assets) {
        const fileNAME = response.assets[0].fileName;
        const galleryPic = response.assets[0].uri;
        const resizedImageUri = await resizeImage(galleryPic);
        setPanBackUri(resizedImageUri);
        setPanBackName(fileNAME);
      }
    });
  };

  const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  // State to manage the start and end times for each day
  const [businessHours, setBusinessHours] = useState({
    Monday: {start: null, end: null},
    Tuesday: {start: null, end: null},
    Wednesday: {start: null, end: null},
    Thursday: {start: null, end: null},
    Friday: {start: null, end: null},
    Saturday: {start: null, end: null},
    Sunday: {start: null, end: null},
  });

  const showTimePicker = (day, isStart) => {
    setCurrentDay(day);
    if (isStart) {
      setStartTimePickerVisible(true);
    } else {
      setEndTimePickerVisible(true);
    }
  };

  const handleConfirm = (selectedTime, isStart) => {
    setBusinessHours(prevHours => ({
      ...prevHours,
      [currentDay]: {
        ...prevHours[currentDay],
        ...(isStart ? {start: selectedTime} : {end: selectedTime}),
      },
    }));
    if (isStart) {
      setStartTimePickerVisible(false);
    } else {
      setEndTimePickerVisible(false);
    }
  };
  const asterisk = () => <Text style={{color: '#f44336'}}>*</Text>;

  // console.log('businessHours', businessHours);

  const isValidGSTIN = gst => {
    const gstRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gst);
  };

  const removeSpaceAndSpecialCharacters = char => {
    return char.replace(/[^A-Z0-9]/g, '').slice(0, 15);
    //27AAACT2727Q1ZW
  };

  const sanitizePAN = pan => {
    return pan.replace(/[^A-Z0-9]/g, '').slice(0, 10);
  };

  const sanitizeAadhaar = val => val.replace(/\D/g, '').slice(0, 12);
  const isValidAadhaar = num => /^[2-9][0-9]{11}$/.test(num);

  // console.log("gstNumber", gstNumber);

  const handleSubmit = async () => {
    if (!businessName) {
      Alert.alert('Warning', 'Business Name is required');
      return;
    }
    if (!logoOrImageUri) {
      Alert.alert('Warning', 'Business logo is required');
      return;
    }
    if (!aadhaarFrontUri) {
      Alert.alert('Warning', 'Aadhaar front side image is required');
      return;
    }
    if (!aadhaarBackUri) {
      Alert.alert('Warning', 'aadhaar back side image is required');
      return;
    }
    if (!aadhaarNumber) {
      Alert.alert('Warning', 'Aadhaar Number is required');
      return;
    }
    if (!isValidAadhaar(aadhaarNumber)) {
      Alert.alert('Error', 'Please enter a valid 12-digit Aadhaar number');
      return;
    }
    if (!panFrontUri) {
      Alert.alert('Warning', 'PAN front side image is required');
      return;
    }
    if (!panBackUri) {
      Alert.alert('Warning', 'PAN back side image is required');
      return;
    }
    if (!gstNumber) {
      Alert.alert('Warning', 'GST Number is required');
      return;
    }
    if (gstNumber && !isValidGSTIN(gstNumber)) {
      Alert.alert('Error', 'Please enter a valid GSTIN number');
      return;
    }
    setLoading(true);

    try {
      const vendorId = vendorData._id;
      const formData = new FormData();
      formData.append('shop_name', businessName);
      formData.append('shop_image_or_logo', {
        uri: logoOrImageUri,
        type: 'image/jpeg',
        name: logoOrImageFileName || 'image.jpg',
      });
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

      formData.append('experience_in_business', businessExperience);
      // formData.append('pricing', pricing);
      formData.append('year_of_establishment', yearOfEstablishment);
      formData.append('website_url', website);
      formData.append('gst_number', gstNumber);
      formData.append('aadhaar_number', aadhaarNumber);
      // formData.append('business_hours', JSON.stringify(businessHoursArray));
      const config = {
        url: `${apiUrl.BASEURL}${apiUrl.ADD_SERVICE_USER_BUSINESS_DETAILS}${vendorId}`,
        method: 'put',
        headers: {'Content-Type': 'multipart/form-data'},
        data: formData,
      };
      const response = await axios(config);
      if (response.status === 200) {
        Alert.alert('Success', 'Business details updated successfully!');
        // console.log('response', response.data.data);
        // const vendorData = response.data.data;
        // console.log('vendorData in service poeple requrement', vendorData);

        navigation.navigate('AddShopAddress', {
          vendorData: vendorData,
        });
      }
    } catch (error) {
      console.log('Error Config:', error.config?.url);
      console.log('Error Message:', error.message);
      console.log('Error Response:', error);
      Alert.alert('Error', 'Failed to update vendor details');
    } finally {
      setLoading(false);
    }
  };

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
          }}>
          Business/Service Name {asterisk()}
        </Text>
        <TextInput
          placeholderTextColor="#757575"
          placeholder="Enter business name"
          value={businessName}
          onChangeText={val => setBusinessName(val)}
          style={{
            borderWidth: 1,
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
        <View
          style={{
            flexDirection: 'row',
            marginVertical: 15,
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

        <Text
          style={{
            color: 'black',
            fontSize: 14,
            marginBottom: 5,
            fontFamily: 'Montserrat-Medium',
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
            fontSize: 14,
            marginBottom: 5,
            fontFamily: 'Montserrat-Medium',
          }}>
          Experience in Business
        </Text>
        <TextInput
          placeholderTextColor="#757575"
          placeholder="Enter experiences in the field"
          keyboardType="numeric"
          value={businessExperience}
          onChangeText={val => {
            const sanitized = val.replace(/[^0-9]/g, '');
            setBusinessExperience(sanitized);
          }}
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
            fontSize: 14,
            marginBottom: 5,
            fontFamily: 'Montserrat-Medium',
            // letterSpacing: 1,
          }}>
          Year of Establishment
        </Text>
        <TextInput
          placeholderTextColor="#757575"
          placeholder="Enter year of establishment"
          keyboardType="numeric"
          value={yearOfEstablishment}
          onChangeText={val => {
            const sanitized = val.replace(/[^0-9]/g, '');
            setYearOfEstablishment(sanitized);
          }}
          // onChangeText={val => setYearOfEstablishment(val)}
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
        <Text
          style={{
            color: 'black',
            fontSize: 14,
            marginBottom: 5,
            fontFamily: 'Montserrat-Medium',
            // letterSpacing: 1,
          }}>
          Website
        </Text>
        <TextInput
          placeholderTextColor="#757575"
          placeholder="Website URL (optional)"
          value={website}
          onChangeText={val => setWebsite(val)}
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
        <Text
          style={{
            color: 'black',
            fontSize: 14,
            marginBottom: 5,
            fontFamily: 'Montserrat-Medium',
            // letterSpacing: 1,
          }}>
          PAN Number {asterisk()}
        </Text>
        <TextInput
          placeholderTextColor="#757575"
          placeholder="PAN Number"
          value={panNumber}
          autoCapitalize="characters"
          maxLength={10}
          onChangeText={val => setPanNumber(sanitizePAN(val))}
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
        <Text
          style={{
            color: 'black',
            fontSize: 14,
            marginBottom: 5,
            fontFamily: 'Montserrat-Medium',
          }}>
          GSTIN {asterisk()}
        </Text>
        <TextInput
          placeholderTextColor="#757575"
          placeholder="GST Number"
          value={gstNumber}
          autoCapitalize="characters"
          maxLength={15}
          onChangeText={val => {
            const gstINVal = removeSpaceAndSpecialCharacters(val.toUpperCase());
            setGSTNumber(gstINVal);
          }}
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
        {/* <Text
          style={{
            color: 'black',
            fontSize: 14,
            marginBottom: 5,
            fontFamily: 'Montserrat-Medium',
            marginBottom: 10,
          }}>
          Business Hours
        </Text> */}
        {/* <View>
          {daysOfWeek.map(day => (
            <View key={day} style={styles.dayContainer}>
              <Text style={styles.dayText}>{day}</Text>
              <View style={styles.timeContainer}>
                <Button
                  title={
                    businessHours[day].start
                      ? businessHours[day].start.toLocaleTimeString()
                      : 'Set Start Time'
                  }
                  onPress={() => showTimePicker(day, true)}
                />
                <Button
                  title={
                    businessHours[day].end
                      ? businessHours[day].end.toLocaleTimeString()
                      : 'Set End Time'
                  }
                  onPress={() => showTimePicker(day, false)}
                />
              </View>
            </View>
          ))} 
          <DatePicker
            modal
            open={isStartTimePickerVisible}
            date={businessHours[currentDay]?.start || new Date()}
            mode="time"
            onConfirm={date => handleConfirm(date, true)}
            onCancel={() => setStartTimePickerVisible(false)}
          />

          <DatePicker
            modal
            open={isEndTimePickerVisible}
            date={businessHours[currentDay]?.end || new Date()}
            mode="time"
            onConfirm={date => handleConfirm(date, false)}
            onCancel={() => setEndTimePickerVisible(false)}
          />
        </View> */}
        <View>
          <TouchableOpacity
            style={{
              backgroundColor: THEMECOLOR.mainColor,
              paddingVertical: 10,
              borderRadius: 10,
              // elevation: 3,
              marginHorizontal: 100,
              marginTop: 20,
            }}
            disabled={loading}
            onPress={!loading ? handleSubmit : null}>
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text
                style={{
                  color: THEMECOLOR.textColor,
                  fontSize: 14,
                  textAlign: 'center',
                  fontFamily: 'Montserrat-Medium',
                }}>
                Next
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
