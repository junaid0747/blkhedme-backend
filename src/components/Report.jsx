import React from 'react';
import ReviewImg from '../Assets/manImg.jpg';

const Report = ({ reports, fetchReport }) => {
    const token = localStorage.getItem('authToken');
    const handleDelete = async (id) => {
        try {
            const res = await fetch(`https://apiv2.blkhedme.com/api/admin/provider/reports/delete/${id}`, {
                method: 'DELETE',
                headers : {
                    'Accept': 'application/json',
                    "Authorization": `Bearer ${token}`,
                  }
            });

            if (res.ok) {
                alert("Report deleted successfully");
                if (fetchReport) fetchReport(); // Refresh list if you pass fetchReport prop
            } else {
                const err = await res.json();
                alert(err.message || "Error deleting report");
            }
        } catch (error) {
            console.error("Error deleting report:", error);
            alert("Something went wrong");
        }
    };
console.log(reports,'rep');
    return (
        <>
            {reports.map((data, id) => (
                <div
                    key={id}
                    className='bg-[#FFFFFF] flex gap-4 p-4 w-full md:w-2/3 my-3 rounded-md shadow-md font-poppins'
                >
                    {/* <div className="image w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-ccenter">
                        <img src={data?.user?.image || ReviewImg} alt="review-image" className="w-full h-full object-cover" />
                    </div> */}
                    <div className="flex-grow">
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-4'>
                                <h1 className='font-semibold'>{data?.comment}</h1>
                                <span className='text-[12px] font-medium text-[#616161]'>
                                    {new Date(data?.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <button
                                onClick={() => handleDelete(data?.id)}
                                className="text-red-500 text-sm hover:underline"
                            >
                                Delete
                            </button>
                        </div>
                        {/* <span className='text-[12px] text-[#616161]'>
                            Rating <span className='text-[#E5801A] ml-1'>{data?.rating}</span>
                        </span> */}
                        <p>{data?.message}</p>
                    </div>
                </div>
            ))}
        </>
    );
};

export default Report;
