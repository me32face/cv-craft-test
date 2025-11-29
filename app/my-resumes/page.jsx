'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FileText, Edit, Trash2, Home, Calendar } from 'lucide-react';
import Toast from '@/components/Toast';

export default function MyResumes() {
  const router = useRouter();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, resumeId: null, resumeName: '' });

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const templateImages = {
    template01: "/template/template01n.png",
    template30: "/template/template30.png",
    template32: "/template/template32.png",
    template33: "/template/template33.png",
    template34: "/template/template34.jpg",
    template35: "/template/template35.jpg",
    template36: "/template/template36.png",
    template37: "/template/template37.jpg",
    template38: "/template/template38.png",
    template39: "/template/LEONARDOX NERO-1.png",
    template40: "/template/template40.jpg",
    template41: "/template/ARTHAVION BLAZE.png",
    template42: "/template/TITANUS ZORIN.png",
    template43: "/template/VORTEXION ZAYNIX.png",
    template44: "/template/ASTROLON.png",
    template45: "/template/RAVENOR.png",
    template46: "/template/AUGUSTUS AXEL.png",
    template47: "/template/template47.png",
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${API_URL}/api/resumes/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (result.success) {
        setResumes(result.resumes);
      } else {
        setToast(result.message || 'Failed to fetch resumes');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setToast('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (resumeId, templateId) => {
    router.push(`/templates/${templateId}?resumeId=${resumeId}`);
  };

  const openDeleteModal = (resumeId, resumeName) => {
    setDeleteModal({ open: true, resumeId, resumeName });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ open: false, resumeId: null, resumeName: '' });
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/resumes/${deleteModal.resumeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (result.success) {
        setToast('Resume deleted successfully');
        fetchResumes();
      } else {
        setToast(result.message || 'Failed to delete resume');
      }
    } catch (error) {
      console.error('Delete error:', error);
      setToast('Failed to delete resume');
    } finally {
      closeDeleteModal();
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your resumes...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Image
                src="/cvlogo.png"
                alt="CV Craft"
                width={140}
                height={60}
                className="mr-3"
              />
            </div>
            
            {/* Back to Home Button */}
            <button
              onClick={() => router.push('/')}
              className="border border-purple-400 text-purple-600 pl-3 lg:pl-4 pr-1.5 lg:pr-2 py-1 lg:py-1.5 rounded-full hover:bg-purple-50 transition flex items-center justify-center gap-2 lg:gap-3"
            >
              <span className="text-sm lg:text-base">Back to Home</span>
              <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center rounded-full">
                <span className="text-white text-sm lg:text-base">→</span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-5xl font-bold mb-5 text-center text-gray-500">
              My Resumes
            </h1>
            <p className="text-center mb-7 text-gray-500 text-lg">
              Manage and edit your saved resumes
            </p>
          </div>

          {/* Resumes Grid */}
          {resumes.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
              <FileText size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No resumes yet</h3>
              <p className="text-gray-500 mb-6">Create your first resume to get started</p>
              <button
                onClick={() => router.push('/#template')}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition"
              >
                Browse Templates
              </button>
            </div>
          ) : (
            <div className="flex gap-6 flex-wrap justify-center">
              {resumes.map((resume) => (
                <div
                  key={resume._id}
                  className="group relative bg-gradient-to-b from-[#f6f9fc] to-[#e8edf5] rounded-2xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden block flex-shrink-0 w-80 hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100"
                >
                  <div className="p-4">
                    {templateImages[resume.templateId] ? (
                      <Image
                        src={templateImages[resume.templateId]}
                        alt={resume.resumeName}
                        width={288}
                        height={200}
                        unoptimized
                        className="w-full h-58 object-contain rounded-lg shadow-lg"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-58">
                        <FileText size={64} className="text-gray-300" />
                      </div>
                    )}
                  </div>
                  
                  <div className="absolute bottom-0 left-0 w-full p-6 pt-3 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-md bg-white/30 rounded-b-2xl">
                    {/* <h3 className="text-gray-700 group-hover:text-gray-600 transition-colors">
                      {resume.resumeName.split(" ")[0]}
                    </h3> */}
                    <h3 className="font-bold text-xl text-gray-700 group-hover:text-gray-600 transition-colors truncate">
                      {resume.resumeName}
                    </h3>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <Calendar size={14} className="mr-1" />
                      <span>Modified: {formatDate(resume.lastModified)}</span>
                    </div>

                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(resume._id, resume.templateId)}
                        className="text-sm text-gray-700 border border-gray-500 px-4 py-2 rounded-full flex-1 text-center backdrop-blur-lg bg-white/40 hover:bg-white/60 transition flex items-center justify-center gap-1"
                      >
                        <Edit size={14} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => openDeleteModal(resume._id, resume.resumeName)}
                        className="text-sm text-red-600 border border-red-400 px-3 py-2 rounded-full backdrop-blur-lg bg-white/40 hover:bg-red-50/60 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete Resume
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete "{deleteModal.resumeName}"? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={closeDeleteModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
                  