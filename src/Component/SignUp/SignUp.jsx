import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';

export default function SignUp({ saveUserData }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [messageError, setMessageError] = useState('');

  async function handleRegister(values) {
    setIsLoading(true);
    try {
      const { data, token } = await axios.post('/api/register', values);
      if (data.message === 'Your account created successfully') {
        localStorage.setItem('userToken', token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        saveUserData(); 
        navigate('/');
      } else {
        setMessageError(t('registrationFailed'));
      }
    } catch (error) {
      console.error(error);
      let errMsg = t('somethingWentWrong');
      const errorData = error.response?.data?.message;

      if (typeof errorData === 'string') {
        errMsg = errorData;
      } else if (typeof errorData === 'object' && errorData !== null) {
        errMsg = Object.values(errorData)
          .flat()
          .join(' ');
      }

      setMessageError(errMsg);
    } finally {
      setIsLoading(false);
    }
  }

  const validationSchema = yup.object({
    first_name: yup
      .string()
      .required(t('firstNameRequired'))
      .matches(/^[A-Za-z]+$/, t('firstNameLettersOnly'))
      .min(2, t('firstNameMin')),
    last_name: yup
      .string()
      .required(t('lastNameRequired'))
      .matches(/^[A-Za-z]+$/, t('lastNameLettersOnly'))
      .min(2, t('lastNameMin')),
    email: yup
      .string()
      .required(t('emailRequired'))
      .email(t('emailValid')),
    password: yup
      .string()
      .required(t('passwordRequired'))
      .min(8, t('passwordMin'))
      .matches(/[a-zA-Z]/, t('passwordLetter'))
      .matches(/[0-9]/, t('passwordNumber')),
    password_confirmation: yup
      .string()
      .required(t('confirmPasswordRequired'))
      .oneOf([yup.ref('password')], t('passwordsMustMatch')),
    phone: yup
      .string()
      .required(t('phoneRequired'))
      .matches(/^[0-9]+$/, t('phoneNumbersOnly'))
      .min(11, t('phoneMin')),
    address: yup
      .string()
      .required(t('addressRequired'))
      .min(5, t('addressMin')),
    city: yup.string().required(t('cityRequired')),
    state: yup.string().required(t('stateRequired')),
    //ZIP_code: yup
    //  .string()
    //  .required(t('zipCodeRequired'))
     // .matches(/^[0-9]{4,10}$/, t('zipCodeDigits')),
    country: yup.string().required(t('countryRequired')),
  });

  const formik = useFormik({
    initialValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      password_confirmation: '',
      phone: '',
      address: '',
      city: '',
      state: '',
     // ZIP_code: '',
      country: '',
    },
    validationSchema,
    onSubmit: handleRegister,
  });

  const fields = [
    { key: 'first_name', label: t('fields.first_name') },
    { key: 'last_name', label: t('fields.last_name') },
    { key: 'email', label: t('fields.email') },
    { key: 'password', label: t('fields.password') },
    { key: 'password_confirmation', label: t('fields.password_confirmation') },
    { key: 'phone', label: t('fields.phone') },
    { key: 'address', label: t('fields.address') },
    { key: 'city', label: t('fields.city') },
    { key: 'state', label: t('fields.state') },
    //{ key: 'ZIP_code', label: t('fields.ZIP_code') },
    { key: 'country', label: t('fields.country') },
  ];

  return (
    <>
      <Helmet>
        <title>{t('signUp')}</title>
      </Helmet>
      <div className="bg-light py-4 px-3 shadow-sm border-bottom">
        <div className="container mt-5 bg-white rounded-3 shadow p-4 p-md-5">
          <div className="w-75 mx-auto py-5">
            <h3>{t('signUp')}</h3>
            {messageError && <div className="alert alert-danger">{messageError}</div>}

            <form onSubmit={formik.handleSubmit}>
              {fields.map((field) => (
                <div key={field.key} className="mb-3">
                  <label htmlFor={field.key} className="form-label">
                    {field.label}
                  </label>
                  <input
                    onBlur={formik.handleBlur}
                    onChange={(e) => {
                      formik.handleChange(e);
                      setMessageError('');
                    }}
                    value={formik.values[field.key]}
                    type={field.key.includes('password') ? 'password' : 'text'}
                    name={field.key}
                    id={field.key}
                    className={`form-control ${
                      formik.errors[field.key] && formik.touched[field.key] ? 'is-invalid' : ''
                    }`}
                  />
                  {formik.errors[field.key] && formik.touched[field.key] && (
                    <div className="invalid-feedback">{formik.errors[field.key]}</div>
                  )}
                </div>
              ))}

              {isLoading ? (
                <button type="button" className="btn btn-primary" disabled>
                  <i className="fas fa-spinner fa-spin"></i>
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-outline-primary px-4 py-2 fw-semibold"
                  disabled={!(formik.isValid && formik.dirty)}
                >
                  {t('signUp')}
                </button>
              )}

              <div className="d-flex justify-content-center align-items-center mt-3">
                <h6 className="mb-0">{t('alreadyHaveAccount')}</h6>
                <Link className="px-2 link-primary mb-2 text-decoration-none" to="/SignIn">
                  {t('login')}
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
