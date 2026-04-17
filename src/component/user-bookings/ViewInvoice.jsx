import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';
import convertAmountToWords from '../../utilities/NumberToWord';
import { apiUrl } from '../../api-services/api-constants';
import axios from 'axios';
import THEMECOLOR from '../../utilities/color';

export default function ViewInvoice() {
  const navigation = useNavigation();
  const route = useRoute();
  const { event, vendor, selectedData, paymentSummary, invoiceNumber } =
    route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [invoiceStatus, setInvoiceStatus] = useState(null);
  const [statusLoader, setStatusLoader] = useState(true);
  console.log('paymentSummary:>>>', paymentSummary);
  const invoiceItems = selectedData.map(item => ({
    produc_id: item.id,
    productName: item.productName,
    price: item.productPrice,
    total: item.productPrice,
    qty: item.qty || 1,
    addons: item.addons?.length > 0 ? item.addons : [],
  }));

  // console.log('vendor:>>>', vendor._id);
  // console.log('event:>>>', event._id);
  // console.log('invoiceStatus:>>>', invoiceStatus);

  const taxValue = Number(paymentSummary?.taxInPerc?.replace(/[^\d.-]/g, "")) || 0;
  const halfTax = taxValue / 2;

  const createInvoice = async () => {
    try {
      setIsLoading(true);
      const data = {
        items: invoiceItems,
        event: event._id,
        invoice_number: `IN${invoiceNumber}`,
        vendor: vendor._id,
        subtotal: paymentSummary.totalAmount,
        commission_applied: paymentSummary.CommissionInPerc,
        tax_applied: paymentSummary.taxInPerc,
        amount_to_paid: paymentSummary.grandTotal,
        amount_in_words: convertAmountToWords(paymentSummary.grandTotal),
        generated_date: moment().format('ll'),
      };

      const res = await axios.post(
        `${apiUrl.BASEURL}${apiUrl.CREATE_INVOICE}`,
        data,
      );
      if (res.status === 200) {
        setIsLoading(true);
        ToastAndroid.showWithGravity(
          data.message || 'Invoice Created!',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInvoiceStatus = async () => {
    try {
      setStatusLoader(true);
      const vendorId = vendor._id;
      const eventId = event._id;

      const res = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_INVOICE_STATUS}?vendor=${vendorId}&event=${eventId}`,
      );
      // console.log(
      //   'APi Url:',
      //   `${apiUrl.BASEURL}${apiUrl.GET_INVOICE_STATUS}?vendor=${vendorId}&event_id=${eventId}`,
      // );
      if (res.status === 200) {
        setInvoiceStatus(res.data);
      }
    } catch (error) {
      console.log('Failed to fetch invoice status:', error);
    } finally {
      setStatusLoader(false);
    }
  };

  useEffect(() => {
    fetchInvoiceStatus();
  }, []);

  if (statusLoader) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}>
        <ActivityIndicator size="large" color="#e91e63" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={{ borderColor: 'black', borderWidth: 1, padding: 5 }}>
          <Image
            style={{ width: 70, height: 50, resizeMode: 'contain' }}
            source={require('../../../assets/nithyaevent-round-2.jpeg')}
          />
          <View style={{ flexDirection: 'row', marginTop: 5 }}>
            <View style={{ flex: 0.5 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Montserrat-Bold',
                  color: 'black',
                }}>
                {vendor.shop_name}
              </Text>
              <Text style={styles.addressText}>{vendor.vendor_name}</Text>
              <Text style={styles.addressText}>
                {vendor.address[0]?.houseFlatBlock},{' '}
                {vendor.address[0]?.roadArea}
                {vendor.address[0]?.cityDownVillage}
              </Text>
              <Text style={styles.addressText}>
                {vendor.address[0]?.distric} - {vendor.address[0]?.pincode},{' '}
                {vendor.address[0]?.state}
              </Text>
              <Text style={[styles.addressText, styles.boldSubText]}>
                {vendor.email}
              </Text>
              <Text style={[styles.addressText, styles.boldSubText]}>
                +91-{vendor.mobile_number}
              </Text>
              <Text style={styles.addressText}>
                GSTIN: {vendor.gst_number || 'NA'}
              </Text>
            </View>
            <View style={{ flex: 0.1 }}></View>
            <View
              style={{
                flex: 0.4,
                borderWidth: 1,
                borderColor: '#e91e63',
                alignItems: 'center',
                justifyContent: 'center',
                borderStyle: 'dashed',
              }}>
              <Text
                style={{
                  fontSize: 25,
                  fontFamily: 'Montserrat-Bold',
                  color: '#e91e63',
                }}>
                VENDOR
              </Text>
              <Text
                style={{
                  fontSize: 25,
                  fontFamily: 'Montserrat-Bold',
                  color: '#e91e63',
                }}>
                INVOICE
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              marginVertical: 10,
              justifyContent: 'flex-end',
              marginTop: 30,
            }}>
            <View style={{ flex: 0.5 }}>
              <Text style={styles.boldText}>Billed To:</Text>
              <Text style={styles.boldText}>
                KADAGAM VENTURES PRIVATE LIMITED
              </Text>
              <Text style={styles.addressText}>NO.34 1st Floor,</Text>
              <Text style={styles.addressText}>
                Venkatappa Road,Tasker Town,Off Queens Road,
              </Text>
              <Text style={styles.addressText}>
                Bengaluru - 560051, Karnataka
              </Text>
              <Text style={[styles.addressText, styles.boldSubText]}>
                support@nithyaevents.com
              </Text>
              <Text style={[styles.addressText, styles.boldSubText]}>
                +91-9980137000
              </Text>
              <Text style={styles.addressText}>GSTIN: 29AADPI4078B1ZW</Text>
            </View>
            <View
              style={{
                flex: 0.5,
              }}>
              <View style={styles.invoiceContent}>
                <Text
                  style={[
                    styles.invoiceTextHead,
                    styles.addressText,
                    styles.boldSubText,
                  ]}>
                  Invoice No:
                </Text>
                <Text style={[styles.invoiceTextSub, styles.addressText]}>
                  IN{invoiceNumber}
                </Text>
              </View>
              <View style={styles.invoiceContent}>
                <Text
                  style={[
                    styles.invoiceTextHead,
                    styles.addressText,
                    styles.boldSubText,
                  ]}>
                  Event Name:
                </Text>
                <Text style={[styles.invoiceTextSub, styles.addressText]}>
                  {event.event_name}
                </Text>
              </View>
              <View style={styles.invoiceContent}>
                <Text
                  style={[
                    styles.invoiceTextHead,
                    styles.addressText,
                    styles.boldSubText,
                  ]}>
                  Event Date:{' '}
                </Text>
                <Text style={[styles.invoiceTextSub, styles.addressText]}>
                  {event.event_start_date} - {event.event_end_date}
                </Text>
              </View>
              <View style={styles.invoiceContent}>
                <Text
                  style={[
                    styles.invoiceTextHead,
                    styles.addressText,
                    styles.boldSubText,
                  ]}>
                  Invoice Date:
                </Text>
                <Text style={[styles.invoiceTextSub, styles.addressText]}>
                  {invoiceStatus
                    ? invoiceStatus?.created_date
                    : moment().format('ll')}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ marginVertical: 10 }}>
            <View style={{ borderWidth: 1 }}>
              <View
                style={{ flexDirection: 'row', backgroundColor: '#e91e6326' }}>
                <View style={{ flex: 4, borderRightWidth: 1 }}>
                  <Text style={styles.tableHeaderText}>Description</Text>
                </View>
                <View style={{ flex: 2, borderRightWidth: 1 }}>
                  <Text style={styles.tableHeaderText}>Price</Text>
                </View>
                <View style={{ flex: 2, borderRightWidth: 1 }}>
                  <Text style={styles.tableHeaderText}>Quantity</Text>
                </View>
                <View style={{ flex: 2 }}>
                  <Text style={styles.tableHeaderText}>Total</Text>
                </View>
              </View>
              {selectedData.map((ele, index) => (
                <View key={index + 1}>
                  <View style={{ flexDirection: 'row', borderTopWidth: 1 }}>
                    <View style={{ flex: 4, borderRightWidth: 1 }}>
                      <Text style={styles.tableSubText}>{ele.productName}</Text>
                    </View>
                    <View style={{ flex: 2, borderRightWidth: 1 }}>
                      <Text style={styles.tableSubText}>
                        {ele.productPrice}
                      </Text>
                    </View>
                    <View style={{ flex: 2, borderRightWidth: 1 }}>
                      <Text style={styles.tableSubText}>{ele.quantity}</Text>
                    </View>
                    <View style={{ flex: 2 }}>
                      <Text style={styles.tableSubText}>
                        {ele.productPrice}
                      </Text>
                    </View>
                  </View>
                  {ele.addons?.length > 0 && (
                    <>
                      {ele.addons?.map((items, index) => (
                        <View
                          key={index + 1}
                          style={{ flexDirection: 'row', borderTopWidth: 1 }}>
                          <View style={{ flex: 4, borderRightWidth: 1 }}>
                            <Text style={styles.tableSubText}>
                              {items.service_name}
                            </Text>
                          </View>
                          <View style={{ flex: 2, borderRightWidth: 1 }}>
                            <Text style={styles.tableSubText}>
                              {items.price}
                            </Text>
                          </View>
                          <View style={{ flex: 2, borderRightWidth: 1 }}>
                            <Text style={styles.tableSubText}>1</Text>
                          </View>
                          <View style={{ flex: 2 }}>
                            <Text style={styles.tableSubText}>
                              {items.price}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </>
                  )}
                </View>
              ))}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              {/* <View style={{flex: 0.3, marginTop: 25}}>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'Montserrat-SemiBold',
                    color: 'black',
                  }}>
                  Notes:
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'Montserrat-Medium',
                    color: 'black',
                  }}>
                  Thank you for being our Vendor
                </Text>
              </View> */}
              <View
                style={{
                  flex: 0.4,
                  borderRightWidth: 1,
                  borderLeftWidth: 1,
                }}>
                <Text style={styles.totalTextBold}>Sub Total</Text>
                <Text style={styles.totalTextBold}>Commision(22%)</Text>
                <Text style={styles.totalTextBold}>Tax(18%)</Text>
                {/* <Text style={styles.totalTextBold}>CGST(9%)</Text>
                <Text style={styles.totalTextBold}>SGST(9%)</Text> */}
                <Text style={[styles.totalTextBold, styles.boldText]}>
                  Amount To be Paid
                </Text>
              </View>
              <View
                style={{
                  flex: 0.4,
                  borderRightWidth: 1,
                }}>
                <Text style={styles.totalSubText}>
                  {paymentSummary.totalAmount}
                </Text>
                <Text style={styles.totalSubText}>
                  (-) {paymentSummary.CommissionInPerc}
                </Text>
                <Text style={styles.totalSubText}>
                  (-) {paymentSummary.taxInPerc}
                </Text>
                {/* <Text style={styles.totalSubText}>
                  (-)₹{halfTax?.toFixed(2)}
                </Text>
                <Text style={styles.totalSubText}>
                  (-) ₹{halfTax?.toFixed(2)}
                </Text> */}
                <Text style={[styles.totalSubText, styles.boldText]}>
                  {paymentSummary.grandTotal}
                </Text>
              </View>
            </View>
            <View style={{ marginTop: 20 }}>
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: 'Montserrat-SemiBold',
                  color: 'black',
                }}>
                {convertAmountToWords(paymentSummary.grandTotal)}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ marginVertical: 20 }}>
          {invoiceStatus ? (
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'Montserrat-SemiBold',
                color: '#12b300',
                textAlign: 'center',
              }}>
              Invoice {invoiceStatus?.status} at {invoiceStatus?.created_date}
            </Text>
          ) : (
            <TouchableOpacity
              onPress={isLoading ? null : createInvoice}
              style={{
                marginHorizontal: 80,
                backgroundColor: '#e91e63',
                borderRadius: 10,
                paddingVertical: 10,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Montserrat-Bold',
                  color: 'white',
                  textAlign: 'center',
                }}>
                {isLoading ? 'GENERATING...' : 'GENERATE INVOICE'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 2,
    height: '100%',
    backgroundColor: 'white',
  },
  addressText: {
    fontSize: 12,
    fontFamily: 'Montserrat-Medium',
    color: 'black',
    marginVertical: 1,
  },
  boldText: {
    fontSize: 12,
    fontFamily: 'Montserrat-Bold',
    color: 'black',
    marginVertical: 1,
  },
  boldSubText: {
    fontFamily: 'Montserrat-SemiBold',
  },
  invoiceContent: {
    flexDirection: 'row',
    marginVertical: 2,
  },
  invoiceTextHead: {
    textAlign: 'right',
    flex: 0.5,
  },
  invoiceTextSub: {
    flex: 0.5,
    textAlign: 'center',
  },
  tableHeaderText: {
    fontSize: 12,
    fontFamily: 'Montserrat-SemiBold',
    color: 'black',
    padding: 5,
    textAlign: 'center',
  },
  tableSubText: {
    fontSize: 12,
    fontFamily: 'Montserrat-Medium',
    textAlign: 'center',
    color: 'black',
    padding: 5,
  },
  totalTextBold: {
    fontSize: 12,
    fontFamily: 'Montserrat-Bold',
    textAlign: 'right',
    color: 'black',
    padding: 5,
    borderBottomWidth: 1,
  },

  totalSubText: {
    fontSize: 12,
    fontFamily: 'Montserrat-Medium',
    textAlign: 'right',
    color: 'black',
    padding: 5,
    borderBottomWidth: 1,
  },
});
