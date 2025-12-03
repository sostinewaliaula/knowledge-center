import { useState, useEffect } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { useSettings } from '../../contexts/SettingsContext';
import { AdminSidebar } from '../../components/AdminSidebar';
import {
  Save,
  Moon,
  Sun,
  Bell,
  Shield,
  Mail,
  Globe,
  Database,
  Users,
  BookOpen,
  Settings,
  Info,
  Palette,
  Zap,
  Lock,
  FileText,
  Image,
  Video,
  Music,
  File,
  Upload,
  Download,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  TestTube,
  Trash2,
  Copy,
  Calendar,
  Clock,
  Award,
  MessageSquare,
  BarChart3,
  Link as LinkIcon,
  Building2,
  FolderOpen
} from 'lucide-react';
import { api } from '../../utils/api';

interface SettingsPageProps { }

export function SettingsPage({ }: SettingsPageProps) {
  const { showSuccess, showError } = useToast();
  const { refreshSettings } = useSettings();
  const [activeSection, setActiveSection] = useState('general');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Knowledge Center',
    siteSubtitle: 'TQ Academy',
    companyName: 'Caava Group',
    companyLogo: '',
    favicon: '',
    timezone: 'Africa/Nairobi',
    language: 'en',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12h',
    theme: 'light',
    primaryColor: '#9333EA',
    secondaryColor: '#10B981'
  });

  // User Management Settings
  const [userSettings, setUserSettings] = useState({
    allowSelfRegistration: false,
    requireEmailVerification: true,
    requirePhoneVerification: false,
    defaultRole: 'learner',
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireLowercase: true,
    passwordRequireNumbers: true,
    passwordRequireSpecialChars: true,
    sessionTimeout: 30,
    maxSessionsPerUser: 3,
    enableProfilePictures: true,
    enableUserStatus: true
  });

  // Content Settings
  const [contentSettings, setContentSettings] = useState({
    maxFileSize: 100,
    maxVideoSize: 500,
    maxImageSize: 10,
    allowedFileTypes: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'],
    allowedVideoTypes: ['mp4', 'avi', 'mov', 'wmv', 'flv'],
    allowedImageTypes: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
    allowedAudioTypes: ['mp3', 'wav', 'ogg', 'm4a'],
    autoApproveContent: false,
    enableComments: true,
    enableRatings: true,
    enableDownloads: true,
    enableSharing: true,
    contentExpiryDays: 0,
    enableVersioning: true
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    courseUpdates: true,
    assignmentReminders: true,
    deadlineAlerts: true,
    systemAnnouncements: true,
    newContentAlerts: true,
    completionCertificates: true,
    achievementBadges: true,
    discussionReplies: true,
    mentionNotifications: true
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    require2FAForAdmins: true,
    passwordExpiry: 90,
    passwordHistory: 5,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    enableIPWhitelist: false,
    allowedIPs: [] as string[],
    enableSSO: false,
    ssoProvider: 'none',
    enableAuditLog: true,
    dataRetentionDays: 365,
    enableGDPR: false,
    autoLogout: true
  });

  // Email Settings
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: '',
    smtpPort: 587,
    smtpSecure: true,
    smtpUser: '',
    smtpPassword: '',
    fromEmail: 'noreply@caavagroup.com',
    fromName: 'Knowledge Center',
    replyToEmail: 'support@caavagroup.com',
    testEmail: ''
  });

  // Integration Settings
  const [integrationSettings, setIntegrationSettings] = useState({
    googleAnalytics: '',
    facebookPixel: '',
    enableZoom: false,
    zoomApiKey: '',
    zoomApiSecret: '',
    enableSlack: false,
    slackWebhook: '',
    enableMicrosoftTeams: false,
    teamsWebhook: '',
    enableLTI: false,
    ltiConsumerKey: '',
    ltiConsumerSecret: ''
  });

  // Gamification Settings
  const [gamificationSettings, setGamificationSettings] = useState({
    enableGamification: true,
    pointsPerCourse: 50,
    pointsPerAssessment: 10,
    pointsPerPerfectScore: 100,
    enableBadges: true,
    enableLeaderboards: true,
    leaderboardPeriod: 'monthly',
    enableCertificates: true,
    certificateTemplate: 'default'
  });

  // Learning Path Settings
  const [learningPathSettings, setLearningPathSettings] = useState({
    enablePrerequisites: true,
    enableSequentialLearning: false,
    allowSkipping: false,
    enableBranching: true,
    completionThreshold: 80,
    enableTimeTracking: true
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await api.getSettings();
        if (data) {
          if (data.general) setGeneralSettings(data.general);
          if (data.users) setUserSettings(data.users);
          if (data.content) setContentSettings(data.content);
          if (data.notifications) setNotificationSettings(data.notifications);
          if (data.security) setSecuritySettings(data.security);
          if (data.email) setEmailSettings(data.email);
          if (data.integrations) setIntegrationSettings(data.integrations);
          if (data.gamification) setGamificationSettings(data.gamification);
          if (data['learning-paths']) setLearningPathSettings(data['learning-paths']);
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await Promise.all([
        api.updateSettings('general', generalSettings),
        api.updateSettings('users', userSettings),
        api.updateSettings('content', contentSettings),
        api.updateSettings('notifications', notificationSettings),
        api.updateSettings('security', securitySettings),
        api.updateSettings('email', emailSettings),
        api.updateSettings('integrations', integrationSettings),
        api.updateSettings('gamification', gamificationSettings),
        api.updateSettings('learning-paths', learningPathSettings),
      ]);

      await refreshSettings(); // Refresh global settings to update Sidebar etc.

      setIsSaving(false);
      setHasUnsavedChanges(false);
      showSuccess('Settings saved successfully!');
    } catch (err: any) {
      setIsSaving(false);
      showError('Failed to save settings: ' + err.message);
    }
  };

  const handleTestEmail = () => {
    if (!emailSettings.testEmail) {
      showError('Please enter a test email address');
      return;
    }
    showSuccess(`Test email sent to ${emailSettings.testEmail}`);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, key: 'companyLogo' | 'favicon') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit for logos
        showError('File size too large. Max 2MB allowed.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setGeneralSettings(prev => ({ ...prev, [key]: reader.result as string }));
        setHasUnsavedChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const ToggleSwitch = ({ enabled, onChange, label, description, warning }: {
    enabled: boolean;
    onChange: () => void;
    label: string;
    description?: string;
    warning?: boolean;
  }) => (
    <div className={`flex items-center justify-between p-4 bg-white border rounded-lg transition-colors ${warning ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200 hover:border-purple-300'
      }`}>
      <div className="flex-1">
        <div className="font-medium text-gray-900 mb-1">{label}</div>
        {description && <div className="text-sm text-gray-500">{description}</div>}
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-gradient-to-r from-purple-600 to-green-600' : 'bg-gray-300'
          }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
        />
      </button>
    </div>
  );

  const settingsSections = [
    { id: 'general', label: 'General', icon: Settings, color: 'text-purple-600' },
    { id: 'users', label: 'Users', icon: Users, color: 'text-blue-600' },
    { id: 'content', label: 'Content', icon: BookOpen, color: 'text-green-600' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'text-yellow-600' },
    { id: 'security', label: 'Security', icon: Shield, color: 'text-red-600' },
    { id: 'email', label: 'Email', icon: Mail, color: 'text-indigo-600' },
    { id: 'integrations', label: 'Integrations', icon: LinkIcon, color: 'text-cyan-600' },
    { id: 'gamification', label: 'Gamification', icon: Award, color: 'text-orange-600' },
    { id: 'learning-paths', label: 'Learning Paths', icon: Zap, color: 'text-teal-600' }
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="text-sm text-gray-500 mt-1">Configure your LMS platform settings and preferences</p>
            </div>
            <div className="flex items-center gap-3">
              {hasUnsavedChanges && (
                <span className="text-sm text-orange-600 flex items-center gap-1">
                  <AlertTriangle size={16} />
                  Unsaved changes
                </span>
              )}
              <button
                onClick={handleSave}
                disabled={isSaving || !hasUnsavedChanges}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Settings Navigation Sidebar */}
          <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Settings Categories</h2>
              <nav className="space-y-1">
                {settingsSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full px-3 py-2.5 flex items-center gap-3 rounded-lg transition-colors ${activeSection === section.id
                        ? 'bg-purple-50 text-purple-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      <Icon size={18} className={section.color} />
                      <span>{section.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-5xl">
              {activeSection === 'general' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Globe size={20} className="text-purple-600" />
                      General Information
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                          <input
                            type="text"
                            value={generalSettings.siteName}
                            onChange={(e) => {
                              setGeneralSettings({ ...generalSettings, siteName: e.target.value });
                              setHasUnsavedChanges(true);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Site Subtitle</label>
                          <input
                            type="text"
                            value={generalSettings.siteSubtitle}
                            onChange={(e) => {
                              setGeneralSettings({ ...generalSettings, siteSubtitle: e.target.value });
                              setHasUnsavedChanges(true);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                        <input
                          type="text"
                          value={generalSettings.companyName}
                          onChange={(e) => {
                            setGeneralSettings({ ...generalSettings, companyName: e.target.value });
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                          <select
                            value={generalSettings.timezone}
                            onChange={(e) => {
                              setGeneralSettings({ ...generalSettings, timezone: e.target.value });
                              setHasUnsavedChanges(true);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            <option value="UTC">UTC</option>
                            <option value="Africa/Nairobi">Nairobi (EAT)</option>
                            <option value="America/New_York">New York (EST/EDT)</option>
                            <option value="America/Chicago">Chicago (CST/CDT)</option>
                            <option value="America/Denver">Denver (MST/MDT)</option>
                            <option value="America/Los_Angeles">Los Angeles (PST/PDT)</option>
                            <option value="Europe/London">London (GMT/BST)</option>
                            <option value="Europe/Paris">Paris (CET/CEST)</option>
                            <option value="Asia/Dubai">Dubai (GST)</option>
                            <option value="Asia/Tokyo">Tokyo (JST)</option>
                            <option value="Australia/Sydney">Sydney (AEST/AEDT)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                          <select
                            value={generalSettings.language}
                            onChange={(e) => {
                              setGeneralSettings({ ...generalSettings, language: e.target.value });
                              setHasUnsavedChanges(true);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                            <option value="zh">Chinese</option>
                            <option value="ja">Japanese</option>
                          </select>
                        </div>
                      </div >
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                          <select
                            value={generalSettings.dateFormat}
                            onChange={(e) => {
                              setGeneralSettings({ ...generalSettings, dateFormat: e.target.value });
                              setHasUnsavedChanges(true);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Time Format</label>
                          <select
                            value={generalSettings.timeFormat}
                            onChange={(e) => {
                              setGeneralSettings({ ...generalSettings, timeFormat: e.target.value });
                              setHasUnsavedChanges(true);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            <option value="12h">12 Hour</option>
                            <option value="24h">24 Hour</option>
                          </select>
                        </div>
                      </div>
                    </div >
                  </div >


                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Image size={20} className="text-blue-600" />
                      Branding
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo</label>
                        <div className="flex items-center gap-4">
                          <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden relative">
                            {generalSettings.companyLogo ? (
                              <img src={generalSettings.companyLogo} alt="Logo" className="w-full h-full object-contain" />
                            ) : (
                              <Image size={32} className="text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <input
                              type="file"
                              id="logo-upload"
                              className="hidden"
                              accept="image/png,image/jpeg,image/svg+xml"
                              onChange={(e) => handleImageUpload(e, 'companyLogo')}
                            />
                            <label
                              htmlFor="logo-upload"
                              className="inline-flex px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 items-center gap-2 cursor-pointer transition-colors"
                            >
                              <Upload size={16} />
                              Upload Logo
                            </label>
                            <p className="text-xs text-gray-500 mt-2">Recommended: 200x200px, PNG or SVG. Max 2MB.</p>
                            {generalSettings.companyLogo && (
                              <button
                                onClick={() => {
                                  setGeneralSettings(prev => ({ ...prev, companyLogo: '' }));
                                  setHasUnsavedChanges(true);
                                }}
                                className="text-xs text-red-600 hover:text-red-700 mt-1 font-medium"
                              >
                                Remove Logo
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Favicon</label>
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden relative">
                            {generalSettings.favicon ? (
                              <img src={generalSettings.favicon} alt="Favicon" className="w-full h-full object-contain" />
                            ) : (
                              <Image size={24} className="text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <input
                              type="file"
                              id="favicon-upload"
                              className="hidden"
                              accept="image/png,image/x-icon,image/svg+xml"
                              onChange={(e) => handleImageUpload(e, 'favicon')}
                            />
                            <label
                              htmlFor="favicon-upload"
                              className="inline-flex px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 items-center gap-2 cursor-pointer transition-colors"
                            >
                              <Upload size={16} />
                              Upload Favicon
                            </label>
                            <p className="text-xs text-gray-500 mt-2">Recommended: 32x32px, ICO or PNG. Max 2MB.</p>
                            {generalSettings.favicon && (
                              <button
                                onClick={() => {
                                  setGeneralSettings(prev => ({ ...prev, favicon: '' }));
                                  setHasUnsavedChanges(true);
                                }}
                                className="text-xs text-red-600 hover:text-red-700 mt-1 font-medium"
                              >
                                Remove Favicon
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Palette size={20} className="text-purple-600" />
                      Appearance & Theme
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                        <div className="flex items-center gap-4">
                          <button className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${generalSettings.theme === 'light'
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}>
                            <Sun size={18} />
                            <span>Light</span>
                          </button>
                          <button className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${generalSettings.theme === 'dark'
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}>
                            <Moon size={18} />
                            <span>Dark</span>
                          </button>
                          <button className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${generalSettings.theme === 'auto'
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}>
                            <Zap size={18} />
                            <span>Auto</span>
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={generalSettings.primaryColor}
                              onChange={(e) => {
                                setGeneralSettings({ ...generalSettings, primaryColor: e.target.value });
                                setHasUnsavedChanges(true);
                              }}
                              className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              value={generalSettings.primaryColor}
                              onChange={(e) => {
                                setGeneralSettings({ ...generalSettings, primaryColor: e.target.value });
                                setHasUnsavedChanges(true);
                              }}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={generalSettings.secondaryColor}
                              onChange={(e) => {
                                setGeneralSettings({ ...generalSettings, secondaryColor: e.target.value });
                                setHasUnsavedChanges(true);
                              }}
                              className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              value={generalSettings.secondaryColor}
                              onChange={(e) => {
                                setGeneralSettings({ ...generalSettings, secondaryColor: e.target.value });
                                setHasUnsavedChanges(true);
                              }}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div >
              )
              }

              {
                activeSection === 'users' && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Users size={20} className="text-blue-600" />
                        Registration & Access
                      </h3>
                      <div className="space-y-3">
                        <ToggleSwitch
                          enabled={userSettings.allowSelfRegistration}
                          onChange={() => {
                            setUserSettings({ ...userSettings, allowSelfRegistration: !userSettings.allowSelfRegistration });
                            setHasUnsavedChanges(true);
                          }}
                          label="Allow Self Registration"
                          description="Allow users to create their own accounts"
                        />
                        <ToggleSwitch
                          enabled={userSettings.requireEmailVerification}
                          onChange={() => {
                            setUserSettings({ ...userSettings, requireEmailVerification: !userSettings.requireEmailVerification });
                            setHasUnsavedChanges(true);
                          }}
                          label="Require Email Verification"
                          description="Users must verify their email before accessing the platform"
                        />
                        <ToggleSwitch
                          enabled={userSettings.requirePhoneVerification}
                          onChange={() => {
                            setUserSettings({ ...userSettings, requirePhoneVerification: !userSettings.requirePhoneVerification });
                            setHasUnsavedChanges(true);
                          }}
                          label="Require Phone Verification"
                          description="Users must verify their phone number"
                        />
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Default Role for New Users</label>
                          <select
                            value={userSettings.defaultRole}
                            onChange={(e) => {
                              setUserSettings({ ...userSettings, defaultRole: e.target.value });
                              setHasUnsavedChanges(true);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            <option value="learner">Learner</option>
                            <option value="instructor">Instructor</option>
                            <option value="auditor">Auditor</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Lock size={20} className="text-red-600" />
                        Password Policy
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Password Length</label>
                          <input
                            type="number"
                            min="6"
                            max="20"
                            value={userSettings.passwordMinLength}
                            onChange={(e) => {
                              setUserSettings({ ...userSettings, passwordMinLength: parseInt(e.target.value) });
                              setHasUnsavedChanges(true);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div className="space-y-2">
                          <ToggleSwitch
                            enabled={userSettings.passwordRequireUppercase}
                            onChange={() => {
                              setUserSettings({ ...userSettings, passwordRequireUppercase: !userSettings.passwordRequireUppercase });
                              setHasUnsavedChanges(true);
                            }}
                            label="Require Uppercase Letters"
                          />
                          <ToggleSwitch
                            enabled={userSettings.passwordRequireLowercase}
                            onChange={() => {
                              setUserSettings({ ...userSettings, passwordRequireLowercase: !userSettings.passwordRequireLowercase });
                              setHasUnsavedChanges(true);
                            }}
                            label="Require Lowercase Letters"
                          />
                          <ToggleSwitch
                            enabled={userSettings.passwordRequireNumbers}
                            onChange={() => {
                              setUserSettings({ ...userSettings, passwordRequireNumbers: !userSettings.passwordRequireNumbers });
                              setHasUnsavedChanges(true);
                            }}
                            label="Require Numbers"
                          />
                          <ToggleSwitch
                            enabled={userSettings.passwordRequireSpecialChars}
                            onChange={() => {
                              setUserSettings({ ...userSettings, passwordRequireSpecialChars: !userSettings.passwordRequireSpecialChars });
                              setHasUnsavedChanges(true);
                            }}
                            label="Require Special Characters"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Clock size={20} className="text-orange-600" />
                        Session Management
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                          <input
                            type="number"
                            min="5"
                            max="480"
                            value={userSettings.sessionTimeout}
                            onChange={(e) => {
                              setUserSettings({ ...userSettings, sessionTimeout: parseInt(e.target.value) });
                              setHasUnsavedChanges(true);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Max Concurrent Sessions</label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={userSettings.maxSessionsPerUser}
                            onChange={(e) => {
                              setUserSettings({ ...userSettings, maxSessionsPerUser: parseInt(e.target.value) });
                              setHasUnsavedChanges(true);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Users size={20} className="text-purple-600" />
                        User Profile Features
                      </h3>
                      <div className="space-y-3">
                        <ToggleSwitch
                          enabled={userSettings.enableProfilePictures}
                          onChange={() => {
                            setUserSettings({ ...userSettings, enableProfilePictures: !userSettings.enableProfilePictures });
                            setHasUnsavedChanges(true);
                          }}
                          label="Enable Profile Pictures"
                          description="Allow users to upload profile pictures"
                        />
                        <ToggleSwitch
                          enabled={userSettings.enableUserStatus}
                          onChange={() => {
                            setUserSettings({ ...userSettings, enableUserStatus: !userSettings.enableUserStatus });
                            setHasUnsavedChanges(true);
                          }}
                          label="Enable User Status"
                          description="Show online/offline status for users"
                        />
                      </div>
                    </div>
                  </div>
                )
              }

              {
                activeSection === 'content' && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FolderOpen size={20} className="text-blue-600" />
                        File Upload Limits
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Max File Size (MB)</label>
                          <input
                            type="number"
                            min="1"
                            max="1024"
                            value={contentSettings.maxFileSize}
                            onChange={(e) => {
                              setContentSettings({ ...contentSettings, maxFileSize: parseInt(e.target.value) });
                              setHasUnsavedChanges(true);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Max Video Size (MB)</label>
                          <input
                            type="number"
                            min="1"
                            max="2048"
                            value={contentSettings.maxVideoSize}
                            onChange={(e) => {
                              setContentSettings({ ...contentSettings, maxVideoSize: parseInt(e.target.value) });
                              setHasUnsavedChanges(true);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Max Image Size (MB)</label>
                          <input
                            type="number"
                            min="1"
                            max="50"
                            value={contentSettings.maxImageSize}
                            onChange={(e) => {
                              setContentSettings({ ...contentSettings, maxImageSize: parseInt(e.target.value) });
                              setHasUnsavedChanges(true);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Shield size={20} className="text-green-600" />
                        Content Moderation
                      </h3>
                      <div className="space-y-3">
                        <ToggleSwitch
                          enabled={contentSettings.autoApproveContent}
                          onChange={() => {
                            setContentSettings({ ...contentSettings, autoApproveContent: !contentSettings.autoApproveContent });
                            setHasUnsavedChanges(true);
                          }}
                          label="Auto-Approve Content"
                          description="Automatically approve uploaded content without review"
                        />
                        <ToggleSwitch
                          enabled={contentSettings.enableComments}
                          onChange={() => {
                            setContentSettings({ ...contentSettings, enableComments: !contentSettings.enableComments });
                            setHasUnsavedChanges(true);
                          }}
                          label="Enable Comments"
                          description="Allow users to comment on content"
                        />
                        <ToggleSwitch
                          enabled={contentSettings.enableRatings}
                          onChange={() => {
                            setContentSettings({ ...contentSettings, enableRatings: !contentSettings.enableRatings });
                            setHasUnsavedChanges(true);
                          }}
                          label="Enable Ratings"
                          description="Allow users to rate content"
                        />
                        <ToggleSwitch
                          enabled={contentSettings.enableDownloads}
                          onChange={() => {
                            setContentSettings({ ...contentSettings, enableDownloads: !contentSettings.enableDownloads });
                            setHasUnsavedChanges(true);
                          }}
                          label="Enable Downloads"
                          description="Allow users to download content files"
                        />
                      </div>
                    </div>
                  </div>
                )
              }

              {/* Add other sections here as needed */}
            </div >
          </main >
        </div >
      </div >
    </div >
  );
}
