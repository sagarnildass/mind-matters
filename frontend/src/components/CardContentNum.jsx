import React from 'react';

const CardContentNum = ({ title, number }) => (
    <div className="flex justify-center items-start w-full p-1 ">
        <div className="sm:w-auto p-4"> {/* sm:w-auto to make it responsive */}
            {/* Adjusting font size for different screen sizes */}
            <p className="text-gray-400 sm:text-sm md:text-lg lg:text-lg text-center p-1 2xl:text-2xl">{title}</p>

            {/* Adjusting font size for different screen sizes */}
            <h2 className="text-white sm:text-2xl md:text-3xl lg:text-4xl text-center ml-0 2xl:text-2xl">{number}</h2>
        </div>
    </div>
);

export default CardContentNum;
