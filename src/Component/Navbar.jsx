import React from 'react'
import css from './Navbar.module.css';
import { useTheme } from '../Datastore/Context';

const Navbar = () => {
    // const { theme, toggleTheme } = useTheme();
    console.log(useTheme())
    return (
        <>
            < nav className={css[`${"navbar"}`]} >
                <div className={css[`${"container"}`]}>
                    <a href={`/`} className={css[`${"navbar-brand"}`]} >CodeAnime</a>
                    <div className="search-container" id="">
                        <form className={css[`${"search-box"}`]}>
                            <input className={css[`${"search-input"}`]} type="search" aria-label="Search" />
                            <button className={css[`${"search-btn"}`]} type="submit"><i className="fa">&#xf002;</i>
                            </button>
                        </form>
                    </div>
                    <div className={css[`${"toggleTheme"}`]}>
                        <label className={css[`${"switch"}`]}>
                            <input type="checkbox" onChange={(e) => {
                                // toggleTheme();
                            }} />
                            <span className={css[`${"slider"}`]}></span>
                        </label>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar;

