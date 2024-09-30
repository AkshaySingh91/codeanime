import React, { Component } from 'react'
import css from "./Footer.module.css"
import linkedinImage from './Assets/images/linkedinImage.png'
import gmailImage from './Assets/images/gmailImage.png'
import githubImage from './Assets/images/githubImage.png'

export default class Footer extends Component {
    render() {
        return (
            <>
                <div className={`${css['footer-dark']}`}>
                    <footer>
                        <div className={`${css['container']}`}>
                            <div className={`${css['row']}`}>
                                <div className={`${css['item']}`}>
                                    <h3>Services</h3>
                                    <ul>
                                        <li><a href="#">E-learning</a></li>
                                        <li><a href="#">Best-tutorial On youtube</a></li>
                                    </ul>
                                </div>
                                <div className={`${css['item']}`}>
                                    <h3>About</h3>
                                    <ul>
                                        <li><a href="#">CodeAnime</a></li>
                                        <li><a href="#">Team</a></li>
                                    </ul>
                                </div>
                            </div>
                            <div className={`${css['item']} ${css['social']}`}>
                                <a href="https://github.com/AkshaySingh91/codeanime"><img id='linkedin-icon' src={githubImage} alt="" /></a>
                                <a href="/"><img id='linkedin-icon' src={linkedinImage} alt="" /></a>
                                <a href="/"><img id='gmail-icon' src={gmailImage} alt="" /></a>
                                <a href="/"><i className={`icon ion-social-snapchat`}></i></a>
                                <a href="/"><i className={`${css['icon']}`}></i></a>
                            </div>
                            <p className={`${css['copyright']}`}>CodeAnime © 2024</p>
                        </div >
                    </footer >
                </div >
            </>
        )
    }
}
