import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function SignUpAction() {
  const { t } = useTranslation();



  return (
    <section
      className="py-5"
      style={{
        background: "linear-gradient(to right, #0d6efd 0%, rgba(13, 110, 253, 0) 100%)",
        
      }}
    >
      <div className="container py-5">
        <h2 className="display-5 fw-bold text-white mb-4">
          {t("signUpAction.title")}
        </h2>
        <p className="lead text-white opacity-75 mb-5 mx-auto" style={{ maxWidth: "600px" }}>
          {t("signUpAction.description")}
        </p>
        <div className={`d-flex flex-column flex-sm-row justify-content-center gap-3 `}>
          <Link to="/SignUp">
            <button className="btn btn-light text-primary fw-semibold px-4 py-2">
              <i className="fas fa-user-plus me-2"></i> {t("signUpAction.signUpNow")}
            </button>
          </Link>
          <Link to="/">
            <button className="btn btn-outline-light fw-semibold px-4 py-2">
              <i className="fas fa-envelope me-2"></i> {t("signUpAction.contactUs")}
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
