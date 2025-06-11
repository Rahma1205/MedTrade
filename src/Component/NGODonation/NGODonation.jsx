import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import toast from "react-hot-toast";


export default function DonationForm({userData}) {
  
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    ngo_name: "",
    name: "",
    desc: "",
    quantity: 1,
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

  
    try {
      const data = new FormData();
      data.append("ngo_name", formData.ngo_name);
      data.append("name", formData.name);
      data.append("desc", formData.desc);
      data.append("quantity", formData.quantity);

     
      if (imageFile) data.append("image", imageFile);


      const response = await axios.post(
        "/api/donate",
        data,
        {
          headers: {
            Authorization: `Bearer ${userData.access_token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data?.message) {
        setIsSuccess(true);
        setMessage(response.data.message);
        toast.success(response.data.message);
        resetForm();
      } else {
        setIsSuccess(true);
        setMessage(t("donationForm.success") || "Donation submitted successfully.");
        toast.success("Donation submitted successfully.");
        resetForm();
      }
    } catch (error) {
      console.error(error);
      setIsSuccess(false);
      setMessage(t("donationForm.error") || "Failed to submit donation.");
      toast.error("Failed to submit donation.");
    } finally {
      setLoading(false);
    }
  };


  const resetForm = () => {
    setFormData({ ngo_name: "", name: "", desc: "", quantity: 1 });
    setImageFile(null);
    setPreviewImage(null);
  };

  return (
    
    <div className="bg-light py-4 px-3 shadow-sm border-bottom">
      <div className="container mt-5 bg-white rounded-3 shadow p-4 p-md-5">
        <h3 className="mb-4">{t("donationForm.header") || "NGO Donation Request"}</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="ngo_name" className="form-label">
              {t("donationForm.ngoName")} <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              id="ngo_name"
              name="ngo_name"
              className="form-control"
              value={formData.ngo_name}
              onChange={handleInputChange}
              required
            />
          </div>

         
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              {t("donationForm.itemName")} <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          
          <div className="mb-3">
            <label htmlFor="desc" className="form-label">
              {t("donationForm.description")} <span className="text-danger">*</span>
            </label>
            <textarea
              id="desc"
              name="desc"
              className="form-control"
              value={formData.desc}
              onChange={handleInputChange}
              rows={4}
              required
            />
          </div>

        
          <div className="mb-3">
            <label htmlFor="quantity" className="form-label">
              {t("donationForm.quantity")} <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              className="form-control"
              value={formData.quantity}
              onChange={handleInputChange}
              min="1"
              required
            />
          </div>

        
          <div className="mb-3">
            <label htmlFor="image" className="form-label">
              {t("donationForm.image")}
            </label>
            <input
              type="file"
              id="image"
              className="form-control"
              onChange={handleImageChange}
              accept="image/png, image/jpg, image/jpeg"
            />
          </div>

          
          {previewImage && (
            <div className="mb-3">
              <img
                src={previewImage}
                alt="Preview"
                className="img-thumbnail"
                style={{ maxHeight: "200px" }}
              />
            </div>
          )}

         
          <div className="d-flex gap-2">
            <button
              type="submit"
              className="btn btn-outline-primary flex-grow-1 py-2 fw-semibold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin me-2"></i> {t("donationForm.loading")}
                </>
              ) : (
                t("donationForm.submit") || "Submit"
              )}
            </button>

            <Link
              to="/"
              className="btn btn-outline-secondary flex-grow-1 py-2 fw-semibold"
              onClick={resetForm}
              disabled={loading}
            >
              {t("donationForm.cancel") || "Cancel"}
            </Link>
          </div>

          
          {message && (
            <div className={`alert mt-3 ${isSuccess ? "alert-success" : "alert-danger"}`} role="alert">
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
