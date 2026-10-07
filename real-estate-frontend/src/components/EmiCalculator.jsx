import React, { useState } from 'react';
import { Calculator, IndianRupee, Percent, Calendar, Sparkles } from 'lucide-react';
import { formatIndianPrice } from '../data/mockProperties';

export default function EmiCalculator() {
  const [loanAmount, setLoanAmount] = useState(5000000); // 50 Lakhs
  const [interestRate, setInterestRate] = useState(8.5); // 8.5%
  const [tenureYears, setTenureYears] = useState(20); // 20 years

  // Calculate EMI
  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = tenureYears * 12;
  const emi = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1)
  );

  const totalPayment = emi * totalMonths;
  const totalInterest = totalPayment - loanAmount;

  const principalPercent = Math.round((loanAmount / totalPayment) * 100);
  const interestPercent = 100 - principalPercent;

  return (
    <section id="emi-calc" className="py-12 bg-[#f4f7fb]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200 shadow-card">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center space-x-2 text-brand-600 font-bold text-xs uppercase tracking-wider mb-1">
                <Calculator className="w-4 h-4" />
                <span>Financial Planning Tool</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Home Loan EMI & Eligibility Calculator
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Plan your property investment with accurate monthly EMI breakdowns and bank loan rates.
              </p>
            </div>
            <div className="bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center">
              <Sparkles className="w-4 h-4 mr-1.5 text-amber-600" />
              Lowest Bank Home Loan Rates starting from 8.35% p.a.
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Sliders Area (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Slider 1: Loan Amount */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold uppercase text-slate-500">Loan Amount</span>
                  <span className="text-base font-black text-brand-700 bg-brand-50 px-3 py-1 rounded-lg">
                    {formatIndianPrice(loanAmount)}
                  </span>
                </div>
                <input
                  type="range"
                  min={500000}
                  max={50000000}
                  step={100000}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full accent-brand-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>₹ 5 Lac</span>
                  <span>₹ 5 Cr</span>
                </div>
              </div>

              {/* Slider 2: Interest Rate */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold uppercase text-slate-500">Interest Rate (% p.a.)</span>
                  <span className="text-base font-black text-brand-700 bg-brand-50 px-3 py-1 rounded-lg">
                    {interestRate} %
                  </span>
                </div>
                <input
                  type="range"
                  min={7.0}
                  max={15.0}
                  step={0.1}
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full accent-brand-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>7.0 %</span>
                  <span>15.0 %</span>
                </div>
              </div>

              {/* Slider 3: Tenure Years */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold uppercase text-slate-500">Loan Tenure</span>
                  <span className="text-base font-black text-brand-700 bg-brand-50 px-3 py-1 rounded-lg">
                    {tenureYears} Years ({tenureYears * 12} Months)
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={30}
                  step={1}
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full accent-brand-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>1 Year</span>
                  <span>30 Years</span>
                </div>
              </div>

            </div>

            {/* Results & Monthly Breakdown (5 Cols) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-brand-950 text-white p-6 rounded-2xl shadow-xl space-y-5">
              
              <div className="text-center pb-4 border-b border-white/10">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Your Monthly EMI
                </span>
                <div className="text-3xl sm:text-4xl font-black text-amber-300 mt-1">
                  ₹ {emi.toLocaleString('en-IN')}
                  <span className="text-xs text-slate-300 font-medium ml-1">/ month</span>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>Principal Loan Amount:</span>
                  <strong className="text-white">₹ {loanAmount.toLocaleString('en-IN')}</strong>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Total Interest Payable:</span>
                  <strong className="text-amber-300">₹ {totalInterest.toLocaleString('en-IN')}</strong>
                </div>
                <div className="flex justify-between text-slate-300 pt-2 border-t border-white/10">
                  <span>Total Amount (Principal + Int):</span>
                  <strong className="text-white font-bold">₹ {totalPayment.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              {/* Graphical Ratio bar */}
              <div>
                <div className="h-3 w-full bg-amber-400 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${principalPercent}%` }}
                    className="h-full bg-brand-500"
                  ></div>
                </div>
                <div className="flex justify-between text-[11px] text-slate-300 mt-1.5">
                  <span className="flex items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-500 mr-1 inline-block"></span>
                    Principal ({principalPercent}%)
                  </span>
                  <span className="flex items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 mr-1 inline-block"></span>
                    Interest ({interestPercent}%)
                  </span>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition">
                Apply for Pre-Approved Home Loan
              </button>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
