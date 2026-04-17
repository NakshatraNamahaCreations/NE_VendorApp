import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import THEMECOLOR from '../utilities/color';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {apiUrl} from '../api-services/api-constants';

const CLIENT_ID =
  '292241772242-41685e61vcmo0au8cmeg6g6j3vtlsdma.apps.googleusercontent.com';

export default function Login({navigation}) {
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [loginType, setLoginType] = useState(0);
  const [password, setPassword] = useState('');
  const [showEye, setShowEye] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: CLIENT_ID,
      offlineAccess: true,
    });
  }, []);

  // NOTE:  need to ensure that the GoogleSignin.configure() method is called before any sign-in attempts
  const GoogleLogin = async () => {
    console.log('function called');
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      console.log('Play services available');

      await GoogleSignin.signOut();
      console.log('Signed out');

      const userInfo = await GoogleSignin.signIn();
      console.log('userInfo GoogleLogin:', userInfo);
      return userInfo;
    } catch (error) {
      console.log('GoogleLogin ERROR >>>>', error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('Google Sign-In was cancelled by the user.');
      } else {
        console.error('Google Sign-In Error:', error.code, error.message);
      }
      throw error;
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const oAuthUser = await GoogleLogin();

      if (!oAuthUser) {
        console.log('No user selected; exiting login process.');
        return;
      }
      console.log(
        'Google Sign-In Response:',
        JSON.stringify(oAuthUser, null, 2),
      );
      setIsLoading(true);

      const idToken = oAuthUser?.data?.idToken;
      const email = oAuthUser.data?.user?.email;

      if (!idToken || !email) {
        console.log('Missing idToken or email');
        throw new Error('Google Sign-In did not return a valid user.');
      }

      const res = await fetch(`${apiUrl.BASEURL}${apiUrl.LOGIN_WITH_GOOGLE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({token: idToken, email: email}),
      });

      const data = await res.json();
      console.log('Server Response:', data);

      ToastAndroid.showWithGravity(
        data.message || 'Login Success!',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );

      if (data?.error) {
        Alert.alert('Login Failed', 'User does not exist. Please try again.', [
          {text: 'OK', onPress: () => handleGoogleLogin()},
          {text: 'Cancel', style: 'cancel'},
        ]);
      } else if (data?.user) {
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        setUserDataFromContext(data.user);
        navigation.navigate('Enable Location');
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('Sign-In cancelled by user, no further action taken.');
      } else {
        console.log('Login API Error:', error);
        // enable if need
        // Alert.alert('Error', error?.message || 'Something went wrong', [
        //   {text: 'Try Again', onPress: () => handleGoogleLogin()},
        //   {text: 'Cancel', style: 'cancel'},
        // ]);
        console.log('Error', error?.message);
        //    ToastAndroid.showWithGravity(
        //   data.message || 'Login Success!',
        //   ToastAndroid.SHORT,
        //   ToastAndroid.CENTER,
        // );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginWithMobileNumber = async () => {
    if (!mobileNumber) {
      ToastAndroid.showWithGravity(
        'Mobile Number required',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
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
      if (response) {
        console.log(response);
        // ToastAndroid.showWithGravity(
        //   response.data.message || 'OTP sent to entered mobile number',
        //   ToastAndroid.SHORT,
        //   ToastAndroid.CENTER,
        // );
        ToastAndroid.showWithGravity(
          response.data.message || 'Login Success',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        await AsyncStorage.setItem(
          'vendor',
          JSON.stringify(response.data.vendor),
        );
        navigation.navigate('BottomTab');
        setLoading(false);
        setMobileNumber('');
        console.log('login response:', response.data);
        // navigation.navigate('Otp', {
        //   userRes: response.data.user, //uncommand once sms resolved
        // });
      }
    } catch (error) {
      setLoading(false);
      console.log('Catch error:', JSON.stringify(error, null, 2));
      Alert.alert('Error', error.response?.data?.message || 'Login failed');
    }
  };

  const handleWithEmail = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email and Password required');
      return;
    }
    setLoading(true);
    try {
      const config = {
        url: apiUrl.LOGIN_WITH_GMAIL,
        method: 'post',
        baseURL: apiUrl.BASEURL,
        headers: {'Content-Type': 'application/json'},
        data: {
          email: email,
          password: password,
        },
      };
      const response = await axios(config);
      if (response.status === 200) {
        console.log(response);
        ToastAndroid.showWithGravity(
          response.data.message || 'Login Success!',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        await AsyncStorage.setItem(
          'vendor',
          JSON.stringify(response.data.vendor),
        );
        setLoading(false);
        setEmail('');
        setPassword('');
        navigation.navigate('BottomTab');
        console.log('login response:', response.data);
        // navigation.navigate('Enable Location');
      }
    } catch (error) {
      setLoading(false);
      console.log('catch error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Login failed');
    }
  };

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
        // Alert.alert('Success', response.data.message);
        console.log('AsyncStorage', response.data.vendor);
        await AsyncStorage.setItem(
          'vendor',
          JSON.stringify(response.data.vendor),
        );
        navigation.navigate('BottomTab');
      }
    } catch (error) {
      console.log('Unknown error:', error);
      if (error.response && error.response.data) {
        Alert.alert('Error', error.response.data.message);
      } else {
        Alert.alert('Error', 'An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
          position: 'absolute',
          width: '100%',
          height: '100%',
          zIndex: 10,
        }}>
        <ActivityIndicator size="small" color={THEMECOLOR.mainColor} />
      </View>
    );
  }

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
            width: 170,
            height: 170,
            alignSelf: 'center',
          }}
        />
        <Text
          style={{
            fontSize: 20,
            color: 'black',
            textAlign: 'center',
            marginTop: 10,
            fontFamily: 'Montserrat-SemiBold',
          }}>
          Welcome to
        </Text>
        <Text
          style={{
            fontSize: 20,
            color: 'black',
            marginBottom: 10,
            textAlign: 'center',
            fontFamily: 'Montserrat-SemiBold',
          }}>
          Nithya Event Vendor!
        </Text>
        <Text
          style={{
            fontSize: 13,
            color: '#414242',
            textAlign: 'center',
            fontFamily: 'Montserrat-Medium',
            // letterSpacing: 1,
            //   fontWeight: '400',
          }}>
          Log in to manage your inventory, track bookings, and grow your
          business with ease.
        </Text>
        <View style={{marginTop: 10}}>
          {loginType === 0 ? (
            <View>
              <Text
                style={{
                  color: '#1E1E1E',
                  fontSize: 14,
                  textAlign: 'left',
                  fontFamily: 'Montserrat-SemiBold',
                  marginTop: 10,
                }}>
                Email
              </Text>
              <TextInput
                style={styles.input}
                placeholder="example@gmail.com"
                placeholderTextColor="#7d8592"
                value={email?.toLocaleLowerCase()}
                onChangeText={setEmail}
                keyboardType="email-address"
              />

              <Text
                style={{
                  color: '#1E1E1E',
                  fontSize: 14,
                  textAlign: 'left',
                  fontFamily: 'Montserrat-SemiBold',
                  marginTop: 10,
                }}>
                Password
              </Text>
              <View>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#7d8592"
                  secureTextEntry={!showEye}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  style={{position: 'absolute', right: 15, top: 22}}
                  onPress={() => setShowEye(prev => !prev)}>
                  <Ionicons
                    name={showEye ? 'eye-outline' : 'eye-off-outline'}
                    color="black"
                    size={25}
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}>
                <Text
                  style={{
                    color: '#156651',
                    fontSize: 14,
                    textAlign: 'left',
                    fontFamily: 'Montserrat-SemiBold',
                    marginVertical: 20,
                  }}>
                  Forgot your password?
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.otpBtn}
                onPress={loading ? null : handleWithEmail}
                disabled={loading}>
                <Text
                  style={{
                    color: THEMECOLOR.mainTextColor,
                    fontSize: 14,
                    fontFamily: 'Montserrat-Bold',
                  }}>
                  {loading ? 'Logging in...' : 'Login'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <Text
                style={{
                  color: '#1E1E1E',
                  fontSize: 14,
                  textAlign: 'left',
                  fontFamily: 'Montserrat-SemiBold',
                  marginTop: 10,
                }}>
                Mobile Number
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Mobile Number"
                placeholderTextColor="#7d8592"
                value={mobileNumber}
                onChangeText={val => {
                  const sanitized = val.replace(/[^0-9]/g, '');
                  setMobileNumber(sanitized);
                }}
                // onChangeText={setMobileNumber}
                keyboardType="numeric"
                maxLength={10}
                // value={onGoogleUser.user.email}
              />
              <TouchableOpacity
                style={[styles.otpBtn, {marginVertical: 20}]}
                onPress={loading ? null : handleLoginWithMobileNumber}
                disabled={loading}>
                <Text
                  style={{
                    color: THEMECOLOR.mainTextColor,
                    fontSize: 14,
                    fontFamily: 'Montserrat-Bold',
                  }}>
                  {loading ? 'Logging in...' : 'Login'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={{alignItems: 'center', marginTop: 20}}>
            <Text
              style={{
                color: 'black',
                fontSize: 14,
                fontFamily: 'Montserrat-Medium',
              }}>
              Or
            </Text>
          </View>
          <View
            style={{
              marginVertical: 10,
            }}>
            <TouchableOpacity
              style={{
                paddingTop: 7,
                paddingBottom: 7,
                borderRadius: 10,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                // height: 50,
                width: '100%',
                borderColor: THEMECOLOR.mainColor,
                borderWidth: 1,
                marginVertical: 5,
              }}
              onPress={() => setLoginType(1)}>
              <FontAwesome name="mobile-phone" size={35} color="black" />
              <Text
                style={{
                  color: '#737373',
                  fontSize: 14,
                  fontFamily: 'Montserrat-SemiBold',
                  marginLeft: 4,
                }}>
                {' '}
                Login with Phone
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            // onPress={() => navigation.navigate('GoogleAddress')}
            onPress={() => navigation.navigate('Register')}
            style={{marginVertical: 10, alignItems: 'center'}}>
            <Text
              style={{
                color: 'black',
                fontSize: 14,
                fontFamily: 'Montserrat-Medium',
              }}>
              Don't have an acoount?{' '}
              <Text
                style={{
                  color: THEMECOLOR.mainColor,
                  fontFamily: 'Montserrat-SemiBold',
                }}>
                Register
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    color: 'black',
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    paddingHorizontal: 15,
    borderColor: '#D9D9D9',
    borderWidth: 1,
    marginTop: 10,
    paddingVertical: 15,
    height: 50,
  },
  otpBtn: {
    backgroundColor: THEMECOLOR.mainColor,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  loginOptBtn: {
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: '100%',
    borderColor: THEMECOLOR.mainColor,
    borderWidth: 1,
    marginVertical: 5,
  },
  logoSize: {
    width: 23,
    height: 30,
  },
});
