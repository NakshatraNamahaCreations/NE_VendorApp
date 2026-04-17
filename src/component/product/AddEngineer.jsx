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
import {Picker} from '@react-native-picker/picker';
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
        <View
          style={{
            borderWidth: 1,
            borderColor: '#d5d5d5',
            // height: 55,
            borderRadius: 10,
            // marginBottom: 10,
          }}>
          <Picker
            // Use board.category
            selectedValue={selectedCategory}
            style={{color: 'black'}}
            onValueChange={
              cteItem => setSelectedCategory(cteItem) // Pass the index and new value
            }>
            <Picker.Item
              label="Select category"
              value=""
              style={{
                color: deviceTheme === 'dark' ? 'white' : 'black',
                fontSize: 13,
                fontFamily: 'Montserrat-Regular',
                // letterSpacing: 1,
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
                  // letterSpacing: 1,
                }}
              />
            ))}
          </Picker>
        </View>
      </View>
      <View style={{marginVertical: 5}}>
        <Text style={styles.productLable}>Select Technician {asterisk()}</Text>
        <View
          style={{
            borderWidth: 1,
            borderColor: '#d5d5d5',
            // height: 55,
            borderRadius: 10,
            // marginBottom: 10,
          }}>
          <Picker
            // Use board.category
            selectedValue={selectedTech}
            style={{color: 'black'}}
            onValueChange={cteItem => setSelectedTech(cteItem)}>
            <Picker.Item
              label="Select category"
              value=""
              style={{
                color: deviceTheme === 'dark' ? 'white' : 'black',
                fontSize: 13,
                fontFamily: 'Montserrat-Regular',
              }}
            />
            {technicianType.map((ele, index) => (
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
