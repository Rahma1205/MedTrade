import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import SupportChat from "../SupportChat/SupportChat";
import Footer from "../Footer/Footer";
export default function Layout({userData,setUserData}) {
  let navigate= useNavigate()
  function Logout(){
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');  
    setUserData(null);
    navigate('/');
  };
  return (
    <div className="d-flex flex-column min-vh-100">
      <NavBar userData={userData} Logout={Logout}/>
      
      <div className="flex-grow-1">
        <Outlet />
      </div>
      
      <SupportChat />
      
      <Footer className="mt-auto" />
    </div>
  );
}
