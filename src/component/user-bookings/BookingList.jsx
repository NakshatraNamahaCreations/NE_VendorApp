import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { apiUrl } from '../../api-services/api-constants';
import moment from 'moment';
import THEMECOLOR from '../../utilities/color';
import useBackHandler from '../../utilities/useBackHandler';

const BookingList = ({ vendorData }) => {
  useBackHandler();
  const navigation = useNavigation();
  const route = useRoute();
  const vendorParams = route.params?.vendorNotification || {};
  const vendorId = vendorData || vendorParams;

  const [orderedProducts, setOrderedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openSummaryId, setOpenSummaryId] = useState(null);
  const [viewSummaryOpen, setViewSummaryOpen] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [eventStatus, setEventStatus] = useState('All');

  const fetchData = async () => {
    setLoading(true);
    try {
      const baseURL = `${apiUrl.BASEURL}${apiUrl.GET_PRODUCT_BOOKED_ORDERS}${vendorId._id}`;
      const url =
        eventStatus === 'All'
          ? baseURL
          : `${baseURL}?order_status=${encodeURIComponent(eventStatus)}`;

      const res = await axios.get(url);
      // console.log('API response:', res.data);

      if (res.status === 200 && res.data.filteredResponse) {
        setOrderedProducts(res.data.filteredResponse);
      } else {
        setOrderedProducts([]);
      }
    } catch (error) {
      console.log('Error:', error);
      setOrderedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  console.log('orderedProducts', orderedProducts);

  useEffect(() => {
    fetchData();
  }, [vendorId._id, eventStatus]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Promise.all([fetchData(vendorId._id, eventStatus)]).finally(() => {
      setRefreshing(false);
    });
  }, [vendorId._id, eventStatus]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}>
        <ActivityIndicator size="large" color="#0a6fe8" />
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: '#f6f8fb', height: '100%' }}>
      <View
        style={{
          backgroundColor: 'white',
          elevation: 4,
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 15,
        }}>
        <Text
          style={{
            fontFamily: 'Montserrat-Medium',
            color: 'black',
            fontSize: 18,
            marginLeft: 20,
          }}>
          User Booking List
        </Text>
      </View>
      <View style={{ paddingHorizontal: 10, marginBottom: 60, paddingTop: 10 }}>
        <View style={{ flexDirection: 'row' }}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {[
              'All',
              'Order Placed',
              'Order Cancelled',
              'Order Rescheduled',
            ].map((ele, index) => (
              <TouchableOpacity
                key={index}
                style={{ margin: 10 }}
                onPress={() => {
                  setEventStatus(ele);
                }}>
                <Text
                  style={{
                    color: ele === eventStatus ? THEMECOLOR.mainColor : '#000',
                    fontSize: 15,
                    fontFamily: 'Montserrat-SemiBold',
                    borderBottomColor: THEMECOLOR.mainColor,
                    borderBottomWidth: ele === eventStatus ? 2 : 0,
                  }}>
                  {ele}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View style={{ marginTop: 10, marginBottom: 60 }}>
            {orderedProducts.length === 0 ? (
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: 'Montserrat-Medium',
                  fontSize: 14,
                  color: '#9d9d9d73',
                  marginTop: 50,
                }}>
                No bookings found
              </Text>
            ) : (
              <>
                {orderedProducts.map(ele => {
                  const mergeBookingId = orderedProducts.flatMap(product =>
                    product.product_data.map(data => ({
                      booking_id: product._id,
                      ...data,
                    })),
                  );

                  const deliveryStatus = mergeBookingId.find(
                    item =>
                      item.booking_id === ele._id &&
                      item.order_status === 'Order Delivered',
                  );

                  return (
                    <TouchableOpacity
                      key={ele._id}
                      style={{
                        padding: 10,
                        backgroundColor: 'white',
                        borderRadius: 8,
                        marginBottom: 10,
                        elevation: 1,
                      }}
                      onPress={() =>
                        navigation.navigate('Event Details', {
                          events: ele,
                          vendorData: vendorId,
                          bookingType: 'Product',
                          techData: ele.technicianData
                        })
                      }>
                      <View>
                        <Text
                          style={{
                            fontFamily: 'Montserrat-Medium',
                            color: 'black',
                            fontSize: 16,
                          }}>
                          {ele.event_name}
                        </Text>
                        <Text
                          style={{
                            fontFamily: 'Montserrat-SemiBold',
                            color:
                              deliveryStatus?.order_status === 'Order Delivered'
                                ? '#4da95d'
                                : '#4d63a9',
                            fontSize: 12,
                            marginVertical: 5,
                          }}>
                          {ele.product_data?.length} item
                          {ele.product_data?.length > 1 ? 's' : ''} have been{' '}
                          {deliveryStatus?.order_status === 'Order Delivered'
                            ? 'delivered'
                            : 'placed'}
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            flex: 1,
                            backgroundColor: '#FAE8FF',
                            marginVertical: 5,
                            paddingVertical: 5,
                            paddingHorizontal: 5,
                            borderRadius: 8,
                          }}>
                          <Text
                            style={{
                              fontFamily: 'Montserrat-Medium',
                              color: THEMECOLOR.mainColor,
                              fontSize: 13,
                            }}>
                            Setup Date {ele.setupStartDate} - {ele.setupEndDate}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            flex: 1,
                            backgroundColor: '#FAE8FF',
                            marginVertical: 5,
                            paddingVertical: 5,
                            paddingHorizontal: 5,
                            borderRadius: 8,
                          }}>
                          <Text
                            style={{
                              fontFamily: 'Montserrat-Medium',
                              color: THEMECOLOR.mainColor,
                              fontSize: 13,
                            }}>
                            Event Date {ele.eventStartDate} - {ele.eventEndDate}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </>
            )}
          </View>
        </ScrollView>
      </View>
      {/* )} */}
    </View>
  );
};

export default BookingList;
