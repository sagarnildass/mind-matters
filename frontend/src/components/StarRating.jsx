import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt, faStarOfDavid } from '@fortawesome/free-solid-svg-icons';

const StarRating = ({ rating }) => {
  if (rating < 0 || rating > 5) {
    console.error('Invalid rating value:', rating);
    return <div>Error: Invalid rating</div>;
  }
  // console.log('Rating:', rating);

  const fullStars = Math.floor(rating);
  const halfStars = (rating - fullStars) >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStars;

  return (
    <div className="flex hover:text-black" title={`Rating: ${rating}`}>
      {[...Array(fullStars)].map((_, i) => (
        <FontAwesomeIcon key={i} icon={faStar} className="text-yellow-400" />
      ))}
      {[...Array(halfStars)].map((_, i) => (
        <FontAwesomeIcon key={i} icon={faStarHalfAlt} className="text-yellow-400" />
      ))}
      {[...Array(emptyStars)].map((_, i) => (
        <FontAwesomeIcon key={i} icon={faStarOfDavid} className="text-yellow-400" />
      ))}
    </div>
  );
};


export default StarRating;
