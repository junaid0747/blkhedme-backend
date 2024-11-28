import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import ProfileImg from "../Assets/profileImg.svg";
import IdentityImg from "../Assets/identityImg.svg";
// import { toast } from "react-toastify";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";
import pdfImg from "../Assets/pdf.svg";
import otherImg1 from "../Assets/others1.svg";
import otherImg2 from "../Assets/others2.svg";
import otherImg3 from "../Assets/others3.svg";
import otherImg4 from "../Assets/others4.svg";
import otherImg5 from "../Assets/others5.svg";
import otherImg6 from "../Assets/others6.svg";
import { fetchProviders, updateProvider, changeCertifiedStatus, submitFeatureDates } from '../features/providerSlice';

const urlToFile = async (url, fileName) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();

    // Log the MIME type to see what the URL is returning
    const mimeType = blob.type;
    console.log("MIME type of identity card:", mimeType);

    const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];

    if (!allowedMimeTypes.includes(mimeType)) {
      throw new Error(`Invalid file type: ${mimeType}`);
    }

    return new File([blob], fileName, { type: mimeType });
  } catch (error) {
    console.error("Error converting URL to file:", error);
    throw error;
  }
};

const ProviderPreview = ({ providerData, providerId }) => {

  const [providerInformation, setProviderInformation] = useState(null); // Renamed to providerInformation
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();
  const [featureStartDate, setFeatureStartDate] = useState('');
  const [featureEndDate, setFeatureEndDate] = useState('');


  // Fetch provider information when the component mounts
  const fetchProviderDetails = async () => {
    try {
      const provider = await dispatch(fetchProviders(providerId)).unwrap(); // Assuming fetchProviders returns a single provider's data
      setProviderInformation(provider); // Renamed here
    } catch (error) {
      toast.error("Failed to fetch provider information.");
      console.error("Error fetching provider information:", error);
    }
  };
  useEffect(() => {
    fetchProviderDetails();
  }, [dispatch, providerId]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (!providerInformation) {
      toast.error("Provider information not loaded yet!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("password", password);
      formData.append("confirm_password", confirmPassword);

      // Append other fields fetched from provider information
      formData.append("first_name", providerData.first_name);
      formData.append("last_name", providerData.last_name);
      formData.append("phone", providerData.phone);
      formData.append("email", providerData.email);
      formData.append("area_of_operation", providerData.category.id);
      formData.append("profession", providerData.profession);
      formData.append("identity_card", providerData.identity_card)

      // Convert identity_card URL to file and append it

      // Dispatch updateProvider action with the updated form data
      await dispatch(updateProvider({ id: providerId, updatedData: formData }));

      toast.success("Password updated successfully!");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error("Failed to update provider information.");
      console.error("Error updating provider:", error);
    }
  };


  const formattedDate = new Date(providerData?.created_at).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });


  const handleCertificationStatusChange = (providerId, status) => {
    dispatch(changeCertifiedStatus({ providerId, certifiedStatus: status }))
      .unwrap()
      .then(() => {
        // dispatch(fetchProviders()); // Refresh providers after the status change
        const message = status === 1 ? 'Document approved successfully' : 'Document rejected successfully';
        toast.success(message);
      })
      .catch((err) => {
        toast.error(`Failed to change status: ${err.message || err}`);
      });
  };
  const handleFormSubmit = (providerId, startDate, endDate) => {
    const data = {
      providerId,
      feature_start_date: startDate,
      feature_end_date: endDate,
    };

    dispatch(submitFeatureDates(data))
      .unwrap()
      .then(() => {
        toast.success('Feature dates submitted successfully');
        fetchProviderDetails(); // Refresh provider details after submission
      })
      .catch((err) => {
        toast.error(`Failed to submit feature dates: ${err.message || err}`);
      });
  };


  return (
    <div className="p-4 min-h-screen font-poppins">
      <div className=" rounded-lg">

        <div className="pb-2 mb-4 flex flex-col sm:flex-row items-center justify-between">
          <div className="text-center sm:text-start font-poppins">
            <h1 className="text-xl font-bold">Provider Preview</h1>
            <p className="text-[#616161]">
              Requested to join at {formattedDate}
            </p>
          </div>
          <div className="mt-4 text-right">
            {/* <button className="bg-blue-600 text-white px-6 py-2 rounded-lg">
              Edit
            </button> */}
          </div>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          <div className="lg:col-span-2">
            <div className="bg-gray-50 p-4 border rounded-lg mb-4 shadow-md">
              <h2 className="font-semibold text-lg mb-2 border-b border-black font-inter">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="">
                    <strong className=" font-medium">
                      Name{" "}
                      <div className="w-1 h-1 bg-slate-600 rounded-full inline-block mb-[2px]"></div>{" "}
                    </strong>
                    <strong className="text-[#616161] text-[12px] ml-1">
                      {`${providerData?.first_name} ${providerData?.last_name}`}
                    </strong>
                  </p>
                  <p>
                    <strong className="font-medium">
                      Contact Phone 2{" "}
                      <div className="w-1 h-1 bg-slate-600 rounded-full inline-block mb-[2px]"></div>{" "}
                    </strong>{" "}
                    <strong className="text-[#616161] text-[12px] ml-1">
                      {providerData?.phone || "N/A"}
                    </strong>
                  </p>
                </div>
                <div>
                  <p>
                    <strong className="font-medium">
                      Email{" "}
                      <div className="w-1 h-1 bg-slate-600 rounded-full inline-block mb-[2px]"></div>{" "}
                    </strong>
                    <strong className="text-[#616161] text-[12px] ml-1">
                      {providerData?.email || "N/A"}
                    </strong>
                  </p>
                  <p>
                    <strong className="font-medium">
                      Subscription Plan{" "}
                      <div className="w-1 h-1 bg-slate-600 rounded-full inline-block mb-[2px]"></div>{" "}
                    </strong>
                    <span className="text-blue-600">
                      Free Membership (15 days Left)
                    </span>
                  </p>
                </div>
              </div>
              {/* Images */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <img
                  src={providerData?.image}
                  alt={`${providerData?.first_name} ${providerData?.last_name}`}
                  className="rounded-lg"
                />
                <img src={providerData?.identity_card
                } alt="ID Card" className="rounded-lg" />
              </div>
            </div>


            <div className="bg-gray-50 p-4 border rounded-lg mb-4 shadow-md">
              <h2 className="font-semibold text-lg mb-2 border-b border-black font-inter">
                {" "}
                Professional Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                <div>
                  <p>
                    <strong className="font-medium">
                      Profession{" "}
                      <div className="w-1 h-1 bg-slate-600 rounded-full inline-block mb-[2px]"></div>{" "}
                    </strong>
                    <strong className="text-[#616161] text-[12px] ml-1">
                      {providerData?.category?.title || "N/A"}
                    </strong>
                  </p>
                  <p>
                    <strong className="font-medium">
                      Years of Experience{" "}
                      <div className="w-1 h-1 bg-slate-600 rounded-full inline-block mb-[2px]"></div>{" "}
                    </strong>
                    <strong className="text-[#616161] text-[12px] ml-1">
                      {providerData?.years_experience || "N/A"}
                    </strong>
                  </p>
                  <p>
                    <strong className="font-medium">
                      Working Hours{" "}
                      <div className="w-1 h-1 bg-slate-600 rounded-full inline-block mb-[2px]"></div>{" "}
                    </strong>
                    <strong className="text-[#616161] text-[12px] ml-1">
                      {`${providerData?.working_hours_from || "00:00"} - ${providerData?.working_hours_till || "00:00"}`}
                    </strong>
                  </p>
                </div>
                <div>
                  <p>
                    <strong className="font-medium">
                      Profession{" "}
                      <div className="w-1 h-1 bg-slate-600 rounded-full inline-block mb-[2px]"></div>{" "}
                    </strong>
                    <strong className="text-[#616161] text-[12px] ml-1">
                      {providerData?.profession || "N/A"}
                    </strong>
                  </p>
                  <p>
                    <strong className="font-medium">
                      Area of Operation{" "}
                      <div className="w-1 h-1 bg-slate-600 rounded-full inline-block mb-[2px]"></div>{" "}
                    </strong>
                    <strong className="text-[#616161] text-[12px] ml-1">
                      {providerData?.location?.title || "N/A"}
                    </strong>
                  </p>
                </div>
              </div>
            </div>


            <div className="p-4">
              <h2 className="font-semibold text-lg mb-2 border-b border-black font-inter">Other Information</h2>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {providerData?.gallery?.length > 0 &&
                  providerData.gallery.map((item, index) => (
                    <img
                      key={item.id || index}  // Use item.id if available, otherwise fallback to index
                      src={item?.image}  // Access the image URL from the item object
                      alt={`Other info ${index + 1}`}
                      className="rounded-lg"
                    />
                  ))
                }


              </div>
            </div>
          </div>


          <div className="font-inter">
            {/* the updating password seciton is commented uncomment it if you want allow user to update password */}
            {/* <div className="p-4">
              <h1 className="text-xl font-bold mb-4">Update Provider Password</h1>
              {providerInformation ? (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block mb-1">New Password:</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="p-2 border border-gray-300 rounded w-full"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Confirm Password:</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="p-2 border border-gray-300 rounded w-full"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Update Password
                  </button>
                </form>
              ) : (
                <p>Loading provider information...</p>
              )}
            </div> */}
            <div className="bg-gray-50 p-4 border rounded-lg shadow-md">
              <h2 className="font-semibold text-lg mb-4 border-b font-inter border-black">Documents</h2>
              <div className="flex gap-4">
                <div className="text-center">
                  <Link to={providerData?.degree || ""} >
                    <img
                      src={pdfImg}
                      alt="Degree"
                      className="rounded-lg mx-auto"
                    />
                  </Link>
                  <p className="mt-2 text-sm text-[#616161]">{`${providerData?.degree ? "Degree" : "No Degree"}`}</p>
                </div>
                <div className="text-center">
                  <img
                    src={pdfImg}
                    alt="Certificate"
                    className="rounded-lg mx-auto"
                  />
                  <p className="mt-2 text-sm text-[#616161]">{`${providerData?.degree ? "Certificate" : "NO Certificate"}`}</p>
                </div>


              </div>
              <div className="text-center m-2 p-2">
                <button
                  onClick={() => handleCertificationStatusChange(providerId, 1)} // Set certifiedStatus to 1 for "Approve"
                  className="bg-[#0085FF] text-white text-sm px-6 py-2 me-2 rounded-lg shadow-md hover:bg-[#0072cc] transition duration-200 ease-in-out"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleCertificationStatusChange(providerId, 0)} // Set certifiedStatus to 0 for "Reject"
                  className="bg-[#c20a0a] text-white text-sm px-6 py-2 rounded-lg shadow-md hover:bg-[#cc0000] transition duration-200 ease-in-out"
                >
                  Reject
                </button>
              </div>
            </div>
            <div className="bg-gray-50 p-4 border rounded-lg shadow-md">
              <h2 className="font-semibold text-lg mb-4 border-b font-inter border-black">Feature</h2>
              <div className="flex gap-4">
                <div className="text-center">

                </div>
                <div className="text-center">
                </div>


              </div>
              <div className="text-center m-2 p-2">
                {/* Conditionally render form only if is_featured is not 1 */}
                {providerData?.is_featured !== 1 ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleFormSubmit(providerId, featureStartDate, featureEndDate);
                    }}
                    className="flex items-center justify-center space-x-4"
                  >
                    {/* Feature Start Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Feature Start Date
                      </label>
                      <input
                        type="date"
                        value={featureStartDate}
                        onChange={(e) => setFeatureStartDate(e.target.value)}
                        className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0085FF] focus:border-[#0085FF] w-full"
                        required
                      />
                      <label className="block text-sm font-medium text-gray-700">
                        Feature End Date
                      </label>
                      <input
                        type="date"
                        value={featureEndDate}
                        onChange={(e) => setFeatureEndDate(e.target.value)}
                        className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0085FF] focus:border-[#0085FF] w-full"
                        required
                      />
                      <button
                        type="submit"
                        className="mt-2 bg-green-500 text-white text-sm px-6 py-2 rounded-lg shadow-md hover:bg-green-600 transition duration-200 ease-in-out self-end"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                ) : (
                  <p className="text-green-600 text-sm mt-2">
                    Your feature is currently activated.
                  </p>
                )}
              </div>




            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ProviderPreview;
