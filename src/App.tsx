import React, { useState, useMemo } from 'react';
import { 
  Scale, 
  Briefcase, 
  Shield, 
  TrendingUp, 
  ShieldAlert, 
  Clock, 
  User, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Award, 
  GraduationCap, 
  Calculator, 
  AlertCircle, 
  Star, 
  ChevronRight, 
  Check,
  CheckCircle
} from 'lucide-react';
import { PRACTICE_AREAS, ATTORNEYS, OFFICE_REVIEWS } from './data';
import { PracticeArea, Attorney, CaseEstimation } from './types';

export default function App() {
  // Navigation / Focus State
  const [activeTab, setActiveTab] = useState<'practices' | 'estimator' | 'intake'>('practices');
  
  // Attorney Interaction State
  const [selectedAttorneyId, setSelectedAttorneyId] = useState<string>('eleanor-sterling');
  
  // Fee Estimator State
  const [selectedPracticeId, setSelectedPracticeId] = useState<string>('corp-ma');
  const [complexity, setComplexity] = useState<CaseEstimation['complexity']>('standard');
  const [urgency, setUrgency] = useState<CaseEstimation['urgency']>('routine');
  const [customHoursModifier, setCustomHoursModifier] = useState<number>(0); // Offset in hours from baseline

  // Client Intake State
  const [intakeStep, setIntakeStep] = useState<number>(1);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [opposingParty, setOpposingParty] = useState('');
  const [briefSummary, setBriefSummary] = useState('');
  const [preferredDate, setPreferredDate] = useState('2026-07-10');
  const [preferredTime, setPreferredTime] = useState('10:00');
  const [consultType, setConsultType] = useState<'in-person' | 'video' | 'phone'>('video');
  const [intakeSubmitted, setIntakeSubmitted] = useState<any | null>(null);

  // Active Selected Objects
  const activeAttorney = useMemo(() => {
    return ATTORNEYS.find(a => a.id === selectedAttorneyId) || ATTORNEYS[0];
  }, [selectedAttorneyId]);

  const activePractice = useMemo(() => {
    return PRACTICE_AREAS.find(p => p.id === selectedPracticeId) || PRACTICE_AREAS[0];
  }, [selectedPracticeId]);

  // Fee Calculation Logic
  const feeCalculation = useMemo(() => {
    const practice = activePractice;
    const attorney = activeAttorney;

    // Complexity Adjustments
    let complexityMultiplier = 1.0;
    let hoursMultiplier = 1.0;
    if (complexity === 'complex') {
      complexityMultiplier = 1.3;
      hoursMultiplier = 1.4;
    } else if (complexity === 'high-stakes') {
      complexityMultiplier = 1.7;
      hoursMultiplier = 1.8;
    }

    // Urgency Adjustments
    let urgencyMultiplier = 1.0;
    if (urgency === 'urgent') {
      urgencyMultiplier = 1.25;
    } else if (urgency === 'immediate') {
      urgencyMultiplier = 1.5;
    }

    // Base values from practice area
    const baseRetainer = practice.baseRetainer * urgencyMultiplier;
    
    // Calculate baseline hours
    const baselineHours = Math.round(practice.typicalHours * hoursMultiplier);
    const finalHours = Math.max(5, baselineHours + customHoursModifier);

    // Rate selection: Use selected attorney's premium rate, but adjusted for complexity
    const hourlyRate = Math.round(attorney.hourlyRate * complexityMultiplier);
    
    const estimatedHourlyTotal = finalHours * hourlyRate;
    const totalEstimate = baseRetainer + estimatedHourlyTotal;

    return {
      baseRetainer,
      hours: finalHours,
      hourlyRate,
      hourlyTotal: estimatedHourlyTotal,
      totalEstimate,
      urgencyMultiplier,
      complexityMultiplier
    };
  }, [activePractice, activeAttorney, complexity, urgency, customHoursModifier]);

  // Trigger from Practice Bento directly to Estimator
  const handleSelectPracticeForEstimator = (practiceId: string) => {
    setSelectedPracticeId(practiceId);
    setCustomHoursModifier(0);
    setActiveTab('estimator');
    
    // Auto-match first attorney specializing in this practice if current is not a match
    const matchingAttorney = ATTORNEYS.find(a => a.specialties.includes(practiceId));
    if (matchingAttorney && !activeAttorney.specialties.includes(practiceId)) {
      setSelectedAttorneyId(matchingAttorney.id);
    }
  };

  // Submit Consultation Form
  const handleIntakeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !clientPhone) {
      alert('Please fill out all required credentials.');
      return;
    }

    const docketNumber = `ST-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const docketData = {
      docketNumber,
      clientName,
      clientEmail,
      clientPhone,
      clientCompany,
      opposingParty,
      briefSummary,
      preferredDate,
      preferredTime,
      consultType,
      practiceArea: activePractice.name,
      assignedAttorney: activeAttorney.name,
      estimatedRetainer: feeCalculation.baseRetainer,
      conflictStatus: opposingParty.toLowerCase().includes('sterling') || opposingParty.toLowerCase().includes('thorne') 
        ? '⚠️ CONFLICT FOUND - PARTNER REVIEW MANDATORY' 
        : '✔️ SECURE & CLEARED - GREEN LIGHT',
      timestamp: new Date().toLocaleDateString()
    };

    setIntakeSubmitted(docketData);
  };

  // Reset Intake Form
  const handleResetIntake = () => {
    setClientName('');
    setClientEmail('');
    setClientPhone('');
    setClientCompany('');
    setOpposingParty('');
    setBriefSummary('');
    setIntakeStep(1);
    setIntakeSubmitted(null);
  };

  // Render Practice Area Icon
  const renderPracticeIcon = (name: string, className = "w-6 h-6 text-amber-500") => {
    switch (name) {
      case 'Briefcase': return <Briefcase className={className} />;
      case 'Scale': return <Scale className={className} />;
      case 'Shield': return <Shield className={className} />;
      case 'TrendingUp': return <TrendingUp className={className} />;
      case 'ShieldAlert': return <ShieldAlert className={className} />;
      default: return <Scale className={className} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0C10] font-sans text-slate-200 selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* BRAND ARCHITECTURE BAR (No unsolicited telemetry, pure premium branding) */}
      <header className="border-b border-white/5 bg-[#0D1017]">
        <div className="mx-auto max-w-7xl px-6 py-6 sm:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-center md:text-left">
              <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-[0.25em] text-white">
                STERLING &amp; THORNE
              </h1>
              <p className="mt-1 font-sans text-[9px] font-semibold tracking-[0.3em] text-amber-500 uppercase">
                Premier Legal Juris Group &amp; Counselors at Law
              </p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-amber-500" />
                <span className="font-medium text-[11px] tracking-wider uppercase">Fifth Avenue, NY &bull; Silicon Valley</span>
              </div>
              <div className="h-4 w-px bg-white/10 hidden sm:block"></div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-amber-500" />
                <span className="font-mono text-xs text-white tracking-widest font-semibold">1-800-ST-JURIS</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* CORE WORKSPACE CONTEXT */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* LEFT COLUMN: PRESTIGE MATTERS & EXPERT ROSTER (lg:col-span-4) */}
          <section className="space-y-6 lg:col-span-4">
            
            {/* IMMERSIVE HERO CARD */}
            <div className="relative overflow-hidden rounded-2xl bg-[#0D1017] text-white shadow-2xl border border-white/5">
              {/* Generated high-end office background */}
              <div className="absolute inset-0 z-0">
                <img 
                  src="/src/assets/images/firm_office_hero_1783162376573.jpg" 
                  alt="Elite Law Firm Chambers" 
                  className="h-full w-full object-cover opacity-25"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C10] via-[#0A0C10]/90 to-transparent"></div>
              </div>

              <div className="relative z-10 p-6 sm:p-8">
                <span className="inline-block rounded-full bg-amber-500/10 px-3 py-1 text-[9px] font-bold tracking-widest text-amber-400 uppercase border border-amber-500/20">
                  Established 1998
                </span>
                <h2 className="mt-4 font-serif text-2xl font-semibold leading-tight text-white">
                  Securing Uncompromised Justice &amp; Corporate Excellence
                </h2>
                <p className="mt-3 text-slate-400 text-xs leading-relaxed font-light">
                  We defend the assets, reputations, and strategic legal monopolies of visionary enterprises and founders worldwide.
                </p>

                {/* Key Firm Merits */}
                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/5 pt-5">
                  <div>
                    <p className="font-mono text-xl font-bold text-amber-500">$2.4B+</p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Capital Preserved</p>
                  </div>
                  <div>
                    <p className="font-mono text-xl font-bold text-amber-500">95%</p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Trial Success Rate</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ATTORNEY EXPERT ROSTER */}
            <div className="rounded-2xl border border-white/5 bg-[#0D1017] p-5 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-white tracking-wide">Attorneys &amp; Partners</h3>
                  <p className="text-[10px] text-slate-400 font-light mt-0.5">Select an advocate to view credentials and dynamic rate metrics</p>
                </div>
                <Award className="h-5 w-5 text-amber-500" />
              </div>

              {/* Roster Grid */}
              <div className="space-y-3">
                {ATTORNEYS.map((attorney) => {
                  const isSelected = attorney.id === selectedAttorneyId;
                  const isSpecialistForActive = attorney.specialties.includes(selectedPracticeId);
                  
                  return (
                    <button
                      key={attorney.id}
                      onClick={() => setSelectedAttorneyId(attorney.id)}
                      className={`w-full text-left rounded-xl p-3 transition-all border flex items-start gap-3 ${
                        isSelected 
                          ? 'bg-white text-black border-white shadow-xl font-medium' 
                          : 'bg-white/[0.01] text-slate-300 border-white/5 hover:bg-white/[0.04] hover:border-white/10'
                      }`}
                    >
                      <img 
                        src={attorney.image} 
                        alt={attorney.name} 
                        className={`h-12 w-12 rounded-lg object-cover border ${
                          isSelected ? 'border-amber-500' : 'border-white/10'
                        }`}
                        referrerPolicy="no-referrer"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="font-serif text-xs font-bold truncate leading-snug">
                            {attorney.name}
                          </h4>
                          {isSpecialistForActive && (
                            <span className={`shrink-0 inline-flex items-center rounded-sm px-1 py-0.5 text-[8px] font-bold uppercase tracking-wider border ${
                              isSelected 
                                ? 'bg-amber-500/10 text-amber-700 border-amber-500/20' 
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}>
                              Matches Matter
                            </span>
                          )}
                        </div>
                        <p className={`text-[10px] font-medium leading-normal ${isSelected ? 'text-amber-700 font-semibold' : 'text-amber-500'}`}>
                          {attorney.title}
                        </p>
                        
                        {/* Interactive Rates & Specs */}
                        <div className="mt-1.5 flex items-center gap-3 text-[9px] font-mono font-medium">
                          <span className={isSelected ? 'text-slate-800' : 'text-slate-500'}>
                            Rate: ${attorney.hourlyRate}/hr
                          </span>
                          <span className={isSelected ? 'text-slate-800' : 'text-slate-500'}>
                            Win Rate: {attorney.successRate}%
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Attorney Biography Details Card */}
              <div className="mt-4 rounded-xl bg-white/[0.02] border border-white/5 p-4">
                <div className="flex items-start gap-1.5 mb-2">
                  <GraduationCap className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] font-medium text-slate-300">
                    <span className="font-bold text-white uppercase tracking-wider text-[9px]">Credentials:</span>{' '}
                    {activeAttorney.education}
                  </p>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-light italic">
                  "{activeAttorney.bio}"
                </p>
                <div className="mt-3 border-t border-white/5 pt-2 text-[10px]">
                  <span className="font-semibold text-slate-300 uppercase tracking-wider text-[9px]">Notable Precedent: </span>
                  <span className="text-slate-400">{activeAttorney.notableCase}</span>
                </div>
              </div>
            </div>

            {/* REAL CLIENT REVIEWS PANEL */}
            <div className="rounded-2xl border border-white/5 bg-[#0D1017] p-5 shadow-xl">
              <h4 className="font-serif text-sm font-bold text-white mb-3 tracking-wide">Client Fiduciary Trust</h4>
              <div className="space-y-4">
                {OFFICE_REVIEWS.map((review) => (
                  <div key={review.id} className="border-b border-white/5 last:border-b-0 pb-3 last:pb-0">
                    <div className="flex items-center gap-1 mb-1">
                      {[...Array(review.stars)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-amber-500 text-amber-500" />
                      ))}
                    </div>
                    <p className="text-[11px] text-slate-400 italic leading-relaxed">
                      "{review.text}"
                    </p>
                    <p className="mt-1 text-[10px] font-semibold text-slate-200">
                      {review.author} &bull; <span className="text-slate-500 font-light">{review.role}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </section>

          {/* RIGHT COLUMN: CORE INTERACTIVE CASE CONSOLE (lg:col-span-8) */}
          <section className="lg:col-span-8 space-y-6">
            
            {/* CONSOLE NAVIGATION TABS */}
            <div className="flex bg-[#0D1017] border border-white/5 rounded-2xl p-1.5 shadow-xl">
              <button
                onClick={() => setActiveTab('practices')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 ${
                  activeTab === 'practices'
                    ? 'bg-white text-black shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Scale className="h-4 w-4 shrink-0" />
                Practice Sectors
              </button>
              
              <button
                onClick={() => setActiveTab('estimator')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 ${
                  activeTab === 'estimator'
                    ? 'bg-white text-black shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Calculator className="h-4 w-4 shrink-0" />
                Retainer Estimator
              </button>
              
              <button
                onClick={() => setActiveTab('intake')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 ${
                  activeTab === 'intake'
                    ? 'bg-white text-black shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <FileText className="h-4 w-4 shrink-0" />
                Counsel &amp; Intake
              </button>
            </div>

            {/* TAB VIEWPORT */}
            <div className="rounded-2xl border border-white/5 bg-[#0D1017] p-6 sm:p-8 shadow-2xl">
              
              {/* TAB 1: PRACTICE SECTORS EXPLORER */}
              {activeTab === 'practices' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-white tracking-wide">Expert Practice Spheres</h3>
                    <p className="text-xs text-slate-400 font-light mt-1">
                      Our highly technical expertise ensures bulletproof protection across primary commerce, technology, and litigation sectors.
                    </p>
                  </div>

                  {/* Practice Cards Bento Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {PRACTICE_AREAS.map((practice) => {
                      const isActiveEstimate = selectedPracticeId === practice.id;
                      return (
                        <div 
                          key={practice.id}
                          className={`rounded-xl p-5 border transition-all duration-300 flex flex-col justify-between ${
                            isActiveEstimate 
                              ? 'border-amber-500 bg-amber-500/[0.03] shadow-md' 
                              : 'border-white/5 bg-white/[0.01] hover:bg-white/[0.03]'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <span className="p-2 rounded-lg bg-white/5 shadow-inner border border-white/10">
                                {renderPracticeIcon(practice.iconName)}
                              </span>
                              <span className="font-mono text-[9px] text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/15">
                                Retainer from ${practice.baseRetainer.toLocaleString()}
                              </span>
                            </div>

                            <h4 className="font-serif text-base font-bold text-white mb-2">
                              {practice.name}
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed font-light mb-4">
                              {practice.shortDescription}
                            </p>

                            {/* Bullet Features */}
                            <div className="space-y-1.5 mb-5 border-t border-white/5 pt-3">
                              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Critical Issues Managed:</p>
                              {practice.keyIssues.map((issue, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <Check className="h-3 w-3 text-amber-500 shrink-0" />
                                  <span className="text-[11px] text-slate-300 font-medium">{issue}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 mt-2 pt-2 border-t border-white/5">
                            <button
                              onClick={() => handleSelectPracticeForEstimator(practice.id)}
                              className="flex-1 py-2 px-3 text-center rounded-lg bg-white text-black hover:bg-amber-500 hover:text-black font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5"
                            >
                              <Calculator className="h-3.5 w-3.5" />
                              Calculate Rates
                            </button>
                            <button
                              onClick={() => {
                                setSelectedPracticeId(practice.id);
                                setActiveTab('intake');
                                setIntakeStep(2);
                              }}
                              className="py-2 px-3 rounded-lg border border-white/10 hover:border-white hover:text-white bg-transparent text-slate-300 font-semibold text-xs transition-all duration-300"
                            >
                              Retain Firm
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Deep Sector Analysis Disclosure Card */}
                  <div className="mt-6 rounded-xl border border-white/5 bg-white/[0.02] p-5">
                    <div className="flex gap-3">
                      <div className="mt-1 p-2 rounded-lg bg-white/5 shadow-inner text-amber-500 border border-white/10">
                        {renderPracticeIcon(activePractice.iconName)}
                      </div>
                      <div>
                        <h4 className="font-serif text-base font-bold text-white">
                          {activePractice.name} &mdash; Core Philosophy
                        </h4>
                        <p className="mt-1 text-xs text-slate-400 leading-relaxed font-light">
                          {activePractice.fullDescription}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: INTERACTIVE RETAINER & FEE ESTIMATOR */}
              {activeTab === 'estimator' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-white tracking-wide">Legal Fee &amp; Retainer Estimator</h3>
                    <p className="text-xs text-slate-400 font-light mt-1">
                      Fine-tune case variables to immediately estimate standard retainer thresholds, projected legal hours, and partner rates.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Variable Tweak Controls */}
                    <div className="md:col-span-7 space-y-5">
                      
                      {/* Step 1: Practice Selection */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                          1. Select Area of Counsel
                        </label>
                        <select
                          value={selectedPracticeId}
                          onChange={(e) => {
                            setSelectedPracticeId(e.target.value);
                            setCustomHoursModifier(0); // Reset hour offset
                          }}
                          className="w-full rounded-xl border border-white/10 bg-[#0A0C10] px-3.5 py-2.5 text-xs font-semibold text-white shadow-inner focus:border-amber-500 focus:outline-none"
                        >
                          {PRACTICE_AREAS.map((p) => (
                            <option key={p.id} value={p.id} className="bg-[#0D1017] text-white">
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Step 2: Complexity Variable */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                          2. Expected Complexity Level
                        </label>
                        <div className="grid grid-cols-3 gap-2.5">
                          {(['standard', 'complex', 'high-stakes'] as const).map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setComplexity(type)}
                              className={`py-2.5 px-3 rounded-lg border text-xs font-bold uppercase tracking-widest transition-all ${
                                complexity === type
                                  ? 'bg-white text-black border-white shadow-md'
                                  : 'bg-white/[0.01] border-white/5 text-slate-300 hover:border-white/15 hover:bg-white/[0.04]'
                              }`}
                            >
                              {type.replace('-', ' ')}
                            </button>
                          ))}
                        </div>
                        <p className="text-[10px] text-slate-500 leading-normal font-light">
                          {complexity === 'standard' && '• Standard pleadings, basic asset discovery, and clear-cut liability scenarios.'}
                          {complexity === 'complex' && '• Multi-party liabilities, proprietary technology licensing disputes, or heavy disclosure audits.'}
                          {complexity === 'high-stakes' && '• Existential threat, federal Grand Jury involvement, multi-million dollar class-actions.'}
                        </p>
                      </div>

                      {/* Step 3: Urgency Variable */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                          3. Litigation Urgency / Timeline
                        </label>
                        <div className="grid grid-cols-3 gap-2.5">
                          {(['routine', 'urgent', 'immediate'] as const).map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setUrgency(type)}
                              className={`py-2.5 px-3 rounded-lg border text-xs font-bold uppercase tracking-widest transition-all ${
                                urgency === type
                                  ? 'bg-white text-black border-white shadow-md'
                                  : 'bg-white/[0.01] border-white/5 text-slate-300 hover:border-white/15 hover:bg-white/[0.04]'
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                        <p className="text-[10px] text-slate-500 leading-normal font-light">
                          {urgency === 'routine' && '• Matter response allowed within typical 14-30 day filing horizons.'}
                          {urgency === 'urgent' && '• Active pre-litigation deadlines, critical boardroom events, or immediate TRO risk (+25% base retainer).'}
                          {urgency === 'immediate' && '• Under subpoena, court hearing scheduled within 48-72 hours, or massive IP breach (+50% base retainer).'}
                        </p>
                      </div>

                      {/* Step 4: Lead Attorney Roster assignment */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                            4. Lead Counsel Roster
                          </label>
                          <span className="text-[9px] font-mono text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/15">
                            Partner rate: ${activeAttorney.hourlyRate}/hr
                          </span>
                        </div>
                        <select
                          value={selectedAttorneyId}
                          onChange={(e) => setSelectedAttorneyId(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-[#0A0C10] px-3.5 py-2.5 text-xs font-semibold text-white shadow-inner focus:border-amber-500 focus:outline-none"
                        >
                          {ATTORNEYS.map((a) => (
                            <option key={a.id} value={a.id} className="bg-[#0D1017] text-white">
                              {a.name} ({a.title})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Step 5: Hours Offset Slider */}
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            5. Refine Legal Hours Allocation
                          </label>
                          <span className="text-xs font-mono font-bold text-amber-400">
                            {feeCalculation.hours} hours calculated
                          </span>
                        </div>
                        <input
                          type="range"
                          min={-15}
                          max={30}
                          value={customHoursModifier}
                          onChange={(e) => setCustomHoursModifier(parseInt(e.target.value))}
                          className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500">
                          <span>Reduce Scope (-15 hrs)</span>
                          <span>Baseline Practice Hours</span>
                          <span>Extend Litigation (+30 hrs)</span>
                        </div>
                      </div>

                    </div>

                    {/* Live Dynamic Calculation Billing Sheet */}
                    <div className="md:col-span-5 bg-[#0A0C10] border border-white/5 text-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-3 opacity-5">
                        <Scale className="w-24 h-24 text-amber-500" />
                      </div>

                      <div className="relative z-10">
                        <div className="border-b border-white/5 pb-3 mb-4">
                          <p className="text-[9px] font-mono font-bold tracking-widest text-amber-400 uppercase">Provisional Retainer Sheet</p>
                          <h4 className="font-serif text-sm font-semibold text-white mt-1">Sterling &amp; Thorne LLP</h4>
                        </div>

                        <div className="space-y-3.5 text-xs">
                          {/* Matter Spec Detail */}
                          <div className="bg-white/[0.02] border border-white/5 rounded-lg p-2.5 space-y-1">
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Estimated Case Profile:</p>
                            <p className="text-white text-xs font-bold">{activePractice.name}</p>
                            <p className="text-amber-400 text-[10px] font-mono">
                              Lead Advocate: {activeAttorney.name}
                            </p>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-slate-400">Initial Base Retainer:</span>
                            <span className="font-mono text-white font-medium">
                              ${feeCalculation.baseRetainer.toLocaleString()}
                            </span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-slate-400">Projected Core Hours:</span>
                            <span className="font-mono text-white font-medium">
                              {feeCalculation.hours} hrs
                            </span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-slate-400">Adjusted Partner Rate:</span>
                            <span className="font-mono text-white font-medium">
                              ${feeCalculation.hourlyRate}/hr
                            </span>
                          </div>

                          <div className="flex justify-between border-b border-white/5 pb-2.5">
                            <span className="text-slate-400">Hourly Legal Estimate:</span>
                            <span className="font-mono text-white font-medium">
                              ${feeCalculation.hourlyTotal.toLocaleString()}
                            </span>
                          </div>

                          <div className="flex justify-between pt-2">
                            <span className="text-amber-400 font-serif text-sm font-bold">Expected Retainer:</span>
                            <div className="text-right">
                              <span className="font-mono text-amber-400 text-lg font-bold">
                                ${feeCalculation.totalEstimate.toLocaleString()}
                              </span>
                              <p className="text-[9px] text-slate-500 font-light mt-0.5">Subject to clearance check</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 relative z-10">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab('intake');
                            setIntakeStep(2);
                          }}
                          className="w-full py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold uppercase tracking-[0.15em] shadow-lg transition-all duration-300 flex items-center justify-center gap-1.5"
                        >
                          Submit Case Intake
                          <ArrowRight className="h-4 w-4" />
                        </button>
                        <p className="text-[9px] text-slate-500 text-center mt-2.5 leading-normal">
                          Estimations represent direct baseline parameters, final billing structure is codified in bilateral representation agreements.
                        </p>
                      </div>

                    </div>
                  </div>

                </div>
              )}

              {/* TAB 3: CASE INTAKE & SCHEDULER WIZARD */}
              {activeTab === 'intake' && (
                <div className="space-y-6">
                  
                  {/* Intake Wizard Header */}
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-white tracking-wide">Matter Intake &amp; Counsel Registry</h3>
                      <p className="text-xs text-slate-400 font-light mt-1">
                        Securely lodge conflict parameters and schedule initial case reviews.
                      </p>
                    </div>
                    <span className="font-mono text-[9px] text-slate-400 font-bold bg-white/5 px-2.5 py-1 rounded-md border border-white/5 uppercase tracking-widest">
                      Secure Connection Active
                    </span>
                  </div>

                  {!intakeSubmitted ? (
                    <form onSubmit={handleIntakeSubmit} className="space-y-6">
                      
                      {/* Interactive Progress Bar */}
                      <div className="flex items-center gap-2">
                        {[1, 2, 3].map((step) => (
                          <React.Fragment key={step}>
                            <button
                              type="button"
                              onClick={() => setIntakeStep(step)}
                              className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                intakeStep >= step 
                                  ? 'bg-amber-500 text-black shadow-md' 
                                  : 'bg-white/5 text-slate-500 border border-white/5'
                              }`}
                            >
                              {step}
                            </button>
                            {step < 3 && (
                              <div className={`h-0.5 flex-1 transition-all ${
                                intakeStep > step ? 'bg-amber-500' : 'bg-white/5'
                              }`} />
                            )}
                          </React.Fragment>
                        ))}
                      </div>

                      {/* STEP 1: CLIENT ENTITY INFORMATION */}
                      {intakeStep === 1 && (
                        <div className="space-y-4 animate-fadeIn">
                          <h4 className="font-serif text-base font-bold text-white">1. Client Entity Credentials</h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                Full Name of Inquirer <span className="text-amber-500">*</span>
                              </label>
                              <input
                                type="text"
                                required
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                placeholder="Eleanor Vance"
                                className="w-full rounded-lg border border-white/10 bg-[#0A0C10] px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                Associated Enterprise / Company
                              </label>
                              <input
                                type="text"
                                value={clientCompany}
                                onChange={(e) => setClientCompany(e.target.value)}
                                placeholder="Vanguard Technologies Inc."
                                className="w-full rounded-lg border border-white/10 bg-[#0A0C10] px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                Secure Email Address <span className="text-amber-500">*</span>
                              </label>
                              <input
                                type="email"
                                required
                                value={clientEmail}
                                onChange={(e) => setClientEmail(e.target.value)}
                                placeholder="eleanor@vanguard.com"
                                className="w-full rounded-lg border border-white/10 bg-[#0A0C10] px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                Secure Direct Phone Line <span className="text-amber-500">*</span>
                              </label>
                              <input
                                type="tel"
                                required
                                value={clientPhone}
                                onChange={(e) => setClientPhone(e.target.value)}
                                placeholder="+1 (415) 555-0199"
                                className="w-full rounded-lg border border-white/10 bg-[#0A0C10] px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end pt-2">
                            <button
                              type="button"
                              onClick={() => setIntakeStep(2)}
                              className="px-5 py-2.5 rounded-lg bg-white text-black font-bold uppercase tracking-wider text-xs flex items-center gap-1 hover:bg-amber-500 transition-all"
                            >
                              Next: Matter Details
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* STEP 2: LEGAL MATTER & MANDATORY CONFLICT CHECK */}
                      {intakeStep === 2 && (
                        <div className="space-y-4 animate-fadeIn">
                          <h4 className="font-serif text-base font-bold text-white">2. Legal Matter &amp; Conflict Checks</h4>
                          
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                              Conflict Check: Opposing Parties / Entities <span className="text-amber-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={opposingParty}
                              onChange={(e) => setOpposingParty(e.target.value)}
                              placeholder="Name of opposing individual, brand, or corporate competitors"
                              className="w-full rounded-lg border border-white/10 bg-[#0A0C10] px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                            />
                            <p className="text-[10px] text-slate-500 font-light leading-normal">
                              We run mandatory system clearance matches prior to taking any consult. Entering firm partner names will trigger alert flags.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                                Counsel Target Area
                              </label>
                              <select
                                value={selectedPracticeId}
                                onChange={(e) => setSelectedPracticeId(e.target.value)}
                                className="w-full rounded-lg border border-white/10 bg-[#0A0C10] px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                              >
                                {PRACTICE_AREAS.map((p) => (
                                  <option key={p.id} value={p.id} className="bg-[#0D1017] text-white">{p.name}</option>
                                ))}
                              </select>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                                Lead Advocate Requested
                              </label>
                              <select
                                value={selectedAttorneyId}
                                onChange={(e) => setSelectedAttorneyId(e.target.value)}
                                className="w-full rounded-lg border border-white/10 bg-[#0A0C10] px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                              >
                                {ATTORNEYS.map((a) => (
                                  <option key={a.id} value={a.id} className="bg-[#0D1017] text-white">{a.name}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                              Concise Matter Summary <span className="text-amber-500">*</span>
                            </label>
                            <textarea
                              rows={3}
                              required
                              value={briefSummary}
                              onChange={(e) => setBriefSummary(e.target.value)}
                              placeholder="Briefly state facts, litigation risk, or asset preservation guidelines"
                              className="w-full rounded-lg border border-white/10 bg-[#0A0C10] px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                            />
                          </div>

                          <div className="flex justify-between pt-2">
                            <button
                              type="button"
                              onClick={() => setIntakeStep(1)}
                              className="px-5 py-2.5 rounded-lg border border-white/10 text-slate-400 font-bold uppercase tracking-wider text-xs hover:border-white hover:text-white"
                            >
                              Back
                            </button>
                            <button
                              type="button"
                              onClick={() => setIntakeStep(3)}
                              className="px-5 py-2.5 rounded-lg bg-white text-black font-bold uppercase tracking-wider text-xs flex items-center gap-1 hover:bg-amber-500 transition-all"
                            >
                              Next: Scheduling
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* STEP 3: CONSULTATION SCHEDULER */}
                      {intakeStep === 3 && (
                        <div className="space-y-4 animate-fadeIn">
                          <h4 className="font-serif text-base font-bold text-white">3. Initial Consultation Schedule</h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                                Target Date
                              </label>
                              <input
                                type="date"
                                value={preferredDate}
                                onChange={(e) => setPreferredDate(e.target.value)}
                                className="w-full rounded-lg border border-white/10 bg-[#0A0C10] px-3 py-2 text-xs font-mono text-white focus:border-amber-500 focus:outline-none"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                                Consultation Time
                              </label>
                              <select
                                value={preferredTime}
                                onChange={(e) => setPreferredTime(e.target.value)}
                                className="w-full rounded-lg border border-white/10 bg-[#0A0C10] px-3 py-2 text-xs font-mono text-white focus:border-amber-500 focus:outline-none"
                              >
                                <option value="09:00" className="bg-[#0D1017]">09:00 AM (EST)</option>
                                <option value="10:00" className="bg-[#0D1017]">10:00 AM (EST)</option>
                                <option value="11:00" className="bg-[#0D1017]">11:00 AM (EST)</option>
                                <option value="13:00" className="bg-[#0D1017]">01:00 PM (EST)</option>
                                <option value="14:00" className="bg-[#0D1017]">02:00 PM (EST)</option>
                                <option value="15:00" className="bg-[#0D1017]">03:00 PM (EST)</option>
                                <option value="16:00" className="bg-[#0D1017]">04:00 PM (EST)</option>
                              </select>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                                Secure Modality
                              </label>
                              <div className="grid grid-cols-3 gap-1">
                                {(['video', 'phone', 'in-person'] as const).map((type) => (
                                  <button
                                    key={type}
                                    type="button"
                                    onClick={() => setConsultType(type)}
                                    className={`py-2 text-[10px] font-bold uppercase rounded-lg border transition-all duration-300 ${
                                      consultType === type
                                        ? 'bg-amber-500 border-amber-500 text-black'
                                        : 'bg-[#0A0C10] border-white/10 text-slate-400 hover:border-white/20'
                                    }`}
                                  >
                                    {type}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Advisory Legal Disclaimer Box */}
                          <div className="rounded-lg bg-white/[0.02] border border-white/5 p-3 flex items-start gap-2.5">
                            <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-slate-400 leading-relaxed font-light">
                              <span className="font-bold text-white uppercase tracking-wider text-[9px]">Pre-Representation Disclosure:</span>{' '}
                              Submission of information does not create an attorney-client relationship. Confidential details should be shared only following formal execution of a Bilateral Legal Services Agreement.
                            </p>
                          </div>

                          <div className="flex justify-between pt-2">
                            <button
                              type="button"
                              onClick={() => setIntakeStep(2)}
                              className="px-5 py-2.5 rounded-lg border border-white/10 text-slate-400 font-bold uppercase tracking-wider text-xs hover:border-white hover:text-white"
                            >
                              Back
                            </button>
                            <button
                              type="submit"
                              className="px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md"
                            >
                              File Intake Docket
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}

                    </form>
                  ) : (
                    /* DOCKET RECEIPT SCREEN */
                    <div className="space-y-6 animate-fadeIn">
                      
                      <div className="rounded-xl bg-amber-500/[0.03] border border-amber-500/20 p-5 text-center">
                        <CheckCircle className="h-10 w-10 text-amber-500 mx-auto mb-2.5" />
                        <h4 className="font-serif text-lg font-bold text-white">Case Intake Registered</h4>
                        <p className="text-xs text-slate-400 mt-1 font-light">
                          Our automated internal conflict search and partner reviews are underway.
                        </p>
                      </div>

                      {/* Official Docket Layout */}
                      <div className="rounded-xl border border-white/5 bg-[#0A0C10] overflow-hidden shadow-2xl">
                        {/* Header bar */}
                        <div className="bg-white text-black px-4 py-3 flex items-center justify-between">
                          <span className="font-serif text-xs font-bold tracking-widest uppercase">
                            Matter Registration Receipt
                          </span>
                          <span className="font-mono text-xs text-amber-600 font-bold">
                            Docket: {intakeSubmitted.docketNumber}
                          </span>
                        </div>

                        {/* Content details */}
                        <div className="p-5 space-y-4 text-xs">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-white/5 pb-3">
                            <div>
                              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Client Inquirer</p>
                              <p className="font-bold text-white mt-0.5">{intakeSubmitted.clientName}</p>
                              {intakeSubmitted.clientCompany && (
                                <p className="text-slate-400 font-light text-[11px]">{intakeSubmitted.clientCompany}</p>
                              )}
                            </div>
                            <div>
                              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Assigned Counsel Area</p>
                              <p className="font-bold text-white mt-0.5">{intakeSubmitted.practiceArea}</p>
                              <p className="text-amber-500 text-[11px] font-semibold">{intakeSubmitted.assignedAttorney}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-white/5 pb-3">
                            <div>
                              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Consultation Appt.</p>
                              <p className="font-bold text-white mt-0.5">
                                {intakeSubmitted.preferredDate} &bull; {intakeSubmitted.preferredTime} EST
                              </p>
                              <p className="text-slate-400 font-light text-[11px] capitalize">Mode: Secure {intakeSubmitted.consultType}</p>
                            </div>
                            <div>
                              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">System Conflict Search</p>
                              <p className="font-mono text-[11px] font-bold mt-0.5 text-amber-500">
                                {intakeSubmitted.conflictStatus}
                              </p>
                            </div>
                          </div>

                          <div>
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Matter Facts Logged</p>
                            <p className="text-slate-300 leading-relaxed font-light mt-1 italic bg-white/[0.01] p-3 rounded-lg border border-white/5">
                              "{intakeSubmitted.briefSummary}"
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={handleResetIntake}
                          className="px-5 py-2.5 rounded-lg border border-white/10 text-slate-300 font-bold uppercase tracking-wider text-xs hover:border-white hover:text-white transition-all duration-300"
                        >
                          Register Another Matter
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab('practices');
                            setIntakeSubmitted(null);
                          }}
                          className="px-5 py-2.5 rounded-lg bg-white text-black font-bold uppercase tracking-wider text-xs hover:bg-amber-500 transition-all duration-300"
                        >
                          Return to Practice Library
                        </button>
                      </div>

                    </div>
                  )}

                </div>
              )}

            </div>

            {/* EXPEDITED ACTION PANEL (No navigation sidebar, fits in a single screen structure beautifully) */}
            <div className="rounded-2xl border border-white/5 bg-[#0D1017] p-5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-white tracking-wide">Immediate Legal Assistance?</h4>
                  <p className="text-xs text-slate-400 font-light mt-0.5">
                    Secured call services are open 24/7/365 for criminal defense or board crisis events.
                  </p>
                </div>
              </div>
              <div className="flex gap-2.5 shrink-0 w-full md:w-auto">
                <a 
                  href="tel:1800STJURIS" 
                  className="flex-1 md:flex-initial py-2.5 px-4 rounded-xl text-center bg-white hover:bg-amber-500 text-black font-bold uppercase tracking-widest text-[11px] transition-all duration-300"
                >
                  Call Secure Hotline
                </a>
                <button 
                  onClick={() => {
                    setActiveTab('intake');
                    setIntakeStep(1);
                  }}
                  className="flex-1 md:flex-initial py-2.5 px-4 rounded-xl border border-white/10 hover:border-white text-slate-300 hover:text-white font-bold uppercase tracking-widest text-[11px] transition-all duration-300"
                >
                  Request Consultation
                </button>
              </div>
            </div>

          </section>

        </div>
      </main>

      {/* FOOTER BAR */}
      <footer className="mt-16 bg-[#06080B] text-slate-500 border-t border-white/5 py-12 text-xs">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="font-serif text-white font-semibold tracking-widest">STERLING &amp; THORNE LLP</p>
              <p className="text-[10px] text-slate-600 mt-1">&copy; 2026 Sterling &amp; Thorne LLP. All rights reserved globally.</p>
            </div>
            <div className="flex items-center gap-6 font-bold uppercase tracking-widest text-[10px]">
              <a href="#disclaimer" className="hover:text-amber-500 transition-colors">Legal Disclosures</a>
              <a href="#privacy" className="hover:text-amber-500 transition-colors">Privacy Charter</a>
              <a href="#terms" className="hover:text-amber-500 transition-colors">Terms of Practice</a>
            </div>
          </div>
          <div className="border-t border-white/5 pt-5 text-[10px] text-slate-600 leading-relaxed font-light">
            ATTORNEY ADVERTISING. Prior results do not guarantee a similar outcome. The content on this web application is intended for informational purposes only and is not, nor should it be interpreted as, formal legal advice or the formation of an attorney-client relationship. Sterling &amp; Thorne LLP represents clients in federal, state, and global jurisdictions through affiliated partner operations.
          </div>
        </div>
      </footer>

    </div>
  );
}
