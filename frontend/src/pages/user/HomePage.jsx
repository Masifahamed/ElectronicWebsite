import React from 'react'
import Herosection from '../../components/user/home/Herosection'
import TodaysSales from '../../components/user/home/Todaysales'
import Category from '../../components/user/home/Category'
import Product from '../../components/user/home/ProductPoster'
import ArrivalNew from '../../components/user/home/ArrivalNew'
import Servicesection from '../../components/user/home/Servicesection'
import ProductPoster from '../../components/user/home/ProductPoster'




const HomePage = () => {
 
  return (
    <>
   <Herosection/>
   <TodaysSales/>
   <Category/>
   <ProductPoster/>
   <ArrivalNew/>
   <Servicesection/>
    </>
  )
}

export default HomePage