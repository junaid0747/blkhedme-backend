import React, { useEffect, useState } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSubCategories,
  deleteSubCategory,
  editSubCategory,
  toggleFeatured,
  toggleSubCategoryStatus,
} from "../features/subCategorySlice";
import DownloadCsv from "../components/DownloadCsv";
import { ToastContainer, toast } from 'react-toastify';


const SubCategorySetup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState("");
  const [editArName, setEditArName] = useState("");


  const { subCategories, loading, error } = useSelector(
    (state) => state.subCategories
  );

  useEffect(() => {
    dispatch(fetchSubCategories());
  }, [dispatch]);

  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  const handleEditClick = (category) => {
    if (category) {
      setEditingCategory(category); // Store the entire category object
      setEditName(category.name); // Set the name for editing
      setEditArName(category.ar_name); // Set the name for editing
      setIsModalOpen(true);
    } else {
      alert("Error: Category data is missing or incomplete.");
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this subcategory?")) {
      dispatch(deleteSubCategory(id))
        .unwrap()
        .then(() => dispatch(fetchSubCategories()))
        .catch((err) => alert(`Failed to delete: ${err.message}`));
    }
  };

  const handleSaveEdit = () => {
    // Ensure editingCategory is defined before proceeding
    if (!editingCategory) {
      alert("Error: Editing category data is missing.");
      return;
    }

    if (!editName.trim()) {
      alert("Subcategory name cannot be empty");
      return;
    }

    // Log the editingCategory to verify its contents
    console.log("Editing Category:", editingCategory); // Debugging line
    console.log("Edit Name:", editName); // Debugging line

    // Prepare data for submission
    const updatedData = {
      id: editingCategory.id, // Accessing id from editingCategory
      name: editName,
      ar_name: editArName,
      location_id: parseInt(editingCategory.location_id), // Keep the original location_id
      description: editingCategory.description || "", // Keep the original description
      parent_id: editingCategory.parent_id || 0, // Set to 0 if not provided
    };

    // Submit the data
    dispatch(editSubCategory({ id: updatedData.id, data: updatedData }))
      .unwrap()
      .then(() => {
        setEditingCategory(null);
        setEditName("");
        setEditArName("");
        setIsModalOpen(false);
        dispatch(fetchSubCategories());
      })
      .catch((err) => alert(`Failed to edit: ${err.message}`)); // Show detailed error message
  };

  const handleToggleStatus = async (id) => {
      try {
        await dispatch(toggleSubCategoryStatus(id)).unwrap();
        toast.success('SubCategory status updated successfully');
        dispatch(fetchSubCategories()); 
      } catch (error) {
        toast.error('Failed to update subcategory status');
      }
    };
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <div className="space-y-2 font-poppins">
      <h1 className="font-semibold">Sub Category Setup</h1>
        <div className="flex items-center justify-end">
        <DownloadCsv data={subCategories} fileName="Subcategories" />
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md"
            onClick={() => navigate("/add-new-sub-category")}
          >
            Add New
          </button>
        </div>

        {/* Tabs Section */}
        <div className="flex space-x-4 border-b-2">
          <button className="font-semibold">All</button>
          <button className="font-medium text-gray-500">Active</button>
          <button className="font-medium text-gray-500">Inactive</button>
        </div>

        <div className="w-full overflow-x-auto px-1">
          <table className="table-auto w-full bg-white shadow-md rounded-lg font-inter">
            <thead>
              <tr className="bg-[#2b4dc974] text-xs text-white text-center h-14">
                <th className="relative p-1 md:p-3">
                  <input type="checkbox" className="w-4 h-4" />
                </th>
                <th className="relative p-1 md:p-3">Sl</th>
                <th className="relative p-1 md:p-3">Name</th>
                <th className="relative p-1 md:p-3">Parent Category</th>
                <th className="relative p-1 md:p-3">Number of Providers</th>
                 <th className="relative p-1 md:p-3">Status</th>
                <th className="relative p-1 md:p-3">Is Featured</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subCategories.map((category, index) => (
                <tr key={category?.id || index} className="border-b text-sm text-center text-gray-600 h-12">
                  <td className="p-2">
                    <input type="checkbox" className="w-4 h-4" />
                  </td>
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{category?.name || "N/A"}</td>
                  <td className="p-2">{category?.category?.title || "N/A"}</td>
                  <td className="p-2">{category?.providers_count}</td>
                  <td className="p-2">
                     <label className="relative inline-block">
                    <input
                      type="checkbox"
                      className="peer invisible"
                      checked={category.status === "active"} // Check based on seeker status
                      onChange={() => handleToggleStatus(category.id)} // Handle toggle change
                    />
                    <span className="absolute top-0 left-0 w-9 h-5 cursor-pointer rounded-full bg-slate-200 border border-slate-300 transition-all duration-100 peer-checked:bg-sky-700"></span>
                    <span className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full z-10 transition-all duration-100 peer-checked:translate-x-4"></span>
                  </label>
                  
                  </td>
                  <td className="p-2">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={category?.isFeatured || false}
                        onChange={() => dispatch(toggleFeatured(category?.id))}
                        className="sr-only peer"
                      />
                      <div className="relative w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </td>
                  <td className="relative p-2">
                    <button
                      className="hover:bg-gray-100 cursor-pointer p-1 rounded-full"
                      onClick={() => toggleDropdown(index)}
                      aria-label="Actions"
                    >
                      <FiMoreVertical />
                    </button>
                    {dropdownOpen === index && (
                      <div className="absolute right-0 top-8 bg-white border shadow-md z-10 w-36">
                        <ul>
                          <li 
                            className="hover:bg-gray-100 cursor-pointer p-2"
                            onClick={() => handleEditClick(category)}
                          >
                            Edit
                          </li>
                          <li 
                            className="hover:bg-gray-100 cursor-pointer p-2"
                            onClick={() => handleDelete(category?.id)}
                          >
                            Delete
                          </li>
                        </ul>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Editing Subcategory */}
      {isModalOpen && editingCategory && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Edit Subcategory</h2>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="border rounded px-3 py-2 w-full mb-4"
              placeholder="Subcategory Name"
            />
             <input
              type="text"
              value={editArName}
              onChange={(e) => setEditArName(e.target.value)}
              className="border rounded px-3 py-2 w-full mb-4"
              placeholder="Subcategory Arabic Name"
            />
            <div className="flex justify-between">
              <button
                onClick={handleSaveEdit}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
           <ToastContainer />
        </div>
      )}
    </>
  );
};

export default SubCategorySetup;
