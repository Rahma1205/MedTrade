import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';

export default function AllOrders({ userData }) {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = userData?.access_token;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('/api/orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setOrders(data?.orders|| []);
        
      } catch {
        setError(t('orders.loadError'));
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
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
        <div>{t('orders.loading')}</div>
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
        <title>{t('orders.title')}</title>
      </Helmet>
    
   
    <div className="container mt-5 bg-white rounded-4 shadow p-4 p-md-5">
      <h2 className="mb-4 text-center text-primary fw-bold">
        {t('orders.title')}
      </h2>

      {orders.length === 0 ? (
        <p className="text-center text-muted fs-5">{t('orders.noOrders')}</p>
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
            {t('orders.listHeader')}
          </div>
          <div className="card-body p-0">
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th>{t('orders.orderId')}</th>
                  <th>{t('orders.userId')}</th>
                  <th>{t('orders.productId')}</th>
                  <th>{t('orders.condition')}</th>
                  <th>{t('orders.date')}</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="fw-semibold">{order.id}</td>
                    <td>{order.user_id}</td>
                    <td>{order.product_id}</td>
                    <td>
                      {order.condition === 'subscription'
                        ? t('orders.subscription')
                        : t('orders.payment')}
                    </td>
                    <td className="text-secondary">{formatDate(order.created_at)}</td>
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
