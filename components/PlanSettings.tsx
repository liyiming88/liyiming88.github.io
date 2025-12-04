import React from 'react';
import { UserProfile } from '../types';
import { THEME_COLOR } from '../constants';
import { Sliders, DollarSign, TrendingUp, Calendar } from 'lucide-react';

interface PlanSettingsProps {
  user: UserProfile;
  onUpdate: (user: UserProfile) => void;
}

const PlanSettings: React.FC<PlanSettingsProps> = ({ user, onUpdate }) => {
  const handleChange = (field: keyof UserProfile, value: string | number) => {
    onUpdate({ ...user, [field]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Sliders className="w-5 h-5" style={{ color: THEME_COLOR }} />
        <h3 className="text-lg font-bold text-gray-800">Plan Variables</h3>
      </div>

      <div className="space-y-6">
        {/* Monthly Contribution */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="w-4 h-4 mr-1 text-gray-400" />
            Monthly Savings
          </label>
          <input
            type="range"
            min="0"
            max="10000"
            step="100"
            value={user.monthlyContribution}
            onChange={(e) => handleChange('monthlyContribution', Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#12805c]"
          />
          <div className="flex justify-between mt-1 text-sm text-gray-600">
            <span>$0</span>
            <span className="font-bold text-[#12805c]">${user.monthlyContribution.toLocaleString()}</span>
            <span>$10k</span>
          </div>
        </div>

        {/* Retirement Age */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 mr-1 text-gray-400" />
            Retirement Age
          </label>
          <input
            type="range"
            min="50"
            max="80"
            step="1"
            value={user.retirementAge}
            onChange={(e) => handleChange('retirementAge', Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#12805c]"
          />
          <div className="flex justify-between mt-1 text-sm text-gray-600">
            <span>50</span>
            <span className="font-bold text-[#12805c]">{user.retirementAge}</span>
            <span>80</span>
          </div>
        </div>

        {/* Risk Tolerance */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <TrendingUp className="w-4 h-4 mr-1 text-gray-400" />
            Risk Profile
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['Conservative', 'Moderate', 'Aggressive'].map((level) => (
              <button
                key={level}
                onClick={() => handleChange('riskTolerance', level)}
                className={`py-2 text-xs font-semibold rounded-md transition-colors ${
                  user.riskTolerance === level
                    ? 'bg-[#12805c] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
            <div className="text-xs text-gray-500">
                <p>Adjusting these variables dynamically updates your projection chart.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PlanSettings;