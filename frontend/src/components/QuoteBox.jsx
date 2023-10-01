import React from 'react';

const QuoteBox = ({ quote, author, ...props }) => {
    return (
        <div
//             className={`p-6 rounded-3xl shadow-md my-8 w-[700px] h-[140px] overflow-hidden ${props.className}`}
            className={`p-8 rounded-3xl shadow-md text-center my-8 mb-4 mt-4 overflow-hidden w-full ${props.className} my-card-bg`}

//             style={{
//                 backgroundImage: 'linear-gradient(127.09deg, rgba(6, 11, 40, 0.94) 19.41%, rgba(10, 14, 35, 0.49) 76.65%)',
//                 Color: 'rgba(0, 0, 0, 0.87)'
//             }}
        >
            <h3 className="text-large text-center font-regular mb-2 text-white  2xl:text-3xl">" {quote} "</h3>
            <p className="text-green-500 text-center">- {author}</p>
        </div>
    );
}

export default QuoteBox;
