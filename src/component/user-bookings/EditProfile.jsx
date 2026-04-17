import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  StyleSheet,
  TextInput,
  ToastAndroid,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { RadioButton } from 'react-native-paper';
import { apiUrl } from '../../api-services/api-constants';
import axios from 'axios';
import * as ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import THEMECOLOR from '../../utilities/color';
import { useUserContext } from '../../utilities/UserContext';

const sanitizeGST = v => v.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 15);
const sanitizePAN = v => v.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
const sanitizeAadhaar = v => v.replace(/\D/g, '').slice(0, 12);
const sanitizePin = v => v.replace(/\D/g, '').slice(0, 6);
const isValidGSTIN = v =>
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(v);
const isValidPAN = v => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(v);
const isValidAadhaar = v => /^[2-9][0-9]{11}$/.test(v);

export default function EditProfile() {
  const route = useRoute();
  const vendorId = route.params.vendorId;
  const serviceType = route.params.serviceType;
  const isProductVendor = serviceType === 'Vendor & Seller';
  const { setUserDataFromContext } = useUserContext();

  const [isLoading, setIsLoading] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [vendorInfo, setVendorInfo] = useState({
    // read-only basic
    vendorName: '',
    email: '',
    mobileNumber: '',
    professionType: '',
    shopName: '',
    // read-only bank
    bankName: '',
    AcNumber: '',
    AcHolder: '',
    ifsc: '',
    branch: '',
    // editable documents
    gstNumber: '',
    panNumber: '',
    aadhaarNumber: '',
    shopImage: '',
    aadhaarFront: '',
    aadhaarBack: '',
    panFront: '',
    panBack: '',
    // editable product-vendor business
    godownName: '',
    godownPin: '',
    vehicleBy: '',
    vehicleName: '',
    numberPlate: '',
    vehicleImage: '',
    // editable service-vendor business
    experienceInBusiness: '',
    yearOfEstablishment: '',
    websiteUrl: '',
  });

  const getVendorData = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_VENDOR_PROFILE}${vendorId}`,
      );
      if (res.status === 200) {
        const d = res.data;
        setUserDataFromContext(d);
        setVendorInfo({
          vendorName: d.vendor_name || '',
          email: d.email || '',
          mobileNumber: d.mobile_number || '',
          professionType: d.profession || '',
          shopName: d.shop_name || '',
          bankName: d.bank_name || '',
          AcNumber: d.account_number || '',
          AcHolder: d.account_holder_name || '',
          ifsc: d.ifsc_code || '',
          branch: d.bank_branch_name || '',
          gstNumber: d.gst_number || '',
          panNumber: d.pan_number || '',
          aadhaarNumber: d.aadhaar_number || '',
          shopImage: d.shop_image_or_logo || '',
          aadhaarFront: d.aadhaar_front || '',
          aadhaarBack: d.aadhaar_back || '',
          panFront: d.pan_front || '',
          panBack: d.pan_back || '',
          godownName: d.godown_name || '',
          godownPin: d.godown_pin || '',
          vehicleBy: d.vehicle_by || '',
          vehicleName: d.vehicle_name || '',
          numberPlate: d.number_plate || '',
          vehicleImage: d.vehicle_image || '',
          experienceInBusiness: d.experience_in_business || '',
          yearOfEstablishment: d.year_of_establishment || '',
          websiteUrl: d.website_url || '',
        });
      }
    } catch (error) {
      console.log('Error fetching vendor profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getVendorData();
  }, [vendorId]);

  const handleChange = (field, value) => {
    setVendorInfo(prev => ({ ...prev, [field]: value }));
  };

  const resizeImage = async uri => {
    const r = await ImageResizer.createResizedImage(uri, 800, 600, 'JPEG', 80, 0);
    return r.uri;
  };

  const handleImagePick = fieldName => {
    ImagePicker.launchImageLibrary({ noData: true }, async response => {
      if (response.assets) {
        const galleryPic = response.assets[0].uri;
        const resized = await resizeImage(galleryPic);
        handleChange(fieldName, resized);
      }
    });
  };

  const isLocalFile = uri => uri && !uri.startsWith('http');

  const appendImage = (formData, field, uri, fileName) => {
    if (!uri) return;
    if (isLocalFile(uri)) {
      formData.append(field, {
        uri,
        type: 'image/jpeg',
        name: fileName,
      });
    }
  };

  const validate = () => {
    if (!vendorInfo.gstNumber) return 'GST Number is required';
    if (!isValidGSTIN(vendorInfo.gstNumber))
      return 'Please enter a valid 15-character GSTIN';
    if (!vendorInfo.panNumber) return 'PAN Number is required';
    if (!isValidPAN(vendorInfo.panNumber))
      return 'Please enter a valid 10-character PAN';
    if (!vendorInfo.aadhaarNumber) return 'Aadhaar Number is required';
    if (!isValidAadhaar(vendorInfo.aadhaarNumber))
      return 'Please enter a valid 12-digit Aadhaar number';
    if (!vendorInfo.shopImage) return 'Shop image is required';
    if (!vendorInfo.aadhaarFront) return 'Aadhaar front image is required';
    if (!vendorInfo.aadhaarBack) return 'Aadhaar back image is required';
    if (!vendorInfo.panFront) return 'PAN front image is required';
    if (!vendorInfo.panBack) return 'PAN back image is required';

    if (isProductVendor) {
      if (!vendorInfo.godownName) return 'Godown name is required';
      if (!vendorInfo.godownPin) return 'Godown pincode is required';
      if (vendorInfo.godownPin.length !== 6)
        return 'Godown pincode must be 6 digits';
      if (!vendorInfo.vehicleBy) return 'Please select vehicle ownership (Own / Rental)';
      if (!vendorInfo.vehicleName) return 'Vehicle name is required';
      if (!vendorInfo.numberPlate) return 'Number plate is required';
      if (!vendorInfo.vehicleImage) return 'Vehicle image is required';
    } else {
      if (!vendorInfo.experienceInBusiness)
        return 'Experience in business is required';
      if (!vendorInfo.yearOfEstablishment)
        return 'Year of establishment is required';
    }
    return null;
  };

  const handleUpdateVendorDetails = async () => {
    const err = validate();
    if (err) {
      Alert.alert('Error', err);
      return;
    }
    setIsEdited(true);
    try {
      const formData = new FormData();
      formData.append('gst_number', vendorInfo.gstNumber);
      formData.append('pan_number', vendorInfo.panNumber);
      formData.append('aadhaar_number', vendorInfo.aadhaarNumber);

      appendImage(formData, 'shop_image_or_logo', vendorInfo.shopImage, 'shop_image.jpg');
      appendImage(formData, 'aadhaar_front', vendorInfo.aadhaarFront, 'aadhaar_front.jpg');
      appendImage(formData, 'aadhaar_back', vendorInfo.aadhaarBack, 'aadhaar_back.jpg');
      appendImage(formData, 'pan_front', vendorInfo.panFront, 'pan_front.jpg');
      appendImage(formData, 'pan_back', vendorInfo.panBack, 'pan_back.jpg');

      if (isProductVendor) {
        formData.append('godown_name', vendorInfo.godownName);
        formData.append('godown_pin', vendorInfo.godownPin);
        formData.append('vehicle_by', vendorInfo.vehicleBy);
        formData.append('vehicle_name', vendorInfo.vehicleName);
        formData.append('number_plate', vendorInfo.numberPlate);
        appendImage(formData, 'vehicle_image', vendorInfo.vehicleImage, 'vehicle_image.jpg');
      } else {
        formData.append('experience_in_business', vendorInfo.experienceInBusiness);
        formData.append('year_of_establishment', vendorInfo.yearOfEstablishment);
        formData.append('website_url', vendorInfo.websiteUrl || '');
      }

      const response = await axios.put(
        `${apiUrl.BASEURL}${apiUrl.UPDATE_VENDOR_PROFILE}${vendorId}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );

      if (response.status === 200) {
        ToastAndroid.showWithGravity(
          'Profile updated successfully',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        getVendorData();
      }
    } catch (error) {
      console.error('Error updating user:', error);
      Alert.alert('Update Failed', 'An error occurred while updating! Try again');
    } finally {
      setIsEdited(false);
    }
  };

  const ImagePickerTile = ({ label, field }) => (
    <View style={{ flex: 0.33, alignItems: 'center', marginVertical: 6 }}>
      <Text style={styles.tagLabel}>{label}</Text>
      <TouchableOpacity onPress={() => handleImagePick(field)}>
        <Image
          source={
            vendorInfo[field]
              ? { uri: vendorInfo[field] }
              : require('../../../assets/no-image.png')
          }
          style={styles.imageSize}
          resizeMode="cover"
        />
        <Text style={styles.change}>Upload / Change</Text>
      </TouchableOpacity>
    </View>
  );

  const ReadField = ({ label, value, flex = 0.5, side = 'right' }) => (
    <View
      style={{
        flex,
        paddingRight: side === 'right' ? 5 : 0,
        paddingLeft: side === 'left' ? 5 : 0,
      }}>
      <Text style={styles.tagLabel}>{label}</Text>
      <TextInput
        editable={false}
        value={value}
        style={[styles.disabledFields, styles.inputFields]}
      />
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color="#740781" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Basic Details - read only */}
        <Text style={styles.BasicTag}>Basic Details</Text>
        <View style={styles.row}>
          <ReadField label="Vendor Name" value={vendorInfo.vendorName} side="right" />
          <ReadField label="Email" value={vendorInfo.email} side="left" />
        </View>
        <View style={styles.row}>
          <ReadField label="Mobile Number" value={vendorInfo.mobileNumber} side="right" />
          <ReadField label="Profession" value={vendorInfo.professionType} side="left" />
        </View>
        <View style={styles.row}>
          <ReadField label="Shop Name" value={vendorInfo.shopName} side="right" />
        </View>

        {/* Bank Details - read only */}
        <Text style={styles.BasicTag}>Bank Details</Text>
        <View style={styles.row}>
          <ReadField label="Bank Name" value={vendorInfo.bankName} side="right" />
          <ReadField label="Account Holder" value={vendorInfo.AcHolder} side="left" />
        </View>
        <View style={styles.row}>
          <ReadField label="Account Number" value={vendorInfo.AcNumber} side="right" />
          <ReadField label="Bank IFSC" value={vendorInfo.ifsc} side="left" />
        </View>
        <View style={styles.row}>
          <ReadField label="Bank Branch" value={vendorInfo.branch} side="right" />
        </View>

        {/* Documents - editable */}
        <Text style={styles.BasicTag}>Documents</Text>
        <View style={styles.row}>
          <View style={{ flex: 0.5, paddingRight: 5 }}>
            <Text style={styles.tagLabel}>GST Number</Text>
            <TextInput
              value={vendorInfo.gstNumber}
              autoCapitalize="characters"
              maxLength={15}
              style={[styles.editableFields, styles.inputFields]}
              onChangeText={t => handleChange('gstNumber', sanitizeGST(t))}
            />
          </View>
          <View style={{ flex: 0.5, paddingLeft: 5 }}>
            <Text style={styles.tagLabel}>PAN Number</Text>
            <TextInput
              value={vendorInfo.panNumber}
              autoCapitalize="characters"
              maxLength={10}
              style={[styles.editableFields, styles.inputFields]}
              onChangeText={t => handleChange('panNumber', sanitizePAN(t))}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={{ flex: 0.5, paddingRight: 5 }}>
            <Text style={styles.tagLabel}>Aadhaar Number</Text>
            <TextInput
              value={vendorInfo.aadhaarNumber}
              keyboardType="number-pad"
              maxLength={12}
              style={[styles.editableFields, styles.inputFields]}
              onChangeText={t => handleChange('aadhaarNumber', sanitizeAadhaar(t))}
            />
          </View>
        </View>

        {/* Document Images */}
        <View style={styles.row}>
          <ImagePickerTile label="Shop Image" field="shopImage" />
          <ImagePickerTile label="Aadhaar Front" field="aadhaarFront" />
          <ImagePickerTile label="Aadhaar Back" field="aadhaarBack" />
        </View>
        <View style={styles.row}>
          <ImagePickerTile label="PAN Front" field="panFront" />
          <ImagePickerTile label="PAN Back" field="panBack" />
          {isProductVendor && <ImagePickerTile label="Vehicle Image" field="vehicleImage" />}
        </View>

        {/* Business Details - profile-specific */}
        {isProductVendor ? (
          <>
            <Text style={styles.BasicTag}>Business & Vehicle</Text>
            <View style={styles.row}>
              <View style={{ flex: 0.5, paddingRight: 5 }}>
                <Text style={styles.tagLabel}>Godown Name</Text>
                <TextInput
                  value={vendorInfo.godownName}
                  style={[styles.editableFields, styles.inputFields]}
                  onChangeText={t => handleChange('godownName', t)}
                />
              </View>
              <View style={{ flex: 0.5, paddingLeft: 5 }}>
                <Text style={styles.tagLabel}>Godown Pincode</Text>
                <TextInput
                  value={vendorInfo.godownPin}
                  keyboardType="number-pad"
                  maxLength={6}
                  style={[styles.editableFields, styles.inputFields]}
                  onChangeText={t => handleChange('godownPin', sanitizePin(t))}
                />
              </View>
            </View>
            <Text style={styles.tagLabel}>Vehicle Ownership</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
              <RadioButton
                value="own"
                status={vendorInfo.vehicleBy === 'own' ? 'checked' : 'unchecked'}
                onPress={() => handleChange('vehicleBy', 'own')}
              />
              <Text style={styles.radioText}>Own</Text>
              <RadioButton
                value="rental"
                status={vendorInfo.vehicleBy === 'rental' ? 'checked' : 'unchecked'}
                onPress={() => handleChange('vehicleBy', 'rental')}
              />
              <Text style={styles.radioText}>Rental</Text>
            </View>
            <View style={styles.row}>
              <View style={{ flex: 0.5, paddingRight: 5 }}>
                <Text style={styles.tagLabel}>Vehicle Name</Text>
                <TextInput
                  value={vendorInfo.vehicleName}
                  style={[styles.editableFields, styles.inputFields]}
                  onChangeText={t => handleChange('vehicleName', t)}
                />
              </View>
              <View style={{ flex: 0.5, paddingLeft: 5 }}>
                <Text style={styles.tagLabel}>Number Plate</Text>
                <TextInput
                  value={vendorInfo.numberPlate}
                  autoCapitalize="characters"
                  style={[styles.editableFields, styles.inputFields]}
                  onChangeText={t => handleChange('numberPlate', t.toUpperCase())}
                />
              </View>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.BasicTag}>Business Details</Text>
            <View style={styles.row}>
              <View style={{ flex: 0.5, paddingRight: 5 }}>
                <Text style={styles.tagLabel}>Experience (years)</Text>
                <TextInput
                  value={vendorInfo.experienceInBusiness}
                  keyboardType="number-pad"
                  style={[styles.editableFields, styles.inputFields]}
                  onChangeText={t => handleChange('experienceInBusiness', t.replace(/\D/g, ''))}
                />
              </View>
              <View style={{ flex: 0.5, paddingLeft: 5 }}>
                <Text style={styles.tagLabel}>Year of Establishment</Text>
                <TextInput
                  value={vendorInfo.yearOfEstablishment}
                  keyboardType="number-pad"
                  maxLength={4}
                  style={[styles.editableFields, styles.inputFields]}
                  onChangeText={t => handleChange('yearOfEstablishment', t.replace(/\D/g, ''))}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.tagLabel}>Website URL (optional)</Text>
                <TextInput
                  value={vendorInfo.websiteUrl}
                  autoCapitalize="none"
                  keyboardType="url"
                  style={[styles.editableFields, styles.inputFields]}
                  onChangeText={t => handleChange('websiteUrl', t)}
                />
              </View>
            </View>
          </>
        )}

        <TouchableOpacity
          disabled={isEdited}
          onPress={handleUpdateVendorDetails}
          style={[styles.updateBtn, isEdited && { backgroundColor: '#b6b6b6' }]}>
          {isEdited ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.updateText}>Update Details</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    zIndex: 999,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  BasicTag: {
    color: '#333',
    fontFamily: 'Montserrat-SemiBold',
    marginTop: 10,
    marginBottom: 10,
    fontSize: 15,
  },
  tagLabel: { color: '#333', fontFamily: 'Montserrat-Medium', marginBottom: 6 },
  inputFields: {
    fontFamily: 'Montserrat-Medium',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: 'black',
    borderWidth: 1,
  },
  disabledFields: { borderColor: '#dfdfdf', backgroundColor: '#dfdfdf' },
  editableFields: { borderColor: '#ececec', backgroundColor: '#ffffff' },
  radioText: {
    color: 'black',
    marginRight: 15,
    fontFamily: 'Montserrat-Medium',
    fontSize: 13,
  },
  imageSize: {
    width: 90,
    height: 90,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  change: {
    color: 'black',
    fontSize: 12,
    marginTop: 5,
    fontFamily: 'Montserrat-Medium',
    backgroundColor: '#d4d4d4',
    paddingHorizontal: 5,
    paddingVertical: 4,
    borderRadius: 5,
    textAlign: 'center',
  },
  updateBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
    backgroundColor: THEMECOLOR.mainColor,
    paddingVertical: 12,
    borderRadius: 5,
  },
  updateText: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'Montserrat-SemiBold',
  },
});
