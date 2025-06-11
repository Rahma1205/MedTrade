import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';

export default function SubscriptionPage({ userData }) {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = userData?.access_token;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await axios.get('/api/subscriptionPage', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(data.user_data);
      } catch {
        setError(t('subscription.error') || 'Failed to load subscription data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token, t]);

  if (loading)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status" />
        <div>{t('subscription.loading') || 'Loading subscription...'}</div>
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
        <title>{t('subscription.title')}</title>
      </Helmet>
    <div className="container mt-5 bg-white rounded-4 shadow p-4 p-md-5">
      <h2 className="mb-4 text-center text-primary fw-bold">
        {t('subscription.title') || 'Subscription Information'}
      </h2>

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
          {t('subscription.detailsHeader') || 'User Subscription Details'}
        </div>
        <div className="card-body p-0">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>{t('subscription.id') || 'ID'}</th>
                <th>{t('subscription.name') || 'Name'}</th>
                <th>{t('subscription.email') || 'Email'}</th>
                <th>{t('subscription.phone') || 'Phone'}</th>
                <th>{t('subscription.wallet') || 'Wallet'}</th>
                <th>{t('subscription.address') || 'Address'}</th>
                <th>{t('subscription.city') || 'City'}</th>
                <th>{t('subscription.country') || 'Country'}</th>
                <th>{t('subscription.created_at') || 'Created At'}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="fw-semibold">{user.id}</td>
                <td>{user.first_name} {user.last_name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.wallet}</td>
                <td>{user.address}</td>
                <td>{user.city}</td>
                <td>{user.country}</td>
                <td className="text-secondary">
                  {new Date(user.created_at).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </>
  );
}
