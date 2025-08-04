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
import Select from "react-select";

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
  const [selectedProfessions, setSelectedProfessions] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [subcategoriesOptions, setSubcategoriesOptions] = useState([]);

  useEffect(() => {
    if (!isOpen || !formData || !categories.length) return;
    console.log('Modal opened with formData:', formData);
    setIdentityCardFile(null); // Clear file input when modal opens

    // Step 1: Professions selected
    const selectedProfessionOptions = (formData.profession || []).map(profId => {
      const match = categories.find(c => c.id === profId);
      return match ? { value: match.id, label: match.title } : null;
    }).filter(Boolean);

    setSelectedProfessions(selectedProfessionOptions);

    // Step 2: Get all subcategories for selected professions
    const allSubs = selectedProfessionOptions
      .map(opt => {
        const cat = categories.find(c => c.id === opt.value);
        return cat?.sub_category || [];
      })
      .flat();

    const subcategoryOptions = allSubs.map(sub => ({
      value: sub.id,
      label: sub.name,
    }));

    setSubcategoriesOptions(subcategoryOptions);

    // Step 3: Mark selected subcategories
    const selectedSubcategoryOptions = (formData.subcategory || []).map(subId => {
      const match = subcategoryOptions.find(opt => opt.value === subId);
      return match || null;
    }).filter(Boolean);

    setSelectedSubcategories(selectedSubcategoryOptions);
  }, [isOpen, formData, categories]);



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

    // Create the form data to submit
    const submitData = {
      ...formData,
      profession: selectedProfessions.map(p => p.value),
      subcategory: selectedSubcategories.map(s => s.value),
    };

    // Call the onSubmit with both the form data and the file
    onSubmit(submitData, identityCardFile);
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

  // For profession
  const handleProfessionChange = (selectedOptions) => {
    setSelectedProfessions(selectedOptions);
    const ids = selectedOptions.map(opt => opt.value);

    // Update formData
    setFormData(prev => ({ ...prev, profession: ids }));

    // Update subcategory options based on selected professions
    const allSubs = selectedOptions
      .map(opt => {
        const cat = categories.find(c => c.id === opt.value);
        return cat?.sub_category || [];
      })
      .flat();

    const options = allSubs.map(sub => ({
      value: sub.id,
      label: sub.name,
    }));

    setSubcategoriesOptions(options);
    setSelectedSubcategories([]);
    setFormData(prev => ({ ...prev, subcategory: [] }));
  };

  // For subcategory
  const handleSubcategoryChange = (selectedOptions) => {
    setSelectedSubcategories(selectedOptions);
    const ids = selectedOptions.map(opt => opt.value);
    setFormData(prev => ({ ...prev, subcategory: ids }));
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Provider</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Personal Information</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Arabic First Name *</label>
                  <input
                    type="text"
                    name="ar_first_name"
                    value={formData.ar_first_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Arabic Last Name *</label>
                  <input
                    type="text"
                    name="ar_last_name"
                    value={formData.ar_last_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Contact Information</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Area of Operation *</label>
                  <select
                    name="area_of_operation"
                    value={formData.area_of_operation}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="" disabled>Select Area of Operation</option>
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
                </div>
              </div>
            </div>

            {/* Professional Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Professional Information</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Professions *</label>
                <Select
                  isMulti
                  value={selectedProfessions}
                  options={categories.map(c => ({ value: c.id, label: c.title }))}
                  onChange={handleProfessionChange}
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subcategories</label>
                <Select
                  isMulti
                  value={selectedSubcategories}
                  options={subcategoriesOptions}
                  onChange={handleSubcategoryChange}
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
              </div>
            </div>

            {/* Identity Card Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Identity Verification</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Identity Card *</label>
                {formData.identity_card && !identityCardFile ? (
                  <div className="mt-2">
                    <img
                      src={formData.identity_card}
                      alt="Identity Card Preview"
                      className="max-w-full h-48 object-contain border rounded-md"
                    />
                    <p className="text-xs text-gray-500 mt-1">Current uploaded file</p>
                  </div>
                ) : identityCardFile ? (
                  <div className="p-3 bg-blue-50 rounded-md">
                    <p className="text-blue-700">New file selected: {identityCardFile.name}</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No identity card uploaded.</p>
                )}

                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload New File</label>
                  <div className="flex items-center">
                    <input
                      type="file"
                      accept=".jpeg, .png, .jpg, .pdf"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                      required={!formData.identity_card && !identityCardFile}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Main Provider List Component
const ProviderList = () => {
  const [categoryFilter, setCategoryFilter] = useState(null);
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
    profession: [],        // <-- should be an array for multi-select
    subcategory: [],       // <-- should also be an array
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

    // Map IDs from pivot relationships
    const professionIds = (provider.provider_professions || []).map(p => p.id);
    const subcategoryIds = (provider.provider_subcategories || []).map(s => s.id);

    setFormData({
      first_name: provider.first_name || '',
      last_name: provider.last_name || '',
      ar_first_name: provider.ar_first_name || '',
      ar_last_name: provider.ar_last_name || '',
      phone: provider.phone || '',
      email: provider.email || '',
      area_of_operation: provider.location_id || '',

      // Ensure these are arrays of IDs
      profession: professionIds,
      subcategory: subcategoryIds,

      identity_card: provider.identity_card || '',
    });

    setEditMode(true);
  };


  // Handle Form Submission
  const handleSubmit = async (formData, file) => {
    try {
      // Validate required fields
      const requiredFields = [
        'first_name',
        'last_name',
        'phone',
        'profession',
        'area_of_operation'
      ];

      const missingFields = requiredFields.filter(field => !formData[field]);

      if (missingFields.length > 0) {
        toast.error(`Missing required fields: ${missingFields.join(', ')}`);
        return;
      }

      const formDataToSend = new FormData();

      // Append all form data
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(item => formDataToSend.append(`${key}[]`, item));
        } else if (value !== null && value !== undefined) {
          formDataToSend.append(key, value);
        }
      });

      // Handle Identity Card
      if (file) {
        formDataToSend.append('identity_card', file);
      } else if (!formData.identity_card) {
        toast.error('Identity card is required');
        return;
      }

      await dispatch(
        updateProvider({ id: selectedProvider.id, updatedData: formDataToSend })
      ).unwrap();

      toast.success('Provider updated successfully');
      dispatch(fetchProviders());
      setEditMode(false);
      resetForm();
    } catch (err) {
      console.error('Update error:', err);

      if (err.message) {
        const errorMessages = Object.values(err.message)
          .flat()
          .join('\n');
        toast.error(`Update failed:\n${errorMessages}`);
      } else {
        toast.error(`Update failed: ${err.message || 'Unknown error'}`);
      }
    }
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
      profession: [],
      subcategory: [],
      identity_card: '',
      // Removed 'image' field to prevent accidental overwriting
    });
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

    if (sortConfig.key === key) {
      direction = sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
    }

    setSortConfig({ key, direction });
  };

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

    // Apply category filter if set
    if (categoryFilter) {
      filtered = filtered.filter(provider =>
        provider.provider_professions?.some(
          profession => profession.id === parseInt(categoryFilter)
        )
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (sortConfig.key === 'category') {
          // Sort by first profession title if available
          const aValue = a.provider_professions?.[0]?.title?.toLowerCase() || '';
          const bValue = b.provider_professions?.[0]?.title?.toLowerCase() || '';

          if (aValue < bValue) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
          }
          if (aValue > bValue) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
          }
          return 0;
        } else if (sortConfig.key === 'created_at') {
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
        <div className="flex justify-between items-center mb-4 mt-4">
          <div className="relative w-48 ">
            <select
              value={categoryFilter || ''}
              onChange={(e) => setCategoryFilter(e.target.value || null)}
              className="block w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>
        </div>
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
                      '↕'
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
                  <div className="flex flex-col items-center">
                    {provider.provider_professions?.length > 0 ? (
                      <>
                        <span className="font-medium">
                          {provider.provider_professions[0].title}
                        </span>
                        {provider.provider_professions.length > 1 && (
                          <span className="text-xs text-gray-500">
                            +{provider.provider_professions.length - 1} more
                          </span>
                        )}
                        {provider.provider_subcategories?.length > 0 && (
                          <div className="flex flex-wrap justify-center gap-1 mt-1">
                            {provider.provider_subcategories.map(subcategory => (
                              <span
                                key={subcategory.id}
                                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                              >
                                {subcategory.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </div>
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
        locations={locations} // Pass ocations to the modal
      />
    </div>
  );
};

export default ProviderList;
