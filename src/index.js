import React from 'react'
import ReactDom from 'react-dom/client'
import App from './App'
import Navbar from './Component/Navbar'
import Footer from './Component/Footer'


const root = document.querySelector(".root")
ReactDom.createRoot(root).render(<>
    <Navbar />
    <App/>
    <Footer />
</>)