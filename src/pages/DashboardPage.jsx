import axios from "axios";
import StatsCards from '../components/StatsCards'
import ProvidersList from '../components/ProvidersList'
import OnboardingRequests from '../components/OnboardingRequests';
import EarningsChart from '../components/EarningsChart';
import { useState, useEffect } from "react";
import { fetchProviders } from '../features/providerSlice';
import { useDispatch } from 'react-redux';

const DashboardPage = () => {

  const dispatch = useDispatch();
  const token = localStorage.getItem('authToken');
  const [data, setData] = useState([])

   const fetchGraph =  async ()=>{
    const url = "https://apiv2.blkhedme.com/api/admin/dashboard/statistics"
    try {
      const res = await axios.get(url,{
        headers : {
          'Accept': 'application/json',
          "Authorization": `Bearer ${token}`,
        }
      })
      setData(res.data)
      console.log(res.data);
      
    } catch (error) {
      console.log(error.message);
      
    }
   }

  useEffect(() => {
    dispatch(fetchProviders());
    fetchGraph()
  }, []);

  return (
    <div className='w-full '>
      <StatsCards />
      <div className='flex flex-col'>
        <EarningsChart />
      <div className='flex items-center flex-col lg:flex-row gap-4'>
      <ProvidersList providers={data?.data?.top_providers || []} />
      <OnboardingRequests requests={data?.data?.onboarding_requests || []} />
        
      </div>
      </div>
    </div>
  );
};

export default DashboardPage;
