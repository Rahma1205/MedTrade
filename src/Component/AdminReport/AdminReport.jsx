import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';

export default function AdminReport({ userData }) {
  const { t } = useTranslation();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = userData?.access_token;

  useEffect(() => {
   

    const fetchReports = async () => {
      try {
        const { data } = await axios.get('/api/displayreport', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReports(data);
      } catch {
        setError(t('report.loadError'));
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [userData, navigate, token, t]);

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status" />
        <div>{t('report.loading')}</div>
      </div>
    );

  if (error)
    return (
      <div className="alert alert-danger text-center mt-5" role="alert">
        {error}
      </div>
    );

  return (

    <>
    
      <Helmet>
        <title>{t('report.title')}</title>
      </Helmet>
    
    
    <div className="container mt-5 bg-white rounded-4 shadow p-4 p-md-5">
      <h2 className="mb-4 text-center text-primary fw-bold">{t('report.title')}</h2>

      {reports.length === 0 ? (
        <p className="text-center text-muted fs-5">{t('report.noReports')}</p>
      ) : (
        <div className="card shadow-sm border-0">
          <div
            className="card-header text-white fs-5"
            style={{
              background:
                'linear-gradient(90deg, #0d6efd 0%, rgba(13, 110, 253, 0.7) 70%, rgba(13, 110, 253, 0) 100%)',
              borderRadius: '0.375rem 0.375rem 0 0',
              fontWeight: '600',
            }}
          >
            {t('report.listHeader')}
          </div>
          <div className="card-body p-0">
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th scope="col">{t('report.user')}</th>
                  <th scope="col">{t('report.report')}</th>
                  <th scope="col">{t('report.createdAt')}</th>
                </tr>
              </thead>
              <tbody>
                {reports.map(({ id, user_id, report, created_at }) => (
                  <tr key={id} style={{ cursor: 'default' }}>
                    <td className="fw-semibold">{user_id}</td>
                    <td>{report}</td>
                    <td className="text-secondary">{formatDate(created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
