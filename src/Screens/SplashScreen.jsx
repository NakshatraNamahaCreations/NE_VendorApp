import {Animated, Image, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {apiUrl} from '../api-services/api-constants';
import {useUserContext} from '../utilities/UserContext';

export default function SplashScreen({navigation}) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [vendor, setVendor] = useState(null);
  const [vendorApiRes, setVendorApiRes] = useState(null);
  const [navigationReady, setNavigationReady] = useState(false);
  const {setUserDataFromContext} = useUserContext();

  useEffect(() => {
    // Fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 3500,
      useNativeDriver: true,
    }).start();

    // Delay navigation by 10 seconds
    const timer = setTimeout(() => {
      console.log('Navigation Ready!');
      setNavigationReady(true);
    }, 2000); // 10 seconds

    return () => clearTimeout(timer);
  }, [fadeAnim]); //add "fadeAnim" as dependency if needed
  // ----------
  useEffect(() => {
    const retrieveData = async () => {
      try {
        const value = await AsyncStorage.getItem('vendor');
        if (value !== null) {
          setVendor(JSON.parse(value));
        } else {
          setTimeout(() => {
            console.log('No vendor found, navigating to GetStarted');
            navigation.navigate('Onboarding');
            // navigation.navigate('GetStarted');
          }, 3000);

          // navigation.navigate('Login');  // old one
        }
      } catch (error) {
        console.log('error', error);
      }
    };

    retrieveData();
  }, [navigation]); // add "navigation" as dependency if need

  useEffect(() => {
    const fetchData = async () => {
      if (vendor?._id) {
        try {
          const res = await axios.get(
            `${apiUrl.BASEURL}${apiUrl.GET_VENDOR_PROFILE}${vendor?._id}`,
          );
          if (res.status === 200) {
            const updatedUser = res.data;
            setVendorApiRes(updatedUser);
            setUserDataFromContext(updatedUser);
            await AsyncStorage.setItem('vendor', JSON.stringify(updatedUser));
          }
        } catch (error) {
          console.log('Error:', error);
        }
      }
    };

    fetchData();
  }, [vendor]);

  useEffect(() => {
    if (navigationReady && vendorApiRes) {
      console.log('Navigating after delay...');
      if (vendorApiRes?.is_approved === true) {
        navigation.navigate('BottomTab');
      } else {
        navigation.navigate('Waiting');
      }
    }
  }, [navigationReady, vendorApiRes]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      }}>
      <Animated.View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          opacity: fadeAnim,
        }}>
        <Image
          style={{width: 200, height: 200, resizeMode: 'contain'}}
          source={require('../../assets/vendorappicon.png')}
        />
      </Animated.View>
    </View>
  );
}
