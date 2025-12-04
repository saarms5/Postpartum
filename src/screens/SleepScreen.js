import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import { useBabyData } from '../context/BabyDataContext';
import theme from '../styles/theme';
import TimerCard from '../components/TimerCard';
import { formatTimeAgo } from '../utils/calculations';
import { setupWakeWindowNotifications } from '../utils/notifications';
import { calculateAgeInWeeks, getWakeWindowMinutes } from '../utils/calculations';

const SleepScreen = ({ navigation }) => {
    const {
        activeSleep,
        startSleep,
        endSleep,
        cancelSleep,
        sleepLogs,
        babyProfile,
    } = useBabyData();

    const handleStartSleep = () => {
        startSleep();
    };

    const handleEndSleep = async (type) => {
        endSleep(type);

        // Schedule wake window notifications
        if (babyProfile) {
            const ageInWeeks = calculateAgeInWeeks(babyProfile.birthdate);
            const { max, warningAt } = getWakeWindowMinutes(ageInWeeks);
            const wakeTime = new Date().toISOString();

            await setupWakeWindowNotifications(wakeTime, warningAt, max);
        }

        navigation.goBack();
    };

    const handleCancel = () => {
        cancelSleep();
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Sleep</Text>

                {activeSleep ? (
                    <View>
                        <TimerCard
                            title="Sleeping"
                            startTime={activeSleep.startTime}
                            icon="💤"
                            showProgress={false}
                        />

                        <Text style={styles.label}>Sleep Type</Text>

                        <TouchableOpacity
                            style={[styles.button, styles.primaryButton]}
                            onPress={() => handleEndSleep('nap')}
                        >
                            <Text style={styles.buttonText}>End Nap</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.primaryButton]}
                            onPress={() => handleEndSleep('night')}
                        >
                            <Text style={styles.buttonText}>End Night Sleep</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.secondaryButton]}
                            onPress={handleCancel}
                        >
                            <Text style={styles.secondaryButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View>
                        <TouchableOpacity
                            style={[styles.button, styles.primaryButton]}
                            onPress={handleStartSleep}
                        >
                            <Text style={styles.buttonText}>Start Sleep</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Sleep History */}
                <View style={styles.historySection}>
                    <Text style={styles.sectionTitle}>Recent Sleep</Text>
                    {sleepLogs.slice(0, 5).map((sleep) => (
                        <View key={sleep.id} style={styles.historyItem}>
                            <View style={styles.historyIcon}>
                                <Text>{sleep.type === 'night' ? '🌙' : '💤'}</Text>
                            </View>
                            <View style={styles.historyContent}>
                                <Text style={styles.historyTitle}>
                                    {sleep.type === 'night' ? 'Night Sleep' : 'Nap'}
                                </Text>
                                <Text style={styles.historyTime}>
                                    {formatTimeAgo(sleep.timestamp)} • {sleep.duration} min
                                </Text>
                            </View>
                        </View>
                    ))}

                    {sleepLogs.length === 0 && (
                        <Text style={styles.emptyText}>No sleep logged yet</Text>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        padding: theme.spacing.lg,
    },
    title: {
        fontSize: theme.typography.sizes.xxxl,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.text,
        marginBottom: theme.spacing.xl,
    },
    label: {
        fontSize: theme.typography.sizes.lg,
        fontWeight: theme.typography.weights.semibold,
        color: theme.colors.text,
        marginTop: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    button: {
        paddingVertical: theme.spacing.lg,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
        marginTop: theme.spacing.md,
    },
    primaryButton: {
        backgroundColor: theme.colors.secondary,
    },
    secondaryButton: {
        backgroundColor: theme.colors.white,
        borderWidth: 2,
        borderColor: theme.colors.gray300,
    },
    buttonText: {
        fontSize: theme.typography.sizes.lg,
        fontWeight: theme.typography.weights.semibold,
        color: theme.colors.white,
    },
    secondaryButtonText: {
        fontSize: theme.typography.sizes.lg,
        fontWeight: theme.typography.weights.semibold,
        color: theme.colors.text,
    },
    historySection: {
        marginTop: theme.spacing.xxl,
    },
    sectionTitle: {
        fontSize: theme.typography.sizes.xl,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
    },
    historyItem: {
        flexDirection: 'row',
        padding: theme.spacing.md,
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.sm,
        ...theme.shadows.sm,
    },
    historyIcon: {
        width: 40,
        height: 40,
        borderRadius: theme.borderRadius.round,
        backgroundColor: theme.colors.gray100,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme.spacing.md,
    },
    historyContent: {
        flex: 1,
    },
    historyTitle: {
        fontSize: theme.typography.sizes.md,
        fontWeight: theme.typography.weights.semibold,
        color: theme.colors.text,
    },
    historyTime: {
        fontSize: theme.typography.sizes.sm,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.xs,
    },
    emptyText: {
        fontSize: theme.typography.sizes.md,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginTop: theme.spacing.lg,
    },
});

export default SleepScreen;
