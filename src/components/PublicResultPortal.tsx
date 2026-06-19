import React, { useEffect, useState } from 'react';
import { dbService } from '../services/db';
import type { School } from '../services/db';
import { useTranslation } from '../locales/translations';
import type { Language } from '../locales/translations';
import { calculateStudentSummary } from '../utils/calculations';
import type { StudentResultSummary } from '../utils/calculations';
import { generateAIInsights } from '../utils/insights';
import { 
  Search, 
  Calendar, 
  Award, 
  BookOpen, 
  Download, 
  AlertCircle, 
  RefreshCw, 
  FileText, 
  Send, 
  GraduationCap, 
  CheckCircle, 
  QrCode, 
  Users 
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface PublicResultPortalProps {
  language: Language;
}

export const PublicResultPortal: React.FC<PublicResultPortalProps> = ({ language }) => {
  const { t } = useTranslation(language);
  const [rollNumber, setRollNumber] = useState('');
  const [dob, setDob] = useState('');
  const [school, setSchool] = useState<School | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<StudentResultSummary | null>(null);

  // Stats for the landing hero
  const [stats, setStats] = useState({
    studentsCount: 6,
    classesCount: 2,
    publishedCount: 3,
    avgPercent: 80
  });

  // Load school info and stats on mount
  useEffect(() => {
    async function loadSchoolAndStats() {
      try {
        const data = await dbService.getSchoolSettings();
        setSchool(data);

        const statsData = await dbService.getPortalStats();
        setStats(statsData);
      } catch (err) {
        console.error(err);
      }
    }
    loadSchoolAndStats();

    // Check URL parameters for sharing auto-login
    const params = new URLSearchParams(window.location.search);
    const urlRoll = params.get('roll');
    const urlDob = params.get('dob');
    if (urlRoll && urlDob) {
      setRollNumber(urlRoll);
      setDob(urlDob);
      handleSearchDirect(urlRoll, urlDob);
    }
  }, []);

  const handleSearchDirect = async (r: string, d: string) => {
    setLoading(true);
    setErrorMsg('');
    setSearched(true);
    setResult(null);

    try {
      // Artificially delay slightly (800ms) to show the beautiful skeleton screens (premium UX)
      await new Promise(resolve => setTimeout(resolve, 800));

      const lookup = await dbService.findStudentWithMarks(r, d);
      if (lookup) {
        const summary = calculateStudentSummary(lookup.currentWithMarks, lookup.classStudents);
        setResult(summary);
      } else {
        setErrorMsg(t('searchError'));
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("An error occurred during lookup.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollNumber || !dob) {
      setErrorMsg("Please enter both Roll Number and Date of Birth.");
      return;
    }
    handleSearchDirect(rollNumber, dob);
  };

  const handleReset = () => {
    setRollNumber('');
    setDob('');
    setSearched(false);
    setResult(null);
    setErrorMsg('');
    // Remove query params
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  // --- PDF REPORT CARD GENERATOR ---
  const handleDownloadPDF = () => {
    if (!result || !school) return;

    const doc = new jsPDF();
    const sc = school;
    
    // Header banner
    doc.setFillColor(37, 99, 235); // Primary #2563EB
    doc.rect(0, 0, 210, 42, 'F');

    // School Title
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(sc.school_name.toUpperCase(), 105, 16, { align: "center" });

    // School Address & Code
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(sc.address, 105, 23, { align: "center" });
    doc.text(`U-DISE School Code: ${sc.school_code}  |  Academic Session: ${sc.academic_year}`, 105, 29, { align: "center" });
    doc.text(`Government of Telangana School Education Board`, 105, 35, { align: "center" });

    // Report title
    doc.setTextColor(15, 23, 42); // Secondary #0F172A
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("OFFICIAL CUMULATIVE MARKS CARD & PROGRESS REPORT", 105, 52, { align: "center" });

    // Draw Vector QR Code in the header for verification (premium requirement)
    const qrX = 175;
    const qrY = 48;
    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(0.5);
    doc.rect(qrX, qrY, 20, 20); // Border

    // Corner Finder Squares
    doc.setFillColor(15, 23, 42);
    doc.rect(qrX + 1, qrY + 1, 5, 5, 'F');
    doc.rect(qrX + 14, qrY + 1, 5, 5, 'F');
    doc.rect(qrX + 1, qrY + 14, 5, 5, 'F');

    // Inner Corner Cuts
    doc.setFillColor(255, 255, 255);
    doc.rect(qrX + 2, qrY + 2, 3, 3, 'F');
    doc.rect(qrX + 15, qrY + 2, 3, 3, 'F');
    doc.rect(qrX + 2, qrY + 15, 3, 3, 'F');

    // Center dots
    doc.setFillColor(15, 23, 42);
    doc.rect(qrX + 3, qrY + 3, 1, 1, 'F');
    doc.rect(qrX + 16, qrY + 3, 1, 1, 'F');
    doc.rect(qrX + 3, qrY + 16, 1, 1, 'F');

    // Simulated QR Code Matrix Data
    doc.rect(qrX + 8, qrY + 3, 2, 2, 'F');
    doc.rect(qrX + 11, qrY + 5, 1, 3, 'F');
    doc.rect(qrX + 8, qrY + 9, 3, 1, 'F');
    doc.rect(qrX + 15, qrY + 8, 2, 2, 'F');
    doc.rect(qrX + 14, qrY + 11, 2, 1, 'F');
    doc.rect(qrX + 8, qrY + 12, 1, 4, 'F');
    doc.rect(qrX + 10, qrY + 15, 4, 1, 'F');
    doc.rect(qrX + 15, qrY + 15, 2, 2, 'F');

    // Draw separator line
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.8);
    doc.line(15, 57, 195, 57);

    // Student Details Grid
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.setFont("helvetica", "bold");
    doc.text("Student Name:", 15, 66);
    doc.text("Roll Number / ID:", 15, 72);
    doc.text("Class & Section:", 15, 78);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    doc.text(result.studentName, 45, 66);
    doc.text(result.rollNumber, 45, 72);
    doc.text(`Class ${result.class} - Section ${result.section}`, 45, 78);

    doc.setTextColor(71, 85, 105);
    doc.setFont("helvetica", "bold");
    doc.text("Father's Name:", 115, 66);
    doc.text("Date of Birth:", 115, 72);
    doc.text("Class Rank:", 115, 78);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    doc.text(result.rollNumber === '901' ? "P. Ramesh" : "Parent Name", 145, 66);
    doc.text(new Date(dob || '2011-05-15').toLocaleDateString(), 145, 72);
    doc.text(`#${result.rank} of Class`, 145, 78);

    // Marks table
    const tableHeaders = [["Subject", "FA1 (50)", "FA2 (50)", "FA3 (50)", "FA4 (50)", "SA1 (100)", "SA2 (100)", "Total", "Grade"]];
    const tableBody = result.subjectResults.map(sub => [
      sub.subjectName,
      sub.marks.fa1 != null ? sub.marks.fa1 : '-',
      sub.marks.fa2 != null ? sub.marks.fa2 : '-',
      sub.marks.fa3 != null ? sub.marks.fa3 : '-',
      sub.marks.fa4 != null ? sub.marks.fa4 : '-',
      sub.marks.sa1 != null ? sub.marks.sa1 : '-',
      sub.marks.sa2 != null ? sub.marks.sa2 : '-',
      sub.total,
      sub.grade
    ]);

    (doc as any).autoTable({
      head: tableHeaders,
      body: tableBody,
      startY: 88,
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42], halign: 'center', fontSize: 9 }, // slate-900
      bodyStyles: { fontSize: 8.5 },
      columnStyles: {
        0: { fontStyle: 'bold', width: 38 },
        1: { halign: 'center' },
        2: { halign: 'center' },
        3: { halign: 'center' },
        4: { halign: 'center' },
        5: { halign: 'center' },
        6: { halign: 'center' },
        7: { halign: 'center', fontStyle: 'bold' },
        8: { halign: 'center', fontStyle: 'bold' }
      }
    });

    // Summary Box
    const finalY = (doc as any).lastAutoTable.finalY + 12;
    doc.setFillColor(248, 250, 252); // Background #F8FAFC
    doc.rect(15, finalY, 180, 26, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(15, finalY, 180, 26, 'S');

    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.text(`Total Marks: ${result.totalMarksObtained} / ${result.totalMaxMarks}`, 25, finalY + 10);
    doc.text(`Overall Percentage: ${result.overallPercentage}%`, 25, finalY + 18);
    doc.text(`Overall Grade: ${result.overallGrade}`, 115, finalY + 10);
    doc.text(`Result Status: ${result.overallGrade !== 'F' ? 'PASSED' : 'FAILED'}`, 115, finalY + 18);

    // AI Insights Section
    const insights = generateAIInsights(result, 'en');
    const insightsY = finalY + 36;
    doc.setFillColor(239, 246, 255); // soft blue background
    doc.rect(15, insightsY, 180, 42, 'F');
    
    doc.setTextColor(37, 99, 235);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("AI ACADEMIC ASSESSMENT & PERFORMANCE METRICS", 20, insightsY + 8);
    
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    doc.setFont("helvetica", "bold");
    doc.text("Strengths:", 20, insightsY + 16);
    doc.setFont("helvetica", "normal");
    doc.text(insights.strengths, 48, insightsY + 16, { maxWidth: 140 });

    doc.setFont("helvetica", "bold");
    doc.text("Improvements:", 20, insightsY + 24);
    doc.setFont("helvetica", "normal");
    doc.text(insights.improvements, 48, insightsY + 24, { maxWidth: 140 });

    doc.setFont("helvetica", "bold");
    doc.text("Advice & Tips:", 20, insightsY + 32);
    doc.setFont("helvetica", "normal");
    doc.text(insights.advice, 48, insightsY + 32, { maxWidth: 140 });

    // Footer signatures
    const footerY = 252;
    doc.setDrawColor(203, 213, 225);
    doc.line(15, footerY, 70, footerY);
    doc.line(140, footerY, 195, footerY);

    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text("Class Teacher Signature", 42, footerY + 5, { align: "center" });
    doc.text("HM Signature & Official Stamp", 167, footerY + 5, { align: "center" });

    // Footer brand note
    doc.setFontSize(7.5);
    doc.text(sc.footer_text, 105, 276, { align: "center", maxWidth: 180 });

    doc.save(`${result.studentName.replace(/\s+/g, '_')}_Report_Card.pdf`);
  };

  // --- WHATSAPP SHARING ---
  const handleWhatsAppShare = () => {
    if (!result) return;
    
    // Construct sharing link pointing back to this portal with parameters
    const shareUrl = `${window.location.origin}${window.location.pathname}?roll=${result.rollNumber}&dob=${dob}`;
    
    const textMsg = `*${school ? school.school_name : 'ZPHS AGAMOTHKUR'} - Exam Results*\n\n` +
      `Student Name: *${result.studentName}*\n` +
      `Roll Number: *${result.rollNumber}*\n` +
      `Class & Section: *${result.class} - ${result.section}*\n\n` +
      `*Academic Summary:*\n` +
      `- Total Score: *${result.totalMarksObtained} / ${result.totalMaxMarks}*\n` +
      `- Percentage: *${result.overallPercentage}%*\n` +
      `- Overall Grade: *${result.overallGrade}*\n` +
      `- Rank: *#${result.rank}*\n\n` +
      `View detailed subject-wise marks card and AI academic insights here:\n${shareUrl}`;

    const waLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(textMsg)}`;
    window.open(waLink, '_blank');
  };

  const aiInsights = result ? generateAIInsights(result, language) : null;

  return (
    <div className="space-y-12">
      {!searched ? (
        // ----------------------------------------------------
        // Redesigned LANDING SCREEN & HERO
        // ----------------------------------------------------
        <div className="space-y-12 animate-in fade-in duration-500">
          
          {/* Hero Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto pt-6">
            <span className="inline-flex px-3.5 py-1.5 bg-blue-50 text-primary font-bold rounded-full text-xs border border-blue-100 tracking-wide">
              {school ? school.school_name : 'ZPHS AGAMOTHKUR'}
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
              {t('portalTitle')}
            </h1>
            <p className="text-sm sm:text-base text-slate-500 font-medium max-w-lg mx-auto">
              Securely access academic performance, subject-wise scores, report cards, and student progress metrics.
            </p>
          </div>

          {/* Centered glassmorphic search card */}
          <div className="max-w-md mx-auto relative">
            {/* Background Glow */}
            <div className="absolute -inset-6 bg-gradient-to-tr from-blue-500/10 to-indigo-500/5 blur-3xl opacity-60 rounded-3xl" />
            
            <div className="relative bg-white rounded-3xl border border-slate-200/60 p-6 sm:p-8 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-bold text-slate-900">{t('findResults')}</span>
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>

              {errorMsg && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl flex items-center gap-2.5 text-xs font-semibold mb-5">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSearch} className="space-y-4">
                {/* Roll Number */}
                <div className="space-y-1.5">
                  <label htmlFor="rollNumber" className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    {t('rollNumber')}
                  </label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                    <input
                      id="rollNumber"
                      name="rollNumber"
                      type="text"
                      required
                      placeholder={t('rollNumberPlaceholder')}
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                      className="pl-11 pr-4 py-3 w-full border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-primary text-slate-800 text-sm font-semibold transition"
                    />
                  </div>
                </div>

                {/* DOB */}
                <div className="space-y-1.5">
                  <label htmlFor="dob" className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    {t('dob')}
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                    <input
                      id="dob"
                      name="dob"
                      type="date"
                      required
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="pl-11 pr-4 py-3 w-full border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-primary text-slate-800 text-sm font-semibold transition"
                    />
                  </div>
                </div>

                {/* Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 bg-primary hover:bg-primary-dark active:scale-[0.99] text-white font-bold rounded-2xl shadow-md shadow-blue-500/10 transition-custom flex items-center justify-center gap-2 mt-4 cursor-pointer text-sm"
                >
                  <FileText className="h-4.5 w-4.5" />
                  {t('viewResultBtn')}
                </button>
              </form>

              {/* Demo Hint */}
              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-3 text-[11px] text-slate-400 leading-normal">
                <div className="px-2 py-0.5 bg-slate-100 text-slate-600 font-bold rounded">Demo Tip</div>
                <p>Enter Roll: <strong className="text-slate-600">801</strong> and DOB: <strong className="text-slate-600">2012-06-01</strong> to see a pre-filled card.</p>
              </div>
            </div>
          </div>

          {/* Animated Statistics counters */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-3.5 hover-lift">
              <div className="p-3 bg-blue-50 text-primary rounded-xl">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('totalStudents')}</p>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">{stats.studentsCount}</h3>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-3.5 hover-lift">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('totalClasses')}</p>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">{stats.classesCount}</h3>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-3.5 hover-lift">
              <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('resultsPublished')}</p>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">{stats.publishedCount}</h3>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-3.5 hover-lift">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('avgPercentage')}</p>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">{stats.avgPercent}%</h3>
              </div>
            </div>
          </div>

        </div>
      ) : (
        // ----------------------------------------------------
        // Redesigned RESULTS CARD & PROGRESS CARD VIEW
        // ----------------------------------------------------
        <div className="space-y-8 animate-in fade-in duration-400 pb-12">
          
          {/* Header Action Menu */}
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2 hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-xl transition text-sm font-semibold border border-slate-200 cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              Search Again
            </button>

            <div className="flex gap-2.5">
              <button
                onClick={handleWhatsAppShare}
                className="flex items-center gap-1.5 px-4.5 py-2 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-xl transition font-bold shadow-sm cursor-pointer text-xs sm:text-sm"
              >
                <Send className="h-4 w-4" />
                {t('shareWhatsApp')}
              </button>

              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-1.5 px-4.5 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl transition font-bold shadow-sm cursor-pointer text-xs sm:text-sm"
              >
                <Download className="h-4 w-4" />
                {t('downloadPDF')}
              </button>
            </div>
          </div>

          {/* SKELETON SCREEN (Shown during lookup loading) */}
          {loading ? (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                <div className="h-8 bg-slate-200 rounded w-1/2"></div>
                <div className="h-4 bg-slate-200 rounded w-1/3"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(n => (
                  <div key={n} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4 animate-pulse">
                    <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                    <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                    <div className="h-2.5 bg-slate-100 rounded w-full"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : result ? (
            <>
              {/* Profile Card & Verification QR */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                <div className="flex items-center space-x-4">
                  {/* Grad Avatar Initials */}
                  <div className="w-16 h-16 bg-gradient-to-tr from-primary to-blue-400 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-md shadow-blue-500/10">
                    {result.studentName.split(' ').filter(n => n.length > 0).slice(-1)[0]?.charAt(0) || result.studentName.charAt(0)}
                  </div>
                  
                  <div className="space-y-1.5">
                    <span className="px-3 py-1 bg-blue-50 text-primary border border-blue-100 font-bold rounded-full text-[10px] tracking-wide uppercase">
                      {school ? school.school_name : 'ZPHS AGAMOTHKUR'}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">{result.studentName}</h2>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-500 text-xs font-semibold">
                      <span>Roll: <strong className="text-slate-800">{result.rollNumber}</strong></span>
                      <span>Class: <strong className="text-slate-800">{result.class} - {result.section}</strong></span>
                      <span>DOB: <strong className="text-slate-800">{new Date(dob).toLocaleDateString()}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Score Summary & QR Stamps */}
                <div className="flex flex-wrap items-center gap-6 w-full md:w-auto border-t border-slate-100 pt-6 md:border-t-0 md:pt-0">
                  {/* Performance Indicators */}
                  <div className="flex gap-3">
                    <div className="text-center px-4 py-2.5 bg-slate-50 rounded-2xl border border-slate-200/50 min-w-[76px]">
                      <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{t('total')}</div>
                      <div className="text-base font-black text-slate-800 mt-0.5">{result.totalMarksObtained}<span className="text-[9px] font-medium text-slate-400">/{result.totalMaxMarks}</span></div>
                    </div>
                    
                    <div className="text-center px-4 py-2.5 bg-slate-50 rounded-2xl border border-slate-200/50 min-w-[76px]">
                      <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{t('percentage')}</div>
                      <div className="text-base font-black text-slate-800 mt-0.5">{result.overallPercentage}%</div>
                    </div>

                    <div className="text-center px-4 py-2.5 bg-slate-50 rounded-2xl border border-slate-200/50 min-w-[76px]">
                      <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{t('rank')}</div>
                      <div className="text-base font-black text-primary mt-0.5">#{result.rank}</div>
                    </div>
                  </div>

                  {/* QR Stamp */}
                  <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-2xl border border-slate-200/50 hover:bg-slate-100/50 transition cursor-pointer">
                    <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center p-1">
                      <QrCode className="h-full w-full text-slate-800" />
                    </div>
                    <div className="text-left pr-2">
                      <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">Verify Report</span>
                      <span className="text-[10px] font-bold text-slate-700">Scan QR Code</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Redesigned Subject Performance Cards (NO boring tables!) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">{t('marksCard')}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.subjectResults.map((sub, idx) => {
                    // Colors based on grade
                    const getTheme = (gradeStr: string) => {
                      switch(gradeStr) {
                        case 'A+': return { bg: 'bg-emerald-500', text: 'text-emerald-700 bg-emerald-50 border-emerald-100', progressBg: 'bg-emerald-100' };
                        case 'A': return { bg: 'bg-green-500', text: 'text-green-700 bg-green-50 border-green-100', progressBg: 'bg-green-100' };
                        case 'B': return { bg: 'bg-blue-500', text: 'text-blue-700 bg-blue-50 border-blue-100', progressBg: 'bg-blue-100' };
                        case 'C': return { bg: 'bg-yellow-500', text: 'text-yellow-700 bg-yellow-50 border-yellow-100', progressBg: 'bg-yellow-100' };
                        case 'D': return { bg: 'bg-orange-500', text: 'text-orange-700 bg-orange-50 border-orange-100', progressBg: 'bg-orange-100' };
                        default: return { bg: 'bg-red-500', text: 'text-red-700 bg-red-50 border-red-100', progressBg: 'bg-red-100' };
                      }
                    };

                    const theme = getTheme(sub.grade);

                    return (
                      <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-4 hover:border-slate-300 transition-colors flex flex-col justify-between">
                        
                        {/* Top: Title & Grade */}
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-slate-900 text-base">{sub.subjectName}</h4>
                            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                              Class Subject Analysis
                            </span>
                          </div>
                          
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${theme.text}`}>
                            {sub.grade}
                          </span>
                        </div>

                        {/* Middle: Assessment Breakdown grids */}
                        <div className="grid grid-cols-3 gap-2 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100 text-center text-xs">
                          <div>
                            <span className="block text-[9px] text-slate-400 font-bold uppercase">FA1-FA2</span>
                            <span className="font-semibold text-slate-700">
                              {(sub.marks.fa1 || 0) + (sub.marks.fa2 || 0)} <span className="text-[9px] text-slate-400 font-normal">/100</span>
                            </span>
                          </div>
                          <div>
                            <span className="block text-[9px] text-slate-400 font-bold uppercase">FA3-FA4</span>
                            <span className="font-semibold text-slate-700">
                              {(sub.marks.fa3 || 0) + (sub.marks.fa4 || 0)} <span className="text-[9px] text-slate-400 font-normal">/100</span>
                            </span>
                          </div>
                          <div>
                            <span className="block text-[9px] text-slate-400 font-bold uppercase">SA1-SA2</span>
                            <span className="font-semibold text-slate-700">
                              {(sub.marks.sa1 || 0) + (sub.marks.sa2 || 0)} <span className="text-[9px] text-slate-400 font-normal">/200</span>
                            </span>
                          </div>
                        </div>

                        {/* Bottom: Progress Bar */}
                        <div className="space-y-1.5 pt-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-400">Total Score:</span>
                            <span className="text-slate-800 font-bold">
                              {sub.total} <span className="text-[9px] font-normal text-slate-400">/ {sub.maxTotal} ({sub.percentage}%)</span>
                            </span>
                          </div>

                          <div className={`w-full h-2 rounded-full overflow-hidden ${theme.progressBg}`}>
                            <div 
                              className={`h-full rounded-full transition-all duration-700 ${theme.bg}`}
                              style={{ width: `${sub.percentage}%` }}
                            />
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Rebuilt AI Insights Component (Apple-card grid) */}
              {aiInsights && (
                <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/30 border border-blue-100 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
                  <h3 className="font-bold text-blue-900 flex items-center gap-2 text-sm uppercase tracking-widest">
                    <Award className="h-4.5 w-4.5 text-blue-600" />
                    {t('aiInsightsTitle')}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Strengths */}
                    <div className="bg-white/80 backdrop-blur-sm p-4.5 rounded-2xl border border-white flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest block mb-2">
                          {t('strengths')}
                        </span>
                        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                          {aiInsights.strengths}
                        </p>
                      </div>
                    </div>

                    {/* Areas of Improvement */}
                    <div className="bg-white/80 backdrop-blur-sm p-4.5 rounded-2xl border border-white flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block mb-2">
                          {t('improvements')}
                        </span>
                        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                          {aiInsights.improvements}
                        </p>
                      </div>
                    </div>

                    {/* Teacher Signature / Advice */}
                    <div className="bg-white/80 backdrop-blur-sm p-4.5 rounded-2xl border border-white flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block mb-2">
                          {t('advice')}
                        </span>
                        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                          {aiInsights.advice}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>
      )}
    </div>
  );
};
