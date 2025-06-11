import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';


export default function Footer() {
  const { t } = useTranslation();

  return (
    <>
     <footer className="bg-gray-800 text-gray-400 pt-5 pb-4">
      <div className="container">
        <div className="row">

          <div className="col-12 col-md-3 mb-4">
            <div className="d-flex align-items-center mb-3">
              <i className="fas fa-flask h-8 w-8 text-gray-400"></i>
              <span className="ms-2 fw-bold fs-5 text-white">{t("medtrade")}</span>
            </div>
            <p className="text-gray-400 mb-4">{t("footerDescription")}</p>
            <div className="d-flex">
              <Link to="#" className="text-gray-400 me-3 white-hover">
                <i className="fa-brands fa-twitter"></i>
              </Link>
              <Link to="#" className="text-gray-400 me-3 white-hover">
                <i className="fa-brands fa-facebook white-hover"></i>
              </Link>
              <Link to="#" className="text-gray-400 me-3 white-hover">
                <i className="fa-brands fa-instagram"></i>
              </Link>
              <Link to="#" className="text-gray-400 me-3 white-hover">
                <i className="fa-brands fa-linkedin"></i>
              </Link>
            </div>
          </div>

          <div className="col-12 col-md-3 mb-4">
            <h6 className="font-weight-bold mb-4 text-white">{t("services")}</h6>
            <ul className="list-unstyled">
              <li><Link to="/browse" className="text-gray-400 text-decoration-none white-hover">{t("buyEquipment")}</Link></li>
              <li><Link to="/create-listing" className="text-gray-400 text-decoration-none white-hover">{t("sellEquipment")}</Link></li>
              <li><Link to="/browse?type=donate" className="text-gray-400 text-decoration-none white-hover">{t("donateEquipment")}</Link></li>
              <li><Link to="#" className="text-gray-400 text-decoration-none white-hover">{t("equipmentValuation")}</Link></li>
              <li><Link to="#" className="text-gray-400 text-decoration-none white-hover">{t("sustainabilityReports")}</Link></li>
            </ul>
          </div>

          <div className="col-12 col-md-3 mb-4">
            <h6 className="font-weight-bold mb-4 text-white">{t("company")}</h6>
            <ul className="list-unstyled">
              <li><Link to="#" className="text-gray-400 text-decoration-none white-hover">{t("aboutUs")}</Link></li>
              <li><Link to="#" className="text-gray-400 text-decoration-none white-hover">{t("ourMission")}</Link></li>
              <li><Link to="#" className="text-gray-400 text-decoration-none white-hover">{t("blog")}</Link></li>
              <li><Link to="#" className="text-gray-400 text-decoration-none white-hover">{t("press")}</Link></li>
              <li><Link to="#" className="text-gray-400 text-decoration-none white-hover">{t("careers")}</Link></li>
            </ul>
          </div>

          <div className="col-12 col-md-3 mb-4">
            <h6 className="font-weight-bold mb-4 text-white">{t("support")}</h6>
            <ul className="list-unstyled">
              <li><Link to="#" className="text-gray-400 text-decoration-none white-hover">{t("contactUs")}</Link></li>
              <li><Link to="#" className="text-gray-400 text-decoration-none white-hover">{t("faqs")}</Link></li>
              <li><Link to="#" className="text-gray-400 text-decoration-none white-hover">{t("shippingInfo")}</Link></li>
              <li><Link to="#" className="text-gray-400 text-decoration-none white-hover">{t("privacyPolicy")}</Link></li>
              <li><Link to="#" className="text-gray-400 text-decoration-none white-hover">{t("termsOfService")}</Link></li>
            </ul>
          </div>

        </div>

        <div className="row">
          <div className="col-12 text-center border-top border-dark-subtle mt-4 pt-4">
            <p className="text-gray-400 small">
              &copy; {new Date().getFullYear()} {t("medtrade")}. {t("copyright")}
            </p>
          </div>
        </div>
      </div>
    </footer>

      {/* <div className="position-fixed bottom-0 end-0 mb-4 me-4" style={{ zIndex: 99999 }}>
  <button  className="btn btn-primary rounded-circle p-3 position-relative">
    <i className="fa-solid fa-headset position-relative"></i>
    <span className="position-absolute top-25 end-25 translate-middle p-1 bg-success rounded-circle border border-success" style={{ transform: 'translate(-25%, -25%)' }}></span>
  </button>
</div> */}

    </>
  );
}
