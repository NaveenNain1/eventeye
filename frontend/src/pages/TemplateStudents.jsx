import React, { useState, useEffect, useRef } from 'react';
import axiosClient from '../axios';
import { useParams } from 'react-router-dom';

function Modal({ open, onClose, children, title }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-lg relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl font-bold">×</button>
        {title && <h2 className="text-xl font-semibold mb-4 text-center">{title}</h2>}
        {children}
      </div>
    </div>
  );
}

const TemplateStudents = ({ setPageTitle, setShowBackArrow }) => {
  const { templateId } = useParams();
  const [template, setTemplate] = useState(null);

  // Main state
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [csvMessage, setCsvMessage] = useState('');
  const fileInputRef = useRef();

  // Modal state
  const [modals, setModals] = useState({
    create: false, edit: null, delete: null, import: false
  });

  // Student form state
  const [form, setForm] = useState({
    name: '', certificate_number: '', email: '', mobile: '', remarks: ''
  });

  useEffect(() => {
    setShowBackArrow(true);
    setPageTitle('Template Students');
    fetchTemplate();
    fetchStudents();
    // eslint-disable-next-line
  }, []);

  // Header template info
  const fetchTemplate = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axiosClient.get(`/user/template/${templateId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTemplate(res.data.data || {});
    } catch {}
  };

  // Get students
  const fetchStudents = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axiosClient.get('/user/students', {
        params: { user_template_id: templateId },
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(res.data || []);
    } catch {
      setError('Failed to fetch students.');
    } finally {
      setLoading(false);
    }
  };

  // Show/hide modals
  const openModal = (key, data) => setModals(prev => ({ ...prev, [key]: data || true }));
  const closeModal = (key) => setModals(prev => ({ ...prev, [key]: null }));

  // Handle form input
  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Create student
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError('Name is required.');
    try {
      setError('');
      const token = localStorage.getItem('token');
      await axiosClient.post('/user/students', { ...form, user_template_id: templateId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchStudents();
      setForm({ name: '', certificate_number: '', email: '', mobile: '', remarks: '' });
      closeModal('create');
    } catch {
      setError('Failed to add student.');
    }
  };

  // Edit student
  const handleEdit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError('Name is required.');
    try {
      setError('');
      const token = localStorage.getItem('token');
      await axiosClient.put(`/user/students/${modals.edit.id}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchStudents();
      setForm({ name: '', certificate_number: '', email: '', mobile: '', remarks: '' });
      closeModal('edit');
    } catch {
      setError('Failed to update student.');
    }
  };

  // Delete student
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axiosClient.delete(`/user/students/${modals.delete.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchStudents();
      closeModal('delete');
    } catch {
      setError('Failed to delete student.');
    }
  };

  // CSV Import
  const handleImportCsv = async (e) => {
    setCsvMessage('');
    const file = e.target.files[0];
    if (!file) return;
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_template_id', templateId);
      const res = await axiosClient.post('/user/students/import/csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      setCsvMessage(res.data.message || 'Imported!');
      fetchStudents();
      closeModal('import');
    } catch {
      setCsvMessage('CSV import failed.');
    }
    fileInputRef.current.value = null;
  };

  // Prepare edit form on open
  useEffect(() => {
    if (modals.edit && typeof modals.edit === 'object') {
      setForm({
        name: modals.edit.name || '',
        certificate_number: modals.edit.certificate_number || '',
        email: modals.edit.email || '',
        mobile: modals.edit.mobile || '',
        remarks: modals.edit.remarks || '',
      });
    }
  }, [modals.edit]);

  // Main UI
  return (
    <div className="min-h-full py-8 flex flex-col items-center bg-gradient-to-b from-white to-orange-50">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b pb-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-4">
              Template
              <span className="bg-gradient-to-r from-purple-500 to-orange-500 text-white rounded px-3 py-1 text-base font-semibold ml-1">
                #{templateId}
              </span>
              {template && (
                <span className="ml-3 text-lg text-pink-600 font-semibold">{template.name}</span>
              )}
            </h1>
            <p className="text-gray-500 mt-2">Manage all students for this template.</p>
          </div>
          <div className="flex gap-3">
            <button
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-2 rounded-lg shadow-lg text-lg font-semibold hover:scale-105 transition"
              onClick={() => openModal('create')}
            >
              + Add Student
            </button>
            <button
              className="bg-gradient-to-r from-orange-500 to-purple-500 text-white px-5 py-2 rounded-lg shadow-lg text-lg font-semibold hover:scale-105 transition"
              onClick={() => openModal('import')}
            >
              Import CSV
            </button>
          </div>
        </div>

        {/* Main Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-12">
              <svg className="animate-spin h-7 w-7 text-purple-500" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-100 rounded-xl shadow border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600">Cert #</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600">Mobile</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600">Remarks</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {!students.length && (
                  <tr>
                    <td colSpan={6} className="text-center py-5 text-gray-400">No students found.</td>
                  </tr>
                )}
                {students.map(stu => (
                  <tr key={stu.id} className="hover:bg-pink-50 transition">
                    <td className="px-4 py-2">{stu.name}</td>
                    <td className="px-4 py-2">{stu.certificate_number || '-'}</td>
                    <td className="px-4 py-2">{stu.email || '-'}</td>
                    <td className="px-4 py-2">{stu.mobile || '-'}</td>
                    <td className="px-4 py-2">{stu.remarks || '-'}</td>
                    <td className="px-4 py-2 text-center">
                      <button className="text-purple-500 mr-3 hover:underline" onClick={() => openModal('edit', stu)}>Edit</button>
                      <button className="text-red-500 hover:underline" onClick={() => openModal('delete', stu)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>

      {/* --- Modals --- */}

      <Modal open={modals.create} onClose={() => closeModal('create')} title="Add New Student">
        <form onSubmit={handleCreate} className="space-y-4">
          <input type="text" name="name" value={form.name} onChange={handleInput} required
            placeholder="Student name" className="w-full px-4 py-2 border rounded focus:ring focus:ring-purple-500"/>
          <input type="text" name="certificate_number" value={form.certificate_number} onChange={handleInput}
            placeholder="Certificate number" className="w-full px-4 py-2 border rounded"/>
          <input type="email" name="email" value={form.email} onChange={handleInput}
            placeholder="Email" className="w-full px-4 py-2 border rounded"/>
          <input type="text" name="mobile" value={form.mobile} onChange={handleInput}
            placeholder="Mobile" className="w-full px-4 py-2 border rounded"/>
          <input type="text" name="remarks" value={form.remarks} onChange={handleInput}
            placeholder="Remarks" className="w-full px-4 py-2 border rounded"/>
          {error && <div className="text-red-600 text-sm">{error}</div>}

          <button className="w-full bg-gradient-to-r from-purple-500 to-orange-500 text-white font-semibold py-2 rounded hover:scale-105">Add</button>
        </form>
      </Modal>

      <Modal open={!!modals.edit} onClose={() => closeModal('edit')} title="Edit Student">
        <form onSubmit={handleEdit} className="space-y-4">
          <input type="text" name="name" value={form.name} onChange={handleInput} required
            placeholder="Student name" className="w-full px-4 py-2 border rounded focus:ring focus:ring-purple-500"/>
          <input type="text" name="certificate_number" value={form.certificate_number} onChange={handleInput}
            placeholder="Certificate number" className="w-full px-4 py-2 border rounded"/>
          <input type="email" name="email" value={form.email} onChange={handleInput}
            placeholder="Email" className="w-full px-4 py-2 border rounded"/>
          <input type="text" name="mobile" value={form.mobile} onChange={handleInput}
            placeholder="Mobile" className="w-full px-4 py-2 border rounded"/>
          <input type="text" name="remarks" value={form.remarks} onChange={handleInput}
            placeholder="Remarks" className="w-full px-4 py-2 border rounded"/>
          {error && <div className="text-red-600 text-sm">{error}</div>}

          <button className="w-full bg-gradient-to-r from-purple-500 to-orange-500 text-white font-semibold py-2 rounded hover:scale-105">Update</button>
        </form>
      </Modal>

      <Modal open={!!modals.delete} onClose={() => closeModal('delete')} title="Delete Student">
        <div className="text-gray-700 mb-6">Are you sure to delete <span className="font-bold text-red-600">{modals.delete?.name}</span>? The action cannot be undone.</div>
        {error && <div className="text-red-600 text-sm mb-3">{error}</div>}
        <div className="flex gap-3">
          <button onClick={handleDelete} className="bg-red-500 hover:bg-red-700 text-white px-5 py-2 rounded font-bold flex-1">Delete</button>
          <button onClick={() => closeModal('delete')} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2 rounded font-bold flex-1">Cancel</button>
        </div>
      </Modal>

      <Modal open={modals.import} onClose={() => closeModal('import')} title="Import Students CSV">
        <div>
          <p className="mb-4 text-xs text-gray-500">CSV columns: Name, Certificate Number, Email, Mobile, Remarks.</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            className="block w-full mb-5"
            onChange={handleImportCsv}
          />
          {csvMessage && <div className="text-green-600 text-sm mt-2">{csvMessage}</div>}
          <button className="w-full bg-gradient-to-r from-orange-500 to-purple-500 text-white font-semibold py-2 rounded hover:scale-105 mt-3" onClick={() => closeModal('import')}>
            Close
          </button>
        </div>
      </Modal>

    </div>
  );
};

export default TemplateStudents;
