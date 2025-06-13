import React from 'react'
import { useTranslation } from 'react-i18next'

export default function Help() {
  const { t } = useTranslation();

  return (
    <div className="bg-light py-4 px-3 shadow-sm border-bottom">
      <div className="container mt-5 bg-white rounded-3 shadow p-4 p-md-5">
        <div className="row justify-content-start ">
          <div className="col-md-8">
            <h1 className="mb-2 fw-bold text-dark">{t('help.title')}</h1>
            <p className="text-muted fs-5">
              {t('help.description')}{' '}
              <a
                href="mailto:support@example.com"
                className="text-primary text-decoration-underline"
              >
                MedTrade@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
