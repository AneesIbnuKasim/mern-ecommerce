import React from 'react'
import Navbar from '../components/Navbar.jsx'
import Hero from '../components/Hero.jsx'
import Collection from '../components/LatestCollection.jsx'
import BestSeller from '../components/BestSeller.jsx'
import OurPolicy from '../components/OurPolicy.jsx'
import Subscribe from '../components/Subscribe.jsx'


function Home() {
  return (
    <div>
     <Hero />
     <Collection />
     <BestSeller />
     <OurPolicy />
     <Subscribe />
    </div>
  )
}

export default Home