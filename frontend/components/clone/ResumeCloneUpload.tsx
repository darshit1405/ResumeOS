import React, { useRef, useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { UploadCloud, FileText, Check, AlertCircle, RefreshCw } from 'lucide-react';

export const ResumeCloneUpload: React.FC = () => {
  const { uploadResumeOcr, isScanning } = useResumeStore();
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = async (file: File) => {
    if (!file) return;
    const allowed = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!allowed.includes(file.type)) {
      alert('Only PDF, PNG, and JPG files are supported for parsing.');
      return;
    }

    setFileName(file.name);
    setStatus('scanning');
    try {
      await uploadResumeOcr(file);
      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        setFileName(null);
      }, 4000);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center transition cursor-pointer text-center ${
          dragActive
            ? 'border-indigo-650 bg-indigo-50/20'
            : 'border-slate-200 bg-white hover:bg-slate-50/50'
        }`}
        onClick={onButtonClick}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleChange}
          disabled={isScanning || status === 'scanning'}
        />

        {status === 'idle' && (
          <>
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-full mb-3 text-slate-450 shadow-sm">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-slate-800">
              Drag & drop resume here
            </p>
            <p className="text-[10px] text-slate-450 mt-1">
              Supports standard formats: PDF, PNG, JPG (Max 5MB)
            </p>
          </>
        )}

        {status === 'scanning' && (
          <>
            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-full mb-3 text-indigo-650 shadow-sm animate-spin">
              <RefreshCw className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-slate-800">
              Analyzing document structure...
            </p>
            <p className="text-[10px] text-indigo-600 font-semibold mt-1 truncate max-w-full px-4">
              OCR scanning: {fileName}
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-full mb-3 text-emerald-650 shadow-sm">
              <Check className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-slate-900">
              Successfully cloned!
            </p>
            <p className="text-[10px] text-emerald-650 font-medium mt-1">
              Resume workspace loaded with extracted details.
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="p-3 bg-rose-50 border border-rose-100 rounded-full mb-3 text-rose-650 shadow-sm">
              <AlertCircle className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-slate-900">
              OCR Parsing failed
            </p>
            <p className="text-[10px] text-rose-500 font-semibold mt-1">
              Check server connection and retry.
            </p>
          </>
        )}
      </div>
    </div>
  );
};
