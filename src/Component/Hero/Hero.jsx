import { Link } from "react-router-dom";
import HeroPhoto from '../../Assets/Images/16x9_M.jpg';
import { useTranslation } from "react-i18next";

export default function Hero({userData}) {
  const { t } = useTranslation();

  return (
    <section
      className="py-5"
      style={{
        background: 'linear-gradient(to right, #0d6efd 0%, rgba(13, 110, 253, 0) 100%)',
        border: 'none',
      }}
    >
      <div className="container py-5">
        <div
          className="row align-items-center gy-2 justify-content-between"
         
        >
         
          <div
            className={`col-md-6 text-white mb-4 mb-md-0 `}
          >
            <h1 className="display-4 fw-bold mb-3">
              {t("hero.title")}
            </h1>
            <p className="lead opacity-75 mb-4">
              {t("hero.description")}
            </p>
            <div
              className={`d-flex flex-column flex-sm-row gap-3 `}
            >
              <Link to="/EquipmentListing">
                <button className="btn btn-light text-primary fw-semibold px-4 py-2">
                  {t("hero.browseButton")}
                </button>
              </Link>

              {userData?(
                <Link to="/AddEquipment">
                <button className="btn btn-outline-light fw-semibold px-4 py-2">
                  {t("hero.listButton")}
                </button>
              </Link>
            ):
            (<Link to="/SignIn">
                <button className="btn btn-outline-light fw-semibold px-4 py-2">
                  {t("hero.listButton")}
                </button>
              </Link>)}
              
            </div>
          </div>

         
          <div className="col-md-6 text-center mt-4 mt-md-0">
            <img
              src={HeroPhoto}
              alt={t("hero.title")}
              className="img-fluid rounded shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
