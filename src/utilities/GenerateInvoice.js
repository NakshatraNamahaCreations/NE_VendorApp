import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import moment from 'moment';
import {apiUrl} from '../api-services/api-constants';

export const generateInvoice = async (
  event,
  productData,
  vendor,
  paymentSummary,
  generateRandomStringWithNumber,
) => {
  const htmlContent = `<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Page Title</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" type="text/css" media="screen" href="main.css" />
    <script src="main.js"></script>
  <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 20px;
        background-color: #f9f9f9;
      }
      .header {
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 10px;
      }
      .invoice-container {
        width: 100%;
      }
      .row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
      }
      .col {
        width: 48%;
      }
      .col h4 {
        margin: 0;
        font-size: 14px;
        font-weight: bold;
      }
      .compnay-logo {
        width: 100px;
        height: 56px;
      }
        .vendor-logo {
        width: 100px;
        height: 56px;
        margin-bottom:10px;
      }
      .col p {
        margin: 0;
        font-size: 12px;
      }
      .table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }
      .table th,
      .table td {
        border: 1px solid #000;
        padding: 8px;
        text-align: center;
      }
      .table th {
        background-color: #e0e0e0;
        font-size: 14px;
      }
      .table td {
        font-size: 12px;
      }
      .total-section {
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
      }
      .total-section div {
        font-size: 14px;
        font-weight: bold;
      }
      .footer {
        margin-top: 20px;
        font-size: 12px;
        text-align: center;
      }
    </style>
  </head>

  <body>
    <div class="invoice-container">
      <!-- Header Section -->
      <div class="header">INVOICE</div>

      <!-- Company and Invoice Details -->
      <div class="row">
        <!-- Left Column -->
        <div class="col">
        <img
            class="compnay-logo"
            src="https://my-s3-image-storage.s3.us-east-1.amazonaws.com/company_profile/1734754800675-WhatsApp Image 2024-11-22 at 15.36.52_9307ccc3.jpg" />
          <h4>KADAGAM VENTURES PRIVATE LIMITED</h4>
          <p>NO.34 1st Floor,</p>
          <p>Venkatappa Road,Tasker Town,Off Queens Road,</p>
          <p>Bengaluru - 560051</p>
          <p>GSTIN: 29AADPI4078B1ZW</p>
          <p>State: Karnataka,</p>
        </div>
        <!-- Right Column -->
        <div class="col" style="text-align: right">
          <p>Invoice No.: IN${generateRandomStringWithNumber} </p>
          <p>Event Name.: ${event.event_name} </p>
          <p>Dated: ${moment().format('ll')}</p>          
        </div>
      </div>

      <!-- Supplier Information -->
      <div class="row">
        <div class="col">
        <img
            class="vendor-logo"
            src= ${vendor.shop_image_or_logo} />
          <h4>Supplier (Bill From): ${vendor.vendor_name}</h4>
          <p>${
            (vendor.address[0]?.houseFlatBlock, vendor.address[0]?.roadArea)
          }</p>
          <p>${vendor.address[0]?.cityDownVillage}</p>
          <p>${vendor.address[0]?.distric - vendor.address[0]?.pincode}</p>
          <p>${vendor.address[0]?.state}</p> 
          <p>GSTIN: ${vendor.gst_number || 'NA'}</p>
        </div>        
      </div>

      <!-- Table for Invoice Items -->
      <table class="table">
        <thead>
          <tr>
            <th>Particulars</th>
            <th>Rate</th>
            <th>Quantity</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
         ${
           Array.isArray(productData) && productData.length > 0
             ? productData
                 .map(
                   ele => `
          <tr>
            <td>${ele.productName || 'N/A'}</td>
             <td>${ele.productPrice || 'N/A'}</td>
            <td>${ele.quantity || 'N/A'}</td>           
            <td>${ele.totalPrice || 'N/A'}</td>
          </tr>`,
                 )
                 .join('')
             : `<tr><td colspan="3" style="text-align: center;">No Products Available</td></tr>`
         }
           
        </tbody>
      </table>

      <!-- Total Section -->
      <div class="total-section">
        <div>
          <p>Total Amount: ${paymentSummary.totalAmount}</p>
          <p>Commission(20%):${paymentSummary.CommissionInPerc}</p>
          <p>Tax (18%): ${paymentSummary.taxInPerc}</p>
          <p>Grand Total: ${paymentSummary.grandTotal}</p>
        </div>
      </div>

      <!-- Footer Section -->
    <!-- <div class="footer">
         <p>Company's GSTIN/UIN: [GSTIN Number]</p> 
        <p>Authorized Signatory</p>
         <img src ="https://www.signwell.com/assets/vip-signatures/muhammad-ali-signature-3f9237f6fc48c3a04ba083117948e16ee7968aae521ae4ccebdfb8f22596ad22.svg" />
      </div> -->
    </div>
  </body>
</html>`;

  try {
    const options = {
      html: htmlContent,
      fileName: 'Invoice',
      directory: 'Documents',
    };

    const file = await RNHTMLtoPDF.convert(options);
    console.log('PDF created at:', file.filePath);
    return file.filePath;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

export const shareGeneratedInvoice = async filePath => {
  const shareOptions = {
    title: 'Share Event Details',
    url: `file://${filePath}`,
    message: 'Check out the event details!',
  };
  try {
    await Share.open(shareOptions);
  } catch (error) {
    console.error('Error sharing PDF:', error);
  }
};

export const shareInvoice = async (
  event,
  productData,
  vendorData,
  paymentSummary,
  generateRandomStringWithNumber,
) => {
  // console.log('vendorData', vendorData);
  console.log('paymentSummary', paymentSummary);

  try {
    const filePath = await generateInvoice(
      event,
      productData,
      vendorData,
      paymentSummary,
      generateRandomStringWithNumber,
    );
    await shareGeneratedInvoice(filePath);
  } catch (error) {
    console.error('Error sharing tickets:', error);
  }
};
