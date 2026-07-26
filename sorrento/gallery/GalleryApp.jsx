import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud,
  X,
  Trash2,
  Search,
  ArrowUpDown,
  User,
  Check,
  ExternalLink,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  RefreshCw,
  LogOut,
  Camera,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { compressImage, formatBytes } from './imageUtils';

// Mock photos from Unsplash for Demo Mode
const MOCK_PHOTOS = [
  {
    id: 'mock-1',
    name: 'sorrento-sunset.jpg',
    uploader: 'Marvin',
    uploadedAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
    size: 450000,
    isMock: true
  },
  {
    id: 'mock-2',
    name: 'mountain-climb.jpg',
    uploader: 'Sophia',
    uploadedAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80',
    size: 620000,
    isMock: true
  },
  {
    id: 'mock-3',
    name: 'misty-forest.jpg',
    uploader: 'Liam',
    uploadedAt: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 days ago
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&auto=format&fit=crop&q=80',
    size: 512000,
    isMock: true
  },
  {
    id: 'mock-4',
    name: 'desert-escape.jpg',
    uploader: 'Emma',
    uploadedAt: new Date(Date.now() - 3600000 * 120).toISOString(), // 5 days ago
    url: 'https://images.unsplash.com/photo-1509316975850-ff9c5edd0cd9?w=1200&auto=format&fit=crop&q=80',
    size: 380000,
    isMock: true
  }
];

export default function GalleryApp() {
  // Load configuration and identity
  const [appsScriptUrl, setAppsScriptUrl] = useState(() => {
    return import.meta.env.VITE_APPS_SCRIPT_URL || localStorage.getItem('sorrento_api_url') || '';
  });
  
  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem('sorrento_gallery_user') || '';
  });

  // State Management
  const [usernameInput, setUsernameInput] = useState('');
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest'); // newest, oldest
  
  // Upload States (Queue-based Multi-upload)
  const [uploadQueue, setUploadQueue] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  
  // UI Panels
  const [activeLightbox, setActiveLightbox] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(!currentUser);
  const [showSetupGuide, setShowSetupGuide] = useState(false);

  const fileInputRef = useRef(null);
  const touchStartX = useRef(null);

  // Initialize and fetch photos
  useEffect(() => {
    fetchPhotos();
  }, [appsScriptUrl]);

  // Handle setting/changing Apps Script URL
  const saveAppsScriptUrl = (url) => {
    const trimmed = url.trim();
    setAppsScriptUrl(trimmed);
    localStorage.setItem('sorrento_api_url', trimmed);
    setShowSettings(false);
  };

  // Determine if we are running in demo/mock mode
  const isDemoMode = !appsScriptUrl;

  // Fetch photos from Google Drive or Local Storage / Mocks
  const fetchPhotos = async () => {
    setLoading(true);
    setError(null);
    
    if (!appsScriptUrl) {
      // Demo mode: Load mock photos + any photos uploaded in local storage
      const localPhotos = JSON.parse(localStorage.getItem('sorrento_local_photos') || '[]');
      setPhotos([...localPhotos, ...MOCK_PHOTOS]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(appsScriptUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
      const data = await response.json();
      if (data.success) {
        // Map Google Drive API responses
        const drivePhotos = data.files
          .filter(file => file.mimeType && file.mimeType.toLowerCase().startsWith('image/'))
          .map(file => ({
            id: file.id,
            name: file.name,
            uploader: file.uploader,
            uploadedAt: file.uploadedAt,
            size: file.size,
            // Google Drive image proxy URLs
            url: `https://lh3.googleusercontent.com/d/${file.id}`,
            downloadUrl: `https://drive.google.com/uc?export=download&id=${file.id}`,
            isMock: false
          }));
        setPhotos(drivePhotos);
      } else {
        throw new Error(data.error || 'Unknown error occurred while fetching photos.');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Could not connect to Google Drive. Falling back to Demo Mode.');
      // Load mocks as fallback on connection error
      const localPhotos = JSON.parse(localStorage.getItem('sorrento_local_photos') || '[]');
      setPhotos([...localPhotos, ...MOCK_PHOTOS]);
    } finally {
      setLoading(false);
    }
  };

  // Handle Nickname Onboarding
  const handleOnboardingSubmit = (e) => {
    e.preventDefault();
    const name = usernameInput.trim();
    if (name) {
      setCurrentUser(name);
      localStorage.setItem('sorrento_gallery_user', name);
      setShowOnboarding(false);
    }
  };

  // Handle Name Reset
  const handleLogout = () => {
    setCurrentUser('');
    localStorage.removeItem('sorrento_gallery_user');
    setShowOnboarding(true);
  };

  // Handle File Drag/Drop or Select (Multiple Files)
  const handleFileChange = async (filesList) => {
    if (!filesList || filesList.length === 0) return;
    
    const newItems = [];
    const files = Array.from(filesList);
    const maxFiles = 15;
    
    // Limit to max 15 files at once
    const filesToProcess = files.slice(0, maxFiles);
    if (files.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} photos at once. Processing the first ${maxFiles}.`);
    }

    for (const file of filesToProcess) {
      if (!file.type.startsWith('image/')) {
        continue;
      }

      const queueId = 'q-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now();
      const previewUrl = URL.createObjectURL(file);
      
      const item = {
        id: queueId,
        file: file,
        name: file.name,
        size: file.size,
        compressedSize: 0,
        previewUrl: previewUrl,
        compressedBase64: null,
        status: 'compressing',
        error: null
      };
      
      newItems.push(item);
      compressQueueItem(queueId, file);
    }

    setUploadQueue(prev => [...prev, ...newItems]);
  };

  // Compress individual item in background
  const compressQueueItem = async (queueId, file) => {
    try {
      const compressed = await compressImage(file, 1600, 1600, 0.82);
      setUploadQueue(prev => prev.map(item => {
        if (item.id === queueId) {
          return {
            ...item,
            status: 'ready',
            compressedBase64: compressed.base64,
            compressedSize: compressed.compressedSize
          };
        }
        return item;
      }));
    } catch (err) {
      console.error(err);
      setUploadQueue(prev => prev.map(item => {
        if (item.id === queueId) {
          return {
            ...item,
            status: 'error',
            error: 'Failed to compress'
          };
        }
        return item;
      }));
    }
  };

  // Upload Queue Sequentially
  const handleUploadQueue = async () => {
    if (!currentUser || isUploading) return;
    
    const itemsToUpload = uploadQueue.filter(item => item.status === 'ready');
    if (itemsToUpload.length === 0) return;

    setIsUploading(true);

    for (const item of itemsToUpload) {
      // Update item status to 'uploading'
      setUploadQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'uploading' } : q));

      if (isDemoMode) {
        // Simulate upload delay for Demo mode
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const newPhoto = {
          id: 'local-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
          name: item.name.replace(/\.[^/.]+$/, '') + '.jpg',
          uploader: currentUser,
          uploadedAt: new Date().toISOString(),
          url: item.compressedBase64,
          size: item.compressedSize,
          isMock: false
        };

        const localPhotos = JSON.parse(localStorage.getItem('sorrento_local_photos') || '[]');
        localStorage.setItem('sorrento_local_photos', JSON.stringify([newPhoto, ...localPhotos]));

        setPhotos(prev => [newPhoto, ...prev]);
        setUploadQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'success' } : q));
      } else {
        // Actual upload to Google Drive via Apps Script
        try {
          const payload = {
            action: 'upload',
            name: item.name.replace(/\.[^/.]+$/, '') + '.jpg',
            fileData: item.compressedBase64,
            uploader: currentUser
          };

          const response = await fetch(appsScriptUrl, {
            method: 'POST',
            body: JSON.stringify(payload)
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }

          const result = await response.json();
          if (result.success) {
            setUploadQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'success' } : q));
          } else {
            throw new Error(result.error || 'Upload failed');
          }
        } catch (err) {
          console.error(err);
          setUploadQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'error', error: err.message } : q));
        }
      }
    }

    if (!isDemoMode) {
      await fetchPhotos();
    }
    setIsUploading(false);
  };

  // Remove individual file from upload queue
  const removeQueueItem = (itemId) => {
    const item = uploadQueue.find(q => q.id === itemId);
    if (item && item.previewUrl) {
      URL.revokeObjectURL(item.previewUrl);
    }
    setUploadQueue(prev => prev.filter(q => q.id !== itemId));
  };

  // Clear completed items (success/error)
  const clearCompletedQueue = () => {
    uploadQueue.forEach(item => {
      if ((item.status === 'success' || item.status === 'error') && item.previewUrl) {
        URL.revokeObjectURL(item.previewUrl);
      }
    });
    setUploadQueue(prev => prev.filter(item => item.status !== 'success' && item.status !== 'error'));
  };

  // Clear entire queue
  const clearAllQueue = () => {
    uploadQueue.forEach(item => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    });
    setUploadQueue([]);
    setIsUploading(false);
  };

  // Handle Photo Deletion
  const handleDeletePhoto = async (photo, e) => {
    e.stopPropagation(); // Avoid opening lightbox
    
    // Safety check
    if (photo.uploader.toLowerCase() !== currentUser.toLowerCase()) {
      alert(`Unauthorized: This photo belongs to ${photo.uploader}.`);
      return;
    }

    if (!confirm('Are you sure you want to delete this photo from the gallery?')) {
      return;
    }

    if (isDemoMode) {
      if (photo.isMock) {
        alert("Mock photos cannot be deleted in demo mode.");
        return;
      }
      
      // Delete from local storage
      const localPhotos = JSON.parse(localStorage.getItem('sorrento_local_photos') || '[]');
      const updatedLocal = localPhotos.filter(p => p.id !== photo.id);
      localStorage.setItem('sorrento_local_photos', JSON.stringify(updatedLocal));
      
      setPhotos(photos.filter(p => p.id !== photo.id));
      return;
    }

    try {
      const payload = {
        action: 'delete',
        fileId: photo.id,
        uploader: currentUser
      };

      const response = await fetch(appsScriptUrl, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Deletion server responded with code ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // Success
        setPhotos(photos.filter(p => p.id !== photo.id));
        if (activeLightbox && activeLightbox.id === photo.id) {
          setActiveLightbox(null);
        }
      } else {
        throw new Error(result.error || 'Server rejected the delete command.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete photo: ' + err.message);
    }
  };

  // Generate deterministic color avatar based on name
  const getAvatarStyle = (name) => {
    const colors = [
      'from-cyan-500 to-blue-500',
      'from-purple-500 to-indigo-500',
      'from-pink-500 to-rose-500',
      'from-emerald-500 to-teal-500',
      'from-amber-500 to-orange-500',
      'from-violet-500 to-fuchsia-500',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % colors.length);
    return colors[index];
  };

  // Formatted date string
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Process Photos List
  const filteredPhotos = photos
    .filter(photo => {
      const search = searchQuery.toLowerCase().trim();
      if (!search) return true;
      return (
        photo.uploader.toLowerCase().includes(search) ||
        photo.name.toLowerCase().includes(search)
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.uploadedAt);
      const dateB = new Date(b.uploadedAt);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

  // Handle Lightbox Navigation (defined after filteredPhotos to avoid ReferenceError TDZ)
  const getLightboxIndex = () => {
    if (!activeLightbox) return -1;
    return filteredPhotos.findIndex(p => p.id === activeLightbox.id);
  };

  const handlePrevPhoto = () => {
    const idx = getLightboxIndex();
    if (idx > 0) {
      setActiveLightbox(filteredPhotos[idx - 1]);
    }
  };

  const handleNextPhoto = () => {
    const idx = getLightboxIndex();
    if (idx !== -1 && idx < filteredPhotos.length - 1) {
      setActiveLightbox(filteredPhotos[idx + 1]);
    }
  };

  // Keyboard navigation listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!activeLightbox) return;
      if (e.key === 'ArrowLeft') {
        handlePrevPhoto();
      } else if (e.key === 'ArrowRight') {
        handleNextPhoto();
      } else if (e.key === 'Escape') {
        setActiveLightbox(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightbox, filteredPhotos]);

  return (
    <div className="gallery-root relative min-h-screen overflow-x-hidden bg-slate-950 text-slate-100 selection:bg-cyan-500/20 selection:text-white">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.12),transparent_40%),radial-gradient(circle_at_20%_35%,rgba(99,102,241,0.08),transparent_35%)]" />


      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4 md:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-300">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Sorrento Gallery
                {isDemoMode && (
                  <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-medium text-amber-400">
                    Demo Mode
                  </span>
                )}
              </h1>
              <p className="text-[11px] text-slate-400">Google Drive Shared Folder</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentUser && (
              <div className="hidden items-center gap-2 rounded-2xl border border-white/5 bg-white/5 px-3 py-1.5 md:flex">
                <div className={`h-6 w-6 rounded-full bg-gradient-to-tr ${getAvatarStyle(currentUser)} flex items-center justify-center text-[10px] font-semibold text-white`}>
                  {currentUser.substring(0, 2).toUpperCase()}
                </div>
                <span className="text-xs font-medium text-slate-300">Hi, {currentUser}</span>
                <button
                  onClick={handleLogout}
                  title="Switch User"
                  className="ml-1 text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="relative z-10 mx-auto max-w-[1600px] px-6 py-8 md:px-10">
        
        <div className="grid gap-8 lg:grid-cols-[350px_1fr]">
          
          {/* LEFT: Upload Box & User Profile */}
          <div className="space-y-6">
            <div className="glass rounded-[2rem] p-6">
              <h2 className="text-md font-bold text-white mb-4 flex items-center gap-2">
                <UploadCloud className="h-5 w-5 text-cyan-300" />
                Upload New Photo
              </h2>

              {/* Drag/Drop Box / Multi-file Selector */}
              {uploadQueue.length === 0 ? (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      handleFileChange(e.dataTransfer.files);
                    }
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] py-12 px-6 text-center cursor-pointer hover:border-cyan-400/50 hover:bg-cyan-500/[0.02] transition-all duration-300"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => handleFileChange(e.target.files)}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                  <div className="mb-4 rounded-full bg-slate-900 border border-white/5 p-4 text-slate-400 group-hover:text-cyan-300 group-hover:border-cyan-400/20 group-hover:scale-110 transition duration-300">
                    <UploadCloud className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-200">Drag & drop photos here</p>
                  <p className="mt-1 text-xs text-slate-400">or click to browse files</p>
                  <p className="mt-3 text-[10px] text-slate-500">Supports PNG, JPG, WebP. Uploads multiple. Compresses automatically.</p>
                </div>
              ) : (
                /* Multi-upload Queue List */
                <div className="space-y-4">
                  <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {uploadQueue.map((item) => (
                      <div key={item.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-slate-900/40 p-2 gap-3">
                        <div className="flex items-center gap-2 overflow-hidden flex-1">
                          <img src={item.previewUrl} alt="Thumbnail" className="h-10 w-10 rounded-lg object-cover border border-white/5 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-semibold text-slate-200 truncate">{item.name}</p>
                            <p className="text-[9px] text-slate-400">
                              {item.size ? formatBytes(item.size) : ''}
                              {item.compressedSize ? ` → ${formatBytes(item.compressedSize)}` : ''}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          {item.status === 'compressing' && (
                            <span className="text-[10px] text-cyan-400 flex items-center gap-1">
                              <RefreshCw className="h-3 w-3 animate-spin" /> Compressing...
                            </span>
                          )}
                          {item.status === 'ready' && (
                            <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                              <Check className="h-3 w-3 text-emerald-500" /> Ready
                            </span>
                          )}
                          {item.status === 'uploading' && (
                            <span className="text-[10px] text-cyan-400 flex items-center gap-1">
                              <RefreshCw className="h-3 w-3 animate-spin" /> Saving...
                            </span>
                          )}
                          {item.status === 'success' && (
                            <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                              <Check className="h-3 w-3" /> Done
                            </span>
                          )}
                          {item.status === 'error' && (
                            <span className="text-[10px] text-rose-400 font-semibold" title={item.error}>
                              Error
                            </span>
                          )}

                          <button
                            onClick={() => removeQueueItem(item.id)}
                            disabled={isUploading || item.status === 'uploading'}
                            className="rounded-lg p-1 text-slate-400 hover:text-rose-400 hover:bg-white/5 transition disabled:opacity-30"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Bar */}
                  <div className="rounded-xl border border-white/5 bg-white/5 p-3 flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      {uploadQueue.filter(item => item.status === 'success').length} of {uploadQueue.length} done
                    </span>
                    
                    {uploadQueue.some(item => item.status === 'success' || item.status === 'error') && !isUploading && (
                      <button
                        onClick={clearCompletedQueue}
                        className="text-[10px] font-semibold text-cyan-400 hover:text-cyan-300 transition"
                      >
                        Clear Completed
                      </button>
                    )}
                  </div>

                  {/* Control Buttons */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={handleUploadQueue}
                      disabled={isUploading || !currentUser || uploadQueue.filter(i => i.status === 'ready').length === 0}
                      className="w-full rounded-xl bg-cyan-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 disabled:opacity-50 disabled:hover:bg-cyan-500 transition"
                    >
                      {!currentUser ? 'Set Name First' : isUploading ? 'Uploading...' : `Upload ${uploadQueue.filter(i => i.status === 'ready').length} Photos`}
                    </button>
                    <button
                      onClick={clearAllQueue}
                      disabled={isUploading}
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/10 disabled:opacity-50 transition"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Current Identity Panel */}
            {currentUser && (
              <div className="glass rounded-[2rem] p-6 relative overflow-hidden">
                <div className="absolute right-4 top-4 text-cyan-500/10">
                  <User className="h-24 w-24" />
                </div>
                <div className="relative z-10 flex items-center gap-4">
                  <div className={`h-14 w-14 rounded-2xl bg-gradient-to-tr ${getAvatarStyle(currentUser)} flex items-center justify-center text-lg font-bold text-white shadow-lg shadow-black/30`}>
                    {currentUser.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Uploader</h3>
                    <p className="text-lg font-bold text-white leading-tight">{currentUser}</p>
                    <button
                      onClick={handleLogout}
                      className="mt-1 text-xs text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1 transition"
                    >
                      <LogOut className="h-3 w-3" /> Change Nickname
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Photos Grid */}
          <div className="space-y-6">
            
            {/* Filters bar */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search uploader or filename..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/50 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-400 backdrop-blur focus:border-cyan-400 focus:outline-none transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Sort and Refresh */}
              <div className="flex items-center gap-3 justify-end">
                <button
                  onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
                  className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-xs font-medium text-slate-300 hover:bg-white/5 transition"
                >
                  <ArrowUpDown className="h-3.5 w-3.5" />
                  <span>Sorted by: {sortOrder === 'newest' ? 'Newest' : 'Oldest'}</span>
                </button>
                
                <button
                  onClick={fetchPhotos}
                  disabled={loading}
                  className="rounded-2xl border border-white/10 bg-slate-900/50 p-3 text-slate-300 hover:bg-white/5 disabled:opacity-50 transition"
                  title="Refresh Photos"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-300">
                {error}
              </div>
            )}

            {/* Photos Loader */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-3">
                <RefreshCw className="h-8 w-8 animate-spin text-cyan-400" />
                <span className="text-sm">Fetching gallery photos...</span>
              </div>
            ) : filteredPhotos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center rounded-[2rem] border border-white/5 bg-white/[0.01]">
                <div className="rounded-full bg-slate-900 border border-white/5 p-4 text-slate-400 mb-4">
                  <Camera className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-slate-200">No photos found</h3>
                <p className="mt-1 text-sm text-slate-400 max-w-xs">
                  {searchQuery ? "No uploads matching your search." : "Be the first to upload a photo to the folder!"}
                </p>
              </div>
            ) : (
              /* Photo Grid */
              <div className="grid gap-3 grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-9">
                <AnimatePresence mode="popLayout">
                  {filteredPhotos.map((photo) => {
                    const isOwner = currentUser && photo.uploader.toLowerCase() === currentUser.toLowerCase();
                    return (
                      <motion.div
                        key={photo.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.25 }}
                        onClick={() => setActiveLightbox(photo)}
                        className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/5 bg-slate-900/40 aspect-square shadow-md transition-all duration-300 hover:border-white/15 hover:shadow-lg hover:shadow-cyan-950/10"
                      >
                        {/* Photo render */}
                        <img
                          src={photo.url}
                          alt={photo.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            // If direct render fails, fallback to thumbnail endpoint
                            if (!photo.isMock && e.target.src !== `https://drive.google.com/thumbnail?sz=w1000&id=${photo.id}`) {
                              e.target.src = `https://drive.google.com/thumbnail?sz=w1000&id=${photo.id}`;
                            }
                          }}
                        />

                        {/* Top action overlay */}
                        {isOwner && (
                          <div className="absolute right-2 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                              onClick={(e) => handleDeletePhoto(photo, e)}
                              className="rounded-xl bg-slate-950/70 border border-rose-500/20 p-2 text-rose-400 backdrop-blur hover:bg-rose-500 hover:text-white transition duration-200"
                              title="Delete Photo"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}

                        {/* Bottom Info Overlay */}
                        <div className="card-overlay absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/60 to-transparent p-4 flex flex-col justify-end pt-14">
                          <p className="text-xs font-semibold !text-white truncate mb-1 drop-shadow">
                            {photo.name}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <div className={`h-4.5 w-4.5 rounded-full bg-gradient-to-tr ${getAvatarStyle(photo.uploader)} flex items-center justify-center text-[8px] font-bold !text-white`}>
                                {photo.uploader.substring(0, 2).toUpperCase()}
                              </div>
                              <span className="text-[10px] font-semibold !text-white/90 drop-shadow">
                                {photo.uploader}
                              </span>
                            </div>
                            <span className="text-[9px] !text-white/70 drop-shadow">
                              {formatDate(photo.uploadedAt)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* MODAL 1: Onboarding Nickname Modal */}
      <AnimatePresence>
        {showOnboarding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="glass max-w-md w-full rounded-[2.5rem] p-8 border border-cyan-500/10 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 text-cyan-400/5">
                <Sparkles className="h-36 w-36" />
              </div>

              <div className="text-center relative z-10">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 mb-6">
                  <Camera className="h-6 w-6" />
                </div>
                
                <h2 className="text-2xl font-extrabold text-white tracking-tight">Sorrento Gallery</h2>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                  Welcome to the photo stream! Please set a nickname so friends know who uploaded each photo.
                </p>

                <form onSubmit={handleOnboardingSubmit} className="mt-8 space-y-4 text-left">
                  <div>
                    <label htmlFor="nickname" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Your Nickname
                    </label>
                    <input
                      type="text"
                      id="nickname"
                      required
                      placeholder="e.g. Alice, Bob, Marvin"
                      maxLength={18}
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/60 py-3.5 px-4 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none transition"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-2xl bg-cyan-500 py-3.5 text-sm font-bold text-slate-950 hover:bg-cyan-400 transition"
                  >
                    Enter Gallery
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Settings Drawer / API Config */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="w-full max-w-md bg-slate-900 border-l border-white/5 p-6 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-md font-bold text-white">Gallery Settings</h2>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="rounded-xl hover:bg-white/5 p-2 text-slate-400 hover:text-white transition"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <hr className="border-white/5" />

                {/* API Setup */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Google Drive Connection</h3>
                    <p className="mt-1 text-xs text-slate-400">
                      Configure your deployed Google Apps Script Web App URL to read and write to your Google Drive folder.
                    </p>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 font-semibold">Web App API URL</label>
                    <input
                      type="url"
                      placeholder="https://script.google.com/macros/s/.../exec"
                      defaultValue={appsScriptUrl}
                      id="api-url-input"
                      className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 py-3 px-4 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none transition"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowSetupGuide(true)}
                      className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      <HelpCircle className="h-3.5 w-3.5" /> Setup guide
                    </button>
                  </div>
                </div>

                <hr className="border-white/5" />

                {/* Local user profile */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Uploader Settings</h3>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-slate-300">
                      Active User: <span className="font-bold text-white">{currentUser || 'Not Set'}</span>
                    </div>
                    <button
                      onClick={() => {
                        setShowSettings(false);
                        setShowOnboarding(true);
                      }}
                      className="text-xs font-semibold text-cyan-400 hover:text-cyan-300"
                    >
                      Change
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setShowSettings(false)}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-xs font-semibold text-slate-300 hover:bg-white/10 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const input = document.getElementById('api-url-input');
                    saveAppsScriptUrl(input ? input.value : '');
                  }}
                  className="flex-1 rounded-xl bg-cyan-500 py-3 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: Photo Lightbox View */}
      <AnimatePresence>
        {activeLightbox && (
           <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-sm"
            onClick={() => setActiveLightbox(null)}
            onTouchStart={(e) => {
              touchStartX.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              if (touchStartX.current === null) return;
              const delta = e.changedTouches[0].clientX - touchStartX.current;
              touchStartX.current = null;
              if (Math.abs(delta) < 50) return; // too short, ignore
              if (delta < 0) handleNextPhoto(); // swipe left → next
              else handlePrevPhoto();            // swipe right → prev
            }}
          >
            <button
              onClick={() => setActiveLightbox(null)}
              className="absolute right-4 top-4 z-50 rounded-xl bg-slate-900 border border-white/10 p-3 text-slate-300 hover:text-white hover:bg-slate-800 transition"
              title="Close View"
            >
              <X className="h-5 w-5" />
            </button>


            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full max-h-[85vh] flex flex-col items-center justify-center"
            >
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900 aspect-auto shadow-2xl flex items-center justify-center w-full">
                <img
                  src={activeLightbox.url}
                  alt={activeLightbox.name}
                  className="max-h-[70vh] object-contain w-full"
                  onError={(e) => {
                    if (!activeLightbox.isMock && e.target.src !== `https://drive.google.com/thumbnail?sz=w1000&id=${activeLightbox.id}`) {
                      e.target.src = `https://drive.google.com/thumbnail?sz=w1000&id=${activeLightbox.id}`;
                    }
                  }}
                />

                {/* Previous Photo Button — centered on the photo */}
                {getLightboxIndex() > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevPhoto();
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-50 p-2 text-white/70 hover:text-white transition-all duration-200 drop-shadow-lg"
                    title="Previous Photo"
                  >
                    <ChevronLeft className="h-10 w-10" />
                  </button>
                )}

                {/* Next Photo Button — centered on the photo */}
                {getLightboxIndex() !== -1 && getLightboxIndex() < filteredPhotos.length - 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextPhoto();
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-50 p-2 text-white/70 hover:text-white transition-all duration-200 drop-shadow-lg"
                    title="Next Photo"
                  >
                    <ChevronRight className="h-10 w-10" />
                  </button>
                )}
              </div>

              {/* Lightbox Footer Actions & Meta */}
              <div className="w-full mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/50 border border-white/5 backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-full bg-gradient-to-tr ${getAvatarStyle(activeLightbox.uploader)} flex items-center justify-center text-xs font-bold text-white`}>
                    {activeLightbox.uploader.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white truncate max-w-[240px]">
                      {activeLightbox.name}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Uploaded by <span className="text-slate-300 font-semibold">{activeLightbox.uploader}</span> • {formatDate(activeLightbox.uploadedAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  {/* Delete (if owner) */}
                  {currentUser && activeLightbox.uploader.toLowerCase() === currentUser.toLowerCase() && (
                    <button
                      onClick={(e) => handleDeletePhoto(activeLightbox, e)}
                      className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-2.5 text-xs font-semibold text-rose-400 hover:bg-rose-500 hover:text-white transition"
                    >
                      <Trash2 className="h-4 w-4 inline mr-1.5" /> Delete
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 4: Setup Instructions Dialog */}
      <AnimatePresence>
        {showSetupGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[2rem] p-6 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-cyan-300" />
                  Google Apps Script Deployment Guide
                </h3>
                <button
                  onClick={() => setShowSetupGuide(false)}
                  className="rounded-xl hover:bg-white/5 p-2 text-slate-400 hover:text-white transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <hr className="border-white/5 mb-4" />

              <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
                <p>
                  To link this app to your private Google Drive folder, we deploy a lightweight, free script using <strong>Google Apps Script</strong>.
                </p>
                
                <ol className="list-decimal pl-5 space-y-3 mt-2 text-slate-300">
                  <li>
                    Go to your Google Drive folder: <a href="https://drive.google.com/drive/folders/1557b_d7KlCtqkW-7_wIW6jWlzjs9k5og" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline inline-flex items-center gap-0.5">1557b_d7KlCtqkW-7_wIW6j... <ExternalLink className="h-3 w-3" /></a>.
                  </li>
                  <li>
                    Make sure the sharing settings of this folder are set to <strong>"Anyone with the link can view"</strong> (Viewer is enough, as our script will run with Owner credentials to upload and delete).
                  </li>
                  <li>
                    In your browser, visit <a href="https://script.google.com" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">script.google.com</a> and click <strong>New Project</strong>.
                  </li>
                  <li>
                    Copy the script code found in the project at: <code className="bg-slate-950 px-1.5 py-0.5 rounded text-cyan-300 border border-white/5 text-[11px] font-mono">/scratch/google_apps_script.js</code> and paste it in the editor.
                  </li>
                  <li>
                    Click the <strong>Save</strong> button, then click <strong>Deploy</strong> (top right) &gt; <strong>New deployment</strong>.
                  </li>
                  <li>
                    Click the <strong>Gear icon</strong> next to "Select type" and select <strong>Web app</strong>. Configure:
                    <ul className="list-disc pl-5 mt-1 text-slate-400">
                      <li><strong>Description:</strong> Sorrento Photo Gallery</li>
                      <li><strong>Execute as:</strong> Me (your email address)</li>
                      <li><strong>Who has access:</strong> Anyone</li>
                    </ul>
                  </li>
                  <li>
                    Click <strong>Deploy</strong>. Grant necessary permissions (Google may warn you since it's a custom script, click "Advanced" and "Go to project (unsafe)" to approve it).
                  </li>
                  <li>
                    Copy the generated <strong>Web app URL</strong>.
                  </li>
                  <li>
                    Open Settings in this app (cog icon in top-right), paste the URL, and save!
                  </li>
                </ol>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowSetupGuide(false)}
                  className="rounded-xl bg-cyan-500 px-6 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
