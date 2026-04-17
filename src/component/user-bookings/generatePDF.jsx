import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';

const generatePDF = async event => {
  const htmlContent = `
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Seminar for Freshers</title>
    <style>
      body {
        font-family: "Montserrat", sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f9f9f9;
        color: #333;
        box-sizing: border-box;
      }

      .container {
        padding: 15px;
      }

      .header {
        text-align: center;
        font-size: 22px;
        font-weight: bold;
        margin: 10px 0;
      }

      .event-date {
        display: flex;
        justify-content: center;
        gap: 10px;
        color: gray;
        font-size: 14px;
        margin-bottom: 15px;
      }

      .get-direction {
        display: block;
        text-align: center;
        margin: 15px auto;
        background-color: #ff4040;
        color: #fff;
        padding: 10px 15px;
        border-radius: 5px;
        text-decoration: none;
        font-weight: bold;
        width: 90%;
        max-width: 300px;
      }

      .details-section {
        margin: 20px 0;
        padding: 15px;
        border: 1px solid #ddd;
        border-radius: 5px;
        background-color: #fff;
      }

      .details-section .row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
      }

      .details-section .row span {
        font-size: 14px;
        color: #333;
      }

      .download-links {
        text-align: center;
        margin-top: 10px;
      }

      .download-links a {
        display: inline-block;
        margin: 5px;
        color: #007bff;
        text-decoration: none;
        font-size: 14px;
      }

      .download-links a:hover {
        text-decoration: underline;
      }

      .items-table {
        margin-top: 20px;
        width: 100%;
        border-collapse: collapse;
        background-color: #fff;
      }

      .items-table th,
      .items-table td {
        border: 1px solid #ddd;
        padding: 10px;
        text-align: left;
        font-size: 14px;
      }

      .items-table th {
        background-color: #f4f4f4;
        font-weight: bold;
      }

      .items-table td img {
        max-width: 50px;
        height: auto;
        border-radius: 5px;
      }

      .share-button {
        display: block;
        text-align: center;
        background-color: #ff4040;
        color: #fff;
        padding: 10px 15px;
        margin: 20px auto 0;
        border-radius: 5px;
        text-decoration: none;
        font-weight: bold;
        width: 90%;
        max-width: 300px;
      }

      @media (max-width: 768px) {
        .details-section .row {
          flex-direction: column;
          gap: 5px;
        }

        .get-direction,
        .share-button {
          width: 100%;
        }

        .items-table th,
        .items-table td {
          font-size: 12px;
        }

        .items-table td img {
          max-width: 40px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">Seminar for Freshers</div>
      <div class="event-date">
        <span>Nov 16, 2024</span>
        <span>Nov 16, 2024</span>
      </div>
      <!-- <a href="#" class="get-direction">Get Direction</a> -->

      <div class="details-section">
        <div class="row">
          <span><strong>Booked by:</strong> Shriya</span>
          <span><strong>Receiver:</strong> Thaniua, +91 9867345346</span>
        </div>
        <div class="row">
          <span><strong>Event Timing:</strong> 10:00 AM - 7:00 PM</span>
          <span><strong>Venue Name:</strong> Ibis Party Hall</span>
        </div>
        <div class="row">
          <span><strong>Venue:</strong> Ibis party hall</span>
          <span
            ><strong>Location:</strong> Ibis Party Hall, Hosur Road, Zuzuvadi,
            Madiwala, 1st Stage, Bommanahalli, Bengaluru, Karnataka, India</span
          >
        </div>
        <div class="row">
          <span><strong>Venue Open Time:</strong> 6:00 AM</span>
          <span><strong>Event Days:</strong> 1 day</span>
        </div>
      </div>

      <div class="download-links">
        <a href="#">Download Event Invitation</a>
        <a href="#">Download Gate Entry Pass</a>
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
          <tr>
            <td><img src="https://via.placeholder.com/50" alt="Item 1" /></td>
            <td>
              Laucnty DJ Party Disco Ball Lights w/ Pattern & Sound Activated
            </td>
            <td>X1</td>
          </tr>
          <tr>
            <td><img src="https://via.placeholder.com/50" alt="Item 2" /></td>
            <td>Led Warm White Par</td>
            <td>X1</td>
          </tr>
          <tr>
            <td><img src="https://via.placeholder.com/50" alt="Item 3" /></td>
            <td>CHAUVET DJ H1200 Compact Fog Machine w/ Timer Remote</td>
            <td>X1</td>
          </tr>
          <tr>
            <td><img src="https://via.placeholder.com/50" alt="Item 4" /></td>
            <td>Zebronics ZEB-COUNTY 3W Wireless Bluetooth Speaker</td>
            <td>X1</td>
          </tr>
        </tbody>
      </table>

      <!-- <a href="#" class="share-button">Share</a> -->
    </div>
  </body>
</html>`;

  try {
    const options = {
      html: htmlContent,
      fileName: 'EventDetails',
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
