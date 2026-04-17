import {
  View,
  Text,
  Image,
  BackHandler,
  Alert,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import THEMECOLOR from '../utilities/color';
import { apiUrl } from '../api-services/api-constants';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPPORT_EMAIL = 'support@nithyaevents.com';

export default function WaitingScreen({ navigation }) {
  const [reviewStatus, setReviewStatus] = useState('Under Review');
  const [isApproved, setIsApproved] = useState(false);
  const [reason, setReason] = useState('');

  useEffect(() => {
    const retrieveData = async () => {
      try {
        const value = await AsyncStorage.getItem('vendor');
        if (value !== null) {
          const v = JSON.parse(value);
          setReviewStatus(v.review_status || 'Under Review');
          setIsApproved(!!v.is_approved);
          setReason(v.reason_for_disapprove || '');
        } else {
          navigation.navigate('Login');
        }
      } catch (error) {
        console.log('error', error);
      }
    };
    retrieveData();
  }, []);

  useEffect(() => {
    const checkApprovalStatus = async () => {
      const userData = await AsyncStorage.getItem('vendor');
      if (!userData) return;
      const user = JSON.parse(userData);
      try {
        const response = await axios.get(
          `${apiUrl.BASEURL}${apiUrl.GET_VENDOR_PROFILE}${user._id}`,
        );
        const updatedUser = response.data;
        setReviewStatus(updatedUser.review_status || 'Under Review');
        setIsApproved(!!updatedUser.is_approved);
        setReason(updatedUser.reason_for_disapprove || '');
        await AsyncStorage.setItem('vendor', JSON.stringify(updatedUser));
      } catch (error) {
        console.error('Error checking approval status:', error);
      }
    };

    checkApprovalStatus();
    const interval = setInterval(checkApprovalStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        Alert.alert(
          'Exit App',
          'Do you want to exit the app?',
          [
            { text: 'Cancel', onPress: () => null, style: 'cancel' },
            { text: 'Yes', onPress: () => BackHandler.exitApp() },
          ],
          { cancelable: false },
        );
        return true;
      },
    );
    return () => backHandler.remove();
  }, []);

  const handleContactSupport = () => {
    Linking.openURL(`mailto:${SUPPORT_EMAIL}`).catch(() => {
      Alert.alert('Error', 'Unable to open mail app');
    });
  };

  if (reviewStatus === 'Disapproved') {
    return (
      <View style={styles.container}>
        <View style={styles.iconWrap}>
          <MaterialCommunityIcons
            name="briefcase-remove"
            size={140}
            color="#b9764e"
          />
          <View style={styles.badge}>
            <MaterialCommunityIcons
              name="close-circle"
              size={42}
              color="#e74c3c"
            />
          </View>
        </View>
        <Text style={styles.disapproveText}>
          Your vendor profile was disapproved for the following reason:{' '}
          <Text style={{ fontFamily: 'Montserrat-Bold' }}>
            {reason || 'Not specified'}
          </Text>
        </Text>
        <TouchableOpacity onPress={handleContactSupport}>
          <Text style={styles.supportLink}>
            For more details, please contact {SUPPORT_EMAIL}
          </Text>
        </TouchableOpacity>
        <View style={styles.bottomBtnWrap}>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: '#b6b6b6' }]}
            onPress={() => navigation.goBack()}>
            <Text style={styles.btnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const canContinue = isApproved && reviewStatus === 'Approved';

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/wait.png')}
        style={{ width: '100%', height: 200 }}
        resizeMode="contain"
      />
      <Text style={styles.title}>
        {canContinue
          ? 'Your Business is Approved'
          : 'Your Business is Under Review'}
      </Text>
      <Text style={styles.subtitle}>
        {canContinue
          ? 'Congratulations! Your vendor account has been approved. Tap Continue to start managing your business.'
          : 'Thank you for signing up! We are reviewing your details to ensure everything is in order. You will receive a notification via email once your account is approved. This usually takes 24-48 hours.'}
      </Text>
      <View style={styles.bottomBtnWrap}>
        <TouchableOpacity
          disabled={!canContinue}
          onPress={() => navigation.navigate('BottomTab')}
          style={[
            styles.btn,
            { backgroundColor: canContinue ? THEMECOLOR.mainColor : '#b6b6b6' },
          ]}>
          <Text style={styles.btnText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fdf4ff',
    paddingHorizontal: 20,
  },
  title: {
    color: '#292524',
    fontSize: 20,
    marginTop: 12,
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: 'Montserrat-Bold',
  },
  subtitle: {
    color: '#78716C',
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    textAlign: 'center',
    marginHorizontal: 30,
  },
  iconWrap: {
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 24,
  },
  disapproveText: {
    color: '#292524',
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    fontFamily: 'Montserrat-Medium',
    lineHeight: 22,
  },
  supportLink: {
    color: '#1f6feb',
    textDecorationLine: 'underline',
    fontFamily: 'Montserrat-Medium',
    fontSize: 13,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  bottomBtnWrap: {
    position: 'absolute',
    bottom: 40,
    width: '60%',
  },
  btn: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'Montserrat-SemiBold',
  },
});
