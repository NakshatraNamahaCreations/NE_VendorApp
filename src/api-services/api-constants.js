const apiUrl = {
  BASEURL: 'https://api.nithyaevent.com/api',
  IMAGEURL: 'https://api.nithyaevent.com/',

  // BASEURL: 'http://192.168.1.77:9000/api',
  // IMAGEURL: 'http://192.168.1.77:9000/',

  // VENDOR
  VENDOR_REGISTER: '/vendor/register',
  LOGIN_WITH_GMAIL: '/vendor/login-with-gmail',
  LOGIN_WITH_MOBILE: '/vendor/loginwithmobilenumber',
  LOGIN_WITH_GOOGLE: '/vendor/login-with-google-account',
  FORGOT_PASSWORD: '/vendor/forgot-password',
  VERIFY_EMAIL_OTP: '/vendor/verify-email-otp',
  RESET_PASSWORD: '/vendor/reset-vendor-password',
  RESENT_OTP_TO_MAIL: '/vendor/resent-otp',
  ADD_VENDOR_BUSINESS_DETAILS: '/vendor/add-vendor-business-details/',
  ADD_SERVICE_USER_BUSINESS_DETAILS:
    '/vendor/add-service-user-business-details/',
  // SERVICE_USER_BUSINESS: '/vendor/save-vendor-details',
  ADD_SERVICE_ADDITIONAL_DETAILS: '/vendor/add-additional-services/',
  GET_VENDOR_PROFILE: '/vendor/getprofile/',
  FILTEROUT_VENDOR: '/vendor/filterout-vendors/',
  ADD_SHIPPING_ADDRESS: '/vendor/add-address/',
  VENDOR_LOGOUT: '/vendor/delete-vendor-profile/',
  GET_ALL_VENDOR: '/vendor/getallvendor',
  UPDATE_VENDOR_PROFILE: '/vendor/edit-vendor-profile/',

  // USER ORDER
  GET_PRODUCT_BOOKED_ORDERS: '/user-order/get-vendor-order/',
  GET_SERVICE_BOOKED_ORDERS: '/user-order/get-service-orders/',

  // PRODUCT
  ADD_PRODUCT: '/product/addproduct',
  ADD_SERVICE: '/vendor-service/add-vendor-service',
  EDIT_SERVICE: '/vendor-service/edit-service/',
  GET_RENTAL_PRODUCTS: '/product/getrentalproduct',
  GET_APPROVED_PRODUCTS: '/product/get_approved_products/',
  GET_SELLING_PRODUCTS: '/product/getsellproduct',
  GET_PRODUCT_BY_ID: '/product/getproduct/',
  FILTEROUT_PRODUCTS: '/product/getfilteroutproducts/',
  WRITE_A_REVIEW: '/product/review/',
  GET_REVIEW: '/product/getreview/',
  GET_VENDOR_PRODUCT: '/product/getvendorproduct/',
  GET_SERVICE_BY_SERVICE_ID: '/vendor-service/get-service-by-serviceid',
  GET_SERVICES_BY_VENDOR_ID: '/vendor-service/get-services-by-vendor-id/',
  GET_ALL_SERVICES_BY_VENDOR_ID: '/vendor-service/get-vendor-service-vendorid/',

  EDIT_PRODUCT: '/product/edit-product/',
  UPDATE_PRODUCT_AVAILABILITY: '/product/update-product-availability',

  // ORDER
  CREATE_ORDER: '/order/create-order',
  GET_ORDER_BY_VENDOR_ID: '/order/get-my-order/',
  RETURN_ORDER: '/order/return-order/',
  DELIVERY_ITEMS: '/user-order/delivery-order/',
  GET_ORDER_BY_ORDER_ID: '/user-order/get-order-by-order-id/',
  ADD_DELIVERY_IMAGES: '/user-order/add-deliverey-setup/',
  GET_SETUP_IMAGES: '/user-order/get-eventsetup-images-by-vendorid/',

  // SERVICE
  GET_ALL_SERVICE: '/service/get-all-service',
  GET_SERVICE_BY_SERVICENAME: '/service/get-service-by-servicename',
  GET_ALL_SUB_SERVICE: '/sub-service/get-all-sub-service',
  ADDONS_LIST_BY_VENDORID: '/addons/get-addons-by-vendorid/',
  UPDATE_SERVICE_AVAILABILITY: '/vendor-service/update-service-availability',

  // TECH/ENGINEER
  ADD_TECHNICIAN: '/technician/add-technician',
  DELETE_TECHNICIAN: '/technician/delete_technician/',
  EDIT_TECHNICIAN: '/technician/edit-technician/',
  GET_TECHNICIAN_BY_VENDOR_ID: '/technician/get-technician-by-vendor-id/',
  ADD_ADDONS_FOR_SERVICE: '/addons/add-addons',
  EDIT_ADDONS_BY_ID: '/addons/edit-addons/',
  DELETE_ADDONS: '/addons/delete-addons/',

  // FAQ
  GET_ALL_FAQ: '/faq/get-vendor-faq',

  // COMPANY DETAILS
  GET_PAYOUT_CONFIG: '/payout-config/get-payout-config-profile',
  GET_PROFILE: '/company-profile/get-profile',
  GET_PAYOUT_CONFIG: '/payout-config/get-payout-config-profile',
  GET_PAYOUT_AMOUNT: '/payouts/get-payouts-amounts-by-vendorid/',
  GET_PAYOUT_BY_VENDORID: '/payouts/get-payouts-by-id/',

  // NOTIFICATION
  GET_NOTIFICATION: '/vendor-inapp/get-notifications?vendorId=',
  MARK_AS_READ_NOTIFICATION: '/vendor-inapp/mark-read/',

  // TERMS & CONDITION
  GET_TERMS: '/tnc/get-vendor-tnc',

  // GENETARE INVOICE
  CREATE_INVOICE: '/invoice/create-invoice',
  GET_INVOICE_STATUS: '/invoice/get-invoice-status-invoice-by-id',
};

export {apiUrl};
