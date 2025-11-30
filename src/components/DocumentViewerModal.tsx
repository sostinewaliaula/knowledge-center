import { useState, useEffect } from 'react';
import { X, Download, ExternalLink, FileText, Image as ImageIcon, File, Loader2, ZoomIn, ZoomOut, RotateCw, Sheet, Presentation } from 'lucide-react';
import { detectFileType, getFileExtension, canViewInline, getOfficeViewerUrl, getGoogleDocsViewerUrl, FileTypeInfo } from '../utils/fileTypes';

// Text file viewer component
function TextFileViewer({ url, zoom, onLoad, onError }: { url: string; zoom: number; onLoad: () => void; onError: (error: string) => void }) {
  const [textContent, setTextContent] = useState<string>('');

  useEffect(() => {
    const fetchText = async () => {
      try {
        if (!url) {
          throw new Error('No URL provided');
        }
        
        const response = await fetch(url, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'text/plain, text/html, text/*, */*'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to load text file: ${response.status} ${response.statusText}`);
        }
        
        const text = await response.text();
        setTextContent(text);
        onLoad();
      } catch (err: any) {
        console.error('Error fetching text file:', err);
        onError(err.message || 'Failed to load text file.');
      }
    };

    if (url) {
      fetchText();
    }
  }, [url, onLoad, onError]);

  return (
    <div className="w-full h-full bg-white p-6 overflow-auto">
      <pre 
        className="text-sm font-mono whitespace-pre-wrap break-words"
        style={{
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'top left',
          width: `${100 / (zoom / 100)}%`
        }}
      >
        {textContent || 'Loading...'}
      </pre>
    </div>
  );
}

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: {
    id: string;
    title: string;
    file_type?: string | null;
    source_type?: string | null;
    source_url?: string | null;
    embed_code?: string | null;
    file_name?: string | null;
  };
  documentUrl?: string; // For local files
}

export function DocumentViewerModal({ isOpen, onClose, content, documentUrl }: DocumentViewerModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [actualViewUrl, setActualViewUrl] = useState<string>('');

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setIsLoading(true);
      setError(null);
      setZoom(100);
      setRotation(0);
      setActualViewUrl('');
    } else {
      // Set the actual view URL when modal opens
      const url = documentUrl || content.source_url || '';
      if (url) {
        setActualViewUrl(url);
        setIsLoading(true);
      } else {
        setError('No URL available for this document');
        setIsLoading(false);
      }
    }
  }, [isOpen, documentUrl, content.source_url]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleDownload = async () => {
    try {
      // Use API download URL for both local and external content
      // This will proxy external downloads through our backend
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const token = localStorage.getItem('authToken');
      const downloadUrl = `${API_BASE_URL}/content/${content.id}/download?token=${token}`;
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = content.file_name || 'document';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download error:', error);
      // Fallback to opening in new tab
      if (content.source_url) {
        window.open(content.source_url, '_blank');
      } else if (documentUrl) {
        window.open(documentUrl, '_blank');
      }
    }
  };

  const handleOpenExternal = () => {
    if (content.source_url) {
      window.open(content.source_url, '_blank');
    } else if (documentUrl) {
      window.open(documentUrl, '_blank');
    }
  };

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Detect file type from filename and file_type
  const fileTypeInfo = detectFileType(content.file_name || content.title, null);
  const isPDF = fileTypeInfo.category === 'pdf';
  const isImage = fileTypeInfo.category === 'image';
  const isWord = fileTypeInfo.category === 'word';
  const isExcel = fileTypeInfo.category === 'excel';
  const isPowerpoint = fileTypeInfo.category === 'powerpoint';
  const isText = fileTypeInfo.category === 'text';
  const isExternal = content.source_type && content.source_type !== 'local';
  const canViewInlineContent = canViewInline(fileTypeInfo);
  
  // Get the actual URL to use for viewing
  const viewUrl = actualViewUrl || documentUrl || content.source_url || '';
  
  // Convert Google Docs edit URLs to preview URLs for better embedding
  const getExternalViewUrl = (url: string): string => {
    if (!url) return url;
    
    // Convert Google Docs edit URLs to preview
    url = url.replace(/\/edit(\?|$)/, '/preview$1');
    url = url.replace(/\/edit#/, '/preview#');
    
    // Convert Google Sheets edit URLs to preview
    url = url.replace(/\/spreadsheets\/d\/([^/]+)\/edit/, '/spreadsheets/d/$1/preview');
    
    // Convert Google Slides edit URLs to preview
    url = url.replace(/\/presentation\/d\/([^/]+)\/edit/, '/presentation/d/$1/preview');
    
    return url;
  };
  
  // For Office documents, get the appropriate viewer URL
  const getViewerUrl = () => {
    if (isExternal && (isWord || isExcel || isPowerpoint)) {
      // For external Office files, use embed_code if available, otherwise convert to preview URL
      if (content.embed_code) {
        // Extract src from embed_code if it's an iframe
        const srcMatch = content.embed_code.match(/src=["']([^"']+)["']/);
        if (srcMatch) {
          return srcMatch[1];
        }
        // If embed_code is just a URL, use it
        if (content.embed_code.startsWith('http')) {
          return content.embed_code;
        }
      }
      // Convert edit URLs to preview URLs for Google Docs/Sheets/Slides
      return getExternalViewUrl(viewUrl);
    }
    if (!isExternal && (isWord || isExcel || isPowerpoint)) {
      // For local Office files, create a public view URL that Office Online can access
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const token = localStorage.getItem('authToken');
      
      // Extract content ID from viewUrl or use content.id
      let contentId = content.id;
      if (viewUrl) {
        const match = viewUrl.match(/\/content\/([^/]+)\//);
        if (match) {
          contentId = match[1];
        }
      }
      
      // Create absolute URL for the public view endpoint
      // Office Online needs a fully qualified URL
      const baseUrl = API_BASE_URL.replace(/\/api$/, ''); // Remove /api if present
      const publicViewUrl = `${baseUrl}/api/content/${contentId}/view?token=${token}`;
      
      // Use Office Online viewer with the public view URL
      return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(publicViewUrl)}`;
    }
    return viewUrl;
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden my-auto flex flex-col"
        style={{ maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-green-600 p-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {isPDF && <FileText size={20} className="text-white flex-shrink-0" />}
            {isImage && <ImageIcon size={20} className="text-white flex-shrink-0" />}
            {isWord && <FileText size={20} className="text-white flex-shrink-0" />}
            {isExcel && <Sheet size={20} className="text-white flex-shrink-0" />}
            {isPowerpoint && <Presentation size={20} className="text-white flex-shrink-0" />}
            {isText && <FileText size={20} className="text-white flex-shrink-0" />}
            {!isPDF && !isImage && !isWord && !isExcel && !isPowerpoint && !isText && (
              <File size={20} className="text-white flex-shrink-0" />
            )}
            <h2 className="text-white text-lg font-semibold truncate">
              {content.title || content.file_name || 'Document Viewer'}
            </h2>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Zoom controls for images, PDFs, and text files */}
            {(isPDF || isImage || isText) && (
              <div className="flex items-center gap-1 bg-white/20 rounded-lg p-1">
                <button
                  onClick={handleZoomOut}
                  className="p-1.5 hover:bg-white/30 rounded transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut size={16} className="text-white" />
                </button>
                <span className="text-white text-xs px-2 min-w-[3rem] text-center">{zoom}%</span>
                <button
                  onClick={handleZoomIn}
                  className="p-1.5 hover:bg-white/30 rounded transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn size={16} className="text-white" />
                </button>
                {isImage && (
                  <button
                    onClick={handleRotate}
                    className="p-1.5 hover:bg-white/30 rounded transition-colors ml-1"
                    title="Rotate"
                  >
                    <RotateCw size={16} className="text-white" />
                  </button>
                )}
              </div>
            )}
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Download"
            >
              <Download size={20} className="text-white" />
            </button>
            {isExternal && (
              <button
                onClick={handleOpenExternal}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Open in new tab"
              >
                <ExternalLink size={20} className="text-white" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Close (ESC)"
            >
              <X size={20} className="text-white" />
            </button>
          </div>
        </div>

        {/* Document Container */}
        <div className="flex-1 overflow-hidden bg-gray-100 flex items-center justify-center min-h-0">
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 z-10">
              <Loader2 size={48} className="text-purple-600 animate-spin mb-4" />
              <p className="text-gray-700 text-lg font-medium">
                {isExternal 
                  ? 'Loading external document...' 
                  : isPDF 
                    ? 'Loading PDF document...' 
                    : isImage 
                      ? 'Loading image...' 
                      : isWord || isExcel || isPowerpoint
                        ? 'Loading Office document...'
                        : 'Loading document...'
                }
              </p>
              <p className="text-gray-500 text-sm mt-2">Please wait while we prepare your document</p>
            </div>
          )}

          {error ? (
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText size={32} className="text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load document</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-green-700 transition-all"
                >
                  <Download size={16} className="inline mr-2" />
                  Download Instead
                </button>
                {content.source_url && (
                  <button
                    onClick={handleOpenExternal}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
                  >
                    <ExternalLink size={16} className="inline mr-2" />
                    Open Externally
                  </button>
                )}
              </div>
            </div>
          ) : isPDF ? (
            <div 
              className="w-full h-full overflow-auto"
              style={{ 
                paddingTop: '4px'
              }}
            >
              {viewUrl ? (
                <iframe
                  src={`${viewUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                  className="w-full border-0"
                  style={{ 
                    height: 'calc(90vh - 120px)',
                    minHeight: '600px',
                    width: '100%',
                    display: 'block'
                  }}
                  onLoad={() => setIsLoading(false)}
                  onError={() => {
                    setIsLoading(false);
                    setError('Failed to load PDF. Please try downloading the file instead.');
                  }}
                  title={content.title || content.file_name || 'PDF Document'}
                />
              ) : (
                <div className="text-center p-8">
                  <p className="text-gray-600">PDF URL not available</p>
                </div>
              )}
            </div>
          ) : isImage ? (
            <div className="flex items-center justify-center w-full h-full">
              <img
                src={viewUrl}
                alt={content.title || content.file_name || 'Image'}
                className="max-w-full max-h-full object-contain"
                style={{
                  transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                  transition: 'transform 0.2s ease'
                }}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false);
                  setError('Failed to load image.');
                }}
              />
            </div>
          ) : isText ? (
            <TextFileViewer 
              url={viewUrl}
              zoom={zoom}
              onLoad={() => setIsLoading(false)}
              onError={(err) => {
                setIsLoading(false);
                setError(err);
              }}
            />
          ) : (isWord || isExcel || isPowerpoint) ? (
            <div className="w-full h-full">
              {(() => {
                const viewerUrl = getViewerUrl();
                const isLocalhost = viewerUrl.includes('localhost') || viewerUrl.includes('127.0.0.1');
                
                // Show warning for localhost (Office Online can't access localhost)
                if (isLocalhost && !isExternal) {
                  return (
                    <div className="text-center p-8">
                      <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <File size={32} className="text-yellow-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Preview Limited</h3>
                      <p className="text-gray-600 mb-4">
                        Office Online viewer requires files to be publicly accessible from the internet. 
                        Since your server is running on localhost, the preview may not work.
                      </p>
                      <div className="flex gap-3 justify-center">
                        <button
                          onClick={handleDownload}
                          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-green-700 transition-all"
                        >
                          <Download size={16} className="inline mr-2" />
                          Download to View
                        </button>
                        <button
                          onClick={() => {
                            setIsLoading(true);
                            // Try anyway - might work if using a tunnel service like ngrok
                            const iframe = document.querySelector('iframe');
                            if (iframe && iframe.src !== viewerUrl) {
                              iframe.src = viewerUrl;
                            }
                          }}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
                        >
                          Try Anyway
                        </button>
                      </div>
                    </div>
                  );
                }
                
                return (
                  <iframe
                    src={viewerUrl}
                    className="w-full border-0"
                    style={{ 
                      height: 'calc(90vh - 140px)',
                      minHeight: '600px'
                    }}
                    onLoad={() => setIsLoading(false)}
                    onError={() => {
                      setIsLoading(false);
                      setError('Unable to display this document. Office Online viewer requires the file to be publicly accessible. Please download the file to view it, or ensure your server is accessible from the internet.');
                    }}
                    title={content.title || content.file_name || 'Office Document'}
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                    allow="fullscreen"
                  />
                );
              })()}
            </div>
          ) : isExternal && content.source_url ? (
            <div className="w-full h-full">
              <iframe
                src={getExternalViewUrl(content.source_url)}
                className="w-full border-0"
                style={{ 
                  height: 'calc(90vh - 140px)',
                  minHeight: '600px'
                }}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false);
                  setError('Unable to display this document type. Please download or open externally.');
                }}
                title={content.title || content.file_name || 'Document'}
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                allow="fullscreen"
              />
            </div>
          ) : (
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <File size={32} className="text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Preview not available</h3>
              <p className="text-gray-600 mb-4">
                This document type cannot be previewed. Please download to view.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-green-700 transition-all"
                >
                  <Download size={16} className="inline mr-2" />
                  Download Document
                </button>
                {content.source_url && (
                  <button
                    onClick={handleOpenExternal}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
                  >
                    <ExternalLink size={16} className="inline mr-2" />
                    Open in New Tab
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

