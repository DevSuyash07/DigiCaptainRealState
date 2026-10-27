import twilio from 'twilio';

const REQUIRED_ENV = ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_PHONE_NUMBER'];

/**
 * SMS config ki asli halat. `mock` sirf tab true hota hai jab developer ne
 * explicitly USE_MOCK_SMS=true set kiya ho — missing credentials ko chupchaap
 * mock mode me badalna nahi hai, warna production me OTP "bhej diya" dikhta hai
 * aur user ke phone par kuch nahi aata.
 */
export const smsConfigStatus = () => {
  const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
  return {
    mock: process.env.USE_MOCK_SMS === 'true',
    configured: missing.length === 0,
    missing
  };
};

export const isSmsConfigured = () => {
  const status = smsConfigStatus();
  return status.mock || status.configured;
};

export const sendSms = async ({ phone, message }) => {
  const { mock, configured, missing } = smsConfigStatus();

  if (mock) {
    console.log('--------------------------------------------------');
    console.log('📱 [MOCK SMS SERVICE] (USE_MOCK_SMS=true)');
    console.log(`📤 To Phone       : ${phone}`);
    console.log(`💬 Message Content: ${message}`);
    console.log('--------------------------------------------------');
    return { sid: 'mock_sid_' + Date.now(), mock: true };
  }

  if (!configured) {
    console.error(`❌ SMS not configured. Missing env: ${missing.join(', ')}`);
    throw new Error(
      `SMS service is not configured. Missing environment variables: ${missing.join(', ')}`
    );
  }

  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

  try {
    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });
    console.log(`📱 Real SMS sent to ${phone}. SID: ${response.sid}`);
    return response;
  } catch (error) {
    console.error('❌ SMS sending failed:', error.message);
    throw new Error(`Failed to send SMS: ${error.message}`);
  }
};
