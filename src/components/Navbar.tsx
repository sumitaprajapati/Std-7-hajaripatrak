import React from 'react';
import { Calendar, Users, Printer, Settings, Award, Utensils } from 'lucide-react';

export type ActiveTab = 'daily' | 'monthly' | 'directory' | 'mdm';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenPrint: () => void;
  onOpenSettings: () => void;
  onAddNewStudent: () => void;
  studentCount: number;
  classTeacher?: string;
  principalName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenPrint,
  onOpenSettings,
  onAddNewStudent,
  studentCount,
  classTeacher = 'શ્રીમતી પ્રજાપતિ સુમિતાબેન અશ્ર્વિનભાઈ',
  principalName = 'શ્રી કરણસિંહ.ઝેડ.ચાવડા',
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center font-bold text-lg shadow-xs shrink-0">
            વા
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 leading-tight truncate">
              વાવડી પ્રાથમિક શાળા
            </h1>
            <p className="text-xs text-slate-500 font-medium truncate max-w-[320px] sm:max-w-none">
              ધોરણ - ૭ · વર્ગશિક્ષક: <span className="text-slate-700 font-semibold">{classTeacher}</span> · આચાર્ય: <span className="text-slate-700 font-semibold">{principalName}</span>
            </p>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Clean unboxed single-line tabs) */}
        <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setActiveTab('daily')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'daily'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
            <span>દૈનિક હાજરી</span>
          </button>

          <button
            onClick={() => setActiveTab('monthly')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'monthly'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-blue-600" />
            <span>માસિક પત્રક</span>
          </button>

          <button
            onClick={() => setActiveTab('directory')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'directory'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span>વિદ્યાર્થી ફોટો ડિરેક્ટરી ({studentCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('mdm')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'mdm'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Utensils className="w-3.5 h-3.5 text-rose-600" />
            <span>મધ્યાહ્ન ભોજન</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onAddNewStudent}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <span>+ નવો વિદ્યાર્થી</span>
          </button>

          <button
            onClick={onOpenPrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">પત્રક પ્રિન્ટ / PDF</span>
            <span className="sm:hidden">પ્રિન્ટ</span>
          </button>

          <button
            onClick={onOpenSettings}
            title="શાળા સેટિંગ્સ"
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Mobile navigation tab strip */}
      <div className="flex md:hidden border-t border-slate-200 bg-slate-50 px-2 py-1.5 overflow-x-auto gap-1">
        <button
          onClick={() => setActiveTab('daily')}
          className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
            activeTab === 'daily' ? 'bg-white shadow-xs text-slate-900 font-semibold' : 'text-slate-600'
          }`}
        >
          દૈનિક હાજરી
        </button>
        <button
          onClick={() => setActiveTab('monthly')}
          className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
            activeTab === 'monthly' ? 'bg-white shadow-xs text-slate-900 font-semibold' : 'text-slate-600'
          }`}
        >
          માસિક પત્રક
        </button>
        <button
          onClick={() => setActiveTab('directory')}
          className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
            activeTab === 'directory' ? 'bg-white shadow-xs text-slate-900 font-semibold' : 'text-slate-600'
          }`}
        >
          સચિત્ર યાદી ({studentCount})
        </button>
        <button
          onClick={() => setActiveTab('mdm')}
          className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
            activeTab === 'mdm' ? 'bg-white shadow-xs text-slate-900 font-semibold' : 'text-slate-600'
          }`}
        >
          મધ્યાહ્ન ભોજન
        </button>
      </div>
    </header>
  );
};
