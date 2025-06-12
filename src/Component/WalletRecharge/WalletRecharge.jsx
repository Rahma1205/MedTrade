// import React, { useState } from 'react';
import Wallet from '../../Wallet';
import React, { useEffect, useState } from 'react';


function firststep(email, amount) {
  console.log(`Calling firststep with email: ${email}, amount: ${amount}`);
  alert(`Payment initiated for ${email} with amount $${amount}`);
}

// export default function WalletRecharge({ userData }) {
//   const [amount, setAmount] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
// const userEmail=userData.email;
//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const numericAmount = parseFloat(amount);
    
//     if (isNaN(numericAmount) || numericAmount <= 0) {
//       alert('Please enter a valid amount');
//       return;
//     }

//     firststep(userEmail, numericAmount);
//     setSuccessMessage(`Recharge initiated for $${numericAmount}`);
//     setAmount('');
//   };

//   return (
//     <div className="container mt-5">
//       <h2 className="mb-4">Recharge your wallet now</h2>

//       {successMessage && (
//         <div className="alert alert-success" role="alert">
//           {successMessage}a
//         </div>
//       )}

//       <form onSubmit={handleSubmit}>
//         <div className="mb-3">
//           <label htmlFor="amount" className="form-label">Amount</label>
//           <input
//             type="number"
//             className="form-control"
//             id="amount"
//             name="wallet"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//             placeholder="Enter amount"
//             required
//           />
//         </div>

//         <button type="submit" className="btn btn-primary" id='payButton'>
//           Pay Now
//         </button>
//       </form>
//     </div>
//   );
// }


const PaymentPage = ({ userEmail }) => {
  const [amount, setAmount] = useState('');

  // Check for call_firststep on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('call_firststep') === 'true') {
      console.log('Calling firststep() from useEffect');
      const parsedAmount = parseFloat(amount);
      if (!isNaN(parsedAmount)) {
        firststep(userEmail, parsedAmount);
      }
    }
  }, [amount, userEmail]);

  const handleClick = (e) => {
    e.preventDefault();
    console.log('Calling firststep() from button click');
    const parsedAmount = parseFloat(amount);
    if (!isNaN(parsedAmount)) {
      firststep(userEmail, parsedAmount);
    } else {
      console.error('Invalid amount');
    }
  };

  return (
    <div>
      <h3>Card Payment</h3>
      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        id="amount"
        style={{ marginBottom: '10px' }}
      />
      <br />
      <button id="payButton" onClick={handleClick}>
        Pay Now
      </button>
    </div>
  );
};

export default PaymentPage;

