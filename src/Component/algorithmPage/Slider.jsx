import React, { Component } from 'react'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Link } from 'react-router-dom';

export default class SliderComponenet extends Component {
    constructor() {
        super();
        this.settings = {
            dots: true,             // Show dots for navigation
            infinite: true,         // Infinite scrolling
            speed: 500,             // Transition speed
            slidesToShow: 3,       // Number of slides to show
            slidesToScroll: 1,      // Number of slides to scroll at a time
            autoplay: true,         // Enable auto-play
            autoplaySpeed: 2000,    // Auto-play speed
            responsive: [           // Responsive settings
                {
                    breakpoint: 768,    // At 768px and below
                    settings: {
                        slidesToShow: 1,  // Show 1 slide
                        slidesToScroll: 1,
                    },
                },
                {
                    breakpoint: 1024,   // At 1024px and below
                    settings: {
                        slidesToShow: 2,  // Show 2 slides
                        slidesToScroll: 1,
                    },
                },
            ],
        };
    }

    render() {
        const { algorithmCard } = this.props;
        return (<>
            <Slider  {...this.settings}>
                {
                    algorithmCard.map((card) => (
                        <SliderCards
                            key={card.name}
                            path={card.path}
                            previewSvg={card.previewSvg}
                            name={card.name}
                        />
                    ))
                }
            </Slider>
        </>)

    }

}

export class SliderCards extends Component {
    render() {
        const { path, previewSvg, name } = this.props;
        console.log(path)
        return (
            <div className="slide">
                <Link to={`/${path}`}>
                    {previewSvg && previewSvg({ svgClassName: 'slider-preview' })}
                </Link>
                <p>{name}</p>
            </div>
        );
    }
}
