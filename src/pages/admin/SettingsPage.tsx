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
  FolderOpen,
  CreditCard
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
    // Analytics
    googleAnalytics: '',
    facebookPixel: '',

    // AI Settings
    enableAI: false,
    aiProvider: 'openai', // openai, anthropic, google, deepseek
    openAIApiKey: '',
    anthropicApiKey: '',
    googleApiKey: '',
    deepSeekApiKey: '',
    aiModel: 'gpt-3.5-turbo',

    // Video Conferencing Settings
    enableVideoConferencing: false,
    videoProvider: 'zoom', // zoom, google-meet, jitsi, teams
    // Zoom
    zoomApiKey: '',
    zoomApiSecret: '',
    // Google Meet
    googleMeetClientId: '',
    googleMeetClientSecret: '',
    // Jitsi
    jitsiServerUrl: 'https://meet.jit.si',
    // Microsoft Teams
    teamsTenantId: '',
    teamsClientId: '',
    teamsSecret: '',

    // Storage Settings
    enableAWS: false,
    awsAccessKey: '',
    awsSecretKey: '',
    awsBucketName: '',
    awsRegion: 'us-east-1',

    // Communication Settings
    enableSlack: false,
    slackWebhook: '',
    enableMicrosoftTeams: false, // For notifications
    teamsWebhook: ''
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

  const handleTestEmail = async () => {
    if (!emailSettings.testEmail) {
      showError('Please enter a test email address');
      return;
    }

    try {
      await api.post('/settings/test-email', { email: emailSettings.testEmail });
      showSuccess(`Test email sent to ${emailSettings.testEmail}`);
    } catch (error) {
      console.error('Test email error:', error);
      showError('Failed to send test email. Please check your SMTP settings.');
    }
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

              {
                activeSection === 'notifications' && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Bell size={20} className="text-yellow-600" />
                        Notification Channels
                      </h3>
                      <div className="space-y-3">
                        <ToggleSwitch
                          enabled={notificationSettings.emailNotifications}
                          onChange={() => {
                            setNotificationSettings({ ...notificationSettings, emailNotifications: !notificationSettings.emailNotifications });
                            setHasUnsavedChanges(true);
                          }}
                          label="Email Notifications"
                          description="Send notifications via email"
                        />
                        <ToggleSwitch
                          enabled={notificationSettings.pushNotifications}
                          onChange={() => {
                            setNotificationSettings({ ...notificationSettings, pushNotifications: !notificationSettings.pushNotifications });
                            setHasUnsavedChanges(true);
                          }}
                          label="Push Notifications"
                          description="Send push notifications to devices"
                        />
                        <ToggleSwitch
                          enabled={notificationSettings.smsNotifications}
                          onChange={() => {
                            setNotificationSettings({ ...notificationSettings, smsNotifications: !notificationSettings.smsNotifications });
                            setHasUnsavedChanges(true);
                          }}
                          label="SMS Notifications"
                          description="Send notifications via SMS (requires integration)"
                        />
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <MessageSquare size={20} className="text-purple-600" />
                        Notification Events
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <ToggleSwitch
                            enabled={notificationSettings.courseUpdates}
                            onChange={() => {
                              setNotificationSettings({ ...notificationSettings, courseUpdates: !notificationSettings.courseUpdates });
                              setHasUnsavedChanges(true);
                            }}
                            label="Course Updates"
                            description="Notify when course content is updated"
                          />
                          <ToggleSwitch
                            enabled={notificationSettings.assignmentReminders}
                            onChange={() => {
                              setNotificationSettings({ ...notificationSettings, assignmentReminders: !notificationSettings.assignmentReminders });
                              setHasUnsavedChanges(true);
                            }}
                            label="Assignment Reminders"
                            description="Remind users of upcoming due dates"
                          />
                          <ToggleSwitch
                            enabled={notificationSettings.deadlineAlerts}
                            onChange={() => {
                              setNotificationSettings({ ...notificationSettings, deadlineAlerts: !notificationSettings.deadlineAlerts });
                              setHasUnsavedChanges(true);
                            }}
                            label="Deadline Alerts"
                            description="Notify when a deadline is approaching"
                          />
                        </div>
                        <div className="space-y-3">
                          <ToggleSwitch
                            enabled={notificationSettings.systemAnnouncements}
                            onChange={() => {
                              setNotificationSettings({ ...notificationSettings, systemAnnouncements: !notificationSettings.systemAnnouncements });
                              setHasUnsavedChanges(true);
                            }}
                            label="System Announcements"
                            description="Notify about system maintenance and updates"
                          />
                          <ToggleSwitch
                            enabled={notificationSettings.newContentAlerts}
                            onChange={() => {
                              setNotificationSettings({ ...notificationSettings, newContentAlerts: !notificationSettings.newContentAlerts });
                              setHasUnsavedChanges(true);
                            }}
                            label="New Content Alerts"
                            description="Notify when new content is available"
                          />
                          <ToggleSwitch
                            enabled={notificationSettings.completionCertificates}
                            onChange={() => {
                              setNotificationSettings({ ...notificationSettings, completionCertificates: !notificationSettings.completionCertificates });
                              setHasUnsavedChanges(true);
                            }}
                            label="Completion Certificates"
                            description="Notify when a certificate is earned"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }

              {
                activeSection === 'security' && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Lock size={20} className="text-red-600" />
                        Authentication Security
                      </h3>
                      <div className="space-y-3">
                        <ToggleSwitch
                          enabled={securitySettings.twoFactorAuth}
                          onChange={() => {
                            setSecuritySettings({ ...securitySettings, twoFactorAuth: !securitySettings.twoFactorAuth });
                            setHasUnsavedChanges(true);
                          }}
                          label="Two-Factor Authentication (2FA)"
                          description="Require 2FA for all users"
                        />
                        <ToggleSwitch
                          enabled={securitySettings.require2FAForAdmins}
                          onChange={() => {
                            setSecuritySettings({ ...securitySettings, require2FAForAdmins: !securitySettings.require2FAForAdmins });
                            setHasUnsavedChanges(true);
                          }}
                          label="Require 2FA for Admins"
                          description="Enforce 2FA for administrative accounts"
                        />
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Shield size={20} className="text-blue-600" />
                        Password Policy
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Password Expiry (Days)</label>
                          <input
                            type="number"
                            min="0"
                            max="365"
                            value={securitySettings.passwordExpiry}
                            onChange={(e) => {
                              setSecuritySettings({ ...securitySettings, passwordExpiry: parseInt(e.target.value) });
                              setHasUnsavedChanges(true);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                          <p className="text-xs text-gray-500 mt-1">Set to 0 to disable expiry</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Password History</label>
                          <input
                            type="number"
                            min="0"
                            max="10"
                            value={securitySettings.passwordHistory}
                            onChange={(e) => {
                              setSecuritySettings({ ...securitySettings, passwordHistory: parseInt(e.target.value) });
                              setHasUnsavedChanges(true);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                          <p className="text-xs text-gray-500 mt-1">Number of previous passwords to remember</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <AlertTriangle size={20} className="text-orange-600" />
                        Login Protection
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={securitySettings.maxLoginAttempts}
                            onChange={(e) => {
                              setSecuritySettings({ ...securitySettings, maxLoginAttempts: parseInt(e.target.value) });
                              setHasUnsavedChanges(true);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Lockout Duration (Minutes)</label>
                          <input
                            type="number"
                            min="1"
                            max="1440"
                            value={securitySettings.lockoutDuration}
                            onChange={(e) => {
                              setSecuritySettings({ ...securitySettings, lockoutDuration: parseInt(e.target.value) });
                              setHasUnsavedChanges(true);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }

              {
                activeSection === 'email' && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Mail size={20} className="text-indigo-600" />
                        SMTP Configuration
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
                          <input
                            type="text"
                            value={emailSettings.smtpHost}
                            onChange={(e) => {
                              setEmailSettings({ ...emailSettings, smtpHost: e.target.value });
                              setHasUnsavedChanges(true);
                            }}
                            placeholder="smtp.example.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
                          <input
                            type="number"
                            value={emailSettings.smtpPort}
                            onChange={(e) => {
                              setEmailSettings({ ...emailSettings, smtpPort: parseInt(e.target.value) || 0 });
                              setHasUnsavedChanges(true);
                            }}
                            placeholder="587"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">SMTP User</label>
                          <input
                            type="text"
                            value={emailSettings.smtpUser}
                            onChange={(e) => {
                              setEmailSettings({ ...emailSettings, smtpUser: e.target.value });
                              setHasUnsavedChanges(true);
                            }}
                            placeholder="user@example.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Password</label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              value={emailSettings.smtpPassword}
                              onChange={(e) => {
                                setEmailSettings({ ...emailSettings, smtpPassword: e.target.value });
                                setHasUnsavedChanges(true);
                              }}
                              placeholder="••••••••"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <MessageSquare size={20} className="text-green-600" />
                        Sender Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">From Email</label>
                          <input
                            type="email"
                            value={emailSettings.fromEmail}
                            onChange={(e) => {
                              setEmailSettings({ ...emailSettings, fromEmail: e.target.value });
                              setHasUnsavedChanges(true);
                            }}
                            placeholder="noreply@example.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">From Name</label>
                          <input
                            type="text"
                            value={emailSettings.fromName}
                            onChange={(e) => {
                              setEmailSettings({ ...emailSettings, fromName: e.target.value });
                              setHasUnsavedChanges(true);
                            }}
                            placeholder="Knowledge Center"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-4">Test Configuration</h4>
                      <div className="flex gap-4 items-end">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Test Email Recipient</label>
                          <input
                            type="email"
                            value={emailSettings.testEmail}
                            onChange={(e) => setEmailSettings({ ...emailSettings, testEmail: e.target.value })}
                            placeholder="your-email@example.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <button
                          onClick={handleTestEmail}
                          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors h-[42px]"
                        >
                          <Mail size={16} />
                          Send Test Email
                        </button>
                      </div>
                    </div>
                  </div>
                )
              }

              {
                activeSection === 'integrations' && (
                  <div className="space-y-6">
                    {/* Analytics */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <BarChart3 size={20} className="text-blue-600" />
                        Analytics & Tracking
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Google Analytics ID</label>
                          <input
                            type="text"
                            value={integrationSettings.googleAnalytics}
                            onChange={(e) => {
                              setIntegrationSettings({ ...integrationSettings, googleAnalytics: e.target.value });
                              setHasUnsavedChanges(true);
                            }}
                            placeholder="G-XXXXXXXXXX"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Facebook Pixel ID</label>
                          <input
                            type="text"
                            value={integrationSettings.facebookPixel}
                            onChange={(e) => {
                              setIntegrationSettings({ ...integrationSettings, facebookPixel: e.target.value });
                              setHasUnsavedChanges(true);
                            }}
                            placeholder="XXXXXXXXXXXXXXX"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    {/* AI Services */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Zap size={20} className="text-yellow-500" />
                        AI Services
                      </h3>
                      <div className="space-y-4">
                        <ToggleSwitch
                          enabled={integrationSettings.enableAI}
                          onChange={() => {
                            setIntegrationSettings({ ...integrationSettings, enableAI: !integrationSettings.enableAI });
                            setHasUnsavedChanges(true);
                          }}
                          label="Enable AI Integration"
                          description="Use AI for content generation and assistance"
                        />
                        {integrationSettings.enableAI && (
                          <div className="space-y-4 pl-4 border-l-2 border-gray-100">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">AI Provider</label>
                              <select
                                value={integrationSettings.aiProvider}
                                onChange={(e) => {
                                  setIntegrationSettings({ ...integrationSettings, aiProvider: e.target.value });
                                  setHasUnsavedChanges(true);
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              >
                                <option value="openai">OpenAI</option>
                                <option value="anthropic">Anthropic (Claude)</option>
                                <option value="google">Google (Gemini)</option>
                                <option value="deepseek">DeepSeek</option>
                              </select>
                            </div>

                            {integrationSettings.aiProvider === 'openai' && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                                  <input
                                    type="password"
                                    value={integrationSettings.openAIApiKey}
                                    onChange={(e) => {
                                      setIntegrationSettings({ ...integrationSettings, openAIApiKey: e.target.value });
                                      setHasUnsavedChanges(true);
                                    }}
                                    placeholder="sk-..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                                  <select
                                    value={integrationSettings.aiModel}
                                    onChange={(e) => {
                                      setIntegrationSettings({ ...integrationSettings, aiModel: e.target.value });
                                      setHasUnsavedChanges(true);
                                    }}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  >
                                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                                    <option value="gpt-4">GPT-4</option>
                                    <option value="gpt-4-turbo">GPT-4 Turbo</option>
                                  </select>
                                </div>
                              </div>
                            )}

                            {integrationSettings.aiProvider === 'anthropic' && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                                  <input
                                    type="password"
                                    value={integrationSettings.anthropicApiKey}
                                    onChange={(e) => {
                                      setIntegrationSettings({ ...integrationSettings, anthropicApiKey: e.target.value });
                                      setHasUnsavedChanges(true);
                                    }}
                                    placeholder="sk-ant-..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                                  <select
                                    value={integrationSettings.aiModel}
                                    onChange={(e) => {
                                      setIntegrationSettings({ ...integrationSettings, aiModel: e.target.value });
                                      setHasUnsavedChanges(true);
                                    }}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  >
                                    <option value="claude-3-opus">Claude 3 Opus</option>
                                    <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                                    <option value="claude-3-haiku">Claude 3 Haiku</option>
                                  </select>
                                </div>
                              </div>
                            )}

                            {integrationSettings.aiProvider === 'google' && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                                  <input
                                    type="password"
                                    value={integrationSettings.googleApiKey}
                                    onChange={(e) => {
                                      setIntegrationSettings({ ...integrationSettings, googleApiKey: e.target.value });
                                      setHasUnsavedChanges(true);
                                    }}
                                    placeholder="AIza..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                                  <select
                                    value={integrationSettings.aiModel}
                                    onChange={(e) => {
                                      setIntegrationSettings({ ...integrationSettings, aiModel: e.target.value });
                                      setHasUnsavedChanges(true);
                                    }}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  >
                                    <option value="gemini-pro">Gemini Pro</option>
                                    <option value="gemini-ultra">Gemini Ultra</option>
                                  </select>
                                </div>
                              </div>
                            )}

                            {integrationSettings.aiProvider === 'deepseek' && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                                  <input
                                    type="password"
                                    value={integrationSettings.deepSeekApiKey}
                                    onChange={(e) => {
                                      setIntegrationSettings({ ...integrationSettings, deepSeekApiKey: e.target.value });
                                      setHasUnsavedChanges(true);
                                    }}
                                    placeholder="sk-..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                                  <select
                                    value={integrationSettings.aiModel}
                                    onChange={(e) => {
                                      setIntegrationSettings({ ...integrationSettings, aiModel: e.target.value });
                                      setHasUnsavedChanges(true);
                                    }}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  >
                                    <option value="deepseek-chat">DeepSeek Chat</option>
                                    <option value="deepseek-coder">DeepSeek Coder</option>
                                  </select>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>



                    {/* Video Conferencing */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Video size={20} className="text-blue-500" />
                        Video Conferencing
                      </h3>
                      <div className="space-y-4">
                        <ToggleSwitch
                          enabled={integrationSettings.enableVideoConferencing}
                          onChange={() => {
                            setIntegrationSettings({ ...integrationSettings, enableVideoConferencing: !integrationSettings.enableVideoConferencing });
                            setHasUnsavedChanges(true);
                          }}
                          label="Enable Video Conferencing"
                          description="Create meetings for live sessions"
                        />
                        {integrationSettings.enableVideoConferencing && (
                          <div className="space-y-4 pl-4 border-l-2 border-gray-100">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Provider</label>
                              <select
                                value={integrationSettings.videoProvider}
                                onChange={(e) => {
                                  setIntegrationSettings({ ...integrationSettings, videoProvider: e.target.value });
                                  setHasUnsavedChanges(true);
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              >
                                <option value="zoom">Zoom</option>
                                <option value="google-meet">Google Meet</option>
                                <option value="jitsi">Jitsi Meet</option>
                                <option value="teams">Microsoft Teams</option>
                              </select>
                            </div>

                            {integrationSettings.videoProvider === 'zoom' && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                                  <input
                                    type="text"
                                    value={integrationSettings.zoomApiKey}
                                    onChange={(e) => {
                                      setIntegrationSettings({ ...integrationSettings, zoomApiKey: e.target.value });
                                      setHasUnsavedChanges(true);
                                    }}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">API Secret</label>
                                  <input
                                    type="password"
                                    value={integrationSettings.zoomApiSecret}
                                    onChange={(e) => {
                                      setIntegrationSettings({ ...integrationSettings, zoomApiSecret: e.target.value });
                                      setHasUnsavedChanges(true);
                                    }}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  />
                                </div>
                              </div>
                            )}

                            {integrationSettings.videoProvider === 'google-meet' && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Client ID</label>
                                  <input
                                    type="text"
                                    value={integrationSettings.googleMeetClientId}
                                    onChange={(e) => {
                                      setIntegrationSettings({ ...integrationSettings, googleMeetClientId: e.target.value });
                                      setHasUnsavedChanges(true);
                                    }}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Client Secret</label>
                                  <input
                                    type="password"
                                    value={integrationSettings.googleMeetClientSecret}
                                    onChange={(e) => {
                                      setIntegrationSettings({ ...integrationSettings, googleMeetClientSecret: e.target.value });
                                      setHasUnsavedChanges(true);
                                    }}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  />
                                </div>
                              </div>
                            )}

                            {integrationSettings.videoProvider === 'jitsi' && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Server URL</label>
                                <input
                                  type="text"
                                  value={integrationSettings.jitsiServerUrl}
                                  onChange={(e) => {
                                    setIntegrationSettings({ ...integrationSettings, jitsiServerUrl: e.target.value });
                                    setHasUnsavedChanges(true);
                                  }}
                                  placeholder="https://meet.jit.si"
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                              </div>
                            )}

                            {integrationSettings.videoProvider === 'teams' && (
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Tenant ID</label>
                                  <input
                                    type="text"
                                    value={integrationSettings.teamsTenantId}
                                    onChange={(e) => {
                                      setIntegrationSettings({ ...integrationSettings, teamsTenantId: e.target.value });
                                      setHasUnsavedChanges(true);
                                    }}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Client ID</label>
                                  <input
                                    type="text"
                                    value={integrationSettings.teamsClientId}
                                    onChange={(e) => {
                                      setIntegrationSettings({ ...integrationSettings, teamsClientId: e.target.value });
                                      setHasUnsavedChanges(true);
                                    }}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Client Secret</label>
                                  <input
                                    type="password"
                                    value={integrationSettings.teamsSecret}
                                    onChange={(e) => {
                                      setIntegrationSettings({ ...integrationSettings, teamsSecret: e.target.value });
                                      setHasUnsavedChanges(true);
                                    }}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Storage */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Database size={20} className="text-orange-600" />
                        Cloud Storage (AWS S3)
                      </h3>
                      <div className="space-y-4">
                        <ToggleSwitch
                          enabled={integrationSettings.enableAWS}
                          onChange={() => {
                            setIntegrationSettings({ ...integrationSettings, enableAWS: !integrationSettings.enableAWS });
                            setHasUnsavedChanges(true);
                          }}
                          label="Enable AWS S3 Storage"
                          description="Store files in AWS S3 bucket"
                        />
                        {integrationSettings.enableAWS && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-4 border-l-2 border-gray-100">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Access Key ID</label>
                              <input
                                type="text"
                                value={integrationSettings.awsAccessKey}
                                onChange={(e) => {
                                  setIntegrationSettings({ ...integrationSettings, awsAccessKey: e.target.value });
                                  setHasUnsavedChanges(true);
                                }}
                                placeholder="AKIA..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Secret Access Key</label>
                              <input
                                type="password"
                                value={integrationSettings.awsSecretKey}
                                onChange={(e) => {
                                  setIntegrationSettings({ ...integrationSettings, awsSecretKey: e.target.value });
                                  setHasUnsavedChanges(true);
                                }}
                                placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Bucket Name</label>
                              <input
                                type="text"
                                value={integrationSettings.awsBucketName}
                                onChange={(e) => {
                                  setIntegrationSettings({ ...integrationSettings, awsBucketName: e.target.value });
                                  setHasUnsavedChanges(true);
                                }}
                                placeholder="my-bucket"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                              <input
                                type="text"
                                value={integrationSettings.awsRegion}
                                onChange={(e) => {
                                  setIntegrationSettings({ ...integrationSettings, awsRegion: e.target.value });
                                  setHasUnsavedChanges(true);
                                }}
                                placeholder="us-east-1"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Communication */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <MessageSquare size={20} className="text-purple-600" />
                        Communication Channels
                      </h3>
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <ToggleSwitch
                            enabled={integrationSettings.enableSlack}
                            onChange={() => {
                              setIntegrationSettings({ ...integrationSettings, enableSlack: !integrationSettings.enableSlack });
                              setHasUnsavedChanges(true);
                            }}
                            label="Enable Slack Integration"
                            description="Send notifications to Slack channels"
                          />
                          {integrationSettings.enableSlack && (
                            <div className="pl-4 border-l-2 border-gray-100">
                              <label className="block text-sm font-medium text-gray-700 mb-2">Webhook URL</label>
                              <input
                                type="text"
                                value={integrationSettings.slackWebhook}
                                onChange={(e) => {
                                  setIntegrationSettings({ ...integrationSettings, slackWebhook: e.target.value });
                                  setHasUnsavedChanges(true);
                                }}
                                placeholder="https://hooks.slack.com/services/..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              />
                            </div>
                          )}
                        </div>

                        <div className="space-y-4">
                          <ToggleSwitch
                            enabled={integrationSettings.enableMicrosoftTeams}
                            onChange={() => {
                              setIntegrationSettings({ ...integrationSettings, enableMicrosoftTeams: !integrationSettings.enableMicrosoftTeams });
                              setHasUnsavedChanges(true);
                            }}
                            label="Enable Microsoft Teams"
                            description="Send notifications to Teams channels"
                          />
                          {integrationSettings.enableMicrosoftTeams && (
                            <div className="pl-4 border-l-2 border-gray-100">
                              <label className="block text-sm font-medium text-gray-700 mb-2">Webhook URL</label>
                              <input
                                type="text"
                                value={integrationSettings.teamsWebhook}
                                onChange={(e) => {
                                  setIntegrationSettings({ ...integrationSettings, teamsWebhook: e.target.value });
                                  setHasUnsavedChanges(true);
                                }}
                                placeholder="https://outlook.office.com/webhook/..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }
              {
                activeSection === 'gamification' && (
                  <div className="space-y-6">
                    {/* Points Configuration */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Award size={20} className="text-yellow-500" />
                        Points Configuration
                      </h3>
                      <div className="space-y-4">
                        <ToggleSwitch
                          enabled={gamificationSettings.enableGamification}
                          onChange={() => {
                            setGamificationSettings({ ...gamificationSettings, enableGamification: !gamificationSettings.enableGamification });
                            setHasUnsavedChanges(true);
                          }}
                          label="Enable Gamification"
                          description="Award points and badges to users"
                        />
                        {gamificationSettings.enableGamification && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pl-4 border-l-2 border-gray-100">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Points per Course</label>
                              <input
                                type="number"
                                value={gamificationSettings.pointsPerCourse}
                                onChange={(e) => {
                                  setGamificationSettings({ ...gamificationSettings, pointsPerCourse: parseInt(e.target.value) });
                                  setHasUnsavedChanges(true);
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Points per Assessment</label>
                              <input
                                type="number"
                                value={gamificationSettings.pointsPerAssessment}
                                onChange={(e) => {
                                  setGamificationSettings({ ...gamificationSettings, pointsPerAssessment: parseInt(e.target.value) });
                                  setHasUnsavedChanges(true);
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Points per Perfect Score</label>
                              <input
                                type="number"
                                value={gamificationSettings.pointsPerPerfectScore}
                                onChange={(e) => {
                                  setGamificationSettings({ ...gamificationSettings, pointsPerPerfectScore: parseInt(e.target.value) });
                                  setHasUnsavedChanges(true);
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Zap size={20} className="text-purple-500" />
                        Features
                      </h3>
                      <div className="space-y-4">
                        <ToggleSwitch
                          enabled={gamificationSettings.enableBadges}
                          onChange={() => {
                            setGamificationSettings({ ...gamificationSettings, enableBadges: !gamificationSettings.enableBadges });
                            setHasUnsavedChanges(true);
                          }}
                          label="Enable Badges"
                          description="Award badges for achievements"
                        />
                        <ToggleSwitch
                          enabled={gamificationSettings.enableLeaderboards}
                          onChange={() => {
                            setGamificationSettings({ ...gamificationSettings, enableLeaderboards: !gamificationSettings.enableLeaderboards });
                            setHasUnsavedChanges(true);
                          }}
                          label="Enable Leaderboards"
                          description="Show top performing users"
                        />
                        {gamificationSettings.enableLeaderboards && (
                          <div className="pl-4 border-l-2 border-gray-100">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Leaderboard Period</label>
                            <select
                              value={gamificationSettings.leaderboardPeriod}
                              onChange={(e) => {
                                setGamificationSettings({ ...gamificationSettings, leaderboardPeriod: e.target.value });
                                setHasUnsavedChanges(true);
                              }}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                              <option value="weekly">Weekly</option>
                              <option value="monthly">Monthly</option>
                              <option value="all-time">All Time</option>
                            </select>
                          </div>
                        )}
                        <ToggleSwitch
                          enabled={gamificationSettings.enableCertificates}
                          onChange={() => {
                            setGamificationSettings({ ...gamificationSettings, enableCertificates: !gamificationSettings.enableCertificates });
                            setHasUnsavedChanges(true);
                          }}
                          label="Enable Certificates"
                          description="Award certificates for course completion"
                        />
                      </div>
                    </div>
                  </div>
                )
              }
              {
                activeSection === 'learning-paths' && (
                  <div className="space-y-6">
                    {/* Structure & Flow */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Zap size={20} className="text-teal-600" />
                        Structure & Flow
                      </h3>
                      <div className="space-y-4">
                        <ToggleSwitch
                          enabled={learningPathSettings.enablePrerequisites}
                          onChange={() => {
                            setLearningPathSettings({ ...learningPathSettings, enablePrerequisites: !learningPathSettings.enablePrerequisites });
                            setHasUnsavedChanges(true);
                          }}
                          label="Enable Prerequisites"
                          description="Require completion of specific content before proceeding"
                        />
                        <ToggleSwitch
                          enabled={learningPathSettings.enableSequentialLearning}
                          onChange={() => {
                            setLearningPathSettings({ ...learningPathSettings, enableSequentialLearning: !learningPathSettings.enableSequentialLearning });
                            setHasUnsavedChanges(true);
                          }}
                          label="Sequential Learning"
                          description="Force users to complete content in a specific order"
                        />
                        <ToggleSwitch
                          enabled={learningPathSettings.allowSkipping}
                          onChange={() => {
                            setLearningPathSettings({ ...learningPathSettings, allowSkipping: !learningPathSettings.allowSkipping });
                            setHasUnsavedChanges(true);
                          }}
                          label="Allow Skipping"
                          description="Allow users to skip content they already know"
                        />
                        <ToggleSwitch
                          enabled={learningPathSettings.enableBranching}
                          onChange={() => {
                            setLearningPathSettings({ ...learningPathSettings, enableBranching: !learningPathSettings.enableBranching });
                            setHasUnsavedChanges(true);
                          }}
                          label="Enable Branching"
                          description="Create adaptive learning paths based on performance"
                        />
                      </div>
                    </div>

                    {/* Completion & Tracking */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <BarChart3 size={20} className="text-blue-600" />
                        Completion & Tracking
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Completion Threshold (%)</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={learningPathSettings.completionThreshold}
                            onChange={(e) => {
                              setLearningPathSettings({ ...learningPathSettings, completionThreshold: parseInt(e.target.value) });
                              setHasUnsavedChanges(true);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                          <p className="mt-1 text-sm text-gray-500">Minimum score required to mark content as complete</p>
                        </div>
                        <ToggleSwitch
                          enabled={learningPathSettings.enableTimeTracking}
                          onChange={() => {
                            setLearningPathSettings({ ...learningPathSettings, enableTimeTracking: !learningPathSettings.enableTimeTracking });
                            setHasUnsavedChanges(true);
                          }}
                          label="Enable Time Tracking"
                          description="Track time spent on each learning activity"
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
