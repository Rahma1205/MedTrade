import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import {toast} from "react-toastify";
import { Helmet } from "react-helmet";

function ContactForm({ receiverId, seller, listing, token }) {
  const { t, i18n } = useTranslation();

  const [message, setMessage] = React.useState(() =>
    t("defaultMessage", { title: listing.title })
  );
  const [messages, setMessages] = React.useState([]);
  const [loadingMessages, setLoadingMessages] = React.useState(false);
  const [sending, setSending] = React.useState(false);


  React.useEffect(() => {
    if (!receiverId || !token) return;

    setLoadingMessages(true);
    axios
      .get(`/chat/messages/${receiverId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setMessages(res.data);
      })
      .catch((err) => {
        console.error("Failed to load messages", err);
      })
      .finally(() => {
        setLoadingMessages(false);
      });
  }, [receiverId, token]);

  React.useEffect(() => {
    setMessage(t("defaultMessage", { title: listing.title }));
  }, [i18n.language, listing.title]);

  const handleSend = async () => {
    if (!message.trim()) return;

    setSending(true);
    try {
      await axios.post(
        `/api/chat/messages/${receiverId}`,
        { message },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const res = await axios.get(`/api/chat/messages/${receiverId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
      setMessage("");
    } catch (error) {
      toast.error("Failed to send message");
    }
    setSending(false);
  };

  return (

    
    <div className="contact-form-container">
      <h3 className="contact-form-title">
        {t("contactTitle", { name: seller?.fullName || t("seller") })}
      </h3>

      <div className="messages-container">
        {loadingMessages ? (
          <p className="loading-text">{t("loadingMessages")}</p>
        ) : messages.length === 0 ? (
          <p className="no-messages-text">{t("noPreviousMessages")}</p>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className="message-item">
              <strong>{msg.sender?.first_name || t("you")}:</strong> {msg.message}
              <br />
              <small className="message-timestamp">
                {new Date(msg.created_at.replace(/\.\d+/, "")).toLocaleString(
                  i18n.language === "ar" ? "ar-EG" : "en-US"
                )}
              </small>
            </div>
          ))
        )}
      </div>

      <textarea
        className="message-input"
        rows={4}
        placeholder={t("defaultMessage", { title: listing.title })}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={sending}
      />

      <div className="send-button-container">
        <button
          className="send-button"
          onClick={handleSend}
          disabled={sending}
          onMouseEnter={(e) => {
            if (!sending) e.currentTarget.classList.add("hovered");
          }}
          onMouseLeave={(e) => {
            if (!sending) e.currentTarget.classList.remove("hovered");
          }}
        >
          {sending ? t("sending") : t("sendMessage")}
        </button>
      </div>
    </div>
  );
}


export default function EquipmentDetials({userData}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showContactForm, setShowContactForm] = useState(false);
const [contactProps, setContactProps] = useState(null);
const [showReportForm, setShowReportForm] = useState(false);
const [reportMessage, setReportMessage] = useState("");

const [showFeedbackForm, setShowFeedbackForm] = useState(false);
const [feedbackMessage, setFeedbackMessage] = useState("");
  const { t, i18n } = useTranslation();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = userData.access_token;


  useEffect(() => {
    if (!token) {
      navigate("/SignIn");
      return;
    }

    axios
      .get(`/api/productdetails/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {

        const data = res?.data;
        if (data && data.id) {
          setProduct(data);
          console.log(data);
          
        } else {
          setError(t("productNotFound"));
        }
        setLoading(false);
      })
      .catch(() => {
        setError(t("loadingFailed"));
        setLoading(false);
      });
  }, [id, token, navigate, t]);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center bg-light"
        style={{ minHeight: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status"></div>
        <span className="ms-2">{t("loading")}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="d-flex justify-content-center align-items-center bg-light"
        style={{ minHeight: "100vh" }}
      >
        <div
          className="container bg-white rounded-3 shadow p-4 p-md-5 text-center"
          style={{ maxWidth: "600px" }}
        >
          <p className="text-danger">{error}</p>
          <button className="btn btn-primary" onClick={() => navigate(-1)}>
            {t("return")}
          </button>
        </div>
      </div>
    );
  }

  return (

    <> <Helmet>
        <title>{t('featuredEquipment')}</title>
      </Helmet>
    <div
      className="d-flex justify-content-center align-items-center bg-light"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="container bg-white rounded-3 shadow p-4 p-md-5"
        style={{ maxWidth: "900px" }}
        dir={i18n.language === "ar" ? "rtl" : "ltr"}
      >
  
        <div className={`mb-4 ${i18n.language === "ar" ? "text-end" : "text-start"}`}>
          <button
            className="btn btn-link fw-bold fs-5"
            onClick={() => navigate(-1)}
            style={{ textDecoration: "none" }}
          >
            {i18n.language === "ar" ? "← رجوع" : "← Back"}
          </button>
        </div>

        <div className="row g-4">
        
          <div className="col-lg-6">
               <div className="shadow rounded overflow-hidden">
              {product.Main_image ? (
                <img
                  src={`https://medtrade.wghtk.com/storage/${product.Main_image}`}
                  alt={product.title}
                  className="img-fluid"
                  style={{
                    maxHeight: "500px",
                    width: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    height: "500px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#eee",
                    color: "#666",
                  }}
                >
                  {t("noImageAvailable")}
                </div>
              )}
            </div>

        <div className="d-flex flex-wrap gap-2 mt-3 justify-content-center">
              {[product.image1, product.image2, product.image3, product.image4, product.image5, product.image6]
                .filter(Boolean)
                .map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="shadow-sm rounded"
                    style={{
                      width: "100px",
                      height: "100px",
                      overflow: "hidden",
                      cursor: "pointer",
                      borderRadius: "0.375rem",
                    }}
                    onClick={() => window.open(`https://medtrade.wghtk.com/storage/${imgUrl}`, "_blank")}
                    title={`${t("additionalImage")} ${idx + 1}`}
                  >
                    <img
                      src={`https://medtrade.wghtk.com/storage/${imgUrl}`}
                      alt={`${product.title} - ${t("additionalImage")} ${idx + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.3s",
                      }}
                      className="img-thumbnail"
                      onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                      onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    />
                  </div>
                ))}
            </div>
          </div>

        
          <div className="col-lg-6 d-flex flex-column justify-content-between">
            <div>
              <h3 className="fw-bold mb-3">{product.title}</h3>

             
              {product.category && (
                <p className="text-muted mb-2">
                  <strong>{t("category")}: </strong>{" "}
                  {typeof product.category === "string"
                    ? product.category
                    : product.category.name || ""}
                </p>
              )}
              {product.condition && (
  <p className="text-muted mb-2">
    <strong>{t("condition_2")}:</strong> {t(product.condition)}
  </p>
)}

              <h4 className="text-success mb-4 fw-bold">
                {Number(product.price).toLocaleString(i18n.language === "ar" ? "ar-EG" : "en-US")}{" "}
                {i18n.language === "ar" ? "ج.م" : "EGP"}
              </h4>

              <p className="fs-5" style={{ lineHeight: "1.7", color: "#333" }}>
                {product.desc}
              </p>

              <p className="text-muted mt-3">
                <small>
                  {t("postedOn")}{" "}
                  {new Date(product.created_at).toLocaleDateString(
                    i18n.language === "ar" ? "ar-EG" : "en-US"
                  )}
                </small>
              </p>

              {product.user && (
                <div className="mt-4 p-3 border rounded bg-light">
                  <h5>{t("addedBy")}</h5>
                  <p>
                    <strong>{t("name")}: </strong> {product.user.first_name} {product.user.last_name}
                  </p>
                  {product.user.email && (
                    <p>
                      <strong>{t("email")}: </strong> {product.user.email}
                    </p>
                  )}
                  
                  {product.user.address && (
                    <p>
                      <strong>{t("address")}: </strong> {product.user.address}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="d-flex gap-3 mt-4">
             <Link
  to="/Checkout"
  state={{ productId: product.id, productPrice: product.price, sellerInfo: product.user }}
  className="btn btn-primary px-4 py-2 fw-semibold"
>
  {t("buyNow")}
</Link>
       
<button
  className="btn btn-outline-primary px-4 py-2 fw-semibold"
  onClick={() => {
    if (product.user && product.user.id) {
      console.log(product.user);
              console.log(product.user.id);

      setContactProps({
        receiverId: product.user.id,
        seller: product.user,
        listing: product,
        token:token,
      });
      setShowContactForm(true);
    } else {
      toast.error("Seller info not available");
    }
  }}
>
  {t("contactSeller")}
</button>




            
            </div>
              <div className="d-flex gap-3 mt-4">
           <button
  className="btn btn-outline-primary px-4 py-2 fw-semibold mt-2"
  onClick={() => setShowFeedbackForm(true)}
>
  {t("giveFeedback")}
</button>

<button
  className="btn btn-danger px-4 py-2 fw-semibold mt-2"
  onClick={() => setShowReportForm(true)}
>
  {t("reportProblem")}
</button>



            
            </div>
          
          </div>
            {showContactForm && contactProps && (
  <ContactForm
    receiverId={contactProps.receiverId}
    seller={contactProps.seller}
    listing={contactProps.listing}
    token={contactProps.token}
  />
)}

{showReportForm && (
  <div className="mt-4 p-4 border rounded bg-light">
    <h5 className="fw-bold">{t("reportProblem")}</h5>
    <textarea
      className="form-control mb-3"
      rows={4}
      placeholder={t("describeProblem")}
      value={reportMessage}
      onChange={(e) => setReportMessage(e.target.value)}
    />
    <div className="d-flex gap-2">
      <button
        className="btn btn-danger"
        onClick={async () => {
          if (!reportMessage.trim()) {
            toast.error(t("pleaseWriteSomething"));
            return;
          }

          try {
          const res=  await axios.post(
              "/api/makereport",
               { report: reportMessage },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
console.log();

            if(res.data.message=="issue reported successfully , we will contact you"){
 toast.success(t("reportSent"));
            setShowReportForm(false);
            setReportMessage("");
            }
           
          } catch (error) {
            console.error("Report failed", error);
            toast.error(t("reportFailed"));
          }
        }}
      >
        {t("submitReport")}
      </button>

      <button className="btn btn-secondary" onClick={() => setShowReportForm(false)}>
        {t("cancel")}
      </button>
    </div>
  </div>
)}

{showFeedbackForm && (
  <div className="mt-4 p-4 border rounded bg-light">
    <h5 className="fw-bold">{t("giveFeedback")}</h5>
    <textarea
      className="form-control"
      rows={4}
      placeholder={t("feedbackPlaceholder")}
      value={feedbackMessage}
      onChange={(e) => setFeedbackMessage(e.target.value)}
    />
    <div className="mt-3 d-flex gap-2">
      <button
        className="btn btn-primary"
        onClick={() => {
          if (feedbackMessage.trim()) {
            console.log("Feedback submitted:", feedbackMessage);
            toast.success(t("feedbackThanks"));
            setFeedbackMessage("");
            setShowFeedbackForm(false);
          } else {
            toast.error(t("enterFeedback"));
          }
        }}
      >
        {t("submit")}
      </button>
      <button
        className="btn btn-secondary"
        onClick={() => setShowFeedbackForm(false)}
      >
        {t("cancel")}
      </button>
    </div>
  </div>
)}

        </div>

      
        {product.feedback?.filter((f) => f.comment)?.length > 0 && (
          <div className="mt-5">
            <h5 className="fw-bold mb-4">{t("feedback")}</h5>
            <div className="list-group">
              {product.feedback
                .filter((item) => item.comment)
                .map((item) => (
                  <div
                    key={item.id}
                    className="list-group-item list-group-item-action mb-2 shadow-sm rounded"
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="mb-1 fw-bold">
                        {t("seller")}:{" "}
                        <span className="text-primary">
                          {item.seller?.first_name} {item.seller?.last_name}
                        </span>
                      </h6>
                      <small className="text-muted">
                        {new Date(item.created_at).toLocaleDateString(
                          i18n.language === "ar" ? "ar-EG" : "en-US"
                        )}
                      </small>
                    </div>
                    <p className="mb-0">{item.comment}</p>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>

    </>
  );
}
