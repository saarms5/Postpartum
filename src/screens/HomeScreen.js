import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    StatusBar
} from 'react-native';
import { useBabyData } from '../context/BabyDataContext';
import theme from '../styles/theme';
import QuickActionButton from '../components/QuickActionButton';
import TimerCard from '../components/TimerCard';
import AlertCard from '../components/AlertCard';
import {
    calculateAgeInWeeks,
    calculateWakeWindowRemaining,
    calculateNextFeedDue,
    getWakeWindowMinutes,
    detectClusterFeeding,
    countWetDiapers24h,
    isWitchingHour,
} from '../utils/calculations';
import { checkFeverEmergency, checkHydration } from '../utils/safetyProtocols';

const HomeScreen = ({ navigation }) => {
    const {
        babyProfile,
        currentWakeTime,
        activeFeed,
        activeSleep,
        feedLogs,
        diaperLogs,
        getLastFeed,
    } = useBabyData();

    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        if (!babyProfile) {
            navigation.navigate('Settings');
            return;
        }

        checkForAlerts();
    }, [babyProfile, currentWakeTime, feedLogs, diaperLogs]);

    const checkForAlerts = () => {
        const newAlerts = [];

        if (!babyProfile) return;

        const ageInWeeks = calculateAgeInWeeks(babyProfile.birthdate);
        const ageInDays = Math.floor(ageInWeeks * 7);

        // Check wake window
        if (currentWakeTime && !activeSleep) {
            const wakeWindow = calculateWakeWindowRemaining(currentWakeTime, ageInWeeks);

            if (wakeWindow.isUrgent) {
                newAlerts.push({
                    id: 'wake-urgent',
                    title: '🚨 Max Wake Window Reached',
                    message: 'Sleep pressure is high. Offer a nap immediately to avoid overtiredness.',
                    severity: 'critical',
                    action: 'Start Sleep',
                    onActionPress: () => navigation.navigate('Sleep'),
                });
            } else if (wakeWindow.isWarning) {
                newAlerts.push({
                    id: 'wake-warning',
                    title: '⏰ Wake Window Ending Soon',
                    message: `Baby has been up for ${wakeWindow.minutesAwake} mins. Look for sleepy cues (staring off, rubbing eyes). Start wind-down routine now.`,
                    severity: 'warning',
                    action: 'Start Sleep',
                    onActionPress: () => navigation.navigate('Sleep'),
                });
            }
        }

        // Check feeding
        const lastFeed = getLastFeed();
        if (lastFeed && !activeFeed) {
            const feedDue = calculateNextFeedDue(lastFeed.timestamp, babyProfile.feedingType);

            if (feedDue.isDue) {
                // Check for cluster feeding
                const isClusterFeeding = detectClusterFeeding(feedLogs);

                if (isClusterFeeding) {
                    newAlerts.push({
                        id: 'cluster-feed',
                        title: '🍼 Cluster Feeding Detected',
                        message: 'This looks like cluster feeding. It\'s normal and helps supply. Keep going, you\'re doing great.',
                        severity: 'info',
                    });
                } else {
                    newAlerts.push({
                        id: 'feed-due',
                        title: '🍼 Feeding Time',
                        message: `It's been ${Math.floor(feedDue.hoursSinceLastFeed)} hours since the last feed.`,
                        severity: 'info',
                        action: 'Start Feed',
                        onActionPress: () => navigation.navigate('Feeding'),
                    });
                }
            }
        }

        // Check hydration
        const wetDiaperCount = countWetDiapers24h(diaperLogs);
        const hydrationCheck = checkHydration(wetDiaperCount, ageInDays);

        if (hydrationCheck) {
            newAlerts.push({
                id: 'hydration',
                title: hydrationCheck.title,
                message: hydrationCheck.message,
                severity: hydrationCheck.severity,
                action: hydrationCheck.action,
            });
        }

        setAlerts(newAlerts);
    };

    if (!babyProfile) {
        return null;
    }

    const ageInWeeks = calculateAgeInWeeks(babyProfile.birthdate);
    const { max: maxWakeWindow, warningAt } = getWakeWindowMinutes(ageInWeeks);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.greeting}>Hello! 👋</Text>
                    <Text style={styles.babyName}>{babyProfile.name}</Text>
                    <Text style={styles.age}>{ageInWeeks} weeks old</Text>
                </View>

                {/* Alerts */}
                {alerts.map(alert => (
                    <AlertCard
                        key={alert.id}
                        title={alert.title}
                        message={alert.message}
                        severity={alert.severity}
                        action={alert.action}
                        onActionPress={alert.onActionPress}
                    />
                ))}

                {/* Active Timers */}
                {currentWakeTime && !activeSleep && (
                    <TimerCard
                        title="Wake Window"
                        startTime={currentWakeTime}
                        maxMinutes={maxWakeWindow}
                        warningMinutes={warningAt}
                        icon="😴"
                    />
                )}

                {activeFeed && (
                    <TimerCard
                        title="Feeding"
                        startTime={activeFeed.startTime}
                        icon="🍼"
                        showProgress={false}
                    />
                )}

                {activeSleep && (
                    <TimerCard
                        title="Sleeping"
                        startTime={activeSleep.startTime}
                        icon="💤"
                        showProgress={false}
                    />
                )}

                {/* Quick Actions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>

                    <View style={styles.buttonRow}>
                        <QuickActionButton
                            icon="🍼"
                            label="Feed"
                            onPress={() => navigation.navigate('Feeding')}
                            color={theme.colors.primary}
                            disabled={!!activeFeed}
                        />
                        <QuickActionButton
                            icon="💤"
                            label="Sleep"
                            onPress={() => navigation.navigate('Sleep')}
                            color={theme.colors.secondary}
                            disabled={!!activeSleep}
                        />
                    </View>

                    <View style={styles.buttonRow}>
                        <QuickActionButton
                            icon="🧷"
                            label="Diaper"
                            onPress={() => navigation.navigate('Diaper')}
                            color={theme.colors.success}
                        />
                        <QuickActionButton
                            icon="🆘"
                            label="SOS"
                            onPress={() => navigation.navigate('SOS')}
                            color={theme.colors.danger}
                        />
                    </View>
                </View>

                {/* Witching Hour Notice */}
                {isWitchingHour() && (
                    <AlertCard
                        title="🌙 Witching Hour"
                        message="It's evening fussiness time (5-10 PM). This is normal. You're doing great."
                        severity="info"
                        action="View Coping Tips"
                        onActionPress={() => navigation.navigate('SOS')}
                    />
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: theme.spacing.lg,
    },
    header: {
        marginBottom: theme.spacing.xl,
    },
    greeting: {
        fontSize: theme.typography.sizes.lg,
        color: theme.colors.textSecondary,
    },
    babyName: {
        fontSize: theme.typography.sizes.xxxl,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.text,
        marginTop: theme.spacing.xs,
    },
    age: {
        fontSize: theme.typography.sizes.md,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.xs,
    },
    section: {
        marginTop: theme.spacing.lg,
    },
    sectionTitle: {
        fontSize: theme.typography.sizes.xl,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
    },
    buttonRow: {
        flexDirection: 'row',
        marginHorizontal: -theme.spacing.sm,
    },
});

export default HomeScreen;
