import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';


import Home from './Component/Home/Home';
import Layout from './Component/Layout/Layout';
import { RouterProvider, createBrowserRouter, createHashRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import il8n from './il8n';
import UserMessages from './Component/UserMessages/UserMessages';
import SignUp from './Component/SignUp/SignUp';
import SignIn from './Component/SignIn/SignIn';
import Notfound from './Component/NotFound/NotFound';
import EquipmentListing from './Component/EquipmentListing/EquipmentListing';

import EquipmentListingAll from './Component/EquipmentListingAll/EquipmentListingAll';
import EquipmentDetials from './Component/EquipmentDetials/EquipmentDetials';
import AddEquipment from './Component/AddEquipment/AddEquipment';
import MyProfile from './Component/MyProfile/MyProfile';
import AddEquipmentDonate from './Component/AddEquipmentDonate/AddEquipmentDonate';
import EquipmentAccepting from './Component/EquipmentAccepting/EquipmentAccepting';
import Checkout from './Component/Checkout/Checkout';
import ProtectedRoute from './Component/ProtectedRoute/ProtectedRoute';
import MaintainesePage from './Component/MaintainesePage/MaintainesePage';
import AdminReport from './Component/AdminReport/AdminReport';
import AdminMantinace from './Component/AdminMantinace/AdminMantinace';
import AllOrders from './Component/AllOrders/AllOrders';
import SubscriptionPage from './Component/SubscriptionPage/SubscriptionPage';

import WalletRecharge from './Component/WalletRecharge/WalletRecharge';
import EquipmentListingNgo from './Component/EquipmentListingNgo/EquipmentListingNgo';
import EquipmentListingAllNgo from './Component/EquipmentListingAllNgo/EquipmentListingAllNgo';
import { Toaster } from 'react-hot-toast';
import EquipmentAcceptingNgo from './Component/EquipmentAcceptingNgo/EquipmentAcceptingNgo';
import Wallet from './Wallet';

function App() {

  const [userData, setUserData] = useState(null);

  function saveUserData() {
    const userData = localStorage.getItem('userData');
    if (userData) {
      setUserData(JSON.parse(userData));
    } else {
      setUserData(null);
    }
  }


  useEffect(() => {
    saveUserData();
  }, []);

  const routers = createHashRouter([{
    path: '', element: <Layout userData={userData} setUserData={setUserData} />, children: [
      { index: true, element: <Home userData={userData} /> },

      // { path: '/UserMessages', element: <UserMessages /> },
     { path: '/SignUp', element: <SignUp saveUserData={saveUserData} /> },

      { path: '/SignIn', element: <SignIn saveUserData={saveUserData} /> },
     { path: '/EquipmentListing', element: <EquipmentListing /> },
      { path: '/EquipmentListingAll', element: <EquipmentListingAll /> },
      { path: '/EquipmentDetials/:id', element: <ProtectedRoute>< EquipmentDetials userData={userData} /></ProtectedRoute>  },
      { path: '/AddEquipment', element: <ProtectedRoute><AddEquipment userData={userData} /> </ProtectedRoute>},
      { path: '/AddEquipmentDonate', element:<ProtectedRoute> <AddEquipmentDonate /></ProtectedRoute> },
      { path: '/EquipmentAccepting', element:<ProtectedRoute> <EquipmentAccepting  userData={userData}/></ProtectedRoute> },
      { path: '/Checkout', element: <Checkout userData={userData} /> },

      { path: '/MyProfile', element:<MyProfile userData={userData} /> },
      { path: '/AdminReport', element:<ProtectedRoute> <AdminReport userData={userData} /> </ProtectedRoute>},
      { path: '/MaintainesePage', element:<MaintainesePage userData={userData} /> },
      { path: '/AdminMantiance', element:<AdminMantinace userData={userData} /> },
      { path: '/AllOrders', element:<AllOrders userData={userData} /> },
      { path: '/SubscriptionPage', element:<SubscriptionPage userData={userData} /> },
      { path: '/WalletRecharge', element:<WalletRecharge userData={userData} /> },
      { path: '/EquipmentListingNgo', element:< EquipmentListingNgo userData={userData} /> },
      { path: '/EquipmentListingAllNgo', element:< EquipmentListingAllNgo userData={userData} /> },
      { path: '/EquipmentAcceptingNgo', element:< EquipmentAcceptingNgo userData={userData} /> },
      { path: '/Wallet', element:< Wallet  /> },

      { path: '*', element: <Notfound /> },
    ]

  }])
console.log({
  ToastContainer: typeof ToastContainer,
  Toaster:typeof Toaster
});
  return (
    <>

    
    <I18nextProvider i18n={il8n}>
      <RouterProvider router={routers} />

 </I18nextProvider>

  </>
  );

}


export default App;
