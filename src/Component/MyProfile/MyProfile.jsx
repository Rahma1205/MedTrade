import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import defaultUser from "../../Assets/Images/gravater-icon.jpg";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function MyProfile({ userData }) {

  
  const { t, i18n } = useTranslation();
  const [profile, setProfile] = useState('null');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("listings");
  const [deletingId, setDeletingId] = useState(null);
  const [markingId, setMarkingId] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const token = userData?.access_token;

  const [surveyData, setSurveyData] = useState({
    age: "",
    gender: "",
    primary_medical_condition: "",
    health_care_provider: "",
    mobility_level: "",
    medical_equipment: "",
    duration_of_need: "",
  });
  

  const [surveySubmitting, setSurveySubmitting] = useState(false);

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await axios.get("/api/myProfile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(res.data.user_data);
        console.log('profile:',profile);
        
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userData]);

  
   


  const handleDeleteProduct = async (productId) => {
    if (!window.confirm(t("myProfile.confirm_delete"))) return;
    setDeletingId(productId);

    try {
      const res = await axios.delete(`/api/productdetails/delete/${productId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.message === "product deleted successfully") {
        toast.success("Product deleted successfully");
        setProfile((prev) => ({
          ...prev,
          product: prev.product.filter((p) => p.id !== productId),
        }));
      } else {
        toast.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error(t("myProfile.delete_failed"));
    } finally {
      setDeletingId(null);
    }
  };



  const handleMarkAsSold = async (productId) => {
    setMarkingId(productId);

    try {
      const res = await axios.post(
        `/api/markasSold/${productId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.message === "Product Sold Sucessfully") {
        toast.success("Product marked as sold");
        setProfile((prev) => ({
          ...prev,
          product: prev.product.map((p) =>
            p.id === productId ? { ...p, available: "Sold" } : p
          ),
        }));
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Failed to mark as sold:", error);
      toast.error("Failed to mark as sold");
    } finally {
      setMarkingId(null);
    }
  };

  const handleSubscription = async (productId) => {
  const fee = 5;
  const userWallet = userData?.wallet || 0;
  const checkOut = userWallet - fee;

  if (checkOut < 0) {
    alert("You don't have enough balance to subscribe.");
    return;
  }

  const confirm = window.confirm(`Subscription fee will be ${fee} EGP. Do you want to continue?`);
  if (!confirm) return;

  try {
    const { data } = await axios.post(
      `/api/subscriptionrequest/${productId}/${checkOut}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if(data.message=='subscription made successfully'){
    toast.success("Subscription successful!");
    }
  } catch (error) {
    console.error("Subscription failed", error);
    toast.error("Subscription failed. Please try again.");
  }
};

  const handleSurveyChange = (e) => {
    setSurveyData({ ...surveyData, [e.target.name]: e.target.value });
  };

  const handleSurveySubmit = async (e) => {
    e.preventDefault();
    setSurveySubmitting(true);
    try {
     const res= await axios.post("/api/makesurvey", surveyData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
if(res.data.message ='Thank you for your survey'){
  toast.success("Survey submitted successfully");
      setSurveyData({
        age: "",
        gender: "",
        primary_medical_condition: "",
        health_care_provider: "",
        mobility_level: "",
        medical_equipment: "",
        duration_of_need: "",
      });}
      else{toast.error(res.data.message);}
      
    } catch (error) {
      toast.error("Failed to submit survey");
    } finally {
      setSurveySubmitting(false);
    }
  };

useEffect(() => {
 const fetchSuggestions = async () => {
  try {
    const productRes = await axios.get('/api');
    const medicalEquipment = productRes.data.data.filter(
      item => item.status === 'accepted' && item.available === 'inStock'
    );
    console.log('medicalEquipment',medicalEquipment);
    

    const surveyRes = await axios.get('/api/spacificsurvey', {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

const equipmentTitles = surveyRes.data.user_data.question.map(
  item => item.medical_equipment
);


    const matchedSurveys = medicalEquipment.filter(
      item => equipmentTitles.includes(item.category)
    );

    setAiSuggestions(matchedSurveys);
  } catch (error) {
    console.error(error);
  } finally {
  }
};


  fetchSuggestions();
}, []);


  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  const renderUserInitial = () => {
    if (!profile?.first_name) return null;
    const initial = profile.first_name.charAt(0).toUpperCase();
    return (
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          backgroundColor: "#007bff",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "28px",
          fontWeight: "bold",
          userSelect: "none",
          marginRight: "12px",
        }}
      >
        {initial}
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "listings":
        return (
          <div className="row mt-4">
            {profile?.product?.length > 0 ? (
              profile.product.map((item) => (
                <div key={item.id} className="col-md-5 mb-4">
                  <div className="card h-100 shadow-sm">
                    <img
                      src={`https://medtrade.wghtk.com/storage/${item.Main_image}`}
                      alt={item.title || t("myProfile.product_image")}
                      style={{ height: "200px", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultUser;
                      }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{item.title}</h5>
                      <p className="card-text">{item.desc}</p>
                      <p>
                        <strong>{t("myProfile.price")}:</strong> ${item.price}
                      </p>
                      <p>
                        <strong>{t("myProfile.status")}:</strong> {item.status}
                      </p>
                      <p>
                        <strong>{t("myProfile.availability")}:</strong> {item.available}
                      </p>
                    </div>
                    <div className="card-footer d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        {t("myProfile.posted_on")}:{" "}
                        {new Date(item.created_at).toLocaleDateString()}
                      </small>
                      <div className="d-flex gap-2">
                         <button
           className="btn btn-outline-primary btn-sm"
                          onClick={() =>  handleSubscription(item.id)}
        >
         {t('SubscriptionRequest')} 
        </button>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleMarkAsSold(item.id)}
                          disabled={markingId === item.id || item.status === "sold"}
                        >
                          {markingId === item.id
                            ? t("myProfile.marking")
                            : t("myProfile.mark_as_sold")}
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteProduct(item.id)}
                          disabled={deletingId === item.id}
                        >
                          {deletingId === item.id
                            ? t("myProfile.deleting")
                            : t("myProfile.delete")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center text-muted py-5">
                {t("myProfile.no_products")}
              </div>
            )}
          </div>
        );

      case "survey":
        return (
         <div className="mt-4">
  <h5 className="mb-3 text-primary">{t("myProfile.survey_form")}</h5>
  <form onSubmit={handleSurveySubmit}>
    <div className="mb-3">
      <label className="form-label">{t("survey.age")} *</label>
      <input
        type="number"
        name="age"
        className="form-control"
        value={surveyData.age}
        onChange={handleSurveyChange}
        required
      />
    </div>
    <div className="mb-3">
      <label className="form-label">{t("survey.gender")} *</label>
      <select
        name="gender"
        className="form-select"
        value={surveyData.gender}
        onChange={handleSurveyChange}
        required
      >
        <option value="">{t("survey.select")}</option>
        <option value="male">{t("survey.male")}</option>
        <option value="female">{t("survey.female")}</option>
      </select>
    </div>
    <div className="mb-3">
      <label className="form-label">{t("survey.primary_medical_condition")}</label>
      <input
        type="text"
        name="primary_medical_condition"
        className="form-control"
        value={surveyData.primary_medical_condition}
        onChange={handleSurveyChange}
      />
    </div>
    <div className="mb-3">
      <label className="form-label">{t("survey.health_care_provider")}</label>
      <input
        type="text"
        name="health_care_provider"
        className="form-control"
        value={surveyData.health_care_provider}
        onChange={handleSurveyChange}
      />
    </div>
    <div className="mb-3">
      <label className="form-label">{t("survey.mobility_level")}</label>
      <input
        type="text"
        name="mobility_level"
        className="form-control"
        value={surveyData.mobility_level}
        onChange={handleSurveyChange}
      />
    </div>
    <div className="mb-3">
      <label className="form-label">{t("survey.medical_equipment")} *</label>
      <select
        name="medical_equipment"
        className="form-select"
        value={surveyData.medical_equipment}
        onChange={handleSurveyChange}
        required
      >
        <option value="">{t("survey.select")}</option>
        <option value="Hospital Beds & Stretchers">{t("survey.equipment.beds")}</option>
        <option value="Vital Signs & Monitoring Devices">{t("survey.equipment.monitoring")}</option>
        <option value="Mobility Support Equipment">{t("survey.equipment.mobility_support")}</option>
        <option value="Dental Care Equipment">{t("survey.equipment.dental")}</option>
        <option value="Basic Diagnostic Tools">{t("survey.equipment.diagnostics")}</option>
        <option value="Lab & Testing Devices">{t("survey.equipment.lab")}</option>
        <option value="Imaging & Radiology Devices">{t("survey.equipment.imaging")}</option>
        <option value="Respiratory Support Devices">{t("survey.equipment.respiratory")}</option>
        <option value="IV & Fluid Administration">{t("survey.equipment.iv_fluid")}</option>
        <option value="Sterilization & Disinfection Tools">{t("survey.equipment.sterilization")}</option>
        <option value="Emergency & Life Support Equipment">{t("survey.equipment.emergency")}</option>
        <option value="Rehabilitation & Therapy Tools">{t("survey.equipment.rehabilitation")}</option>
        <option value="Infant & Newborn Care">{t("survey.equipment.infant_care")}</option>
        <option value="others">{t("survey.equipment.others")}</option>
      </select>
    </div>
    <div className="mb-3">
      <label className="form-label">{t("survey.duration_of_need")} *</label>
      <input
        type="text"
        name="duration_of_need"
        className="form-control"
        value={surveyData.duration_of_need}
        onChange={handleSurveyChange}
        required
      />
    </div>
    <button
      type="submit"
      className="btn btn-primary"
      disabled={surveySubmitting}
    >
      {surveySubmitting ? t("survey.submitting") : t("submit")}
    </button>
  </form>
</div>

        );

      case "messages":
      case "orders":
      case "request":
      case "ai_suggestion":
        return(  
    <div className="row mt-4">
      {aiSuggestions.length > 0 ? (
        aiSuggestions.map((item) => (
          
          <div key={item.id} className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <img
                src={`${item.Main_image}`}
                alt={item.title}
                style={{ height: "200px", objectFit: "cover" }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultUser;
                }}
              />
              <div className="card-body d-flex flex-column justify-content-between">
                <div>
                  <h5 className="card-title">{item.title}</h5>
                  <p className="card-text">{item.desc}</p>
                  <p>
                    <strong>{t("myProfile.price")}:</strong> ${item.price}
                  </p>
                  <p>
                    <strong>{t("myProfile.category")}:</strong> {item.category}
                  </p>
                </div>
               
              </div>
              <div className="card-footer d-flex justify-content-between align-items-center">
                <div className="mt-3">
                {t("myProfile.availability")}: {item.available}
                </div>
                 <div className="mt-3">
                  <Link
                    to={`/EquipmentDetials/${item.id}`}
                    className="nav-link text-primary fw-bold p-0"
                    style={{ cursor: "pointer" }}
                  >
                    {t("details")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="col-12 text-center text-muted py-5">
          {t("myProfile.no_ai_suggestions")}
        </div>
      )}
    </div>

      );
        case "community":
        return (
          <p className="text-muted text-center mt-4">
            {t("myProfile.coming_soon", { component: t(`myProfile.${activeTab}`) })}
          </p>
        );

      case "wallet":
        return (
          <>
  <Link
  to="/WalletRecharge"
 
  className="btn btn-primary px-4 py-2 fw-semibold"
>
    {t('WalletRecharge')}
</Link>
           
          </>
         
        );

      default:
        return null;
    }
  };

  return (
    <>
    
     <Helmet>
        <title>{t('Profile')}</title>
      </Helmet>
    <div className="container py-5">
      <div className="card shadow-sm p-4 mb-4">
        <div className="d-flex align-items-center">
          {profile ? (
            renderUserInitial()
          ) : (
            <img
              src={defaultUser}
              alt="User"
              className="rounded-circle me-3"
              style={{ width: 60, height: 60, objectFit: "cover" }}
            />
          )}
          <div>
            <h4 className="mb-0">
              {profile
                ? `${profile.first_name} ${profile.last_name}`
                : t("myProfile.guest_user")}
            </h4>
            <p className="text-muted mb-1">
              {profile ? profile.role : t("myProfile.browsing_as_guest")}
            </p>
            <p className="text-muted small mb-0">{profile ? profile.address : ""}</p>
          </div>
        </div>
        {profile && (
          <div className="mt-3">
            <p><strong>{t("myProfile.email")}:</strong> {profile.email}</p>
            <p><strong>{t("myProfile.phone")}:</strong> {profile.phone}</p>
            <p><strong>{t("myProfile.wallet")}:</strong> ${profile.wallet}</p>
            <p><strong>{t("myProfile.joined")}:</strong> {new Date(profile.created_at).toLocaleDateString()}</p>
          </div>
        )}
      </div>

      {profile && (
        <ul className="nav nav-tabs mb-3">
          {["listings", "messages", "orders", "wallet", "request", "survey", "ai_suggestion", "community"].map((tab) => (
            <li className="nav-item" key={tab}>
              <button
                className={`nav-link ${activeTab === tab ? "active" : ""} text-muted fw-bold`}
                onClick={() => setActiveTab(tab)}
              >
                {t(`myProfile.${tab}`)}
              </button>
            </li>
          ))}
        </ul>
      )}

      {renderTabContent()}
    </div>
    </>
  );
}
