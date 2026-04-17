import {View, Text, Image, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import THEMECOLOR from '../utilities/color';
import {useNavigation} from '@react-navigation/native';

export default function GetStarted() {
  const navigation = useNavigation();
  const [showDisplay, setShowDisplay] = useState(0);

  const handleNext = nextScreen => {
    setShowDisplay(nextScreen);
  };

  const screens = [
    {
      image: require('../../assets/welcome-1.jpg'),
      title: 'Welcome to Nithya Vendor Hub!',
      description:
        'Join a thriving community of event equipment providers. Showcase your inventory, connect with event planners, and grow your business effortlessly.',
      buttonText: 'Get Started',
      action: () => handleNext(1),
    },
    {
      image: require('../../assets/welcome-2.jpg'),
      title: 'How It Works',
      description:
        'List your equipment with detailed descriptions and images to attract event planners. Set your pricing and availability to suit your schedule. Receive bookings directly from event organizers and watch your business grow.',
      buttonText: 'Next',
      action: () => handleNext(2),
    },
    {
      image: require('../../assets/welcome-2.jpg'),
      title: 'Start Earning Today!',
      description:
        'Create your profile, upload your inventory, and watch your business grow with Nithya.',
      buttonText: 'Let’s Get Started',
      action: () => navigation.navigate('Login'),
    },
  ];

  return (
    <View style={{flex: 1}}>
      <Image
        style={{
          height: '100%',
          width: '100%',
          opacity: 0.5,
          backgroundColor: 'black',
          position: 'absolute',
        }}
        source={screens[showDisplay].image}
      />

      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          paddingHorizontal: 15,
        }}>
        <Text
          style={{
            color: 'white',
            fontSize: 27,
            fontFamily: 'Montserrat-Bold',
            textAlign: 'left',
          }}>
          {screens[showDisplay].title}
        </Text>
        <Text
          style={{
            color: 'white',
            fontSize: 16,
            fontFamily: 'Montserrat-Medium',
            textAlign: 'left',
            marginTop: 10,
          }}>
          {screens[showDisplay].description}
        </Text>
      </View>

      <TouchableOpacity
        onPress={screens[showDisplay].action}
        style={{
          backgroundColor: THEMECOLOR.mainColor,
          borderRadius: 5,
          paddingVertical: 12,
          paddingHorizontal: 20,
          position: 'absolute',
          bottom: 40,
          alignSelf: 'center',
          width: '80%',
        }}>
        <Text
          style={{
            color: 'white',
            fontSize: 13,
            fontFamily: 'Montserrat-SemiBold',
            textAlign: 'center',
          }}>
          {screens[showDisplay].buttonText}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
