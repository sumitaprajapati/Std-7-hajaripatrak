import React, { useState, useRef } from 'react';
import { SchoolConfig } from '../types/student';
import { X, Save, Download, Upload, RotateCcw } from 'lucide-react';

interface SchoolSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SchoolConfig;
  onSaveConfig: (config: SchoolConfig) => void;
  onExportBackup: () => void;
  onImportBackup: (jsonString: string) => void;
  onResetDemoData: () => void;
}

export const SchoolSettingsModal: React.FC<SchoolSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  onExportBackup,
  onImportBackup,
  onResetDemoData,
}) => {
  const [formData, setFormData] = useState<SchoolConfig>(config);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    onClose();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          try {
            onImportBackup(event.target.result as string);
            alert('ડેટા સફળતાપૂર્વક પુનઃસ્થાપિત (Restore) થઈ ગયો છે!');
            onClose();
          } catch {
            alert('અમાન્ય બેકઅપ ફાઇલ. કૃપા કરીને સાચી JSON ફાઇલ પસંદ કરો.');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto no-print">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl my-8 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              શાળા અને વર્ગ સેટિંગ્સ
            </h2>
            <p className="text-xs text-slate-500">
              હાજરી પત્રક અને સત્તાવાર પ્રિન્ટ રિપોર્ટ માટે વિગતો
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              શાળાનું નામ *
            </label>
            <input
              type="text"
              required
              value={formData.schoolName}
              onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium focus:bg-white focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                તાલુકો
              </label>
              <input
                type="text"
                value={formData.taluka}
                onChange={(e) => setFormData({ ...formData, taluka: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:bg-white focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                જિલ્લો
              </label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:bg-white focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                ધોરણ
              </label>
              <input
                type="text"
                value={formData.standard}
                onChange={(e) => setFormData({ ...formData, standard: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:bg-white focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                વર્ગ / વિભાગ
              </label>
              <input
                type="text"
                value={formData.division}
                onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:bg-white focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                શૈક્ષણિક વર્ષ
              </label>
              <input
                type="text"
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:bg-white focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                ડાયસ કોડ (DISE Code)
              </label>
              <input
                type="text"
                value={formData.diseCode}
                onChange={(e) => setFormData({ ...formData, diseCode: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:bg-white focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                વર્ગ શિક્ષકનું નામ *
              </label>
              <input
                type="text"
                required
                value={formData.classTeacher}
                onChange={(e) => setFormData({ ...formData, classTeacher: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium focus:bg-white focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                આચાર્યશ્રીનું નામ
              </label>
              <input
                type="text"
                value={formData.principalName}
                onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:bg-white focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Backup / Restore Section */}
          <div className="pt-3 border-t border-slate-200 space-y-2">
            <span className="font-semibold text-slate-700 block">
              ડેટા સુરક્ષા અને બેકઅપ (Backup / Restore)
            </span>
            
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={onExportBackup}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>બેકઅપ ડાઉનલોડ</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-slate-600" />
                <span>બેકઅપ રિસ્ટોર</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm('શું તમે ખરેખર મૂળ ડેમો ડેટા પુનઃસ્થાપિત કરવા માંગો છો?')) {
                    onResetDemoData();
                    onClose();
                  }
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>મૂળ ડેટા રીસેટ</span>
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".json"
                className="hidden"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium"
            >
              રદ કરો
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 text-white bg-slate-900 hover:bg-slate-800 rounded-lg font-semibold shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>સાચવો (Save)</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
