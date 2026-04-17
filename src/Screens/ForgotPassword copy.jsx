import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {apiUrl} from '../api-services/api-constants';
import THEMECOLOR from '../utilities/color';
import useBackHandler from '../utilities/useBackHandler';

export default function ForgotPassword() {
  useBackHandler();
  const navigation = useNavigation();
  const [emailAddress, setEmailAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMail = async () => {
    setLoading(true);

    if (!emailAddress) {
      ToastAndroid.showWithGravity(
        'Please enter your email address',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      // alert('Please enter your email address');
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
          body: JSON.stringify({email: emailAddress}),
        },
      );

      const data = await response.json(); // Parse response

      if (response.status === 200) {
        setEmailAddress('');
        ToastAndroid.showWithGravity(
          data.message || 'Email sent successfully',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        // alert(data.message || 'Email sent successfully');
        setLoading(false);
        navigation.navigate('Verification', {emailAddress});
      } else {
        ToastAndroid.showWithGravity(
          data.message || 'Error sending email',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        // alert(data.message || 'Error sending email');
      }
    } catch (error) {
      ToastAndroid.showWithGravity(
        'Something went wrong. Please try again',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      // alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{flex: 1, height: 100, padding: 15}}>
      <View style={{marginTop: 10}}>
        <Text
          style={{
            color: 'black',
            fontSize: 20,
            fontFamily: 'Montserrat-Bold',
            // textAlign: 'center',
          }}>
          Forgot Password
        </Text>
        <Text
          style={{
            color: '#78716C',
            fontSize: 13,
            fontFamily: 'Montserrat-Medium',
            paddingVertical: 10,
            // textAlign: 'center',
          }}>
          Please enter your email ID to receive an OTP for resetting your
          password
        </Text>
      </View>
      <View>
        <Text
          style={{
            color: 'black',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 13,
            marginBottom: 10,
            marginTop: 10,
          }}>
          Enter Email Address
        </Text>
        <TextInput
          placeholderTextColor="#A3A3A3"
          placeholder="example@gmail.com"
          value={emailAddress}
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
      </View>
    </View>
  );
}
