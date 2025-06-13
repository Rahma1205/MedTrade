import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function NavBar({ userData, Logout }) {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-white fixed-top">
        <div className="container-fluid">
          <div className="pe-2 ms-5">
            <i className="fas fa-flask h-8 w-8 text-primary"></i>
          </div>
          <Link className="navbar-brand display-2 fw-bold text-primary" to="/">
            MedTrade
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse mx-auto" id="navbarNav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <Link className="nav-link active text-dark primary-hover" to="/">
                  {t('home')}
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-muted primary-hover" to="/EquipmentListingAll">
                  {t('buy')}
                </Link>
              </li>
              {userData?(<li className="nav-item">
                <Link className="nav-link text-muted primary-hover" to="/AddEquipment">
                  {t('sell')}
                </Link>
              </li>):<li className="nav-item">
                <Link className="nav-link text-muted primary-hover" to="/SignIn">
                  {t('sell')}
                </Link>
              </li>}
              

               {userData?(<li className="nav-item">
                <Link className="nav-link text-muted primary-hover" to="/AddEquipmentDonate">
                  {t('donate')}
                </Link>
              </li>):<li className="nav-item">
                <Link className="nav-link text-muted primary-hover" to="/SignIn">
                  {t('donate')}
                </Link>
              </li>}
              
{userData?.role === 'admin' && (<>
  <li className="nav-item">
    <Link className="nav-link text-muted primary-hover" to="/EquipmentAccepting">
      {t('AcceptEquipment')}
    </Link>
  </li>
  <li className="nav-item">
    <Link className="nav-link text-muted primary-hover" to="/EquipmentAcceptingNgo">
      {t('AcceptNgoRequest')}
    </Link>
  </li>
  <li className="nav-item">
    <Link className="nav-link text-muted primary-hover" to="/AdminReport">
      {t('report.report')}
    </Link>
  </li>

   <li className="nav-item">
    <Link className="nav-link text-muted primary-hover" to="/AdminMantiance">
      {t('ShowMantiance')}
    </Link>
    
  </li>
  <li className="nav-item">
    <Link className="nav-link text-muted primary-hover" to="/AllOrders">
      {t('AllOrders')}
    </Link>
    
  </li>
 
  </>
)}

              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle text-muted primary-hover"
                  to="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {t('services')}
                </Link>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <Link className="dropdown-item text-muted primary-hover" to="/MaintainesePage">
                      {t('maintenance_page')}
                    </Link>
                  </li>
                 
                  <li>
                    <Link className="dropdown-item text-muted primary-hover" to="/SubscriptionPage">
                      {t('SubscriptionPage')}
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item text-muted primary-hover" to="/Inspection">
                      {t('inspection.title')}
                    </Link>
                  </li>

                  
                </ul>
              </li>
            </ul>
          </div>

          <div className="d-flex ms-auto align-items-center">
            <Link className="nav-link text-muted primary-hover" to="/MyProfile">
              <i className="fa-regular fa-user h4"></i>
            </Link>
            <Link className="nav-link text-muted primary-hover" to="/UserMessages">
              <i className="fa-regular fa-comment h4"></i>
            </Link>

          
            <span
              onClick={toggleLanguage}
              className="nav-link text-muted primary-hover fw-bold fs-5"
              style={{ cursor: 'pointer' }}
            >
              {i18n.language === 'ar' ? 'EN' : 'AR'}
            </span>

            {userData ? (
              <button
                type="button"
                className="btn btn-primary px-3"
                onClick={Logout}
                style={{ marginLeft: '10px' }}
              >
                {t('logout')}
              </button>
            ) : (
              <Link className="nav-link" to="/SignIn">
                <button type="button" className="btn btn-primary px-3">
                  {t('signinBtn')}
                </button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
