import React, { Component } from 'react'
import { Link } from 'react-router-dom'
export class Card extends Component {
    render() {
        console.log('object')
        const {name, imageUrl, path, description} = this.props
        return (
            <>
                <div className="card mx-3 my-4" style={{width: "18rem"}}>
                    <img src={imageUrl} className="card-img-top" alt="..."/>
                        <div className="card-body">
                            <h5 className="card-title">{name}</h5>
                            <p className="card-text">{description}</p>
                            <Link to = {`/${path}`} className="btn btn-primary">Go somewhere</Link>
                        </div>
                </div>
            </>
        )
    }
}

export default Card