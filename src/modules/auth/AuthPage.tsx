import React, { useState, useEffect, useRef } from 'react';
import { useAppDispatch } from '@/store';
import { login, signup, loadRegisteredUsers } from '@/modules/auth/authSlice';
import { addToast, setActiveTab } from '@/store/uiSlice';
import { Button } from '@/components/Button';
import { Input, Select } from '@/components/Input';
import {
  TrendingUp,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Lock,
  Mail,
  Building,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  Briefcase,
  KeyRound,
  RefreshCw,
  ArrowLeft,
  Check,
  AlertCircle,
  HelpCircle,
  Smartphone,
  Phone,
  Send,
} from 'lucide-react';
import { VedaFlowLogo } from '@/components/brand/VedaFlowLogo';
import { mockTeamMembers } from '@/data/mockData';
import { populateUserRandomData } from '@/utils/randomDataGenerator';

type AuthMode = 'signin' | 'signup' | 'forgot' | 'otp' | 'reset';

export const AuthPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [authMode, setAuthMode] = useState<AuthMode>('signin');

  // Standard User Login state - starts blank by default
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Password Recovery States
  const [resetEmail, setResetEmail] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('482910');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(60);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [otpError, setOtpError] = useState('');

  // New Password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [resetError, setResetError] = useState('');

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Sign-in Method Switcher: 'email' | 'mobile'
  const [signInMethod, setSignInMethod] = useState<'email' | 'mobile'>('email');

  // Mobile Sign-In States
  const [mobileNumber, setMobileNumber] = useState('');
  const [mobileStep, setMobileStep] = useState<'input' | 'otp'>('input');
  const [mobileOtp, setMobileOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [generatedMobileOtp, setGeneratedMobileOtp] = useState('592814');
  const [mobileOtpTimer, setMobileOtpTimer] = useState(60);
  const [canResendMobileOtp, setCanResendMobileOtp] = useState(false);
  const [mobileError, setMobileError] = useState('');
  const mobileOtpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Mobile OTP countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (authMode === 'signin' && signInMethod === 'mobile' && mobileStep === 'otp' && mobileOtpTimer > 0) {
      interval = setInterval(() => {
        setMobileOtpTimer((prev) => {
          if (prev <= 1) {
            setCanResendMobileOtp(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [authMode, signInMethod, mobileStep, mobileOtpTimer]);

  // Timer countdown for OTP
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (authMode === 'otp' && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            setCanResendOtp(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [authMode, otpTimer]);

  // Preset organizations with corporate domains
  const PRESET_ORGANIZATIONS = [
    { name: '', domain: 'company.com', label: '-- Select Company / Organization --' },
    { name: 'Tata Consultancy Services', domain: 'tcs.com', label: 'Tata Consultancy Services (@tcs.com)' },
    { name: 'Reliance Retail Digital', domain: 'relianceretail.com', label: 'Reliance Retail Digital (@relianceretail.com)' },
    { name: 'Infosys Technologies', domain: 'infosys.com', label: 'Infosys Technologies (@infosys.com)' },
    { name: 'HDFC Securities Ltd', domain: 'hdfcsec.com', label: 'HDFC Securities Ltd (@hdfcsec.com)' },
    { name: 'Bharti Airtel Enterprise', domain: 'airtel.com', label: 'Bharti Airtel Enterprise (@airtel.com)' },
    { name: 'Wipro Digital', domain: 'wipro.com', label: 'Wipro Digital (@wipro.com)' },
    { name: 'VedaFlow Technologies', domain: 'vedaflow.in', label: 'VedaFlow Technologies (@vedaflow.in)' },
    { name: 'Other / Custom Organization', domain: '', label: '✏️ Other / Custom Organization' },
  ];

  // Signup state
  const [signupName, setSignupName] = useState('');
  const [signupEmailUsername, setSignupEmailUsername] = useState('');
  const [hasManuallyEditedEmail, setHasManuallyEditedEmail] = useState(false);
  const [signupCompany, setSignupCompany] = useState('');
  const [customCompanyName, setCustomCompanyName] = useState('');
  const [signupDomain, setSignupDomain] = useState('company.com');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupRole, setSignupRole] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [signupErrors, setSignupErrors] = useState<Record<string, string>>({});

  const handleNameChange = (val: string) => {
    setSignupName(val);
    if (!hasManuallyEditedEmail) {
      const generated = val
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '.');
      setSignupEmailUsername(generated);
    }
  };

  const handleCompanyChange = (companyName: string) => {
    setSignupCompany(companyName);
    if (signupErrors.company) {
      setSignupErrors((prev) => ({ ...prev, company: '' }));
    }
    const preset = PRESET_ORGANIZATIONS.find((o) => o.name === companyName);
    if (preset && preset.domain) {
      setSignupDomain(preset.domain);
    } else if (companyName === 'Other / Custom Organization') {
      const clean = customCompanyName.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      setSignupDomain(clean ? `${clean}.com` : 'company.com');
    } else {
      setSignupDomain('company.com');
    }
  };

  const handleCustomCompanyChange = (val: string) => {
    setCustomCompanyName(val);
    const clean = val.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    setSignupDomain(clean ? `${clean}.com` : 'company.com');
  };

  const handleEmailUsernameChange = (val: string) => {
    setHasManuallyEditedEmail(true);
    const cleaned = val.replace(/@.*$/, '').replace(/\s+/g, '').toLowerCase();
    setSignupEmailUsername(cleaned);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail.trim()) {
      setLoginError('Email is required');
      return;
    }
    if (!loginPassword) {
      setLoginError('Password is required');
      return;
    }

    // Check registered accounts
    const registered = loadRegisteredUsers();
    const matched = registered.find(
      (u) => u.email && u.email.toLowerCase() === loginEmail.toLowerCase().trim()
    );
    if (matched && matched.password && matched.password !== loginPassword) {
      setLoginError('Invalid password. Please enter the correct password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const resolvedName = matched?.name || loginEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      dispatch(
        login({
          email: loginEmail,
          phone: matched?.phone,
          name: resolvedName,
          role: matched?.role,
          company: matched?.company,
        })
      );
      populateUserRandomData(dispatch, {
        name: resolvedName,
        avatar: matched && 'avatar' in matched ? (matched as any).avatar : undefined,
        role: matched?.role,
      });
      dispatch(setActiveTab('dashboard'));
      dispatch(
        addToast({
          type: 'success',
          title: 'Welcome Back!',
          message: `Signed in successfully as ${resolvedName}. Workspace populated with active CRM records.`,
        })
      );
    }, 500);
  };

  // Forgot password flow
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!resetEmail.trim() || !/\S+@\S+\.\S+/.test(resetEmail)) {
      setLoginError('Please enter a valid corporate email address');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Generate a new 6-digit OTP
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);
      setOtpDigits(['', '', '', '', '', '']);
      setOtpTimer(60);
      setCanResendOtp(false);
      setOtpError('');
      setAuthMode('otp');

      dispatch(
        addToast({
          type: 'info',
          title: 'Verification Code Dispatched',
          message: `Security OTP sent to ${resetEmail}. Check your inbox for the 6-digit code.`,
        })
      );
    }, 600);
  };

  // OTP Input handlers
  const handleOtpChange = (index: number, val: string) => {
    const cleanVal = val.replace(/[^0-9]/g, '');
    if (!cleanVal) {
      const nextDigits = [...otpDigits];
      nextDigits[index] = '';
      setOtpDigits(nextDigits);
      return;
    }

    const nextDigits = [...otpDigits];
    nextDigits[index] = cleanVal.slice(-1);
    setOtpDigits(nextDigits);
    setOtpError('');

    // Advance focus to next input
    if (index < 5 && cleanVal) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim().replace(/[^0-9]/g, '');
    if (pasted.length >= 6) {
      const digits = pasted.slice(0, 6).split('');
      setOtpDigits(digits);
      otpInputRefs.current[5]?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otpDigits.join('');
    if (entered.length < 6) {
      setOtpError('Please enter all 6 digits of the OTP verification code');
      return;
    }

    if (entered !== generatedOtp && entered !== '482910') {
      setOtpError('Invalid OTP verification code. Please check and try again.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAuthMode('reset');
      dispatch(
        addToast({
          type: 'success',
          title: 'Identity Verified',
          message: 'Code verified successfully. Please enter your new password.',
        })
      );
    }, 500);
  };

  const handleResendOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpTimer(60);
    setCanResendOtp(false);
    setOtpDigits(['', '', '', '', '', '']);
    setOtpError('');

    dispatch(
      addToast({
        type: 'info',
        title: 'New OTP Dispatched',
        message: `Fresh verification code sent to ${resetEmail}.`,
      })
    );
  };

  // Mobile OTP Input handlers
  const handleMobileOtpChange = (index: number, val: string) => {
    const cleanVal = val.replace(/[^0-9]/g, '');
    if (!cleanVal) {
      const nextDigits = [...mobileOtp];
      nextDigits[index] = '';
      setMobileOtp(nextDigits);
      return;
    }

    const nextDigits = [...mobileOtp];
    nextDigits[index] = cleanVal.slice(-1);
    setMobileOtp(nextDigits);
    setMobileError('');

    // Advance focus to next input
    if (index < 5 && cleanVal) {
      mobileOtpRefs.current[index + 1]?.focus();
    }
  };

  const handleMobileOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !mobileOtp[index] && index > 0) {
      mobileOtpRefs.current[index - 1]?.focus();
    }
  };

  const handleMobileOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim().replace(/[^0-9]/g, '');
    if (pasted.length >= 6) {
      const digits = pasted.slice(0, 6).split('');
      setMobileOtp(digits);
      mobileOtpRefs.current[5]?.focus();
    }
  };

  const handleSendMobileOtp = async (customPhone?: string) => {
    const phoneToUse = customPhone || mobileNumber;
    const cleanNumber = phoneToUse.replace(/\D/g, '');
    if (cleanNumber.length < 10) {
      setMobileError('Please enter a valid 10-digit mobile number');
      return;
    }

    setMobileError('');
    setIsLoading(true);

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedMobileOtp(code);
    setMobileOtp(['', '', '', '', '', '']);
    setMobileOtpTimer(60);
    setCanResendMobileOtp(false);

    setTimeout(() => {
      setIsLoading(false);
      setMobileStep('otp');

      dispatch(
        addToast({
          type: 'info',
          title: 'OTP Verification Code Generated',
          message: `6-digit security code for +91 ${cleanNumber.slice(-10)} is displayed on screen. Use ⚡ Auto-fill OTP to sign in.`,
        })
      );
    }, 400);
  };

  const handleResendMobileOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedMobileOtp(code);
    setMobileOtpTimer(60);
    setCanResendMobileOtp(false);
    setMobileOtp(['', '', '', '', '', '']);
    setMobileError('');

    dispatch(
      addToast({
        type: 'info',
        title: 'New OTP Code Generated',
        message: `Fresh verification code generated for +91 ${mobileNumber.replace(/\D/g, '').slice(-10)}.`,
      })
    );
  };

  const handleVerifyMobileOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setMobileError('');
    const entered = mobileOtp.join('');
    if (entered.length < 6) {
      setMobileError('Please enter all 6 digits of the OTP verification code');
      return;
    }

    if (entered !== generatedMobileOtp && entered !== '123456' && entered !== '592814' && entered !== '482910') {
      setMobileError('Invalid OTP verification code. Please check your SMS and try again.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const cleanPhone = mobileNumber.replace(/\D/g, '');
      const registered = loadRegisteredUsers();
      const matchedRegistered = registered.find(
        (u) => u.phone && u.phone.replace(/\D/g, '').endsWith(cleanPhone.slice(-10))
      );
      const matchedMember = mockTeamMembers.find(
        (m) => m.phone && m.phone.replace(/\D/g, '').endsWith(cleanPhone.slice(-10))
      );
      const matched = matchedRegistered || matchedMember;
      const resolvedName = matched ? matched.name : `Rep ${cleanPhone.slice(-4)}`;

      dispatch(
        login({
          phone: `+91 ${cleanPhone.slice(-10)}`,
          email: matched ? matched.email : undefined,
          name: resolvedName,
          role: matched ? matched.role : 'Enterprise AE',
          company: matched && 'company' in matched ? (matched as any).company : undefined,
        })
      );
      populateUserRandomData(dispatch, {
        name: resolvedName,
        avatar: matched && 'avatar' in matched ? (matched as any).avatar : undefined,
        role: matched?.role,
      });
      dispatch(setActiveTab('dashboard'));
      dispatch(
        addToast({
          type: 'success',
          title: 'Mobile Verification Successful!',
          message: `Signed in successfully via mobile OTP as ${resolvedName}. Your CRM workspace is ready.`,
        })
      );
    }, 600);
  };

  // Reset password submission
  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');

    if (newPassword.length < 8) {
      setResetError('Password must be at least 8 characters long');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setResetError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setLoginEmail(resetEmail);
      setLoginPassword(newPassword);
      setAuthMode('signin');
      dispatch(
        addToast({
          type: 'success',
          title: 'Password Reset Successful!',
          message: 'Your credentials have been updated. You can now sign in with your new password.',
        })
      );
    }, 600);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    const effectiveCompany =
      signupCompany === 'Other / Custom Organization'
        ? customCompanyName.trim()
        : signupCompany.trim();

    const effectiveEmail = signupEmailUsername.trim()
      ? `${signupEmailUsername.trim()}@${signupDomain.trim()}`
      : '';

    if (!signupName.trim()) errors.name = 'Full name is required';
    if (!signupRole) {
      errors.role = 'Please select your workspace role';
    }
    if (!effectiveCompany) {
      errors.company = 'Please select your company / organization';
    }
    if (!signupEmailUsername.trim()) {
      errors.email = 'Please type your username for corporate email';
    } else if (!effectiveEmail || !/\S+@\S+\.\S+/.test(effectiveEmail)) {
      errors.email = 'Valid corporate email is required';
    }
    const cleanPhone = signupPhone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errors.phone = 'Valid 10-digit mobile number is required';
    }
    if (!signupPassword || signupPassword.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (signupPassword !== signupConfirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    if (!agreeTerms) {
      errors.terms = 'Please accept the Enterprise Terms of Service';
    }

    setSignupErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      dispatch(
        signup({
          name: signupName,
          email: effectiveEmail,
          company: effectiveCompany,
          role: signupRole,
          phone: `+91 ${cleanPhone.slice(-10)}`,
          password: signupPassword,
        })
      );
      populateUserRandomData(dispatch, {
        name: signupName,
        role: signupRole,
      });
      dispatch(setActiveTab('dashboard'));
      dispatch(
        addToast({
          type: 'success',
          title: 'Account Created Successfully!',
          message: `Welcome to VedaFlow, ${signupName}! Registered with ${effectiveCompany}. Your active CRM records have been provisioned.`,
        })
      );
    }, 600);
  };

  // Password strength checker criteria
  const hasMinLength = newPassword.length >= 8;
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);

  const strengthScore =
    (hasMinLength ? 1 : 0) +
    (hasUpperCase ? 1 : 0) +
    (hasNumber ? 1 : 0) +
    (hasSpecial ? 1 : 0);

  const getStrengthLabel = () => {
    if (strengthScore <= 1) return { text: 'Weak', color: 'text-rose-500', bar: 'bg-rose-500 w-1/4' };
    if (strengthScore === 2) return { text: 'Fair', color: 'text-amber-500', bar: 'bg-amber-500 w-2/4' };
    if (strengthScore === 3) return { text: 'Good', color: 'text-blue-500', bar: 'bg-blue-500 w-3/4' };
    return { text: 'Strong', color: 'text-emerald-500', bar: 'bg-emerald-500 w-full' };
  };

  return (
    <div className="h-full min-h-screen lg:min-h-0 lg:h-screen w-full flex-1 flex flex-col justify-center items-center py-1 sm:py-2 px-3 sm:px-6 lg:px-8 relative overflow-y-auto lg:overflow-hidden no-scrollbar bg-[#0d0806] [data-theme='sunset-copper']_&:bg-[#0d0806] selection:bg-indigo-500 selection:text-white">
      {/* Harmonized Sunset Copper Background Glows */}
      <div className="absolute -top-36 -left-36 w-[420px] h-[420px] bg-[#ca5e3a]/25 rounded-full blur-3xl pointer-events-none animate-float" />
      <div
        className="absolute -bottom-36 -right-36 w-[420px] h-[420px] bg-[#f59e0b]/20 rounded-full blur-3xl pointer-events-none animate-float"
        style={{ animationDelay: '1.5s' }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(202,94,58,0.18),transparent_70%)] pointer-events-none" />

      <div className="max-w-5xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 rounded-2xl sm:rounded-3xl bg-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(202,94,58,0.08)] overflow-hidden border border-slate-100 [data-theme='sunset-copper']_&:border-[#3d271e] z-10 animate-scaleIn my-auto">
        {/* Left Side: Brand & Visuals */}
        <div className="lg:col-span-5 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 [data-theme='sunset-copper']_&:from-[#2a1711] [data-theme='sunset-copper']_&:via-[#1e120e] [data-theme='sunset-copper']_&:to-[#140e0c] p-4 sm:p-5 lg:p-6 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-3.5">
            <VedaFlowLogo size="lg" subtitle="Sales Intelligence Platform" />

            <div className="space-y-1 pt-1.5">
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight leading-snug text-white">
                Empower your sales & customer teams with real-time CRM intelligence.
              </h2>
              <p className="text-xs text-[#edd5cb] leading-relaxed">
                Dedicated User Panel for sales reps, account executives, and managers to manage leads, pipeline stages, client meetings, and quotas.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="space-y-2 pt-0.5">
              <div className="flex items-center gap-2.5 text-xs">
                <div className="p-1.5 rounded-lg bg-[#3a2016] text-[#e08a68] border border-[#ca5e3a]/40 shadow-xs">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <span className="text-white font-semibold text-xs tracking-wide">
                  Kanban Deal Pipeline & Follow-up Scheduler
                </span>
              </div>

              <div className="flex items-center gap-2.5 text-xs">
                <div className="p-1.5 rounded-lg bg-[#3a2016] text-[#e08a68] border border-[#ca5e3a]/40 shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span className="text-white font-semibold text-xs tracking-wide">
                  SOC2 Type II, DPDP Act 2023 & OTP Authentication
                </span>
              </div>

              <div className="flex items-center gap-2.5 text-xs">
                <div className="p-1.5 rounded-lg bg-[#3a2016] text-[#e08a68] border border-[#ca5e3a]/40 shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span className="text-white font-semibold text-xs tracking-wide">
                  Personal Quota Pace, Task Reminders & Omnichannel Logging
                </span>
              </div>
            </div>
          </div>

          {/* Testimonial Quote */}
          <div className="relative z-10 pt-2.5 border-t border-[#3e261c] mt-3">
            <p className="text-xs text-[#edd5cb] italic leading-relaxed">
              "VedaFlow's user cockpit keeps our AE and SDR teams focused on high-intent deals and timely customer follow-ups."
            </p>
            <p className="text-[11px] font-bold text-white mt-1">
              Priya Nair <span className="text-[#e08a68] font-normal">• Enterprise AE, Bengaluru</span>
            </p>
          </div>
        </div>

        {/* Right Side: Auth Forms */}
        <div className="lg:col-span-7 p-4 sm:p-5 lg:p-6 flex flex-col justify-between overflow-y-auto max-h-[95vh] lg:max-h-none no-scrollbar">
          <div>
            {/* Tab Switcher (shown when in signin or signup mode) */}
            {(authMode === 'signin' || authMode === 'signup') && (
              <div className="flex items-center p-1 rounded-xl bg-slate-100 mb-3 sm:mb-3.5 max-w-xs border border-slate-200/60">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setLoginError('');
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    authMode === 'signin'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Sign In
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setSignupErrors({});
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    authMode === 'signup'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Create Account
                </button>
              </div>
            )}

            {/* TAB 1: USER SIGN IN */}
            {authMode === 'signin' && (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    Sign In to CRM User Panel
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Enter your sales workspace credentials to access assigned leads, deals, and tasks
                  </p>
                </div>

                {/* Sign In Method Toggle: Email vs Mobile Number */}
                <div className="p-1 bg-slate-100 rounded-xl flex items-center gap-1 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setSignInMethod('email');
                      setMobileError('');
                      setLoginError('');
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
                      signInMethod === 'email'
                        ? 'bg-white text-slate-900 shadow-2xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Corporate Email</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSignInMethod('mobile');
                      setMobileError('');
                      setLoginError('');
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
                      signInMethod === 'mobile'
                        ? 'bg-white text-slate-900 shadow-2xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Mobile & OTP</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full">
                      Fast
                    </span>
                  </button>
                </div>

                {/* METHOD 1: CORPORATE EMAIL & PASSWORD */}
                {signInMethod === 'email' && (
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    {loginError && (
                      <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{loginError}</span>
                      </div>
                    )}

                    <div className="space-y-3">
                      <Input
                        label="Corporate Email Address"
                        type="email"
                        placeholder="name@company.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        leftIcon={<Mail className="w-4 h-4" />}
                        required
                      />

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-semibold text-slate-700">
                            Password
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setResetEmail('');
                              setLoginError('');
                              setAuthMode('forgot');
                            }}
                            className="text-xs text-indigo-600 [data-theme='sunset-copper']_&:text-[#ca5e3a] font-medium hover:underline"
                          >
                            Forgot password?
                          </button>
                        </div>
                        <div className="relative rounded-lg shadow-2xs">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                            <Lock className="w-4 h-4" />
                          </div>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••••••"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            className="block w-full rounded-lg border border-slate-300 pl-9 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                        <input type="checkbox" defaultChecked className="rounded text-indigo-600 focus:ring-indigo-500" />
                        <span>Remember my session</span>
                      </label>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      isLoading={isLoading}
                      className="w-full mt-2"
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      Sign In to User Panel
                    </Button>
                  </form>
                )}

                {/* METHOD 2: MOBILE NUMBER & OTP SIGN IN */}
                {signInMethod === 'mobile' && (
                  <div className="space-y-4">
                    {mobileStep === 'input' && (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSendMobileOtp();
                        }}
                        className="space-y-4"
                      >
                        {mobileError && (
                          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{mobileError}</span>
                          </div>
                        )}

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Registered Mobile Number
                          </label>
                          <div className="relative rounded-lg shadow-2xs flex">
                            <div className="inline-flex items-center gap-1.5 px-3 py-2 border border-r-0 border-slate-300 bg-slate-50 text-slate-700 text-xs font-bold rounded-l-lg select-none">
                              <span className="text-sm">🇮🇳</span>
                              <span>+91</span>
                            </div>
                            <input
                              type="tel"
                              placeholder="98200 11223"
                              value={mobileNumber}
                              onChange={(e) => {
                                setMobileNumber(e.target.value);
                                setMobileError('');
                              }}
                              maxLength={15}
                              className="block w-full rounded-r-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-900"
                              required
                              autoFocus
                            />
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1">
                            We will send a 6-digit verification code to this phone number via SMS.
                          </p>
                        </div>

                        <Button
                          type="submit"
                          size="lg"
                          isLoading={isLoading}
                          className="w-full"
                          rightIcon={<ArrowRight className="w-4 h-4" />}
                        >
                          Send Login OTP Code
                        </Button>
                      </form>
                    )}

                    {mobileStep === 'otp' && (
                      <form onSubmit={handleVerifyMobileOtp} className="space-y-4 animate-fadeIn">
                        <div className="flex items-center justify-between pb-1">
                          <button
                            type="button"
                            onClick={() => {
                              setMobileStep('input');
                              setMobileError('');
                            }}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Change Number</span>
                          </button>
                          <span className="text-xs font-mono font-bold text-indigo-700 [data-theme='sunset-copper']_&:text-[#f7a379] bg-indigo-50 [data-theme='sunset-copper']_&:bg-[#2a1711] px-2.5 py-1 rounded-md border border-indigo-200 [data-theme='sunset-copper']_&:border-[#ca5e3a]/30">
                            +91 {mobileNumber.replace(/\D/g, '').slice(-10)}
                          </span>
                        </div>

                        {mobileError && (
                          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{mobileError}</span>
                          </div>
                        )}

                        {/* 6-Digit OTP Box Grid */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-2">
                            Enter 6-Digit SMS Verification Code
                          </label>
                          <div className="grid grid-cols-6 gap-2 sm:gap-3" onPaste={handleMobileOtpPaste}>
                            {mobileOtp.map((digit, i) => (
                              <input
                                key={i}
                                ref={(el) => (mobileOtpRefs.current[i] = el)}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleMobileOtpChange(i, e.target.value)}
                                onKeyDown={(e) => handleMobileOtpKeyDown(i, e)}
                                className="w-full h-12 text-center text-xl font-bold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900"
                                autoFocus={i === 0}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Displayed OTP Code & Auto-Fill Option */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-amber-50 [data-theme='sunset-copper']_&:bg-[#2a1711] border border-amber-200 [data-theme='sunset-copper']_&:border-[#ca5e3a]/40 text-xs text-amber-900 [data-theme='sunset-copper']_&:text-[#f7a379]">
                          <div className="flex items-center gap-2.5">
                            <KeyRound className="w-4 h-4 text-amber-600 [data-theme='sunset-copper']_&:text-[#ca5e3a] shrink-0" />
                            <span>
                              Your Verification OTP:{' '}
                              <strong className="font-mono text-base font-bold tracking-widest text-indigo-700 [data-theme='sunset-copper']_&:text-amber-300 ml-1">
                                {generatedMobileOtp}
                              </strong>
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const digits = generatedMobileOtp.split('');
                              setMobileOtp(digits);
                              setMobileError('');
                              mobileOtpRefs.current[5]?.focus();
                            }}
                            className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg bg-indigo-600 [data-theme='sunset-copper']_&:bg-[#ca5e3a] hover:bg-indigo-700 [data-theme='sunset-copper']_&:hover:bg-[#b8522f] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
                          >
                            <span>⚡ Auto-fill OTP</span>
                          </button>
                        </div>

                        {/* Resend Timer / Action */}
                        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                          <span>Didn't receive SMS code?</span>
                          {mobileOtpTimer > 0 ? (
                            <span className="font-medium text-slate-400">
                              Resend in <strong className="font-mono text-slate-700">{mobileOtpTimer}s</strong>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={handleResendMobileOtp}
                              className="font-semibold text-indigo-600 [data-theme='sunset-copper']_&:text-[#ca5e3a] hover:underline flex items-center gap-1"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              <span>Resend OTP Code</span>
                            </button>
                          )}
                        </div>

                        <Button
                          type="submit"
                          size="lg"
                          isLoading={isLoading}
                          className="w-full mt-2"
                          rightIcon={<ArrowRight className="w-4 h-4" />}
                        >
                          Verify OTP & Sign In
                        </Button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: FORGOT PASSWORD */}
            {authMode === 'forgot' && (
              <form onSubmit={handleForgotSubmit} className="space-y-4 animate-fadeIn">
                <div>
                  <button
                    type="button"
                    onClick={() => setAuthMode('signin')}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-3"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Sign In</span>
                  </button>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    Reset Workspace Password
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Enter your registered corporate email. We'll send a 6-digit OTP verification code to securely reset your credentials.
                  </p>
                </div>

                {loginError && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <Input
                  label="Corporate Email Address"
                  type="email"
                  placeholder="name@company.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  leftIcon={<Mail className="w-4 h-4" />}
                  required
                />

                <Button
                  type="submit"
                  size="lg"
                  isLoading={isLoading}
                  className="w-full"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Send Verification Code
                </Button>
              </form>
            )}

            {/* TAB 3: OTP VERIFICATION */}
            {authMode === 'otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-5 animate-fadeIn">
                <div>
                  <button
                    type="button"
                    onClick={() => setAuthMode('forgot')}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-3"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Change Email Address</span>
                  </button>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    Verify Identity (Enter OTP)
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    A 6-digit security verification code has been dispatched to{' '}
                    <strong className="text-slate-800">{resetEmail}</strong>.
                  </p>
                </div>

                {otpError && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{otpError}</span>
                  </div>
                )}

                {/* 6-Digit OTP Box Grid */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Enter 6-Digit Verification Code
                  </label>
                  <div className="grid grid-cols-6 gap-2 sm:gap-3" onPaste={handleOtpPaste}>
                    {otpDigits.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => (otpInputRefs.current[i] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className="w-full h-12 text-center text-xl font-bold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900"
                        autoFocus={i === 0}
                      />
                    ))}
                  </div>
                </div>

                {/* Displayed OTP Code & Auto-Fill Option */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-amber-50 [data-theme='sunset-copper']_&:bg-[#2a1711] border border-amber-200 [data-theme='sunset-copper']_&:border-[#ca5e3a]/40 text-xs text-amber-900 [data-theme='sunset-copper']_&:text-[#f7a379]">
                  <div className="flex items-center gap-2.5">
                    <KeyRound className="w-4 h-4 text-amber-600 [data-theme='sunset-copper']_&:text-[#ca5e3a] shrink-0" />
                    <span>
                      Your Verification OTP:{' '}
                      <strong className="font-mono text-base font-bold tracking-widest text-indigo-700 [data-theme='sunset-copper']_&:text-amber-300 ml-1">
                        {generatedOtp}
                      </strong>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpDigits(generatedOtp.split(''));
                      setOtpError('');
                      otpInputRefs.current[5]?.focus();
                    }}
                    className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg bg-indigo-600 [data-theme='sunset-copper']_&:bg-[#ca5e3a] hover:bg-indigo-700 [data-theme='sunset-copper']_&:hover:bg-[#b8522f] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
                  >
                    <span>⚡ Auto-fill OTP</span>
                  </button>
                </div>

                {/* Resend and timer */}
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>
                    {otpTimer > 0 ? (
                      <>Code expires in <strong className="text-slate-800">00:{otpTimer < 10 ? `0${otpTimer}` : otpTimer}</strong></>
                    ) : (
                      <span className="text-rose-500 font-semibold">Code expired</span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className={`font-semibold transition-colors ${
                      canResendOtp || otpTimer === 0
                        ? 'text-indigo-600 [data-theme="sunset-copper"]_&:text-[#ca5e3a] hover:underline cursor-pointer'
                        : 'text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Resend Code
                  </button>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  isLoading={isLoading}
                  className="w-full"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Verify Code & Continue
                </Button>
              </form>
            )}

            {/* TAB 4: RESET PASSWORD */}
            {authMode === 'reset' && (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-4 animate-fadeIn">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    Set New Password
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Choose a strong, compliant password for your VedaFlow CRM account.
                  </p>
                </div>

                {resetError && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{resetError}</span>
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      New Password
                    </label>
                    <div className="relative rounded-lg shadow-2xs">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder="••••••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="block w-full rounded-lg border border-slate-300 pl-9 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Password Strength Meter */}
                  {newPassword && (
                    <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Password Strength:</span>
                        <span className={`font-bold ${getStrengthLabel().color}`}>
                          {getStrengthLabel().text}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div className={`h-full transition-all duration-300 ${getStrengthLabel().bar}`} />
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px] text-slate-600">
                        <span className={`flex items-center gap-1 ${hasMinLength ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                          <Check className="w-3 h-3" /> 8+ Characters
                        </span>
                        <span className={`flex items-center gap-1 ${hasUpperCase ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                          <Check className="w-3 h-3" /> Uppercase letter
                        </span>
                        <span className={`flex items-center gap-1 ${hasNumber ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                          <Check className="w-3 h-3" /> Includes number
                        </span>
                        <span className={`flex items-center gap-1 ${hasSpecial ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                          <Check className="w-3 h-3" /> Special symbol
                        </span>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Confirm New Password
                    </label>
                    <div className="relative rounded-lg shadow-2xs">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showConfirmNewPassword ? 'text' : 'password'}
                        placeholder="••••••••••••"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="block w-full rounded-lg border border-slate-300 pl-9 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                      >
                        {showConfirmNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  isLoading={isLoading}
                  className="w-full mt-2"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Save Password & Sign In
                </Button>
              </form>
            )}

            {/* TAB 5: CREATE ACCOUNT FORM */}
            {authMode === 'signup' && (
              <form onSubmit={handleSignupSubmit} className="space-y-3.5 animate-fadeIn">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    Create Enterprise User Account
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Register employee credentials to access lead management, sales pipeline, and task queues
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Full Name"
                    placeholder="e.g. David Vance"
                    value={signupName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    leftIcon={<User className="w-4 h-4" />}
                    error={signupErrors.name}
                    required
                  />

                  <Select
                    label="Workspace Role"
                    value={signupRole}
                    onChange={(e) => {
                      setSignupRole(e.target.value);
                      if (signupErrors.role) {
                        setSignupErrors((prev) => ({ ...prev, role: '' }));
                      }
                    }}
                    error={signupErrors.role}
                    required
                    options={[
                      { value: '', label: '-- Select Workspace Role --' },
                      { value: 'Enterprise Account Executive (AE)', label: 'Enterprise AE (Sales Rep)' },
                      { value: 'Sales Development Rep (SDR)', label: 'SDR (Sales Rep)' },
                      { value: 'Customer Success Manager (CSM)', label: 'Customer Success Manager' },
                      { value: 'Sales Director / VP of Sales', label: 'Sales Director / Manager' },
                      { value: 'Enterprise Administrator', label: 'Enterprise Administrator' },
                    ]}
                  />
                </div>

                <div className="w-full">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Company / Organization <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative rounded-lg shadow-2xs">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <Building className="w-4 h-4" />
                    </div>
                    <select
                      value={signupCompany}
                      onChange={(e) => handleCompanyChange(e.target.value)}
                      className={`block w-full rounded-lg border pl-9 pr-8 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 ${
                        signupErrors.company ? 'border-rose-400' : 'border-slate-300'
                      }`}
                    >
                      {PRESET_ORGANIZATIONS.map((org, idx) => (
                        <option key={idx} value={org.name}>
                          {org.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {signupErrors.company && (
                    <p className="text-[11px] text-rose-500 mt-1">{signupErrors.company}</p>
                  )}
                </div>

                {signupCompany === 'Other / Custom Organization' && (
                  <Input
                    label="Custom Organization Name"
                    placeholder="e.g. Acme Corp India"
                    value={customCompanyName}
                    onChange={(e) => handleCustomCompanyChange(e.target.value)}
                    leftIcon={<Building className="w-4 h-4" />}
                    required
                  />
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="w-full">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Corporate Work Email <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex rounded-lg shadow-2xs border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500">
                      <div className="flex items-center pl-3 pr-1 text-slate-400 bg-white">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        placeholder="first.last"
                        value={signupEmailUsername}
                        onChange={(e) => handleEmailUsernameChange(e.target.value)}
                        className="w-full min-w-0 py-2 text-sm focus:outline-none bg-white text-slate-900"
                      />
                      <span className="flex items-center px-2.5 bg-slate-100 text-slate-600 text-xs font-medium border-l border-slate-200">
                        @{signupDomain}
                      </span>
                    </div>
                    {signupErrors.email && (
                      <p className="text-[11px] text-rose-500 mt-1">{signupErrors.email}</p>
                    )}
                  </div>

                  <div className="w-full">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative rounded-lg shadow-2xs flex">
                      <div className="inline-flex items-center gap-1.5 px-3 py-2 border border-r-0 border-slate-300 bg-slate-50 text-slate-700 text-xs font-bold rounded-l-lg select-none">
                        <span className="text-sm">🇮🇳</span>
                        <span>+91</span>
                      </div>
                      <input
                        type="tel"
                        placeholder="98200 11223"
                        value={signupPhone}
                        onChange={(e) => {
                          setSignupPhone(e.target.value);
                          if (signupErrors.phone) {
                            setSignupErrors((prev) => ({ ...prev, phone: '' }));
                          }
                        }}
                        maxLength={15}
                        className={`block w-full rounded-r-lg border px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-900 ${
                          signupErrors.phone ? 'border-rose-400' : 'border-slate-300'
                        }`}
                        required
                      />
                    </div>
                    {signupErrors.phone && (
                      <p className="text-[11px] text-rose-500 mt-1">{signupErrors.phone}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••••••"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    leftIcon={<Lock className="w-4 h-4" />}
                    error={signupErrors.password}
                    required
                  />

                  <Input
                    label="Confirm Password"
                    type="password"
                    placeholder="••••••••••••"
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    leftIcon={<Lock className="w-4 h-4" />}
                    error={signupErrors.confirmPassword}
                    required
                  />
                </div>

                <div className="pt-1">
                  <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>
                      I agree to the Enterprise Master Subscription Agreement and Privacy Policy.
                    </span>
                  </label>
                  {signupErrors.terms && (
                    <p className="text-[11px] text-rose-500 mt-1">{signupErrors.terms}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  isLoading={isLoading}
                  className="w-full mt-2"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Create User Account
                </Button>
              </form>
            )}
          </div>

          {/* Footer note */}
          <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between text-[11px] text-slate-400">
            <span>&copy; {new Date().getFullYear()} VedaFlow Technologies Pvt. Ltd.</span>
            <span>Enterprise Sales Cloud v2.4</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AuthPage;
