import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';

export default function SignIn({ saveUserData }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [messageError, setMessageError] = useState('');

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  async function handleLogin(values) {
    setIsLoading(true);
    try {
      const { data } = await axios.post('/api/login', values);

   console.log(data);
      if (data.user && data.user.access_token) {
        localStorage.setItem('userToken', data.user.access_token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        saveUserData();
        navigate('/');
      } else {
        setMessageError('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error.response || error.message);
      setMessageError('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  }
  

  const validationSchema = yup.object({
    email: yup
      .string()
      .required(`${t('signin.email')} ${t('validation.required')}`)
      .email(t('validation.email')),
    password: yup
      .string()
      .required(`${t('signin.password')} ${t('validation.required')}`)
      .min(8, t('validation.minChars', { count: 8 })),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: handleLogin,
  });

  return (
    <>
      <Helmet>
        <title>{t('signin.title')}</title>
      </Helmet>

      <div className="bg-light py-4 px-3 shadow-sm border-bottom">
        <div className="container mt-5 bg-white rounded-3 shadow p-4 p-md-5">
          <div className="w-75 mx-auto py-5">
            <h3>{t('signin.title')}</h3>
            {messageError && <div className="alert alert-danger">{messageError}</div>}

            <form onSubmit={formik.handleSubmit}>
             
              <label htmlFor="email">{t('signin.email')}</label>
              <input
                type="email"
                name="email"
                id="email"
                className="form-control mb-2"
                value={formik.values.email}
                onChange={(e) => {
                  formik.handleChange(e);
                  setMessageError('');
                }}
                onBlur={formik.handleBlur}
              
              />
              {formik.touched.email && formik.errors.email && (
                <div className="alert alert-danger">{formik.errors.email}</div>
              )}

             
              <label htmlFor="password">{t('signin.password')}</label>
              <input
                type="password"
                name="password"
                id="password"
                className="form-control mb-2"
                value={formik.values.password}
                onChange={(e) => {
                  formik.handleChange(e);
                  setMessageError('');
                }}
                onBlur={formik.handleBlur}
               
              />
              {formik.touched.password && formik.errors.password && (
                <div className="alert alert-danger">{formik.errors.password}</div>
              )}

              
              {isLoading ? (
                <button type="button" className="btn btn-primary" disabled>
                  <i className="fas fa-spinner fa-spin"></i> {t('signin.loading')}
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-outline-primary px-4 py-2 fw-semibold"
                  disabled={!(formik.isValid && formik.dirty)}
                >
                  {t('signin.submit')}
                </button>
              )}

              
              <div className="d-flex justify-content-center align-items-center mt-3">
                <h6 className="mb-0">{t('signin.noAccount')}</h6>
                <Link to="/SignUp" className="px-2 link-primary mb-2 text-decoration-none">
                  {t('signin.register')}
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
