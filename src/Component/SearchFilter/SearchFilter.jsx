import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function FilteredProducts() {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); 

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  useEffect(() => {
    axios.get('/api') 
      .then((res) => {
        const all = Array.isArray(res.data.data) ? res.data.data : [];
        const valid = all.filter(
          (item) =>
            item?.available?.toLowerCase() === 'instock' &&
            item?.status?.toLowerCase() === 'accepted'
        );
        setAllProducts(valid);
        setFilteredProducts([]); 
        console.log(res)
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
      });
  }, []);

  const filterProducts = () => {
    let result = [...allProducts];

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
  };

  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedCondition('');
    setMinPrice('');
    setMaxPrice('');
    setSortOrder('asc');
    setFilteredProducts([]);
  };

  return (
    <div className={`bg-light py-4 px-3 shadow-sm border-bottom ${isArabic ? 'text-end' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="container mt-5 bg-white rounded-3 shadow p-4 p-md-5">
        <h2 className="mb-4">{t('filterProducts')}</h2>

        <div className="row g-3 mb-4">
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
              <option value="Brand New">{t('brandNew')}</option>
              <option value="Like New">{t('likeNew')}</option>
              <option value="Used- good">{t('usedGood')}</option>
              <option value="Used-needs repair">{t('usedNeedsRepair')}</option>
             
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

          <div className="col-md-1">
            <button className="btn btn-primary w-100" onClick={filterProducts}>
              {t('apply')}
            </button>
          </div>

          <div className="col-md-1">
            <button className="btn btn-outline-secondary w-100" onClick={resetFilters}>
              {t('reset')}
            </button>
          </div>
        </div>

        <div className="row">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div className="col-md-4 mb-4" key={product.id}>
                <div className="card h-100 shadow-sm">
                  <img
                    src={product.Main_image || 'https://via.placeholder.com/300x200'}
                    className="card-img-top"
                    alt={product.title || 'Product'}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div>
                      <h5 className="card-title">{product.title || t('noTitle')}</h5>
                      <p className="card-text mb-1">{t('category')}: {product.category || t('na')}</p>
                      <p className="card-text mb-1">{t('condition_2')}: {t(product.condition) || t('na')}</p>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <p className="card-text fw-bold mb-0">{t('price')}: {product.price || 0} EGP</p>
                      <Link
                        to={`/EquipmentDetials/${product.id}`}
                        className="nav-link text-primary fw-bold p-0"
                        style={{ cursor: 'pointer' }}
                      >
                        {t('details')}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-5 w-100">
              <h5>{t('noProductsFound')}</h5>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
