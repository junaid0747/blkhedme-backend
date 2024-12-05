import React from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const DownloadCsv = ({ data, fileName, fileType = 'csv' }) => {
  const handleDownload = () => {
    if (!data || data.length === 0) {
      alert('No data available for download');
      return;
    }

    // Dynamically map headers and prepare data
    const formattedData = data.map((item) => {
      const formattedItem = {};
      Object.keys(item).forEach((key) => {
        const header = key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()); // Convert to 'Title Case'
        formattedItem[header] = item[key];
      });
      return formattedItem;
    });

    // Create a worksheet from the formatted data
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // Create a workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Save file
    const fileExtension = fileType === 'csv' ? '.csv' : '.xlsx';
    const mimeType =
      fileType === 'csv'
        ? 'application/octet-stream'
        : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    const fileBuffer =
      fileType === 'csv'
        ? XLSX.write(workbook, { bookType: 'csv', type: 'array' })
        : XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const blob = new Blob([fileBuffer], { type: mimeType });
    saveAs(blob, `${fileName || 'download'}${fileExtension}`);
  };

  return (
    <button onClick={handleDownload} style={buttonStyle}>
      Download {fileType.toUpperCase()}
    </button>
  );
};

// Optional Styling
const buttonStyle = {
  backgroundColor: '#4CAF50',
  color: 'white',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '16px',
  marginRight: '4px',
};

export default DownloadCsv;
