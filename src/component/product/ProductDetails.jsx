
import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Dimensions,
  Linking,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import THEMECOLOR from '../../utilities/color';
import Video from 'react-native-video';
import axios from 'axios';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import {
  addToCart,
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
} from '../../state_management/cartSlice';
import { Badge } from 'react-native-paper';
import { apiUrl } from '../../api-services/api-constants';
import ProductTab from './ProductTab';

const { width } = Dimensions.get('window');
const MEDIA_HEIGHT = 300;
const isVideoUri = uri =>
  typeof uri === 'string' && /\.(mp4|mov|m4v|webm)(\?|$)/i.test(uri);

// function ProductDetails({selectedProduct, closeModal}) {
function ProductDetails({ route }) {
  const product = route.params.item;
  console.log('product>>>>>', product);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart);
  // console.log('cart in product detailed >>>>>>', cart);
  const flatListRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [relevantProducts, setRelevantProducts] = useState([]);
  const [reviews, setReviews] = useState(product?.Reviews);

  const navigateToSearch = () => {
    navigation.navigate('Search');
  };

  useEffect(() => {
    fetchData();
  }, [route.params.item]);

  useEffect(() => {
    refreshReviews();
  }, []);
  const fetchData = async () => {
    setLoading(true);
    try {
      let res = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_SELLING_PRODUCTS}`,
      );
      if (res.status === 200) {
        // Log the current product ID and all products
        // console.log('Current Product ID:', product._id);
        // console.log('All Products:', res.data.allSellProduct);

        // Filter the products
        const filteringRelevant = res.data.allSellProduct.filter(item => {
          // console.log('Checking item ID:', item._id);
          return (
            item.product_category === product.product_category &&
            String(item._id) !== String(product._id) // Ensure this comparison is correct
          );
        });

        // console.log('Filtered Relevant Products:', filteringRelevant);
        setRelevantProducts(filteringRelevant);
      }
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshReviews = async () => {
    try {
      const response = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_REVIEW}${product._id}`,
      );
      setReviews(response.data.reviews);
    } catch (error) {
      console.error(error);
    }
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.ratings, 0) /
      reviews.length
      : 0;



  console.log('product status', product.approval_status);

  const mediaList = [
    ...(product.product_image || []),
    ...(product.product_video ? [product.product_video] : []),
  ];

  const [mediaIndex, setMediaIndex] = useState(0);

  const handleScroll = e => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
    setMediaIndex(idx);
  };

  return (
    <View style={{ backgroundColor: 'white', height: '100%' }}>
      {/* <TouchableOpacity
          style={{
            position: 'relative',
            top: -20,
          }}
          onPress={closeModal}>
          <AntDesign
            name="closecircle"
            size={35}
            color="white"
            style={{textAlign: 'center'}}
          />
        </TouchableOpacity> */}
      <View
        style={{
          flexDirection: 'row',
          paddingTop: 10,
          alignItems: 'center',
          backgroundColor: 'white',
          elevation: 4,
          paddingBottom: 10,
          borderBottomColor: '#e5e5e5',
          borderBottomWidth: 1,
          justifyContent: 'space-between',
          paddingHorizontal: 15,
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back"
            color="black"
            size={19}
            style={{
              backgroundColor: '#f5f5f5',
              width: 40,
              height: 40,
              textAlign: 'center',
              paddingTop: 10,
              borderRadius: 50,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        </TouchableOpacity>
        <View
          style={{ paddingLeft: 20, flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={navigateToSearch}>
            <AntDesign
              name="search1"
              color={THEMECOLOR.textColor}
              size={23}
              style={{ marginHorizontal: 5 }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
            <AntDesign
              name="shoppingcart"
              size={23}
              color={THEMECOLOR.textColor}
              style={{ marginHorizontal: 5 }}
            />
          </TouchableOpacity>
        </View>

      </View>
      <ScrollView>
        {/* <View style={{ paddingHorizontal: 10 }}> */}
        <View style={{ width, height: MEDIA_HEIGHT, backgroundColor: '#fafafa' }}>
          {mediaList.length > 0 ? (
            <FlatList
              ref={flatListRef}
              data={mediaList}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, idx) => `media-${idx}`}
              renderItem={({ item, index }) => (
                <View style={styles.mediaSlide}>
                  {isVideoUri(item) ? (
                    <Video
                      source={{ uri: item }}
                      style={styles.mainMedia}
                      controls={true}
                      resizeMode="contain"
                      paused={index !== mediaIndex}
                      muted={false}
                    />
                  ) : (
                    <Image
                      source={{ uri: item }}
                      style={styles.mainMedia}
                      resizeMode="contain"
                    />
                  )}
                </View>
              )}
              onMomentumScrollEnd={handleScroll}
            />
          ) : (
            <View style={styles.mediaSlide}>
              <Text style={{ color: '#999' }}>No media</Text>
            </View>
          )}
          {mediaList.length > 1 && (
            <View style={styles.dotsWrap}>
              {mediaList.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    i === mediaIndex && styles.dotActive,
                  ]}
                />
              ))}
            </View>
          )}
        </View>
        <View style={{
          marginBottom: 10,
          padding: 10,
        }}>
          <Text
            style={{
              fontSize: 10,
              color: '#0a6fe8',
              // letterSpacing: 1,
              fontFamily: 'Montserrat-Medium',
              marginBottom: 2,
            }}>
            {product.brand}
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: 'black',
              fontFamily: 'Montserrat-Bold',
            }}>
            {product.product_name}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View
              style={{
                backgroundColor: '#fff9ce',
                flexDirection: 'row',
                borderRadius: 6,
                paddingVertical: 2,
                paddingHorizontal: 4,
              }}>
              <Text
                style={{
                  fontSize: 12,
                  color: 'black',
                  fontFamily: 'Montserrat-Medium',
                }}>
                {averageRating}
              </Text>
              <AntDesign
                name="star"
                size={12}
                color="#fdd663"
                style={{ marginLeft: 3, marginTop: 2 }}
              />
            </View>
            <View>
              <Text
                style={{
                  fontSize: 12,
                  color: 'black',
                  marginLeft: 3,
                  fontFamily: 'Montserrat-Medium',
                }}>
                {' '}
                {/* {Math.round(averageRating)}  */}
                {reviews.length > 0 ? reviews.length : 0} rating
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginVertical: 8,
            }}>
            <View>
              <Text
                style={{
                  fontSize: 18,
                  color: 'black',
                  fontFamily: 'Montserrat-Bold',
                }}>
                ₹ {product.product_price}/day
              </Text>
            </View>
            <View style={{ marginLeft: 5, marginTop: 7 }}>
              <Text
                style={{
                  fontSize: 10,
                  color: 'black',
                  fontFamily: 'Montserrat-Medium',
                  textDecorationLine: 'line-through',
                }}>
                {' '}
                ₹ {product.mrp_rate}
              </Text>
            </View>
            <View style={{ marginLeft: 5, marginTop: 7 }}>
              <Text
                style={{
                  fontSize: 10,
                  color: '#CC0C39',
                  // letterSpacing: 1,
                  fontFamily: 'Montserrat-Medium',
                }}>
                {' '}
                {product.discount ? product.discount + '%' + ' OFF' : ''}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row' }}>
          </View>

          <ProductTab product={product} />
          <View style={{ marginTop: 10, borderWidth: .5, padding: 5, borderRadius: 5 }}>
            <View  >
              <Text
                style={{
                  color: '#2c2c2c',
                  fontSize: 15,
                  fontFamily: 'Montserrat-SemiBold',
                }}>
                Product Status
              </Text>
              <Text
                style={{
                  color:
                    product.approval_status === 'Under Review'
                      ? 'orange'
                      : product.approval_status === 'Approved'
                        ? 'green'
                        : '#e91e63',
                  fontSize: 13,
                  fontFamily: 'Montserrat-SemiBold',
                  // marginTop: 5,
                }}>
                {product.approval_status}
              </Text>
              {product.approval_status === "Disapproved" && (
                <View style={{ marginTop: 10 }} >
                  <Text
                    style={{
                      color: '#2c2c2c',
                      fontSize: 15,
                      fontFamily: 'Montserrat-SemiBold',
                    }}>
                    Reason For Not Approval
                  </Text>
                  <Text
                    style={{
                      color: 'red',
                      fontSize: 13,
                      fontFamily: 'Montserrat-Medium',
                      // marginTop: 5,
                    }}>
                    {product.reason_for_disapprove}
                  </Text>
                </View>
              )}
            </View>
          </View>
          <View style={{ marginTop: 20 }}>
            <Text
              style={{
                color: '#2c2c2c',
                fontSize: 15,
                fontFamily: 'Montserrat-SemiBold',
                marginBottom: 10,
                // letterSpacing: 1,
              }}>
              Customer Reviews
            </Text>
            {reviews.length > 0 ? (
              <>
                {reviews.map((ratingItem, index) => (
                  <View key={index}>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginVertical: 10,
                        alignItems: 'center',
                      }}>
                      <View>
                        <AntDesign name="user" color="black" size={15} />
                      </View>
                      <View style={{ marginLeft: 10 }}>
                        <Text
                          style={{
                            color: 'black',
                            fontSize: 15,
                            fontFamily: 'Montserrat-SemiBold',
                          }}>
                          {ratingItem.user_name}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <AntDesign
                          key={index}
                          name="star"
                          size={13}
                          color={
                            index < ratingItem.ratings ? '#fdd663' : '#d3d3d3'
                          }
                        />
                      ))}
                    </View>
                    <View>
                      <Text
                        style={{
                          color: 'black',
                          fontSize: 13,
                          marginBottom: 1,
                          marginTop: 5,
                          fontFamily: 'Montserrat-SemiBold',
                        }}>
                        {ratingItem.review_title}
                      </Text>
                      <Text
                        style={{
                          color: '#616161',
                          fontSize: 12,
                          marginBottom: 1,
                          marginTop: 2,
                          fontFamily: 'Montserrat-Regular',
                        }}>

                        {ratingItem.review_on
                          ? moment(ratingItem.review_on).format('ll')
                          :
                          'No date provided'}
                      </Text>
                      <Text
                        style={{
                          color: 'black',
                          fontSize: 12,
                          marginBottom: 1,
                          marginTop: 5,
                          fontFamily: 'Montserrat-Regular',
                          lineHeight: 18,
                        }}>
                        {ratingItem.review_description}
                      </Text>
                    </View>
                  </View>
                ))}
              </>
            ) : (
              <Text
                style={{
                  fontSize: 13,
                  color: 'black',
                  fontFamily: 'Montserrat-Medium',
                }}>
                No reviews available
              </Text>
            )}
          </View>
        </View>
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  mainMediaContainer: {
    width: Dimensions.get('window').width,
    height: 300,
  },
  productsDetailsAns: {
    color: '#2c2c2c',
    fontSize: 12,
    fontFamily: 'Montserrat-Medium',
    marginTop: 5,
  },
  productsDetasilRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  productDetailsHead: {
    color: '#2c2c2c',
    fontSize: 13,
    fontFamily: 'Montserrat-SemiBold',
    marginTop: 5,
    // letterSpacing: 1,
  },
  addsOnText: {
    fontSize: 13,
    color: '#2c2c2c',
    fontFamily: 'Montserrat-SemiBold',
    // width: 200,
    // fontWeight: '500',
    // color: 'black',
    marginBottom: 5,
  },
  addsOnImage: {
    // width: '50%',
    width: 150,
    height: 100,
    resizeMode: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    // borderWidth: 1,
    // borderColor: '#ededed',
    // alignSelf: 'center',
  },
  addsOnView: {
    elevation: 1,
    margin: 5,
    borderWidth: 1,
    borderColor: '#e7e7e7',
    backgroundColor: 'white',
    // padding: 5,
    borderRadius: 10,
    // width: '15%',
  },
  mainMedia: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  mediaSlide: {
    width: width,
    height: MEDIA_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  dotsWrap: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.25)',
    marginHorizontal: 3,
  },
  dotActive: {
    width: 18,
    backgroundColor: THEMECOLOR.mainColor,
  },
  thumbnailContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    marginTop: 25,
  },
  thumbnail: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  absolute: {
    ...StyleSheet.absoluteFillObject,
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
  },
});
export default ProductDetails;
