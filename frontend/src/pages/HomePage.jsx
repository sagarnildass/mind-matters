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
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import RecommendedArticlesCarousel from '../components/articleCarousel';
import RecentChatSummary from '../components/RecentChatSummary';
import QuoteBox from '../components/QuoteBox';

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
        <div className="flex min-h-screen overflow-x-hidden">
            <Sidebar />
            <div className="flex-1 relative">
                <div className="relative h-full">
                    <div
                        className="w-full h-full"
                        style={{
                            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${signupBg})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    />
                    <Navbar />
                    <div className="absolute right-60 top-28 text-white w-full flex justify-center space-x-20">  {/* Wrap the two sections in a flex container */}
                        <div> {/* Emotion cards section */}
                            <h1 className="text-4xl font-bold">Welcome, {userName}</h1>
                            <h2 className="text-2xl mt-4">Your Recent Top Emotions:</h2>
                            <div className="flex space-x-8 mt-4">
                                {topEmotions.map((emotion, index) => (
                                    <Card key={index} className="flex-1">
                                        <CardContent
                                            title={emotion[0]}
                                            number={emotion[0] === "love" ? <span style={{ color: "red" }}>{emotionToEmoji[emotion[0]]}</span> : emotionToEmoji[emotion[0]]}
                                        />
                                    </Card>
                                ))}
                            </div>
                        </div>
                        <div className="w-1/3 mt-14 mr-12"> {/* Last Week Summary section. Restrict its width */}
                            <h2 className="text-2xl text-white">This Week Summary</h2>
                            <div className="flex space-x-8 mt-4">
                                <Card className="flex-shrink w-2/5">
                                    <CardContent title="Total Sessions" number={weeklySummary.total_sessions} />
                                </Card>
                                <Card className="flex-shrink w-2/5">
                                    <CardContent title="Total AI Interactions" number={weeklySummary.total_ai_interactions} />
                                </Card>
                            </div>

                            <div className="absolute right-[-90px] top-14">
                                <h2 className="text-2xl text-white">Quote of the Day</h2>
                                <QuoteBox className="mt-[15px]" quote={randomQuote.quote} author={randomQuote.author} />
                            </div>
                        </div>
                    </div>

                    <div className="absolute left-80 top-[29%] w-6/12">
                        <RecommendedArticlesCarousel articles={recommendedArticles} />
                    </div>
                    <div className="absolute left-80 bottom-0 w-6/12 mb-8">
                        <EmotionTimeSeriesChart data={emotionData} />
                    </div>
                    {dailyChallenge && dailyChallenge.challenge_id && (
                        <div className="absolute right-0 bottom-[2%] w-4/12 mb-8 mr-8 h-[61vh]"> {/* Set fixed or minimum height here */}
                            <Card className="h-full"> {/* Make sure the Card takes the full height */}
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
            </div>
        </div>
    );
}

export default HomePage;