import { useTranslation } from "react-i18next";

export default function ImpactMetrics() {
  const { t } = useTranslation();

  const formatNumber = (num: number, decimals = 0) => {
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(decimals)}K`;
    }
    return num.toLocaleString();
  };

  return (
    <section
      className="py-5 bg-white"
     
    >
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold">{t("impact.title")}</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: "600px" }}>
            {t("impact.description")}
          </p>
        </div>

        <div className="row g-4">
          <div className="col-md-4 text-center">
            <div className="impact-metric p-4 border rounded shadow-sm h-100 hover-animation bg-light-color">
              <div
                className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: "60px", height: "60px" }}
              >
                <i className="fas fa-dollar-sign text-primary fs-3"></i>
              </div>
              <h3 className="fw-bold text-primary">{formatNumber(2500000)}</h3>
              <p className="text-muted">{t("impact.equipmentValue")}</p>
            </div>
          </div>

          <div className="col-md-4 text-center">
            <div className="impact-metric p-4 border rounded shadow-sm h-100 hover-animation bg-light-color">
              <div
                className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: "60px", height: "60px" }}
              >
                <i className="fas fa-globe text-success fs-3"></i>
              </div>
              <h3 className="fw-bold text-success">{formatNumber(15000, 0)}</h3>
              <p className="text-muted">{t("impact.co2Emissions")}</p>
            </div>
          </div>

          <div className="col-md-4 text-center">
            <div className="impact-metric p-4 border rounded shadow-sm h-100 hover-animation bg-light-color">
              <div
                className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: "60px", height: "60px" }}
              >
                <i className="fas fa-building text-warning fs-3"></i>
              </div>
              <h3 className="fw-bold text-warning">{formatNumber(325)}</h3>
              <p className="text-muted">{t("impact.medicalFacilities")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
