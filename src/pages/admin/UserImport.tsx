import { useState } from 'react';
import { 
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Users,
  FileText,
  ArrowRight
} from 'lucide-react';
import { AdminSidebar } from '../../components/AdminSidebar';

interface ImportRecord {
  row: number;
  name: string;
  email: string;
  department: string;
  role: string;
  status: 'valid' | 'error';
  error?: string;
}

interface UserImportProps {}

export function UserImport({}: UserImportProps) {
  const [importStep, setImportStep] = useState<'upload' | 'review' | 'import' | 'complete'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [records, setRecords] = useState<ImportRecord[]>([
    { row: 1, name: 'John Doe', email: 'john@example.com', department: 'Engineering', role: 'learner', status: 'valid' },
    { row: 2, name: 'Jane Smith', email: 'jane@example.com', department: 'Sales', role: 'learner', status: 'valid' },
    { row: 3, name: 'Mike Johnson', email: 'invalid-email', department: 'Marketing', role: 'learner', status: 'error', error: 'Invalid email format' },
    { row: 4, name: 'Sarah Wilson', email: 'sarah@example.com', department: 'HR', role: 'instructor', status: 'valid' }
  ]);

  const [importStats, setImportStats] = useState({
    total: 0,
    valid: 0,
    errors: 0,
    imported: 0
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImportStep('review');
      // In real implementation, parse CSV/Excel here
      setImportStats({
        total: records.length,
        valid: records.filter(r => r.status === 'valid').length,
        errors: records.filter(r => r.status === 'error').length,
        imported: 0
      });
    }
  };

  const handleImport = () => {
    setImportStep('import');
    // Simulate import process
    setTimeout(() => {
      setImportStats(prev => ({
        ...prev,
        imported: prev.valid
      }));
      setImportStep('complete');
    }, 2000);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bulk User Import</h1>
              <p className="text-sm text-gray-500 mt-1">Import multiple users from CSV or Excel file</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors">
                <Download size={16} />
                Download Template
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {/* Step Indicator */}
            <div className="flex items-center justify-center mb-8">
              {['upload', 'review', 'import', 'complete'].map((step, index) => {
                const stepNames = ['Upload', 'Review', 'Import', 'Complete'];
                const isActive = importStep === step;
                const isCompleted = ['upload', 'review', 'import', 'complete'].indexOf(importStep) > index;
                
                return (
                  <div key={step} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isActive
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {isCompleted ? <CheckCircle2 size={20} /> : index + 1}
                      </div>
                      <span className={`mt-2 text-sm font-medium ${
                        isActive ? 'text-purple-600' : 'text-gray-600'
                      }`}>
                        {stepNames[index]}
                      </span>
                    </div>
                    {index < 3 && (
                      <div className={`w-24 h-1 mx-2 transition-colors ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Upload Step */}
            {importStep === 'upload' && (
              <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200">
                <div className="text-center">
                  <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Upload size={40} className="text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload User File</h2>
                  <p className="text-gray-600 mb-6">Upload a CSV or Excel file with user information</p>
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-green-700 transition-all shadow-md hover:shadow-lg cursor-pointer"
                  >
                    <FileSpreadsheet size={20} />
                    Choose File
                  </label>
                  <p className="text-sm text-gray-500 mt-4">Supported formats: CSV, XLSX, XLS</p>
                </div>
              </div>
            )}

            {/* Review Step */}
            {importStep === 'review' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Review Import Data</h2>
                    {file && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FileText size={16} />
                        <span>{file.name}</span>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Total Records</div>
                      <div className="text-2xl font-bold text-gray-900">{importStats.total}</div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Valid</div>
                      <div className="text-2xl font-bold text-green-700">{importStats.valid}</div>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Errors</div>
                      <div className="text-2xl font-bold text-red-700">{importStats.errors}</div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Ready to Import</div>
                      <div className="text-2xl font-bold text-blue-700">{importStats.valid}</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Row</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {records.map((record) => (
                            <tr key={record.row} className={record.status === 'error' ? 'bg-red-50' : ''}>
                              <td className="px-4 py-3 text-sm text-gray-900">{record.row}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{record.name}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{record.email}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{record.department}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{record.role}</td>
                              <td className="px-4 py-3">
                                {record.status === 'valid' ? (
                                  <div className="flex items-center gap-1 text-green-600">
                                    <CheckCircle2 size={16} />
                                    <span className="text-sm">Valid</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1 text-red-600">
                                    <XCircle size={16} />
                                    <span className="text-sm">{record.error}</span>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-3 mt-6">
                    <button
                      onClick={() => setImportStep('upload')}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleImport}
                      disabled={importStats.valid === 0}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-green-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      Import {importStats.valid} Users
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Import Step */}
            {importStep === 'import' && (
              <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
                <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-spin">
                  <Users size={40} className="text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Importing Users...</h2>
                <p className="text-gray-600">Please wait while we import your users</p>
              </div>
            )}

            {/* Complete Step */}
            {importStep === 'complete' && (
              <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Import Complete!</h2>
                <p className="text-gray-600 mb-6">
                  Successfully imported {importStats.imported} users
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setImportStep('upload');
                      setFile(null);
                      setRecords([]);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
                  >
                    Import More Users
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

