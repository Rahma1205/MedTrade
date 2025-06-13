import React, { useState } from 'react';

// It's highly recommended to store sensitive keys in environment variables
// For example, in a .env file: REACT_APP_PAYMOB_API_KEY=ZXlKaGJHY2lPaUpJVX...
// Make sure to restart your development server after adding .env variables.
const API = process.env.REACT_APP_PAYMOB_API_KEY || 'ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpiR0Z6Y3lJNklrMWxjbU5vWVc1MElpd2ljSEp2Wm1sc1pWOXdheUk2T0RRNE5qVTRMQ0p1WVcxbElqb2lNVFk0T0RFME16RTBOeTQyT0RrMk5qa2lmUS56MWtlOXpxYVRic0ZxYko2R0xmV01obExGT2x2YW1kSnlOb2owMjVFMGstZmQ4S2hEN3dhc0tia05DT2RLYVVpSV9tR2RJWmNqS2ZrdXFDX0hGby1pUQ==';
const INTEGRATION_ID = 3994504; // This also could be an environment variable if it changes

export async function firstStep(user_email, amount = 0) {
    console.log('firstStep() called from exposed function'); // Added for debugging
    let data = { "api_key": API };
    let request = await fetch('https://accept.paymob.com/api/auth/tokens', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!request.ok) {
        throw new Error(`HTTP error! status: ${request.status}`);
    }
    let response = await request.json();
    let token = response.token;
    await secondStep(user_email, token, amount);
}

async function secondStep(user_email, token, paymentAmount) {
    paymentAmount = parseFloat(paymentAmount) * 100; // Convert to cents and ensure it's a number

    let data = {
        "auth_token": token,
        "delivery_needed": "false",
        "amount_cents": paymentAmount,
        "currency": "EGP",
        "items": [], // Ensure this is an array, even if empty
    };

    let request = await fetch('https://accept.paymob.com/api/ecommerce/orders', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (!request.ok) {
        // --- ADD THIS ERROR LOGGING ---
        const errorResponse = await request.json(); // Try to parse the error response
        console.error("Paymob secondStep API Error (Status 400):", errorResponse);
        throw new Error(`HTTP error! status: ${request.status}. Details: ${JSON.stringify(errorResponse)}`);
    }

    let response = await request.json();
    let id = response.id;
    await thirdStep(token, id, paymentAmount, user_email);
}

async function thirdStep(token, id, amount, user_email) {
    let data = {
        "auth_token": token,
        "amount_cents": amount,
        "expiration": 3600,
        "order_id": id,
        "billing_data": {
            "apartment": "803", "email": user_email, "floor": "42", "first_name": "Clifford", "street": "Ethan Land",
            "building": "8028", "phone_number": "+86(8)9135210487", "shipping_method": "PKG", "postal_code": "01898",
            "city": "Jaskolskiburgh", "country": "CR", "last_name": "Nicolas", "state": "Utah"
        },
        "currency": "EGP",
        "integration_id": INTEGRATION_ID
    };

    let request = await fetch('https://accept.paymob.com/api/acceptance/payment_keys', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!request.ok) {
        throw new Error(`HTTP error! status: ${request.status}`);
    }
    let response = await request.json();
    let Thetoken = response.token;
    cardPayment(Thetoken);
}

function cardPayment(Thetoken) {
    let iframeURL = `https://accept.paymob.com/api/acceptance/iframes/771124?payment_token=${Thetoken}`;
    window.location.href = iframeURL;
}

// You can still keep the React component if you want to use it for a default UI
const PaymobPayment = () => {
    const [userEmail, setUserEmail] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userEmail || !amount || isNaN(amount) || parseFloat(amount) <= 0) {
            setError("Please enter a valid email and a positive amount.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await firstStep(userEmail, amount); // Call the exposed firstStep
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h3>Pay via Form</h3>
            <form onSubmit={handleSubmit}>
                {/* ... (input fields and button) */}
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="userEmail" style={{ display: 'block', marginBottom: '5px' }}>User Email:</label>
                    <input
                        type="email"
                        id="userEmail"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="amount" style={{ display: 'block', marginBottom: '5px' }}>Amount (EGP):</label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        min="0.01"
                        step="0.01"
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Processing...' : 'Pay Now'}
                </button>
                {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
            </form>
        </div>
    );
};

export default PaymobPayment;