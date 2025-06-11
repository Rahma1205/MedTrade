import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function AddEquipmentDonate() {
  const { t, i18n } = useTranslation();

  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    price: 0,
    condition: "",
    category: "",
    donation: "yes",
    mainImage: null,
    images: [null, null, null, null, null, null],
  });

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMainImageChange = (e) => {
    setFormData((prev) => ({ ...prev, mainImage: e.target.files[0] }));
  };

  const handleOptionalImageChange = (index, file) => {
    const newImages = [...formData.images];
    newImages[index] = file;
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      desc: "",
      price: 0,
      condition: "",
      category: "",
      donation: "yes",
      mainImage: null,
      images: [null, null, null, null, null, null],
    });
    setMessage("");
    setIsSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.mainImage) {
      setMessage(t("addequipment.mainImageRequired"));
      setIsSuccess(false);
      return;
    }

    setLoading(true);
    setMessage("");
    setIsSuccess(null);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("desc", formData.desc);
      data.append("price", formData.price);
      data.append("condition", formData.condition);
      data.append("category", formData.category);
      data.append("donation", formData.donation);
      data.append("Main_image", formData.mainImage);
      formData.images.forEach((img, idx) => {
        if (img) data.append(`image${idx + 1}`, img);
      });

      const userToken = localStorage.getItem("userToken");

      const response = await axios.post(
        "/api/insertProduct",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (response.status === 200) {
        setMessage(response.data.message || t("addequipment.success"));
        setIsSuccess(true);
        resetForm();
        e.target.reset();
      } else {
        setMessage(response.data.message || t("addequipment.error"));
        setIsSuccess(false);
      }
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || t("addequipment.somethingWrong"));
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (

    <>
    
      <Helmet>
        <title>{t('addEquipment')}</title>
      </Helmet>
    
    <div className="container mt-5 bg-white rounded shadow p-4">
      <h3 className="mb-4">{t("addequipment.title")}</h3>

      <form onSubmit={handleSubmit}>

        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            {t("addequipment.titleLabel")} <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleInputChange}
            placeholder={t("addequipment.titlePlaceholder")}
            required
          />
        </div>


        <div className="mb-3">
          <label htmlFor="desc" className="form-label">
            {t("addequipment.descLabel")} <span className="text-danger">*</span>
          </label>
          <textarea
            id="desc"
            name="desc"
            className="form-control"
            value={formData.desc}
            onChange={handleInputChange}
            placeholder={t("addequipment.descPlaceholder")}
            rows={4}
            required
          />
        </div>

       

        <div className="mb-3">
          <label htmlFor="condition" className="form-label">
            {t("addequipment.conditionLabel")} <span className="text-danger">*</span>
          </label>
          <select
            id="condition"
            name="condition"
            className="form-select"
            value={formData.condition}
            onChange={handleInputChange}
            required
          >
            <option value="">{t("addequipment.conditionPlaceholder")}</option>
            <option value="Brand New">{t("addequipment.condition.brandNew")}</option>
            <option value="Like New">{t("addequipment.condition.likeNew")}</option>
            <option value="Used- good">{t("addequipment.condition.usedGood")}</option>
            <option value="Used-needs repair">{t("addequipment.condition.usedNeedsRepair")}</option>
          </select>
        </div>


        <div className="mb-3">
          <label htmlFor="category" className="form-label">
            {t("addequipment.categoryLabel")} <span className="text-danger">*</span>
          </label>
          <select
            id="category"
            name="category"
            className="form-select"
            value={formData.category}
            onChange={handleInputChange}
            required
          >
            <option value="">{t("addequipment.categoryPlaceholder")}</option>
            <option value="Hospital Beds & Stretchers">{t("addequipment.categories.beds")}</option>
            <option value="Vital Signs & Monitoring Devices">{t("addequipment.categories.vital")}</option>
            <option value="Mobility Support Equipment">{t("addequipment.categories.mobility")}</option>
            <option value="Dental Care Equipment">{t("addequipment.categories.dental")}</option>
            <option value="Lab & Testing Devices">{t("addequipment.categories.lab")}</option>
            <option value="Respiratory Support Devices">{t("addequipment.categories.respiratory")}</option>
            <option value="Emergency & Life Support Equipment">{t("addequipment.categories.emergency")}</option>
            <option value="Rehabilitation & Therapy Tools">{t("addequipment.categories.rehabilitation")}</option>
          </select>
        </div>


        <div className="mb-3">
          <label htmlFor="mainImage" className="form-label">
            {t("addequipment.mainImageLabel")} <span className="text-danger">*</span>
          </label>
          <input
            type="file"
            id="mainImage"
            className="form-control"
            onChange={handleMainImageChange}
            accept="image/png, image/jpg, image/jpeg"
            required
          />
        </div>


        {formData.images.map((img, index) => (
          <div className="mb-3" key={index}>
            <label htmlFor={`image${index + 1}`} className="form-label">
              {t("addequipment.optionalImage", { num: index + 1 })}
            </label>
            <input
              type="file"
              id={`image${index + 1}`}
              className="form-control"
              onChange={(e) => handleOptionalImageChange(index, e.target.files[0])}
              accept="image/png, image/jpg, image/jpeg"
            />
          </div>
        ))}

   
        <div className="d-flex gap-2">
          <button
            type="submit"
            className="btn btn-outline-primary flex-grow-1 py-2 fw-semibold"
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin me-2"></i> {t("addequipment.loading")}
              </>
            ) : (
              t("addequipment.submit")
            )}
          </button>

          <Link
            to="/"
            className="btn btn-outline-secondary flex-grow-1 py-2 fw-semibold"
            onClick={resetForm}
            disabled={loading}
          >
            {t("addequipment.cancel")}
          </Link>
        </div>

        {message && (
          <div className={`alert mt-3 ${isSuccess ? "alert-success" : "alert-danger"}`} role="alert">
            {message}
          </div>
        )}
      </form>
    </div>
    </>
  );
}
