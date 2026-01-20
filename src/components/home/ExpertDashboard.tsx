import {
  BarChart3,
  List,
  TrendingUp,
  Users,
  Clock,
  CalendarClock,
} from "lucide-react";

export const ExpertDashboard = () => {
  return (
    <div className="w-full min-h-screen p-6 text-slate-200">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">
            Expert Dashboard
          </h2>
          <p className="text-xs text-slate-500">
            System Status: Operational | Data Source: Hwa-Ui Engine v2.4
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs rounded border border-slate-700 transition">
            Export PDF
          </button>
          <button className="px-3 py-1.5 bg-accent-gold hover:bg-[#8f7352] text-black font-bold text-xs rounded transition">
            New Analysis
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-900/50 p-4 rounded border border-slate-800">
          <div className="text-xs text-slate-500 uppercase flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5" />
            Daily Consultations
          </div>
          <div className="text-2xl font-bold text-white mt-1">24</div>
          <div className="text-[10px] text-emerald-400 mt-1">
            ▲ 12% from yesterday
          </div>
        </div>
        <div className="bg-slate-900/50 p-4 rounded border border-slate-800">
          <div className="text-xs text-slate-500 uppercase flex items-center gap-2">
            <Users className="w-3.5 h-3.5" />
            Active Clients
          </div>
          <div className="text-2xl font-bold text-white mt-1">1,204</div>
        </div>
        <div className="bg-slate-900/50 p-4 rounded border border-slate-800">
          <div className="text-xs text-slate-500 uppercase flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" />
            Avg. Session Time
          </div>
          <div className="text-2xl font-bold text-white mt-1">45m</div>
        </div>
        <div className="bg-slate-900/50 p-4 rounded border border-slate-800">
          <div className="text-xs text-slate-500 uppercase flex items-center gap-2">
            <CalendarClock className="w-3.5 h-3.5" />
            Next Appointment
          </div>
          <div className="text-lg font-bold text-accent-gold mt-1">
            14:00 PM
          </div>
          <div className="text-[10px] text-slate-400">
            Client: Park Ji-min
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/50 rounded border border-slate-800 p-6">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-accent-gold" />
            Biorhythm Analytics
          </h3>
          <div className="h-64 w-full bg-grid-pattern border border-slate-800/50 relative flex items-end justify-between px-6 pb-2">
            <div className="w-8 bg-slate-700 h-[30%] hover:bg-accent-gold transition duration-300"></div>
            <div className="w-8 bg-slate-700 h-[50%] hover:bg-accent-gold transition duration-300"></div>
            <div className="w-8 bg-slate-700 h-[40%] hover:bg-accent-gold transition duration-300"></div>
            <div className="w-8 bg-accent-gold h-[70%] shadow-[0_0_15px_rgba(197,160,89,0.3)]"></div>
            <div className="w-8 bg-slate-700 h-[60%] hover:bg-accent-gold transition duration-300"></div>
            <div className="w-8 bg-slate-700 h-[45%] hover:bg-accent-gold transition duration-300"></div>
            <div className="w-8 bg-slate-700 h-[55%] hover:bg-accent-gold transition duration-300"></div>
            <div className="w-8 bg-slate-700 h-[40%] hover:bg-accent-gold transition duration-300"></div>
            <div
              className="absolute inset-0 pointer-events-none border-b border-slate-800/40"
              style={{ bottom: "25%" }}
            ></div>
            <div
              className="absolute inset-0 pointer-events-none border-b border-slate-800/40"
              style={{ bottom: "50%" }}
            ></div>
            <div
              className="absolute inset-0 pointer-events-none border-b border-slate-800/40"
              style={{ bottom: "75%" }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono">
            <span>JAN</span>
            <span>FEB</span>
            <span>MAR</span>
            <span>APR</span>
            <span>MAY</span>
            <span>JUN</span>
            <span>JUL</span>
            <span>AUG</span>
          </div>
        </div>
        <div className="bg-slate-900/50 rounded border border-slate-800 p-6">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <List className="w-4 h-4 text-accent-gold" />
            Analysis Log
          </h3>
          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between p-2 hover:bg-white/5 rounded transition cursor-pointer">
              <span className="text-emerald-400">[COMPLETE]</span>
              <span className="text-slate-300">User #4829 - Compatibility</span>
              <span className="text-slate-600">10m ago</span>
            </div>
            <div className="flex justify-between p-2 hover:bg-white/5 rounded transition cursor-pointer">
              <span className="text-emerald-400">[COMPLETE]</span>
              <span className="text-slate-300">User #1130 - Today Fortune</span>
              <span className="text-slate-600">28m ago</span>
            </div>
            <div className="flex justify-between p-2 hover:bg-white/5 rounded transition cursor-pointer">
              <span className="text-amber-400">[IN PROGRESS]</span>
              <span className="text-slate-300">User #9981 - Career</span>
              <span className="text-slate-600">1h ago</span>
            </div>
            <div className="flex justify-between p-2 hover:bg-white/5 rounded transition cursor-pointer">
              <span className="text-emerald-400">[COMPLETE]</span>
              <span className="text-slate-300">User #3312 - Yearly</span>
              <span className="text-slate-600">2h ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
