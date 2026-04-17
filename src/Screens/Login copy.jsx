import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import THEMECOLOR from '../utilities/color';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {bookingHistory} from '../data/global-data';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {apiUrl} from '../api-services/api-constants';

export default function Login({navigation}) {
  const [mobileNumber, setMobileNumber] = useState('');
  const [requestData, setRequestData] = useState({
    emailId: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleEmailChange = val => {
    setRequestData({
      ...requestData,
      emailId: val,
    });
  };

  const handlePasswordChange = val => {
    setRequestData({
      ...requestData,
      password: val,
    });
  };

  // login with mobile number only
  const handleLogin = async () => {
    if (!mobileNumber) {
      Alert.alert('Error', 'Please enter mobile number');
      return;
    }
    setLoading(true);
    try {
      const config = {
        url: apiUrl.LOGIN_WITH_MOBILE,
        method: 'post',
        baseURL: apiUrl.BASEURL,
        headers: {'Content-Type': 'application/json'},
        data: {
          mobile_number: mobileNumber,
        },
      };
      const response = await axios(config);

      if (response.status === 200) {
        Alert.alert('Success', response.data.message);
        console.log('AsyncStorage', response.data.vendor);
        // AsyncStorage.setItem('token', response.data.vendor);
        await AsyncStorage.setItem(
          'vendor',
          JSON.stringify(response.data.vendor),
        );
        navigation.navigate('BottomTab');
        // navigation.navigate('AddShopDetails');
      }
    } catch (error) {
      console.log('Unknown error:', error);
      if (error.response && error.response.data) {
        Alert.alert('Error', error.response.data.message);
      } else {
        Alert.alert('Error', 'An unknown error occurred');
      }
    } finally {
      setLoading(false); // Re-enable the button after the API call completes
    }
  };

  // const handleLogin = async () => {
  //   if (!requestData.emailId || !requestData.password) {
  //     Alert.alert('Error', 'Email and Password required');
  //     return;
  //   }
  //   setLoading(true);
  //   try {
  //     const config = {
  //       url: apiUrl.VENDOR_LOGIN,
  //       method: 'post',
  //       baseURL: apiUrl.BASEURL,
  //       headers: {'Content-Type': 'application/json'},
  //       data: {
  //         email: requestData.emailId,
  //         password: requestData.password,
  //       },
  //     };
  //     const response = await axios(config);

  //     if (response.status === 200) {
  //       Alert.alert('Success', response.data.message);
  //       console.log('AsyncStorage', response.data.vendor);
  //       await AsyncStorage.setItem(
  //         'vendor',
  //         JSON.stringify(response.data.vendor),
  //       );
  //       navigation.navigate('BottomTab');
  //     }
  //   } catch (error) {
  //     console.log('Unknown error:', error);
  //     if (error.response && error.response.data) {
  //       console.log('error.response.data.message', error.response.data.error);

  //       Alert.alert('Error', error.response.data.error);
  //     } else {
  //       Alert.alert('Error', 'An unknown error occurred');
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <View
      style={{
        padding: 15,
        backgroundColor: 'white',
        height: '100%',
        paddingTop: '10%',
      }}>
      <ScrollView>
        <Image
          source={require('../../assets/Secure-login-bro.png')}
          style={{
            width: 110,
            height: 100,
            alignSelf: 'center',
          }}
        />
        <Text
          style={{
            fontSize: 20,
            color: 'black',
            marginBottom: 10,
            textAlign: 'center',
            marginTop: 10,
            fontFamily: 'Montserrat-SemiBold',
          }}>
          Welcome Back to Nithya Event!
        </Text>
        <Text
          style={{
            fontSize: 13,
            color: '#414242',
            textAlign: 'center',
            marginBottom: 20,
            fontFamily: 'Montserrat-Medium',
            // letterSpacing: 1,
            //   fontWeight: '400',
          }}>
          Log in to manage your inventory, track bookings, and grow your
          business with ease.
        </Text>
        {/* login with mobile number */}
        <Text
          style={{
            color: 'black',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 14,
            marginBottom: 5,
          }}>
          Phone number
        </Text>
        <TextInput
          placeholderTextColor="#A3A3A3"
          placeholder="Enter phone number"
          value={mobileNumber}
          maxLength={10}
          keyboardType="numeric"
          onChangeText={val => setMobileNumber(val)}
          style={{
            borderWidth: 1,
            borderColor: '#D4D4D4',
            color: 'black',
            fontSize: 14,
            borderRadius: 10,
            fontFamily: 'Montserrat-Medium',
            paddingLeft: 15,
            backgroundColor: 'white',
            marginBottom: 20,
          }}
        />
        {/* <Text
          style={{
            color: 'black',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 14,
            marginBottom: 5,
          }}>
          Email Id
        </Text>
        <TextInput
          placeholderTextColor="#A3A3A3"
          placeholder="Enter email id"
          value={requestData.emailId}
          onChangeText={handleEmailChange}
          keyboardType="email-address"
          autoCapitalize="none"
          style={{
            borderWidth: 1,
            borderColor: '#D4D4D4',
            color: 'black',
            fontSize: 14,
            borderRadius: 10,
            fontFamily: 'Montserrat-Medium',
            paddingLeft: 15,
            backgroundColor: 'white',
          }}
        />
        <Text
          style={{
            color: 'black',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 14,
            marginBottom: 5,
            marginTop: 10,
          }}>
          Password
        </Text>
        <TextInput
          placeholderTextColor="#A3A3A3"
          placeholder="Enter password"
          value={requestData.password}
          onChangeText={handlePasswordChange}
          style={{
            borderWidth: 1,
            borderColor: '#D4D4D4',
            color: 'black',
            fontSize: 14,
            borderRadius: 10,
            fontFamily: 'Montserrat-Medium',
            paddingLeft: 15,
            backgroundColor: 'white',
          }}
        />
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text
            style={{
              color: '#0027ff',
              fontSize: 12,
              textAlign: 'right',
              fontFamily: 'Montserrat-SemiBold',
              marginVertical: 15,
            }}>
            Forgot Password?
          </Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={{
            backgroundColor: THEMECOLOR.mainColor,
            paddingVertical: 10,
            borderRadius: 10,
            elevation: 3,
            // marginHorizontal: 50,
          }}
          onPress={loading ? null : handleLogin}>
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text
              style={{
                color: THEMECOLOR.textColor,
                fontSize: 15,
                textAlign: 'center',
                fontFamily: 'Montserrat-Medium',
              }}>
              Login
            </Text>
          )}
        </TouchableOpacity>
        <View
          style={{
            alignItems: 'center',
            marginTop: 15,
          }}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
            }}>
            {/* <View style={{flexDirection: 'row', justifyContent: 'center'}}> */}
            <Text
              style={{
                color: 'black',
                fontSize: 13,
                fontFamily: 'Montserrat-Medium',

                // letterSpacing: 1,
              }}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Register');
              }}>
              <Text
                style={{
                  color: THEMECOLOR.mainColor,
                  fontSize: 13,
                  // letterSpacing: 1,
                  fontFamily: 'Montserrat-SemiBold',
                }}>
                Signup
              </Text>
            </TouchableOpacity>
            {/* </View> */}
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 20,
            alignItems: 'center',
          }}>
          <View
            style={{
              flex: 0.3,
              borderTopColor: '#58e4a738',
              borderTopWidth: 1,
              marginTop: 3,
            }}></View>
          <View
            style={{
              flex: 0.4,
            }}>
            <Text
              style={{
                fontSize: 12,
                color: '#414242',
                fontFamily: 'Montserrat-Medium',
                textAlign: 'center',
              }}>
              Or Signup With
            </Text>
          </View>
          <View
            style={{
              flex: 0.3,
              borderTopColor: '#58e4a738',
              borderTopWidth: 1,
              marginTop: 3,
            }}></View>
        </View>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 20,
            // alignItems: 'center',
          }}>
          <Image
            source={require('../../assets/search.png')}
            style={{width: 60, height: 60, borderRadius: 50}}
          />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
