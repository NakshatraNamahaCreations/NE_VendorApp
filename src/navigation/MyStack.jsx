import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../Screens/SplashScreen';
import Login from '../Screens/Login';
import Register from '../Screens/Register';
import BottomTab from './BottomTab';
import OtpScreen from '../Screens/OtpScreen';
import OtpSuccess from '../Screens/OtpSuccess';
import Notification from '../component/notification/Notification';
import Productfilter from '../component/product/Productfilter';
import ShopDetails from '../component/home-component/ShopDetails';
import AllShop from '../component/home-component/AllShop';
import Search from '../component/home-component/Search';
import OrderSummary from '../component/order/OrderSummary';
import AddAddress from '../component/cart/AddAddress';
import OrderConfirmation from '../component/cart/OrderConfirmation';
import OrderSuccessPage from '../component/cart/OrderSuccessPage';
import ProductDetails from '../component/product/ProductDetails';
import AddShopDetails from '../Screens/AddShopDetails';
import WaitingScreen from '../Screens/WaitingScreen';
import ProductReview from '../component/product/ProductReview';
import ShopAddress from '../Screens/ShopAddress';
import RequestReturn from '../component/order/RequestReturn';
import EmailSummary from '../component/order/EmailSummary';
import Invoice from '../component/order/Invoice';
import MyAddress from '../component/profile-component/MyAddress';
import MyProducts from '../component/profile-component/MyProducts';
import ServicePeople from '../Screens/ServicePeople';
import AdditionalDetails from '../Screens/AdditionalDetails';
import BusinessDetails from '../Screens/BusinessDetails';
import AddService from '../component/service/AddService';
import BookingList from '../component/user-bookings/BookingList';
import EventDetails from '../component/user-bookings/EventDetails';
import EditProduct from '../component/product/EditProduct';
import ScheduledDetails from '../component/service/ScheduledDetails';
import FAQList from '../component/user-bookings/FAQ';
import TermsNCondition from '../component/user-bookings/TermsNCondition';
import PrivacyPolicy from '../component/profile-component/PrivacyPolicy';
import Aboutus from '../component/user-bookings/Aboutus';
import GetStarted from '../Screens/GetStarted';
import ServiceList from '../component/service/ServiceList';
import ServiceDetails from '../component/service/ServiceDetails';
import Onboarding from '../Screens/Onboarding';
import ForgotPassword from '../Screens/ForgotPassword';
import Verification from '../Screens/Verification';
import ResetPassword from '../Screens/ResetPassword';
import ResetSuccess from '../Screens/ResetSuccess';
import HelpCenter from '../component/user-bookings/HelpCenter';
import PayoutHistory from '../component/payout/PayoutHistory';
import GoogleMap from '../Screens/GoogleMap';
import ViewInvoice from '../component/user-bookings/ViewInvoice';
import EditService from '../component/service/EditService';
import TechnicianList from '../component/product/TechnicianList';
import TermsNConditionNew from '../component/user-bookings/TermsNConditionNew';
import EditProfile from '../component/user-bookings/EditProfile';
import AddonsList from '../component/service/AddonsList';

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GetStarted"
        component={GetStarted}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Onboarding"
        component={Onboarding}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddShopDetails"
        component={AddShopDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Service People"
        component={ServicePeople}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BusinessDetails"
        component={BusinessDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AdditionalDetails"
        component={AdditionalDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddShopAddress"
        component={ShopAddress}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{
          headerShown: true,
          title: 'Edit Profile',
          headerTitleStyle: {
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 17,
          },
        }}
      />
      <Stack.Screen
        name="Waiting"
        component={WaitingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Verification"
        component={Verification}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ResetSuccess"
        component={ResetSuccess}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OTP"
        component={OtpScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Otp Success"
        component={OtpSuccess}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BottomTab"
        component={BottomTab}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Notification"
        component={Notification}
        options={{
          title: 'Notifications',
          headerShown: false,
          // headerTintColor: 'yellow',
          // headerBackground: 'white',
        }}
      />
      <Stack.Screen
        name="Product Filter"
        component={Productfilter}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetails}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ProductReview"
        component={ProductReview}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Shop Details"
        component={ShopDetails}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="All Shop"
        component={AllShop}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Search"
        component={Search}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Order Summary"
        component={OrderSummary}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Invoice"
        component={Invoice}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Request Return"
        component={RequestReturn}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Email Summary"
        component={EmailSummary}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Add Address"
        component={AddAddress}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Order Confirmation"
        component={OrderConfirmation}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EditProduct"
        component={EditProduct}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AddService"
        component={AddService}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Edit Service"
        component={EditService}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Success"
        component={OrderSuccessPage}
        options={{
          headerShown: false,
        }}
      />
      {/* Profile */}
      {/* <Stack.Screen
        name="My Address"
        component={MyAddress}
        options={{
          headerShown: false,
        }}
      /> */}
      <Stack.Screen
        name="My Products"
        component={MyProducts}
        options={{
          headerShown: true,
          title: 'My Products',
          headerTitleStyle: {
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 17,
          },
        }}
      />
      <Stack.Screen
        name="Technician List"
        component={TechnicianList}
        options={{
          headerShown: true,
          title: 'Technicians List',
          headerTitleStyle: {
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 17,
          },
        }}
      />
      <Stack.Screen
        name="Addons List"
        component={AddonsList}
        options={{
          headerShown: true,
          title: 'Addons List',
          headerTitleStyle: {
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 17,
          },
        }}
      />
      <Stack.Screen
        name="Booking List"
        component={BookingList}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Service List"
        component={ServiceList}
        options={{
          headerShown: true,
          title: 'My Services',
          headerTitleStyle: {
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 17,
          },
        }}
      />
      <Stack.Screen
        name="PayoutHistory"
        component={PayoutHistory}
        options={{
          headerShown: true,
          title: 'Revenue History',
          headerTitleStyle: {
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 17,
          },
        }}
      />
      <Stack.Screen
        name="EditService"
        component={ServiceList}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ServiceDetails"
        component={ServiceDetails}
        options={{
          headerShown: true,
          title: 'Service Details',
          headerTitleStyle: {
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 17,
          },
        }}
      />
      <Stack.Screen
        name="Event Details"
        component={EventDetails}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ViewInvoice"
        component={ViewInvoice}
        options={{
          headerShown: true,
          title: 'View Invoice',
          headerTitleStyle: {
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 17,
          },
        }}
      />
      <Stack.Screen
        name="Scheduled Details"
        component={ScheduledDetails}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Aboutus"
        component={Aboutus}
        options={{
          headerShown: true,
          title: 'About Us',
          headerTitleStyle: {
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 17,
          },
        }}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicy}
        options={{
          headerShown: true,
          title: 'Privacy Policy',
          headerTitleStyle: {
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 17,
          },
        }}
      />
      <Stack.Screen
        name="TermsCondition"
        component={TermsNCondition}
        options={{
          headerShown: true,
          title: 'Terms & Conditions',
          headerTitleStyle: {
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 17,
          },
        }}
      />
      {/* <Stack.Screen
        name="TermsCondition"
        component={TermsNConditionNew}
        options={{
          headerShown: true,
          title: 'Terms & Conditions',
          headerTitleStyle: {
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 17,
          },
        }}
      /> */}

      <Stack.Screen
        name="FAQ"
        component={FAQList}
        options={{
          headerShown: true,
          title: 'FAQ',
          headerTitleStyle: {
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 17,
          },
        }}
      />
      <Stack.Screen
        name="HelpCenter"
        component={HelpCenter}
        options={{
          headerShown: true,
          title: 'Help Center',
          headerTitleStyle: {
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 17,
          },
        }}
      />
      {/* testing screens */}
      <Stack.Screen
        name="GoogleAddress"
        component={GoogleMap}
        options={{
          headerShown: true,
          title: 'FAQ',
          headerTitleStyle: {
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 17,
          },
        }}
      />
    </Stack.Navigator>
  );
}

export default MyStack;
