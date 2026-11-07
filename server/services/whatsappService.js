import axios from 'axios';

const OWNER_PHONE = process.env.OWNER_PHONE_NUMBER || '9441321874';

/**
 * Format order details into standard WhatsApp notification message
 */
export const formatOwnerOrderMessage = (order) => {
  const itemsText = order.orderItems
    .map(
      (item, index) =>
        `${index + 1}. ${item.name} – ${item.packSize} – ₹${item.price} × ${item.quantity} = ₹${item.subtotal}`
    )
    .join('\n');

  const fullAddress = `${order.deliveryAddress.street}, ${
    order.deliveryAddress.landmark ? order.deliveryAddress.landmark + ', ' : ''
  }${order.deliveryAddress.city}, ${order.deliveryAddress.state} - ${
    order.deliveryAddress.pincode
  }`;

  return `🎉 *NEW ORDER – SAI POOTHAREKULU*

*Order ID:* ${order.orderId}
*Customer:* ${order.customerName}
*Phone:* ${order.customerPhone}
*Email:* ${order.customerEmail}

*Products:*
${itemsText}

*Subtotal:* ₹${order.itemsPrice}
*Delivery Charges:* ₹${order.deliveryPrice}
*Total Paid:* ₹${order.totalPrice}

*Payment Status:* ${order.isPaid ? 'SUCCESSFUL' : 'PENDING'}
*Payment ID:* ${order.paymentResult?.razorpayPaymentId || 'N/A'}

*Delivery Address:*
${fullAddress}

*Order Time:* ${new Date(order.createdAt || Date.now()).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
  })}

---
Sai Pootharekulu - Authentic Andhra Delicacy`;
};

/**
 * Generate a direct click-to-chat WhatsApp link
 */
export const generateWhatsAppLink = (phoneNumber, message) => {
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  const targetPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
  return `https://api.whatsapp.com/send?phone=${targetPhone}&text=${encodeURIComponent(
    message
  )}`;
};

/**
 * Send WhatsApp notification to the official owner via WhatsApp Business Cloud API
 */
export const sendOwnerWhatsAppNotification = async (order) => {
  const messageBody = formatOwnerOrderMessage(order);
  const ownerNumber = (process.env.OWNER_PHONE_NUMBER || '9441321874').replace(
    /[^0-9]/g,
    ''
  );
  const recipient = ownerNumber.startsWith('91') ? ownerNumber : `91${ownerNumber}`;

  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  // Generate fallback direct link
  const directLink = generateWhatsAppLink(ownerNumber, messageBody);

  // If Cloud API credentials are provided, attempt real Cloud API transmission
  if (phoneNumberId && accessToken) {
    try {
      const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;
      const payload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: recipient,
        type: 'text',
        text: {
          preview_url: false,
          body: messageBody,
        },
      };

      const response = await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });

      console.log('WhatsApp Cloud API Notification sent successfully to owner:', response.data);
      return {
        success: true,
        method: 'cloud_api',
        data: response.data,
        directLink,
        message: 'Notification delivered via WhatsApp Business Cloud API',
      };
    } catch (error) {
      const errorMsg =
        error.response?.data?.error?.message || error.message || 'Unknown Cloud API error';
      console.error('WhatsApp Cloud API Notification failed:', errorMsg);
      return {
        success: false,
        method: 'cloud_api_failed',
        error: errorMsg,
        directLink,
        message: `Cloud API failed: ${errorMsg}. Fallback link generated.`,
      };
    }
  } else {
    // Cloud API not yet configured with credentials
    console.warn(
      'WHATSAPP_PHONE_NUMBER_ID or WHATSAPP_ACCESS_TOKEN is not configured in environment variables. Owner notification link created.'
    );
    return {
      success: false,
      method: 'not_configured',
      error: 'WhatsApp Business Cloud API credentials not configured in .env',
      directLink,
      message: 'Configure WHATSAPP_PHONE_NUMBER_ID & WHATSAPP_ACCESS_TOKEN to send automated messages.',
    };
  }
};

