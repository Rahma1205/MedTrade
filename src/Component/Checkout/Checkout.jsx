import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";

function Checkout({ userData }) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const { productId, productPrice, sellerInfo } = location.state || {};
  const token = localStorage.getItem("userToken") || userData?.access_token;

  const formatPrice = (value) =>
    typeof value === "number" ? value.toFixed(2) : Number(value).toFixed(2);

  const [loading, setLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [wallet, setWallet] = useState(0);
  const [listing, setListing] = useState({});
  const [seller, setSeller] = useState({});
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    paymentMethod: "wallet",
  });

  const [orderDetails, setOrderDetails] = useState({
    subtotal: Number(productPrice) || 0,
    shipping: 5,
    total: (Number(productPrice) || 0) + 5,
  });

  useEffect(() => {
    // if (!productId || !productPrice) {
    //   alert(t("missingProductInfo"));
    //   navigate("/");
    //   return;
    // }

    axios
      .get(`/api/productdetails/wallet/${productId}/${productPrice}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
      
        const data = res.data;
        setWallet(data.userWallet || 0);
        setListing(data.product || {});
        setSeller(data.seller || {});
        if (data.user) {
          setForm((f) => ({
            ...f,
            fullName: `${data.user.userFirstName} ${data.user.userLastName}`,
            email: data.user.userEmail,
            address: data.user.userAddress,
            city: data.user.userCity,
            state: data.user.userState,
            zipCode: data.user.userZipCode || "",
            country: data.user.userCountry,
          }));
        }
      })
      .catch((err) => {
        console.error("Failed to fetch wallet/product details", err);
        alert(t("failedToLoadCheckout"));
      })
      .finally(() => setLoading(false));
  }, [productId, productPrice, token, navigate]);

  useEffect(() => {
    const sub = Number(productPrice) || 0;
    const ship = 5;
    setOrderDetails({
      subtotal: sub,
      shipping: ship,
      total: sub + ship,
    });
  }, [productPrice]);

  const validateForm = () => {
    if (
      !form.fullName.trim() ||
      !form.email.trim() ||
      !form.address.trim() ||
      !form.city.trim() ||
      !form.state.trim() ||
      !form.zipCode.match(/^\d+$/) ||
      !form.country.trim()
    ) {
      alert(t("pleaseFillFields"));
      return false;
    }
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsPending(true);

    try {
      const res = await axios.put(
        `/api/productdetails/${userData.id}/${productId}/${productPrice}`,
        {
          address: form.address,
          city: form.city,
          state: form.state,
          ZIP_code: form.zipCode,
          country: form.country,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.message === "Address Updated Sucessfully") {
        if (form.paymentMethod === "wallet") {
          const amountToPay = orderDetails.total - wallet;

          const resp = await axios.post(
            `/api/productdetails/wallet/${productId}/walletPayment/${userData.id}/${Math.max(
              0,
              amountToPay
            )}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (resp.data.message === "Transaction made Sucessfully") {
            alert(
              amountToPay <= 0
                ? t("orderSuccessWallet")
                : t("orderSuccessWalletPartial", {
                    amount: formatPrice(amountToPay),
                  })
            );
            navigate("/");
          } else {
            alert(t("walletPaymentFailed"));
          }
        } else if (form.paymentMethod === "cod") {
          alert(t("orderSuccessCOD"));
          navigate("/");
        }
      } else {
        alert(t("addressUpdateFailed"));
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      alert(t("checkoutFailed"));
    } finally {
      setIsPending(false);
    }
  };

  if (loading) return <div className="text-center py-5">{t("loadingCheckout")}</div>;

  return (

    <>
    
    
      <Helmet>
        <title>{t('checkoutTitle')}</title>
      </Helmet>
    <div className="container py-5">
      <div className="row">
        <div className="col-12 mb-4">
          <h1 className="fw-bold">{t("checkoutTitle")}</h1>
          <hr />
        </div>

        <div className="col-lg-8">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-secondary text-white">
              <h5 className="mb-0">{t("shippingInfo")}</h5>
            </div>
            <div className="card-body">
              <form onSubmit={onSubmit}>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">{t("fullName")}</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">{t("email")}</label>
                    <input
                      type="email"
                      className="form-control"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">{t("address")}</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    required
                  />
                </div>

                <div className="row mb-3">
                  <div className="col-md-4">
                    <label className="form-label">{t("city")}</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">{t("state")}</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label">{t("zipCode")}</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.zipCode}
                      onChange={(e) => setForm({ ...form, zipCode: e.target.value })}
                      required
                      pattern="\d+"
                      title={t("zipNumeric")}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">{t("country")}</label>
                    <select
                      className="form-select"
                      value={form.country}
                      onChange={(e) => setForm({ ...form, country: e.target.value })}
                      required
                    >
                      <option value="">{t("selectCountry")}</option>
                      <option value="Egypt">{t("egypt")}</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <h5>{t("paymentMethod")}</h5>
                  {wallet !== null && (
                    <div
                      className={`form-check border rounded p-3 mb-2 ${
                        wallet >= orderDetails.total ? "bg-light" : "text-muted"
                      }`}
                    >
                      <input
                        className="form-check-input"
                        type="radio"
                        id="walletPay"
                        name="paymentMethod"
                        value="wallet"
                        disabled={wallet < orderDetails.total}
                        checked={form.paymentMethod === "wallet"}
                        onChange={() => setForm({ ...form, paymentMethod: "wallet" })}
                      />
                      <label className="form-check-label" htmlFor="walletPay">
                        <strong>{t("wallet")}</strong> – {t("balance")}: EGP
                        {wallet.toFixed(2)}
                        {wallet < orderDetails.total && (
                          <span className="text-danger">
                            {" "}
                            ({t("add")} EGP
                            {formatPrice(orderDetails.total - wallet)})
                          </span>
                        )}
                      </label>
                    </div>
                  )}
                  
                </div>

                <button type="submit" className="btn btn-primary w-100" disabled={isPending||wallet < orderDetails.total}>
                  {isPending ? t("processing") : t("placeOrder")}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-secondary text-white">
              <h5 className="mb-0">{t("orderSummary")}</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>{t("subtotal")}</span>
                <span>EGP {formatPrice(orderDetails.subtotal)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>{t("shipping")}</span>
                <span>EGP {formatPrice(orderDetails.shipping)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold">
                <span>{t("total")}</span>
                <span>EGP {formatPrice(orderDetails.total)}</span>
              </div>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-header bg-secondary text-white">
              <h5 className="mb-0">{t("sellerInfo")}</h5>
            </div>
            <div className="card-body">
              <p>
                <strong>{t("name")}:</strong>{" "}
                {sellerInfo.first_name || sellerInfo.last_name || "N/A"}
              </p>
              <p>
                <strong>{t("address")}:</strong>{" "}
                {sellerInfo.address || "N/A"}
              </p>
              <p>
                <strong>{t("email")}:</strong>{" "}
                {sellerInfo.email|| "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Checkout;
