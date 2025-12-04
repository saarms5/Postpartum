// Theme configuration for Antigravity Postpartum app
// Calming, sleep-friendly color palette

export const colors = {
    // Primary - Soft blues for calm
    primary: '#6B9BD1',
    primaryLight: '#A8C7E7',
    primaryDark: '#4A7BA7',

    // Secondary - Warm lavender for comfort
    secondary: '#B8A8D8',
    secondaryLight: '#D4C9E8',
    secondaryDark: '#9580B8',

    // Background
    background: '#F8FAFB',
    backgroundDark: '#1A1D23',
    surface: '#FFFFFF',
    surfaceDark: '#2A2D35',

    // Status colors
    success: '#7BC67E',
    warning: '#F5C26B',
    danger: '#E57373',
    info: '#64B5F6',

    // Wake window urgency levels
    wakeWindowSafe: '#7BC67E',      // Green - plenty of time
    wakeWindowWarning: '#F5C26B',   // Yellow - approaching limit
    wakeWindowUrgent: '#E57373',    // Red - max window reached

    // Text
    text: '#2C3E50',
    textSecondary: '#7F8C8D',
    textLight: '#BDC3C7',
    textDark: '#FFFFFF',
    textDarkSecondary: '#B0B8C1',

    // Neutrals
    white: '#FFFFFF',
    black: '#000000',
    gray100: '#F7F9FA',
    gray200: '#E8EBED',
    gray300: '#D1D8DD',
    gray400: '#9AA5B1',
    gray500: '#7B8794',
    gray600: '#616E7C',
    gray700: '#52606D',
    gray800: '#3E4C59',
    gray900: '#323F4B',
};

export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

export const borderRadius = {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
    round: 9999,
};

export const typography = {
    // Large, readable fonts for sleep-deprived parents
    sizes: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 20,
        xl: 24,
        xxl: 32,
        xxxl: 40,
    },
    weights: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
    },
    lineHeights: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75,
    },
};

export const shadows = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
};

// Minimum touch target size for accessibility
export const touchTarget = {
    minHeight: 44,
    minWidth: 44,
};

export default {
    colors,
    spacing,
    borderRadius,
    typography,
    shadows,
    touchTarget,
};
