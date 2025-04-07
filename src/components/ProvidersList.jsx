import { Link } from 'react-router-dom';
import profileImg from '../Assets/topproviderImg.svg';

const ProvidersList = ({ providers }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-2/3 lg:w-1/2">
      <div className="flex justify-between items-center mb-4 font-poppins">
        <h3 className="font-semibold">Top Providers</h3>
        <Link to="/list-of-provider" className="text-[#0085FF] underline text-sm">
          View All
        </Link>
      </div>
      {providers.map((provider, idx) => (
        <div key={idx} className="flex items-center justify-between h-18 p-2 border-b-[1px] font-inter">
          <div className="flex items-center gap-2">
            <div className="Image w-12 h-12 rounded-full bg-gray-300 overflow-hidden">
              <img src={profileImg} alt="Profile-image" />
            </div>
            <div>
              <div className="font-medium mb-1">{provider.first_name} {provider.last_name}</div>
              <div className="flex gap-2 items-center text-[#616161] text-[12px]">
                Rating
                <div className="text-[#E5801A]">★★★★★</div>
              </div>
            </div>
          </div>
          <div className="text-[12px] text-[#616161] mt-5">{provider.username}</div>
        </div>
      ))}
    </div>
  );
};

export default ProvidersList;
