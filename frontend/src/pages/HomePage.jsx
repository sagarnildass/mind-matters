import React, { useState, useEffect, useContext, useRef } from 'react';
import signupBg from '../assets/signup-bg.png';
import { useDispatch, useSelector } from 'react-redux';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import EmotionTimeSeriesChart from '../components/EmotionTimeSeriesChart';
import { fetchEmotionData, selectEmotionData } from '../utils/emotionSlice';
import { fetchUserData, selectUsername } from '../utils/userSlice';
import { fetchRecommendedArticles, selectRecommendedArticles } from '../utils/articleSlice';
import { fetchDailyMentalHealth, selectDailyMentalHealth } from '../utils/dailyMentalHealthSlice';
import { fetchWeeklySummary, selectWeeklySummary } from '../utils/weeklySummarySlice';
import { fetchRecentChat, selectRecentChat } from '../utils/recentChatSlice';
import { fetchRandomQuote, selectRandomQuote } from '../utils/quoteSlice';
import { fetchDailyChallenge, selectDailyChallenge } from '../utils/dailyChallengeSlice';


import Card from '../components/Card';
import CardContent from '../components/CardContent';
import CardContentNum from '../components/CardContentNum';

import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import RecommendedArticlesCarousel from '../components/articleCarousel';
import RecentChatSummary from '../components/RecentChatSummary';
import QuoteBox from '../components/QuoteBox';
import NavbarHeader from '../components/NavbarHeader';

const HomePage = () => {
    const dispatch = useDispatch();
    const userName = useSelector(selectUsername);
    const emotionData = useSelector(selectEmotionData);
    const emotionStatus = useSelector(state => state.emotion.status);
    const recommendedArticles = useSelector(selectRecommendedArticles);
    const dailyMentalHealth = useSelector(selectDailyMentalHealth);
    const weeklySummary = useSelector(selectWeeklySummary);
    const recentChat = useSelector(selectRecentChat);
    const randomQuote = useSelector(selectRandomQuote);
    const dailyChallenge = useSelector(selectDailyChallenge);
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);

    const sidebarToggle = async () => {
        setIsSidebarVisible((prevIsSidebarVisible) => !prevIsSidebarVisible);
        //alert("Ok");
    };



    useEffect(() => {
        const token = localStorage.getItem('access_token');
        dispatch(fetchUserData(token));
        dispatch(fetchEmotionData(token));
        dispatch(fetchRecommendedArticles(token));
        dispatch(fetchDailyMentalHealth(token));
        dispatch(fetchWeeklySummary(token));
        dispatch(fetchRecentChat(token));
        dispatch(fetchRandomQuote());
        dispatch(fetchDailyChallenge());
    }, [dispatch]);


    const [selectedMood, setSelectedMood] = useState(null);

    const moodOptions = [
        { emoji: "😀", label: "Happy" },
        { emoji: "😐", label: "Neutral" },
        { emoji: "😞", label: "Sad" },
        // Add more moods as needed
    ];

    const emotionToEmoji = {
        "neutral": "😐",
        "excitement": "😃",
        "gratitude": "🙏",
        "amusement": "😄",
        "disgust": "🤢",
        "disappointment": "😞",
        "anger": "😡",
        "admiration": "🥰",
        "love": "❤",
        "approval": "👍",
        "surprise": "😲",
        "remorse": "😔",
        "joy": "😊",
        "realization": "🤔",
        "disapproval": "👎",
        "sadness": "😢",
        "relief": "😌",
        "pride": "😎",
        "embarrassment": "😳",
        "caring": "🤗",
        "grief": "😭",
        "nervousness": "😰",
        "confusion": "😵",
        "optimism": "😇",
        "desire": "😍",
        "annoyance": "😒",
        "curiosity": "🤨",
        "fear": "😨"
    };


    const computeTopEmotions = () => {
        let emotionConfidence = {};
        let emotionSessionWeightage = {};

        dailyMentalHealth.forEach(item => {
            const emotion = item.dominant_sentiment.replace(/\"/g, '');
            if (!emotionConfidence[emotion]) {
                emotionConfidence[emotion] = [];
                emotionSessionWeightage[emotion] = [];
            }
            emotionConfidence[emotion].push(item.avg_confidence);
            emotionSessionWeightage[emotion].push(item.session_id);
        });

        const weightedConfidence = {};
        for (const [emotion, confidences] of Object.entries(emotionConfidence)) {
            const avgConfidence = confidences.reduce((a, b) => a + b, 0) / confidences.length;
            const avgSessionWeightage = emotionSessionWeightage[emotion].reduce((a, b) => a + b, 0) / emotionSessionWeightage[emotion].length;
            // Combining average confidence with average session ID to get a weighted score
            weightedConfidence[emotion] = avgConfidence * avgSessionWeightage;
        }

        const sortedEmotions = Object.entries(weightedConfidence).sort((a, b) => b[1] - a[1]);

        return sortedEmotions.slice(0, 3);
    };

    const topEmotions = computeTopEmotions();

    const handleMoodClick = (mood) => {
        setSelectedMood(mood);
        // TODO: Save the mood to the backend or trigger other actions.
    };



    return (
        <div className="bg-app mx-auto" >
            <div className="min-h-screen flex flex-col">

                <NavbarHeader  sidebarToggle={sidebarToggle} />
                <div className="flex flex-1">
                    {isSidebarVisible &&   <Sidebar />  }

                    <main className=" flex-1 p-4 overflow-hidden">
                    {/*MAIN */}
                     <div className="left-0 top-0 text-white text-xl font-bold ml-4">
                        <h1>Welcome, {userName}</h1>
                    </div>

                     <div className="flex flex-col lg:flex-row  lg:right-0 lg:top-2 text-white w-full pl-4 ">

                        {/* START welcome and emotion */}
                        <div className="flex flex-col space-y-4 mt-2 lg:mb-0">

                            <h2 className="text-white text-l lg:text-l md:text-lg sm:text-base mt-4">Your Recent Top Emotions</h2>
                            <div className="container mx-auto   grid grid-cols-3 ">
                                {topEmotions.map((emotion, index) => (
                                    <div className=" mr-2 ">
                                    <Card key={index} className=" "> {/* Adjust widths */}
                                        <CardContentNum
                                            title={emotion[0]}
                                            number={
                                                <span style={{ fontSize: window.innerWidth > 640 ? 'inherit' : '16px' }}> {/* Adjust font size based on viewport */}
                                                    {emotion[0] === "love" ? <span style={{ color: "red" }}>{emotionToEmoji[emotion[0]]}</span> : emotionToEmoji[emotion[0]]}
                                                </span>
                                            }
                                        />
                                    </Card>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* EOF welcome and emotion */}



                        {/*START week summary */}
                        <div className="flex flex-col space-y-2 mt-4 ml-4 mr-4">
                            <h2 className="text-white text-l lg:text-l md:text-lg sm:text-base mt-2 mb-2">This Week Summary</h2>
                            <div className="flex space-x-2 mt-4 ">
                                <Card className="flex-shrink w-2/3 ">
                                    <CardContent title="Total Sessions" number={weeklySummary.total_sessions} />
                                </Card>
                                <Card className="flex-shrink w-2/3">
                                    <CardContent title="Total AI Interactions" number={weeklySummary.total_chat_logs} />
                                </Card>
                            </div>
                        </div>
                        {/*END week summary */}

                        {/*START Quote */}
                        <div className="flex flex-col space-y-4 mt-2 lg:mb-0 ml-4 mr-4">
                                <h2 className="text-white text-l lg:text-l md:text-lg sm:text-base mt-4 ">Quote of the Day</h2>
                                <QuoteBox className="mt-[15px]" quote={randomQuote.quote} author={randomQuote.author} />
                        </div>
                        {/*END Quote */}
                    </div>


                     <div className="flex flex-1 flex-col md:flex-row lg:flex-row mx-0 mt-4 " >


                     <div className="" >

                        {/*START ARTICLE */}
                       <div className="d-flex flex-row   mt-2  ">
                            <div className="w-full lg:w-6/12 mt-4    flex    ">
                                <RecommendedArticlesCarousel articles={recommendedArticles} />
                            </div>
                        </div>
                        {/*END ARTICLE */}

                        {/*START EMOTION DATA */}
                        <div className="w-full lg:w-12/12 mt-0 lg:mt-0 ">
                            <EmotionTimeSeriesChart data={emotionData} />
                        </div>
                        {/*END EMOTION DATA */}

                       </div>




                    {dailyChallenge && dailyChallenge.challenge_id && (
                        <div className="w-full mx-10   ">
                            <Card className="h-full">
                                <div className="p-3 flex flex-col h-full">
                                    <h2 className="text-gray-200 text-3xl mb-8 text-center">Daily Challenge</h2>
                                    <img
                                        src={dailyChallenge.image_url}
                                        alt={dailyChallenge.challenge_name}
                                        className="flex-grow object-cover rounded"
                                    />
                                    <div className="mt-10 flex flex-col justify-end flex-grow mb-10">
                                        <h3 className="text-white text-2xl text-center font-bold mb-2 mt-2">{dailyChallenge.challenge_name}</h3>
                                        <p className="text-m text-gray-400 text-center mt-1">{dailyChallenge.challenge_description}</p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}

 </div>

                    {/*END MAIN*/}
                    </main>

                </div>
            </div>
        </div>
    );
}

export default HomePage;
