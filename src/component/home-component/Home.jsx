import {
  View,
  Text,
  Image,
  Dimensions,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
  BackHandler,
  Alert,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Header from './Header';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiUrl } from '../../api-services/api-constants';
import Feather from 'react-native-vector-icons/Feather';
import THEMECOLOR from '../../utilities/color';

const { width } = Dimensions.get('window');

export default function Home() {
  const [vendor, setVendor] = useState(null);
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const [imgActive, setImgActive] = React.useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [popularItems, setPopularItems] = useState([]);
  // const [faqList, setFaqList] = useState([]);
  const [recentOrders, setRecentOrder] = useState([]);
  const [expanded, setExpanded] = React.useState(true);
  const [payoutAmount, setPayoutAmount] = useState(0);
  const [ProductCount, setProductCount] = useState([]);
  const [serviceCount, setServiceCount] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePress = () => setExpanded(!expanded);


  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
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
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => backHandler.remove();
    }, []),
  );

  useEffect(() => {
    const getVendorData = async () => {
      try {
        const storedVendorData = await AsyncStorage.getItem('vendor');
        if (storedVendorData) {
          const parsedVendorData = JSON.parse(storedVendorData);
          setVendor(parsedVendorData);

          // Only fetch data after vendor is set
          // fetchData(parsedVendorData);
        }
      } catch (error) {
        console.log('Failed to load vendor data', error);
      }
    };
    getVendorData();
  }, []);
  // console.log('vendor in home page', vendor?._id);

  useEffect(() => {
    if (vendor) {
      fetchData(vendor);
    }
  }, [vendor]);

  // const fetchFAQ = async () => {
  //   try {
  //     const res = await axios.get(`${apiUrl.BASEURL}${apiUrl.GET_ALL_FAQ}`);
  //     if (res.status === 200) {
  //       setFaqList(res.data.faq.reverse());
  //     }
  //   } catch (error) {
  //     console.log('Failed to fetch teams:', error);
  //   }
  // };

  // useEffect(() => {
  //   fetchFAQ();
  // }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const vendorProfessionType =
        vendor?.profession === 'Vendor & Seller'
          ? apiUrl.GET_PRODUCT_BOOKED_ORDERS
          : apiUrl.GET_SERVICE_BOOKED_ORDERS;
      const orderRes = await axios.get(
        `${apiUrl.BASEURL}${vendorProfessionType}${vendor?._id}`,
      );
      if (orderRes.status === 200) {
        setRecentOrder(orderRes.data.filteredResponse);
      }
    } catch (error) {
      console.log('Failed to fetch product list:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [vendor?._id]);

  const getPayouts = async () => {
    try {
      setLoading(true);
      const payoutRes = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_PAYOUT_AMOUNT}${vendor?._id}`,
      );
      if (payoutRes.status === 200) {
        // console.log('payoutRes inside api>>>>>', payoutRes.data.data);
        setPayoutAmount(payoutRes.data.data);
      }
    } catch (error) {
      console.log('Failed to fetch payouts:', error);
    } finally {
      setLoading(false);
    }
  };
  // console.log('payoutAmount', payoutAmount);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_SELLING_PRODUCTS}`,
      );
      if (res.status === 200) {
        const filteredProducts = res.data.allSellProduct.filter(
          item => item.vendor_id !== vendor?._id,
        );
        setPopularItems(filteredProducts);
      }
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPayouts();
  }, [vendor?._id]);

  // the logic for showing recent orders/bookings
  // const filterRecentOrders = recentOrders.filter(
  //   item => moment(item.ordered_date).format('ll') === moment().format('ll'),
  // );

  const fetchProductCount = async () => {
    setLoading(true);
    try {
      let res = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_VENDOR_PRODUCT}${vendor?._id}`,
      );
      if (res.status === 200) {
        setProductCount(res.data.products);
      }
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductCount();
  }, [vendor?._id]);

  const fetchServiceCount = async () => {
    setLoading(true);
    try {
      let res = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_ALL_SERVICES_BY_VENDOR_ID}${vendor?._id}`,
      );
      if (res.status === 200) {
        // console.log('servic ofv', res.data.service.length);
        setServiceCount(res.data.service);
      }
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceCount();
  }, [vendor?._id]);
  // console.log('serviceCount', serviceCount.length);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Promise.all([
      getPayouts(),
      fetchData(vendor),
      fetchOrders(),
      fetchProductCount(),
      fetchServiceCount(),
    ]).finally(() => {
      setRefreshing(false);
      setRefreshKey(prev => prev + 1);
    });
  }, [vendor, serviceCount]);

  return (
    <View style={{ backgroundColor: 'white', height: '100%' }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View
          style={{
            padding: 10,
            marginHorizontal: 10,
            // marginTop: 10,
            borderRadius: 20,
            // marginBottom: 15,
          }}>
          <Header vendor={vendor} refreshKey={refreshKey} />
          <View
            style={{
              borderBottomColor: '#CAC4D0',
              borderBottomWidth: 1,
              marginTop: 10,
              // marginBottom: 10,
            }}></View>
        </View>

        <View style={{ paddingHorizontal: 10, marginBottom: 20 }}>
          {vendor?.profession && vendor?.profession === 'Vendor & Seller' ? (
            <View style={{ marginBottom: 10 }}>
              <View
                style={{
                  backgroundColor: '#F5D0FE',
                  // backgroundColor: '#b0abc952',
                  padding: 10,
                  flexDirection: 'row',
                  borderRadius: 20,
                  justifyContent: 'flex-end',
                }}>
                <View
                  style={{
                    position: 'absolute',
                    left: 20,
                    zIndex: 1,
                    width: '40%',
                    top: 30,
                  }}>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 15,
                      fontFamily: 'Montserrat-SemiBold',
                    }}>
                    Total Earnings
                  </Text>
                  <View style={{ marginTop: 10 }}>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 20,
                        textAlign: 'left',
                        fontFamily: 'Montserrat-Bold',
                      }}>
                      ₹ {payoutAmount}
                    </Text>
                  </View>
                </View>
                <Image
                  source={require('../../../assets/codifyformatter.png')}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 15,
                    resizeMode: 'contain',
                    opacity: 0.4,
                    alignSelf: 'flex-end',
                  }}
                />
              </View>
            </View>
          ) : (
            <View style={{ marginBottom: 10, marginTop: 10 }}>
              <View
                style={{
                  backgroundColor: '#F5D0FE',
                  // backgroundColor: '#C026D3',
                  padding: 10,
                  flexDirection: 'row',
                  borderRadius: 20,
                  justifyContent: 'flex-end',
                }}>
                <View
                  style={{
                    position: 'absolute',
                    left: 20,
                    zIndex: 1,
                    width: '40%',
                    top: 30,
                  }}>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 15,
                      fontFamily: 'Montserrat-SemiBold',
                    }}>
                    Earned Amount
                  </Text>
                  <View style={{ marginTop: 10 }}>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 20,
                        textAlign: 'left',
                        fontFamily: 'Montserrat-Bold',
                      }}>
                      ₹ {payoutAmount}
                    </Text>
                  </View>
                </View>

                <Image
                  source={require('../../../assets/codifyformatter.png')}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 15,
                    resizeMode: 'contain',
                    alignSelf: 'flex-end',
                  }}
                />
              </View>
            </View>
          )}
          {vendor?.profession && vendor?.profession === 'Vendor & Seller' && (
            <View style={{ marginBottom: 20 }}>
              <View
                style={{
                  backgroundColor: '#F5D0FE',
                  padding: 10,
                  flexDirection: 'row',
                  borderRadius: 20,
                  justifyContent: 'space-between',
                }}>
                <Image
                  source={require('../../../assets/box.png')}
                  style={{
                    width: 100,
                    height: 100,
                    resizeMode: 'contain',
                    position: 'absolute',
                    alignSelf: 'center',
                    opacity: 0.6,
                    left: '30%',
                  }}
                />
                <View
                  style={{
                    flex: 0.6,
                  }}>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 15,
                      // textAlign: 'left',
                      fontFamily: 'Montserrat-Bold',
                    }}>
                    Add Products
                  </Text>

                  <Text
                    style={{
                      color: 'black',
                      fontSize: 12,
                      fontFamily: 'Montserrat-Regular',
                      marginTop: 10,
                    }}>
                    List your equipment with photos, descriptions, and pricing
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Add')}
                  style={{
                    flex: 0.4,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: 'white',
                      fontFamily: 'Montserrat-SemiBold',
                      backgroundColor: '#C026D3',
                      paddingHorizontal: 17,
                      paddingVertical: 10,
                      borderRadius: 5,
                    }}>
                    Add Product
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          {vendor?.profession && vendor?.profession !== 'Vendor & Seller' && (
            <View style={{ marginBottom: 20 }}>
              <View
                style={{
                  backgroundColor: '#F5D0FE',
                  padding: 10,
                  flexDirection: 'row',
                  borderRadius: 20,
                  justifyContent: 'space-between',
                }}>
                <Image
                  source={require('../../../assets/box.png')}
                  style={{
                    width: 100,
                    height: 100,
                    resizeMode: 'contain',
                    position: 'absolute',
                    alignSelf: 'center',
                    opacity: 0.6,
                    left: '30%',
                  }}
                />
                <View
                  style={{
                    flex: 0.6,
                  }}>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 15,
                      // textAlign: 'left',
                      fontFamily: 'Montserrat-Bold',
                    }}>
                    Add Service
                  </Text>

                  <Text
                    style={{
                      color: 'black',
                      fontSize: 12,
                      fontFamily: 'Montserrat-Regular',
                      marginTop: 10,
                    }}>
                    List your equipment with photos, descriptions, and pricing
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => navigation.navigate('AddService')}
                  style={{
                    flex: 0.4,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: 'white',
                      fontFamily: 'Montserrat-SemiBold',
                      backgroundColor: '#C026D3',
                      paddingHorizontal: 17,
                      paddingVertical: 10,
                      borderRadius: 5,
                    }}>
                    Add Service
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          <View style={{ marginBottom: 20 }}>
            <View
              style={{
                backgroundColor: '#F5D0FE',
                padding: 10,
                flexDirection: 'row',
                borderRadius: 20,
                justifyContent: 'space-between',
              }}>
              <Image
                source={require('../../../assets/box.png')}
                style={{
                  width: 100,
                  height: 100,
                  resizeMode: 'contain',
                  position: 'absolute',
                  alignSelf: 'center',
                  opacity: 0.6,
                  left: '30%',
                }}
              />
              <View
                style={{
                  flex: 0.6,
                }}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 15,
                    // textAlign: 'left',
                    fontFamily: 'Montserrat-Bold',
                  }}>
                  {vendor?.profession &&
                    vendor?.profession === 'Vendor & Seller'
                    ? 'Product Reviews'
                    : 'Service Reviews'}
                </Text>

                <Text
                  style={{
                    color: 'black',
                    fontSize: 12,
                    fontFamily: 'Montserrat-Regular',
                    marginTop: 10,
                  }}>
                  List your equipment with photos, descriptions, and pricing
                </Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(
                    vendor?.profession &&
                      vendor?.profession === 'Vendor & Seller'
                      ? 'My Products'
                      : 'Service List',
                    {
                      vendorId: vendor._id,
                    },
                  )
                }
                style={{
                  flex: 0.4,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: 'white',
                    fontFamily: 'Montserrat-SemiBold',
                    backgroundColor: '#C026D3',
                    paddingHorizontal: 17,
                    paddingVertical: 10,
                    borderRadius: 5,
                  }}>
                  View Reviews{' '}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10,
              marginHorizontal: 8,
            }}>
            <Text
              style={{
                fontSize: 15,
                color: 'black',
                fontFamily: 'Montserrat-SemiBold',
              }}>
              Your Insights
            </Text>
          </View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {vendor?.profession && vendor?.profession === 'Vendor & Seller' && (
              <Pressable
                onPress={() =>
                  navigation.navigate('My Products', {
                    vendorId: vendor._id,
                  })
                }
                style={{
                  width: '48%',
                  marginRight: 10,
                  backgroundColor: 'white',
                  padding: 10,
                  borderRadius: 10,
                  elevation: 2,
                }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <View
                    style={{
                      backgroundColor: '#DCFCE7',
                      padding: 10,
                      borderRadius: 15,
                      marginBottom: 10,
                    }}>
                    <Feather name="box" size={30} color="#16A34A" />
                  </View>
                </View>
                <Text
                  style={{
                    fontSize: 13,
                    color: 'black',
                    fontFamily: 'Montserrat-SemiBold',
                    marginBottom: 10,
                    textAlign: 'center',
                  }}>
                  Products Added
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    color: 'black',
                    fontFamily: 'Montserrat-SemiBold',
                    marginBottom: 10,
                    textAlign: 'center',
                  }}>
                  {ProductCount.length}
                </Text>
                <Text
                  style={{
                    fontSize: 10,
                    color: THEMECOLOR.mainColor,
                    fontFamily: 'Montserrat-SemiBold',
                    marginBottom: 10,
                    textAlign: 'center',
                  }}>
                  View Products
                </Text>
              </Pressable>
            )}
            {vendor?.profession && vendor?.profession !== 'Vendor & Seller' && (
              <Pressable
                style={{
                  width: '48%',
                  marginRight: 10,
                  backgroundColor: 'white',
                  padding: 10,
                  borderRadius: 10,
                  elevation: 2,
                }}
                onPress={() =>
                  navigation.navigate('Service List', {
                    vendorId: vendor._id,
                  })
                }>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <View
                    style={{
                      backgroundColor: '#DCFCE7',
                      padding: 10,
                      borderRadius: 15,
                      marginBottom: 10,
                    }}>
                    <Feather name="box" size={30} color="#16A34A" />
                  </View>
                </View>
                <Text
                  style={{
                    fontSize: 13,
                    color: 'black',
                    fontFamily: 'Montserrat-SemiBold',
                    marginBottom: 10,
                    textAlign: 'center',
                  }}>
                  Service Added
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    color: 'black',
                    fontFamily: 'Montserrat-SemiBold',
                    marginBottom: 10,
                    textAlign: 'center',
                  }}>
                  {serviceCount.length}
                </Text>
                <Text
                  style={{
                    fontSize: 10,
                    color: THEMECOLOR.mainColor,
                    fontFamily: 'Montserrat-SemiBold',
                    marginBottom: 10,
                    textAlign: 'center',
                  }}>
                  View Services
                </Text>
              </Pressable>
            )}
            <Pressable
              style={{
                width: '48%',
                backgroundColor: 'white',
                padding: 10,
                borderRadius: 10,
                elevation: 2,
              }}
              onPress={() =>
                navigation.navigate(
                  vendor?.profession && vendor?.profession === 'Vendor & Seller'
                    ? 'Booking List'
                    : 'Schedule',
                )
              }>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <View
                  style={{
                    backgroundColor: '#DDD6FE',
                    padding: 10,
                    borderRadius: 15,
                    marginBottom: 10,
                  }}>
                  <Feather name="calendar" size={30} color="#7C3AED" />
                </View>
              </View>
              <Text
                style={{
                  fontSize: 13,
                  color: 'black',
                  fontFamily: 'Montserrat-SemiBold',
                  marginBottom: 10,
                  textAlign: 'center',
                }}>
                Bookings
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  color: 'black',
                  fontFamily: 'Montserrat-SemiBold',
                  marginBottom: 10,
                  textAlign: 'center',
                }}>
                {recentOrders.length}
                {/* {vendor?.profession && vendor?.profession === 'Vendor & Seller'
                  ? recentOrders.length
                  : 2} */}
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  color: THEMECOLOR.mainColor,
                  fontFamily: 'Montserrat-SemiBold',
                  marginBottom: 10,
                  textAlign: 'center',
                }}>
                View Bookings
              </Text>
            </Pressable>
            <Pressable
              style={{
                width: '48%',
                backgroundColor: 'white',
                padding: 10,
                borderRadius: 10,
                elevation: 2,
                marginTop: 10,
              }}
              onPress={() =>
                navigation.navigate('PayoutHistory', {
                  vendor: vendor,
                })
              }>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <View
                  style={{
                    backgroundColor: '#DDD6FE',
                    padding: 10,
                    borderRadius: 15,
                    marginBottom: 10,
                  }}>
                  <Feather name="calendar" size={30} color="#7C3AED" />
                </View>
              </View>
              <Text
                style={{
                  fontSize: 13,
                  color: 'black',
                  fontFamily: 'Montserrat-SemiBold',
                  marginBottom: 10,
                  textAlign: 'center',
                }}>
                Revenue
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  color: 'black',
                  fontFamily: 'Montserrat-SemiBold',
                  marginBottom: 10,
                  textAlign: 'center',
                }}>
                {payoutAmount}
                {/* {recentOrders.length} */}
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  color: THEMECOLOR.mainColor,
                  fontFamily: 'Montserrat-SemiBold',
                  marginBottom: 10,
                  textAlign: 'center',
                }}>
                View pay history
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color={THEMECOLOR.mainColor} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});
