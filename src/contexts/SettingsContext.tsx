import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../utils/api';

interface SettingsState {
    general: {
        siteName: string;
        siteSubtitle: string;
        companyName: string;
        companyLogo: string;
        favicon: string;
        timezone: string;
        language: string;
        dateFormat: string;
        timeFormat: string;
        theme: string;
        primaryColor: string;
        secondaryColor: string;
    };
    users: any;
    content: any;
    notifications: any;
    security: any;
    email: any;
    integrations: any;
    gamification: any;
    'learning-paths': any;
}

interface SettingsContextType {
    settings: SettingsState | null;
    loading: boolean;
    updateSettings: (category: string, newSettings: any) => Promise<void>;
    refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<SettingsState | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchSettings = async () => {
        try {
            const data = await api.getSettings();
            setSettings(data);
        } catch (err) {
            console.error('Failed to load settings:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    useEffect(() => {
        const updateFavicon = () => {
            const favicon = settings?.general?.favicon;
            const link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
            const defaultFavicon = '/vite.svg';

            if (link) {
                link.href = favicon || defaultFavicon;
            } else {
                const newLink = document.createElement('link');
                newLink.rel = 'icon';
                newLink.href = favicon || defaultFavicon;
                document.head.appendChild(newLink);
            }
        };

        updateFavicon();
    }, [settings?.general?.favicon]);

    useEffect(() => {
        if (settings?.general?.siteName) {
            const title = settings.general.siteSubtitle
                ? `${settings.general.siteName} | ${settings.general.siteSubtitle}`
                : settings.general.siteName;
            document.title = title;
        } else {
            document.title = 'Knowledge Center';
        }
    }, [settings?.general?.siteName, settings?.general?.siteSubtitle]);

    const updateSettings = async (category: string, newSettings: any) => {
        try {
            await api.updateSettings(category, newSettings);
            // Optimistic update or refetch
            setSettings(prev => prev ? { ...prev, [category]: newSettings } : null);
        } catch (err) {
            console.error('Failed to update settings:', err);
            throw err;
        }
    };

    const refreshSettings = async () => {
        await fetchSettings();
    };

    return (
        <SettingsContext.Provider value={{ settings, loading, updateSettings, refreshSettings }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}
