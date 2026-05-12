import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  useColorScheme,
  TextInput,
  Alert,
  ToastAndroid,
} from 'react-native';
import React, {useState} from 'react';
import {Dropdown} from 'react-native-element-dropdown';
import axios from 'axios';
import THEMECOLOR from '../../utilities/color';
import {Button} from 'react-native-paper';
import {apiUrl} from '../../api-services/api-constants';
import {useNavigation} from '@react-navigation/native';

const AddEngineer = ({vendorData}) => {
  const deviceTheme = useColorScheme();
  const navigation = useNavigation();
  console.log('vendorData in add engineer', vendorData);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTech, setSelectedTech] = useState('');
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

  const technicianType = [
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

  const asterisk = () => <Text style={{color: '#f44336'}}>*</Text>;

  const addService = async () => {
    if (isResponse) return;
    if (!selectedCategory || !selectedTech || !price) {
      Alert.alert('All the fields are mandatory');
      return;
    }
    try {
      setIsResponse(true);
      const data = {
        price: price,
        category: selectedCategory,
        service_name: selectedTech,
        vendor_id: vendorData._id,
        vendor_name: vendorData.vendor_name,
        shop_name: vendorData.shop_name,
        tech_name: techName,
      };

      const res = await axios.post(
        `${apiUrl.BASEURL}${apiUrl.ADD_TECHNICIAN}`,
        data,
      );
      if (res.status === 200) {
        ToastAndroid.showWithGravity(
          'Technician Added!',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        setSelectedCategory('');
        setSelectedTech('');
        setTechName('');
        setPrice('');
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', error?.response?.data?.message || error.message);
    } finally {
      setIsResponse(false);
    }
  };

  return (
    <ScrollView style={{padding: 15}}>
      <View style={{marginVertical: 5}}>
        <Text style={styles.productLable}>Select Category {asterisk()}</Text>
        <Dropdown
          data={categories.map(item => ({label: item.type, value: item.type}))}
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
      <View style={{marginVertical: 5}}>
        <Text style={styles.productLable}>Select Technician {asterisk()}</Text>
        <Dropdown
          data={technicianType.map(ele => ({label: ele.type, value: ele.type}))}
          labelField="label"
          valueField="value"
          placeholder="Select category"
          value={selectedTech}
          onChange={item => setSelectedTech(item.value)}
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
        <Text style={styles.productLable}>Technician Name {asterisk()}</Text>
        <TextInput
          placeholderTextColor="#757575"
          placeholder="Enter Technician Name"
          style={styles.productInput}
          value={techName}
          onChangeText={pname => setTechName(pname)}
        />
      </View>
      <View>
        <Text style={styles.productLable}>Price/Day {asterisk()}</Text>
        <TextInput
          placeholderTextColor="#757575"
          placeholder="Enter Price/Day ₹"
          keyboardType="numeric"
          style={styles.productInput}
          value={price}
          onChangeText={text => {
            const sanitized = text.replace(/[^0-9]/g, '');
            setPrice(sanitized);
          }}
        />
      </View>
      <View style={{marginVertical: 5, marginTop: 20, marginBottom: 40}}>
        <Button
          loading={isResponse}
          disabled={isResponse}
          mode="contained"
          onPress={addService}
          textColor={THEMECOLOR.textColor}
          style={{
            backgroundColor: isResponse ? '#b6b6b6' : THEMECOLOR.mainColor,
            marginHorizontal: 70,
            fontFamily: 'Montserrat-Medium',
          }}>
          {isResponse ? 'Adding...' : 'Add Technician'}
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  productLable: {
    fontSize: 13,
    color: 'black',
    // letterSpacing: 1,
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
    // letterSpacing: 1,
    // paddingVertical: 15,
  },
});
export default AddEngineer;
