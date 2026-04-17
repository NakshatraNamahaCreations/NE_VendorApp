import {
  View,
  Text,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import OTPTextInput from 'react-native-otp-textinput';
import THEMECOLOR from '../utilities/color';
import {useNavigation, useRoute} from '@react-navigation/native';
import axios from 'axios';
import {apiUrl} from '../api-services/api-constants';
import useBackHandler from '../utilities/useBackHandler';

export default function Verification() {
  let otpInput = useRef(null);
  useBackHandler();
  const route = useRoute();
  const mailId = route.params.emailAddress;
  const navigation = useNavigation();
  console.log('mailId', mailId);
  const [loading, setLoading] = React.useState('');
  const [isLoading, setIsLoading] = React.useState('');
  const [timer, setTimer] = useState(60);
  const [otpValue, setOtpValue] = useState('');

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const reSendOtp = async () => {
    setIsLoading(true);
    try {
      const config = {
        url: apiUrl.RESENT_EMAIL_OTP,
        method: 'post',
        baseURL: apiUrl.BASEURL,
        headers: {'Content-Type': 'application/json'},
        data: {
          email: mailId,
        },
      };
      const response = await axios(config);
      if (response.status === 200) {
        setIsLoading(false);
        console.log('Resend Responce:', response.data.message);
        ToastAndroid.showWithGravity(
          'OTP Resent',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        setTimer(60);
      }
    } catch (error) {
      console.log('catch error:', error);
      ToastAndroid.showWithGravity(
        error.response?.data?.message || 'Failed to send otp',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="small" color={THEMECOLOR.mainColor} />
      </View>
    );
  }

  const verifyOTP = async () => {
    setLoading(true);
    if (!otpValue) {
      ToastAndroid.showWithGravity(
        'Please enter OTP',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      setLoading(false);
      return;
    }
    try {
      const config = {
        url: apiUrl.VERIFY_EMAIL_OTP,
        method: 'post',
        baseURL: apiUrl.BASEURL,
        headers: {'Content-Type': 'application/json'},
        data: {
          email: mailId,
          otp: otpValue,
        },
      };
      const response = await axios(config);
      if (response.status === 200) {
        console.log('Verify Response:', response.data.message);
        setLoading(false);
        ToastAndroid.showWithGravity(
          response.data.message || 'OTP Verified',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        navigation.navigate('ResetPassword', {
          mailId,
        });
      }
    } catch (error) {
      setLoading(false);
      console.log('catch error:', JSON.stringify(error, null, 2));
      ToastAndroid.showWithGravity(
        error.response?.data?.message || 'Failed to verify otp',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
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
            textAlign: 'center',
          }}>
          Verification
        </Text>
      </View>
      <Text
        style={{
          color: 'black',
          fontSize: 13,
          fontFamily: 'Montserrat-Medium',
          textAlign: 'center',
          marginBottom: 10,
        }}>
        Enter Verification Code
      </Text>
      <OTPTextInput
        ref={e => (otpInput = e)}
        textInputStyle={{
          borderWidth: 1,
          borderBottomWidth: 1,
          borderRadius: 5,
          marginTop: 10,
        }}
        handleTextChange={te => setOtpValue(te)}
        inputCount={6}
        tintColor={THEMECOLOR.mainColor}
      />
      <Text
        style={{
          color: '#7d8592',
          fontSize: 12,
          textAlign: 'center',
          fontFamily: 'Montserrat-Medium',
          marginTop: 15,
        }}>
        Resend OTP in {timer} sec
        {/* OTP will expiry in {timer} sec */}
      </Text>
      {timer === 0 && (
        <TouchableOpacity onPress={reSendOtp}>
          <Text
            style={{
              color: THEMECOLOR.mainColor,
              fontSize: 12,
              textAlign: 'center',
              fontFamily: 'Montserrat-SemiBold',
              marginVertical: '3%',
              textDecorationLine: 'underline',
            }}>
            Resend OTP
          </Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={{
          backgroundColor: THEMECOLOR.mainColor,
          paddingVertical: 10,
          paddingHorizontal: 15,
          borderRadius: 10,
          // elevation: 3,
          marginTop: 30,
        }}
        onPress={loading ? null : verifyOTP}>
        <Text
          style={{
            color: 'white',
            fontSize: 13,
            textAlign: 'center',
            fontFamily: 'Montserrat-SemiBold',
          }}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{marginTop: 20}}
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
  );
}
