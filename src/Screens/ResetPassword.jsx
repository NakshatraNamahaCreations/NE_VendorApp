import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ToastAndroid,
  BackHandler,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import THEMECOLOR from '../utilities/color';
import {apiUrl} from '../api-services/api-constants';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ResetPassword = () => {
  const [showEye, setShowEye] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  // const emailAddress = 'ops.nnc@gmail.com';
  const emailAddress = route.params.mailId;
  console.log('emailAddress', emailAddress);
  const [password, setPassword] = useState('');
  const [cPassword, setCPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const resetPassword = async () => {
    setLoading(true);

    if (!password || !cPassword) {
      ToastAndroid.showWithGravity(
        'Password and Confirm Password are required',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      // alert('Password and Confirm Password are required');
      setLoading(false);
      return;
    }

    if (password !== cPassword) {
      ToastAndroid.showWithGravity(
        'Password and Confirm Password do not match',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      // alert('Password and Confirm Password do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${apiUrl.BASEURL}${apiUrl.RESET_PASSWORD}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: emailAddress,
            newPassword: password,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setLoading(false);
        // alert(data.message);
        navigation.navigate('ResetSuccess');
        setPassword('');
        setCPassword('');
      } else {
        ToastAndroid.showWithGravity(
          data.message || 'Error resetting password',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        // alert(data.message || 'Error resetting password');
      }
    } catch (error) {
      console.error('Error:', error);
      // alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        return true;
      },
    );
    return () => backHandler.remove();
  }, []);

  // const resetPassword = async () => {
  //   navigation.navigate('ResetSuccess');
  // };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
        padding: 15,
      }}>
      <View>
        <Image
          source={require('../../assets/reset-password.jpg')}
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
          New Password
        </Text>
      </View>

      <View style={{marginTop: 10}}>
        <Text
          style={{
            color: 'black',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 13,
            marginBottom: 10,
            marginTop: 10,
          }}>
          Enter New Password
        </Text>
        <TextInput
          placeholderTextColor="#A3A3A3"
          value={password}
          onChangeText={main => setPassword(main)}
          placeholder="**********"
          keyboardType="password"
          secureTextEntry={!showEye}
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
          style={{position: 'absolute', right: 15, top: 50}}
          onPress={() => setShowEye(prev => !prev)}>
          <Ionicons
            name={showEye ? 'eye-outline' : 'eye-off-outline'}
            color="black"
            size={25}
          />
        </TouchableOpacity>
        <Text
          style={{
            color: 'black',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 13,
            marginBottom: 10,
            marginTop: 10,
          }}>
          Confirm Password
        </Text>
        <TextInput
          placeholderTextColor="#A3A3A3"
          value={cPassword}
          onChangeText={main => setCPassword(main)}
          placeholder="**********"
          keyboardType="new-password"
          secureTextEntry={!showEye}
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
          style={{position: 'absolute', right: 15, bottom: 12}}
          onPress={() => setShowEye(prev => !prev)}>
          <Ionicons
            name={showEye ? 'eye-outline' : 'eye-off-outline'}
            color="black"
            size={25}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={{
          backgroundColor: THEMECOLOR.mainColor,
          paddingVertical: 10,
          paddingHorizontal: 15,
          borderRadius: 10,
          elevation: 3,
          marginTop: 10,
          marginTop: 30,
        }}
        onPress={loading ? null : resetPassword}>
        <Text
          style={{
            color: 'white',
            fontSize: 13,
            textAlign: 'center',
            fontFamily: 'Montserrat-SemiBold',
          }}>
          {loading ? 'Resetting...' : 'Reset Password'}
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
};

export default ResetPassword;
