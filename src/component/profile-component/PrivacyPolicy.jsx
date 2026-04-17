import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useBackHandler from '../../utilities/useBackHandler';

const PrivacyPolicy = () => {
  useBackHandler();
  const navigation = useNavigation();
  return (
    <ScrollView style={{paddingHorizontal: 15}}>
      {/* <TouchableOpacity>
        <Ionicons
          name="chevron-back-sharp"
          size={25}
          color="#575656"
          style={{marginTop: 15}}
          onPress={() => navigation.goBack()}
        />
      </TouchableOpacity>
      <Text style={[styles.subHeader, {textAlign: 'center', marginTop: 15}]}>
        PRIVACY POLICY
      </Text> */}
      <Text style={styles.subHeader}>1.Introduction</Text>
      <Text style={styles.listItem}>
        Welcome to NithyaEvent. Your privacy is important to us. This Privacy
        Policy outlines how we collect, use, disclose, and safeguard your
        information when you visit our website, And Mobile Application
        nithyaevent.com, or use our services. By using our website or services,
        you consent to the practices described in this policy.
      </Text>
      <Text style={styles.subHeader}>Information Storage and Security</Text>
      <Text style={styles.listItem}>
        We store and process your information, including any sensitive financial
        information (as defined under the Information Technology Act, 2000), on
        secure computers protected by both physical and technological security
        measures. These practices comply with the Information Technology Act,
        2000, and the rules thereunder. If you have any objections to your
        information being transferred or used in this manner, please do not use
        our platform.
      </Text>
      <Text style={styles.subHeader}>Legal Disclosure</Text>

      <Text style={styles.listItem}>
        We may disclose your personal information when required by law or in
        good faith belief that such disclosure is reasonably necessary to
        respond to subpoenas, court orders, or other legal processes. This may
        include disclosure to law enforcement, third-party rights owners, or
        others if we believe it is necessary to enforce our Terms or Privacy
        Policy, respond to claims that content violates the rights of a third
        party, or protect the rights, property, or personal safety of our users
        or the general public.
      </Text>
      <Text style={styles.subHeader}>I. Information Storage and Security</Text>
      <Text style={styles.listItem}>
        We store and process your information, including any sensitive financial
        information (as defined under the Information Technology Act, 2000), on
        secure computers protected by both physical and technological security
        measures. These practices comply with the Information Technology Act,
        2000, and the rules thereunder. If you have any objections to your
        information being transferred or used in this manner, please do not use
        our platform.
      </Text>
      <Text style={styles.subHeader}>II. Business Transactions</Text>
      <Text style={styles.listItem}>
        In the event of a merger, acquisition, or reorganization of our
        business, we and our affiliates may share or sell some or all of your
        personal information to another business entity. Should such a
        transaction occur, the new entity will be required to adhere to this
        Privacy Policy concerning your personal information.
      </Text>

      <Text style={styles.subHeader}>2. Information We Collect</Text>
      <Text style={styles.listItem}>
        <Text style={styles.bold}> Personal Information:</Text> We may collect
        personal information that you provide to us when you register on our
        site, place an order, subscribe to our newsletter, or communicate with
        us. This may include your name, email address, phone number, payment
        information, and delivery address.
      </Text>
      <Text style={styles.listItem}>
        <Text style={styles.bold}> Non-Personal Information:</Text> We may also
        collect non-personal information automatically when you visit our site.
        This may include your IP address, browser type, operating system, pages
        visited, time spent on the site, and referring website.
      </Text>
      <Text style={styles.subHeader}>3. How We Use Your Information</Text>
      <Text style={styles.listItem}>
        We use the information we collect in the following ways:
      </Text>
      <Text style={styles.listItem}>
         To process your transactions and manage your rental orders.
      </Text>
      <Text style={styles.listItem}>
         To improve our website and services based on your feedback and usage.
      </Text>
      <Text style={styles.listItem}>
         To communicate with you regarding your account, orders, or services.
      </Text>
      <Text style={styles.listItem}>
         To send periodic emails about your order or other products and
        services.
      </Text>
      <Text style={styles.listItem}>
         To comply with applicable laws and regulations.
      </Text>
      <Text style={styles.subHeader}>4. Disclosure of Your Information</Text>
      <Text style={styles.listItem}>
        We do not sell, trade, or otherwise transfer your personal information
        to third parties without your consent, except as described in this
        policy. We may share your information with:
      </Text>
      <Text style={styles.listItem}>
        <Text style={styles.bold}> Service Providers:</Text> We may share your
        information with third-party service providers who assist us in
        operating our website, conducting our business, or servicing you. These
        parties are obligated to keep your information confidential.
      </Text>
      <Text style={styles.listItem}>
        <Text style={styles.bold}> Legal Requirements:</Text> We may disclose
        your information if required to do so by law or in response to valid
        requests by public authorities.
      </Text>
      <Text style={styles.subHeader}>5. Security of Your Information</Text>
      <Text style={styles.listItem}>
        We implement a variety of security measures to maintain the safety of
        your personal information. However, please be aware that no method of
        transmission over the internet or method of electronic storage is 100%
        secure. While we strive to use commercially acceptable means to protect
        your personal information, we cannot guarantee its absolute security.
      </Text>
      <Text style={styles.subHeader}>6. Your Rights</Text>
      <Text style={styles.listItem}>You have the right to:</Text>
      <Text style={styles.listItem}>
         Access your personal information and request corrections.
      </Text>
      <Text style={styles.listItem}>
         Request the deletion of your personal information.
      </Text>
      <Text style={styles.listItem}>
         Object to the processing of your personal information.
      </Text>
      <Text style={styles.listItem}>
         Withdraw consent where we rely on your consent to process your
        information.
      </Text>

      <Text style={styles.subHeader}>7. Cookies and Tracking Technologies</Text>
      <Text style={styles.listItem}>
        Our website may use cookies and similar tracking technologies to enhance
        user experience. You can choose to accept or decline cookies. Most web
        browsers automatically accept cookies, but you can modify your browser
        setting to decline cookies if you prefer.
      </Text>
      <Text style={styles.subHeader}>8. Third-Party Links</Text>
      <Text style={styles.listItem}>
        Our website may contain links to third-party websites. We do not control
        these websites and are not responsible for their content or privacy
        practices. We encourage you to review the privacy policies of any
        third-party websites you visit.
      </Text>

      <Text style={styles.subHeader}>9. Changes to This Privacy Policy</Text>
      <Text style={styles.listItem}>
        We may update this Privacy Policy from time to time. Any changes will be
        posted on this page with an updated effective date. We encourage you to
        review this policy periodically for any changes.
      </Text>
      <Text style={styles.subHeader}>10. Contact Us</Text>
      <Text style={styles.listItem}>
        If you have any questions about this{' '}
        <Text style={styles.bold}>TERMS AND CONDITIONS Privacy Policy,</Text>{' '}
        please contact us at:
      </Text>

      <Text style={styles.listItem}>
         <Text style={styles.bold}>Email:</Text> [support@nithyaevents.com]
      </Text>
      <Text style={styles.listItem}>
        {' '}
        <Text style={styles.bold}>
          Address: [Kadagam Ventures Private Limited]
        </Text>
      </Text>
      <Text style={styles.listItem}>
         No : 34. Venkatappa Road Tasker Town
      </Text>
      <Text style={styles.listItem}> Off Queens Road Bangalore 560051</Text>
    </ScrollView>
  );
};

export default PrivacyPolicy;

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
    marginLeft: 16,
    fontFamily: 'Montserrat-Medium',
  },
  bold: {
    fontWeight: 'bold',
  },
});
