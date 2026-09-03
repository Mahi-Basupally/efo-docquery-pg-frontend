'use client';

import { useState, useEffect } from 'react';
import { apiClient, Document } from '@/lib/api';
import toast from 'react-hot-toast';
//import DocumentList from '@/components/DocumentList';
//import DocumentForm from '@/components/DocumentForm';
import SearchBar from '@/components/SearchBar';
import HealthStatus from '@/components/HealthStatus';
import { FileText, Plus } from 'lucide-react';

export default function Home() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchDocuments();
  }, [currentPage, searchQuery]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      if (searchQuery) {
        const data = await apiClient.searchDocuments(searchQuery, 50);
        setDocuments(data.documents);
        setTotal(data.total);
      } else {
        const offset = (currentPage - 1) * pageSize;
        const data = await apiClient.getDocuments(pageSize, offset);
        setDocuments(data.documents);
        setTotal(data.total);
      }
    } catch (error) {
      toast.error(apiClient.handleError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (title: string, content: string) => {
    try {
      await apiClient.createDocument({ title, content });
      toast.success('Document created successfully!');
      setShowForm(false);
      setCurrentPage(1);
      fetchDocuments();
    } catch (error) {
      toast.error(apiClient.handleError(error));
    }
  };

  const handleUpdate = async (id: number, title: string, content: string) => {
    try {
      await apiClient.updateDocument(id, { title, content });
      toast.success('Document updated successfully!');
      setEditingDocument(null);
      fetchDocuments();
    } catch (error) {
      toast.error(apiClient.handleError(error));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await apiClient.deleteDocument(id);
      toast.success('Document deleted successfully!');
      fetchDocuments();
    } catch (error) {
      toast.error(apiClient.handleError(error));
    }
  };

  const handleEdit = (document: Document) => {
    setEditingDocument(document);
    setShowForm(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-600 p-2 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">EFO DocQuery</h1>
                <p className="text-sm text-gray-500">FEC filing querying system</p>
              </div>
            </div>
            <HealthStatus />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Create */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchBar onSearch={handleSearch} loading={loading} />
            </div>
            <button
              onClick={() => {
                setEditingDocument(null);
                setShowForm(true);
              }}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Document
            </button>
          </div>

          {searchQuery && (
            <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
              <p className="text-sm text-blue-800">
                Searching for: <span className="font-semibold">{searchQuery}</span>
                {' '}({total} results)
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear search
              </button>
            </div>
          )}
        </div>

        {/* Document Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <DocumentForm
                document={editingDocument}
                onSubmit={editingDocument ? 
                  (title, content) => handleUpdate(editingDocument.id, title, content) : 
                  handleCreate
                }
                onCancel={() => {
                  setShowForm(false);
                  setEditingDocument(null);
                }}
              />
            </div>
          </div>
        )}

        {/* Document List */}
       {/* <DocumentList
          documents={documents}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />*/}

        {/* Pagination */}
        {!searchQuery && totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center space-x-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <span className="px-4 py-2 text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            EFO DocQuery - filing querying system
          </p>
        </div>
      </footer>
    </div>
  );
}
