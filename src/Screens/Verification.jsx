import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import OTPTextInput from 'react-native-otp-textinput';
import THEMECOLOR from '../utilities/color';
import {useNavigation, useRoute} from '@react-navigation/native';
import {apiUrl} from '../api-services/api-constants';
import axios from 'axios';

export default function Verification() {
  const navigation = useNavigation();
  const route = useRoute();
  const mailId = route.params.emailAddress;
  console.log('mailId', mailId);
  const [loading, setLoading] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
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
        url: apiUrl.RESENT_OTP_TO_MAIL,
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
        // console.log('Resend Responce:', response.data.message);
        ToastAndroid.showWithGravity(
          'OTP Resent',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        setTimer(60);
      }
    } catch (error) {
      // console.log('catch error:', error);
      ToastAndroid.showWithGravity(
        error.response?.data?.message || 'Failed to send otp',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async () => {
    console.log('verifyOTP triggered');
    if (!otpValue) {
      ToastAndroid.showWithGravity(
        'Please enter OTP',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      setLoading(false);
      return;
    }
    setLoading(true);
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
      console.log('Inside try block');
      const response = await axios(config);
      console.log('Axios response:', response);

      if (response.status === 200) {
        ToastAndroid.showWithGravity(
          response.data.message || 'OTP Verified',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        setLoading(false);
        navigation.navigate('ResetPassword', {mailId});
        return;
      } else {
        console.log('Unexpected status code:', response.status);
      }
    } catch (error) {
      console.log('Catch error:', JSON.stringify(error, null, 2));
      console.log('Inside catch block');
      const errorMessage =
        error.response?.data?.message ||
        'Failed to verify OTP. Please try again.';

      ToastAndroid.showWithGravity(
        errorMessage,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    } finally {
      console.log('Inside finally block');
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="small" color={THEMECOLOR.mainColor} />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        padding: 15,
      }}>
      <View>
        <Image
          source={require('../../assets/otp-sxcreen.jpg')}
          style={{
            width: 250,
            height: 250,
            alignSelf: 'center',
          }}
        />
      </View>
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
          fontSize: 14,
          fontFamily: 'Montserrat-Medium',
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
        disabled={loading}
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
