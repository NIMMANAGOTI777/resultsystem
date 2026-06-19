import React, { useEffect, useState } from 'react';
import { dbService } from '../services/db';
import type { Student, Subject, Mark } from '../services/db';
import { useTranslation } from '../locales/translations';
import type { Language } from '../locales/translations';
import { calculateSubjectTotal, calculateSubjectPercentage, getGrade, MAX_MARKS } from '../utils/calculations';
import { Save, CheckCircle, AlertCircle } from 'lucide-react';

interface MarksManagementProps {
  language: Language;
}

export const MarksManagement: React.FC<MarksManagementProps> = ({ language }) => {
  const { t } = useTranslation(language);
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [selectedClass, setSelectedClass] = useState('9');
  const [selectedSubject, setSelectedSubject] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Grid state for marks inputs
  // Key: studentId, Value: SubjectMarks
  const [gridData, setGridData] = useState<{
    [studentId: string]: {
      fa1: string;
      fa2: string;
      fa3: string;
      fa4: string;
      sa1: string;
      sa2: string;
    }
  }>({});

  useEffect(() => {
    async function loadInitial() {
      try {
        setLoading(true);
        const subList = await dbService.getSubjects();
        setSubjects(subList);
        if (subList.length > 0) {
          setSelectedSubject(subList[0].id);
        }

        const studList = await dbService.getStudents();
        setStudents(studList);
        
        const markList = await dbService.getAllMarks();
        setMarks(markList);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadInitial();
  }, []);

  // Update grid data when class, subject or marks load/change
  useEffect(() => {
    if (!selectedSubject) return;

    const classStudents = students.filter(s => s.class === selectedClass);
    const newGrid: typeof gridData = {};

    classStudents.forEach(student => {
      // Find existing mark
      const m = marks.find(mark => mark.student_id === student.id && mark.subject_id === selectedSubject);
      newGrid[student.id] = {
        fa1: m?.fa1 != null ? String(m.fa1) : '',
        fa2: m?.fa2 != null ? String(m.fa2) : '',
        fa3: m?.fa3 != null ? String(m.fa3) : '',
        fa4: m?.fa4 != null ? String(m.fa4) : '',
        sa1: m?.sa1 != null ? String(m.sa1) : '',
        sa2: m?.sa2 != null ? String(m.sa2) : '',
      };
    });

    setGridData(newGrid);
    setSuccessMsg('');
    setErrorMsg('');
  }, [selectedClass, selectedSubject, marks, students]);

  const handleInputChange = (studentId: string, field: 'fa1' | 'fa2' | 'fa3' | 'fa4' | 'sa1' | 'sa2', val: string) => {
    // Only allow numbers
    if (val !== '' && !/^\d+$/.test(val)) return;

    const numVal = val === '' ? NaN : Number(val);
    const maxVal = field.startsWith('fa') ? MAX_MARKS.fa1 : MAX_MARKS.sa1;

    if (!isNaN(numVal) && (numVal < 0 || numVal > maxVal)) {
      setErrorMsg(`Marks must be between 0 and ${maxVal}`);
      return;
    } else {
      setErrorMsg('');
    }

    setGridData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: val
      }
    }));
  };

  const handleSave = async () => {
    if (!selectedSubject) return;
    
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const classStudents = students.filter(s => s.class === selectedClass);
      
      for (const student of classStudents) {
        const data = gridData[student.id];
        if (!data) continue;

        const parsedMarks = {
          fa1: data.fa1 === '' ? null : Number(data.fa1),
          fa2: data.fa2 === '' ? null : Number(data.fa2),
          fa3: data.fa3 === '' ? null : Number(data.fa3),
          fa4: data.fa4 === '' ? null : Number(data.fa4),
          sa1: data.sa1 === '' ? null : Number(data.sa1),
          sa2: data.sa2 === '' ? null : Number(data.sa2),
        };

        // Save
        await dbService.saveMarks(student.id, selectedSubject, parsedMarks);
      }

      // Reload marks
      const updatedMarks = await dbService.getAllMarks();
      setMarks(updatedMarks);
      setSuccessMsg(t('marksSavedMsg'));
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save marks');
    } finally {
      setSaving(false);
    }
  };

  const classStudents = students.filter(s => s.class === selectedClass);
  const uniqueClasses = Array.from(new Set(students.map(s => s.class))).sort();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('marksManagement')}</h1>
          <p className="text-sm text-slate-400 font-medium">Record, edit and view academic marks and performance matrices.</p>
        </div>
      </div>

      {/* Selectors / Toolbar (SaaS Filter Panel) */}
      <div className="bg-white p-5 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_20px_-5px_rgba(0,0,0,0.02)] border border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 items-end">
        {/* Class Filter */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-extrabold text-slate-450 uppercase tracking-widest leading-none">
            {t('selectClass')}
          </label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full px-4.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-primary text-sm font-bold text-slate-700 bg-white cursor-pointer"
          >
            {uniqueClasses.map(cls => (
              <option key={cls} value={cls}>{t('class')} {cls}</option>
            ))}
            {!uniqueClasses.includes('9') && <option value="9">{t('class')} 9</option>}
            {!uniqueClasses.includes('10') && <option value="10">{t('class')} 10</option>}
          </select>
        </div>

        {/* Subject Filter */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-extrabold text-slate-450 uppercase tracking-widest leading-none">
            {t('selectSubject')}
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full px-4.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-primary text-sm font-bold text-slate-700 bg-white cursor-pointer"
          >
            {subjects.map(sub => (
              <option key={sub.id} value={sub.id}>{sub.subject_name}</option>
            ))}
          </select>
        </div>

        {/* Save Button */}
        <div>
          <button
            onClick={handleSave}
            disabled={saving || classStudents.length === 0}
            className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-dark active:scale-[0.98] disabled:bg-slate-205 text-white font-bold rounded-xl text-sm shadow-md shadow-blue-500/10 transition cursor-pointer"
          >
            <Save className="h-4.5 w-4.5" />
            {saving ? t('saving') : t('saveMarks')}
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-green-50 border border-green-100 text-green-700 rounded-2xl flex items-center gap-2.5 text-sm font-semibold animate-in slide-in-from-top-2 duration-300">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl flex items-center gap-2.5 text-sm font-semibold animate-in slide-in-from-top-2 duration-300">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Marks Editing Grid */}
      <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_20px_-5px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : classStudents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                  <th className="py-4 px-6 min-w-[200px]">{t('studentName')} (Roll)</th>
                  <th className="py-4 px-2 text-center w-[100px]">{t('fa1')} (50)</th>
                  <th className="py-4 px-2 text-center w-[100px]">{t('fa2')} (50)</th>
                  <th className="py-4 px-2 text-center w-[100px]">{t('fa3')} (50)</th>
                  <th className="py-4 px-2 text-center w-[100px]">{t('fa4')} (50)</th>
                  <th className="py-4 px-2 text-center w-[100px]">{t('sa1')} (100)</th>
                  <th className="py-4 px-2 text-center w-[100px]">{t('sa2')} (100)</th>
                  <th className="py-4 px-4 text-center w-[100px]">{t('total')}</th>
                  <th className="py-4 px-4 text-center w-[100px]">{t('percentage')}</th>
                  <th className="py-4 px-4 text-center w-[100px]">{t('grade')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                {classStudents.map(student => {
                  const studentGrid = gridData[student.id] || { fa1: '', fa2: '', fa3: '', fa4: '', sa1: '', sa2: '' };
                  
                  // Calculate local stats on the fly
                  const localMarksObj = {
                    fa1: studentGrid.fa1 === '' ? null : Number(studentGrid.fa1),
                    fa2: studentGrid.fa2 === '' ? null : Number(studentGrid.fa2),
                    fa3: studentGrid.fa3 === '' ? null : Number(studentGrid.fa3),
                    fa4: studentGrid.fa4 === '' ? null : Number(studentGrid.fa4),
                    sa1: studentGrid.sa1 === '' ? null : Number(studentGrid.sa1),
                    sa2: studentGrid.sa2 === '' ? null : Number(studentGrid.sa2)
                  };

                  const total = calculateSubjectTotal(localMarksObj);
                  const percentage = calculateSubjectPercentage(localMarksObj);
                  const grade = getGrade(percentage);

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/30 transition-colors group">
                      <td className="py-3 px-6">
                        <div className="font-bold text-slate-900 leading-none group-hover:text-primary transition-colors">{student.student_name}</div>
                        <div className="text-[10px] text-slate-400 font-extrabold uppercase mt-1 tracking-wider">Roll: {student.roll_number}</div>
                      </td>
                      {/* FA1 */}
                      <td className="py-2 px-2 text-center">
                        <input
                          type="text"
                          maxLength={2}
                          value={studentGrid.fa1}
                          onChange={(e) => handleInputChange(student.id, 'fa1', e.target.value)}
                          placeholder="—"
                          className="w-16 px-2 py-2 text-center border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-primary text-sm font-semibold transition bg-slate-50/50 focus:bg-white"
                        />
                      </td>
                      {/* FA2 */}
                      <td className="py-2 px-2 text-center">
                        <input
                          type="text"
                          maxLength={2}
                          value={studentGrid.fa2}
                          onChange={(e) => handleInputChange(student.id, 'fa2', e.target.value)}
                          placeholder="—"
                          className="w-16 px-2 py-2 text-center border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-primary text-sm font-semibold transition bg-slate-50/50 focus:bg-white"
                        />
                      </td>
                      {/* FA3 */}
                      <td className="py-2 px-2 text-center">
                        <input
                          type="text"
                          maxLength={2}
                          value={studentGrid.fa3}
                          onChange={(e) => handleInputChange(student.id, 'fa3', e.target.value)}
                          placeholder="—"
                          className="w-16 px-2 py-2 text-center border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-primary text-sm font-semibold transition bg-slate-50/50 focus:bg-white"
                        />
                      </td>
                      {/* FA4 */}
                      <td className="py-2 px-2 text-center">
                        <input
                          type="text"
                          maxLength={2}
                          value={studentGrid.fa4}
                          onChange={(e) => handleInputChange(student.id, 'fa4', e.target.value)}
                          placeholder="—"
                          className="w-16 px-2 py-2 text-center border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-primary text-sm font-semibold transition bg-slate-50/50 focus:bg-white"
                        />
                      </td>
                      {/* SA1 */}
                      <td className="py-2 px-2 text-center">
                        <input
                          type="text"
                          maxLength={3}
                          value={studentGrid.sa1}
                          onChange={(e) => handleInputChange(student.id, 'sa1', e.target.value)}
                          placeholder="—"
                          className="w-16 px-2 py-2 text-center border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-primary text-sm font-semibold transition bg-slate-50/50 focus:bg-white"
                        />
                      </td>
                      {/* SA2 */}
                      <td className="py-2 px-2 text-center">
                        <input
                          type="text"
                          maxLength={3}
                          value={studentGrid.sa2}
                          onChange={(e) => handleInputChange(student.id, 'sa2', e.target.value)}
                          placeholder="—"
                          className="w-16 px-2 py-2 text-center border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-primary text-sm font-semibold transition bg-slate-50/50 focus:bg-white"
                        />
                      </td>
                      {/* Calculated Total */}
                      <td className="py-3 px-4 text-center font-bold text-slate-900 bg-slate-50/20">{total}</td>
                      {/* Calculated Percentage */}
                      <td className="py-3 px-4 text-center font-bold text-slate-800">{percentage}%</td>
                      {/* Calculated Grade */}
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${
                          grade === 'A+' || grade === 'A' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                          grade === 'B' || grade === 'C' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                          grade === 'D' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' : 'bg-red-50 text-red-700 border-red-100'
                        }`}>
                          {grade}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 px-4">
            <p className="text-slate-400 text-sm font-semibold">No students found in Class {selectedClass}.</p>
            <p className="text-xs text-slate-450 mt-1">Please add students to this class in the Student Management view first.</p>
          </div>
        )}
      </div>
    </div>
  );
};
