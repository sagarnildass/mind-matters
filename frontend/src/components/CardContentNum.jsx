import React from 'react';



const CardContentNum = ({ title, number }) => (
  <div className="flex justify-center items-start w-full p-1 ">
    <div className="sm:w-auto p-4"> {/* Added sm:w-auto to make it responsive */}
      <p className="text-gray-400 text-lg  text-center p-1">{title}  </p>
        <h2 className="text-white text-4xl text-center ml-2">{number}</h2>
    </div>
  </div>
);

export default CardContentNum;
