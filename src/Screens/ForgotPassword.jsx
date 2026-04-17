import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
  ScrollView,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import THEMECOLOR from '../utilities/color';
import {apiUrl} from '../api-services/api-constants';

export default function ForgotPassword() {
  const navigation = useNavigation();
  const [emailAddress, setEmailAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMail = async () => {
    setLoading(true);
    if (!emailAddress) {
      ToastAndroid.showWithGravity(
        'Please enter your email id',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(
        `${apiUrl.BASEURL}${apiUrl.FORGOT_PASSWORD}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: emailAddress,
          }),
        },
      );
      const data = await response.json();
      if (response.status === 200) {
        ToastAndroid.showWithGravity(
          data.message || 'OTP sent successfully',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        navigation.navigate('Verification', {emailAddress});
      } else {
        ToastAndroid.showWithGravity(
          data.message || 'Error sending OTP to email',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }
    } catch (error) {
      ToastAndroid.showWithGravity(
        error.message || 'Something went wrong. Please try again',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        // alignItems: 'center',
        padding: 15,
        backgroundColor: 'white',
      }}>
      {/* <ScrollView> */}
      <View>
        <Image
          source={require('../../assets/mail-entry.jpg')}
          style={{
            width: 200,
            height: 200,
            alignSelf: 'center',
          }}
        />
      </View>
      <Text
        style={{
          color: 'black',
          fontSize: 20,
          fontFamily: 'Montserrat-Bold',
          textAlign: 'center',
        }}>
        Forgot Password
      </Text>
      <Text
        style={{
          color: '#78716C',
          fontSize: 13,
          fontFamily: 'Montserrat-Medium',
          paddingVertical: 10,
          textAlign: 'center',
        }}>
        Please enter your email ID to receive an OTP for resetting your password
      </Text>

      <Text
        style={{
          color: 'black',
          fontFamily: 'Montserrat-SemiBold',
          fontSize: 13,
          marginBottom: 10,
          marginTop: 10,
          textAlign: 'center',
        }}>
        Enter Email Address
      </Text>
      <TextInput
        placeholderTextColor="#A3A3A3"
        placeholder="example@gmail.com"
        value={emailAddress?.toLocaleLowerCase()}
        onChangeText={main => setEmailAddress(main)}
        keyboardType="email-address"
        style={{
          borderWidth: 1,
          borderColor: '#D4D4D4',
          color: 'black',
          fontSize: 13,
          borderRadius: 10,
          fontFamily: 'Montserrat-Medium',
          paddingLeft: 18,
          backgroundColor: 'white',
        }}
      />

      <TouchableOpacity
        style={{
          marginBottom: 10,
          marginTop: 15,
          backgroundColor: loading ? '#bbbbbb' : THEMECOLOR.mainColor,
          paddingVertical: 15,
          borderRadius: 10,
        }}
        onPress={loading ? null : sendMail}>
        {loading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text
            style={{
              color: 'white',
              fontFamily: 'Montserrat-SemiBold',
              fontSize: 13,
              textAlign: 'center',
            }}>
            Send
          </Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={{marginBottom: 10, marginTop: 10}}
        onPress={() => navigation.navigate('Login')}>
        <Text
          style={{
            color: '#959595',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 13,
            textAlign: 'center',
          }}>
          Back to
          <Text
            style={{
              color: THEMECOLOR.mainColor,
              fontFamily: 'Montserrat-SemiBold',
              fontSize: 13,
              textAlign: 'center',
            }}>
            {' '}
            Login
          </Text>
        </Text>
      </TouchableOpacity>
      {/* </ScrollView> */}
    </View>
  );
}
