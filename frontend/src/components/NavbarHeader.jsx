import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser, faCog, faBell,faList,faHamburger,faBars } from '@fortawesome/free-solid-svg-icons';
/*
import { rxHamburgerMenu } from "react-icons/rx";
 */

import Navbar from './Navbar';

const NavbarHeader = (props) => {

    return (
                <>
               <header className="shrink-0 bg-nav  w-100 ">
                <div className="flex justify-between ">
                    <div className="p-1 mx-3 inline-flex items-center">
                       <FontAwesomeIcon onClick={props.sidebarToggle}  icon={faBars} className="h-6 w-6 2xl:h-8 2xl:w-8 ml-2 text-blue-200  transition duration-75 group-hover:text-gray-900 dark:group-hover:text-white dark:text-gray-400" />
                        <h1 className="text-white p-2">
                        <Link to="/" className="">
                           {/*  <div className={styles.logo} className={styles.visionUiPro}>
                            */}
                                <div   className= "text-gradient-white  mt-2" >
                                    <span className="mx-0 p-0 mt-0 ml-0 text-xl 2xl:text-3xl">MIND MATTERS</span>
                                </div>
                            {/*

                             </div> */}
                        </Link>

                        </h1>
                    </div>

                    <div className="p-0 flex flex-row items-center ">
                        <Navbar />
                    </div>
                </div>
            </header>
            </>
    );
};

export default NavbarHeader;
