import twilio from 'twilio';

export const sendSms = async ({ phone, message }) => {
  // Check karein ki mock mode on hai ya Twilio ke credentials missing hain
  const useMockSms = process.env.USE_MOCK_SMS === 'true' || !process.env.TWILIO_ACCOUNT_SID;

  if (useMockSms) {
    console.log('--------------------------------------------------');
    console.log(`📱 [MOCK SMS SERVICE]`);
    console.log(`📤 To Phone     : ${phone}`);
    console.log(`💬 Message Content: ${message}`);
    console.log('--------------------------------------------------');
    return { sid: 'mock_sid_' + Date.now() };
  }

  // Production / Real Twilio Code
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = twilio(accountSid, authToken);

  try {
    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });
    console.log(`📱 Real SMS sent successfully to ${phone}. SID: ${response.sid}`);
    return response;
  } catch (error) {
    console.error('❌ SMS sending failed:', error.message);
    throw new Error('Failed to send SMS');
  }
};