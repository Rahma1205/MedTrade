import React from 'react'
import Hero from '../Hero/Hero'
import SignUpAction from '../SignUpAction/SignUpAction'
import SearchFilter from '../SearchFilter/SearchFilter'
import ImpactMetrics from '../ImpactMetrics/ImpactMetrics'
import HowItWork from '../HowItWork/HowItWork'
import EquipmentListing from '../EquipmentListing/EquipmentListing'
import NGODonation from '../NGODonation/NGODonation'
import Help from '../Help/Help'
import EquipmentListingNgo from '../EquipmentListingNgo/EquipmentListingNgo'

export default function Home({userData}) {
  return (
    <>

     <div className="flex flex-col">
     <Hero userData={userData}/>  
     <div className="pay-6 bg-gray-100">
        <SearchFilter /> 
      </div>
      <ImpactMetrics/>
      <EquipmentListing />
   {userData?.access_token ? (
    <>
                  <EquipmentListingNgo userData={userData} />

  </>
) : null}
      <HowItWork/>
   {userData?.access_token ? (
    <>

  <NGODonation userData={userData} />
  </>
) : null}
<Help />
      
     <SignUpAction/>
     
     
     </div>
    </>
   
      )
}
