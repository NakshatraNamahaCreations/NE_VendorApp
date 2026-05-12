import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
  StyleSheet,
  useColorScheme,
  Alert,
  ToastAndroid,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { apiUrl } from '../../api-services/api-constants';
import axios from 'axios';
import THEMECOLOR from '../../utilities/color';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Modal from 'react-native-modal';
import { Button } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import useBackHandler from '../../utilities/useBackHandler';
import { formatAmount } from '../../utilities/formatAmount';

const deviceWidth = Dimensions.get('window').width;

const AddonsList = () => {
  const route = useRoute();
  const vendorData = route.params.vendor;
  const deviceTheme = useColorScheme();
  useBackHandler();
  const [addOnsData, setAddOnsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const [openModal, setOpenModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [price, setPrice] = useState('');
  const [isResponse, setIsResponse] = useState(false);
  const [serviceCategoryList, setServiceCategoryList] = useState([]);
  const [findServiceCategory, setFindServiceCategory] = useState([]);

  const fetchServiceCategoryData = async () => {
    try {
      const serviceCategoryRes = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_ALL_SUB_SERVICE}`,
      );
      if (serviceCategoryRes.status === 200) {
        setServiceCategoryList(serviceCategoryRes.data.data);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };
  useEffect(() => {
    if (vendorData.profession) {
      const filteredCategories = serviceCategoryList.filter(
        item => item.service_name === vendorData.profession,
      );
      setFindServiceCategory(filteredCategories);
    }
  }, [vendorData.profession, serviceCategoryList]);


  useEffect(() => {
    fetchServiceCategoryData();
  }, []);

  const fetchAddons = async () => {
    try {
      const vendor_id = vendorData._id;   // or wherever you store vendor id 

      const response = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.ADDONS_LIST_BY_VENDORID}`,
        {
          params: {
            vendor_id,
          },
          paramsSerializer: params => {
            return new URLSearchParams(params).toString();
          }
        },

      );

      if (response.status === 200) {
        setAddOnsData(response.data.addOns);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };


  useEffect(() => {
    fetchAddons();
  }, []);

  const handleOption = item => {
    console.log('open option.....');
    setSelectedItem(item);
    if (selectedItemId === item._id) {
      setSelectedItemId(null); // toggle off
    } else {
      setSelectedItemId(item._id); // toggle on for this card!
    }
  };

  useEffect(() => {
    if (selectedItem) {
      setSelectedCategory(selectedItem?.category);
      setServiceName(selectedItem?.service_name);
      setPrice(String(selectedItem.price));
    }
  }, [selectedItem]);

  const handleOpenModal = () => {
    if (selectedItem) {
      setSelectedCategory(selectedItem.category || '');
      setServiceName(selectedItem.service_name || '');
      setPrice(String(selectedItem.price) || '');
    }
    setOpenModal(true);
  };

  const closeModal = () => {
    setSelectedCategory(selectedItem?.category);
    setServiceName(selectedItem?.tech_name);
    setPrice(String(selectedItem.price));
    setOpenModal(false);
  };

  console.log('selectedItem', selectedItem);

  const handleEditTech = () => {
    console.log('open pop.....');
  };

  const handleDeleteAddons = async () => {
    try {
      const res = await axios.delete(
        `${apiUrl.BASEURL}${apiUrl.DELETE_ADDONS}${selectedItem._id}`,
      );
      console.log("Delete response", res.data);
      if (res.status === 200 && res.data?.success) {
        ToastAndroid.showWithGravity(
          res.data.success, // Displays "Deleted successfully"
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        fetchAddons();
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Something went wrong!. Try Again');
    }
  };

  const handleAction = async idx => {
    switch (idx) {
      case 0:
        setSelectedItemId(null)
        handleOpenModal();
        break;
      case 1:
        setSelectedItemId(null)
        await handleDeleteAddons();
        break;
      default:
        break;
    }
  };

  const updateAddons = async () => {
    setSelectedItemId(null);
    if (!selectedItem?._id) {
      Alert.alert("Error", "Addon ID missing");
      return;
    }
    if (!selectedCategory || !String(selectedCategory).trim()) {
      Alert.alert('Error', 'Category is required');
      return;
    }
    if (!serviceName || !String(serviceName).trim()) {
      Alert.alert('Error', 'Service name is required');
      return;
    }
    if (price === '' || price === null || price === undefined) {
      Alert.alert('Error', 'Price is required');
      return;
    }
    if (Number.isNaN(Number(price)) || Number(price) <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }

    try {
      setIsResponse(true);

      const payload = {
        category: selectedCategory,
        service_name: serviceName,
        price: Number(price),
      };

      console.log("Updating Addons:", payload);

      const response = await axios.put(
        `${apiUrl.BASEURL}${apiUrl.EDIT_ADDONS_BY_ID}${selectedItem._id}`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Details updated successfully");
        closeModal();
        fetchAddons(); // refresh list if available
      }
    } catch (error) {
      console.error("Error updating addons:", error);

      if (axios.isAxiosError(error)) {
        Alert.alert(
          "Error",
          error.response?.data?.message || "Unable to update addons"
        );
      } else {
        Alert.alert("Error", "An unknown error occurred");
      }
    } finally {
      setIsResponse(false);
    }
  };


  console.log("addOnsData ADDOINS LIST", addOnsData);

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

  return (
    <View style={{ flex: 1, padding: 10 }}>
      {/* <View style={{ marginVertical: 10 }}>
        <TextInput
          style={{
            height: 45,
            borderRadius: 10,
            paddingHorizontal: 10,
            fontFamily: 'Montserrat-Medium',
            fontSize: 14,
            color: '#333',
            elevation: 1,
            backgroundColor: 'white',
          }}
          placeholder="Search Products"
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
        />
      </View> */}
      <FlatList
        data={addOnsData}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: 'white',
              padding: 10,
              margin: 5,
              flex: 1,
              borderRadius: 10,
            }}>
            <TouchableOpacity
              onPress={() => handleOption(item)}
              style={{ justifyContent: 'flex-end', flexDirection: 'row' }}>
              <Entypo name="dots-three-vertical" color="black" size={15} />
            </TouchableOpacity>
            {selectedItemId === item._id && (
              <View
                style={{
                  position: 'absolute',
                  zIndex: 1,
                  backgroundColor: 'white',
                  marginTop: 30,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  elevation: 3,
                  borderRadius: 5,
                  right: 5,
                }}>
                {['Edit', 'Delete'].map((ele, index) => (
                  <TouchableOpacity
                    onPress={() => handleAction(index)}
                    style={{
                      marginVertical: 10,
                    }}
                    key={index}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: 'Montserrat-Medium',
                        textAlign: 'center',
                        color: 'black',
                      }}>
                      {ele}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'Montserrat-Bold',
                textAlign: 'center',
                color: '#333',
                marginVertical: 2,
              }}>
              {item.service_name}
            </Text>

            <Text
              style={{
                fontSize: 13,
                fontFamily: 'Montserrat-SemiBold',
                textAlign: 'center',
                marginVertical: 2,
                color: '#e91e63',
              }}>
              ₹{formatAmount(item.price)} / Day
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'Montserrat-Medium',
                textAlign: 'center',
                marginVertical: 2,
                color: '#333',
              }}>
              Category: {item.category}
            </Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
      />

      <Modal
        animationIn="slideInUp"
        isVisible={openModal}
        deviceWidth={deviceWidth}
        style={{
          margin: 0,
          position: 'absolute',
          width: '100%',
          backgroundColor: 'white',
          shadowColor: '#000',
          bottom: 2,
          padding: 10,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}
        transparent={true}>
        <View style={{ marginBottom: 10 }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginVertical: 10,
            }}>
            <View style={{ flex: 0.5 }}>
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: 'Montserrat-SemiBold',
                  color: 'black',
                }}>
                Edit Addon's
              </Text>
            </View>
            <TouchableOpacity
              onPress={closeModal}
              style={{
                flex: 0.5,
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}>
              <AntDesign name="closecircle" color="black" size={23} />
            </TouchableOpacity>
          </View>
          <View style={{ marginVertical: 5 }}>
            <Text style={styles.productLable}>Select Service </Text>
            <Dropdown
              data={findServiceCategory.map(item => ({ label: item.sub_service_name, value: item.sub_service_name }))}
              labelField="label"
              valueField="value"
              placeholder="Select category"
              value={selectedCategory}
              onChange={item => setSelectedCategory(item.value)}
              maxHeight={260}
              style={{
                borderWidth: 1,
                borderColor: '#d5d5d5',
                borderRadius: 10,
                marginBottom: 10,
                paddingHorizontal: 15,
                height: 48,
                backgroundColor: 'white',
              }}
              placeholderStyle={{
                color: '#757575',
                fontSize: 14,
                fontFamily: 'Montserrat-Regular',
              }}
              selectedTextStyle={{
                color: 'black',
                fontSize: 14,
                fontFamily: 'Montserrat-Medium',
              }}
              itemTextStyle={{
                color: 'black',
                fontSize: 14,
                fontFamily: 'Montserrat-Regular',
              }}
              containerStyle={{
                borderRadius: 10,
                borderColor: '#d5d5d5',
              }}
            />
          </View>

          <View>
            <Text style={styles.productLable}>Service Name </Text>
            <TextInput
              placeholderTextColor="#757575"
              placeholder="Enter Service Name"
              style={styles.productInput}
              value={serviceName}
              onChangeText={pname => setServiceName(pname)}
            />
          </View>
          <View>
            <Text style={styles.productLable}>Price/Day </Text>
            <TextInput
              placeholderTextColor="#757575"
              placeholder="Enter Price per day"
              keyboardType="numeric"
              style={styles.productInput}
              value={price}
              onChangeText={text => {
                const sanitized = text.replace(/[^0-9]/g, '');
                setPrice(sanitized);
              }}
            />
          </View>
          <View style={{ marginVertical: 5, marginTop: 20, marginBottom: 40 }}>
            <TouchableOpacity
              style={{
                backgroundColor: THEMECOLOR.mainColor,
                marginHorizontal: 50,
                fontFamily: 'Montserrat-Medium',
                borderRadius: 10,
                paddingVertical: 10,
              }}
              onPress={isResponse ? null : updateAddons}
            >
              <Text
                style={{
                  fontSize: 13,
                  color: 'white',
                  fontFamily: 'Montserrat-SemiBold',
                  marginBottom: 5,
                  textAlign: 'center',
                }}>
                {isResponse ? 'Updating...' : 'Update'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  productLable: {
    fontSize: 13,
    color: 'black',
    fontFamily: 'Montserrat-Medium',
    marginBottom: 5,
  },
  productInput: {
    borderWidth: 1,
    borderColor: '#d5d5d5',
    color: 'black',
    fontSize: 13,
    borderRadius: 10,
    paddingLeft: 15,
    marginBottom: 10,
    fontFamily: 'Montserrat-Regular',
  },
});
export default AddonsList;
