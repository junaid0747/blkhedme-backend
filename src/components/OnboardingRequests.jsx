import { Link } from "react-router-dom";
import Img from "../Assets/manImg.jpg";

const OnboardingRequests = ({ requests }) => {
  const requestArray = Array.isArray(requests) ? requests : Object.values(requests);
  console.log(requestArray, '1122');

  const timeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const seconds = Math.floor((now - past) / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const [unit, value] of Object.entries(intervals)) {
      const count = Math.floor(seconds / value);
      if (count > 0) {
        return `${count} ${unit}${count > 1 ? 's' : ''} ago`;
      }
    }

    return "Just now";
  };


  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-2/3 lg:w-1/2">
      <div className="flex justify-between items-center mb-4 font-poppins">
        <h3 className="font-semibold text-[#0C0302]">
          Onboarding Provider Requests
        </h3>
        <Link to="/onboarding-requests-page" className="text-[#0085FF] underline text-sm">
          View All
        </Link>
      </div>
      {requestArray.map((request, idx) => (
        <div key={idx} className="flex items-center justify-between h-18 max-h-18 p-2 border-b-[1px] font-inter">
          <div className="flex gap-2">
            <div className="Image w-12 h-12 rounded-full bg-gray-300 overflow-hidden">
              <img src={Img} className="w-full bg-cover bg-center" alt="profile-image" />
            </div>
            <div>
              <div className="font-medium mb-2">
                {request.first_name} {request.last_name}
              </div>
              <div className="flex gap-2 items-center text-[#616161]">
                <div className="text-[12px]">{request.email || 'No email'}</div>
                <div className="flex items-center w-[5px] h-[5px] rounded-full bg-gray-600"></div>
                <div className="time text-[12px] text-[#616161]"> {timeAgo(request.created_at)}</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between">
            <div className="text-[#E5801A] text-[10px] mb-2">Not Verified</div>
            <div className="text-[12px] text-[#616161]">{request.username}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OnboardingRequests;
