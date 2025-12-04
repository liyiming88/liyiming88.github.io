import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Target, 
  PieChart, 
  Settings, 
  Bell, 
  Search, 
  TrendingUp, 
  ShieldCheck, 
  Wallet,
  Menu,
  Sparkles
} from 'lucide-react';

import { INITIAL_USER, INITIAL_GOALS, THEME_COLOR, MOCK_MARKET_NEWS } from './constants';
import { UserProfile, FinancialGoal } from './types';
import MetricsCard from './components/MetricsCard';
import ProjectionChart from './components/ProjectionChart';
import PlanSettings from './components/PlanSettings';
import AIAdvisor from './components/AIAdvisor';

// Using a simplified Markdown component for inline advice
import ReactMarkdown from 'react-markdown';

function App() {
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [goals, setGoals] = useState<FinancialGoal[]>(INITIAL_GOALS);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'Dashboard' | 'Planning' | 'Investments'>('Dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Derive simple plan score
  const planScore = Math.min(Math.round((user.currentSavings / (user.age * 2000)) * 100), 95); 
  // Rough heuristic: should have age * $2k as base for this arbitrary score

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button 
                className="sm:hidden p-2 text-gray-500 mr-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="w-6 h-6" />
              </button>
              {/* Logo Simulation */}
              <div className="flex items-center space-x-2">
                 <div className="w-8 h-8 rounded bg-[#12805c] flex items-center justify-center text-white font-bold text-xl">
                    P
                 </div>
                 <span className="font-bold text-xl text-gray-800 tracking-tight hidden sm:block">PlanView AI</span>
              </div>
              
              <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
                {['Dashboard', 'Planning', 'Investments'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`${
                      activeTab === tab
                        ? 'border-[#12805c] text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full transition-colors`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsAdvisorOpen(true)}
                className="hidden sm:flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#12805c] hover:bg-[#0e6045] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#12805c] transition-colors"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                AI Advisor
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Bell className="w-6 h-6" />
              </button>
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold border border-gray-300">
                {user.name.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}</h1>
          <p className="mt-1 text-sm text-gray-500">Here's your financial outlook for {new Date().getFullYear()}.</p>
        </div>

        {activeTab === 'Dashboard' && (
          <div className="space-y-8">
            {/* Top Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricsCard 
                title="Net Worth" 
                value={`$${(user.currentSavings * 1.05).toLocaleString()}`} 
                subValue="+5.2% from last month"
                trend="up"
                icon={<Wallet className="w-5 h-5" />}
              />
              <MetricsCard 
                title="Plan Score" 
                value={`${planScore}/100`} 
                subValue={planScore > 80 ? "On Track" : "Needs Attention"}
                trend={planScore > 80 ? "up" : "neutral"}
                icon={<Target className="w-5 h-5" />}
              />
              <MetricsCard 
                title="Retirement Goal" 
                value={`${Math.round((user.currentSavings / 2500000) * 100)}%`} 
                subValue={`Target: $2.5M by ${user.retirementAge}`}
                trend="neutral"
                icon={<ShieldCheck className="w-5 h-5" />}
              />
              <MetricsCard 
                title="YTD Return" 
                value="+8.4%" 
                subValue="S&P 500: +7.2%"
                trend="up"
                icon={<TrendingUp className="w-5 h-5" />}
              />
            </div>

            {/* Main Interactive Section: Chart + Settings */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <ProjectionChart user={user} />
              </div>
              <div className="lg:col-span-1">
                <PlanSettings user={user} onUpdate={handleUpdateUser} />
                
                {/* News Feed Mini Widget */}
                <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                   <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                     <Bell className="w-4 h-4 mr-2 text-gray-400" />
                     Market Pulses
                   </h3>
                   <div className="space-y-4">
                     {MOCK_MARKET_NEWS.map((news, idx) => (
                       <div key={idx} className="flex justify-between items-start border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                         <div>
                            <p className="text-sm font-medium text-gray-700">{news.title}</p>
                            <p className="text-xs text-gray-400 mt-1">{news.date}</p>
                         </div>
                         <span className={`text-xs px-2 py-1 rounded-full ${
                           news.impact === 'Positive' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                         }`}>
                           {news.impact}
                         </span>
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            </div>
            
            {/* Goals Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                   <h3 className="text-lg font-bold text-gray-800">Your Goals</h3>
                   <button className="text-sm font-medium text-[#12805c] hover:text-[#0e6045]">Add Goal +</button>
                </div>
                <div className="divide-y divide-gray-100">
                    {goals.map((goal) => (
                        <div key={goal.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                           <div className="flex items-center space-x-4">
                               <div className={`p-2 rounded-full ${
                                   goal.category === 'Retirement' ? 'bg-blue-50 text-blue-600' :
                                   goal.category === 'Education' ? 'bg-purple-50 text-purple-600' :
                                   'bg-yellow-50 text-yellow-600'
                               }`}>
                                   <Target className="w-5 h-5" />
                               </div>
                               <div>
                                   <p className="text-sm font-medium text-gray-900">{goal.name}</p>
                                   <p className="text-xs text-gray-500">Target: {goal.deadlineYear}</p>
                               </div>
                           </div>
                           <div className="flex items-center space-x-6">
                               <div className="text-right">
                                   <p className="text-sm font-medium text-gray-900">${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}</p>
                                   <div className="w-32 h-2 bg-gray-200 rounded-full mt-1">
                                       <div 
                                        className="h-2 bg-[#12805c] rounded-full" 
                                        style={{ width: `${Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)}%` }}
                                       ></div>
                                   </div>
                               </div>
                           </div>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        )}

        {activeTab === 'Planning' && (
             <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <LayoutDashboard className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Detailed Planning Module</h3>
                <p className="mt-2 text-gray-500 max-w-md mx-auto">This section would contain detailed tax loss harvesting analysis, estate planning tools, and insurance gap analysis.</p>
                <button 
                  onClick={() => setActiveTab('Dashboard')}
                  className="mt-6 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Return to Dashboard
                </button>
             </div>
        )}

        {activeTab === 'Investments' && (
             <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 text-center">
                 <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                     <PieChart className="w-8 h-8 text-gray-400" />
                 </div>
                 <h3 className="text-lg font-medium text-gray-900">Portfolio Breakdown</h3>
                 <p className="mt-2 text-gray-500 max-w-md mx-auto">Detailed asset allocation (Stocks, Bonds, Cash) and regional exposure analysis would appear here.</p>
             </div>
        )}

      </main>

      <AIAdvisor 
        isOpen={isAdvisorOpen} 
        onClose={() => setIsAdvisorOpen(false)} 
        user={user}
        goals={goals}
      />

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex sm:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="pt-5 pb-4 px-4">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 rounded bg-[#12805c] flex items-center justify-center text-white font-bold text-xl mr-2">P</div>
                <span className="font-bold text-xl text-gray-800">PlanView</span>
              </div>
            </div>
            <div className="mt-5 flex-1 h-0 overflow-y-auto">
              <nav className="px-2 space-y-1">
                {['Dashboard', 'Planning', 'Investments'].map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                        setActiveTab(item as any);
                        setMobileMenuOpen(false);
                    }}
                    className={`${
                        activeTab === item ? 'bg-[#12805c] text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } group flex items-center px-2 py-2 text-base font-medium rounded-md w-full`}
                  >
                    {item}
                  </button>
                ))}
                <button
                    onClick={() => {
                        setIsAdvisorOpen(true);
                        setMobileMenuOpen(false);
                    }}
                    className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-base font-medium rounded-md w-full"
                >
                    <Sparkles className="w-5 h-5 mr-3 text-[#12805c]" />
                    AI Advisor
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;