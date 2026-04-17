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
import { Picker } from '@react-native-picker/picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import useBackHandler from '../../utilities/useBackHandler';

const deviceWidth = Dimensions.get('window').width;

const TechnicianList = () => {
  const route = useRoute();
  const vendorId = route.params.vendorId;
  const deviceTheme = useColorScheme();
  useBackHandler();
  const [technicianData, setTechnicianData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTech, setSelectedTech] = useState(null);
  const [selectedTechId, setSelectedTechId] = useState(null);

  const [openModal, setOpenModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [technicianType, setTechnicianType] = useState('');
  const [techName, setTechName] = useState('');
  const [price, setPrice] = useState('');
  const [isResponse, setIsResponse] = useState(false);

  const categories = [
    {
      type: 'Sound',
    },
    {
      type: 'Lighting',
    },
    {
      type: 'Video',
    },
    {
      type: 'Fabrication',
    },
    {
      type: 'Genset',
    },
    {
      type: 'shamiana',
    },
  ];

  const technicianList = [
    {
      type: 'Sound Engineer',
    },
    {
      type: 'Audio Engineer',
    },
    {
      type: 'System Engineer',
    },
    {
      type: 'Tech Operator/Engineer',
    },
    {
      type: 'Drone Operator',
    },
    {
      type: 'Stage Engineer',
    },
    {
      type: 'Technician',
    },
    {
      type: 'Others',
    },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      let res = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_TECHNICIAN_BY_VENDOR_ID}${vendorId}`,
      );
      if (res.status === 200) {
        // console.log('response data technician list', res.data.tech);
        setTechnicianData(res.data.tech);
      }
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOption = item => {
    console.log('open option.....');
    setSelectedTech(item);
    if (selectedTechId === item._id) {
      setSelectedTechId(null); // toggle off
    } else {
      setSelectedTechId(item._id); // toggle on for this card!
    }
  };

  useEffect(() => {
    if (selectedTech) {
      setSelectedCategory(selectedTech?.category);
      setTechnicianType(selectedTech?.service_name);
      setTechName(selectedTech?.tech_name);
      setPrice(String(selectedTech.price));
    }
  }, [selectedTech]);

  const handleOpenModal = () => {
    if (selectedTech) {
      setSelectedCategory(selectedTech.category || '');
      setTechnicianType(selectedTech.service_name || '');
      setTechName(selectedTech.tech_name || '');
      setPrice(String(selectedTech.price) || '');
    }
    setOpenModal(true);
  };

  const closeModal = () => {
    setSelectedCategory(selectedTech?.category);
    setTechnicianType(selectedTech?.service_name),
      setTechName(selectedTech?.tech_name);
    setPrice(String(selectedTech.price));
    setOpenModal(false);
  };

  console.log('selectedTech', selectedTech);

  const handleEditTech = () => {
    console.log('open pop.....');
  };

  const handleDeleteTech = async () => {
    try {
      const res = await axios.delete(
        `${apiUrl.BASEURL}${apiUrl.DELETE_TECHNICIAN}${selectedTech._id}`,
      );
      if (res.status === 200) {
        ToastAndroid.showWithGravity(
          'Technician Deleted!',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        fetchData();
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Something went wrong!. Try Again');
    }
  };

  const handleAction = async idx => {
    switch (idx) {
      case 0:
        setSelectedTechId(null)
        handleOpenModal();
        break;
      case 1:
        setSelectedTechId(null)
        await handleDeleteTech();
        break;
      default:
        break;
    }
  };

  const updateTechnician = async () => {
    setSelectedTechId(null);
    if (!selectedTech?._id) {
      Alert.alert("Error", "Technician ID missing");
      return;
    }
    if (!selectedCategory || !String(selectedCategory).trim()) {
      Alert.alert('Error', 'Category is required');
      return;
    }
    if (!technicianType || !String(technicianType).trim()) {
      Alert.alert('Error', 'Technician type is required');
      return;
    }
    if (!techName || !String(techName).trim()) {
      Alert.alert('Error', 'Technician name is required');
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
        service_name: technicianType,
        tech_name: techName,
        price: Number(price),
      };

      console.log("Updating Technician:", payload);

      const response = await axios.put(
        `${apiUrl.BASEURL}${apiUrl.EDIT_TECHNICIAN}${selectedTech._id}`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Technician updated successfully");
        closeModal();
        fetchData(); // refresh list if available
      }
    } catch (error) {
      console.error("Error updating technician:", error);

      if (axios.isAxiosError(error)) {
        Alert.alert(
          "Error",
          error.response?.data?.message || "Unable to update technician"
        );
      } else {
        Alert.alert("Error", "An unknown error occurred");
      }
    } finally {
      setIsResponse(false);
    }
  };


  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const searchTech = () => {
    let filtered = technicianData;
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((item) => item.tech_name.toLowerCase().includes(searchQuery.toLowerCase()))
    }
  }

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
        data={technicianData}
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
            {selectedTechId === item._id && (
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
              {item.tech_name}
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'Montserrat-Medium',
                textAlign: 'center',
                marginVertical: 2,
                color: '#333',
              }}>
              <Ionicons name="briefcase" color="#ababab" size={15} />{' '}
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
              ₹{item.price} / Day
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
                Edit Technician
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
            <Text style={styles.productLable}>Select Category </Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: '#d5d5d5',
                borderRadius: 10,
              }}>
              <Picker
                selectedValue={selectedCategory}
                style={{ color: 'black' }}
                onValueChange={cteItem => setSelectedCategory(cteItem)}>
                <Picker.Item
                  label="Select category"
                  value=""
                  style={{
                    color: deviceTheme === 'dark' ? 'white' : 'black',
                    fontSize: 13,
                    fontFamily: 'Montserrat-Regular',
                  }}
                />
                {categories.map((item, index) => (
                  <Picker.Item
                    key={index}
                    label={item.type}
                    value={item.type}
                    style={{
                      color: 'black',
                      fontSize: 13,
                      fontFamily: 'Montserrat-Regular',
                      color: deviceTheme === 'dark' ? 'white' : 'black',
                    }}
                  />
                ))}
              </Picker>
            </View>
          </View>
          <View style={{ marginVertical: 5 }}>
            <Text style={styles.productLable}>Select Technician </Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: '#d5d5d5',
                borderRadius: 10,
              }}>
              <Picker
                selectedValue={technicianType}
                style={{ color: 'black' }}
                onValueChange={cteItem => setTechnicianType(cteItem)}>
                <Picker.Item
                  label="Select category"
                  value=""
                  style={{
                    color: deviceTheme === 'dark' ? 'white' : 'black',
                    fontSize: 13,
                    fontFamily: 'Montserrat-Regular',
                  }}
                />
                {technicianList.map((ele, index) => (
                  <Picker.Item
                    key={index}
                    label={ele.type}
                    value={ele.type}
                    style={{
                      color: 'black',
                      fontSize: 13,
                      fontFamily: 'Montserrat-Regular',
                      color: deviceTheme === 'dark' ? 'white' : 'black',
                    }}
                  />
                ))}
              </Picker>
            </View>
          </View>
          <View>
            <Text style={styles.productLable}>Technician Name </Text>
            <TextInput
              placeholderTextColor="#757575"
              placeholder="Enter Technician Name"
              style={styles.productInput}
              value={techName}
              onChangeText={pname => setTechName(pname)}
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
              onPress={isResponse ? null : updateTechnician}
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
export default TechnicianList;
