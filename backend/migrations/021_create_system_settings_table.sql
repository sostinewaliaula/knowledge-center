CREATE TABLE IF NOT EXISTS system_settings (
  category VARCHAR(50) PRIMARY KEY,
  settings JSON NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default settings
INSERT IGNORE INTO system_settings (category, settings) VALUES 
('general', '{"siteName": "Knowledge Center", "siteSubtitle": "TQ Academy", "companyName": "Caava Group", "timezone": "UTC", "language": "en", "dateFormat": "MM/DD/YYYY", "timeFormat": "12h", "theme": "light", "primaryColor": "#9333EA", "secondaryColor": "#10B981"}'),
('users', '{"allowSelfRegistration": false, "requireEmailVerification": true, "requirePhoneVerification": false, "defaultRole": "learner", "passwordMinLength": 8, "passwordRequireUppercase": true, "passwordRequireLowercase": true, "passwordRequireNumbers": true, "passwordRequireSpecialChars": true, "sessionTimeout": 30, "maxSessionsPerUser": 3, "enableProfilePictures": true, "enableUserStatus": true}'),
('content', '{"maxFileSize": 100, "maxVideoSize": 500, "maxImageSize": 10, "allowedFileTypes": ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"], "allowedVideoTypes": ["mp4", "avi", "mov", "wmv", "flv"], "allowedImageTypes": ["jpg", "jpeg", "png", "gif", "webp", "svg"], "allowedAudioTypes": ["mp3", "wav", "ogg", "m4a"], "autoApproveContent": false, "enableComments": true, "enableRatings": true, "enableDownloads": true, "enableSharing": true, "contentExpiryDays": 0, "enableVersioning": true}'),
('notifications', '{"emailNotifications": true, "pushNotifications": false, "smsNotifications": false, "courseUpdates": true, "assignmentReminders": true, "deadlineAlerts": true, "systemAnnouncements": true, "newContentAlerts": true, "completionCertificates": true, "achievementBadges": true, "discussionReplies": true, "mentionNotifications": true}'),
('security', '{"twoFactorAuth": false, "require2FAForAdmins": true, "passwordExpiry": 90, "passwordHistory": 5, "maxLoginAttempts": 5, "lockoutDuration": 15, "enableIPWhitelist": false, "allowedIPs": [], "enableSSO": false, "ssoProvider": "none", "enableAuditLog": true, "dataRetentionDays": 365, "enableGDPR": false, "autoLogout": true}'),
('email', '{"smtpHost": "", "smtpPort": 587, "smtpSecure": true, "smtpUser": "", "smtpPassword": "", "fromEmail": "noreply@caavagroup.com", "fromName": "Knowledge Center", "replyToEmail": "support@caavagroup.com", "testEmail": ""}'),
('integrations', '{"googleAnalytics": "", "facebookPixel": "", "enableZoom": false, "zoomApiKey": "", "zoomApiSecret": "", "enableSlack": false, "slackWebhook": "", "enableMicrosoftTeams": false, "teamsWebhook": "", "enableLTI": false, "ltiConsumerKey": "", "ltiConsumerSecret": ""}'),
('gamification', '{"enableGamification": true, "pointsPerCourse": 50, "pointsPerAssessment": 10, "pointsPerPerfectScore": 100, "enableBadges": true, "enableLeaderboards": true, "leaderboardPeriod": "monthly", "enableCertificates": true, "certificateTemplate": "default"}'),
('learning-paths', '{"enablePrerequisites": true, "enableSequentialLearning": false, "allowSkipping": false, "enableBranching": true, "completionThreshold": 80, "enableTimeTracking": true}');
