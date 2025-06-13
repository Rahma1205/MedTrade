import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';

export default function Inspection() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t('inspection.title')}</title>
      </Helmet>

      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="container  rounded-3 p-4 p-md-5 " style={{ maxWidth: '500px', width: '100%' }}>
          <div className="card shadow rounded-4 p-4">
            <div className="card-body text-center">
              <h2 className="card-title mb-3">🔍 {t('inspection.heading')}</h2>
              <p className="card-text fs-5">{t('inspection.description')}</p>
              <p className="fw-bold fs-4 text-success">{t('inspection.fee')}</p>
              <p className="mb-4">{t('inspection.contactMessage')}</p>
              <a href="mailto:MedTrade@gmail.com" className="btn btn-primary px-4">
                {t('inspection.contactButton')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
