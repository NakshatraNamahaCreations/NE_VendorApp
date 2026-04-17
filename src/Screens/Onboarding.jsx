import {View, Text, Image, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import THEMECOLOR from '../utilities/color';

export default function Onboarding() {
  const navigation = useNavigation();
  const [showDisplay, setShowDisplay] = useState(0);

  const handleNext = nextScreen => {
    setShowDisplay(nextScreen);
  };

  const boardingMessage = [
    {
      image: require('../../assets/welcome-1.jpg'),
      title: 'Welcome to Nithya Vendor Hub!',
      description:
        'Join a thriving community of event equipment providers. Showcase your inventory, connect with event planners, and grow your business effortlessly.',
      buttonNext: 'Get Started',
      buttonBack: false,
      action: () => handleNext(1),
    },
    {
      image: require('../../assets/welcome-2.jpg'),
      title: 'How It Works',
      description:
        'List your equipment with detailed descriptions and images to attract event planners. Set your pricing and availability to suit your schedule. Receive bookings directly from event organizers and watch your business grow.',
      buttonNext: 'Next',
      buttonBack: true,
      action: () => handleNext(2),
      actionBack: () => handleNext(0),
    },
    {
      image: require('../../assets/welcome-2.jpg'),
      title: 'Start Earning Today!',
      description:
        'Create your profile, upload your inventory, and watch your business grow with Nithya.',
      buttonNext: 'Let’s Get Started',
      buttonBack: true,
      action: () => navigation.navigate('Login'),
      actionBack: () => handleNext(1),
    },
  ];

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <Image
        style={{
          width: '100%',
          height: 400,
          position: 'absolute',
        }}
        source={boardingMessage[showDisplay].image}
      />

      {/* Content */}
      <View
        style={{
          flex: 1,
          marginTop: 420,
          paddingHorizontal: 16,
          justifyContent: 'flex-start',
        }}>
        <Text
          style={{
            textAlign: 'center',
            color: '#404040',
            fontSize: 20,
            fontFamily: 'Montserrat-Bold',
            marginBottom: 8,
          }}>
          {boardingMessage[showDisplay].title}
        </Text>
        <Text
          style={{
            textAlign: 'center',
            color: '#757575',
            fontSize: 13,
            fontFamily: 'Montserrat-Medium',
            lineHeight: 21.6,
            marginBottom: 24,
          }}>
          {boardingMessage[showDisplay].description}
        </Text>

        {/* Dots */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 24,
          }}>
          {[0, 1, 2].map(i => (
            <View
              key={i}
              style={{
                width: 10,
                height: 10,
                borderRadius: 9999,
                backgroundColor: showDisplay === i ? '#C026D3' : '#E0E0E0',
                marginHorizontal: 4,
              }}
            />
          ))}
        </View>
      </View>

      {/* Buttons pinned to bottom */}
      <View
        style={{
          position: 'absolute',
          bottom: 40,
          left: 16,
          right: 16,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}>
          {boardingMessage[showDisplay].buttonBack && (
            <TouchableOpacity
              onPress={boardingMessage[showDisplay].actionBack}
              style={{flex: 0.5}}>
              <Text
                style={{
                  color: THEMECOLOR.mainColor,
                  fontSize: 14,
                  fontFamily: 'Montserrat-Bold',
                  textAlign: 'center',
                }}>
                Back
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={boardingMessage[showDisplay].action}
            style={{
              flex: boardingMessage[showDisplay].buttonBack ? 0.5 : 1,
              paddingVertical: 10,
              backgroundColor: THEMECOLOR.mainColor,
              borderRadius: 4,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: THEMECOLOR.mainTextColor,
                fontSize: 14,
                fontFamily: 'Montserrat-Bold',
              }}>
              {boardingMessage[showDisplay].buttonNext}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text
            style={{
              color: '#0891B2',
              fontSize: 13,
              fontFamily: 'Montserrat-SemiBold',
              textAlign: 'center',
            }}>
            Skip
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
