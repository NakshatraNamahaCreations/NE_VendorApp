import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {apiUrl} from '../../api-services/api-constants';
import useBackHandler from '../../utilities/useBackHandler';

const TermsNCondition = () => {
  useBackHandler();
  const [termsNCondition, setTermsNCondition] = useState([]);
  const fetchData = async () => {
    try {
      const res = await axios.get(`${apiUrl.BASEURL}${apiUrl.GET_TERMS}`);
      if (res.status === 200) {
        const tnc = res.data;
        // console.log('res.data', res.data);
        setTermsNCondition(tnc);
      }
    } catch (error) {
      console.error('Failed to fetch terms and condition:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  function stripHtml(html) {
    return html
      ?.replace(/<p>/g, '\n') // Convert <p> tags to newlines
      ?.replace(/<\/p>/g, '') // Remove closing </p> tags
      ?.replace(/<br\s*\/?>/g, '\n') // Convert <br> tags to newlines
      ?.replace(/&nbsp;/g, ' ') // Replace &nbsp; with a space
      ?.replace(/<[^>]*>/g, '')
      ?.replace(/<br\s*\/?>/gi, '\n')
      ?.replace(/<(?!\/?(strong|em|b|i)\b)[^>]*>/g, '') // Remove remaining HTML tags
      ?.replace(/\n/g, '<br>');
  }

  const plainTextContent = stripHtml(termsNCondition?.termsContent);

  console.log('termsNCondition', plainTextContent);
  return (
    <>
      <ScrollView style={{paddingHorizontal: 10}}>
        {/* <Text style={styles.subHeader}>Terms and Conditions</Text> */}
        <Text style={styles.subHeader}>1. Introduction</Text>
        <Text style={styles.paragraph}>
          This Agreement outlines the terms and conditions that govern the
          rental of equipment and related services provided by NithyaEvent. By
          accessing, browsing, or using the NithyaEvent mobile application or
          website (collectively, the “Platform”), you, the user, agree to adhere
          to these Terms and Conditions and acknowledge that any breach may lead
          to the suspension of your account or legal action if necessary.
        </Text>
        <Text style={styles.paragraph}>
          NithyaEvent offers rental equipment for events, including sound
          systems, lighting, cameras, and more, which are intended solely for
          the purposes outlined during the rental process. By using the
          Platform, you confirm that you will handle all rented equipment
          responsibly, in line with the intended use, and maintain the equipment
          in the condition it was provided.
        </Text>
        <Text style={styles.paragraph}>
          These Terms and Conditions apply to all interactions on the Platform,
          including account registration, equipment rental, service usage, and
          payments. NithyaEvent reserves the right to modify or update these
          terms at any time, and it is your responsibility to review the Terms
          and Conditions periodically to stay informed of any changes. By
          continuing to use the Platform after such updates, you agree to the
          revised terms.
        </Text>
        {/* Section 2 */}
        <Text style={styles.subHeader}>2. Definitions</Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Agreement:</Text> Refers to these Terms and
          Conditions, including any amendments, modifications, or updates made
          by Kadagam Venture Private Limited (the “Company”) at its discretion.
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Content:</Text> Means any text, images,
          audio, video, software, or other materials provided or uploaded by the
          Company, its users, or third parties onto the Portal, including all
          promotional, informational, or instructional material.
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Customer:</Text> Refers to any individual,
          entity, or organization that uses the Portal to rent, purchase, or
          avail of goods, services, or equipment.
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Order:</Text> Means any rental, service, or
          purchase made by a Customer through the Portal, including all
          associated terms such as duration, fees, and conditions.
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Product:</Text> Refers to any goods,
          equipment, or services offered or sold by the Company through the
          Portal, including but not limited to rental items for events.
        </Text>
        {/* Section 3 */}
        <Text style={styles.subHeader}>3. Access and Use</Text>
        <Text style={styles.paragraph}>
          The Portal is provided for commercial use, non-commercial use, and
          personal use. By accessing and using this Portal, you agree to the
          following terms:
        </Text>
        <Text style={styles.listItem}>
          - <Text style={styles.bold}>Prohibited Actions:</Text> You must not
          modify, copy, distribute, transmit, display, perform, reproduce,
          publish, license, create derivative works from, or sell any Content or
          information obtained from the Portal without the prior written consent
          of the Company.
        </Text>
        <Text style={styles.listItem}>
          - <Text style={styles.bold}>Automated Access:</Text> You are
          prohibited from using any automated software, algorithms, or manual
          processes to scrape, crawl, or copy any Content or information from
          the Portal.
        </Text>
        <Text style={styles.listItem}>
          - <Text style={styles.bold}>Fair Usage:</Text> You must not use the
          Portal in any manner that could damage, disable, overburden, or impair
          its functionality, or interfere with any other party's use and
          enjoyment of the Portal.
        </Text>
        <Text style={styles.listItem}>
          - <Text style={styles.bold}>Account Security:</Text> Account holders
          are solely responsible for maintaining the confidentiality of their
          account login credentials. Any activity that occurs under your account
          is your responsibility.
        </Text>
        <Text style={styles.subHeader}>4. Orders and Payments</Text>
        <Text style={styles.listItem}>
          - <Text style={styles.bold}>Order Acceptance:</Text> All orders placed
          through the Portal are subject to acceptance by the Company. The
          Company reserves the right to accept or reject any order at its
          discretion.
        </Text>
        <Text style={styles.listItem}>
          - <Text style={styles.bold}>Order Acceptance:</Text> All orders placed
          through the Portal are subject to acceptance by the Company. The
          Company reserves the right to accept or reject any order at its
          discretion.
        </Text>
        <Text style={styles.listItem}>
          - <Text style={styles.bold}>Order Cancellations:</Text> The Company
          may, at any time, decline or cancel an order due to reasons such as
          unavailability of the product, pricing errors, or any issues with the
          Customer’s payment method. If an order is canceled after payment has
          been processed, the Company will issue a refund in accordance with its
          Company’S refund policy.
        </Text>
        <Text style={styles.listItem}>
          - <Text style={styles.bold}>Payment Processing:</Text> Payments for
          orders are processed securely through an e-payment gateway, and all
          transactions are subject to the terms and conditions of the chosen
          payment processor. The Company does not store sensitive payment
          information on its servers.
        </Text>
        <Text style={styles.listItem}>
          - <Text style={styles.bold}>Pricing and Taxes:</Text> All prices are
          displayed on the Portal and are exclusive of applicable taxes unless
          stated otherwise. Customers are responsible for reviewing all charges
          and ensuring they understand the total cost before confirming an
          order.
        </Text>
        <Text style={styles.subHeader}>5. SHIPPING AND DELIVERY</Text>
        <Text style={styles.listItem}>
          - <Text style={styles.bold}> Shipping Timeframe:</Text>
          The Company will arrange for the shipment of all Products either
          directly or through its delivery partners within a specified timeframe
          after receiving an Order. Estimated delivery times are provided at the
          time of order placement but are subject to availability and other
          logistical considerations.
        </Text>
        <Text style={styles.listItem}>
          - <Text style={styles.bold}> Shipping Timeframe:</Text>
          The Company will arrange for the shipment of all Products either
          directly or through its delivery partners within a specified timeframe
          after receiving an Order. Estimated delivery times are provided at the
          time of order placement but are subject to availability and other
          logistical considerations.
        </Text>
        <Text style={styles.listItem}>
          - <Text style={styles.bold}>Delivery Address:</Text>
          Products will be delivered to the shipping address specified by the
          Customer at the time of order. It is the Customer&#39;s responsibility
          to ensure the accuracy and completeness of the provided shipping
          address.
        </Text>
        <Text style={styles.listItem}>
          - <Text style={styles.bold}>Carrier Liability:</Text>
          While the Company strives to ensure timely delivery, it is not
          responsible for delays, losses, or damages caused by third-party
          shipping carriers. Any delivery issues should be reported immediately,
          and the Company will assist in coordinating with the carrier as
          needed.
        </Text>
        <Text style={styles.listItem}>
          - <Text style={styles.bold}>Delivery Fees and Restrictions:</Text>
          Shipping fees, if applicable, will be displayed at checkout. Certain
          regions may have specific delivery restrictions or additional fees.
        </Text>
        <Text style={styles.subHeader}>6. GOVERNING LAW</Text>
        <Text style={styles.paragraph}>
          These Terms and Conditions shall be governed by and construed in
          accordance with the applicable laws of India. Any disputes arising out
          of or related to these Terms and Conditions shall be subject to the
          exclusive jurisdiction of the courts in Bengaluru, Karnataka.
        </Text>
        <Text style={styles.subHeader}>7. PRODUCT DESCRIPTIONS</Text>
        <Text style={styles.paragraph}>
          The Company makes reasonable efforts to ensure that Product
          descriptions, including specifications, images, and pricing, are
          accurate and up-to-date. However, occasional errors, inaccuracies, or
          omissions may occur. The Company reserves the right to correct any
          such errors in Product descriptions, including after an order has been
          placed.
        </Text>
        <Text style={styles.subHeader}>8. CANCELLATION FEES AND REFUNDS</Text>
        <Text style={styles.listItem}>
          <Text style={styles.bold}>Cancellation Window:</Text> Customers may
          cancel their order within 48 hours of placing the order. Cancellations
          made after this period may not be eligible for a full refund.
        </Text>
        <Text style={styles.listItem}>
          <Text style={styles.bold}>A. Cancellation Fees:</Text> If a
          cancellation is requested, a 20% cancellation fee will be applied to
          cover processing and administrative costs.
        </Text>
        <Text style={styles.listItem}>
          <Text style={styles.bold}>B. Refund Policy:</Text>{' '}
        </Text>
        <Text style={styles.listItem}>
          <Text style={styles.bold}>Full Refund:</Text>Eligible cancellations
          made within the specified cancellation Fees, And window will receive a
          full refund, processed within 7 business days.
        </Text>
        <Text style={styles.listItem}>
          <Text style={styles.bold}>Partial Refund:</Text> If a product is
          returned due to defects, the Company may issue a partial refund after
          an assessment of the product’s condition.
        </Text>
        <Text style={styles.listItem}>
          <Text style={styles.bold}>C. Late Fees:</Text> In the event of a late
          payment, the Customer will be liable to pay a late fee of [ or Amount]
          for each day the payment is delayed beyond the due date.
        </Text>
        <Text style={styles.listItem}>
          <Text style={styles.bold}>D. Rental Fees:</Text>
        </Text>
        <Text style={styles.listItem}>
          <Text style={styles.bold}>Rental Amount:</Text> The Customer agrees to
          pay a rental fee of [or Amount] for the entire rental duration.
        </Text>
        <Text style={styles.listItem}>
          <Text style={styles.bold}>Due Dates:</Text> Payment must be made in
          advance on or before the first day of the rental period.
        </Text>
        <Text style={styles.listItem}>
          <Text style={styles.bold}>E. Rental Period:</Text>
          The rental period will commence on [Start Date] and conclude on [End
          Date]. The Customer is responsible for returning the rented equipment
          by the end of the rental period. Late returns may incur additional
          fees.
        </Text>
        <Text style={styles.listItem}>
          <Text style={styles.bold}>F. Notification of Cancellation:</Text>
          To cancel an order, customers must notify NithyaEvent by sending an
          email to support@nithyaevents.com with their order details.
        </Text>
        <Text style={styles.subHeader}>9. ADDITIONAL CHARGES AND DELIVERY</Text>
        <Text style={styles.listItem}>
          <Text style={styles.bold}>Additional Charges:</Text> Any additional
          costs incurred, such as equipment damages, loss, or extended rental
          periods, will be billed separately. These charges are due upon receipt
          of the invoice and must be settled before any future rentals or
          services can be processed.
        </Text>
        <Text style={styles.listItem}>
          - <Text style={styles.bold}>Delivery:</Text>The equipment will be
          delivered to [Specific Location, e.g., &quot;Renter&#39;s business
          address&quot;] on [Delivery Date]. All delivery-related costs will be
          borne by [the responsible party, e.g., &quot;the Renter&quot; or
          &quot;the Owner&quot;]. If delivery fees are applicable, they will be
          specified during the order confirmation process.
        </Text>
        <Text style={styles.subHeader}>10. RETURN AND LATE RETURNS</Text>
        <Text style={styles.listItem}>
          <Text style={styles.bold}>Return:</Text> At the end of the rental
          period, the Renter shall return the equipment to [Specific Return
          Location, e.g., &quot;Owner&#39;s primary business location&quot;] no
          later than [End Date as mentioned in Rental Period]. The equipment
          must be returned in the same condition as it was at the beginning of
          the rental period, allowing for regular wear and tear.
        </Text>
        <Text style={styles.listItem}>
          - <Text style={styles.bold}>Late Returns:</Text>If the Renter fails to
          return the equipment by the specified date, a late fee of [₹ or $
          Amount] will be charged for each day of delay. If the equipment is not
          returned within [specific time, e.g., &quot;one days&quot;] after the
          due date, the equipment will be considered stolen, and appropriate
          legal actions may be taken.
        </Text>

        <Text style={styles.subHeader}>11. MAINTENANCE AND REPAIRS</Text>
        <Text style={styles.listItem}>
          <Text style={styles.bold}>Renter&#39;s Responsibility:</Text> The
          Renter is responsible for the general care and maintenance of the
          rented equipment during the rental period. This includes ensuring that
          the equipment is used in accordance with the manufacturer&#39;s
          instructions and guidelines.
        </Text>
        <Text style={styles.listItem}>
          - <Text style={styles.bold}>Damage Reporting:</Text>Any damage to the
          equipment must be reported to the Company immediately. The Company
          will assess the damage and determine if repairs are needed. The Renter
          may be liable for the cost of repairs if damage occurs due to misuse
          or negligence.
        </Text>
        <Text style={styles.listItem}>
          <Text style={styles.bold}>Repair Costs:</Text>If repairs are
          necessary, the costs will be billed to the Renter, and payment will be
          due upon receipt of the invoice.
        </Text>
        <Text style={styles.subHeader}>11. MAINTENANCE AND REPAIRS</Text>
        <Text style={styles.listItem}>
          <Text style={styles.bold}>Renter&#39;s Responsibility:</Text> The
          Renter agrees to maintain the equipment in good working order during
          the rental period. This includes, but is not limited to, basic
          cleaning, proper storage, and ensuring safe usage in accordance with
          any guidelines provided by NithyaEvent.
        </Text>
        <Text style={styles.listItem}>
          <Text style={styles.bold}>Report of Malfunctions:</Text>Any
          malfunctions, issues, or necessary repairs must be reported to
          NithyaEvent immediately. The Renter should not attempt any repairs or
          alterations to the equipment without the express consent of
          NithyaEvent. Unauthorized repairs may result in additional charges or
          penalties.
        </Text>
        <Text style={styles.listItem}>
          <Text style={styles.bold}>Damage and Repair Costs:</Text>If damage
          occurs due to misuse or negligence, the Renter may be held responsible
          for the cost of repairs. The Company will assess the damage and
          communicate any repair costs to the Renter, with payment due upon
          receipt of the invoice.
        </Text>
        <Text style={styles.subHeader}>LIABILITY</Text>
        <Text style={styles.listItem}>
          <Text style={styles.bold}>Liability:</Text> The Renter assumes full
          responsibility and liability for the equipment from the time of
          delivery until it is returned to the Owner. This includes any damage,
          theft, or loss of the equipment. The Renter agrees to indemnify and
          hold the Owner harmless from any claims, losses, or damages arising
          from the Renter’s use of the equipment.
        </Text>
        <Text style={styles.subHeader}>13. RELEASE OF LIABILITY</Text>
        <Text style={styles.listItem}>
          The Renter releases the Owner from any claims, liabilities, or demands
          arising out of injuries or damages caused by the rented equipment
          during the rental period. This release applies unless such damages or
          injuries result from the Owner&#39;s negligence or the malfunction of
          the equipment due to factors beyond the Renter&#39;s control.
        </Text>
        <Text style={[styles.listItem, {marginTop: 10}]}>
          The Renter acknowledges that they have been informed of the risks
          associated with the use of the equipment and accepts full
          responsibility for any incidents that may arise during the rental
          period.
        </Text>
        <Text style={styles.subHeader}>14. REPLACEMENT</Text>
        <Text style={styles.listItem}>
          In the event of loss or total damage to the equipment where repair is
          not feasible, the Renter agrees to reimburse the Owner for the full
          replacement value of the equipment. The replacement value will be
          determined based on the current market price for a comparable item of
          the same make and model, or a suitable equivalent.
        </Text>
        <Text style={[styles.listItem, {marginTop: 10}]}>
          The Renter acknowledges that this reimbursement obligation applies
          regardless of the circumstances surrounding the loss or damage,
          including theft, accident, or misuse.
        </Text>
        <Text style={styles.subHeader}>15. ADDITIONAL COSTS</Text>
        <Text style={styles.listItem}>
          Any costs associated with remedying a breach of this agreement,
          including but not limited to legal fees, collection costs, and
          expenses incurred in recovering the equipment, will be the sole
          responsibility of the Renter. The Renter agrees to reimburse the Owner
          for all reasonable costs incurred in enforcing the terms of this
          condition, including any necessary legal action to recover damages or
          equipment.
        </Text>
        <Text style={styles.subHeader}>17. JURISDICTION</Text>
        <Text style={styles.listItem}>
          Any legal proceedings related to this agreement will be brought in the
          courts of [Specific City, State/Country], and both parties consent to
          such jurisdiction and venue. Both the Renter and the Owner agree that
          they will not contest the jurisdiction or venue of these courts in any
          legal action arising from this agreement.
        </Text>
        <Text style={styles.subHeader}>18. BINDING ARBITRATION</Text>
        <Text style={styles.listItem}>
          If mediation is unsuccessful, either party may propose to settle the
          dispute by binding arbitration under the rules of [Specific
          Arbitration Association]. The decision reached by arbitration shall be
          final and binding on both parties, and neither party shall have the
          right to appeal the decision in a court of law.
        </Text>
        <Text style={styles.subHeader}>19. PRIVACY</Text>
        <Text style={styles.listItem}>
          Please review our Privacy Notice, which also governs your visit to
          NithyaEvent.com, to understand our practices regarding your personal
          information. The personal information and data provided to us during
          your usage of NithyaEvent.com will be treated as strictly confidential
          and in accordance with the Privacy Notice and applicable laws and
          regulations.
        </Text>
        <Text style={styles.listItem}>
          If you object to your information being transferred or used as
          outlined in the Privacy Notice, please do not use the website.
        </Text>
        <Text style={styles.subHeader}>PRIVACY POLICY</Text>
        <Text style={styles.subHeader}>1.Introduction</Text>
        <Text style={styles.listItem}>
          Welcome to NithyaEvent. Your privacy is important to us. This Privacy
          Policy outlines how we collect, use, disclose, and safeguard your
          information when you visit our website, And Mobile Application
          nithyaevent.com, or use our services. By using our website or
          services, you consent to the practices described in this policy.
        </Text>
        <Text style={styles.subHeader}>Information Storage and Security</Text>
        <Text style={styles.listItem}>
          We store and process your information, including any sensitive
          financial information (as defined under the Information Technology
          Act, 2000), on secure computers protected by both physical and
          technological security measures. These practices comply with the
          Information Technology Act, 2000, and the rules thereunder. If you
          have any objections to your information being transferred or used in
          this manner, please do not use our platform.
        </Text>
        <Text style={styles.subHeader}>Legal Disclosure</Text>

        <Text style={styles.listItem}>
          We may disclose your personal information when required by law or in
          good faith belief that such disclosure is reasonably necessary to
          respond to subpoenas, court orders, or other legal processes. This may
          include disclosure to law enforcement, third-party rights owners, or
          others if we believe it is necessary to enforce our Terms or Privacy
          Policy, respond to claims that content violates the rights of a third
          party, or protect the rights, property, or personal safety of our
          users or the general public.
        </Text>
        <Text style={styles.subHeader}>
          I. Information Storage and Security
        </Text>
        <Text style={styles.listItem}>
          We store and process your information, including any sensitive
          financial information (as defined under the Information Technology
          Act, 2000), on secure computers protected by both physical and
          technological security measures. These practices comply with the
          Information Technology Act, 2000, and the rules thereunder. If you
          have any objections to your information being transferred or used in
          this manner, please do not use our platform.
        </Text>
        <Text style={styles.subHeader}>II. Business Transactions</Text>
        <Text style={styles.listItem}>
          In the event of a merger, acquisition, or reorganization of our
          business, we and our affiliates may share or sell some or all of your
          personal information to another business entity. Should such a
          transaction occur, the new entity will be required to adhere to this
          Privacy Policy concerning your personal information.
        </Text>

        <Text style={styles.subHeader}>2. Information We Collect</Text>
        <Text style={styles.listItem}>
          <Text style={styles.bold}> Personal Information:</Text> We may
          collect personal information that you provide to us when you register
          on our site, place an order, subscribe to our newsletter, or
          communicate with us. This may include your name, email address, phone
          number, payment information, and delivery address.
        </Text>
        <Text style={styles.listItem}>
          <Text style={styles.bold}> Non-Personal Information:</Text> We may
          also collect non-personal information automatically when you visit our
          site. This may include your IP address, browser type, operating
          system, pages visited, time spent on the site, and referring website.
        </Text>
        <Text style={styles.subHeader}>3. How We Use Your Information</Text>
        <Text style={styles.listItem}>
          We use the information we collect in the following ways:
        </Text>
        <Text style={styles.listItem}>
           To process your transactions and manage your rental orders.
        </Text>
        <Text style={styles.listItem}>
           To improve our website and services based on your feedback and
          usage.
        </Text>
        <Text style={styles.listItem}>
           To communicate with you regarding your account, orders, or services.
        </Text>
        <Text style={styles.listItem}>
           To send periodic emails about your order or other products and
          services.
        </Text>
        <Text style={styles.listItem}>
           To comply with applicable laws and regulations.
        </Text>
        <Text style={styles.subHeader}>4. Disclosure of Your Information</Text>
        <Text style={styles.listItem}>
          We do not sell, trade, or otherwise transfer your personal information
          to third parties without your consent, except as described in this
          policy. We may share your information with:
        </Text>
        <Text style={styles.listItem}>
          <Text style={styles.bold}> Service Providers:</Text> We may share
          your information with third-party service providers who assist us in
          operating our website, conducting our business, or servicing you.
          These parties are obligated to keep your information confidential.
        </Text>
        <Text style={styles.listItem}>
          <Text style={styles.bold}> Legal Requirements:</Text> We may disclose
          your information if required to do so by law or in response to valid
          requests by public authorities.
        </Text>
        <Text style={styles.subHeader}>5. Security of Your Information</Text>
        <Text style={styles.listItem}>
          We implement a variety of security measures to maintain the safety of
          your personal information. However, please be aware that no method of
          transmission over the internet or method of electronic storage is 100%
          secure. While we strive to use commercially acceptable means to
          protect your personal information, we cannot guarantee its absolute
          security.
        </Text>
        <Text style={styles.subHeader}>6. Your Rights</Text>
        <Text style={styles.listItem}>You have the right to:</Text>
        <Text style={styles.listItem}>
           Access your personal information and request corrections.
        </Text>
        <Text style={styles.listItem}>
           Request the deletion of your personal information.
        </Text>
        <Text style={styles.listItem}>
           Object to the processing of your personal information.
        </Text>
        <Text style={styles.listItem}>
           Withdraw consent where we rely on your consent to process your
          information.
        </Text>

        <Text style={styles.subHeader}>
          7. Cookies and Tracking Technologies
        </Text>
        <Text style={styles.listItem}>
          Our website may use cookies and similar tracking technologies to
          enhance user experience. You can choose to accept or decline cookies.
          Most web browsers automatically accept cookies, but you can modify
          your browser setting to decline cookies if you prefer.
        </Text>
        <Text style={styles.subHeader}>8. Third-Party Links</Text>
        <Text style={styles.listItem}>
          Our website may contain links to third-party websites. We do not
          control these websites and are not responsible for their content or
          privacy practices. We encourage you to review the privacy policies of
          any third-party websites you visit.
        </Text>

        <Text style={styles.subHeader}>9. Changes to This Privacy Policy</Text>
        <Text style={styles.listItem}>
          We may update this Privacy Policy from time to time. Any changes will
          be posted on this page with an updated effective date. We encourage
          you to review this policy periodically for any changes.
        </Text>
        <Text style={styles.subHeader}>10. Contact Us</Text>
        <Text style={styles.listItem}>
          If you have any questions about this{' '}
          <Text style={styles.bold}>TERMS AND CONDITIONS Privacy Policy,</Text>{' '}
          please contact us at:
        </Text>

        <Text style={styles.listItem}>
           <Text style={styles.bold}>Email:</Text> [support@nithyaevents.com]
        </Text>
        <Text style={styles.listItem}>
          {' '}
          <Text style={styles.bold}>
            Address: [Kadagam Ventures Private Limited]
          </Text>
        </Text>
        <Text style={styles.listItem}>
           No : 34. Venkatappa Road Tasker Town
        </Text>
        <Text style={styles.listItem}> Off Queens Road Bangalore 560051</Text>
      </ScrollView>
    </>
  );
};

export default TermsNCondition;

const styles = StyleSheet.create({
  subHeader: {
    fontSize: 15,
    marginVertical: 8,
    color: '#4f4f4f',
    fontFamily: 'Montserrat-SemiBold',
  },
  paragraph: {
    fontSize: 13,
    lineHeight: 24,
    marginBottom: 8,
    color: '#555',
    fontFamily: 'Montserrat-Medium',
  },
  listItem: {
    fontSize: 13,
    lineHeight: 24,
    marginBottom: 4,
    color: '#555',
    marginLeft: 16,
    fontFamily: 'Montserrat-Medium',
  },
  bold: {
    fontWeight: 'bold',
  },
});
