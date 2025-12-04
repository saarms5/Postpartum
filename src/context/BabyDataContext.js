import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BabyDataContext = createContext();

export const useBabyData = () => {
    const context = useContext(BabyDataContext);
    if (!context) {
        throw new Error('useBabyData must be used within BabyDataProvider');
    }
    return context;
};

export const BabyDataProvider = ({ children }) => {
    // Baby profile
    const [babyProfile, setBabyProfile] = useState(null);

    // Logs
    const [feedLogs, setFeedLogs] = useState([]);
    const [sleepLogs, setSleepLogs] = useState([]);
    const [diaperLogs, setDiaperLogs] = useState([]);

    // Active timers
    const [activeFeed, setActiveFeed] = useState(null);
    const [activeSleep, setActiveSleep] = useState(null);
    const [currentWakeTime, setCurrentWakeTime] = useState(null);

    // Load data from AsyncStorage on mount
    useEffect(() => {
        loadData();
    }, []);

    // Save data whenever it changes
    useEffect(() => {
        saveData();
    }, [babyProfile, feedLogs, sleepLogs, diaperLogs, activeFeed, activeSleep, currentWakeTime]);

    const loadData = async () => {
        try {
            const [profile, feeds, sleeps, diapers, feed, sleep, wake] = await Promise.all([
                AsyncStorage.getItem('babyProfile'),
                AsyncStorage.getItem('feedLogs'),
                AsyncStorage.getItem('sleepLogs'),
                AsyncStorage.getItem('diaperLogs'),
                AsyncStorage.getItem('activeFeed'),
                AsyncStorage.getItem('activeSleep'),
                AsyncStorage.getItem('currentWakeTime'),
            ]);

            if (profile) setBabyProfile(JSON.parse(profile));
            if (feeds) setFeedLogs(JSON.parse(feeds));
            if (sleeps) setSleepLogs(JSON.parse(sleeps));
            if (diapers) setDiaperLogs(JSON.parse(diapers));
            if (feed) setActiveFeed(JSON.parse(feed));
            if (sleep) setActiveSleep(JSON.parse(sleep));
            if (wake) setCurrentWakeTime(JSON.parse(wake));
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    const saveData = async () => {
        try {
            await Promise.all([
                AsyncStorage.setItem('babyProfile', JSON.stringify(babyProfile)),
                AsyncStorage.setItem('feedLogs', JSON.stringify(feedLogs)),
                AsyncStorage.setItem('sleepLogs', JSON.stringify(sleepLogs)),
                AsyncStorage.setItem('diaperLogs', JSON.stringify(diaperLogs)),
                AsyncStorage.setItem('activeFeed', JSON.stringify(activeFeed)),
                AsyncStorage.setItem('activeSleep', JSON.stringify(activeSleep)),
                AsyncStorage.setItem('currentWakeTime', JSON.stringify(currentWakeTime)),
            ]);
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    // Feed functions
    const startFeed = (type, side = null) => {
        setActiveFeed({
            id: Date.now().toString(),
            startTime: new Date().toISOString(),
            type,
            side,
        });
    };

    const endFeed = (amount = null) => {
        if (!activeFeed) return;

        const endTime = new Date();
        const startTime = new Date(activeFeed.startTime);
        const duration = Math.floor((endTime - startTime) / (1000 * 60));

        const feedLog = {
            ...activeFeed,
            endTime: endTime.toISOString(),
            duration,
            amount,
            timestamp: activeFeed.startTime,
        };

        setFeedLogs(prev => [feedLog, ...prev]);
        setActiveFeed(null);
    };

    const cancelFeed = () => {
        setActiveFeed(null);
    };

    // Sleep functions
    const startSleep = () => {
        const sleepTime = new Date().toISOString();
        setActiveSleep({
            id: Date.now().toString(),
            startTime: sleepTime,
        });
        setCurrentWakeTime(null); // Clear wake window when baby sleeps
    };

    const endSleep = (type = 'nap') => {
        if (!activeSleep) return;

        const endTime = new Date();
        const startTime = new Date(activeSleep.startTime);
        const duration = Math.floor((endTime - startTime) / (1000 * 60));

        const sleepLog = {
            ...activeSleep,
            endTime: endTime.toISOString(),
            duration,
            type,
            timestamp: activeSleep.startTime,
        };

        setSleepLogs(prev => [sleepLog, ...prev]);
        setActiveSleep(null);
        setCurrentWakeTime(endTime.toISOString()); // Start wake window
    };

    const cancelSleep = () => {
        setActiveSleep(null);
    };

    // Diaper functions
    const logDiaper = (type, poopColor = null, notes = '') => {
        const diaperLog = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            type,
            poopColor,
            notes,
        };

        setDiaperLogs(prev => [diaperLog, ...prev]);
    };

    // Profile functions
    const updateBabyProfile = (profile) => {
        setBabyProfile(profile);
    };

    // Get last feed
    const getLastFeed = () => {
        return feedLogs.length > 0 ? feedLogs[0] : null;
    };

    // Get last sleep
    const getLastSleep = () => {
        return sleepLogs.length > 0 ? sleepLogs[0] : null;
    };

    // Clear all data (for testing/reset)
    const clearAllData = async () => {
        setBabyProfile(null);
        setFeedLogs([]);
        setSleepLogs([]);
        setDiaperLogs([]);
        setActiveFeed(null);
        setActiveSleep(null);
        setCurrentWakeTime(null);
        await AsyncStorage.clear();
    };

    const value = {
        // State
        babyProfile,
        feedLogs,
        sleepLogs,
        diaperLogs,
        activeFeed,
        activeSleep,
        currentWakeTime,

        // Feed functions
        startFeed,
        endFeed,
        cancelFeed,
        getLastFeed,

        // Sleep functions
        startSleep,
        endSleep,
        cancelSleep,
        getLastSleep,

        // Diaper functions
        logDiaper,

        // Profile functions
        updateBabyProfile,

        // Utility
        clearAllData,
    };

    return (
        <BabyDataContext.Provider value={value}>
            {children}
        </BabyDataContext.Provider>
    );
};
