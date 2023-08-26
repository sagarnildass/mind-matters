import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination } from 'swiper';
import "swiper/swiper.min.css";


// Install Swiper modules
SwiperCore.use([Navigation, Pagination]);

const RecommendedArticlesCarousel = ({ articles }) => {
    return (
        <div className="my-8 w-full h-[800px]"> {/* Increase the height here */}
            <h2 className="text-xl font-bold mb-4 text-white">Your Daily Recommendations</h2>
            <Swiper
                spaceBetween={50}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                onSlideChange={() => console.log('slide change')}
                onSwiper={(swiper) => console.log(swiper)}
            >
                {articles.map((article, index) => (
                    <SwiperSlide key={index}>
                        <div
                            className="p-6 rounded-lg shadow-md"
                            style={{
                                backgroundImage: 'linear-gradient(127.09deg, rgba(6, 11, 40, 0.94) 19.41%, rgba(10, 14, 35, 0.49) 76.65%)'
                            }}
                        >
                            <h3 className="text-xl text-center font-bold mb-2 text-white">{article.title}</h3>
                            <p className="mb-4 text-white text-center">{article.description}</p>
                            <a href={article.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-center hover:underline hover:text-blue-400">Read More</a>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

export default RecommendedArticlesCarousel;