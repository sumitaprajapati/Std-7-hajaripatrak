import React, { useState, useRef, useEffect } from 'react';
import { Student } from '../types/student';
import { getStudentAvatar } from '../utils/avatar';
import { X, Camera, Upload, RefreshCw, Trash2 } from 'lucide-react';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Student) => void;
  onDelete?: (studentId: string) => void;
  studentToEdit?: Student | null;
  nextRollNo: number;
}

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  studentToEdit,
  nextRollNo,
}) => {
  const [formData, setFormData] = useState<Partial<Student>>({
    rollNo: nextRollNo,
    grNo: '',
    name: '',
    fatherName: '',
    motherName: '',
    gender: 'boy',
    dob: '2013-06-15',
    aadhaarDiseNo: '',
    phone: '',
    address: 'વાવડી',
    bloodGroup: 'B+',
    category: 'OBC / SEBC',
    photoUrl: '',
    takesMdm: true,
  });

  const [useCamera, setUseCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (studentToEdit) {
      setFormData(studentToEdit);
    } else {
      setFormData({
        id: `std-${Date.now()}`,
        rollNo: nextRollNo,
        grNo: `14${String(nextRollNo + 20).padStart(2, '0')}`,
        name: '',
        fatherName: '',
        motherName: '',
        gender: 'boy',
        dob: '2013-06-15',
        aadhaarDiseNo: '',
        phone: '',
        address: 'વાવડી',
        bloodGroup: 'B+',
        category: 'OBC / SEBC',
        photoUrl: getStudentAvatar('boy', nextRollNo, 'વિદ્યાર્થી'),
        takesMdm: true,
      });
    }
    setUseCamera(false);
    setCameraError(null);
  }, [studentToEdit, nextRollNo, isOpen]);

  // Clean up camera stream on unmount or closing
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  if (!isOpen) return null;

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 400 }, height: { ideal: 400 }, facingMode: 'user' },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setUseCamera(true);
    } catch (err: unknown) {
      const error = err as Error;
      setCameraError('કેમેરા શરૂ કરી શકાયો નથી. કૃપા કરીને પરવાનગી તપાસો અથવા ફાઇલ અપલોડ કરો.');
      console.error(error);
    }
  };

  const captureCameraPhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = 240;
      canvas.height = 240;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, 240, 240);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setFormData(prev => ({ ...prev, photoUrl: dataUrl }));
      }
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setUseCamera(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData(prev => ({ ...prev, photoUrl: event.target?.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegenerateAvatar = () => {
    const gender = formData.gender || 'boy';
    const seed = Math.floor(Math.random() * 100);
    const newAvatar = getStudentAvatar(gender, seed, formData.name || 'વિદ્યાર્થી');
    setFormData(prev => ({ ...prev, photoUrl: newAvatar }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      alert('કૃપા કરીને વિદ્યાર્થીનું નામ દાખલ કરો.');
      return;
    }

    const student: Student = {
      id: formData.id || `std-${Date.now()}`,
      rollNo: Number(formData.rollNo) || nextRollNo,
      grNo: formData.grNo || '1400',
      name: formData.name.trim(),
      fatherName: formData.fatherName?.trim() || '',
      motherName: formData.motherName?.trim() || '',
      gender: (formData.gender as 'boy' | 'girl') || 'boy',
      dob: formData.dob || '2013-01-01',
      aadhaarDiseNo: formData.aadhaarDiseNo || '',
      phone: formData.phone || '',
      address: formData.address || 'વાવડી',
      bloodGroup: formData.bloodGroup || 'B+',
      category: formData.category || 'General',
      photoUrl: formData.photoUrl || getStudentAvatar(formData.gender || 'boy', 1, formData.name || ''),
      takesMdm: formData.takesMdm ?? true,
    };

    onSave(student);
    stopCamera();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto no-print">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl my-8 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {studentToEdit ? 'વિદ્યાર્થીની વિગત સુધારો' : 'નવો વિદ્યાર્થી ઉમેરો'}
            </h2>
            <p className="text-xs text-slate-500">
              વાવડી પ્રાથમિક શાળા · ધોરણ ૭
            </p>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          
          {/* Photo Section */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="relative">
              {useCamera ? (
                <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-amber-500 bg-black">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                </div>
              ) : (
                <img
                  src={formData.photoUrl || getStudentAvatar(formData.gender || 'boy', 1, formData.name || '')}
                  alt="Student preview"
                  referrerPolicy="no-referrer"
                  className="w-24 h-24 rounded-xl object-cover border-2 border-slate-300 shadow-xs"
                />
              )}
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <span className="font-semibold text-slate-800 block text-xs">
                વિદ્યાર્થીનો પાસપોર્ટ સાઇઝ ફોટો
              </span>
              
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                {useCamera ? (
                  <button
                    type="button"
                    onClick={captureCameraPhoto}
                    className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                  >
                    ફોટો ખેંચો (Capture)
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 font-medium bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5 text-slate-500" />
                      <span>ફાઇલ અપલોડ</span>
                    </button>

                    <button
                      type="button"
                      onClick={startCamera}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 font-medium bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors"
                    >
                      <Camera className="w-3.5 h-3.5 text-slate-500" />
                      <span>કેમેરા</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleRegenerateAvatar}
                      className="inline-flex items-center gap-1 px-2 py-1.5 font-medium text-slate-500 hover:text-slate-800"
                      title="નવો ડિજિટલ અવતાર બનાવો"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>અવતાર</span>
                    </button>
                  </>
                )}
              </div>

              {cameraError && (
                <p className="text-[11px] text-rose-600">{cameraError}</p>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          {/* Core IDs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                રોલ નં. (Roll No.) *
              </label>
              <input
                type="number"
                required
                value={formData.rollNo || ''}
                onChange={(e) => setFormData({ ...formData, rollNo: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:bg-white focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                જી.આર. નં. (G.R. No.) *
              </label>
              <input
                type="text"
                required
                value={formData.grNo || ''}
                onChange={(e) => setFormData({ ...formData, grNo: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:bg-white focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                જાતિ (Gender) *
              </label>
              <select
                value={formData.gender || 'boy'}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'boy' | 'girl' })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:bg-white focus:ring-1 focus:ring-amber-500"
              >
                <option value="boy">કુમાર (Boy)</option>
                <option value="girl">કન્યા (Girl)</option>
              </select>
            </div>
          </div>

          {/* Names */}
          <div>
            <label className="block text-slate-600 font-semibold mb-1">
              વિદ્યાર્થીનું પૂરું નામ (અટક, નામ, પિતાનું નામ) *
            </label>
            <input
              type="text"
              required
              placeholder="દા.ત. પ્રજાપતિ આરવ સુરેશભાઈ"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:bg-white focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                પિતાનું પૂરું નામ
              </label>
              <input
                type="text"
                value={formData.fatherName || ''}
                onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:bg-white focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                માતાનું નામ
              </label>
              <input
                type="text"
                value={formData.motherName || ''}
                onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:bg-white focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* DOB & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                જન્મ તારીખ (Date of Birth)
              </label>
              <input
                type="date"
                value={formData.dob || ''}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:bg-white focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                વાલીનો મોબાઇલ નંબર (૧૦ આંકડા)
              </label>
              <input
                type="tel"
                placeholder="9825000000"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:bg-white focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* DISE & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                આધાર ડાયસ નંબર (Aadhaar DISE)
              </label>
              <input
                type="text"
                value={formData.aadhaarDiseNo || ''}
                onChange={(e) => setFormData({ ...formData, aadhaarDiseNo: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:bg-white focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                સરનામું / ગામ (Address)
              </label>
              <input
                type="text"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:bg-white focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* MDM Toggle */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="takesMdmCheck"
              checked={formData.takesMdm ?? true}
              onChange={(e) => setFormData({ ...formData, takesMdm: e.target.checked })}
              className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
            />
            <label htmlFor="takesMdmCheck" className="text-slate-700 font-medium">
              મધ્યાહ્ન ભોજન (MDM) યોજનાનો લાભ લે છે.
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between gap-2 pt-4 border-t border-slate-200">
            {studentToEdit && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`શું તમે ખરેખર "${studentToEdit.name}" નો રેકોર્ડ રદ કરવા (Delete) માંગો છો?`)) {
                    onDelete(studentToEdit.id);
                    stopCamera();
                    onClose();
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors font-semibold border border-rose-200 hover:border-rose-300"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>વિદ્યાર્થી કાઢી નાખો (Delete)</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  onClose();
                }}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors font-medium"
              >
                રદ કરો
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-white bg-slate-900 hover:bg-slate-800 rounded-lg font-semibold transition-colors shadow-xs"
              >
                સાચવો (Save Student)
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
