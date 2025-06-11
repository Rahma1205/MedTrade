import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';

export default function AdminMaintenance({ userData }) {
  const { t } = useTranslation();
  const [maintenanceList, setMaintenanceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = userData?.access_token;

  useEffect(() => {
    const fetchMaintenance = async () => {
      try {
        const { data } = await axios.get('/api/displayMaintenance', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMaintenanceList(data.user_data || []);
      } catch {
        setError(t('maintenance.loadError'));
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenance();
  }, [token, t]);

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
        <div>{t('maintenance.loading')}</div>
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
        <title>{t('maintenance.header')}</title>
      </Helmet>
   
    <div className="container mt-5 bg-white rounded-4 shadow p-4 p-md-5">
      <h2 className="mb-4 text-center text-primary fw-bold">{t('maintenance.header')}</h2>

      {maintenanceList.length === 0 ? (
        <p className="text-center text-muted fs-5">{t('maintenance.noRequests')}</p>
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
            {t('maintenance.listHeader')}
          </div>
          <div className="card-body p-0">
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th>{t('maintenance.user')}</th>
                  <th>{t('maintenance.title')}</th>
                  <th>{t('maintenance.address')}</th>
                  <th>{t('maintenance.phone')}</th>
                  <th>{t('maintenance.productDesc')}</th>
                  <th>{t('maintenance.problemDesc')}</th>
                  <th>{t('maintenance.createdAt')}</th>
                </tr>
              </thead>
              <tbody>
                {maintenanceList.map((item) => (
                  <tr key={item.id}>
                    <td className="fw-semibold">
                      {item.user?.first_name} {item.user?.last_name}
                    </td>
                    <td>{item.title}</td>
                    <td>{item.address}</td>
                    <td>{item.phone}</td>
                    <td>{item.product_desc}</td>
                    <td>{item.problem_desc}</td>
                    <td className="text-secondary">{formatDate(item.created_at)}</td>
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
