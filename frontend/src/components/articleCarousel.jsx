import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination } from 'swiper';
import "swiper/swiper.min.css";


// Install Swiper modules
SwiperCore.use([Navigation, Pagination]);

const RecommendedArticlesCarousel = ({ articles }) => {
    return (
        <div className="my-4 w-full"> {/*  h-[800px] Increase the height here */}
            <h2 className="mb-2  mt-2 text-white text-l lg:text-l md:text-lg sm:text-base mb-4  2xl:text-2xl">Your Daily Recommendations</h2>

           <div className="p-6 rounded-lg shadow-md my-card-bg justify-center" >
                <Swiper
                    spaceBetween={50}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    onSlideChange={() => console.log('slide change')}
                    onSwiper={(swiper) => console.log(swiper)} >
                    {articles.map((article, index) => (

                        <SwiperSlide  key={index}>

                                <div  className="justify-center ml-12 mr-12" >
                                    <h3 className="text-xl text-center font-normal mb-2 text-white  truncate hover:text-clip text-ellipsis overflow-hidden mb-2">{article.title}</h3>
                                    <p className="mb-4 text-gray-400 text-center truncate hover:text-clip text-ellipsis overflow-hidden ">{article.description}</p>
                                    <a href={article.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-center hover:underline hover:text-blue-400">Read More...</a>
                                </div>

                        </SwiperSlide>

                    ))}
                </Swiper>
            </div>
        </div>
    );
}

export default RecommendedArticlesCarousel;
