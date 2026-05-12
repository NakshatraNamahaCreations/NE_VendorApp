import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  DeviceEventEmitter,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import Octicons from 'react-native-vector-icons/Octicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import THEMECOLOR from '../../utilities/color';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import moment from 'moment';
import { apiUrl } from '../../api-services/api-constants';
import useBackHandler from '../../utilities/useBackHandler';

export default function Notification() {
  useBackHandler();
  const route = useRoute();
  const navigation = useNavigation();
  const data = route.params.vendor || {};
  const vendorData = data;
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        // `https://api.nithyaevent.com/api/vendor-inapp/get-notifications?vendorId=${vendorData?._id}`,
        `${apiUrl.BASEURL}${apiUrl.GET_NOTIFICATION}${vendorData._id}`,
      );
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchNotifications();
  }, [vendorData._id]);

  console.log("notifications", notifications)

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Promise.all([fetchNotifications()]).finally(() => {
      setRefreshing(false);
    });
  }, [vendorData]);

  const handleNotificationClick = notification => {
    console.log('notification type', notification);
    if (notification.status === 'unread') {
      setNotifications(prev =>
        prev.map(n =>
          n._id === notification._id ? {...n, status: 'read'} : n,
        ),
      );
      DeviceEventEmitter.emit('notifications:read', {
        notificationId: notification._id,
      });
    }
    switch (notification.notification_type) {
      case 'product_approval':
        navigation.navigate('My Products', {
          vendorId: vendorData._id,
        });
        break;
      case 'service_approval':
        navigation.navigate('Service List', {
          vendorId: vendorData._id,
        });
        break;
      case 'product_booking':
        navigation.navigate('Booking List', {
          vendorNotification: vendorData,
          // bookingId: notification.metadata.bookingId,
        });
        break;
      case 'service_booking':
        navigation.navigate('Schedule', {
          vendorNotification: vendorData,
          // bookingId: notification.metadata.bookingId,
        });
        break;
      case 'vendor_payment':
        navigation.navigate('PayoutHistory', {
          vendor: vendorData,
        });
        break;
      default:
        console.log('Unknown notification type');
    }

    // Mark notification as read
    markNotificationAsRead(notification._id);
  };

  const markNotificationAsRead = async notificationId => {
    try {
      const response = await fetch(
        `${apiUrl.BASEURL}${apiUrl.MARK_AS_READ_NOTIFICATION}${notificationId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }

      await response.json();
      // Re-emit so the Header re-fetches from the now-updated server state.
      DeviceEventEmitter.emit('notifications:read', {notificationId});
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // console.log('notifications', notifications);

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
    <View
      style={{
        flex: 1,
        // justifyContent: 'flex-start',
        // alignItems: 'center',
        // backgroundColor: 'white',
      }}>
      <View
        style={{
          backgroundColor: 'white',
          paddingHorizontal: 20,
          paddingVertical: 15,
          flexDirection: 'row',
          alignItems: 'center',
          elevation: 5,
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Octicons name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Text
          style={{
            fontFamily: 'Montserrat-Medium',
            color: 'black',
            fontSize: 18,
            marginLeft: 20,
          }}>
          Notifications
        </Text>
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{ paddingTop: 1 }}>
        {notifications.length > 0 ? (
          <View style={{ marginBottom: 5 }}>
            {notifications.map(notification => {
              const regex = /"(.*?)"/; // Regex to match the text within quotes
              const match = notification.message.match(regex); // Extract the quoted text
              const before = notification.message.split(regex)[0]; // Text before the quotes
              const quoted = match ? match[1] : ''; // The quoted text
              const after = notification.message.split(regex)[2]; // Text after the quotes
              return (
                <View key={notification._id}>
                  <TouchableOpacity
                    style={{
                      padding: 10,
                      backgroundColor:
                        notification.status === 'unread' ? '#d7e9fb' : 'white',
                    }}
                    onPress={() => handleNotificationClick(notification)}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View>
                        {notification.notification_type ===
                          'product_approval' ||
                          notification.notification_type ===
                          'service_approval' ? (
                          <View
                            style={{
                              padding: 5,
                              borderRadius: 50,
                              backgroundColor: '#5ad693',
                            }}>
                            <FontAwesome5
                              name="box-open"
                              color="white"
                              size={20}
                            />
                          </View>
                        ) : notification.notification_type ===
                          'vendor_payment' ? (
                          <View
                            style={{
                              padding: 5,
                              borderRadius: 50,
                              backgroundColor: '#ffb038',
                            }}>
                            <MaterialIcons
                              name="currency-rupee"
                              color="white"
                              size={20}
                            />
                          </View>
                        ) : notification.notification_type ===
                          'product_booking' ||
                          notification.notification_type ===
                          'service_booking' ? (
                          <View
                            style={{
                              padding: 5,
                              borderRadius: 50,
                              backgroundColor: '#19bbf5',
                            }}>
                            <MaterialCommunityIcons
                              name="cart-outline"
                              color="white"
                              size={20}
                            />
                          </View>
                        ) : null}
                      </View>
                      <View style={{ flex: 5, marginLeft: 10 }}>
                        <View>
                          <Text
                            style={{
                              fontSize: 13,
                              color: 'black',
                              fontFamily: 'Montserrat-Medium',
                            }}>
                            {before}
                            <Text
                              style={{
                                fontFamily: 'Montserrat-Bold',
                              }}>
                              {quoted}
                            </Text>
                            {after}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 5,
                          }}>
                          {notification.status === 'unread' && (
                            <Octicons
                              name="dot-fill"
                              color="#0a66c2"
                              size={12}
                              style={{ marginRight: 7 }}
                            />
                          )}
                          <Text
                            style={{
                              fontSize: 12,
                              fontFamily: 'Montserrat-Medium',
                              color: '#0009',
                            }}>
                            {moment(notification.createdAt).fromNow()}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* <Text
                    style={{
                      fontSize: 16,
                      color: 'black',
                      fontFamily: 'Montserrat-Medium',
                    }}>
                    {notification.message}
                  </Text> */}
                  </TouchableOpacity>
                  <View
                    style={{
                      borderBottomColor: '#8c8c8c33',
                      borderBottomWidth: 1,
                    }}></View>
                </View>
              );
            })}
          </View>
        ) : (
          <>
            <Image
              source={require('../../../assets/notification.png')}
              style={{
                width: 200,
                height: 200,
                marginTop: '20%',
                marginBottom: 30,
                alignSelf: 'center',
              }}
              onError={() => console.log('Error loading image')} // Error handling for image
            />
            <View style={{ paddingLeft: 20, paddingRight: 20 }}>
              <Text
                style={{
                  color: THEMECOLOR.mainColor,
                  fontSize: 15,
                  marginBottom: 10,
                  textAlign: 'center',
                  fontFamily: 'Montserrat-SemiBold',
                }}>
                NO NOTIFICATIONS
              </Text>
              {/* <View
          style={{
            borderBottomColor: '#353249',
            borderWidth: 2,
            // width: 50,
            flexDirection: 'row',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
          }}></View> */}
              <Octicons
                name="horizontal-rule"
                color={THEMECOLOR.mainColor}
                size={20}
                style={{ textAlign: 'center', marginBottom: 10 }}
              />
              <Text
                style={{
                  color: '#515151',
                  fontSize: 14,
                  fontWeight: '400',
                  textAlign: 'center',
                  fontFamily: 'Montserrat-Medium',
                }}>
                Clutter cleared! We'll notify you when there is something to
                show
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
