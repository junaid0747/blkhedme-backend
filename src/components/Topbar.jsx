

import { FaSearch } from 'react-icons/fa';
import React, { useState } from "react";
import { CiGlobe } from "react-icons/ci";
import { IoMdArrowDropdown } from "react-icons/io";
import { useDispatch } from "react-redux"; // Import useDispatch
import { logoutSuccess } from "../authSlice"; // Import logoutSuccess action from Redux
import { useNavigate, useLocation } from "react-router-dom"; // Import useNavigate for redirection
import person from "../Assets/person.png";
import { fetchProviders } from '../features/providerSlice';
import { fetchSeekers } from '../features/seekerSlice';
import { fetchCategories, } from "../features/categorySlice";
import { fetchSubCategories, } from "../features/subCategorySlice";
import { fetchBanners } from "../features/promotionalBannerSlice";


const Topbar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("EN");
  const [isLogoutOpen, setLogoutOpen] = useState(false); // State for logout dropdown
  const [searchQuery, setSearchQuery] = useState("");

  const dispatch = useDispatch(); // Initialize dispatch
  const navigate = useNavigate(); // Initialize navigate for redirection
  const location = useLocation();

  const handleDropdownToggle = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    setDropdownOpen(false);
  };

  const handleLogoutToggle = () => {
    setLogoutOpen(!isLogoutOpen); // Toggle the logout dropdown
  };

  const handleLogout = () => {
    dispatch(logoutSuccess()); // Dispatch the logoutSuccess action to update the state
    navigate("/sign-in"); // Redirect to the sign-in page
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);  // Update query on input change
  };

  // Handle the search button click
  const handleSearch = () => {
    console.log('Searching for:', searchQuery); // Log the query for debugging

    // Check if the searchQuery is empty
    if (!searchQuery.trim()) {
      console.log('No search query entered. Fetching all data...');

      // Call function to fetch all data
      switch (location.pathname) {
        case '/list-of-provider':
          searchProviders('');  // Pass an empty string or null to fetch all providers
          break;
        case '/list-of-seeker':
          searchSeekers('');    // Add logic for fetching all seekers if needed
          break;
        case '/onboarding-requests-page':
          searchRequests('');   // Add logic for fetching all requests if needed
          break;
        case '/category-setup':
          searchCategories('');   // Add logic for fetching all requests if needed
          break;
        case '/sub-category-setup':
          searchSubCategories('');   // Add logic for fetching all requests if needed
          break;
        case '/promotional-banners':
          searchBanners('');   // Add logic for fetching all requests if needed
          break;
        default:
          console.log('Search route not found');
          break;
      }
      return; // Exit early to avoid unnecessary search
    }

    // If there is a search query, perform the filtered search
    switch (location.pathname) {
      case '/list-of-provider':
        searchProviders(searchQuery);  // Search logic for providers
        break;
      case '/list-of-seeker':
        searchSeekers(searchQuery);    // Search logic for seekers
        break;
      case '/onboarding-requests-page':
        searchRequests(searchQuery);   // Search logic for requests
        break;
      case '/category-setup':
        searchCategories(searchQuery);   // Add logic for fetching all requests if needed
        break;
      case '/sub-category-setup':
        searchSubCategories(searchQuery);   // Add logic for fetching all requests if needed
        break;
      case '/promotional-banners':
        searchBanners(searchQuery);   // Add logic for fetching all requests if needed
        break;
      default:
        console.log('Search route not found');
        break;
    }
  };

  const searchProviders = (query) => {
    if (query.trim() === '') {
      dispatch(fetchProviders());
    } else {
      dispatch(fetchProviders(query));
    }
  };

  const searchSeekers = (query) => {
    if (query.trim() === '') {
      dispatch(fetchSeekers());
    } else {
      dispatch(fetchSeekers(query));
    }
  };

  const searchRequests = (query) => {
    if (query.trim() === '') {
      dispatch(fetchProviders());
    } else {
      dispatch(fetchProviders(query));
    }
  };
  const searchCategories = (query) => {
    if (query.trim() === '') {
      dispatch(fetchCategories());
    } else {
      dispatch(fetchCategories(query));
    }
  };
  const searchSubCategories = (query) => {
    if (query.trim() === '') {
      dispatch(fetchSubCategories());
    } else {
      dispatch(fetchSubCategories(query));
    }
  };
  const searchBanners = (query) => {
    if (query.trim() === '') {
      dispatch(fetchBanners());
    } else {
      dispatch(fetchBanners(query));
    }
  };

  return (
    <header className="bg-white w-full flex flex-col-reverse min-[490px]:flex-row gap-4 justify-center items-center p-4 shadow">
      <div className="flex-grow flex justify-between md:justify-center">
        <div className="flex items-center justify-between bg-gray-100 rounded-lg px-4 min-[490px]:w-1/2 min-w-[120px] border border-black w-full">
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent p-2 outline-none w-full"
            value={searchQuery}
            onChange={handleSearchChange}  // Update query on change
            onKeyDown={(e) => {
              if (e.key === 'Enter') {  // Trigger search when Enter is pressed
                handleSearch();
              }
            }}
          />
          <FaSearch
            className="text-gray-400 cursor-pointer"
            onClick={handleSearch}  // Execute search on click
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* language dropdown */}
        <div className="relative">
          <div
            className="flex items-center bg-gray-200 px-3 py-2 rounded-xl cursor-pointer"
            onClick={handleDropdownToggle}
          >
            <CiGlobe />
            <h1 className="ml-2">{selectedLanguage}</h1>
            <IoMdArrowDropdown className="ml-2" />
          </div>
          {isDropdownOpen && (
            <div
              className="absolute top-full -right-2 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg"
              style={{ width: "100px" }}
            >
              <ul className="list-none p-0 m-0">
                <li
                  className="p-2 hover:bg-[#2B4DC9] cursor-pointer rounded-t-lg"
                  onClick={() => handleLanguageChange("EN")}
                >
                  English
                </li>
                <li
                  className="p-2 hover:bg-[#2B4DC9] cursor-pointer rounded-b-lg"
                  onClick={() => handleLanguageChange("AR")}
                >
                  Arabic
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* User avatar and logout dropdown */}
        <div className="relative">
          <img
            src={person}
            alt="person"
            className="w-8 md:w-10 md:h-10 h-8 cursor-pointer"
            onClick={handleLogoutToggle}
          />
          {isLogoutOpen && (
            <div
              className="absolute top-full right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg"
              style={{ width: "120px" }}
            >
              <ul className="list-none p-0 m-0">
                <li
                  className="p-2 hover:bg-[#2B4DC9] hover:text-white cursor-pointer rounded-lg"
                  onClick={handleLogout}
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
