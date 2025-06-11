import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';

const conditionMap = {
  "Brand new": "brandNew",
  "Like new": "likeNew",
  "Used - good": "usedGood",
  "Used - needs repair": "usedNeedsRepair",
  "Not working": "notWorking"
};

export default function EquipmentListing() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  async function getProducts() {
    try {
      setIsLoading(true);
      const response = await axios.get('/api');
      const filtered = (response.data.data || []).filter(
        (item) => item.available === 'inStock' && item.status === 'accepted'
      );
      setProducts(filtered);
      setFilteredProducts(filtered);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getProducts();
  }, []);

  
  useEffect(() => {
    let result = [...products];

    if (selectedCategory) {
      result = result.filter(
        (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (selectedCondition) {
      result = result.filter(
        (p) => p.condition?.toLowerCase() === selectedCondition.toLowerCase()
      );
    }

    if (minPrice !== '') {
      result = result.filter((p) => parseFloat(p.price || 0) >= parseFloat(minPrice));
    }

    if (maxPrice !== '') {
      result = result.filter((p) => parseFloat(p.price || 0) <= parseFloat(maxPrice));
    }

    if (sortOrder === 'asc') {
      result.sort((a, b) => parseFloat(a.price || 0) - parseFloat(b.price || 0));
    } else {
      result.sort((a, b) => parseFloat(b.price || 0) - parseFloat(a.price || 0));
    }

    setFilteredProducts(result);
  }, [selectedCategory, selectedCondition, minPrice, maxPrice, sortOrder, products]);

  return (

    <>
    
     <Helmet>
        <title>{t('featuredEquipment')}</title>
      </Helmet>
    <section className="py-5" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="container">

     
        <div className="bg-white rounded-3 shadow-sm p-4 mb-5">
          <h4 className="mb-3">{t('filterProducts')}</h4>
          <div className="row g-3">
            <div className="col-md-2">
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">{t('allCategories')}</option>
                <option value="Mobility Support Equipment">{t('mobilitySupport')}</option>
                <option value="Emergency & Life Support Equipment">{t('emergencySupport')}</option>
                <option value="Hospital Beds & Stretchers">{t('hospitalBeds')}</option>
                <option value="Respiratory Support Devices">{t('respiratorySupport')}</option>
                <option value="Lab & Testing Devices">{t('labTesting')}</option>
                <option value="Vital Signs & Monitoring Devices">{t('vitalSigns')}</option>
                <option value="Rehabilitation & Therapy Tools">{t('rehabilitation')}</option>
                <option value="Dental Care Equipment">{t('dentalCare')}</option>
              </select>
            </div>

            <div className="col-md-2">
              <select
                className="form-select"
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
              >
                <option value="">{t('allConditions')}</option>
                <option value="Brand new">{t('brandNew')}</option>
                <option value="Like new">{t('likeNew')}</option>
                <option value="Used - good">{t('usedGood')}</option>
                <option value="Used - needs repair">{t('usedNeedsRepair')}</option>
              </select>
            </div>

            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                placeholder={t('minPrice')}
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>

            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                placeholder={t('maxPrice')}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>

            <div className="col-md-2">
              <select
                className="form-select"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="asc">{t('priceLowToHigh')}</option>
                <option value="desc">{t('priceHighToLow')}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold fs-3 mb-0">{t('allEquipment')}</h2>
        </div>

        {isLoading ? (
          <div className="row">
            {[...Array(3)].map((_, index) => (
              <div className="col-md-4 mb-4" key={index}>
                <div className="card placeholder-glow">
                  <div className="placeholder card-img-top bg-secondary" style={{ height: "200px" }}></div>
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
            {filteredProducts.length > 0 ? (
              filteredProducts.map((item) => (
                <div className="col-md-4 mb-4" key={item.id}>
                  <div className="card h-100 shadow-sm custom-card-hover d-flex flex-column overflow-hidden">
                    <img
                      src={item.Main_image}
                      className="card-img-top"
                      alt={item.title}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <div className="card-body d-flex flex-column flex-grow-1">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="card-title mb-0">{item.title}</h5>
                        <p className="fw-bold text-primary mb-0">
                          {item.price ? `${item.price} EGP` : t('free')}
                        </p>
                      </div>
                      <p className="card-text text-truncate">{item.desc}</p>

                      <p className="mb-2 text-muted small">
                        {t(`condition.${conditionMap[item.condition] || 'brandNew'}`)}
                      </p>

                      <div
                        className="mt-auto"
                        style={{ textAlign: isArabic ? 'left' : 'right' }}
                      >
                        <Link
                          to={`/EquipmentDetials/${item.id}`}
                          className="nav-link text-primary fw-bold p-0"
                          style={{ cursor: "pointer" }}
                        >
                          {t('details')}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-5">
                <h5>{t('noProductsFound')}</h5>
              </div>
            )}
          </div>
        )}
      </div>
    </section>

    </>
  );
}
