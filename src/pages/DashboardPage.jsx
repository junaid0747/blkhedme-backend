import StatsCards from '../components/StatsCards'
import ProvidersList from '../components/ProvidersList'
import OnboardingRequests from '../components/OnboardingRequests';
import EarningsChart from '../components/EarningsChart';
import { useEffect } from 'react';
import { fetchProviders } from '../features/providerSlice';
import { useDispatch } from 'react-redux';
const DashboardPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProviders());
  }, []);
  return (
    <div className='w-full '>
      <StatsCards />
      <div className='flex flex-col'>
        <EarningsChart />
      <div className='flex items-center flex-col lg:flex-row gap-4'>
        <ProvidersList />
        <OnboardingRequests />
        
      </div>
      </div>
    </div>
  );
};

export default DashboardPage;
