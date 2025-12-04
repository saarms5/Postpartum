// Wake window calculations based on baby's age

/**
 * Calculate baby's age in weeks from birthdate
 */
export const calculateAgeInWeeks = (birthdate) => {
    const now = new Date();
    const birth = new Date(birthdate);
    const diffTime = Math.abs(now - birth);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.floor(diffDays / 7);
};

/**
 * Calculate baby's age in days from birthdate
 */
export const calculateAgeInDays = (birthdate) => {
    const now = new Date();
    const birth = new Date(birthdate);
    const diffTime = Math.abs(now - birth);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Get wake window duration in minutes based on age in weeks
 */
export const getWakeWindowMinutes = (ageInWeeks) => {
    if (ageInWeeks < 4) {
        // 0-4 weeks: 45-60 minutes
        return { min: 45, max: 60, warningAt: 45 };
    } else if (ageInWeeks < 12) {
        // 1-3 months: 60-90 minutes
        return { min: 60, max: 90, warningAt: 75 };
    } else if (ageInWeeks < 16) {
        // 3-4 months: 75-90 minutes
        return { min: 75, max: 90, warningAt: 75 };
    } else {
        // 4+ months: 90-120 minutes
        return { min: 90, max: 120, warningAt: 105 };
    }
};

/**
 * Calculate time remaining in wake window
 */
export const calculateWakeWindowRemaining = (wakeTime, ageInWeeks) => {
    const now = new Date();
    const wake = new Date(wakeTime);
    const minutesAwake = Math.floor((now - wake) / (1000 * 60));

    const { max, warningAt } = getWakeWindowMinutes(ageInWeeks);
    const remaining = max - minutesAwake;

    return {
        minutesAwake,
        minutesRemaining: remaining,
        maxWindow: max,
        warningAt,
        isWarning: minutesAwake >= warningAt,
        isUrgent: minutesAwake >= max,
        percentage: (minutesAwake / max) * 100,
    };
};

/**
 * Get feeding interval in hours based on feeding type
 */
export const getFeedingInterval = (feedingType) => {
    switch (feedingType) {
        case 'breast':
            return { min: 2, max: 3 };
        case 'formula':
            return { min: 3, max: 4 };
        case 'mixed':
            return { min: 2, max: 3.5 };
        default:
            return { min: 2, max: 3 };
    }
};

/**
 * Calculate time until next feed
 */
export const calculateNextFeedDue = (lastFeedTime, feedingType) => {
    const now = new Date();
    const lastFeed = new Date(lastFeedTime);
    const hoursSinceLastFeed = (now - lastFeed) / (1000 * 60 * 60);

    const { max } = getFeedingInterval(feedingType);
    const hoursUntilNextFeed = max - hoursSinceLastFeed;

    return {
        hoursSinceLastFeed,
        hoursUntilNextFeed,
        isDue: hoursSinceLastFeed >= max,
        isApproaching: hoursSinceLastFeed >= (max - 0.5), // 30 min before
    };
};

/**
 * Detect cluster feeding pattern
 * Returns true if 3+ feeds in 4 hours during evening (5 PM - 9 PM)
 */
export const detectClusterFeeding = (feedLogs) => {
    const now = new Date();
    const currentHour = now.getHours();

    // Only check during evening hours
    if (currentHour < 17 || currentHour > 21) {
        return false;
    }

    // Get feeds in last 4 hours
    const fourHoursAgo = new Date(now - 4 * 60 * 60 * 1000);
    const recentFeeds = feedLogs.filter(feed => new Date(feed.timestamp) > fourHoursAgo);

    return recentFeeds.length >= 3;
};

/**
 * Count wet diapers in last 24 hours
 */
export const countWetDiapers24h = (diaperLogs) => {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now - 24 * 60 * 60 * 1000);

    const wetDiapers = diaperLogs.filter(diaper => {
        const timestamp = new Date(diaper.timestamp);
        return timestamp > twentyFourHoursAgo &&
            (diaper.type === 'wet' || diaper.type === 'both');
    });

    return wetDiapers.length;
};

/**
 * Analyze poop color for safety
 */
export const analyzePoopColor = (color, ageInDays) => {
    const normalColors = ['mustard', 'yellow', 'tan', 'brown', 'green'];
    const warningColors = ['black'];
    const emergencyColors = ['white', 'red', 'chalky'];

    if (emergencyColors.some(c => color.toLowerCase().includes(c))) {
        return {
            status: 'emergency',
            message: 'Medical Emergency. Consult doctor immediately.',
            action: 'Call pediatrician or go to ER now.',
        };
    }

    if (warningColors.some(c => color.toLowerCase().includes(c)) && ageInDays > 3) {
        return {
            status: 'warning',
            message: 'Black stool after day 3 may indicate old blood.',
            action: 'Consult your pediatrician.',
        };
    }

    if (normalColors.some(c => color.toLowerCase().includes(c))) {
        return {
            status: 'normal',
            message: 'Normal poop color.',
            action: null,
        };
    }

    return {
        status: 'unknown',
        message: 'Unusual color. If concerned, consult pediatrician.',
        action: 'Monitor and document.',
    };
};

/**
 * Check if it's "Witching Hour" (5 PM - 10 PM)
 */
export const isWitchingHour = () => {
    const hour = new Date().getHours();
    return hour >= 17 && hour < 22;
};

/**
 * Format duration in minutes to human-readable string
 */
export const formatDuration = (minutes) => {
    if (minutes < 60) {
        return `${Math.round(minutes)} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

/**
 * Format time ago (e.g., "2 hours ago")
 */
export const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) {
        const mins = diffMins % 60;
        return mins > 0 ? `${diffHours}h ${mins}m ago` : `${diffHours}h ago`;
    }

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
};
