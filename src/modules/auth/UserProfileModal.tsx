import React, { useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { closeModal, addToast, setColorTheme } from '@/store/uiSlice';
import { updateAuthUser, logout } from '@/modules/auth/authSlice';
import { THEMES } from '@/constants/themes';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { Input, Select } from '@/components/Input';
import { Avatar } from '@/components/Avatar';
import { formatCurrency } from '@/utils/formatters';
import { mockTeamMembers } from '@/data/mockData';
import {
  User,
  Shield,
  Sliders,
  Award,
  Key,
  CheckCircle2,
  Upload,
  Trash2,
  Image as ImageIcon,
  Bell,
  RefreshCw,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  KeyRound,
} from 'lucide-react';

export const UserProfileModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.modals.userProfileModalOpen);
  const currentUser = useAppSelector((state) => state.auth.user);
  const colorTheme = useAppSelector((state) => state.ui.colorTheme);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<'profile' | 'performance' | 'preferences' | 'security'>('profile');

  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    title: currentUser.title,
    role: currentUser.role,
    department: currentUser.department,
    phone: currentUser.phone,
    avatar: currentUser.avatar,
    timezone: currentUser.timezone || 'America/Los_Angeles (PST)',
    currency: currentUser.currency || 'USD ($)',
  });

  const [notifSettings, setNotifSettings] = useState({
    deals: true,
    leads: true,
    tasks: true,
    weeklyDigest: false,
  });

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (!currentPassword) {
      setPasswordError('Please enter your current password');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setPasswordChangeLoading(true);
    setTimeout(() => {
      setPasswordChangeLoading(false);
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      dispatch(
        addToast({
          type: 'success',
          title: 'Password Updated',
          message: 'Your account password has been changed and encrypted securely.',
        })
      );
    }, 500);
  };

  const handleClose = () => {
    dispatch(closeModal('userProfileModalOpen'));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateAuthUser(formData));
    dispatch(
      addToast({
        type: 'success',
        title: 'Profile Saved',
        message: 'Your personal information and avatar settings have been updated.',
      })
    );
    handleClose();
  };

  // Handle image upload from file input
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Invalid File',
          message: 'Please choose a valid image file (PNG, JPG, WebP, etc.).',
        })
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      dispatch(
        addToast({
          type: 'error',
          title: 'File Too Large',
          message: 'Image size must be less than 5MB.',
        })
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const dataUrl = event.target.result as string;
        setFormData((prev) => ({ ...prev, avatar: dataUrl }));
        dispatch(
          addToast({
            type: 'success',
            title: 'Image Uploaded',
            message: 'Your profile picture has been selected. Click Save to apply.',
          })
        );
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, avatar: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    dispatch(
      addToast({
        type: 'info',
        title: 'Image Removed',
        message: `Profile set to display your name's first letter "${formData.name.charAt(0).toUpperCase()}".`,
      })
    );
  };

  const handleSwitchUser = (memberId: string) => {
    const member = mockTeamMembers.find((m) => m.id === memberId);
    if (member) {
      dispatch(
        updateAuthUser({
          name: member.name,
          email: member.email,
          title: member.role,
          avatar: '', // Default to First Letter!
          quota: member.quota,
          closedWonAmount: member.closedWonAmount,
          activeDealsCount: member.activeDealsCount,
        })
      );
      setFormData((prev) => ({
        ...prev,
        name: member.name,
        email: member.email,
        title: member.role,
        avatar: '',
      }));
      dispatch(
        addToast({
          type: 'info',
          title: 'Perspective Switched',
          message: `Now acting as ${member.name} (${member.role}).`,
        })
      );
    }
  };

  const quotaPercent = Math.min(
    100,
    Math.round((currentUser.closedWonAmount / currentUser.quota) * 100)
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="User Profile & Enterprise Settings"
      description={`Authenticated as ${currentUser.name} • ${currentUser.role}`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
              activeTab === 'profile'
                ? 'bg-indigo-50 text-indigo-700 font-bold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Details</span>
          </button>

          <button
            onClick={() => setActiveTab('performance')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
              activeTab === 'performance'
                ? 'bg-indigo-50 text-indigo-700 font-bold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Quota & Performance</span>
          </button>

          <button
            onClick={() => setActiveTab('preferences')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
              activeTab === 'preferences'
                ? 'bg-indigo-50 text-indigo-700 font-bold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>CRM Preferences</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
              activeTab === 'security'
                ? 'bg-indigo-50 text-indigo-700 font-bold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Security & Access</span>
          </button>
        </div>

        {/* Tab 1: Profile Details */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            {/* Custom Avatar Upload Section */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row items-center gap-5">
              <Avatar
                name={formData.name}
                src={formData.avatar}
                size="xl"
                status={currentUser.status}
              />

              <div className="flex-1 text-center sm:text-left space-y-2">
                <div>
                  <p className="text-sm font-bold text-slate-900">Profile Picture / Avatar</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {formData.avatar ? (
                      <span className="text-emerald-600 font-medium">
                        Custom image uploaded. You can replace or switch back to your name's initial anytime.
                      </span>
                    ) : (
                      <span>
                        Showing the first letter of your name (<strong className="text-indigo-600">{formData.name.charAt(0).toUpperCase()}</strong>). You can also upload a photo below.
                      </span>
                    )}
                  </p>
                </div>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  className="hidden"
                />

                {/* Upload & Clear Action Buttons */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="primary"
                    onClick={() => fileInputRef.current?.click()}
                    leftIcon={<Upload className="w-3.5 h-3.5" />}
                  >
                    Upload New Photo
                  </Button>

                  {formData.avatar && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={handleRemoveImage}
                      leftIcon={<Trash2 className="w-3.5 h-3.5 text-rose-500" />}
                    >
                      Use First Letter ({formData.name.charAt(0).toUpperCase()})
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                label="Corporate Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Job Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <Input
                label="Department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Direct Phone Line"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <Input
                label="Assigned System Role"
                value={formData.role}
                disabled
                helperText="Governed by Enterprise IT permissions"
              />
            </div>

            {/* Perspective Switcher */}
            <div className="p-3.5 rounded-xl border border-dashed border-slate-300 bg-white">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5" /> Test Other Rep Accounts (Admin Perspective Mode):
              </p>
              <div className="flex flex-wrap gap-2">
                {mockTeamMembers.map((m) => (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => handleSwitchUser(m.id)}
                    className={`px-2.5 py-1 text-xs rounded-lg border font-medium transition-all flex items-center gap-1.5 ${
                      currentUser.name === m.name
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Avatar name={m.name} size="xs" />
                    <span>{m.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <Button variant="outline" type="button" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit">Save Profile Changes</Button>
            </div>
          </form>
        )}

        {/* Tab 2: Quota & Performance */}
        {activeTab === 'performance' && (
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-gradient-to-r from-[#2c1a13] to-[#1a0f0a] border border-[#3d271e] text-white space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-[#c5a89e]">
                    Quarterly Sales Attainment
                  </span>
                  <p className="text-2xl font-black mt-1">
                    {formatCurrency(currentUser.closedWonAmount)}
                    <span className="text-sm font-normal text-slate-300 ml-2">
                      of {formatCurrency(currentUser.quota)} goal
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-extrabold text-[#f59e0b]">{quotaPercent}%</span>
                  <p className="text-[11px] text-[#c5a89e] font-medium">Attainment</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#140e0c] border border-[#3d271e] rounded-full h-2.5 overflow-hidden shadow-inner">
                <div
                  className="bg-gradient-to-r from-[#ca5e3a] via-[#e08a68] to-[#f59e0b] h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(202,94,58,0.5)]"
                  style={{ width: `${quotaPercent}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <span className="text-xs font-semibold text-slate-400 uppercase">Active Opportunities</span>
                <p className="text-xl font-bold text-slate-900 mt-1">{currentUser.activeDealsCount} Deals</p>
                <p className="text-[11px] text-slate-500 mt-0.5">High probability pipeline</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <span className="text-xs font-semibold text-slate-400 uppercase">Historical Win Rate</span>
                <p className="text-xl font-bold text-emerald-600 mt-1">78.4%</p>
                <p className="text-[11px] text-emerald-700 mt-0.5">+4.2% vs team median</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <span className="text-xs font-semibold text-slate-400 uppercase">Sales Cycle Velocity</span>
                <p className="text-xl font-bold text-indigo-600 mt-1">32 Days</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Lead to signed contract</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: CRM Preferences */}
        {activeTab === 'preferences' && (
          <div className="space-y-4">
            {/* Color Theme Selector Swatches */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Application Color Theme Palette
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => {
                      dispatch(setColorTheme(theme.id));
                      document.documentElement.setAttribute('data-theme', theme.id);
                      dispatch(
                        addToast({
                          type: 'success',
                          title: 'Theme Applied',
                          message: `Switched to ${theme.name}.`,
                        })
                      );
                    }}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-semibold transition-all ${
                      colorTheme === theme.id
                        ? 'border-[#ca5e3a] bg-[#2a1711] text-[#f7a379] ring-2 ring-[#ca5e3a]/40 shadow-md'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full ${theme.color} shrink-0 ring-2 ring-white/80 shadow-xs`} />
                    <div className="text-left min-w-0">
                      <p className="font-bold truncate">{theme.name}</p>
                      <p className="text-[10px] text-slate-400 font-normal truncate">{theme.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Preferred Timezone"
                options={[
                  { value: 'Asia/Kolkata (IST)', label: 'India Standard Time (IST - UTC+5:30)' },
                  { value: 'America/Los_Angeles (PST)', label: 'Pacific Time (PST/PDT)' },
                  { value: 'America/New_York (EST)', label: 'Eastern Time (EST/EDT)' },
                  { value: 'Europe/London (GMT)', label: 'Greenwich Mean Time (GMT/BST)' },
                  { value: 'Europe/Paris (CET)', label: 'Central European Time (CET)' },
                  { value: 'Asia/Tokyo (JST)', label: 'Japan Standard Time (JST)' },
                ]}
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
              />

              <Select
                label="Display Currency"
                options={[
                  { value: 'INR (₹)', label: 'Indian Rupee (₹ - INR)' },
                  { value: 'USD ($)', label: 'US Dollar ($ - USD)' },
                  { value: 'EUR (€)', label: 'Euro (€ - EUR)' },
                  { value: 'GBP (£)', label: 'British Pound (£ - GBP)' },
                ]}
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              />
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-indigo-600" /> Automated Alert Notifications
              </h4>

              <div className="space-y-2 text-xs">
                <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <div>
                    <p className="font-semibold text-slate-800">High-Value Deal Stage Advancements</p>
                    <p className="text-slate-500">Notify me immediately when deals exceed ₹50 Lakhs in value</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifSettings.deals}
                    onChange={(e) => setNotifSettings({ ...notifSettings, deals: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <div>
                    <p className="font-semibold text-slate-800">Inbound Lead Assignments</p>
                    <p className="text-slate-500">Send instant alert when new qualified lead is assigned</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifSettings.leads}
                    onChange={(e) => setNotifSettings({ ...notifSettings, leads: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <div>
                    <p className="font-semibold text-slate-800">Daily Morning Action Plan</p>
                    <p className="text-slate-500">Summary email of upcoming tasks and customer meetings</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifSettings.weeklyDigest}
                    onChange={(e) => setNotifSettings({ ...notifSettings, weeklyDigest: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <Button
                onClick={() => {
                  dispatch(
                    addToast({
                      type: 'success',
                      title: 'Preferences Updated',
                      message: 'Localization and notification preferences saved.',
                    })
                  );
                  handleClose();
                }}
              >
                Apply Preferences
              </Button>
            </div>
          </div>
        )}

        {/* Tab 4: Security & Access */}
        {activeTab === 'security' && (
          <div className="space-y-4">
            {/* Password Change Form */}
            <form onSubmit={handleChangePassword} className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-indigo-600 [data-theme='sunset-copper']_&:text-[#ca5e3a]" />
                  <span>Change Password</span>
                </h4>
                <span className="text-[10px] text-slate-400">Min 8 characters</span>
              </div>

              {passwordError && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              {passwordSuccess && (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Password successfully updated and encrypted!</span>
                </div>
              )}

              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Current Password
                  </label>
                  <div className="relative rounded-lg shadow-2xs">
                    <input
                      type={showCurrentPass ? 'text' : 'password'}
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="block w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showCurrentPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      New Password
                    </label>
                    <div className="relative rounded-lg shadow-2xs">
                      <input
                        type={showNewPass ? 'text' : 'password'}
                        placeholder="••••••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="block w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative rounded-lg shadow-2xs">
                      <input
                        type={showConfirmPass ? 'text' : 'password'}
                        placeholder="••••••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="block w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                        className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showConfirmPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  size="sm"
                  isLoading={passwordChangeLoading}
                  leftIcon={<KeyRound className="w-3.5 h-3.5" />}
                >
                  Update Password
                </Button>
              </div>
            </form>

            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Two-Factor Authentication (2FA)
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Hardware token / Authenticator app protection is currently active
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                  Enforced
                </span>
              </div>
            </div>

            {/* Role-Based Access & Permissions Matrix */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-indigo-600 [data-theme='sunset-copper']_&:text-[#ca5e3a]" />
                    <span>Role-Based Permissions & Access Control</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Assigned Role: <span className="font-semibold text-slate-900">{currentUser.role}</span>
                  </p>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 [data-theme='sunset-copper']_&:bg-[#ca5e3a]/10 text-indigo-700 [data-theme='sunset-copper']_&:text-[#ca5e3a] border border-indigo-200 [data-theme='sunset-copper']_&:border-[#ca5e3a]/30">
                  Active Role
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-800">Lead & Follow-Up Management</p>
                    <p className="text-[11px] text-slate-500">Create, edit, assign & schedule follow-ups</p>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-800">Pipeline Kanban Tracking</p>
                    <p className="text-[11px] text-slate-500">Stage progression & deal values</p>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-800">Customer Dossier & History</p>
                    <p className="text-[11px] text-slate-500">Account profiles, SLA & interactions</p>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-800">Personal & Team Analytics</p>
                    <p className="text-[11px] text-slate-500">Quota metrics, conversion funnel & export</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Active Client Session
              </h4>
              <div className="text-xs space-y-1.5 text-slate-600">
                <div className="flex justify-between">
                  <span>Client Agent:</span>
                  <span className="font-semibold text-slate-800">VedaFlow Sales Intelligence v2.4</span>
                </div>
                <div className="flex justify-between">
                  <span>Operating Platform:</span>
                  <span className="font-semibold text-slate-800">Chrome on Windows 11</span>
                </div>
                <div className="flex justify-between">
                  <span>IP Verification:</span>
                  <span className="font-mono text-slate-800">198.51.100.44 (Encrypted TLS 1.3)</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900">Developer API Key</p>
                <p className="text-xs text-slate-500">crm_live_99a8b7c6d5e4f3a2b1</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                leftIcon={<Key className="w-3.5 h-3.5" />}
                onClick={() =>
                  dispatch(
                    addToast({
                      type: 'info',
                      title: 'API Token Rotated',
                      message: 'A new secret key has been generated and sent to your email.',
                    })
                  )
                }
              >
                Regenerate Token
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
