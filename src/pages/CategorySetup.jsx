import React, { useEffect, useState } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  deleteCategory,
  updateCategory,
  toggleCategoryStatus,
} from "../features/categorySlice";
import DownloadCsv from "../components/DownloadCsv";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CategoryTable = () => {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null); // For storing the category to be edited
  const [newCategoryName, setNewCategoryName] = useState(""); // For editing the name
  const [filter, setFilter] = useState("all"); // New state for filtering categories
  const [selectedCategory, setSelectedCategory] = useState([]);

  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.categories);

  // Toggle Dropdown Menu
  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  const handleDelete = (id) => {
    dispatch(deleteCategory(id)).then(() => dispatch(fetchCategories())); // Refetch after deletion
  };

  // Handle edit functionality
  const handleEdit = (category) => {
    setEditingCategory(category); // Set the category to edit
    setNewCategoryName(category.title); // Pre-fill with the current category name
  };

  const handleEditSubmit = () => {
    if (editingCategory) {
      dispatch(updateCategory({ id: editingCategory.id, updatedData: { title: newCategoryName } }))
        .then(() => {
          dispatch(fetchCategories()); // Refetch categories after update
          setEditingCategory(null); // Close the edit form
        });
    }
  };

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const navigate = useNavigate();

  // Filter categories based on selected filter
  const filteredCategories = categories.filter((category) => {
    if (filter === "active") return category.status; // Show active categories
    if (filter === "inactive") return !category.status; // Show inactive categories
    return true; // Show all categories for 'all'
  });

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p>Error fetching categories: {error}</p>;


  const handleCheckboxChange = (id) => {
    setSelectedCategory((prev) =>
      prev.includes(id) ? prev.filter((categoryId) => categoryId !== id) : [...prev, id]
    );
  };


  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCategory(filteredCategories.map((category) => category.id));
    } else {
      setSelectedCategory([]);
    }
  };


  // const handleDeleteSelected = () => {
  //   if (selectedCategory.length === 0) return;
  //   selectedCategory.forEach((id) => dispatch(deleteCategory(id)));
  //   setSelectedCategory([]);
  // };


  // const handleDeleteAll = () => {
  //   filteredCategories.forEach((category) => dispatch(deleteCategory(category.id)));
  //   setSelectedCategory([]);
  // };

  const handleDeleteSelected = () => {
    if (selectedCategory.length === 0) return;

    Promise.all(
      selectedCategory.map((id) => dispatch(deleteCategory(id)))
    )
      .then(() => {
        toast.success('Selected categories deleted successfully');
        setSelectedCategory([]);
      })
      .catch(() => {
        toast.error('An error occurred while deleting selected categories');
      });
  };

  const handleDeleteAll = () => {
    Promise.all(
      filteredCategories.map((category) => dispatch(deleteCategory(category.id)))
    )
      .then(() => {
        toast.success('All filtered categories deleted successfully');
        setSelectedCategory([]);
      })
      .catch(() => {
        toast.error('An error occurred while deleting all filtered categories');
      });
  };

  const handleToggleStatus = async (id) => {
    try {
      await dispatch(toggleCategoryStatus(id)).unwrap();
      toast.success('Category status updated successfully');
      dispatch(fetchCategories()); 
    } catch (error) {
      toast.error('Failed to update category status');
    }
  };

  return (
    <>
      <div className="space-y-2 font-poppins">
        <div className="flex items-center justify-end">

          <DownloadCsv data={filteredCategories} fileName="categories" />
          <button
            className="bg-blue-500 text-white px-3 md:px-6 py-2 rounded-lg shadow-md"
            onClick={() => navigate("/add-new-category")}
          >
            Add New
          </button>
        </div>

        <div className="flex space-x-4 border-b-[2px]">
          <button
            className={`font-semibold ${filter === "all" ? "text-blue-500" : "text-gray-500"}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`font-medium ${filter === "active" ? "text-blue-500" : "text-gray-500"}`}
            onClick={() => setFilter("active")}
          >
            Active
          </button>
          <button
            className={`font-medium ${filter === "inactive" ? "text-blue-500" : "text-gray-500"}`}
            onClick={() => setFilter("inactive")}
          >
            Inactive
          </button>
        </div>

        <div className="w-full overflow-x-auto px-1">
          <div className="flex justify-end gap-4 mb-4">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={handleDeleteSelected}
              disabled={selectedCategory.length === 0}
            >
              Delete Selected
            </button>
            <button
              className="bg-red-700 text-white px-4 py-2 rounded"
              onClick={handleDeleteAll}
            >
              Delete All
            </button>
          </div>
          <table className="table-auto w-full bg-white shadow-md rounded-lg font-inter">
            <thead>
              <tr className="bg-[#2b4dc974] text-[10px] md:text-[12px] h-14 text-white text-center">
                <th className="relative p-3">
                  <input type="checkbox" className="w-4 h-4" onChange={handleSelectAll}
                    checked={selectedCategory.length === filteredCategories.length && filteredCategories.length > 0} />
                  <span className="absolute top-0 bottom-0 right-0 h-[75%] w-[1px] bg-white m-auto"></span>
                </th>
                <th className="relative p-1 md:p-3">Sl</th>
                <th className="relative p-1 md:p-3">Category Name</th>
                <th className="relative p-1 md:p-3">Sub Category Count</th>
                <th className="relative p-1 md:p-3">Number of Provider</th>
                <th className="relative p-1 md:p-3">Status</th>
                <th className="relative p-1 md:p-3">Is Featured</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category, index) => (
                <tr
                  key={category.id}
                  className="border-b text-sm text-center text-gray-600 h-12"
                >
                  <td className="p-2">
                    <input type="checkbox" className="w-4 h-4"
                      checked={selectedCategory.includes(category.id)}
                      onChange={() => handleCheckboxChange(category.id)}
                    />
                  </td>
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">
                    {editingCategory && editingCategory.id === category.id ? (
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="border rounded px-2 py-1"
                      />
                    ) : (
                      category.title
                    )}
                  </td>
                  <td className="p-2">{category.sub_category_count || "N/A"}</td>
                  <td className="p-2">{category.providers_count || "N/A"}</td>
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
                    {/* Is Featured toggle (read-only) */}
                    <label className="inline-flex items-center cursor-default">
                      <input
                        type="checkbox"
                        checked={!!category.is_featured}
                        readOnly //  toggle read-only
                        className="sr-only peer"
                      />
                      <div className="relative w-9 h-5 bg-gray-200 rounded-full peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                    </label>
                  </td>
                  <td className="relative p-2">
                    {editingCategory && editingCategory.id === category.id ? (
                      <button
                        onClick={handleEditSubmit}
                        className="bg-green-500 text-white px-2 py-1 rounded"
                      >
                        Save
                      </button>
                    ) : (
                      <>
                        <button
                          className="hover:bg-gray-100 cursor-pointer p-1 rounded-full"
                          onClick={() => toggleDropdown(index)}
                        >
                          <FiMoreVertical />
                        </button>
                        {dropdownOpen === index && (
                          <div className="absolute right-0 top-8 bg-white border shadow-md z-10 w-36">
                            <ul>
                              <li
                                className="hover:bg-gray-100 cursor-pointer p-2"
                                onClick={() => handleEdit(category)}
                              >
                                Edit
                              </li>
                              <li
                                className="hover:bg-gray-100 cursor-pointer p-2"
                                onClick={() => handleDelete(category.id)}
                              >
                                Delete
                              </li>
                            </ul>
                          </div>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default CategoryTable;
