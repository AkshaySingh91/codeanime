import React from 'react'
import ReactDom from 'react-dom/client'
import App from './App'
import Navbar from './Component/Navbar'
import Footer from './Component/Footer'
import { ThemeContextProvider } from './Datastore/Context'


const root = document.querySelector(".root")
ReactDom.createRoot(root).render(<>
    <ThemeContextProvider>
        <Navbar />
        <App />
        <Footer />
    </ThemeContextProvider>
</>)