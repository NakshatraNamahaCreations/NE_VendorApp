import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import moment from 'moment';
import {apiUrl} from '../api-services/api-constants';

export const generatePDF = async (event, productData) => {
  const htmlContent = `<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Delivery Challan</title>
  <style>
    /* Your styles here */
    body {
      font-family: "Montserrat", sans-serif;
      margin: 0;
      padding: 0;
      background-color: white;
      color: #333;
      box-sizing: border-box;
    }
    .container { padding: 15px; }
    .header { text-align: center; font-size: 22px; font-weight: bold; margin: 10px 0; }
    .event-date { display: flex; justify-content: center; gap: 10px; color: gray; font-size: 14px; margin-bottom: 15px; }
    .details-section .row { display: grid; grid-template-columns: 150px auto; align-items: center; margin-bottom: 10px; }
    .details-section .row span { font-size: 14px; color: #333; }
    .details-section .label { font-weight: bold; white-space: nowrap; }
    .details-section .value { overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; }
    .items-table { margin-top: 20px; width: 100%; border-collapse: collapse; background-color: #fff; }
    .items-table th, .items-table td { border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 14px; }
    .items-table th { background-color: #f4f4f4; font-weight: bold; }
    .items-table td img { max-width: 50px; height: auto; border-radius: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">${event.event_name || 'Event Name'}</div>
    <div class="event-date">
      <span>${
        moment(event.event_start_date).format('ll') || 'Start Date'
      }</span>
      <span>${event.event_start_time || 'Start Time'}</span>
    </div>
    <div class="details-section">
      <!-- Event details -->
      <div class="row"><span class="label">Booked by:</span><span class="value">${
        event.user_name || 'N/A'
      }</span></div>
      <div class="row"><span class="label">Receiver:</span><span class="value">${
        event.receiver_name || 'N/A'
      }, +91 ${event.receiver_mobilenumber || 'N/A'}</span></div>
      <div class="row"><span class="label">Event Timing:</span><span class="value">${
        event.event_start_time || 'N/A'
      } - ${event.event_end_time || 'N/A'}</span></div>
      <div class="row"><span class="label">Event Date:</span><span class="value">From ${
        event.event_start_date
      } To ${event.event_end_date}</span></div>
      <div class="row"><span class="label">Venue Name:</span><span class="value">${
        event.venue_name || 'N/A'
      }</span></div>
      <div class="row"><span class="label">Location:</span><span class="value">${
        event.event_location || 'N/A'
      }</span></div>
    </div>
    <table class="items-table">
      <thead>
        <tr>
          <th>Image</th>
          <th>Description</th>
          <th>Qty</th>
        </tr>
      </thead>
      <tbody>
        ${
          Array.isArray(productData) && productData.length > 0
            ? productData
                .map(
                  ele => `
              <tr>
                <td><img src="${ele.imageUrl}" alt="Product" /></td>
                <td>${ele.productName || 'N/A'}</td>
                <td>${ele.quantity || 0}</td>
              </tr>`,
                )
                .join('')
            : `<tr><td colspan="3" style="text-align: center;">No Products Available</td></tr>`
        }
      </tbody>
    </table>
  </div>
</body>
</html>`;

  try {
    const options = {
      html: htmlContent,
      fileName: 'delivery_challan',
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

export const sharePDF = async filePath => {
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

export const shareTickets = async (event, productData) => {
  try {
    const filePath = await generatePDF(event, productData);
    await sharePDF(filePath);
  } catch (error) {
    console.error('Error sharing tickets:', error);
  }
};
