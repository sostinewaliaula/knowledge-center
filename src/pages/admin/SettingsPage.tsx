import { useState } from 'react';
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
  Building2
} from 'lucide-react';

interface SettingsPageProps {}

export function SettingsPage({}: SettingsPageProps) {
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
    timezone: 'UTC',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
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

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    setHasUnsavedChanges(false);
    alert('Settings saved successfully!');
  };

  const handleTestEmail = () => {
    if (!emailSettings.testEmail) {
      alert('Please enter a test email address');
      return;
    }
    alert(`Test email sent to ${emailSettings.testEmail}`);
  };

  const ToggleSwitch = ({ enabled, onChange, label, description, warning }: { 
    enabled: boolean; 
    onChange: () => void; 
    label: string; 
    description?: string;
    warning?: boolean;
  }) => (
    <div className={`flex items-center justify-between p-4 bg-white border rounded-lg transition-colors ${
      warning ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200 hover:border-purple-300'
    }`}>
      <div className="flex-1">
        <div className="font-medium text-gray-900 mb-1">{label}</div>
        {description && <div className="text-sm text-gray-500">{description}</div>}
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? 'bg-gradient-to-r from-purple-600 to-green-600' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
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
                      className={`w-full px-3 py-2.5 flex items-center gap-3 rounded-lg transition-colors ${
                        activeSection === section.id
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
                              setGeneralSettings({...generalSettings, siteName: e.target.value});
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
                              setGeneralSettings({...generalSettings, siteSubtitle: e.target.value});
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
                            setGeneralSettings({...generalSettings, companyName: e.target.value});
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
                              setGeneralSettings({...generalSettings, timezone: e.target.value});
                              setHasUnsavedChanges(true);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            <option value="UTC">UTC</option>
                            <option value="America/New_York">Eastern Time</option>
                            <option value="America/Chicago">Central Time</option>
                            <option value="America/Denver">Mountain Time</option>
                            <option value="America/Los_Angeles">Pacific Time</option>
                            <option value="Europe/London">London</option>
                            <option value="Asia/Tokyo">Tokyo</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                          <select
                            value={generalSettings.language}
                            onChange={(e) => {
                              setGeneralSettings({...generalSettings, language: e.target.value});
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
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                          <select
                            value={generalSettings.dateFormat}
                            onChange={(e) => {
                              setGeneralSettings({...generalSettings, dateFormat: e.target.value});
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
                              setGeneralSettings({...generalSettings, timeFormat: e.target.value});
                              setHasUnsavedChanges(true);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            <option value="12h">12 Hour</option>
                            <option value="24h">24 Hour</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Image size={20} className="text-blue-600" />
                      Branding
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo</label>
                        <div className="flex items-center gap-4">
                          <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                            {generalSettings.companyLogo ? (
                              <img src={generalSettings.companyLogo} alt="Logo" className="w-full h-full object-contain rounded-lg" />
                            ) : (
                              <Image size={32} className="text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                              <Upload size={16} />
                              Upload Logo
                            </button>
                            <p className="text-xs text-gray-500 mt-2">Recommended: 200x200px, PNG or SVG</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Favicon</label>
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                            {generalSettings.favicon ? (
                              <img src={generalSettings.favicon} alt="Favicon" className="w-full h-full object-contain rounded-lg" />
                            ) : (
                              <Image size={24} className="text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                              <Upload size={16} />
                              Upload Favicon
                            </button>
                            <p className="text-xs text-gray-500 mt-2">Recommended: 32x32px, ICO or PNG</p>
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
                          <button className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${
                            generalSettings.theme === 'light' 
                              ? 'border-purple-500 bg-purple-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}>
                            <Sun size={18} />
                            <span>Light</span>
                          </button>
                          <button className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${
                            generalSettings.theme === 'dark' 
                              ? 'border-purple-500 bg-purple-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}>
                            <Moon size={18} />
                            <span>Dark</span>
                          </button>
                          <button className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${
                            generalSettings.theme === 'auto' 
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
                                setGeneralSettings({...generalSettings, primaryColor: e.target.value});
                                setHasUnsavedChanges(true);
                              }}
                              className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              value={generalSettings.primaryColor}
                              onChange={(e) => {
                                setGeneralSettings({...generalSettings, primaryColor: e.target.value});
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
                                setGeneralSettings({...generalSettings, secondaryColor: e.target.value});
                                setHasUnsavedChanges(true);
                              }}
                              className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              value={generalSettings.secondaryColor}
                              onChange={(e) => {
                                setGeneralSettings({...generalSettings, secondaryColor: e.target.value});
                                setHasUnsavedChanges(true);
                              }}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Continue with other sections... */}
              {activeSection === 'users' && (
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
                          setUserSettings({...userSettings, allowSelfRegistration: !userSettings.allowSelfRegistration});
                          setHasUnsavedChanges(true);
                        }}
                        label="Allow Self Registration"
                        description="Allow users to create their own accounts"
                      />
                      <ToggleSwitch
                        enabled={userSettings.requireEmailVerification}
                        onChange={() => {
                          setUserSettings({...userSettings, requireEmailVerification: !userSettings.requireEmailVerification});
                          setHasUnsavedChanges(true);
                        }}
                        label="Require Email Verification"
                        description="Users must verify their email before accessing the platform"
                      />
                      <ToggleSwitch
                        enabled={userSettings.requirePhoneVerification}
                        onChange={() => {
                          setUserSettings({...userSettings, requirePhoneVerification: !userSettings.requirePhoneVerification});
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
                            setUserSettings({...userSettings, defaultRole: e.target.value});
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
                            setUserSettings({...userSettings, passwordMinLength: parseInt(e.target.value)});
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div className="space-y-2">
                        <ToggleSwitch
                          enabled={userSettings.passwordRequireUppercase}
                          onChange={() => {
                            setUserSettings({...userSettings, passwordRequireUppercase: !userSettings.passwordRequireUppercase});
                            setHasUnsavedChanges(true);
                          }}
                          label="Require Uppercase Letters"
                        />
                        <ToggleSwitch
                          enabled={userSettings.passwordRequireLowercase}
                          onChange={() => {
                            setUserSettings({...userSettings, passwordRequireLowercase: !userSettings.passwordRequireLowercase});
                            setHasUnsavedChanges(true);
                          }}
                          label="Require Lowercase Letters"
                        />
                        <ToggleSwitch
                          enabled={userSettings.passwordRequireNumbers}
                          onChange={() => {
                            setUserSettings({...userSettings, passwordRequireNumbers: !userSettings.passwordRequireNumbers});
                            setHasUnsavedChanges(true);
                          }}
                          label="Require Numbers"
                        />
                        <ToggleSwitch
                          enabled={userSettings.passwordRequireSpecialChars}
                          onChange={() => {
                            setUserSettings({...userSettings, passwordRequireSpecialChars: !userSettings.passwordRequireSpecialChars});
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
                            setUserSettings({...userSettings, sessionTimeout: parseInt(e.target.value)});
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
                            setUserSettings({...userSettings, maxSessionsPerUser: parseInt(e.target.value)});
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
                          setUserSettings({...userSettings, enableProfilePictures: !userSettings.enableProfilePictures});
                          setHasUnsavedChanges(true);
                        }}
                        label="Enable Profile Pictures"
                        description="Allow users to upload profile pictures"
                      />
                      <ToggleSwitch
                        enabled={userSettings.enableUserStatus}
                        onChange={() => {
                          setUserSettings({...userSettings, enableUserStatus: !userSettings.enableUserStatus});
                          setHasUnsavedChanges(true);
                        }}
                        label="Enable User Status"
                        description="Show online/offline status for users"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'content' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Upload size={20} className="text-green-600" />
                      File Upload Limits
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Max File Size (MB)</label>
                        <input
                          type="number"
                          min="1"
                          max="1000"
                          value={contentSettings.maxFileSize}
                          onChange={(e) => {
                            setContentSettings({...contentSettings, maxFileSize: parseInt(e.target.value)});
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Max Video Size (MB)</label>
                        <input
                          type="number"
                          min="1"
                          max="5000"
                          value={contentSettings.maxVideoSize}
                          onChange={(e) => {
                            setContentSettings({...contentSettings, maxVideoSize: parseInt(e.target.value)});
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                            setContentSettings({...contentSettings, maxImageSize: parseInt(e.target.value)});
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <File size={20} className="text-blue-600" />
                      Allowed File Types
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <FileText size={16} />
                          Documents
                        </label>
                        <input
                          type="text"
                          value={contentSettings.allowedFileTypes.join(', ')}
                          onChange={(e) => {
                            setContentSettings({...contentSettings, allowedFileTypes: e.target.value.split(',').map(t => t.trim())});
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="pdf, doc, docx, xls, xlsx"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <Video size={16} />
                          Videos
                        </label>
                        <input
                          type="text"
                          value={contentSettings.allowedVideoTypes.join(', ')}
                          onChange={(e) => {
                            setContentSettings({...contentSettings, allowedVideoTypes: e.target.value.split(',').map(t => t.trim())});
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="mp4, avi, mov, wmv"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <Image size={16} />
                          Images
                        </label>
                        <input
                          type="text"
                          value={contentSettings.allowedImageTypes.join(', ')}
                          onChange={(e) => {
                            setContentSettings({...contentSettings, allowedImageTypes: e.target.value.split(',').map(t => t.trim())});
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="jpg, jpeg, png, gif, webp"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <Music size={16} />
                          Audio
                        </label>
                        <input
                          type="text"
                          value={contentSettings.allowedAudioTypes.join(', ')}
                          onChange={(e) => {
                            setContentSettings({...contentSettings, allowedAudioTypes: e.target.value.split(',').map(t => t.trim())});
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="mp3, wav, ogg, m4a"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <BookOpen size={20} className="text-purple-600" />
                      Content Features
                    </h3>
                    <div className="space-y-3">
                      <ToggleSwitch
                        enabled={contentSettings.autoApproveContent}
                        onChange={() => {
                          setContentSettings({...contentSettings, autoApproveContent: !contentSettings.autoApproveContent});
                          setHasUnsavedChanges(true);
                        }}
                        label="Auto Approve Content"
                        description="Automatically approve uploaded content without review"
                      />
                      <ToggleSwitch
                        enabled={contentSettings.enableComments}
                        onChange={() => {
                          setContentSettings({...contentSettings, enableComments: !contentSettings.enableComments});
                          setHasUnsavedChanges(true);
                        }}
                        label="Enable Comments"
                        description="Allow users to comment on courses and content"
                      />
                      <ToggleSwitch
                        enabled={contentSettings.enableRatings}
                        onChange={() => {
                          setContentSettings({...contentSettings, enableRatings: !contentSettings.enableRatings});
                          setHasUnsavedChanges(true);
                        }}
                        label="Enable Ratings"
                        description="Allow users to rate courses and content"
                      />
                      <ToggleSwitch
                        enabled={contentSettings.enableDownloads}
                        onChange={() => {
                          setContentSettings({...contentSettings, enableDownloads: !contentSettings.enableDownloads});
                          setHasUnsavedChanges(true);
                        }}
                        label="Enable Downloads"
                        description="Allow users to download course materials"
                      />
                      <ToggleSwitch
                        enabled={contentSettings.enableSharing}
                        onChange={() => {
                          setContentSettings({...contentSettings, enableSharing: !contentSettings.enableSharing});
                          setHasUnsavedChanges(true);
                        }}
                        label="Enable Sharing"
                        description="Allow users to share courses and content"
                      />
                      <ToggleSwitch
                        enabled={contentSettings.enableVersioning}
                        onChange={() => {
                          setContentSettings({...contentSettings, enableVersioning: !contentSettings.enableVersioning});
                          setHasUnsavedChanges(true);
                        }}
                        label="Enable Versioning"
                        description="Track content versions and changes"
                      />
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Content Expiry (days, 0 = never)</label>
                      <input
                        type="number"
                        min="0"
                        value={contentSettings.contentExpiryDays}
                        onChange={(e) => {
                          setContentSettings({...contentSettings, contentExpiryDays: parseInt(e.target.value)});
                          setHasUnsavedChanges(true);
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'notifications' && (
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Bell size={20} className="text-yellow-600" />
                    Notification Channels
                  </h3>
                  <div className="space-y-3 mb-6">
                    <ToggleSwitch
                      enabled={notificationSettings.emailNotifications}
                      onChange={() => {
                        setNotificationSettings({...notificationSettings, emailNotifications: !notificationSettings.emailNotifications});
                        setHasUnsavedChanges(true);
                      }}
                      label="Email Notifications"
                      description="Send notifications via email"
                    />
                    <ToggleSwitch
                      enabled={notificationSettings.pushNotifications}
                      onChange={() => {
                        setNotificationSettings({...notificationSettings, pushNotifications: !notificationSettings.pushNotifications});
                        setHasUnsavedChanges(true);
                      }}
                      label="Push Notifications"
                      description="Send browser push notifications"
                    />
                    <ToggleSwitch
                      enabled={notificationSettings.smsNotifications}
                      onChange={() => {
                        setNotificationSettings({...notificationSettings, smsNotifications: !notificationSettings.smsNotifications});
                        setHasUnsavedChanges(true);
                      }}
                      label="SMS Notifications"
                      description="Send notifications via SMS"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-6">Notification Types</h3>
                  <div className="space-y-3">
                    <ToggleSwitch
                      enabled={notificationSettings.courseUpdates}
                      onChange={() => {
                        setNotificationSettings({...notificationSettings, courseUpdates: !notificationSettings.courseUpdates});
                        setHasUnsavedChanges(true);
                      }}
                      label="Course Updates"
                    />
                    <ToggleSwitch
                      enabled={notificationSettings.assignmentReminders}
                      onChange={() => {
                        setNotificationSettings({...notificationSettings, assignmentReminders: !notificationSettings.assignmentReminders});
                        setHasUnsavedChanges(true);
                      }}
                      label="Assignment Reminders"
                    />
                    <ToggleSwitch
                      enabled={notificationSettings.deadlineAlerts}
                      onChange={() => {
                        setNotificationSettings({...notificationSettings, deadlineAlerts: !notificationSettings.deadlineAlerts});
                        setHasUnsavedChanges(true);
                      }}
                      label="Deadline Alerts"
                    />
                    <ToggleSwitch
                      enabled={notificationSettings.systemAnnouncements}
                      onChange={() => {
                        setNotificationSettings({...notificationSettings, systemAnnouncements: !notificationSettings.systemAnnouncements});
                        setHasUnsavedChanges(true);
                      }}
                      label="System Announcements"
                    />
                    <ToggleSwitch
                      enabled={notificationSettings.newContentAlerts}
                      onChange={() => {
                        setNotificationSettings({...notificationSettings, newContentAlerts: !notificationSettings.newContentAlerts});
                        setHasUnsavedChanges(true);
                      }}
                      label="New Content Alerts"
                    />
                    <ToggleSwitch
                      enabled={notificationSettings.completionCertificates}
                      onChange={() => {
                        setNotificationSettings({...notificationSettings, completionCertificates: !notificationSettings.completionCertificates});
                        setHasUnsavedChanges(true);
                      }}
                      label="Completion Certificates"
                    />
                    <ToggleSwitch
                      enabled={notificationSettings.achievementBadges}
                      onChange={() => {
                        setNotificationSettings({...notificationSettings, achievementBadges: !notificationSettings.achievementBadges});
                        setHasUnsavedChanges(true);
                      }}
                      label="Achievement Badges"
                    />
                    <ToggleSwitch
                      enabled={notificationSettings.discussionReplies}
                      onChange={() => {
                        setNotificationSettings({...notificationSettings, discussionReplies: !notificationSettings.discussionReplies});
                        setHasUnsavedChanges(true);
                      }}
                      label="Discussion Replies"
                    />
                    <ToggleSwitch
                      enabled={notificationSettings.mentionNotifications}
                      onChange={() => {
                        setNotificationSettings({...notificationSettings, mentionNotifications: !notificationSettings.mentionNotifications});
                        setHasUnsavedChanges(true);
                      }}
                      label="Mention Notifications"
                    />
                  </div>
                </div>
              )}

              {activeSection === 'security' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Shield size={20} className="text-red-600" />
                      Authentication
                    </h3>
                    <div className="space-y-3 mb-4">
                      <ToggleSwitch
                        enabled={securitySettings.twoFactorAuth}
                        onChange={() => {
                          setSecuritySettings({...securitySettings, twoFactorAuth: !securitySettings.twoFactorAuth});
                          setHasUnsavedChanges(true);
                        }}
                        label="Two-Factor Authentication"
                        description="Require 2FA for all user accounts"
                        warning={!securitySettings.twoFactorAuth}
                      />
                      <ToggleSwitch
                        enabled={securitySettings.require2FAForAdmins}
                        onChange={() => {
                          setSecuritySettings({...securitySettings, require2FAForAdmins: !securitySettings.require2FAForAdmins});
                          setHasUnsavedChanges(true);
                        }}
                        label="Require 2FA for Administrators"
                        description="Mandatory 2FA for admin accounts"
                      />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password Expiry (days)</label>
                        <input
                          type="number"
                          min="30"
                          max="365"
                          value={securitySettings.passwordExpiry}
                          onChange={(e) => {
                            setSecuritySettings({...securitySettings, passwordExpiry: parseInt(e.target.value)});
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password History Count</label>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          value={securitySettings.passwordHistory}
                          onChange={(e) => {
                            setSecuritySettings({...securitySettings, passwordHistory: parseInt(e.target.value)});
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Prevent reuse of last N passwords</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Lock size={20} className="text-orange-600" />
                      Login Security
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
                        <input
                          type="number"
                          min="3"
                          max="10"
                          value={securitySettings.maxLoginAttempts}
                          onChange={(e) => {
                            setSecuritySettings({...securitySettings, maxLoginAttempts: parseInt(e.target.value)});
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Lockout Duration (minutes)</label>
                        <input
                          type="number"
                          min="5"
                          max="60"
                          value={securitySettings.lockoutDuration}
                          onChange={(e) => {
                            setSecuritySettings({...securitySettings, lockoutDuration: parseInt(e.target.value)});
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <ToggleSwitch
                        enabled={securitySettings.autoLogout}
                        onChange={() => {
                          setSecuritySettings({...securitySettings, autoLogout: !securitySettings.autoLogout});
                          setHasUnsavedChanges(true);
                        }}
                        label="Auto Logout on Inactivity"
                        description="Automatically log out users after period of inactivity"
                      />
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Shield size={20} className="text-blue-600" />
                      IP Whitelist
                    </h3>
                    <ToggleSwitch
                      enabled={securitySettings.enableIPWhitelist}
                      onChange={() => {
                        setSecuritySettings({...securitySettings, enableIPWhitelist: !securitySettings.enableIPWhitelist});
                        setHasUnsavedChanges(true);
                      }}
                      label="Enable IP Whitelist"
                      description="Restrict access to specific IP addresses"
                    />
                    {securitySettings.enableIPWhitelist && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Allowed IP Addresses</label>
                        <textarea
                          value={securitySettings.allowedIPs.join('\n')}
                          onChange={(e) => {
                            setSecuritySettings({...securitySettings, allowedIPs: e.target.value.split('\n').filter(ip => ip.trim())});
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          rows={4}
                          placeholder="192.168.1.1&#10;10.0.0.1"
                        />
                        <p className="text-xs text-gray-500 mt-1">Enter one IP address per line</p>
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Database size={20} className="text-green-600" />
                      Data & Privacy
                    </h3>
                    <div className="space-y-4">
                      <ToggleSwitch
                        enabled={securitySettings.enableAuditLog}
                        onChange={() => {
                          setSecuritySettings({...securitySettings, enableAuditLog: !securitySettings.enableAuditLog});
                          setHasUnsavedChanges(true);
                        }}
                        label="Enable Audit Log"
                        description="Track all system activities and changes"
                      />
                      <ToggleSwitch
                        enabled={securitySettings.enableGDPR}
                        onChange={() => {
                          setSecuritySettings({...securitySettings, enableGDPR: !securitySettings.enableGDPR});
                          setHasUnsavedChanges(true);
                        }}
                        label="Enable GDPR Compliance"
                        description="Enable GDPR data protection features"
                      />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Data Retention Period (days)</label>
                        <input
                          type="number"
                          min="30"
                          max="3650"
                          value={securitySettings.dataRetentionDays}
                          onChange={(e) => {
                            setSecuritySettings({...securitySettings, dataRetentionDays: parseInt(e.target.value)});
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'email' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Mail size={20} className="text-blue-600" />
                      SMTP Configuration
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
                          <input
                            type="text"
                            value={emailSettings.smtpHost}
                            onChange={(e) => {
                              setEmailSettings({...emailSettings, smtpHost: e.target.value});
                              setHasUnsavedChanges(true);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="smtp.gmail.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
                          <input
                            type="number"
                            value={emailSettings.smtpPort}
                            onChange={(e) => {
                              setEmailSettings({...emailSettings, smtpPort: parseInt(e.target.value)});
                              setHasUnsavedChanges(true);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                      <ToggleSwitch
                        enabled={emailSettings.smtpSecure}
                        onChange={() => {
                          setEmailSettings({...emailSettings, smtpSecure: !emailSettings.smtpSecure});
                          setHasUnsavedChanges(true);
                        }}
                        label="Use SSL/TLS"
                        description="Enable secure connection"
                      />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Username</label>
                        <input
                          type="text"
                          value={emailSettings.smtpUser}
                          onChange={(e) => {
                            setEmailSettings({...emailSettings, smtpUser: e.target.value});
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={emailSettings.smtpPassword}
                            onChange={(e) => {
                              setEmailSettings({...emailSettings, smtpPassword: e.target.value});
                              setHasUnsavedChanges(true);
                            }}
                            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                          <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">From Email</label>
                          <input
                            type="email"
                            value={emailSettings.fromEmail}
                            onChange={(e) => {
                              setEmailSettings({...emailSettings, fromEmail: e.target.value});
                              setHasUnsavedChanges(true);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">From Name</label>
                          <input
                            type="text"
                            value={emailSettings.fromName}
                            onChange={(e) => {
                              setEmailSettings({...emailSettings, fromName: e.target.value});
                              setHasUnsavedChanges(true);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Reply-To Email</label>
                        <input
                          type="email"
                          value={emailSettings.replyToEmail}
                          onChange={(e) => {
                            setEmailSettings({...emailSettings, replyToEmail: e.target.value});
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Info size={18} className="text-blue-600 mt-0.5" />
                          <div className="text-sm text-blue-700">
                            <p className="font-medium mb-1">Email Configuration</p>
                            <p>Configure your SMTP settings to enable email notifications. Test your configuration before saving.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <TestTube size={20} className="text-green-600" />
                      Test Email Configuration
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Test Email Address</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="email"
                            value={emailSettings.testEmail}
                            onChange={(e) => {
                              setEmailSettings({...emailSettings, testEmail: e.target.value});
                            }}
                            placeholder="test@example.com"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                          <button
                            onClick={handleTestEmail}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-2"
                          >
                            <Mail size={16} />
                            Send Test
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'integrations' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <BarChart3 size={20} className="text-blue-600" />
                      Analytics
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Google Analytics ID</label>
                        <input
                          type="text"
                          value={integrationSettings.googleAnalytics}
                          onChange={(e) => {
                            setIntegrationSettings({...integrationSettings, googleAnalytics: e.target.value});
                            setHasUnsavedChanges(true);
                          }}
                          placeholder="G-XXXXXXXXXX"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Facebook Pixel ID</label>
                        <input
                          type="text"
                          value={integrationSettings.facebookPixel}
                          onChange={(e) => {
                            setIntegrationSettings({...integrationSettings, facebookPixel: e.target.value});
                            setHasUnsavedChanges(true);
                          }}
                          placeholder="1234567890"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Video size={20} className="text-purple-600" />
                      Video Conferencing
                    </h3>
                    <div className="space-y-4">
                      <ToggleSwitch
                        enabled={integrationSettings.enableZoom}
                        onChange={() => {
                          setIntegrationSettings({...integrationSettings, enableZoom: !integrationSettings.enableZoom});
                          setHasUnsavedChanges(true);
                        }}
                        label="Enable Zoom Integration"
                        description="Integrate Zoom for live sessions"
                      />
                      {integrationSettings.enableZoom && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Zoom API Key</label>
                            <input
                              type="text"
                              value={integrationSettings.zoomApiKey}
                              onChange={(e) => {
                                setIntegrationSettings({...integrationSettings, zoomApiKey: e.target.value});
                                setHasUnsavedChanges(true);
                              }}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Zoom API Secret</label>
                            <div className="relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                value={integrationSettings.zoomApiSecret}
                                onChange={(e) => {
                                  setIntegrationSettings({...integrationSettings, zoomApiSecret: e.target.value});
                                  setHasUnsavedChanges(true);
                                }}
                                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                              <button
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <MessageSquare size={20} className="text-green-600" />
                      Communication Platforms
                    </h3>
                    <div className="space-y-4">
                      <ToggleSwitch
                        enabled={integrationSettings.enableSlack}
                        onChange={() => {
                          setIntegrationSettings({...integrationSettings, enableSlack: !integrationSettings.enableSlack});
                          setHasUnsavedChanges(true);
                        }}
                        label="Enable Slack Integration"
                      />
                      {integrationSettings.enableSlack && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Slack Webhook URL</label>
                          <input
                            type="url"
                            value={integrationSettings.slackWebhook}
                            onChange={(e) => {
                              setIntegrationSettings({...integrationSettings, slackWebhook: e.target.value});
                              setHasUnsavedChanges(true);
                            }}
                            placeholder="https://hooks.slack.com/services/..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      )}
                      <ToggleSwitch
                        enabled={integrationSettings.enableMicrosoftTeams}
                        onChange={() => {
                          setIntegrationSettings({...integrationSettings, enableMicrosoftTeams: !integrationSettings.enableMicrosoftTeams});
                          setHasUnsavedChanges(true);
                        }}
                        label="Enable Microsoft Teams Integration"
                      />
                      {integrationSettings.enableMicrosoftTeams && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Teams Webhook URL</label>
                          <input
                            type="url"
                            value={integrationSettings.teamsWebhook}
                            onChange={(e) => {
                              setIntegrationSettings({...integrationSettings, teamsWebhook: e.target.value});
                              setHasUnsavedChanges(true);
                            }}
                            placeholder="https://outlook.office.com/webhook/..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <LinkIcon size={20} className="text-orange-600" />
                      LTI Integration
                    </h3>
                    <div className="space-y-4">
                      <ToggleSwitch
                        enabled={integrationSettings.enableLTI}
                        onChange={() => {
                          setIntegrationSettings({...integrationSettings, enableLTI: !integrationSettings.enableLTI});
                          setHasUnsavedChanges(true);
                        }}
                        label="Enable LTI (Learning Tools Interoperability)"
                        description="Allow integration with external learning tools"
                      />
                      {integrationSettings.enableLTI && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">LTI Consumer Key</label>
                            <input
                              type="text"
                              value={integrationSettings.ltiConsumerKey}
                              onChange={(e) => {
                                setIntegrationSettings({...integrationSettings, ltiConsumerKey: e.target.value});
                                setHasUnsavedChanges(true);
                              }}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">LTI Consumer Secret</label>
                            <div className="relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                value={integrationSettings.ltiConsumerSecret}
                                onChange={(e) => {
                                  setIntegrationSettings({...integrationSettings, ltiConsumerSecret: e.target.value});
                                  setHasUnsavedChanges(true);
                                }}
                                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                              <button
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'gamification' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Award size={20} className="text-yellow-600" />
                      Gamification Features
                    </h3>
                    <div className="space-y-3">
                      <ToggleSwitch
                        enabled={gamificationSettings.enableGamification}
                        onChange={() => {
                          setGamificationSettings({...gamificationSettings, enableGamification: !gamificationSettings.enableGamification});
                          setHasUnsavedChanges(true);
                        }}
                        label="Enable Gamification"
                        description="Turn on gamification features for the platform"
                      />
                      <ToggleSwitch
                        enabled={gamificationSettings.enableBadges}
                        onChange={() => {
                          setGamificationSettings({...gamificationSettings, enableBadges: !gamificationSettings.enableBadges});
                          setHasUnsavedChanges(true);
                        }}
                        label="Enable Badges"
                        description="Allow users to earn achievement badges"
                      />
                      <ToggleSwitch
                        enabled={gamificationSettings.enableLeaderboards}
                        onChange={() => {
                          setGamificationSettings({...gamificationSettings, enableLeaderboards: !gamificationSettings.enableLeaderboards});
                          setHasUnsavedChanges(true);
                        }}
                        label="Enable Leaderboards"
                        description="Show user rankings and leaderboards"
                      />
                      <ToggleSwitch
                        enabled={gamificationSettings.enableCertificates}
                        onChange={() => {
                          setGamificationSettings({...gamificationSettings, enableCertificates: !gamificationSettings.enableCertificates});
                          setHasUnsavedChanges(true);
                        }}
                        label="Enable Certificates"
                        description="Issue completion certificates"
                      />
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Award size={20} className="text-purple-600" />
                      Points System
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Points per Course Completion</label>
                        <input
                          type="number"
                          min="0"
                          value={gamificationSettings.pointsPerCourse}
                          onChange={(e) => {
                            setGamificationSettings({...gamificationSettings, pointsPerCourse: parseInt(e.target.value)});
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Points per Assessment</label>
                        <input
                          type="number"
                          min="0"
                          value={gamificationSettings.pointsPerAssessment}
                          onChange={(e) => {
                            setGamificationSettings({...gamificationSettings, pointsPerAssessment: parseInt(e.target.value)});
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bonus Points for Perfect Score</label>
                        <input
                          type="number"
                          min="0"
                          value={gamificationSettings.pointsPerPerfectScore}
                          onChange={(e) => {
                            setGamificationSettings({...gamificationSettings, pointsPerPerfectScore: parseInt(e.target.value)});
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <BarChart3 size={20} className="text-green-600" />
                      Leaderboard Settings
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Leaderboard Period</label>
                        <select
                          value={gamificationSettings.leaderboardPeriod}
                          onChange={(e) => {
                            setGamificationSettings({...gamificationSettings, leaderboardPeriod: e.target.value});
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="all-time">All Time</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FileText size={20} className="text-blue-600" />
                      Certificate Settings
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Certificate Template</label>
                        <select
                          value={gamificationSettings.certificateTemplate}
                          onChange={(e) => {
                            setGamificationSettings({...gamificationSettings, certificateTemplate: e.target.value});
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="default">Default</option>
                          <option value="modern">Modern</option>
                          <option value="classic">Classic</option>
                          <option value="minimal">Minimal</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'learning-paths' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Zap size={20} className="text-teal-600" />
                      Learning Path Configuration
                    </h3>
                    <div className="space-y-3">
                      <ToggleSwitch
                        enabled={learningPathSettings.enablePrerequisites}
                        onChange={() => {
                          setLearningPathSettings({...learningPathSettings, enablePrerequisites: !learningPathSettings.enablePrerequisites});
                          setHasUnsavedChanges(true);
                        }}
                        label="Enable Prerequisites"
                        description="Require completion of previous courses before accessing new ones"
                      />
                      <ToggleSwitch
                        enabled={learningPathSettings.enableSequentialLearning}
                        onChange={() => {
                          setLearningPathSettings({...learningPathSettings, enableSequentialLearning: !learningPathSettings.enableSequentialLearning});
                          setHasUnsavedChanges(true);
                        }}
                        label="Sequential Learning"
                        description="Force users to complete courses in order"
                      />
                      <ToggleSwitch
                        enabled={learningPathSettings.allowSkipping}
                        onChange={() => {
                          setLearningPathSettings({...learningPathSettings, allowSkipping: !learningPathSettings.allowSkipping});
                          setHasUnsavedChanges(true);
                        }}
                        label="Allow Skipping"
                        description="Allow users to skip ahead in learning paths"
                      />
                      <ToggleSwitch
                        enabled={learningPathSettings.enableBranching}
                        onChange={() => {
                          setLearningPathSettings({...learningPathSettings, enableBranching: !learningPathSettings.enableBranching});
                          setHasUnsavedChanges(true);
                        }}
                        label="Enable Branching Paths"
                        description="Allow different learning paths based on user choices"
                      />
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <CheckCircle2 size={20} className="text-green-600" />
                      Completion Settings
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
                            setLearningPathSettings({...learningPathSettings, completionThreshold: parseInt(e.target.value)});
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Minimum percentage required to mark a course as complete</p>
                      </div>
                      <ToggleSwitch
                        enabled={learningPathSettings.enableTimeTracking}
                        onChange={() => {
                          setLearningPathSettings({...learningPathSettings, enableTimeTracking: !learningPathSettings.enableTimeTracking});
                          setHasUnsavedChanges(true);
                        }}
                        label="Enable Time Tracking"
                        description="Track time spent on each course and learning path"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

