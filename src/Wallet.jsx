import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { firstStep } from "./paymob";

const Wallet = ({ userData }) => {
  const { t } = useTranslation();

  const [email, setEmail] = useState(userData.email || '');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const callFirstStep = urlParams.get('call_firststep');
    const urlAmount = urlParams.get('amount');
    const urlEmail = urlParams.get('email');

    if (callFirstStep === 'true') {
      const finalAmount = urlAmount ? parseFloat(urlAmount) : parseFloat(amount);
      const finalEmail = urlEmail || email;

      if (finalEmail && finalAmount > 0) {
        handleInitiatePayment(finalEmail, finalAmount);
      } else {
        setError(t("wallet.urlError"));
      }
    }
  }, []);

  const handleInitiatePayment = async (email, amountToPay) => {
    if (!email || !amountToPay || isNaN(amountToPay) || parseFloat(amountToPay) <= 0) {
      setError(t("wallet.validationError"));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await firstStep(email, parseFloat(amountToPay));
    } catch (err) {
      setError(`${t("wallet.paymentFailed")}: ${err.message || t("wallet.unknownError")}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePayButtonClick = (e) => {
    e.preventDefault();
    handleInitiatePayment(email, amount);
  };

  return (
    <div className="container py-5">
      <div className="card shadow p-4 mx-auto" style={{ maxWidth: "500px" }}>
        <h3 className="mb-4 text-center">{t("wallet.title")}</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label className="form-label">{t("wallet.emailLabel")}</label>
          <input
            type="email"
            className="form-control"
            placeholder={t("wallet.emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <label className="form-label">{t("wallet.amountLabel")}</label>
          <input
            type="number"
            className="form-control"
            placeholder={t("wallet.amountPlaceholder")}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={loading}
          />
        </div>

        <button
          className="btn btn-primary w-100"
          onClick={handlePayButtonClick}
          disabled={loading}
        >
          {loading ? t("wallet.loading") : t("wallet.payNow")}
        </button>
      </div>
    </div>
  );
};

export default Wallet;
