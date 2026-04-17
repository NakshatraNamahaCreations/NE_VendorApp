import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  Button,
  Alert,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import THEMECOLOR from '../../utilities/color';
import { apiUrl } from '../../api-services/api-constants';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

const AddOns = ({ vendorData }) => {
  const navigation = useNavigation();
  const [serviceName, setServiceName] = useState('');
  const [price, setPrice] = useState('');
  const [isResponse, setIsResponse] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [findServiceCategory, setFindServiceCategory] = useState([]);
  const [serviceCategoryList, setServiceCategoryList] = useState([]);

  const asterisk = () => <Text style={{ color: '#f44336' }}>*</Text>;

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
    fetchServiceCategoryData();
  }, []);

  useEffect(() => {
    if (vendorData.profession) {
      const filteredCategories = serviceCategoryList.filter(
        item => item.service_name === vendorData.profession,
      );
      setFindServiceCategory(filteredCategories);
    }
  }, [vendorData.profession, serviceCategoryList]);

  const addService = async () => {
    if (!selectedCategory) {
      Alert.alert('Warning', 'Select Category is required');
      return;
    }
    if (!serviceName) {
      Alert.alert('Warning', 'Service Name is required');
      return;
    }
    if (!price) {
      Alert.alert('Warning', 'Price is required');
      return;
    }
    setIsResponse(true);
    try {
      const data = {
        price: price,
        service_name: serviceName,
        category: selectedCategory,
        vendor_id: vendorData._id,
        vendor_name: vendorData.vendor_name,
        shop_name: vendorData.shop_name,
      };

      const res = await axios.post(
        `${apiUrl.BASEURL}${apiUrl.ADD_ADDONS_FOR_SERVICE}`,
        data,
      );
      if (res.status === 200) {
        ToastAndroid.showWithGravity(
          'Addons added successfully!',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );

        // Alert.alert('Added');
        setServiceName('');
        setPrice('');
        setSelectedCategory('');
        // navigation.navigate('Home');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsResponse(false);
    }
  };

  return (
    <ScrollView>
      <View style={{ marginTop: 20 }}>
        <Text style={styles.serviceLable}>Select Service {asterisk()}</Text>
        <View
          style={{
            borderWidth: 1,
            borderColor: '#d5d5d5',
            borderRadius: 10,
            marginBottom: 10,
            paddingHorizontal: 5,
          }}>
          <Picker
            style={{ color: 'black' }}
            selectedValue={selectedCategory}
            onValueChange={cteItem => setSelectedCategory(cteItem)}>
            <Picker.Item
              label="Select Category"
              value=""
              style={{
                fontSize: 13,
                fontFamily: 'Montserrat-Medium',
                color: '#757575',
              }}
            />
            {findServiceCategory.map((item, index) => (
              <Picker.Item
                key={index}
                label={item.sub_service_name}
                value={item.sub_service_name}
                style={{
                  fontSize: 13,
                  fontFamily: 'Montserrat-Medium',
                }}
              />
            ))}
          </Picker>
        </View>
      </View>
      <View>
        <Text style={styles.serviceLable}>Service Name {asterisk()}</Text>
        <TextInput
          placeholderTextColor="#757575"
          placeholder="Enter name of the service"
          style={styles.inputBox}
          value={serviceName}
          onChangeText={pname => setServiceName(pname)}
        />
      </View>
      <View>
        <Text style={styles.serviceLable}>Price/Day {asterisk()}</Text>
        <TextInput
          placeholderTextColor="#757575"
          placeholder="Enter Price per day"
          keyboardType="numeric"
          style={styles.inputBox}
          value={price}
          onChangeText={price => {
            const sanitized = price.replace(/[^0-9]/g, '');
            setPrice(sanitized);
          }}
        />
      </View>
      <View style={{ marginVertical: 5, marginTop: 20, marginBottom: 40 }}>
        <TouchableOpacity
          onPress={isResponse ? null : addService}
          style={{
            backgroundColor: THEMECOLOR.mainColor,
            marginHorizontal: 70,
            fontFamily: 'Montserrat-Medium',
            paddingVertical: 10,
            borderRadius: 9,
          }}>
          <Text
            style={{
              fontFamily: 'Montserrat-SemiBold',
              color: 'white',
              fontSize: 13,
              textAlign: 'center',
            }}>
            {isResponse ? 'Adding' : 'Add Service'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  serviceLable: {
    fontSize: 13,
    color: 'black',
    // letterSpacing: 1,
    fontFamily: 'Montserrat-Medium',
    marginBottom: 5,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: '#d5d5d5',
    color: 'black',
    fontSize: 13,
    borderRadius: 10,
    paddingLeft: 15,
    marginBottom: 10,
    fontFamily: 'Montserrat-Regular',
    // letterSpacing: 1,
    // paddingVertical: 15,
  },
});

export default AddOns;
