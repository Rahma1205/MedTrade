import React, { useState } from 'react';

const Wallet = () => {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState(0);

  const API_KEY = 'ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpiR0Z6Y3lJNklrMWxjbU5vWVc1MElpd2ljSEp2Wm1sc1pWOXdheUk2T0RRNE5qVTRMQ0p1WVcxbElqb2lNVFk0T0RFME16RTBOeTQyT0RrMk5qa2lmUS56MWtlOXpxYVRic0ZxYko2R0xmV01obExGT2x2YW1kSnlOb2owMjVFMGstZmQ4S2hEN3dhc0tia05DT2RLYVVpSV9tR2RJWmNqS2ZrdXFDX0hGby1pUQ==';

  const handlePayment = async () => {
    try {
      console.log('Step 1: Authentication');
      const authRes = await fetch('https://accept.paymob.com/api/auth/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: API_KEY }),
      });
      const authData = await authRes.json();
      const token = authData.token;
      await createOrder(email, token, amount);
    } catch (error) {
      console.error('Authentication failed:', error);
    }
  };

  const createOrder = async (userEmail, token, amount) => {
    try {
      console.log('Step 2: Creating order');
      const amountCents = amount * 100;
      const orderRes = await fetch('https://accept.paymob.com/api/ecommerce/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auth_token: token,
          delivery_needed: "false",
          amount_cents: amountCents,
          currency: "EGP",
          items: [],
        }),
      });
      const orderData = await orderRes.json();
      const orderId = orderData.id;
      await requestPaymentKey(token, orderId, amountCents, userEmail);
    } catch (error) {
      console.error('Order creation failed:', error);
    }
  };

  const requestPaymentKey = async (token, orderId, amountCents, userEmail) => {
    try {
      console.log('Step 3: Requesting payment key');
      const paymentRes = await fetch('https://accept.paymob.com/api/acceptance/payment_keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auth_token: token,
          amount_cents: amountCents,
          expiration: 3600,
          order_id: orderId,
          billing_data: {
            apartment: "803",
            email: userEmail,
            floor: "42",
            first_name: "Clifford",
            street: "Ethan Land",
            building: "8028",
            phone_number: "+86(8)9135210487",
            shipping_method: "PKG",
            postal_code: "01898",
            city: "Jaskolskiburgh",
            country: "CR",
            last_name: "Nicolas",
            state: "Utah",
          },
          currency: "EGP",
          integration_id: 3994504,
        }),
      });

      const paymentData = await paymentRes.json();
      const paymentToken = paymentData.token;
      redirectToIframe(paymentToken);
    } catch (error) {
      console.error('Payment key request failed:', error);
    }
  };

  const redirectToIframe = (token) => {
    console.log('Step 4: Redirecting to Paymob iframe');
    const iframeURL = `https://accept.paymob.com/api/acceptance/iframes/771124?payment_token=${token}`;
    window.location.assign(iframeURL);
  };

  return (

    <>

    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <h3>Paymob Card Payment</h3>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: 'block', marginBottom: '10px', width: '100%' }}
      />
      <input
        type="number"
        placeholder="Amount in EGP"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        style={{ display: 'block', marginBottom: '10px', width: '100%' }}
      />
     
       <button onClick={handlePayment} style={{ padding: '10px 20px' }}>
        Pay Now
      </button>
      
    </div>




</>
    
  );
};


export default Wallet;
