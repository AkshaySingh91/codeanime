import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import css from '../App.module.css'
import arrayImage from './arrayImage.gif'

export default class Card extends Component {
    constructor() {
        super();
        this.cardRef = React.createRef();
        // this.spotRef = React.createRef(); 
    }
    componentDidMount() {
        const cardElement = this.cardRef.current;
        if (cardElement) {
            cardElement.addEventListener('mousemove', this.handleMouseMove);
            cardElement.addEventListener('mouseleave', this.handleMouseLeave);
        }
    }

    componentWillUnmount() {
        const cardElement = this.cardRef.current;
        if (cardElement) {
            cardElement.removeEventListener('mousemove', this.handleMouseMove);
            cardElement.removeEventListener('mouseleave', this.handleMouseLeave);
        }
    }
    handleMouseMove = (e) => {
        const cardElement = this.cardRef.current;
        const cardWidth = cardElement.offsetWidth;
        const cardHeight = cardElement.offsetHeight;
        const rect = cardElement.getBoundingClientRect();
        const centerX = rect.left + cardWidth / 2;
        const centerY = rect.top + cardHeight / 2;
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;

        // const blurSpot = this.spotRef.current;
        // if (blurSpot) {
        //     blurSpot.style.transform = `translate(${mouseX - rect.x + cardWidth / 2}px, ${mouseY - rect.y - cardWidth / 2}px)`;
        //     blurSpot.style.opacity = 1
        // }

        cardElement.style.border = 'none'
        if (mouseX < 0) {
            cardElement.style.borderLeft = '1px solid orange'
        } else {
            cardElement.style.borderRight = '1px solid orange'
        }
        if (mouseY < 0) {
            cardElement.style.borderTop = '1px solid orange'
        } else {
            cardElement.style.borderBottom = '1px solid orange'
        }

        const rotateY = mouseX * 0.15;
        cardElement.style.transform = `rotateY(${rotateY}deg)`;
    };
    handleMouseLeave = (e) => {
        const cardElement = this.cardRef.current, blurSpot = this.spotRef;
        cardElement.style.transform = 'rotateY(0deg)';
        cardElement.style.border = 'none';
        if (blurSpot !== undefined) {
            // blurSpot.style.opacity = 0;
        }
    }
    render() {

        const { name, path, previewSvg, imagePath } = this.props
        return (
            <>
                <div ref={this.cardRef} className={css[`${"algorithm-card"}`]}>
                    <Link to={path}>
                        {/* it will change depending on which algorithm card it is */}
                        { previewSvg && previewSvg()}
                    </Link>
                    {/* <div ref={this.spotRef} className={css[`${"blur-spot"}`]}></div> */}
                    <div className={css[`${"algorithm-title"}`]}>
                        {name}
                    </div>
                </div>
            </>
        )
    }
}; 