import React, { useRef } from 'react';
import { Upload, Trash2, Globe, Users, EyeOff } from 'lucide-react';

const trendingTags = ['nature', 'urban', 'portrait', 'abstract', 'travel', 'food', 'animals', 'blackandwhite'];

interface UploadFormProps {
  darkMode: boolean;
  uploadDrag: boolean;
  uploadPreview: string;
  uploadTitle: string;
  uploadTags: string;
  uploadPrivacy: 'public' | 'followers' | 'private';
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearPreview: () => void;
  onTitleChange: (value: string) => void;
  onTagsChange: (value: string) => void;
  onPrivacyChange: (value: 'public' | 'followers' | 'private') => void;
  onUpload: () => void;
  onTagClick: (tag: string) => void;
}

const UploadForm: React.FC<UploadFormProps> = ({
  darkMode,
  uploadDrag,
  uploadPreview,
  uploadTitle,
  uploadTags,
  uploadPrivacy,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
  onClearPreview,
  onTitleChange,
  onTagsChange,
  onPrivacyChange,
  onUpload,
  onTagClick
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bg = darkMode ? 'bg-gray-950' : 'bg-gray-50';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';
  const cardBg = darkMode ? 'bg-gray-900' : 'bg-white';
  const borderColor = darkMode ? 'border-gray-800' : 'border-gray-200';
  const inputBg = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300';

  const privacyOptions = [
    { value: 'public', icon: Globe, label: 'Public', desc: 'Visible to all' },
    { value: 'followers', icon: Users, label: 'Followers', desc: 'Only followers' },
    { value: 'private', icon: EyeOff, label: 'Private', desc: 'Only you' }
  ];

  return (
    <div className={`max-w-2xl mx-auto ${cardBg} rounded-3xl overflow-hidden shadow-xl`}>
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative aspect-square border-2 border-dashed ${
          uploadDrag ? 'border-teal-500 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30' : borderColor
        } flex items-center justify-center cursor-pointer transition-all duration-300 ${uploadPreview ? 'p-0' : 'p-8'}`}
      >
        {uploadPreview ? (
          <div className="relative group w-full h-full">
            <img src={uploadPreview} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <button
                onClick={(e) => { e.stopPropagation(); onClearPreview(); }}
                className="p-3 bg-white/90 rounded-full shadow-lg transform hover:scale-110 transition-all"
              >
                <Trash2 className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center px-4">
            <div className={`w-24 h-24 mx-auto mb-6 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-gray-100 to-gray-200'} flex items-center justify-center shadow-inner`}>
              <Upload className={`w-12 h-12 ${textSecondary}`} />
            </div>
            <p className={`text-xl font-semibold ${textPrimary} mb-2`}>Drag and drop your image here</p>
            <p className={`text-base ${textSecondary}`}>or click to browse your files</p>
            <p className={`text-sm ${textSecondary} mt-2`}>Supports: JPG, PNG, GIF (Max 10MB)</p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onFileSelect}
          className="hidden"
        />
      </div>

      <div className="p-8 space-y-6">
        <div>
          <label className={`block text-sm font-semibold ${textPrimary} mb-3`}>Title</label>
          <input
            type="text"
            value={uploadTitle}
            onChange={e => onTitleChange(e.target.value)}
            placeholder="Give your photo a title..."
            className={`w-full px-5 py-4 rounded-2xl ${inputBg} border ${textPrimary} text-lg outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all`}
          />
        </div>

        <div>
          <label className={`block text-sm font-semibold ${textPrimary} mb-3`}>
            Tags <span className={`font-normal ${textSecondary}`}>(separate with commas)</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={uploadTags}
              onChange={e => onTagsChange(e.target.value)}
              placeholder="nature, travel, sunset..."
              className={`w-full px-5 py-4 rounded-2xl ${inputBg} border ${textPrimary} text-lg outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent pb-12 transition-all`}
            />
            <div className="absolute bottom-4 left-5 right-5">
              <p className={`text-xs ${textSecondary}`}>
                Popular: {trendingTags.slice(0, 5).map(tag => (
                  <button
                    key={tag}
                    onClick={() => onTagClick(tag)}
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
          <label className={`block text-sm font-semibold ${textPrimary} mb-3`}>Privacy Settings</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {privacyOptions.map(option => (
              <button
                key={option.value}
                onClick={() => onPrivacyChange(option.value as typeof uploadPrivacy)}
                className={`px-5 py-4 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-2 ${
                  uploadPrivacy === option.value
                    ? 'border-teal-500 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/40 dark:to-cyan-950/40 shadow-md'
                    : `${darkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'}`
                }`}
              >
                <option.icon className={`w-7 h-7 ${uploadPrivacy === option.value ? 'text-teal-500' : textSecondary}`} />
                <span className={`font-semibold ${uploadPrivacy === option.value ? 'text-teal-600 dark:text-teal-400' : textPrimary}`}>{option.label}</span>
                <span className={`text-xs ${textSecondary}`}>{option.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onUpload}
          disabled={!uploadPreview || !uploadTitle.trim()}
          className="w-full py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold text-lg rounded-2xl hover:from-teal-600 hover:to-cyan-600 transition-all shadow-xl shadow-teal-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Upload className="w-5 h-5 inline mr-2" />
          Share Your Photo
        </button>
      </div>
    </div>
  );
};

export default UploadForm;
