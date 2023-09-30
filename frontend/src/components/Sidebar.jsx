import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { faBrain, faComment, faStar, faHome, faCogs, faPhone, faQuestionCircle, faBook, faPuzzlePiece } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './Sidebar.module.css';
// import { NotificationContext } from '../utils/NotificationContext';


const Sidebar = () => {
    // const { notificationsCount, resetNotificationsCount } = useContext(NotificationContext);
    // const notificationClass = notificationsCount > 0 ? 'bg-red-500 text-white' : '';
    const [isOpen, setIsOpen] = useState(window.innerWidth > 640);

    return (
        <>
            {/* <button onClick={() => setIsOpen(!isOpen)} className="absolute top-0 left-0 m-4 sm:hidden">
                <span className="sr-only">Open sidebar</span>
                <svg className="w-6 h-6 text-blue-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                </svg>
            </button> */}

            <aside id="logo-sidebar" className= '  bg-side-nav ' aria-label="Sidebar">

                <div className="h-full px-3 py-4 overflow-y-auto dark:bg-gray-100">
                   {/*  <Link to="/" className="flex items-center pl-2.5 mb-5">
                        <div className={styles.logo}>
                            <div className={styles.visionUiPro}>
                                <span className="mx-4">MIND MATTER</span>
                            </div>
                        </div>
                    </Link> */}

                    <ul className="space-y-2 font-medium mt-4 ml-2">
                        {/* Dashboard */}
                        <li>
                            <Link to="/" className="flex items-center p-2 text-gray-200 rounded-lg dark:text-white hover:bg-gray-800 dark:hover:bg-gray-700">
                                <FontAwesomeIcon icon={faHome} className="h-5 w-5 ml-1 text-blue-500" />
                                <span className="ml-3">Home</span>
                            </Link>
                        </li>
                        {/* Chat */}
                        <li>
                            <Link to="/chat" className="flex items-center p-2 text-gray-200 rounded-lg dark:text-white hover:bg-gray-800 dark:hover:bg-gray-700">
                                <FontAwesomeIcon icon={faComment} className="h-5 w-5 ml-1 text-blue-500" />
                                <span className="ml-3">Chat</span>
                            </Link>
                        </li>
                        {/* AI Interactions */}
                        {/* <li>
                            <Link to="/ai-interactions" className="flex items-center p-2 text-gray-200 rounded-lg dark:text-white hover:bg-gray-800 dark:hover:bg-gray-700">
                                <FontAwesomeIcon icon={faBrain} className="h-5 w-5 ml-1 text-blue-500" />
                                <span className="ml-3">AI Interactions</span>
                            </Link>
                        </li> */}
                        {/* Feedback */}
                        {/* <li>
                            <Link to="/feedback" className="flex items-center p-2 text-gray-200 rounded-lg dark:text-white hover:bg-gray-800 dark:hover:bg-gray-700">
                                <FontAwesomeIcon icon={faStar} className="h-5 w-5 ml-1 text-blue-500" />
                                <span className="ml-3">Feedback</span>
                            </Link>
                        </li> */}
                        <li>
                            <Link to="/therapists-nearby" className="flex items-center p-2 text-gray-200 rounded-lg dark:text-white hover:bg-gray-800 dark:hover:bg-gray-700">
                                <FontAwesomeIcon icon={faPuzzlePiece} className="h-5 w-5 ml-1 text-blue-500" />
                                <span className="ml-3">Nearby Therapists</span>
                            </Link>
                        </li>
                        {/* Emergency Contacts */}
                        <li>
                            <Link to="/emergency-contacts" className="flex items-center p-2 text-gray-200 rounded-lg dark:text-white hover:bg-gray-800 dark:hover:bg-gray-700">
                                <FontAwesomeIcon icon={faPhone} className="h-5 w-5 ml-1 text-blue-500" />
                                <span className="ml-3">Emergency Contacts</span>
                            </Link>
                        </li>
                        {/* Article Recommendations */}
                        {/* <li>
                            <Link to="/article-recommendations" className="flex items-center p-2 text-gray-200 rounded-lg dark:text-white hover:bg-gray-800 dark:hover:bg-gray-700">
                                <FontAwesomeIcon icon={faBook} className="h-5 w-5 ml-1 text-blue-500" />
                                <span className="ml-3">Article Recommendations</span>
                            </Link>
                        </li> */}
                        {/* Settings */}
                        {/* <li>
                            <Link to="/settings" className="flex items-center p-2 text-gray-200 rounded-lg dark:text-white hover:bg-gray-800 dark:hover:bg-gray-700">
                                <FontAwesomeIcon icon={faCogs} className="h-5 w-5 ml-1 text-blue-500" />
                                <span className="ml-3">Settings</span>
                            </Link>
                        </li> */}
                        {/* Support & Help */}
                        {/* <li>
                            <Link to="/help" className="flex items-center p-2 text-gray-200 rounded-lg dark:text-white hover:bg-gray-800 dark:hover:bg-gray-700">
                                <FontAwesomeIcon icon={faQuestionCircle} className="h-5 w-5 ml-1 text-blue-500" />
                                <span className="ml-3">Support & Help</span>
                            </Link>
                        </li> */}
                    </ul>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
