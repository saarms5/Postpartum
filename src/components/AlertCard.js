import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import theme from '../styles/theme';

const AlertCard = ({
    title,
    message,
    severity = 'info',
    action = null,
    onActionPress = null,
    onDismiss = null
}) => {
    const getSeverityColor = () => {
        switch (severity) {
            case 'critical':
                return theme.colors.danger;
            case 'warning':
                return theme.colors.warning;
            case 'success':
                return theme.colors.success;
            default:
                return theme.colors.info;
        }
    };

    const getSeverityIcon = () => {
        switch (severity) {
            case 'critical':
                return '🚨';
            case 'warning':
                return '⚠️';
            case 'success':
                return '✅';
            default:
                return 'ℹ️';
        }
    };

    const color = getSeverityColor();
    const icon = getSeverityIcon();

    return (
        <View style={[styles.card, { borderLeftColor: color, borderLeftWidth: 4 }]}>
            <View style={styles.header}>
                <Text style={styles.icon}>{icon}</Text>
                <Text style={[styles.title, { color }]}>{title}</Text>
            </View>

            <Text style={styles.message}>{message}</Text>

            {action && (
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: color }]}
                    onPress={onActionPress}
                >
                    <Text style={styles.actionText}>{action}</Text>
                </TouchableOpacity>
            )}

            {onDismiss && (
                <TouchableOpacity style={styles.dismissButton} onPress={onDismiss}>
                    <Text style={styles.dismissText}>Dismiss</Text>
                </TouchableOpacity>
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
        marginBottom: theme.spacing.sm,
    },
    icon: {
        fontSize: 20,
        marginRight: theme.spacing.sm,
    },
    title: {
        fontSize: theme.typography.sizes.lg,
        fontWeight: theme.typography.weights.bold,
    },
    message: {
        fontSize: theme.typography.sizes.md,
        color: theme.colors.text,
        lineHeight: theme.typography.lineHeights.relaxed * theme.typography.sizes.md,
        marginBottom: theme.spacing.md,
    },
    actionButton: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
        marginTop: theme.spacing.sm,
    },
    actionText: {
        color: theme.colors.white,
        fontSize: theme.typography.sizes.md,
        fontWeight: theme.typography.weights.semibold,
    },
    dismissButton: {
        paddingVertical: theme.spacing.sm,
        alignItems: 'center',
        marginTop: theme.spacing.sm,
    },
    dismissText: {
        color: theme.colors.textSecondary,
        fontSize: theme.typography.sizes.sm,
    },
});

export default AlertCard;
