import React, { useEffect, useState } from 'react';
import { dbService } from '../services/db';
import type { Student, Subject, Mark, ActivityLog } from '../services/db';
import { calculateSubjectTotal, calculateSubjectMaxTotal } from '../utils/calculations';
import { useTranslation } from '../locales/translations';
import type { Language } from '../locales/translations';
import { Users, BookOpen, CheckCircle, Award, ListTodo, TrendingUp } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface DashboardProps {
  language: Language;
}

export const Dashboard: React.FC<DashboardProps> = ({ language }) => {
  const { t } = useTranslation(language);
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const studList = await dbService.getStudents();
        const subList = await dbService.getSubjects();
        const markList = await dbService.getAllMarks();
        const actList = await dbService.getRecentActivities();

        setStudents(studList);
        setSubjects(subList);
        setMarks(markList);
        setActivities(actList);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span className="ml-3 text-slate-600">{t('loading')}</span>
      </div>
    );
  }

  // --- STATS CALCULATIONS ---
  const totalStudents = students.length;
  
  // Total Classes
  const uniqueClasses = Array.from(new Set(students.map(s => s.class)));
  const totalClasses = uniqueClasses.length;

  // Results Published (students who have at least one marks record)
  const studentsWithMarks = Array.from(new Set(marks.map(m => m.student_id)));
  const resultsPublished = studentsWithMarks.length;

  // Overall Average Percentage
  let totalOverallObtained = 0;
  let totalOverallMax = 0;
  
  // Calculate average percentage of students who have marks
  students.forEach(s => {
    const studentMarks = marks.filter(m => m.student_id === s.id);
    if (studentMarks.length > 0) {
      studentMarks.forEach(m => {
        totalOverallObtained += calculateSubjectTotal(m);
        totalOverallMax += calculateSubjectMaxTotal(m);
      });
    }
  });
  
  const avgPercentage = totalOverallMax === 0 ? 0 : Math.round((totalOverallObtained / totalOverallMax) * 100);

  // --- CHART 1: SUBJECT PERFORMANCE ---
  // Average percentage per subject
  const subjectAverages = subjects.map(sub => {
    const subMarks = marks.filter(m => m.subject_id === sub.id);
    let totalObt = 0;
    let totalMax = 0;
    subMarks.forEach(m => {
      totalObt += calculateSubjectTotal(m);
      totalMax += calculateSubjectMaxTotal(m);
    });
    const pct = totalMax === 0 ? 0 : Math.round((totalObt / totalMax) * 100);
    return { name: sub.subject_name, value: pct };
  });

  const subjectChartData = {
    labels: subjectAverages.map(s => {
      if (language === 'te') {
        const lower = s.name.toLowerCase();
        if (lower.includes('telugu')) return 'తెలుగు';
        if (lower.includes('english')) return 'ఇంగ్లీష్';
        if (lower.includes('math')) return 'గణితం';
        if (lower.includes('science')) return 'సైన్స్';
        if (lower.includes('social')) return 'సాంఘిక';
      }
      return s.name;
    }),
    datasets: [
      {
        label: t('subjectPerformance'),
        data: subjectAverages.map(s => s.value),
        backgroundColor: '#2563EB',
        hoverBackgroundColor: '#1D4ED8',
        borderRadius: 6,
        barThickness: 20,
      },
    ],
  };

  // --- CHART 2: CLASS PERFORMANCE ---
  // Average percentage per class
  const classAverages = uniqueClasses.map(cls => {
    const studentsInClass = students.filter(s => s.class === cls);
    let totalObt = 0;
    let totalMax = 0;

    studentsInClass.forEach(s => {
      const studentMarks = marks.filter(m => m.student_id === s.id);
      studentMarks.forEach(m => {
        totalObt += calculateSubjectTotal(m);
        totalMax += calculateSubjectMaxTotal(m);
      });
    });

    const pct = totalMax === 0 ? 0 : Math.round((totalObt / totalMax) * 100);
    return { className: cls, value: pct };
  });

  const classChartData = {
    labels: classAverages.map(c => `${t('class')} ${c.className}`),
    datasets: [
      {
        label: t('classPerformance'),
        data: classAverages.map(c => c.value),
        backgroundColor: '#4F46E5',
        hoverBackgroundColor: '#4338CA',
        borderRadius: 6,
        barThickness: 24,
      },
    ],
  };

  // --- CHART 3: PASS PERCENTAGE ---
  let passCount = 0;
  let failCount = 0;

  students.forEach(s => {
    const studentMarks = marks.filter(m => m.student_id === s.id);
    if (studentMarks.length > 0) {
      let obtained = 0;
      let max = 0;
      studentMarks.forEach(m => {
        obtained += calculateSubjectTotal(m);
        max += calculateSubjectMaxTotal(m);
      });
      const pct = max === 0 ? 0 : (obtained / max) * 100;
      if (pct >= 50) {
        passCount++;
      } else {
        failCount++;
      }
    }
  });

  const passChartData = {
    labels: language === 'en' ? ['Passed (>=50%)', 'Failed (<50%)'] : ['ఉత్తీర్ణత (>=50%)', 'అనుత్తీర్ణత (<50%)'],
    datasets: [
      {
        data: [passCount || 1, failCount || 0],
        backgroundColor: ['#10B981', '#EF4444'],
        hoverBackgroundColor: ['#059669', '#DC2626'],
        borderWidth: 1,
      },
    ],
  };

  // --- Chart.js Premium Customizations ---
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0F172A',
        titleFont: { family: 'Inter', size: 12, weight: 'bold' as const },
        bodyFont: { family: 'Inter', size: 12 },
        padding: 12,
        cornerRadius: 12,
        boxPadding: 6,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: { family: 'Inter', size: 11, weight: 'normal' as const },
          color: '#64748B'
        }
      },
      y: {
        min: 0,
        max: 100,
        grid: { color: '#F1F5F9' },
        ticks: {
          font: { family: 'Inter', size: 11 },
          color: '#64748B',
          stepSize: 25
        }
      }
    }
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth: 8,
          boxHeight: 8,
          usePointStyle: true,
          pointStyle: 'circle',
          font: { family: 'Inter', size: 11, weight: 'normal' as const },
          color: '#64748B',
          padding: 16
        }
      },
      tooltip: {
        backgroundColor: '#0F172A',
        titleFont: { family: 'Inter', size: 12, weight: 'bold' as const },
        bodyFont: { family: 'Inter', size: 12 },
        padding: 12,
        cornerRadius: 12,
        boxPadding: 6,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      }
    },
    cutout: '72%'
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('dashboard')}</h1>
          <p className="text-sm text-slate-400 font-medium">{t('subTitle')}</p>
        </div>
      </div>

      {/* --- CARDS (Premium Double Shadow & Hover lifts) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Students */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_20px_-5px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-between group">
          <div className="space-y-1.5">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">{t('totalStudents')}</p>
            <h3 className="text-3xl font-black text-slate-950 tracking-tight leading-none">{totalStudents}</h3>
          </div>
          <div className="p-3.5 rounded-2xl bg-blue-50/70 text-primary group-hover:scale-105 transition-transform duration-300 border border-blue-100/50 shadow-sm flex-shrink-0">
            <Users className="h-5 w-5" />
          </div>
        </div>

        {/* Card 2: Total Classes */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_20px_-5px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-between group">
          <div className="space-y-1.5">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">{t('totalClasses')}</p>
            <h3 className="text-3xl font-black text-slate-955 tracking-tight leading-none">{totalClasses}</h3>
          </div>
          <div className="p-3.5 rounded-2xl bg-indigo-50/70 text-indigo-600 group-hover:scale-105 transition-transform duration-300 border border-indigo-100/50 shadow-sm flex-shrink-0">
            <BookOpen className="h-5 w-5" />
          </div>
        </div>

        {/* Card 3: Results Published */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_20px_-5px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-between group">
          <div className="space-y-1.5">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">{t('resultsPublished')}</p>
            <h3 className="text-3xl font-black text-slate-950 tracking-tight leading-none">
              {resultsPublished} <span className="text-xs font-semibold text-slate-400">/ {totalStudents}</span>
            </h3>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 text-emerald-600 group-hover:scale-105 transition-transform duration-300 border border-emerald-100/50 shadow-sm flex-shrink-0">
            <CheckCircle className="h-5 w-5" />
          </div>
        </div>

        {/* Card 4: Average Percentage */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_20px_-5px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-between group">
          <div className="space-y-1.5">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">{t('avgPercentage')}</p>
            <h3 className="text-3xl font-black text-slate-955 tracking-tight leading-none">{avgPercentage}%</h3>
          </div>
          <div className="p-3.5 rounded-2xl bg-amber-50/70 text-amber-600 group-hover:scale-105 transition-transform duration-300 border border-amber-100/50 shadow-sm flex-shrink-0">
            <Award className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* --- CHARTS & ACTIVITY SECTION (2-Column Grid) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Subject Performance */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_20px_-5px_rgba(0,0,0,0.02)] border border-slate-100 lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
            <div className="p-1.5 bg-blue-50 text-primary rounded-lg">
              <TrendingUp className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              {t('subjectPerformance')} (%)
            </h3>
          </div>
          <div className="h-64 flex justify-center">
            {subjectAverages.length > 0 ? (
              <Bar data={subjectChartData} options={barChartOptions} />
            ) : (
              <div className="text-slate-400 text-sm flex items-center">{t('noData')}</div>
            )}
          </div>
        </div>

        {/* Chart 2: Pass vs Fail Doughnut */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_20px_-5px_rgba(0,0,0,0.02)] border border-slate-100 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              {t('passPercentage')}
            </h3>
          </div>
          <div className="h-64 flex justify-center items-center relative">
            {resultsPublished > 0 ? (
              <div className="w-48 h-48 relative">
                <Doughnut data={passChartData} options={doughnutChartOptions} />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-[-10px]">
                  <span className="text-3xl font-black text-slate-900">
                    {Math.round((passCount / (resultsPublished || 1)) * 100)}%
                  </span>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mt-0.5">
                    {t('passRate') || 'Pass Rate'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-slate-400 text-sm">{t('noActivity') || 'No results published'}</div>
            )}
          </div>
        </div>

        {/* Chart 3: Class Performance */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_20px_-5px_rgba(0,0,0,0.02)] border border-slate-100 lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <BookOpen className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              {t('classPerformance')} (%)
            </h3>
          </div>
          <div className="h-64 flex justify-center">
            {classAverages.length > 0 ? (
              <Bar data={classChartData} options={{ ...barChartOptions, plugins: { ...barChartOptions.plugins, legend: { display: false } } }} />
            ) : (
              <div className="text-slate-400 text-sm flex items-center">{t('noData')}</div>
            )}
          </div>
        </div>

        {/* Recent Activity (SaaS Timeline Design) */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_20px_-5px_rgba(0,0,0,0.02)] border border-slate-100 space-y-4 flex flex-col">
          <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
            <div className="p-1.5 bg-slate-50 text-slate-500 rounded-lg">
              <ListTodo className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              {t('recentActivity')}
            </h3>
          </div>
          
          <div className="flex-1 min-h-[200px] max-h-[250px] overflow-y-auto pr-1">
            {activities.length > 0 ? (
              <div className="relative pl-5.5 space-y-5.5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                {activities.map(act => (
                  <div key={act.id} className="relative group">
                    {/* Glowing Node Circle */}
                    <span className="absolute -left-[20px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white bg-blue-500 shadow-sm group-hover:scale-125 transition-transform duration-300"></span>
                    <div className="space-y-0.5">
                      <p className="text-xs sm:text-sm text-slate-800 font-semibold leading-snug">{act.text}</p>
                      <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block">
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(act.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-8 text-center">
                <ListTodo className="h-8 w-8 text-slate-300 mb-2 stroke-1" />
                <p className="text-xs text-slate-400 font-medium">{t('noActivity')}</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
