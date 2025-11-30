import { useState, useEffect } from 'react';
import { X, Save, AlertCircle, Upload, Link as LinkIcon } from 'lucide-react';

interface EditContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: {
    id: string;
    title: string;
    description: string | null;
    source_type?: string | null;
    source_url?: string | null;
    file_name?: string | null;
  };
  onSave: (id: string, title: string, description: string, newFile?: File, newUrl?: string) => Promise<void>;
  updating?: boolean;
}

export function EditContentModal({
  isOpen,
  onClose,
  content,
  onSave,
  updating = false
}: EditContentModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [newFile, setNewFile] = useState<File | null>(null);
  const [newUrl, setNewUrl] = useState('');
  const [error, setError] = useState('');

  const isExternal = content.source_type && content.source_type !== 'local';
  const isLocal = !isExternal;

  useEffect(() => {
    if (isOpen && content) {
      setTitle(content.title || '');
      setDescription(content.description || '');
      setNewUrl(content.source_url || '');
      setNewFile(null);
      setError('');
    }
  }, [isOpen, content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (isExternal && !newUrl.trim()) {
      setError('URL is required for external content');
      return;
    }

    try {
      await onSave(content.id, title.trim(), description.trim() || '', newFile || undefined, newUrl.trim() || undefined);
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update content');
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setNewUrl('');
    setNewFile(null);
    setError('');
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewFile(file);
      // Auto-set title if empty or using default
      if (!title || title === content.title) {
        const filenameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
        setTitle(filenameWithoutExt);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900">Edit Content</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={updating}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Content title"
              required
              disabled={updating}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Content description"
              disabled={updating}
            />
          </div>

          {/* File Upload (for local content) */}
          {isLocal && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Replace File (Optional)
              </label>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={updating}
                  />
                  {content.file_name && !newFile && (
                    <p className="mt-1 text-xs text-gray-500">Current file: {content.file_name}</p>
                  )}
                  {newFile && (
                    <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
                      <Upload size={14} />
                      New file selected: {newFile.name} ({(newFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* URL (for external content) */}
          {isExternal && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Content URL"
                  required
                  disabled={updating}
                />
              </div>
              {content.source_type && (
                <p className="mt-1 text-xs text-gray-500">
                  Source type: <span className="font-medium">{content.source_type}</span>
                </p>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={updating}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updating || !title.trim()}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-green-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

