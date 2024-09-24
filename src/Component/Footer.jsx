import React, { Component } from 'react'
import "./Footer.css"
import linkdinImage from './Assets/images/linkdinImage.png'
import gmailImage from './Assets/images/gmailImage.png'

export class Footer extends Component {
    render() {
        return (
            <>
                <div className="footer-dark">
                    <footer>
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-6 col-md-3 item">
                                    <h3>Services</h3>
                                    <ul>
                                        <li><a href="#">E-learning</a></li>
                                        <li><a href="#">Best-tutorial On youtube</a></li>
                                    </ul>
                                </div>
                                <div className="col-sm-6 col-md-3 item">
                                    <h3>About</h3>
                                    <ul>
                                        <li><a href="#">CodeAnime</a></li>
                                        <li><a href="#">Team</a></li>
                                    </ul>
                                </div>
                                <div className="col-md-6 item text">
                                    <h3>CodeAnime</h3>
                                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima quisquam maxime dicta rerum nihil minus assumenda distinctio iusto inventore expedita, quo obcaecati quam commodi adipisci.</p>
                                </div>
                                <div className="col item social">
                                    <a href="#"><img id='' src={linkdinImage} alt="" /></a>
                                    <a href="#"><img id='gmial-icon' src={gmailImage} alt="" /></a>
                                    <a href="#"><i className="icon ion-social-snapchat"></i></a>
                                    <a href="#"><i className="icon ion-social-instagram"></i></a>
                                </div>
                            </div>
                            <p className="copyright">CodeAnime © 2018</p>
                        </div>
                    </footer>
                </div>
            </>
        )
    }
}

export default Footer
