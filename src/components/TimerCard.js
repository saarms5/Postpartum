import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import theme from '../styles/theme';
import { formatDuration } from '../utils/calculations';

const TimerCard = ({
    title,
    startTime,
    maxMinutes,
    warningMinutes,
    icon,
    showProgress = true
}) => {
    const [elapsed, setElapsed] = useState(0);
    const [percentage, setPercentage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            if (startTime) {
                const now = new Date();
                const start = new Date(startTime);
                const elapsedMs = now - start;
                const elapsedMins = Math.floor(elapsedMs / (1000 * 60));

                setElapsed(elapsedMins);

                if (maxMinutes) {
                    setPercentage((elapsedMins / maxMinutes) * 100);
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [startTime, maxMinutes]);

    const getStatusColor = () => {
        if (!maxMinutes) return theme.colors.primary;

        if (elapsed >= maxMinutes) {
            return theme.colors.wakeWindowUrgent;
        } else if (elapsed >= warningMinutes) {
            return theme.colors.wakeWindowWarning;
        } else {
            return theme.colors.wakeWindowSafe;
        }
    };

    const getTimeRemaining = () => {
        if (!maxMinutes) return null;
        const remaining = maxMinutes - elapsed;
        return remaining > 0 ? remaining : 0;
    };

    const statusColor = getStatusColor();
    const remaining = getTimeRemaining();

    return (
        <View style={[styles.card, { borderLeftColor: statusColor, borderLeftWidth: 4 }]}>
            <View style={styles.header}>
                <Text style={styles.icon}>{icon}</Text>
                <Text style={styles.title}>{title}</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.elapsed}>{formatDuration(elapsed)}</Text>
                {remaining !== null && (
                    <Text style={[styles.remaining, { color: statusColor }]}>
                        {remaining > 0 ? `${formatDuration(remaining)} left` : 'Time\'s up!'}
                    </Text>
                )}
            </View>

            {showProgress && maxMinutes && (
                <View style={styles.progressContainer}>
                    <View style={styles.progressBackground}>
                        <View
                            style={[
                                styles.progressBar,
                                {
                                    width: `${Math.min(percentage, 100)}%`,
                                    backgroundColor: statusColor
                                }
                            ]}
                        />
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.md,
        ...theme.shadows.md,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    icon: {
        fontSize: 24,
        marginRight: theme.spacing.sm,
    },
    title: {
        fontSize: theme.typography.sizes.lg,
        fontWeight: theme.typography.weights.semibold,
        color: theme.colors.text,
    },
    content: {
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    elapsed: {
        fontSize: theme.typography.sizes.xxxl,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.text,
    },
    remaining: {
        fontSize: theme.typography.sizes.md,
        fontWeight: theme.typography.weights.medium,
        marginTop: theme.spacing.xs,
    },
    progressContainer: {
        marginTop: theme.spacing.sm,
    },
    progressBackground: {
        height: 8,
        backgroundColor: theme.colors.gray200,
        borderRadius: theme.borderRadius.sm,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        borderRadius: theme.borderRadius.sm,
    },
});

export default TimerCard;
