import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import work from '../../Assets/Images/download.jpg';

export default function HowItWork() {
  const { t } = useTranslation();

 

  return (
    <section className="py-5 bg-light">
      <div className="container px-4">
        <div className="text-center mb-4">
          <h2 className="h3 fw-bold text-dark mb-4">
            {t('howItWork.title')}
          </h2>
          <p className="text-muted mx-auto" style={{ maxWidth: "700px" }}>
            {t('howItWork.description')}
          </p>
        </div>

        <div className="row row-cols-1 row-cols-md-3 g-4">
          <div className="col text-center">
            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: "64px", height: "64px" }}>
              <i className="fas fa-home fa-lg"></i>
            </div>
            <h3 className="h5 fw-semibold mb-2">{t('howItWork.steps.list.title')}</h3>
            <p className="text-muted">
              {t('howItWork.steps.list.description')}
            </p>
          </div>

          <div className="col text-center">
            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: "64px", height: "64px" }}>
              <i className="fas fa-search fa-lg"></i>
            </div>
            <h3 className="h5 fw-semibold mb-2">{t('howItWork.steps.connect.title')}</h3>
            <p className="text-muted">
              {t('howItWork.steps.connect.description')}
            </p>
          </div>

          <div className="col text-center">
            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: "64px", height: "64px" }}>
              <i className="fas fa-shield-alt fa-lg"></i>
            </div>
            <h3 className="h5 fw-semibold mb-2">{t('howItWork.steps.secure.title')}</h3>
            <p className="text-muted">
              {t('howItWork.steps.secure.description')}
            </p>
          </div>
        </div>

        <div className="mt-5 bg-white rounded-3 shadow p-4 p-md-5">
          <div className="d-flex flex-column flex-md-row align-items-center">
            <div className="col-md-7 mb-4 mb-md-0 pr-md-5">
              <h3 className="h4 fw-bold mb-3">{t('howItWork.ready.title')}</h3>
              <p className="text-muted mb-4">
                {t('howItWork.ready.description')}
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3">
                <Link to="/SignUp">
                  <button className="btn btn-primary py-3 px-5 w-100 w-sm-auto">
                    {t('howItWork.ready.createAccount')}
                  </button>
                </Link>
                <Link to="/">
                  <button className="btn btn-outline-secondary py-3 px-5 w-100 w-sm-auto">
                    {t('howItWork.ready.learnMore')}
                  </button>
                </Link>
              </div>
            </div>
            <div className="col-md-5 ms-3">
              <img
                src={work}
                alt={t('howItWork.title')}
                className="img-fluid rounded-lg shadow-sm w-100"
                style={{ maxWidth: '400px', height: 'auto' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
