import React from 'react'
import Error from '../../Assets/Images/notfound.jpg'


export default function Notfound() {
  return (
<>
<div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
  <div className="text-center">
    <img src={Error} alt="Error" style={{ width: "500px", maxWidth: "100%" }} />
  </div>
</div>
</>
  )
}
