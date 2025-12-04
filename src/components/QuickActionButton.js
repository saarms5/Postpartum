import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import theme from '../styles/theme';

const QuickActionButton = ({ icon, label, onPress, color = theme.colors.primary, disabled = false }) => {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor: disabled ? theme.colors.gray300 : color },
            ]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.7}
        >
            <Text style={styles.icon}>{icon}</Text>
            <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        minHeight: theme.touchTarget.minHeight,
        minWidth: theme.touchTarget.minWidth,
        paddingVertical: theme.spacing.lg,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        ...theme.shadows.md,
        flex: 1,
        margin: theme.spacing.sm,
    },
    icon: {
        fontSize: 32,
        marginBottom: theme.spacing.xs,
    },
    label: {
        fontSize: theme.typography.sizes.md,
        fontWeight: theme.typography.weights.semibold,
        color: theme.colors.white,
        textAlign: 'center',
    },
});

export default QuickActionButton;
