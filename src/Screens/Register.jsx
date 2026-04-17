import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  useColorScheme,
  Image,
} from 'react-native';
import React, { useEffect, useState } from 'react';
// import {Checkbox} from 'react-native-paper';
import THEMECOLOR from '../utilities/color';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiUrl } from '../api-services/api-constants';
import { useNavigation } from '@react-navigation/native';

export default function Register() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profession, setProfession] = useState('');
  const [selectedServiceCategory, setSelectedServiceCategory] = useState('');
  const [findServiceCategory, setFindServiceCategory] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [serviceCategoryList, setServiceCategoryList] = useState([]);
  const [serviceName, setServiceName] = useState('');
  const [vendorData, setVendorData] = useState({});
  const [bankName, setBankName] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankIFSC, setBankIFSC] = useState('');
  const [bankBranch, setBankBranch] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const colorScheme = useColorScheme();

  const asterisk = () => <Text style={{ color: '#f44336' }}>*</Text>;

  function isValid_IFSC_Code(ifsc_Code) {
    let regex = new RegExp(/^[A-Z]{4}0[A-Z0-9]{6}$/);
    if (ifsc_Code == null) {
      return false;
    }
    if (regex.test(ifsc_Code)) {
      if (typeof setBankIFSC === 'function') {
        setBankIFSC(ifsc_Code);
      }
      return true;
    } else {
      return false;
    }
  }

  const textFieldSanitized = val => {
    return val.replace(/[^a-zA-Z ]/g, '');
  };
  const numericFieldSanitized = val => {
    return val.replace(/[^0-9]/g, '')
  }

  const passwordValidation = password => {
    const minLength = 8;
    const maxLength = 16;
    const hasSpecialChar = /[^A-Za-z]/.test(password); // true if at least one non-letter (special character)
    // const hasDigit = /\d/.test(password);              // true if contains any digit
    // const onlyAlphaAndSpecial = /^[^0-9]+$/.test(password); // false if contains any digit

    // Check length
    if (password.length < minLength || password.length > maxLength) {
      return 'Password must be between 8 and 16 characters.';
    }
    // // Check for digits
    // if (hasDigit) {
    //   return 'Password must not contain numbers.';
    // }
    // Check for at least one special character
    if (!hasSpecialChar) {
      return 'Password must contain at least one special character.';
    }
    // All validations passed
    return '';
  };

  console.log('bankIFSC', bankIFSC);

  const fetchData = async () => {
    try {
      const serviceRes = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_ALL_SERVICE}`,
      );
      if (serviceRes.status === 200) {
        setServiceList(serviceRes.data.data);
      }
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
    fetchData();
  }, []);

  useEffect(() => {
    if (profession) {
      const filteredCategories = serviceCategoryList.filter(
        item => item.service_name === profession,
      );
      setFindServiceCategory(filteredCategories);
    }
  }, [profession, serviceCategoryList]);

  const handleSubmit = async () => {
    // if (
    //   !name ||
    //   !mobileNumber ||
    //   !profession ||
    //   !email ||
    //   !password ||
    //   !bankName ||
    //   !accountHolderName ||
    //   !accountNumber ||
    //   !bankIFSC ||
    //   !bankBranch
    // ) {
    //   Alert.alert('Error', 'Please fill all fields');
    //   return;
    // }
    if (!name) {
      Alert.alert('Error', 'Name Number is required');
      return;
    }
    if (!mobileNumber) {
      Alert.alert('Error', 'Mobile Number is required');
      return;
    }
    if (!/^\d{10}$/.test(mobileNumber)) {
      setError('Mobile number should be 10 digits');
      // Alert.alert('Error', 'Mobile number should be exactly 10 digits');
      return;
    }
    if (!profession) {
      Alert.alert('Error', 'Select Profession is required');
      return;
    }
    if (!password) {
      Alert.alert('Error', 'Password is required');
      return;
    }
    if (!password || password.length < 8) {
      Alert.alert('Error', 'Password should be at least 8 characters');
      return;
    }
    const passwordError = passwordValidation(password);
    if (passwordError) {
      Alert.alert('Error', passwordError);
      return;
    }
    if (!bankName) {
      Alert.alert('Error', 'Bank Name is required');
      return;
    }
    if (!accountHolderName) {
      Alert.alert('Error', 'Account Holder Name is required');
      return;
    }
    if (!accountNumber) {
      Alert.alert('Error', 'Account Number is required');
      return;
    }
    if (!bankIFSC) {
      Alert.alert('Error', 'IFSC Code is required');
      return;
    }
    if (!bankBranch) {
      Alert.alert('Error', 'Branch Name is Missing');
      return;
    }
    if (!isValid_IFSC_Code(bankIFSC)) {
      // setError('Please enter a valid IFSC code');
      Alert.alert('Error', 'Please enter a valid IFSC code');
      return;
    }

    setLoading(true);
    try {
      const config = {
        url: apiUrl.VENDOR_REGISTER,
        method: 'post',
        baseURL: apiUrl.BASEURL,
        headers: { 'Content-Type': 'application/json' },
        data: {
          vendor_name: name,
          mobile_number: mobileNumber,
          profession: profession,
          // profession_category: selectedServiceCategory,
          email: email,
          password: password,
          bank_name: bankName,
          account_holder_name: accountHolderName,
          account_number: accountNumber,
          ifsc_code: bankIFSC,
          bank_branch_name: bankBranch,
          profession_type:
            profession === 'Vendor & Seller' ? 'product_user' : 'service_user',
        },
      };
      const response = await axios(config);
      if (response.status === 200) {
        console.log('New Vendor Data:', response.data.newVendor);
        Alert.alert(
          'Success',
          response.data.message || 'Registration Completed successfully',
        );
        setVendorData(response.data.newVendor);
        const service = response.data.newVendor
          ? response.data.newVendor.profession
          : '';
        // console.log('serviceName', service);

        // if (response.data.newVendor.profession === 'Vendor & Seller') {
        //   navigation.navigate('AddShopDetails', {
        //     vendorData: response.data.newVendor,
        //   });
        // }
        // vendor seller
        if (service === 'Vendor & Seller') {
          navigation.navigate('AddShopDetails', {
            vendorData: response.data.newVendor,
          });
        } else {
          setServiceName(service);
          await fetchServerRes();
        }
      }
    } catch (error) {
      console.log('Unknown error:', error);
      if (error.response && error.response.data) {
        Alert.alert('Error', error.response.data.message);
      } else {
        Alert.alert('Error', 'An unknown error occurred');
      }
    } finally {
      setLoading(false); // Re-enable the button after the API call completes
    }
  };

  // useEffect(() => {
  //   console.log('Current serviceName in useEffect:', serviceName);
  //   if (serviceName && serviceName !== 'Vendor & Seller' && !hasNavigated) {
  //     fetchServerRes();
  //   }
  // }, [serviceName]);

  const fetchServerRes = async () => {
    try {
      // if (!serviceName) {
      //   console.log('Error: serviceName is undefined');
      //   return;
      // }
      const res = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_SERVICE_BY_SERVICENAME}/${serviceName}`,
      );
      if (res.status === 200) {
        const service = res.data.service;
        // service
        navigation.navigate('BusinessDetails', {
          serverResponse: service,
          vendorData: vendorData,
        });
        // setHasNavigated(true); // Prevent further navigation
        // else {
        //   await AsyncStorage.setItem('vendor', JSON.stringify(vendorData));
        //   navigation.navigate('AdditionalDetails', {
        //     vendorData: vendorData,
        //   });
        //   // navigation.navigate('Waiting');
        //   // setHasNavigated(true); // Prevent further navigation
        // }
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };
  useEffect(() => {
    if (serviceName && serviceName !== 'Vendor & Seller') {
      fetchServerRes();
    }
  }, [serviceName]);

  console.log('serviceName', serviceName);

  // const handleOTP = () => {
  //   // alert('Registration successful! Please login');
  //   navigation.navigate('AddShopDetails', {number: mobileNumber});
  // };

  return (
    <View style={{ padding: 15, backgroundColor: 'white', height: '100%' }}>
      <ScrollView>
        <View>
          <Image
            source={require('../../assets/nithyaevent-round-2.jpeg')}
            style={{
              width: 210,
              height: 200,
              alignSelf: 'center',
            }}
            resizeMode="contain"
          />
          <Text
            style={{
              fontSize: 25,
              color: 'black',
              marginBottom: 10,
              textAlign: 'center',
              marginTop: 10,
              fontFamily: 'Montserrat-SemiBold',
            }}>
            Join Nithya Vendor Hub!
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: 'black',
              textAlign: 'center',
              marginBottom: 20,
              fontFamily: 'Montserrat-Medium',
              // letterSpacing: 1,
              //   fontWeight: '400',
            }}>
            Sign up to showcase your equipment, connect with event organizers,
            and grow your business effortlessly.
          </Text>
          <Text
            style={{
              color: 'black',
              fontSize: 14,
              marginBottom: 5,
              fontFamily: 'Montserrat-SemiBold',
              // letterSpacing: 1,
            }}>
            Name {asterisk()}
          </Text>
          <TextInput
            placeholderTextColor="#757575"
            placeholder="Enter name"
            value={name}
            onChangeText={val => {
              setName(textFieldSanitized(val));
            }}
            style={{
              borderWidth: 1,
              borderColor: '#d5d5d5',
              color: 'black',
              fontSize: 14,
              borderRadius: 10,
              paddingLeft: 15,
              backgroundColor: 'white',
              marginBottom: 10,
              fontFamily: 'Montserrat-Medium',
              // letterSpacing: 1,
            }}
          />
          <Text
            style={{
              color: 'black',
              fontSize: 14,
              marginBottom: 5,
              fontFamily: 'Montserrat-SemiBold',
            }}>
            Profession {asterisk()}
          </Text>
          <Dropdown
            data={serviceList.map(item => ({
              label: item.service_name,
              value: item.service_name,
            }))}
            labelField="label"
            valueField="value"
            placeholder="Select Profession"
            value={profession}
            onChange={item => setProfession(item.value)}
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
          {/* <Text
            style={{
              color: 'black',
              fontSize: 14,
              marginBottom: 5,
              fontFamily: 'Montserrat-Medium',
            }}>
            Category
          </Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: '#d5d5d5',
              // height: 55,
              borderRadius: 10,
              marginBottom: 10,
              paddingHorizontal: 5,
            }}>
            <Picker
              // Use board.category
              // itemStyle={{backgroundColor: 'white'}}
              style={{color: 'black'}}
              selectedValue={selectedServiceCategory}
              onValueChange={
                cteItem => setSelectedServiceCategory(cteItem) // Pass the index and new value
              }>
              <Picker.Item
                label="Select Category"
                value=""
                style={{
                  // color: 'black',
                  fontSize: 14,
                  fontFamily: 'Montserrat-Regular',
                }}
              />
              {findServiceCategory.map((item, index) => (
                <Picker.Item
                  key={index}
                  label={item.sub_service_name}
                  value={item.sub_service_name}
                  style={{
                    // color: 'black',
                    fontSize: 14,
                    // backgroundColor: 'white',
                    fontFamily: 'Montserrat-Regular',
                    // letterSpacing: 1,
                  }}
                />
              ))}
            </Picker>
          </View> */}
          <Text
            style={{
              color: 'black',
              fontSize: 14,
              fontFamily: 'Montserrat-SemiBold',
              marginBottom: 5,
            }}>
            Phone number {asterisk()}
          </Text>
          <TextInput
            placeholderTextColor="#757575"
            placeholder="Enter phone number"
            value={mobileNumber}
            maxLength={10}
            onChangeText={val => {
              setMobileNumber(numericFieldSanitized(val));
            }}
            keyboardType="number-pad"
            style={{
              borderWidth: 1,
              borderColor: '#d5d5d5',
              color: 'black',
              fontSize: 14,
              borderRadius: 10,
              paddingLeft: 15,
              backgroundColor: 'white',
              marginBottom: 15,
              fontFamily: 'Montserrat-Medium',
            }}
          />
          {error && (
            <Text
              style={{
                color: '#f44336',
                fontSize: 11,
                fontFamily: 'Montserrat-Medium',
                marginBottom: 15,
              }}>
              {error}
            </Text>
          )}
          <Text
            style={{
              color: 'black',
              fontSize: 14,
              fontFamily: 'Montserrat-SemiBold',
              // letterSpacing: 1,
              marginBottom: 5,
            }}>
            Email id {asterisk()}
          </Text>
          <TextInput
            placeholderTextColor="#757575"
            placeholder="Enter email id"
            value={email}
            onChangeText={val => setEmail(val.toLowerCase())}
            keyboardType="email-address"
            style={{
              borderWidth: 1,
              borderColor: '#d5d5d5',
              color: 'black',
              fontSize: 14,
              borderRadius: 10,
              paddingLeft: 15,
              backgroundColor: 'white',
              marginBottom: 15,
              fontFamily: 'Montserrat-Medium',
            }}
          />
          <Text
            style={{
              color: 'black',
              fontSize: 14,
              fontFamily: 'Montserrat-SemiBold',
              // letterSpacing: 1,
              marginBottom: 5,
            }}>
            Password {asterisk()}
          </Text>
          <TextInput
            placeholderTextColor="#757575"
            placeholder="Enter password"
            value={password}
            onChangeText={val => {
              // const sanitized = val.replace(/[0-9]/g, '');
              setPassword(val);
              const error = passwordValidation(val);
              setPasswordError(error);
            }}
            maxLength={16}
            style={{
              borderWidth: 1,
              borderColor: '#d5d5d5',
              color: 'black',
              fontSize: 14,
              borderRadius: 10,
              paddingLeft: 15,
              backgroundColor: 'white',
              marginBottom: 15,
              fontFamily: 'Montserrat-Medium',
            }}
          />
          {passwordError ? (
            <Text style={{ color: 'red', fontSize: 11, marginBottom: 10, fontFamily: 'Montserrat-Medium', }}>
              {passwordError}</Text>
          ) : null}
          <Text
            style={{
              color: 'black',
              fontSize: 15,
              fontFamily: 'Montserrat-SemiBold',
              // letterSpacing: 1,
              marginTop: 5,
              marginBottom: 10,
            }}>
            Add Your Bank Details {asterisk()}
          </Text>
          <Text
            style={{
              color: 'black',
              fontSize: 14,
              marginBottom: 5,
              fontFamily: 'Montserrat-SemiBold',
            }}>
            Bank Name
          </Text>
          <TextInput
            placeholderTextColor="#757575"
            placeholder="Bank Name"
            value={bankName}
            onChangeText={val => setBankName(textFieldSanitized(val))}
            style={{
              borderWidth: 1,
              borderColor: '#d5d5d5',
              color: 'black',
              fontSize: 14,
              borderRadius: 10,
              paddingLeft: 15,
              backgroundColor: 'white',
              marginBottom: 15,
              fontFamily: 'Montserrat-Medium',
            }}
          />
          <Text
            style={{
              color: 'black',
              fontSize: 14,
              marginBottom: 5,
              fontFamily: 'Montserrat-SemiBold',
            }}>
            Account Holder Name
          </Text>
          <TextInput
            placeholderTextColor="#757575"
            placeholder="Bank Account Holder Name"
            value={accountHolderName}
            onChangeText={val => setAccountHolderName(textFieldSanitized(val))}
            style={{
              borderWidth: 1,
              borderColor: '#d5d5d5',
              color: 'black',
              fontSize: 14,
              borderRadius: 10,
              paddingLeft: 15,
              backgroundColor: 'white',
              marginBottom: 15,
              fontFamily: 'Montserrat-Medium',
            }}
          />
          <Text
            style={{
              color: 'black',
              fontSize: 14,
              marginBottom: 5,
              fontFamily: 'Montserrat-SemiBold',
            }}>
            Account Number
          </Text>
          <TextInput
            placeholderTextColor="#757575"
            placeholder="Bank Account Number"
            value={accountNumber}
            keyboardType="numeric"
            onChangeText={val => {
              const sanitized = val.replace(/[^0-9]/g, '');
              setAccountNumber(sanitized);
            }}
            // onChangeText={val => (val)}
            style={{
              borderWidth: 1,
              borderColor: '#d5d5d5',
              color: 'black',
              fontSize: 14,
              borderRadius: 10,
              paddingLeft: 15,
              backgroundColor: 'white',
              marginBottom: 15,
              fontFamily: 'Montserrat-Medium',
            }}
          />
          <Text
            style={{
              color: 'black',
              fontSize: 14,
              marginBottom: 5,
              fontFamily: 'Montserrat-SemiBold',
            }}>
            Bank IFSC Code
          </Text>
          <TextInput
            placeholderTextColor="#757575"
            placeholder="Bank IFSC Code"
            value={bankIFSC}
            autoCapitalize="characters"
            maxLength={11}
            onChangeText={val => {
              // Keep only letters and numbers, force uppercase
              const sanitized = val.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
              setBankIFSC(sanitized);
            }}
            style={{
              borderWidth: 1,
              borderColor: '#d5d5d5',
              color: 'black',
              fontSize: 14,
              borderRadius: 10,
              paddingLeft: 15,
              backgroundColor: 'white',
              marginBottom: 15,
              fontFamily: 'Montserrat-Medium',
            }}
          />
          <Text
            style={{
              color: 'black',
              fontSize: 14,
              marginBottom: 5,
              fontFamily: 'Montserrat-SemiBold',
            }}>
            Bank Branch Name
          </Text>
          <TextInput
            placeholderTextColor="#757575"
            placeholder="Bank Branch"
            value={bankBranch}
            onChangeText={val => setBankBranch(textFieldSanitized(val))}
            style={{
              borderWidth: 1,
              borderColor: '#d5d5d5',
              color: 'black',
              fontSize: 14,
              borderRadius: 10,
              paddingLeft: 15,
              backgroundColor: 'white',
              marginBottom: 15,
              fontFamily: 'Montserrat-Medium',
            }}
          />
          {/* <Text
        style={{
          color: THEMECOLOR.helperTextGray,
          fontSize: 16,
          marginBottom: 5,
          textAlign: 'center',
        }}>
        You will get OTP on this number
      </Text> */}
          <TouchableOpacity
            style={{
              backgroundColor: THEMECOLOR.mainColor,
              paddingVertical: 10,
              borderRadius: 10,
              elevation: 3,
              marginHorizontal: 50,
            }}
            onPress={!loading ? handleSubmit : null}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text
                style={{
                  color: THEMECOLOR.textColor,
                  fontSize: 14,
                  textAlign: 'center',
                  fontFamily: 'Montserrat-Medium',
                }}>
                Add Bussiness Details{' '}
                <AntDesign name="arrowright" size={14} color="white" />
              </Text>
            )}
          </TouchableOpacity>
          {/* <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 15,
        }}>
        <Checkbox
          status={checked ? 'checked' : 'unchecked'}
          onPress={() => {
            setChecked(!checked);
          }}
        />

        <Text
          style={{
            color: 'black',
            fontSize: 12,
            fontFamily: 'Montserrat-Regular',
            marginLeft: 10,
          }}>
          By sign up, you are agree out terms of condition{' '}
        </Text>
      </View> */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 15,
            }}>
            <Text
              style={{
                color: 'black',
                fontSize: 13,
                fontFamily: 'Montserrat-Medium',
              }}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Login');
              }}>
              <Text
                style={{
                  color: THEMECOLOR.mainColor,
                  fontSize: 13,
                  fontFamily: 'Montserrat-Medium',
                }}>
                Sign in
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
