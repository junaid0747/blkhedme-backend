import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsThreeDots } from "react-icons/bs";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import notificationImg from "../Assets/notificationImg.png"; // Default image for providers without one
import { fetchProviders, updateProvider, updateProviderStatus } from "../features/providerSlice"; // Assuming this is the correct path
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DownloadCsv from "./DownloadCsv";

const OnboardTable = ({ activeTab }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate
  const [activePopup, setActivePopup] = useState(null);
  const [status, setstatus] = useState("active");
  const token = localStorage.getItem('authToken');
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [selectAll, setSelectAll] = useState(false);


  const toHandleStatusDeny = async (id) =>{
    console.log(id);
    const url = "https://apiv2.blkhedme.com/api/admin/provider/professional/status"
    const data = {
       provider_id:id,
       professional_status:"inactive"
    }

    try {
      const res = await axios.post(url, data , {
        headers : {
          'Accept': 'application/json',
          Authorization: `Bearer ${token}`,
        }

    
      })
      setActivePopup(null)
      dispatch(fetchProviders())
      console.log(res.data);
      
    } catch (err) {
      console.log(err.message);
      
    }
    
  }
  const toHandleStatusApproved = async (id) =>{
    console.log(id);
    const url = "https://apiv2.blkhedme.com/api/admin/provider/professional/status"
    const data = {
       provider_id:id,
       professional_status:"active"
    }

    try {
      const res = await axios.post(url, data , {
        headers : {
          'Accept': 'application/json',
          Authorization: `Bearer ${token}`,
        }

    
      })
      dispatch(fetchProviders());
      setActivePopup(null)
      console.log(res.data);
      
    } catch (err) {
      console.log(err.message);
      
    }
    
  }

  // Fetching providers from the Redux store
  const { providers, loading, error } = useSelector((state) => state.providers);

  // Dispatch fetchProviders when the component mounts
  useEffect(() => {
    dispatch(fetchProviders());
  }, []);

  // Toggle popup visibility
  const togglePopup = (id) => {
    setActivePopup(activePopup === id ? null : id);
  };

  // Approve handler: update professional_status to 'active'
  const handleApprove = (provider) => {
    const updatedProvider = {
      id: provider.id,
       professional_status: "active", 
    };
  
    console.log("Approve action - updatedProvider:", updatedProvider); // Log data before dispatching
    dispatch(updateProvider({ id: provider.id, updatedData: updatedProvider })); // Pass correct structure
    setActivePopup(null); // Close popup after action
  };

  // Deny handler: update professional_status to 'inactive'
  const handleDeny = (provider) => {
    const updatedProvider = {
      // id: provider.id,
      first_name: provider.first_name,
      last_name: provider.last_name,
      phone:provider?.phone ||"N/A",
      profession: provider?.profession || "N/A",
      area_of_operation: provider?.category.title || "N/A",
      // identity_card: provider.identity_card,
      professional_status: "inactive", // Set to inactive
      location_id: Number(provider.location_id) || null,
    };
  
    console.log("Deny action - updatedProvider:", updatedProvider); // Log data before dispatching
    dispatch(updateProvider({ id: provider.id, updatedData: updatedProvider })); // Pass correct structure
    setActivePopup(null); // Close popup after action
  };

  // Filter requests based on the active tab
  const filteredRequests =
    activeTab === "onboarding"
      ? providers.filter((request) => request.professional_status !== "inactive" && request.professional_status === "pending")
      : providers.filter((request) => request.professional_status === "inactive"); // Assuming "inactive" is for denied requests


    // Toggle individual checkbox
    const handleCheckboxChange = (id) => {
      setSelectedRequests((prev) =>
        prev.includes(id)
          ? prev.filter((requestId) => requestId !== id) // Remove if already selected
          : [...prev, id] // Add if not selected
      );
    };
  
    // Toggle select all
    const handleSelectAll = () => {
      if (selectAll) {
        setSelectedRequests([]); // Deselect all
      } else {
        setSelectedRequests(filteredRequests.map((request) => request.id)); // Select all
      }
      setSelectAll(!selectAll);
    };
  
    // Approve selected
    // API for bulk approval
   const handleApproveSelected = async () => {
    const url = "https://apiv2.blkhedme.com/api/admin/provider/professional/status";

    try {
      // Loop through selected IDs and approve each
      await Promise.all(
        selectedRequests.map(async (id) => {
          const data = {
            provider_id: id,
            professional_status: "active",
          };
          return axios.post(url, data, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
        })
      );
      dispatch(fetchProviders());
      setSelectedRequests([]);
      setSelectAll(false);
      console.log("Bulk approval successful");
    } catch (err) {
      console.log("Error in bulk approval:", err.message);
    }
  };

  const handleDenySelected = async () => {
    const url = "https://apiv2.blkhedme.com/api/admin/provider/professional/status";

    try {
      // Loop through selected IDs and approve each
      await Promise.all(
        selectedRequests.map(async (id) => {
          const data = {
            provider_id: id,
            professional_status: "inactive",
          };
          return axios.post(url, data, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
        })
      );
      dispatch(fetchProviders());
      setSelectedRequests([]);
      setSelectAll(false);
      console.log("Bulk deny successful");
    } catch (err) {
      console.log("Error in bulk approval:", err.message);
    }
  };

  const handleStatusChange = (providerId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    dispatch(updateProviderStatus({ providerId, newStatus }))
      .unwrap()
      .then(() => {
        dispatch(fetchProviders());
        toast.success('Provider status updated successfully');
      })
      .catch((err) => {
        toast.error(`Failed to change status: ${err.message || err}`);
      });
  };
  
  return (
    <div className="mt-4 overflow-x-auto">
      <div className="m-3 flex justify-end">
      <DownloadCsv data={filteredRequests} fileName="onboarding-requests" />
      <button
        onClick={handleApproveSelected}
        className="me-2 bg-[#0085FF] text-white text-sm px-6 py-2 rounded-lg shadow-md hover:bg-[#0072cc] transition duration-200 ease-in-out"
        disabled={selectedRequests.length === 0}
      >
        Approve Selected
      </button>
      <button
        onClick={handleDenySelected}
        className="bg-[#d81a1a] text-white text-sm px-6 py-2 rounded-lg shadow-md hover:bg-[#a70808] transition duration-200 ease-in-out"
        disabled={selectedRequests.length === 0}
      >
        Deny Selected
      </button>
      </div>
      
      {loading ? (
        <p>Loading providers...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md mb-20">
          <thead>
            <tr className="bg-[#8498E0] text-white text-xs ">
              <th className="p-3 ">
                <span className="block py-2 px-3 border-r border-gray-300">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
                </span>
              </th>
              <th className="p-0 ">
                <span className="block py-2 px-3 border-r border-gray-300">
                  ID
                </span>
              </th>
              <th className="p-0 ">
                <span className="block py-2 px-3 border-r border-gray-300">
                  Provider
                </span>
              </th>
              <th className="p-0 ">
                <span className="block py-2 px-3 border-r border-gray-300">
                  Contact
                </span>
              </th>
              <th className="p-0 ">
                <span className="block py-2 px-3 border-r border-gray-300">
                  Category
                </span>
              </th>
              <th className="p-0 ">
                <span className="block py-2 px-3 border-r border-gray-300">
                  Sub-Category
                </span>
              </th>
              <th className="p-0 ">
                <span className="block py-2 px-3 border-r border-gray-300">
                  Rating
                </span>
              </th>
              <th className="p-0 ">
                <span className="block py-2 px-3 border-r border-gray-300">
                  Professional Status
                </span>
              </th>
              <th className="p-0 ">
                <span className="block py-2 px-3 border-r border-gray-300">
                  City
                </span>
              </th>
              <th className="p-0 ">
                <span className="block py-2 px-3 border-r border-gray-300">
                  status
                </span>
              </th>
              <th className="p-0">
                <span className="block py-2 px-3">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((request, index) => (
              <tr key={request.id} className="border-b border-gray-200 text-sm">
                <td className="p-3 text-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded"
                  checked={selectedRequests.includes(request.id)}
                  onChange={() => handleCheckboxChange(request.id)}
                />
                </td>
                <td className="p-3 text-center">{`0${index + 1}`}</td>
                <td className="p-3">
                  <div className="flex items-center space-x-2">
                    <img
                      src={request.image || notificationImg} // Use default image if request.image is null
                      alt="Provider"
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{`${request.first_name} ${request.last_name}`}</span>
                  </div>
                </td>
                <td className="p-3 text-center ">{request.phone || "N/A"}</td>
                <td className="p-3 text-center">{request.category?.title || "N/A"}</td>
                <td className="p-3 text-center">
                  {request?.sub_categories?.name || 'N/A'}
                </td>
                <td className="p-3 text-center">
                  {request.average_rating || "N/A"}
                </td>
                <td className="p-3 text-center">
                   
                   {request.professional_status || "N/A"}
                </td>
                <td className="p-3 text-center">{request.city || "N/A"}</td>
                <td className="p-2">
                  <input
                    type="checkbox"
                    id={`status-${request.id}`}
                    checked={request.status === 'active'}
                    onChange={() =>
                      handleStatusChange(
                        request.id,
                        request.status
                      )
                    }
                    className="mr-2 cursor-pointer"
                  />
                </td>
                <td className="relative p-2 md:p-4">
                  <BsThreeDots
                    className="h-5 w-5 text-[#707070] ml-4 cursor-pointer"
                    onClick={() => togglePopup(request.id)}
                  />
                  {activePopup === request.id && (
                    <div className="absolute right-0 top-8 bg-white text-center flex-col justify-center items-center mr-0 sm:mr-10 inline-block py-2 px-4 rounded-lg text-[#0000009C] shadow-lg border-2 z-50">
                      <h1
                        className="cursor-pointer text-xs md:text-sm"
                        onClick={() =>
                          navigate(`/onboarding-provider-profile?id=${request.id}`)
                        } // Navigate on View click
                      >
                        View
                      </h1>
                      <h1
                        className="cursor-pointer text-xs md:text-sm"
                        id={request.id}
                        onClick={(e) => toHandleStatusApproved(e.target.id)} // Handle approve click
                      >
                        Approve
                      </h1>
                      <h1
                        className="cursor-pointer mt-1 text-xs md:text-sm"
                        id={request.id}
                        onClick={(e) => toHandleStatusDeny(e.target.id)} // Handle deny click
                      >
                        Deny
                      </h1>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
       <ToastContainer />
    </div>
  );
};

export default OnboardTable;
