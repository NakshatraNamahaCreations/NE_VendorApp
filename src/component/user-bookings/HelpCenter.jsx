import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useRoute} from '@react-navigation/native';
import useBackHandler from '../../utilities/useBackHandler';

const HelpCenter = () => {
  const route = useRoute();
  const profileData = route.params.profileData;
  useBackHandler();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#f0f0f0',
      }}>
      {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity style={{paddingTop: 15, padding: 10}}>
          <Ionicons
            name="chevron-back-sharp"
            size={25}
            color="black"
            onPress={() => navigation.goBack()}
          />
        </TouchableOpacity>
        <Text style={[styles.subHeader, {textAlign: 'center', marginTop: 15}]}>
          HELP CENTRE
        </Text>
      </View> */}
      <ScrollView style={{paddingHorizontal: 15, marginTop: 10}}>
        <Text style={styles.listItem}>
          We’re here to assist you every step of the way, ensuring a seamless
          experience for your event planning and rentals.
        </Text>
        <Text style={styles.subHeader}>Contact Us</Text>
        <Text style={styles.listItem}>
          <Text style={{fontFamily: 'Montserrat-SemiBold'}}>
            {profileData.contact_email}
          </Text>
        </Text>
        <Text style={styles.listItem}>
          <Text style={{fontFamily: 'Montserrat-SemiBold'}}>
            Phone: {profileData.contact_phone}
          </Text>{' '}
        </Text>
        <Text style={styles.subHeader}>Address</Text>
        <Text style={[styles.listItem]}>{profileData.corporate_address}</Text>
        {/* <Text style={[styles.listItem, {marginTop: 10}]}>
        FAQs : Visit our FAQ section for quick answers to common questions.
      </Text> */}
        <Text style={[styles.listItem, {marginTop: 20}]}>
          At Nithyaevent, we value your satisfaction and are committed to
          ensuring your event is a success. If you need further assistance,
          don’t hesitate to reach out. We’re always happy to help!
        </Text>
        <Text style={[styles.listItem, {marginTop: 20}]}>
          <Text style={styles.bold}>
            Nithyaevent – Making your celebrations hassle-free.
          </Text>
        </Text>
      </ScrollView>
    </View>
  );
};

export default HelpCenter;

const styles = StyleSheet.create({
  subHeader: {
    fontSize: 15,
    marginVertical: 8,
    color: '#4f4f4f',
    fontFamily: 'Montserrat-SemiBold',
  },
  paragraph: {
    fontSize: 13,
    lineHeight: 24,
    marginBottom: 8,
    color: '#555',
    fontFamily: 'Montserrat-Medium',
  },
  listItem: {
    fontSize: 13,
    lineHeight: 24,
    marginBottom: 4,
    color: '#555',
    // marginLeft: 16,
    fontFamily: 'Montserrat-Medium',
  },
  bold: {
    fontFamily: 'Montserrat-Bold',
  },
});
