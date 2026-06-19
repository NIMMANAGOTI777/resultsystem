import React, { useState } from 'react';
import { dbService } from '../services/db';
import { useTranslation } from '../locales/translations';
import type { Language } from '../locales/translations';
import { FileSpreadsheet, Download, CheckCircle, AlertTriangle, List } from 'lucide-react';
import * as XLSX from 'xlsx';

interface ExcelUploadProps {
  language: Language;
}

export const ExcelUpload: React.FC<ExcelUploadProps> = ({ language }) => {
  const { t } = useTranslation(language);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [successCount, setSuccessCount] = useState<number | null>(null);
  const [failedRecords, setFailedRecords] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  // Simulation states
  const [uploadStep, setUploadStep] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [selectedFileSize, setSelectedFileSize] = useState('');

  // Handle Drag Over
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Process Excel File
  const processFile = async (file: File) => {
    setSelectedFileName(file.name);
    const sizeStr = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      : `${(file.size / 1024).toFixed(1)} KB`;
    setSelectedFileSize(sizeStr);

    setLoading(true);
    setErrorMsg('');
    setSuccessCount(null);
    setFailedRecords([]);
    
    setUploadStep('Reading spreadsheet file...');
    setProgressPercent(15);
    await new Promise(resolve => setTimeout(resolve, 400));
    
    setUploadStep('Parsing sheet structure...');
    setProgressPercent(45);
    await new Promise(resolve => setTimeout(resolve, 400));

    setUploadStep('Validating entries & marks rules...');
    setProgressPercent(70);
    await new Promise(resolve => setTimeout(resolve, 300));

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        if (!data) throw new Error("Could not read file data.");
        
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        
        const rawJson: any[] = XLSX.utils.sheet_to_json(sheet);
        
        if (rawJson.length === 0) {
          throw new Error("The Excel sheet is empty.");
        }

        const firstRow = rawJson[0];
        const requiredFields = ["Roll Number", "Student Name", "Class", "Subject"];
        const missingFields = requiredFields.filter(field => !(field in firstRow));

        if (missingFields.length > 0) {
          throw new Error(`Missing required columns: ${missingFields.join(', ')}. Please use the template.`);
        }

        setUploadStep('Saving records to database...');
        setProgressPercent(90);
        await new Promise(resolve => setTimeout(resolve, 400));

        const entriesToSave = rawJson.map((row, index) => {
          const rollNumber = String(row["Roll Number"] || '').trim();
          const studentName = String(row["Student Name"] || '').trim();
          const classVal = String(row["Class"] || '').trim();
          const subjectName = String(row["Subject"] || '').trim();

          const parseMarkValue = (val: any, max: number, name: string) => {
            if (val === undefined || val === null || String(val).trim() === '') return undefined;
            const num = Number(val);
            if (isNaN(num) || num < 0 || num > max) {
              throw new Error(`Row ${index + 2}: ${name} mark "${val}" must be a number between 0 and ${max}.`);
            }
            return num;
          };

          return {
            rollNumber,
            studentName,
            classVal,
            subjectName,
            marks: {
              fa1: parseMarkValue(row["FA1"], 50, "FA1"),
              fa2: parseMarkValue(row["FA2"], 50, "FA2"),
              fa3: parseMarkValue(row["FA3"], 50, "FA3"),
              fa4: parseMarkValue(row["FA4"], 50, "FA4"),
              sa1: parseMarkValue(row["SA1"], 100, "SA1"),
              sa2: parseMarkValue(row["SA2"], 100, "SA2"),
            }
          };
        });

        const result = await dbService.bulkSaveMarks(entriesToSave);
        
        setProgressPercent(100);
        setUploadStep('Import complete!');
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setSuccessCount(result.success);
        setFailedRecords(result.failed);

      } catch (err: any) {
        setErrorMsg(err.message || "An error occurred while parsing the file.");
      } finally {
        setLoading(false);
        setDragActive(false);
      }
    };

    reader.onerror = () => {
      setErrorMsg("File reading failed.");
      setLoading(false);
    };

    reader.readAsBinaryString(file);
  };

  // Handle Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Download Sample Template
  const downloadTemplate = () => {
    const headers = [
      "Roll Number", "Student Name", "Class", "Subject", "FA1", "FA2", "FA3", "FA4", "SA1", "SA2"
    ];
    const sampleData = [
      {
        "Roll Number": "901",
        "Student Name": "P. Suresh Kumar",
        "Class": "9",
        "Subject": "Mathematics",
        "FA1": 45,
        "FA2": 42,
        "FA3": 40,
        "FA4": 46,
        "SA1": 88,
        "SA2": 90
      },
      {
        "Roll Number": "902",
        "Student Name": "G. Divya Sri",
        "Class": "9",
        "Subject": "Science",
        "FA1": 42,
        "FA2": 44,
        "FA3": "",
        "FA4": "",
        "SA1": 85,
        "SA2": ""
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData, { header: headers });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Marksheet Template");
    
    XLSX.writeFile(workbook, "zphs_student_marks_template.xlsx");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('excelUpload')}</h1>
          <p className="text-sm text-slate-400 font-medium">Import academic assessment sheets in bulk from spreadsheet templates.</p>
        </div>
        
        <button
          onClick={downloadTemplate}
          className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold transition text-xs bg-white shadow-sm cursor-pointer"
        >
          <Download className="h-4 w-4 text-slate-650" />
          {t('excelTemplate')}
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-top-2 duration-300">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-550" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successCount !== null && (
        <div className="p-5 bg-green-50/70 border border-green-100 text-green-850 rounded-2xl space-y-3 shadow-sm animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2.5 font-bold text-base text-green-900">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span>{t('uploadSuccess')}</span>
          </div>
          <p className="text-xs sm:text-sm font-semibold">{t('importedCount')} <strong className="text-green-950">{successCount}</strong> entries.</p>
          
          {failedRecords.length > 0 && (
            <div className="bg-white p-3.5 rounded-xl border border-yellow-250/60 text-yellow-850 text-xs space-y-1.5 shadow-sm">
              <span className="font-extrabold flex items-center gap-1 text-[10px] uppercase tracking-wider text-yellow-750">
                <AlertTriangle className="h-3.5 w-3.5 text-yellow-600" />
                Skipped / Unsaved Rows ({failedRecords.length})
              </span>
              <ul className="list-disc pl-4 space-y-1 max-h-32 overflow-y-auto font-medium text-slate-600">
                {failedRecords.map((fail, i) => (
                  <li key={i}>{fail}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Upload Box (SaaS File Dropzone Design) */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`bg-white border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center transition-custom min-h-[300px] shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_20px_-5px_rgba(0,0,0,0.02)] ${
          dragActive ? 'border-primary bg-blue-50/30' : 'border-slate-200 hover:border-primary/60'
        } cursor-pointer`}
        onClick={() => document.getElementById('excel-file-input')?.click()}
      >
        <input
          id="excel-file-input"
          type="file"
          accept=".xlsx,.xls"
          onChange={handleChange}
          className="hidden"
        />

        {loading ? (
          // Simulated SaaS Upload Progress Bar
          <div className="flex flex-col items-center w-full max-w-sm space-y-4 animate-in fade-in duration-300">
            <div className="p-4 bg-blue-50 text-primary rounded-2xl shadow-sm">
              <FileSpreadsheet className="h-8 w-8 animate-bounce" />
            </div>
            <div className="w-full space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-500">{uploadStep}</span>
                <span className="text-primary">{progressPercent}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Selected: {selectedFileName} ({selectedFileSize})
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4.5 bg-blue-50/70 text-primary rounded-3xl border border-blue-100/30 shadow-sm">
              <FileSpreadsheet className="h-10 w-10" />
            </div>
            <div>
              <p className="text-slate-800 font-black text-lg">{t('dragDropExcel')}</p>
              <p className="text-slate-450 text-xs mt-1 max-w-xs mx-auto leading-normal">{t('supportedExcel')} (Max 5MB)</p>
            </div>
            <button className="px-5 py-2.5 bg-primary/10 hover:bg-primary/15 text-primary rounded-xl font-bold text-xs transition cursor-pointer">
              Choose Spreadsheet File
            </button>
          </div>
        )}
      </div>

      {/* Formatting Guidance (Apple Accordion-style layout) */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-3">
        <h3 className="font-extrabold text-slate-800 flex items-center gap-2 text-xs uppercase tracking-wider">
          <List className="h-4.5 w-4.5 text-slate-500" />
          Instructions & Spreadsheet Rules
        </h3>
        <ul className="list-disc pl-5 text-xs text-slate-500 space-y-2 leading-relaxed">
          <li><strong>Roll Number</strong> & <strong>Student Name</strong> must match existing records, or a new student will be automatically registered in the class list.</li>
          <li><strong>Class</strong> should be a valid class number (e.g. 6, 7, 8, 9, 10).</li>
          <li><strong>Subject</strong> should be one of the standard subjects: <em>Telugu, English, Mathematics, Science, Social Studies</em>.</li>
          <li><strong>Formative Assessments (FA1 - FA4)</strong> must be integers between <strong>0 and 50</strong>. Leaving columns blank marks them as pending.</li>
          <li><strong>Summative Assessments (SA1 - SA2)</strong> must be integers between <strong>0 and 100</strong>.</li>
        </ul>
      </div>
    </div>
  );
};
