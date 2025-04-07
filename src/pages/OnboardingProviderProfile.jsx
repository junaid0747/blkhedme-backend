import React, { useEffect , useState } from 'react';
import ProviderPreview from '../components/ProviderPreview';
import { useDispatch, useSelector } from 'react-redux';
import Review from '../components/Review';
import { fetchProvider } from '../features/providerViewSlice';
import { useLocation } from 'react-router-dom'; // Import useLocation
import Report from '../components/Report';

const OnboardingProviderProfile = () => {
  const dispatch = useDispatch();
  const location = useLocation(); // Initialize useLocation
  const { providerData, loading, error } = useSelector((state) => state.provider);
  const [activeTab, setActiveTab] = useState('reviews');

  // Get the provider ID from the URL query parameter
  const queryParams = new URLSearchParams(location.search);
  const providerId = queryParams.get('id');

  useEffect(() => {
    if (providerId) {
      dispatch(fetchProvider(providerId)); // Fetch provider with the ID from URL
    }
  }, [dispatch, providerId]);



  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const provider = Array.isArray(providerData) && providerData.length > 0 ? providerData[0] : null;

  return (
    <div>
      {provider && <ProviderPreview providerData={provider} providerId={providerId} />} {/* Pass providerId as prop */}
      <div>
      {(provider?.provider_reviews?.length > 0 || provider?.reports?.length > 0) && (
        <>
          <div className="flex space-x-4 border-b font-poppins">
            <button
              onClick={() => setActiveTab('reviews')}
              className={`font-semibold ${activeTab === 'reviews' ? 'text-black' : 'text-gray-500'}`}
            >
              Reviews <span>({provider?.provider_reviews?.length || 0})</span>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`font-semibold ${activeTab === 'reports' ? 'text-black' : 'text-gray-500'}`}
            >
              Reports <span>({provider?.reports?.length || 0})</span>
            </button>
          </div>

          {activeTab === 'reviews' && (
            <div className="reviews">
              <Review reviews={provider?.provider_reviews} />
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="reports">
            <Report reports={provider?.reports} fetchReport={() => dispatch(fetchProvider(providerId))} />
          </div>
          )}
        </>
      )}
    </div>
    </div>
  );
};

export default OnboardingProviderProfile;
