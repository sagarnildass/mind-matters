import React from 'react';

const CardContent = ({ title, number }) => (
  <div className="flex justify-between items-start w-full p-3">
    <div className="sm:w-auto"> {/* Added sm:w-auto to make it responsive */}
      <p className="text-gray-400 text-lg">{title}</p>
      <div className="flex items-baseline space-x-4">
        <h2 className="text-white text-2xl text-center ml-2">{number}</h2>
      </div>
    </div>
  </div>
);

export default CardContent;
