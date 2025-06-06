import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import About from './pages/About'
import Cart from './pages/Cart'
import Collection from './pages/Collection'
import Contacts from './pages/Contacts'
import PlaceOrder from './pages/PlaceOrder'
import Home from './pages/Home'
import Product from './pages/Product'
import Orders from './pages/Orders'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import Chat from './components/Chat'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] '>
      <ToastContainer autoClose={1000} />
      <Navbar/>
      <SearchBar />
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/about' element={<About/>} />
        <Route path='/cart' element={<Cart/>} />
        <Route path='/collections' element={<Collection/>} />
        <Route path='/contacts' element={<Contacts/>} />
        <Route path='/orders' element={<Orders/>} />
        <Route path='/place-order' element={<PlaceOrder/>} />
        <Route path='/product/:productId' element={<Product/>} />
      </Routes>
      <Chat/>
      <Footer />
    </div>
  )
}

export default App