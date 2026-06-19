import React, { useEffect, useState } from 'react';
import { dbService } from '../services/db';
import type { Student } from '../services/db';
import { useTranslation } from '../locales/translations';
import type { Language } from '../locales/translations';
import { Search, Plus, Edit2, Trash2, X, AlertCircle } from 'lucide-react';

interface StudentManagementProps {
  language: Language;
}

export const StudentManagement: React.FC<StudentManagementProps> = ({ language }) => {
  const { t } = useTranslation(language);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');

  // Form State
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    roll_number: '',
    student_name: '',
    father_name: '',
    date_of_birth: '',
    class: '9',
    section: 'A',
    phone: ''
  });
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    loadStudents();
  }, []);

  async function loadStudents() {
    try {
      setLoading(true);
      const list = await dbService.getStudents();
      setStudents(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAddModal = () => {
    setEditingStudent(null);
    setFormData({
      roll_number: '',
      student_name: '',
      father_name: '',
      date_of_birth: '',
      class: '9',
      section: 'A',
      phone: ''
    });
    setErrorMsg('');
    setSuccessMsg('');
    setShowModal(true);
  };

  const handleOpenEditModal = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      roll_number: student.roll_number,
      student_name: student.student_name,
      father_name: student.father_name,
      date_of_birth: student.date_of_birth,
      class: student.class,
      section: student.section,
      phone: student.phone
    });
    setErrorMsg('');
    setSuccessMsg('');
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t('confirmDelete'))) {
      try {
        await dbService.deleteStudent(id);
        setSuccessMsg(t('studentDeletedMsg'));
        loadStudents();
        setTimeout(() => setSuccessMsg(''), 3000);
      } catch (err: any) {
        setErrorMsg(err.message || 'Error deleting student');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    // Basic validation
    if (!formData.roll_number || !formData.student_name || !formData.father_name || !formData.date_of_birth) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    try {
      if (editingStudent) {
        await dbService.updateStudent(editingStudent.id, formData);
        setSuccessMsg(t('studentUpdatedMsg'));
      } else {
        await dbService.addStudent(formData);
        setSuccessMsg(t('studentAddedMsg'));
      }
      
      loadStudents();
      setTimeout(() => {
        setShowModal(false);
        setSuccessMsg('');
      }, 1500);

    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while saving.');
    }
  };

  // Filter and Search logic
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.roll_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.father_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesClass = selectedClass === 'all' || student.class === selectedClass;
    
    return matchesSearch && matchesClass;
  });

  const uniqueClasses = Array.from(new Set(students.map(s => s.class))).sort();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('studentManagement')}</h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
            {t('totalStudents')}: {students.length} Active Records
          </p>
        </div>
        
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4.5 py-2.5 bg-primary hover:bg-primary-dark active:scale-[0.98] text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/10 transition-custom cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5" />
          {t('addStudent')}
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-green-50 border border-green-100 text-green-700 rounded-2xl flex items-center gap-2.5 text-sm font-semibold animate-in slide-in-from-top-2 duration-300">
          <AlertCircle className="h-5 w-5 text-green-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Filter and Search Bar (SaaS Control Bar) */}
      <div className="bg-white p-4 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_20px_-5px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col md:flex-row gap-3.5 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search students by name, roll number, or father's name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10.5 pr-4 py-2.5 w-full border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-primary text-sm text-slate-800 font-medium transition bg-slate-50/50 focus:bg-white"
          />
        </div>
        
        <div className="flex gap-3">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-primary text-sm font-bold text-slate-700 bg-white cursor-pointer min-w-[140px]"
          >
            <option value="all">{t('allClasses')}</option>
            {uniqueClasses.map(cls => (
              <option key={cls} value={cls}>{t('class')} {cls}</option>
            ))}
            {!uniqueClasses.includes('9') && <option value="9">{t('class')} 9</option>}
            {!uniqueClasses.includes('10') && <option value="10">{t('class')} 10</option>}
          </select>
        </div>
      </div>

      {/* Stripe-style Student Directory Grid */}
      <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_20px_-5px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : filteredStudents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                  <th className="py-4.5 px-6">{t('rollNumber')}</th>
                  <th className="py-4.5 px-6">{t('studentName')}</th>
                  <th className="py-4.5 px-6">{t('fatherName')}</th>
                  <th className="py-4.5 px-6">{t('dob')}</th>
                  <th className="py-4.5 px-6">{t('class')}</th>
                  <th className="py-4.5 px-6">{t('section')}</th>
                  <th className="py-4.5 px-6">{t('phone')}</th>
                  <th className="py-4.5 px-6 text-center">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                {filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4.5 px-6 font-bold text-slate-900 tracking-tight">{student.roll_number}</td>
                    <td className="py-4.5 px-6 font-bold text-slate-900 group-hover:text-primary transition-colors">{student.student_name}</td>
                    <td className="py-4.5 px-6 font-medium text-slate-500">{student.father_name}</td>
                    <td className="py-4.5 px-6 font-semibold text-slate-500">
                      {new Date(student.date_of_birth).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-4.5 px-6">
                      <span className="px-2.5 py-1 bg-blue-50/60 text-primary rounded-lg text-xs font-bold border border-blue-100/20">
                        {t('class')} {student.class}
                      </span>
                    </td>
                    <td className="py-4.5 px-6">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-black text-xs">
                        {student.section}
                      </span>
                    </td>
                    <td className="py-4.5 px-6 font-semibold text-slate-500">{student.phone || '—'}</td>
                    <td className="py-4.5 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(student)}
                          className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-primary rounded-lg transition-custom cursor-pointer"
                          title={t('edit')}
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-650 rounded-lg transition-custom cursor-pointer"
                          title={t('delete')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 px-4">
            <p className="text-slate-400 text-sm font-semibold">{t('noStudents')}</p>
            <p className="text-xs text-slate-400 mt-1">Try clearing filters or add a new student to this class list.</p>
          </div>
        )}
      </div>

      {/* --- ADD / EDIT STUDENT MODAL (Apple SaaS Glassmorphism Form Sheet) --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-5 bg-white border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900 leading-none">
                  {editingStudent ? t('editStudent') : t('addStudent')}
                </h3>
                <span className="text-xs text-slate-400 font-medium mt-1.5 block">
                  {editingStudent ? 'Update student enrollment profiles' : 'Register a new student in the official registry'}
                </span>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-custom cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {errorMsg && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl flex items-center gap-2.5 text-xs font-semibold">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Roll Number */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    {t('rollNumber')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.roll_number}
                    onChange={(e) => setFormData({ ...formData, roll_number: e.target.value })}
                    className="w-full px-4.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-primary text-sm text-slate-800 font-semibold transition bg-slate-50/50 focus:bg-white"
                  />
                </div>

                {/* Student Name */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    {t('studentName')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.student_name}
                    onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                    className="w-full px-4.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-primary text-sm text-slate-800 font-semibold transition bg-slate-50/50 focus:bg-white"
                  />
                </div>

                {/* Father Name */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    {t('fatherName')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.father_name}
                    onChange={(e) => setFormData({ ...formData, father_name: e.target.value })}
                    className="w-full px-4.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-primary text-sm text-slate-800 font-semibold transition bg-slate-50/50 focus:bg-white"
                  />
                </div>

                {/* DOB */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    {t('dob')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                    className="w-full px-4.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-primary text-sm text-slate-800 font-semibold transition bg-slate-50/50 focus:bg-white"
                  />
                </div>

                {/* Class */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    {t('class')}
                  </label>
                  <select
                    value={formData.class}
                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                    className="w-full px-4.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-primary text-sm text-slate-800 font-bold bg-slate-50/50 focus:bg-white cursor-pointer"
                  >
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                  </select>
                </div>

                {/* Section */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    {t('section')}
                  </label>
                  <select
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full px-4.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-primary text-sm text-slate-800 font-bold bg-slate-50/50 focus:bg-white cursor-pointer"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </div>

                {/* Phone */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    {t('phone')}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +91 9876543210"
                    className="w-full px-4.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-primary text-sm text-slate-800 font-semibold transition bg-slate-50/50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 pt-5 border-t border-slate-100 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4.5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-bold transition cursor-pointer"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-bold shadow-md shadow-blue-500/10 transition cursor-pointer"
                >
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
