import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  ToastAndroid,
  ScrollView,
  RefreshControl,
  Modal,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { apiUrl } from '../../api-services/api-constants';
import useBackHandler from '../../utilities/useBackHandler';
import THEMECOLOR from '../../utilities/color';
import Stepper from './Stepper';
import CalendarPicker from 'react-native-calendar-picker';
import { Checkbox } from 'react-native-paper';
import moment from 'moment';
import { useRoute } from '@react-navigation/native';

const AvailableProducts = ({ vendorData }) => {
  useBackHandler();
  const route = useRoute();
  // console.log('vendorData', vendorData);
  const paramsData = route.params?.vendor || {};
  const vendorId = vendorData || paramsData;
  const [currentStep, setCurrentStep] = useState(0);
  const [vendorProduct, setVendorProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchAllProduct = async () => {
    setLoading(true);
    try {
      let res = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_VENDOR_PRODUCT}${vendorId}`,
      );
      if (res.status === 200) {
        const products = Array.isArray(res.data.products)
          ? res.data.products
          : [];

        setVendorProduct(products);
      }
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProduct();
  }, []);

  // const filterData = () => {
  //   let filtered = vendorProduct;
  //   // Apply search filter
  //   if (searchQuery.trim() !== '') {
  //     filtered = filtered.filter(item =>
  //       item.product_name.toLowerCase().includes(searchQuery.toLowerCase()),
  //     );
  //   }
  //   return filtered;
  // };

  // const filteredProducts = filterData();

  // const selectedIds = vendorProduct
  //   .filter(item => item.isSelected)
  //   .map(item => ({_id: item._id}));

  const approvedItems = vendorProduct.filter(
    item => item.approval_status === 'Approved',
  );
  const underReviewdItems = vendorProduct.filter(
    item => item.approval_status === 'Under Review',
  );

  const filteredApprovedItems = searchQuery.trim()
    ? approvedItems.filter(item =>
      item.product_name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    : approvedItems;

  const filteredUnderReviewdItems = searchQuery.trim()
    ? underReviewdItems.filter(item =>
      item.product_name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    : underReviewdItems;

  const selectedIds = vendorProduct
    .filter(item => item.isSelected)
    .map(item => item._id);
  console.log('selectedIds', selectedIds);

  const handleNext = () => {
    if (selectedIds.length === 0) {
      ToastAndroid.show(
        'Please select at least one product',
        ToastAndroid.SHORT,
      );
      return;
    }
    if (currentStep < 1) {
      setModalVisible(true)
      // setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  console.log("startDate", startDate);
  console.log("endDate", endDate);


  const updateProductAvailability = async () => {

    if (!startDate || !endDate) {
      setLoading(false);
      ToastAndroid.show("Select Date!", ToastAndroid.SHORT);
      return
    }
    setLoading(true);
    try {
      const productIds = Array.isArray(selectedIds) ? selectedIds : [selectedIds];
      const res = await axios.post(
        `${apiUrl.BASEURL}${apiUrl.UPDATE_PRODUCT_AVAILABILITY}`,
        {
          // vendorId: vendorId,
          productId: productIds,
          blockedStartDate: startDate,
          blockedEndDate: endDate,
        },
      );
      if (res.status === 200) {
        console.log('res', res.data);
        ToastAndroid.show('Updated successfully', ToastAndroid.SHORT);
        setVendorProduct([]);
        setStartDate(null);
        setEndDate(null);
        setCurrentStep(0);
        fetchAllProduct();
      }
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Promise.all([fetchAllProduct()]).finally(() => {
      setRefreshing(false);
    });
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}>
        <ActivityIndicator size="small" color={THEMECOLOR.mainColor} />
      </View>
    );
  }

  // console.log(
  //   'vendorProduct',
  //   vendorProduct.filter(item => item.isSelected === true && item._id),
  // );

  // console.log('startDate', startDate);
  // console.log('endDate', endDate);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
      }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <Text
          style={{
            color: 'black',
            fontSize: 15,
            fontFamily: 'Montserrat-SemiBold',
            marginVertical: 15,
          }}>
          Block Products
        </Text>
        <Stepper currentStep={currentStep} />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handlePrevious}
            disabled={currentStep === 0}>
            <Text
              style={[
                styles.buttonText,
                currentStep === 0 && styles.disabledButton,
              ]}>
              {' '}
              Previous
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={handleNext}
            disabled={currentStep === 2}>
            <Text
              style={[
                styles.buttonText,
                currentStep === 2 && styles.disabledButton,
              ]}>
              Next
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          {currentStep === 0 ? (
            <View>
              <TextInput
                style={{
                  height: 45,
                  borderColor: '#dfdfdf',
                  borderWidth: 1,
                  borderRadius: 10,
                  paddingHorizontal: 10,
                  marginBottom: 10,
                  fontFamily: 'Montserrat-Medium',
                  fontSize: 14,
                  color: '#333',
                  backgroundColor: 'white',
                  margin: 10,
                }}
                placeholder="Search Products"
                placeholderTextColor="#aaa"
                value={searchQuery}
                onChangeText={text => setSearchQuery(text)}
              />
              <View style={{ marginBottom: 350 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'Montserrat-SemiBold',
                    color: 'black',
                    padding: 10,
                  }}>
                  Approved Items
                </Text>
                <FlatList
                  data={filteredApprovedItems}
                  renderItem={({ item }) => (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#f9f9f9',
                        padding: 10,
                        borderRadius: 8,
                        marginBottom: 10,
                        elevation: 1,
                      }}>
                      <View>
                        <Checkbox
                          status={item.isSelected ? 'checked' : 'unchecked'}
                          onPress={() => {
                            const updatedProducts = vendorProduct.map(product =>
                              product._id === item._id
                                ? { ...product, isSelected: !product.isSelected }
                                : product,
                            );
                            setVendorProduct(updatedProducts);
                          }}
                          color={THEMECOLOR.mainColor}
                        />
                      </View>
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text
                          style={{
                            fontSize: 14,
                            fontFamily: 'Montserrat-Medium',
                            color: 'black',
                          }}>
                          {item.product_name}
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            fontFamily: 'Montserrat-Medium',
                            color: THEMECOLOR.mainColor,
                            marginVertical: 3,
                          }}>
                          {item.block_start_date && item.block_end_date
                            ? `${item.block_start_date} - ${item.block_end_date}`
                            : item.block_start_date
                              ? `${item.block_start_date}`
                              : item.block_end_date
                                ? `${item.block_end_date}`
                                : 'No dates selected'}
                        </Text>
                      </View>
                    </View>
                  )}
                  keyExtractor={item => item._id.toString()}
                  contentContainerStyle={styles.flatListContainer}
                  showsVerticalScrollIndicator={false}
                />
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'Montserrat-SemiBold',
                    color: 'black',
                    padding: 10,
                  }}>
                  Under Review Items
                </Text>
                <FlatList
                  data={filteredUnderReviewdItems}
                  renderItem={({ item }) => (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#f9f9f9',
                        padding: 10,
                        borderRadius: 8,
                        marginBottom: 10,
                        elevation: 1,
                      }}>
                      <View>
                        <Checkbox
                          status={item.isSelected ? 'checked' : 'unchecked'}
                          onPress={() => {
                            const updatedProducts = vendorProduct.map(product =>
                              product._id === item._id
                                ? { ...product, isSelected: !product.isSelected }
                                : product,
                            );
                            setVendorProduct(updatedProducts);
                          }}
                          color={THEMECOLOR.mainColor}
                        />
                      </View>
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text
                          style={{
                            fontSize: 14,
                            fontFamily: 'Montserrat-Medium',
                            color: 'black',
                          }}>
                          {item.product_name}
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            fontFamily: 'Montserrat-Medium',
                            color: THEMECOLOR.mainColor,
                            marginVertical: 3,
                          }}>
                          {item.block_start_date && item.block_end_date
                            ? `${item.block_start_date} - ${item.block_end_date}`
                            : item.block_start_date
                              ? `${item.block_start_date}`
                              : item.block_end_date
                                ? `${item.block_end_date}`
                                : 'No dates selected'}
                        </Text>
                      </View>
                    </View>
                  )}
                  keyExtractor={item => item._id.toString()}
                  contentContainerStyle={styles.flatListContainer}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            </View>
          ) : null}
          {currentStep === 1 ? (
            <>
              {/* <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'Montserrat-SemiBold',
                  color: 'red',
                  marginBottom: 15,
                }}>
                *Note : The products won't be shown for Selected Date
              </Text> */}
              <CalendarPicker
                startFromMonday={true}
                allowRangeSelection={true}
                minDate={new Date()}
                todayBackgroundColor="transparent"
                selectedDayColor={THEMECOLOR.mainColor}
                selectedDayTextColor="#fff"
                todayTextStyle={{ color: 'black' }}
                onDateChange={(date, type) => {
                  const formattedDate = moment(date).format('DD-MM-YYYY');
                  if (type === 'START_DATE') {
                    setStartDate(formattedDate);
                    setEndDate(formattedDate);
                  } else if (type === 'END_DATE') {
                    setEndDate(formattedDate);
                  }
                }}
                textStyle={{
                  fontFamily: 'Montserrat-Medium',
                  color: '#333',
                  fontSize: 13,
                }}
              />
              <TouchableOpacity
                onPress={updateProductAvailability}
                style={{ marginHorizontal: 60, marginTop: 20 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'Montserrat-Medium',
                    color: 'white',
                    backgroundColor: THEMECOLOR.mainColor,
                    marginBottom: 5,
                    textAlign: 'center',
                    paddingVertical: 10,
                    borderRadius: 10,
                  }}>
                  Add
                </Text>
              </TouchableOpacity>
              {/* <View
              style={{
                // flexDirection: 'row',
                // justifyContent: 'space-between',
                marginTop: 10,
                paddingHorizontal: 10,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Montserrat-Medium',
                  color: 'black',
                  marginBottom: 5,
                }}>
                Start Date: {startDate ? startDate : 'Not Selected'}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Montserrat-Medium',
                  color: 'black',
                }}>
                End Date: {endDate ? endDate : 'Not Selected'}
              </Text>
            </View> */}
            </>
          ) : null}
        </View>
      </ScrollView>
      <Modal
        visible={modalVisible}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
        transparent={true}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            style={{
              width: '80%',
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 10,
              // margin: 10,
            }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'Montserrat-SemiBold',
                color: 'red',
                marginTop: 10,
                marginBottom: 10,
              }}>
              Note*
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Montserrat-Medium',
                color: 'black',
                marginBottom: 20,
              }}>
              Blocked products won't be available for Booking!
            </Text>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
              <TouchableOpacity
                style={{
                  marginHorizontal: 5,
                  marginVertical: 10,
                }}
                onPress={() => setModalVisible(false)}>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Montserrat-SemiBold',
                    color: 'black',
                    backgroundColor: '#f0f0f0',
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 5,
                  }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  marginHorizontal: 5,
                  marginVertical: 10,
                  backgroundColor: THEMECOLOR.mainColor,
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 5,
                }}
                onPress={() => {
                  setModalVisible(false);
                  setCurrentStep(prev => prev + 1)
                }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Montserrat-SemiBold',
                    color: 'white',
                  }}>
                  Continue
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  flatListContainer: {
    paddingHorizontal: 10,
  },
  dateItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor: '#f2f2f2',
  },
  selectedDate: {
    backgroundColor: THEMECOLOR.mainColor,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedDateText: {
    color: '#fff',
  },
  dayText: {
    fontSize: 14,
    color: '#666',
  },
  selectedDayText: {
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  button: {
    // backgroundColor: THEMECOLOR.mainColor,
    // paddingVertical: 10,
    // paddingHorizontal: 20,
    // borderRadius: 5,
    marginHorizontal: 15,
  },
  disabledButton: {
    color: '#D3D3D3',
  },
  buttonText: {
    color: THEMECOLOR.mainColor,
    fontSize: 14,
    fontFamily: 'Montserrat-SemiBold',
  },
});

export default AvailableProducts;
