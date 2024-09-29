import React, { Component } from 'react'
import './Navbar.css'

export default class Navbar extends Component {
    render() {
        return (
            <>
                < nav className="navbar" >
                    <div className="container">
                        <a href={`/`} className="navbar-brand" >CodeAnime</a>
                        <div className="" id="">
                            <form className="search-box">
                                <input className="search-input" type="search" aria-label="Search" />
                                <button className="search-btn" type="submit"><i class="fa">&#xf002;</i>
                                </button>
                            </form>
                        </div>
                    </div>
                </nav>
            </>
        )
    }
}

