// src/components/ProviderList.js

import React, { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { FiMoreVertical } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  fetchProviders,
  deleteProvider,
  updateProvider,
  updateProviderStatus,
  updateProviderProfessionalStatus,
  updateProviderAvailability
} from '../features/providerSlice';
import { fetchCategories } from '../features/categorySlice';
import notificationImg from '../Assets/notificationImg.png';
import DownloadCsv from '../components/DownloadCsv';
import { fetchLocations } from "../features/locationSlice";

// Modal Component for Editing Provider
const EditProviderModal = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  categories,
  locations = [] // Added locations prop
}) => {

  const [identityCardFile, setIdentityCardFile] = useState(null);

  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  useEffect(() => {
    if (isOpen) {
      setIdentityCardFile(null); // Reset file when modal opens
    }


  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setIdentityCardFile(e.target.files[0]); // Set the selected file
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(identityCardFile); // Pass the file along with form submission
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;

    setFormData((prev) => ({
      ...prev,
      profession: categoryId,
      subcategory: "" // Reset subcategory
    }));

    const selectedCategory = categories.find(
      (category) => category.id === parseInt(categoryId)
    );

    setSubcategories(selectedCategory?.sub_category || []);
  };


  return (
    <div className="h-screen w-screen fixed top-0 left-0 inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50 p-16">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] h-[95%] overflow-y-scroll">
        <h2 className="text-lg font-semibold mb-4">Edit Provider</h2>
        <form onSubmit={handleSubmit}>
          {/* First Name */}
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="First Name"
            className="border mb-2 p-2 w-full"
            required
          />

          {/* Last Name */}
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Last Name"
            className="border mb-2 p-2 w-full"
            required
          />
          <input
            type="text"
            name="ar_first_name"
            value={formData.ar_first_name}
            onChange={handleChange}
            placeholder="Arabic First Name"
            className="border mb-2 p-2 w-full"
            required
          />

          {/* Last Name */}
          <input
            type="text"
            name="ar_last_name"
            value={formData.ar_last_name}
            onChange={handleChange}
            placeholder="Arabic Last Name"
            className="border mb-2 p-2 w-full"
            required
          />
          {/* Phone */}
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="border mb-2 p-2 w-full"
            required
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="border mb-2 p-2 w-full"
            required
          />

          {/* Area of Operation Dropdown */}
          <select
            name="profession"
            value={formData.profession}
            onChange={handleCategoryChange} // ✅ Custom handler
            className="border mb-2 p-2 w-full"
            required
          >
            <option value="" disabled>
              Select Profession
            </option>
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))
            ) : (
              <option disabled>Loading categories...</option>
            )}
          </select>
          <select
            name="subcategory"
            value={formData.subcategory}
            onChange={handleChange}
            className="border mb-2 p-2 w-full"
            required
          >
            <option value="" disabled>
              Select Subcategory
            </option>
            {subcategories.length > 0 ? (
              subcategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))
            ) : (
              <option disabled>No subcategories available</option>
            )}
          </select>


          {/* Profession Dropdown */}
          <select
            name="area_of_operation"
            value={formData.area_of_operation}
            onChange={handleChange}
            className="border mb-2 p-2 w-full"
            required
          >
            <option value="" disabled>
              Select Area of Operation
            </option>
            {locations && locations.length > 0 ? (
              locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.title}
                </option>
              ))
            ) : (
              <option disabled>Loading area of operation...</option>
            )}
          </select>

          {/* Identity Card Upload */}
          <div className="mb-2 mt-4">
            <label className="block mb-1">Identity Card:</label>
            {formData.identity_card && !identityCardFile ? (
              <img
                src={formData.identity_card}
                alt="Identity Card Preview"
                className="mt-2 mb-2 border rounded"
                style={{ width: '100%', height: 200 }}
              />
            ) : identityCardFile ? (
              <p className="mb-2">New file selected: {identityCardFile.name}</p>
            ) : (
              <p>No identity card uploaded.</p>
            )}
            <input
              type="file"
              accept=".jpeg, .png, .jpg, .pdf"
              onChange={handleFileChange}
              // Make required if no existing identity card and no new file is selected
              required={!formData.identity_card && !identityCardFile}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between mt-4">
            <button
              type="button"
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#0085FF] text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Provider List Component
const ProviderList = () => {

  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);

  const [sortConfig, setSortConfig] = useState({
    key: 'created_at',
    direction: 'descending',
  });

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    ar_first_name: '',
    ar_last_name: '',
    phone: '',
    email: '',
    area_of_operation: '',
    profession: '',
    subcategory: '',
    identity_card: '',
    // Removed 'image' field to prevent accidental overwriting
  });

  const [filterType, setFilterType] = useState('all');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Selectors for providers and categories from Redux store
  const providersState = useSelector((state) => state.providers);
  const {
    providers = [],
    loading = false,
    error = null,
    updateStatus,
    updateError,
  } = providersState || {};

  const categoriesState = useSelector((state) => state.categories);
  const locationState = useSelector((state) => state.locations);

  const { categories = [], loading: loadingCategories } = categoriesState || {};
  const { locations = [], loading: loadingLocations } = locationState || {};
  // Fetch providers and categories on component mount
  useEffect(() => {
    dispatch(fetchProviders());
    dispatch(fetchCategories());
    dispatch(fetchLocations());
  }, [dispatch]);

  // Handle update status changes
  useEffect(() => {
    if (updateStatus === 'succeeded') {
      toast.success('Provider updated successfully');
      dispatch(fetchProviders());
    }
    if (updateStatus === 'failed') {
      toast.error(`Failed to update status: ${updateError}`);
    }
  }, [updateStatus, updateError, dispatch]);

  // Handle Edit Button Click
  const handleEdit = (provider) => {
    setSelectedProvider(provider);
    setFormData({
      first_name: provider.first_name || '',
      last_name: provider.last_name || '',
      ar_first_name: provider.ar_first_name || '',
      ar_last_name: provider.ar_last_name || '',
      phone: provider.phone || '',
      email: provider.email || '',
      area_of_operation: provider.area_of_operation || '',
      profession: provider.profession || '',
      subcategory: provider.sub_category_id || '',
      identity_card: provider.identity_card || '',
      // Ensure 'image' is not part of formData to prevent overwriting
    });

    setEditMode(true);
  };

  // Handle Form Submission
  const handleSubmit = (file) => {
    // Check for required fields
    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.phone
    ) {
      toast.error('Please fill out all required fields.');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('first_name', formData.first_name);
    formDataToSend.append('last_name', formData.last_name);
    formDataToSend.append('ar_first_name', formData.ar_first_name);
    formDataToSend.append('ar_last_name', formData.ar_last_name);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('area_of_operation', formData.area_of_operation);
    formDataToSend.append('profession', formData.profession);
    formDataToSend.append('subcategory', formData.subcategory);

    // Handle Identity Card
    if (file) {
      formDataToSend.append('identity_card', file);
    }
    // If no new file is uploaded, do not append 'identity_card' to preserve existing

    // Dispatch the update action with 'updatedData' key
    dispatch(
      updateProvider({ id: selectedProvider.id, updatedData: formDataToSend })
    )
      .unwrap()
      .then(() => {
        toast.success('Provider updated successfully');
        dispatch(fetchProviders());
      })
      .catch((err) => {
        if (err.message) {
          const errorMessages = Object.values(err.message)
            .flat()
            .join('\n');
          alert(
            `Update failed with the following errors:\n${errorMessages}`
          );
        } else {
          toast.error(`Update failed: ${err.message || err}`);
        }
      });

    setEditMode(false);
    resetForm();
  };

  // Reset Form Data
  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      ar_first_name: '',
      ar_last_name: '',
      phone: '',
      email: '',
      area_of_operation: '',
      profession: '',
      identity_card: '',
      // Removed 'image' field to prevent accidental overwriting
    });
  };

  // Filter Providers Based on Status
  const getFilteredProviders = () => {
    let filtered = [...providers];

    // Apply professional status filter
    if (filterType === 'active') {
      filtered = filtered.filter(
        (provider) => provider.professional_status === 'active'
      );
    } else if (filterType === 'inactive') {
      filtered = filtered.filter(
        (provider) => provider.professional_status !== 'active'
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (sortConfig.key === 'category') {
          // Handle category sorting
          const aValue = a.category?.title || '';
          const bValue = b.category?.title || '';

          if (aValue < bValue) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
          }
          if (aValue > bValue) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
          }
          return 0;
        } else if (sortConfig.key === 'created_at') {
          // Handle date sorting (newest first by default)
          const aDate = new Date(a.created_at || 0);
          const bDate = new Date(b.created_at || 0);
          return sortConfig.direction === 'descending'
            ? bDate - aDate
            : aDate - bDate;
        }
        return 0;
      });
    }

    return filtered;
  };

  // Handle Status Change Toggle
  const handleProfessionalStatusChange = (providerId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    dispatch(updateProviderProfessionalStatus({ providerId, newStatus }))
      .unwrap()
      .then(() => {
        dispatch(fetchProviders());
        toast.success('Provider professional status updated successfully');
      })
      .catch((err) => {
        console.log('Error in status change:', err); // Debugging
        dispatch(fetchProviders());
        toast.error(`Failed to change status: ${err}`); // Changed to toast.error
      });
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

  const handleAvailabilityChange = (providerId, currentAvailability) => {
    const newAvailability = currentAvailability === 'active' ? 'inactive' : 'active';
    dispatch(updateProviderAvailability({ providerId, newAvailability }))
      .unwrap()
      .then(() => {
        dispatch(fetchProviders());
        toast.success('Provider Availability updated successfully');
      })
      .catch((err) => {
        toast.error(`Failed to change Availability: ${err.message || err}`);
      });
  };

  // Handle Delete Provider with Confirmation
  const handleDelete = (providerId) => {
    if (
      window.confirm(
        'Are you sure you want to delete this provider? This action cannot be undone.'
      )
    ) {
      dispatch(deleteProvider(providerId))
        .unwrap()
        .then(() => {
          toast.success('Provider deleted successfully');
        })
        .catch((err) => {
          toast.error(`Failed to delete provider: ${err.message || err}`);
        });
    }
  };

  if (loading && providers.length === 0) return <p>Loading...</p>;

  if (error) {
    toast.error(`Error: ${error.message || error}`);
    return null;
  }



  // Add this sorting function
  const sortProviders = (providers) => {
    const sortableItems = [...providers];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        // Handle cases where category might be null
        const aValue = a.category?.title || '';
        const bValue = b.category?.title || '';

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  };

  const requestSort = (key) => {
    let direction = 'ascending';

    // If clicking the same key, toggle direction
    if (sortConfig.key === key) {
      direction = sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
    }
    // If clicking a different key, default to ascending for category
    else if (key === 'category') {
      direction = 'ascending';
    }
    // For date, default to descending (newest first)
    else if (key === 'created_at') {
      direction = 'descending';
    }

    setSortConfig({ key, direction });
  };

  return (
    <div className=" font-poppins">
      {/* Add New Provider Button */}
      <div className="flex justify-end pt-4 pr-4 w-full">
        <DownloadCsv data={getFilteredProviders()} fileName="providers" />


        <button
          className="bg-[#0085FF] text-white text-sm px-6 py-2 rounded-lg shadow-md hover:bg-[#0072cc] transition duration-200 ease-in-out"
          onClick={() => navigate('/add-new-provider')}
        >
          Add New
        </button>
      </div>

      {/* Filter Buttons */}
      <div className="flex space-x-6 border-b pb-2">
        {['all', 'active', 'inactive'].map((type) => (
          <button
            key={type}
            className={`font-semibold text-md transition-colors ${filterType === type
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-500'
              }`}
            onClick={() => setFilterType(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Providers Table */}
      <div className="w-full overflow-x-auto max-h-[500px] px-1">
        <table className="bg-white shadow-md rounded-lg text-sm table-auto w-full">
          <thead>
            <tr className="text-center bg-[#2b4dc9] text-white text-xs h-14">
              <th className="p-3">SL</th>
              <th className="p-3">Provider</th>
              <th className="p-3">Rating</th>
              <th className="p-3">Contact</th>
              <th
                className="p-3 cursor-pointer hover:bg-blue-800"
                onClick={() => requestSort('category')}
              >
                <div className="flex items-center justify-center">
                  Category
                  <span className="ml-1">
                    {sortConfig.key === 'category' ? (
                      sortConfig.direction === 'ascending' ? '↑' : '↓'
                    ) : (
                      '↕' // This is the neutral sort indicator (up-down arrow)
                    )}
                  </span>
                </div>
              </th>
              <th className="p-3">Views</th>
              <th className="p-3">Reports</th>
              <th className="p-3">Calls</th>
              <th className="p-3">Availability</th>
              <th className="p-3">Professional Status</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {getFilteredProviders().map((provider, index) => (
              <tr
                key={provider.id}
                className="border-b text-xs text-center hover:bg-gray-50 transition-colors"
              >
                <td className="p-2">{index + 1}</td>
                <td className="p-2">
                  <div className="flex items-center">
                    <img
                      src={provider.image || notificationImg} // Fallback image if provider.image is null
                      alt={`${provider.first_name} ${provider.last_name}`}
                      className="w-8 h-8 rounded-full mr-2"
                      style={{ width: '50px', height: '50px' }}

                    />
                    {`${provider.first_name} ${provider.last_name}`}
                  </div>
                </td>
                <td className="p-2">
                  <div className="flex items-center justify-center">
                    <FaStar className="text-yellow-500 mr-1" />
                    {provider.average_rating || 0}
                  </div>
                </td>
                <td className="p-2">
                  {provider.email || 'N/A'}
                  <br />
                  {provider.phone || 'N/A'}
                </td>
                <td className="p-2">
                  {provider.category?.title || 'N/A'}
                </td>
                <td className="p-2">{provider.views_count || 0}</td>
                <td className="p-2">
                  {provider.provider_reviews_count || 'N/A'}
                </td>
                <td className="p-2">
                  {provider.call_logs_count || 'N/A'}
                </td>
                <td className="p-2">
                  {/* <input
                    type="checkbox"
                    checked={provider.availability === 'active'}
                    readOnly
                  /> */}
                  <input
                    type="checkbox"
                    id={`status-${provider.id}`}
                    checked={provider.availability === 'active'}
                    onChange={() =>
                      handleAvailabilityChange(
                        provider.id,
                        provider.availability
                      )
                    }
                    className="mr-2 cursor-pointer"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="checkbox"
                    id={`status-${provider.id}`}
                    checked={provider.professional_status === 'active'}
                    onChange={() =>
                      handleProfessionalStatusChange(
                        provider.id,
                        provider.professional_status
                      )
                    }
                    className="mr-2 cursor-pointer"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="checkbox"
                    id={`status-${provider.id}`}
                    checked={provider.status === 'active'}
                    onChange={() =>
                      handleStatusChange(
                        provider.id,
                        provider.status
                      )
                    }
                    className="mr-2 cursor-pointer"
                  />
                </td>
                <td className="p-2 relative">
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() =>
                      setDropdownOpen(
                        dropdownOpen === provider.id ? null : provider.id
                      )
                    }
                  >
                    <FiMoreVertical />
                  </button>
                  {dropdownOpen === provider.id && (
                    <div className="absolute right-0 bg-white shadow-md rounded mt-1 z-10">

                      <button
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        onClick={() =>
                          navigate(`/onboarding-provider-profile?id=${provider.id}`)
                        }
                      >
                        View
                      </button>
                      <button
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        onClick={() => handleEdit(provider)}
                      >
                        Edit
                      </button>
                      <button
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        onClick={() => handleDelete(provider.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ToastContainer />

      {/* Modal for editing provider */}
      <EditProviderModal
        isOpen={editMode}
        onClose={() => {
          setEditMode(false);
          resetForm(); // Reset form when modal closes
        }}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        categories={categories}
        locations={locations} // Pass locations to the modal
      />
    </div>
  );
};

export default ProviderList;
