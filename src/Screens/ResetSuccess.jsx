import {View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import THEMECOLOR from '../utilities/color';

export default function ResetSuccess() {
  const navigation = useNavigation();
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View>
        <Image
          source={require('../../assets/Secure-login-bro.png')}
          style={{
            width: 250,
            height: 250,
            borderRadius: 50,
            resizeMode: 'cover',
          }}
        />
      </View>
      <Text
        style={{
          color: 'black',
          fontSize: 18,
          marginTop: 20,
          marginBottom: 12,
          fontFamily: 'Montserrat-SemiBold',
        }}>
        Password Reset Successfully
      </Text>
      <TouchableOpacity
        style={{
          marginTop: 15,
          backgroundColor: THEMECOLOR.mainColor,
          width: '70%',
          borderRadius: 10,
          paddingVertical: 10,
        }}
        onPress={() => navigation.navigate('Login')}>
        <Text
          style={{
            color: THEMECOLOR.mainTextColor,
            fontSize: 14,
            textAlign: 'center',
            fontFamily: 'Montserrat-SemiBold',
          }}>
          Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}
