import React, { useState } from 'react';
import Wallet from '../../Wallet';

function firststep(email, amount) {
  console.log(`Calling firststep with email: ${email}, amount: ${amount}`);
  alert(`Payment initiated for ${email} with amount $${amount}`);
}

export default function WalletRecharge({ userData }) {
  const [amount, setAmount] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
const userEmail=userData.email;
  const handleSubmit = (e) => {
    e.preventDefault();

    const numericAmount = parseFloat(amount);
    
    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    firststep(userEmail, numericAmount);
    setSuccessMessage(`Recharge initiated for $${numericAmount}`);
    setAmount('');
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Recharge your wallet now</h2>

      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}a
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="amount" className="form-label">Amount</label>
          <input
            type="number"
            className="form-control"
            id="amount"
            name="wallet"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Pay Now
        </button>
      </form>
    </div>
  );
}
