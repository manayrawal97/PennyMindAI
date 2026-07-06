import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud, FiFileText, FiDownload, FiAlertCircle } from 'react-icons/fi';
import { MOCK_CSV_TEXT } from '../../utils/mockData';

export default function UploadArea({ onUploadSuccess, onUploadError }) {
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setErrorMsg(null);
    if (rejectedFiles && rejectedFiles.length > 0) {
      setErrorMsg('Invalid file type. Please upload a valid CSV bank statement.');
      onUploadError && onUploadError('Invalid file type. Please upload a valid CSV.');
      return;
    }

    const file = acceptedFiles[0];
    if (!file) return;

    // Check extension
    const extension = file.name.split('.').pop().toLowerCase();
    if (extension !== 'csv') {
      setErrorMsg('PennyMind AI currently accepts .csv files. Please convert Excel files (.xlsx) to CSV before uploading.');
      onUploadError && onUploadError('Excel formats must be converted to CSV.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      onUploadSuccess(text, file.name);
    };
    reader.onerror = () => {
      setErrorMsg('Failed to read file contents.');
      onUploadError && onUploadError('Failed to read file.');
    };
    reader.readAsText(file);
  }, [onUploadSuccess, onUploadError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    multiple: false,
  });

  const loadSampleData = () => {
    onUploadSuccess(MOCK_CSV_TEXT, 'sample_bank_statement.csv');
  };

  const handleDownloadSample = () => {
    const blob = new Blob([MOCK_CSV_TEXT], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'pennymind_sample_statement.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      {/* Upload Box */}
      <div
        {...getRootProps()}
        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-300 cursor-pointer ${
          isDragActive
            ? 'border-brand-500 bg-brand-50/30 dark:bg-brand-950/20 scale-[1.01]'
            : 'border-gray-300 hover:border-brand-400 dark:border-gray-700 dark:hover:border-brand-500 bg-white dark:bg-gray-900'
        } shadow-md shadow-gray-100/50 dark:shadow-none`}
      >
        <input {...getInputProps()} />

        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 dark:bg-brand-950/30 text-brand-500">
          <FiUploadCloud className="h-8 w-8 animate-pulse-slow" />
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Upload your bank statement
        </h3>
        
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-sm">
          Drag and drop your bank statement <span className="font-semibold text-brand-600 dark:text-brand-400">CSV file</span> here, or click to browse.
        </p>

        <span className="mt-4 rounded-lg bg-gray-100 dark:bg-gray-800 px-2.5 py-1 text-[11px] font-medium text-gray-500 dark:text-gray-400 border border-gray-200/55 dark:border-gray-700/50">
          Supports Standard Formats (Date, Description, Debit/Credit/Amount)
        </span>
      </div>

      {/* Validation Error Message */}
      {errorMsg && (
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 dark:bg-red-950/10 border border-red-200/50 dark:border-red-900/30 p-3.5 text-sm text-red-600 dark:text-red-400">
          <FiAlertCircle className="mt-0.5 h-4.5 w-4.5 flex-shrink-0" />
          <div>
            <span className="font-semibold">Upload failed: </span>
            {errorMsg}
          </div>
        </div>
      )}

      {/* Quick Access Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
        <button
          onClick={loadSampleData}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white shadow-md shadow-brand-500/10 px-5 py-3 text-sm font-semibold transition w-full sm:w-auto justify-center"
        >
          <FiFileText className="h-4.5 w-4.5" />
          <span>Try with Demo Statement</span>
        </button>

        <button
          onClick={handleDownloadSample}
          className="flex items-center gap-2 rounded-xl border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 px-5 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 transition w-full sm:w-auto justify-center"
        >
          <FiDownload className="h-4.5 w-4.5" />
          <span>Download Sample CSV</span>
        </button>
      </div>
    </div>
  );
}
