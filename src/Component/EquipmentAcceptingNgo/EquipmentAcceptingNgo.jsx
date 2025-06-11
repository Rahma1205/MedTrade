import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';

const conditionMap = {
  'Brand new': 'brandNew',
  'Like new': 'likeNew',
  'Used - good': 'usedGood',
  'Used - needs repair': 'usedNeedsRepair',
  'Not working': 'notWorking',
};

export default function EquipmentAcceptingNgo({ userData }) {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
const token = userData?.access_token;
  async function getProducts() {
    try {
      setIsLoading(true);
       const response = await axios.get('/api/dashboard', {
              headers: { Authorization: `Bearer ${token}` },
            });
      console.log(response);
      
            const pending = response.data.pending_donations || [];
            const filtered = pending.filter((item) => item.status === 'pending');
            setProducts(filtered);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAcceptProduct(id) {
    console.log(userData);
    
    try {
     const response = await axios.get(`/api/acceptdonate/${id}`, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
      if (response.data.message =="post accepted successfully") {
        getProducts();
        console.log(response.data.message);
        
      }
    } catch (error) {
      console.error('Failed to accept product:', error);
    }
  }

  useEffect(() => {
    getProducts();
  }, []);

  return (

   <>
      <Helmet>
        <title>{t('AcceptNgoRequest')}</title>
      </Helmet>

        <section className="py-5" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="container">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold fs-3 mb-0">{t('DonationRequests')}</h2>
              </div>
      
              {isLoading ? (
                <div className="row">
                  {[...Array(3)].map((_, index) => (
                    <div className="col-md-4 mb-4" key={index}>
                      <div className="card placeholder-glow">
                        <div
                          className="placeholder card-img-top bg-secondary"
                          style={{ height: '200px' }}
                        ></div>
                        <div className="card-body">
                          <h5 className="card-title placeholder col-6"></h5>
                          <p className="card-text placeholder col-12"></p>
                          <p className="card-text placeholder col-4"></p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="row">
                  {products.map((item) => (
                    <div className="col-md-4 mb-4" key={item.id}>
                      <div className="card h-100 shadow-sm custom-card-hover d-flex flex-column overflow-hidden">
                        <img
                          src={item.Main_image || '/images/no-image.png'}
                          className="card-img-top"
                          alt={item.title || item.name}
                          style={{ height: '200px', objectFit: 'cover' }}
                        />
                        <div className="card-body d-flex flex-column flex-grow-1">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h5 className="card-title mb-0">{item.title || item.name}</h5>
                            <p className="fw-bold text-primary mb-0">
                              {item.price ? `${item.price} EGP` : t('free')}
                            </p>
                          </div>
                          <p className="card-text mb-1">
                            <strong>{t('description')}:</strong>{' '}
                            {item.desc ? item.desc : t('noDescription')}
                          </p>
                          <p className="card-text mb-1">
                            <strong>{t('ngoName')}:</strong> {item.ngo_name}
                          </p>
                          <p className="card-text mb-1">
                            <strong>{t('quantity')}:</strong> {item.quantity}
                          </p>
                          <p className="card-text mb-3">
                            <strong>{t('status')}:</strong> {item.status}
                          </p>
      
                          <button
                           className="btn btn-success px-3 py-1 fw-semibold"
                            onClick={() => handleAcceptProduct(item.id)}
                          >
                              {t('AcceptEquipment')}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
      
             
            </div>
          </section>
    </>
  );
}
