import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Upload, Trash2, Globe, Users, EyeOff } from 'lucide-react';
import { useThemeStyles } from '../components/Layout';
import { usePhotos, useUser, trendingTags } from '../store';

export const Upload: React.FC = () => {
  const navigate = useNavigate();
  const { addPhoto } = usePhotos();
  const { currentUser } = useUser();
  const styles = useThemeStyles();

  const [uploadDrag, setUploadDrag] = useState(false);
  const [uploadPreview, setUploadPreview] = useState('');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadTags, setUploadTags] = useState('');
  const [uploadPrivacy, setUploadPrivacy] = useState<'public' | 'followers' | 'private'>('public');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setUploadDrag(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setUploadPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setUploadPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (!uploadPreview || !uploadTitle) return;
    const newPhoto = {
      url: uploadPreview,
      title: uploadTitle,
      author: currentUser.name,
      avatar: currentUser.avatar,
      tags: uploadTags.split(',').map((t) => t.trim()).filter(Boolean),
    };
    addPhoto(newPhoto);
    navigate('/');
  };

  return (
    <div className={`min-h-screen ${styles.bg} flex flex-col`}>
      <header
        className={`${styles.cardBg} border-b ${styles.borderColor} px-4 py-3 flex items-center gap-3 sticky top-0 z-10`}
      >
        <button onClick={() => navigate('/')} className={`p-2 -mx-2 rounded-full ${styles.hoverBg}`}>
          <ChevronLeft className={`w-6 h-6 ${styles.textPrimary}`} />
        </button>
        <h1 className={`font-bold text-xl ${styles.textPrimary}`}>Create Post</h1>
      </header>

      <div className="flex-1 p-6 overflow-auto">
        <div className={`max-w-2xl mx-auto ${styles.cardBg} rounded-3xl overflow-hidden shadow-xl`}>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setUploadDrag(true);
            }}
            onDragLeave={() => setUploadDrag(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative aspect-square border-2 border-dashed ${
              uploadDrag
                ? 'border-teal-500 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30'
                : styles.borderColor
            } flex items-center justify-center cursor-pointer transition-all duration-300 ${uploadPreview ? 'p-0' : 'p-8'}`}
          >
            {uploadPreview ? (
              <div className="relative group w-full h-full">
                <img src={uploadPreview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadPreview('');
                    }}
                    className="p-3 bg-white/90 rounded-full shadow-lg transform hover:scale-110 transition-all"
                  >
                    <Trash2 className="w-6 h-6 text-gray-700" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center px-4">
                <div className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:bg-gray-800 flex items-center justify-center shadow-inner`}>
                  <Upload className={`w-12 h-12 ${styles.textSecondary}`} />
                </div>
                <p className={`text-xl font-semibold ${styles.textPrimary} mb-2`}>
                  Drag and drop your image here
                </p>
                <p className={`text-base ${styles.textSecondary}`}>or click to browse your files</p>
                <p className={`text-sm ${styles.textSecondary} mt-2`}>Supports: JPG, PNG, GIF (Max 10MB)</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          <div className="p-8 space-y-6">
            <div>
              <label className={`block text-sm font-semibold ${styles.textPrimary} mb-3`}>Title</label>
              <input
                type="text"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="Give your photo a title..."
                className={`w-full px-5 py-4 rounded-2xl ${styles.inputBg} border ${styles.textPrimary} text-base outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all`}
              />
            </div>

            <div>
              <label className={`block text-sm font-semibold ${styles.textPrimary} mb-3`}>
                Tags <span className={`font-normal ${styles.textSecondary}`}>(separate with commas)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={uploadTags}
                  onChange={(e) => setUploadTags(e.target.value)}
                  placeholder="nature, travel, sunset..."
                  className={`w-full px-5 py-4 rounded-2xl ${styles.inputBg} border ${styles.textPrimary} text-base outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent pb-12 transition-all`}
                />
                <div className="absolute bottom-4 left-5 right-5">
                  <p className={`text-xs ${styles.textSecondary}`}>
                    Popular:{' '}
                    {trendingTags.slice(0, 5).map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setUploadTags((prev) => (prev ? prev + ', ' + tag : tag))}
                        className="ml-2 px-2 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded hover:bg-teal-200 dark:hover:bg-teal-900/50 transition-colors"
                      >
                        #{tag}
                      </button>
                    ))}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className={`block text-sm font-semibold ${styles.textPrimary} mb-3`}>Privacy Settings</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { value: 'public', icon: Globe, label: 'Public', desc: 'Visible to all' },
                  { value: 'followers', icon: Users, label: 'Followers', desc: 'Only followers' },
                  { value: 'private', icon: EyeOff, label: 'Private', desc: 'Only you' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setUploadPrivacy(option.value as any)}
                    className={`px-5 py-4 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-2 ${
                      uploadPrivacy === option.value
                        ? 'border-teal-500 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/40 dark:to-cyan-950/40 shadow-md'
                        : `${styles.borderColor} ${styles.hoverBg}`
                    }`}
                  >
                    <option.icon
                      className={`w-7 h-7 ${
                        uploadPrivacy === option.value ? 'text-teal-500' : styles.textSecondary
                      }`}
                    />
                    <span
                      className={`font-semibold ${
                        uploadPrivacy === option.value ? 'text-teal-600 dark:text-teal-400' : styles.textPrimary
                      }`}
                    >
                      {option.label}
                    </span>
                    <span className={`text-xs ${styles.textSecondary}`}>{option.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleUpload}
              disabled={!uploadPreview || !uploadTitle.trim()}
              className="w-full py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold text-lg rounded-2xl hover:from-teal-600 hover:to-cyan-600 transition-all shadow-xl shadow-teal-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Upload className="w-5 h-5 inline mr-2" />
              Share Your Photo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
