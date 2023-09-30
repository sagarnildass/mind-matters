import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchEmergencyContacts,
    selectEmergencyContacts,
    createEmergencyContact,
} from '../utils/EmergencyContactSlice';
import { fetchUserData } from '../utils/userSlice';
import { fetchSimilarUsers, selectSimilarUsers } from '../utils/similarUsersSlice';  // Import the slice for fetching similar users
import NavbarHeader from '../components/NavbarHeader';
import Sidebar from '../components/Sidebar';
import signupBg from '../assets/signup-bg.png';
import Card from '../components/Card';
import CardContent from '../components/CardContent';

const EmergencyContactPage = () => {
    const dispatch = useDispatch();
    const token = localStorage.getItem('access_token');
    const userId = useSelector(state => state.user.user_id);
    const [showForm, setShowForm] = useState(false);
    const [newContact, setNewContact] = useState({
        user_id: userId,
        name: '',
        phone_number: '',
        email: '',
        relation: '',
    });

    const [isSidebarVisible, setIsSidebarVisible] = useState(false);

    const sidebarToggle = async () => {
        setIsSidebarVisible((prevIsSidebarVisible) => !prevIsSidebarVisible);
    };


    useEffect(() => {
        if (token) {
            dispatch(fetchUserData(token));
            dispatch(fetchEmergencyContacts(token));
            dispatch(fetchSimilarUsers(userId));  // Fetch the similar users
        }
    }, [dispatch, token, userId]);

    useEffect(() => {
        setNewContact(prevState => ({ ...prevState, user_id: userId }));
    }, [userId]);

    const emergencyContacts = useSelector(selectEmergencyContacts);
    const similarUsers = useSelector(selectSimilarUsers);  // Get the similar users from Redux state

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewContact(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createEmergencyContact(newContact, token));
        setShowForm(false);
    };

    return (
             <div className="bg-app mx-auto" >
            <div className="min-h-screen flex flex-col">

                <NavbarHeader  sidebarToggle={sidebarToggle} />
                <div className="flex flex-1">
                    {isSidebarVisible &&   <Sidebar />  }

                    <main className=" flex-1 p-8 overflow-hidden">
                    {/*MAIN */}

                     <div className="left-0 top-0 text-white text-xl font-bold ml-0  mr-0  mt-0 mb-0">
                        <h1>Your Emergency Contacts</h1>
                    </div>




                    <div className=" w-full top-[10px] flex flex-col items-center">
                    <h2 className="text-3xl text-white mt-4"></h2>
                    <div className="mt-6 w-3/4 flex flex-wrap justify-center">
                        {emergencyContacts.length > 0 ? (
                            emergencyContacts.map(contact => (
                                <Card key={contact.contact_id}>
                                    <CardContent title="Name" number={contact.name} />
                                    <CardContent title="Phone" number={contact.phone_number} />
                                    <CardContent title="Email" number={contact.email || 'N/A'} />
                                    <CardContent title="Relation" number={contact.relation || 'N/A'} />
                                </Card>
                            ))
                        ) : (
                            <p className="text-white">No emergency contacts found. Add one now!</p>
                        )}
                    </div>

                    {/* Similar Users Section */}
                    <h2 className="text-3xl text-white mt-10 mb-1">Similar Users</h2>
                    <div className="mt-6 w-3/4 flex flex-wrap justify-center gap-5">
                        {similarUsers.slice(0, 5).map((user) => (
                            <div key={user.user_id} className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 m-2">
                                <a href="#">
                                    <img src={user.profile_image} alt={`${user.first_name} ${user.last_name}`} className="rounded-t-lg" />
                                </a>
                                <div className="p-5">
                                    <a href="#">
                                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                            {`${user.first_name} ${user.last_name}`}
                                        </h5>
                                    </a>
                                    <p className="font-normal text-gray-700 dark:text-gray-400">{`Gender: ${user.gender}`}</p>
                                    <p className="font-normal text-gray-700 dark:text-gray-400">{`Age: ${user.age}`}</p>
                                    <p className="font-normal text-gray-700 dark:text-gray-400">{`Similarity Score: ${(user.similarity * 100).toFixed(2)}%`}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* End of Similar Users Section */}

                    {emergencyContacts.length === 0 && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-blue-600 text-white py-3 px-6 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mb-8 mt-10"
                        >
                            Add New Contact
                        </button>
                    )}
                    {showForm && (
                        <div className="bg-white p-6 rounded-xl shadow-lg w-1/2">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    onChange={handleInputChange}
                                    className="p-2 w-full rounded border"
                                />
                                <input
                                    type="text"
                                    name="phone_number"
                                    placeholder="Phone Number"
                                    onChange={handleInputChange}
                                    className="p-2 w-full rounded border"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    onChange={handleInputChange}
                                    className="p-2 w-full rounded border"
                                />
                                <input
                                    type="text"
                                    name="relation"
                                    placeholder="Relation"
                                    onChange={handleInputChange}
                                    className="p-2 w-full rounded border"
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Submit
                                </button>
                            </form>
                        </div>
                    )}
                </div>


                    {/*EOD MAIN*/}
                    </main>

                </div>
            </div>
        </div>
    );
};

export default EmergencyContactPage;
