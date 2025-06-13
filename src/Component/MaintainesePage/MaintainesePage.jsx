import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";

function MaintainesePage({userData}) {
  const { t } = useTranslation();

  const token = userData?.access_token;

  const formik = useFormik({
    initialValues: {
      title: "",
      product_desc: "",
      problem_desc: "",
      phone: "",
      address: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      problem_desc: Yup.string().required("Problem description is required"),
      phone: Yup.string().required("Phone is required"),
      address: Yup.string().required("Address is required"),
    }),
   onSubmit: async (values, { resetForm }) => {

      const fee = 300;
  const userWallet = userData?.wallet || 0;
  const checkOut = userWallet - fee;

  if (checkOut < 0) {
    alert("You don't have enough balance to subscribe.");
    return;
  }
  const userConfirmed = window.confirm("The maintenance fee is 300 EGP. Do you want to proceed?");
  if (!userConfirmed) {
    return; 
  }

  try {
    const { data } = await axios.post(
      "/api/makemaintenance",
      values,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (data.message === 'Maintenance requested successfully') {
      toast.success("Request sent successfully");
      resetForm();
    }
  } catch (error) {
    toast.error("Failed to send maintenance request");
    console.error(error);
  }
}

  });

  return (
    <>
    
   <Helmet>
        <title>{t('maintenanceRequest')}</title>
      </Helmet>

     <div className="bg-light py-4 px-3 shadow-sm border-bottom">
      <div className="container mt-5 bg-white rounded-3 shadow p-4 p-md-5">
      <h2 className="mb-4 text-center">{t("maintenanceRequest")}</h2>
      <form onSubmit={formik.handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label className="form-label">{t("title")}</label>
          <input
            type="text"
            name="title"
            className={`form-control ${formik.touched.title && formik.errors.title ? "is-invalid" : ""}`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.title}
          />
          {formik.touched.title && formik.errors.title && (
            <div className="invalid-feedback">{formik.errors.title}</div>
          )}
        </div>

        <div className="col-md-6">
          <label className="form-label">{t("productDesc")}</label>
          <input
            type="text"
            name="product_desc"
            className="form-control"
            onChange={formik.handleChange}
            value={formik.values.product_desc}
          />
        </div>

        <div className="col-md-12">
          <label className="form-label">{t("problemDesc")}</label>
          <textarea
            name="problem_desc"
            rows="3"
            className={`form-control ${formik.touched.problem_desc && formik.errors.problem_desc ? "is-invalid" : ""}`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.problem_desc}
          ></textarea>
          {formik.touched.problem_desc && formik.errors.problem_desc && (
            <div className="invalid-feedback">{formik.errors.problem_desc}</div>
          )}
        </div>

        <div className="col-md-6">
          <label className="form-label">{t("phone")}</label>
          <input
            type="text"
            name="phone"
            className={`form-control ${formik.touched.phone && formik.errors.phone ? "is-invalid" : ""}`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.phone}
          />
          {formik.touched.phone && formik.errors.phone && (
            <div className="invalid-feedback">{formik.errors.phone}</div>
          )}
        </div>

        <div className="col-md-6">
          <label className="form-label">{t("address")}</label>
          <input
            type="text"
            name="address"
            className={`form-control ${formik.touched.address && formik.errors.address ? "is-invalid" : ""}`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.address}
          />
          {formik.touched.address && formik.errors.address && (
            <div className="invalid-feedback">{formik.errors.address}</div>
          )}
        </div>

        <div className="col-12 text-center">
          <button type="submit" className="btn btn-primary px-5">
            {t("submitRequest")}
          </button>
        </div>
      </form>
              </div>
              </div>

</>
  );
}

export default MaintainesePage;
