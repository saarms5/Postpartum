import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Linking,
} from 'react-native';
import { useBabyData } from '../context/BabyDataContext';
import theme from '../styles/theme';
import AlertCard from '../components/AlertCard';
import {
    calculateAgeInWeeks,
    calculateWakeWindowRemaining,
    formatTimeAgo,
    isWitchingHour,
} from '../utils/calculations';
import {
    getWitchingHourGuidance,
    getFiveSs,
    getHairTourniquetInstructions,
} from '../utils/safetyProtocols';

const SOSScreen = ({ navigation }) => {
    const { babyProfile, currentWakeTime, getLastFeed, activeSleep } = useBabyData();

    const [currentStep, setCurrentStep] = useState(0);
    const [showWitchingHour, setShowWitchingHour] = useState(false);
    const [showFiveSs, setShowFiveSs] = useState(false);
    const [showHairTourniquet, setShowHairTourniquet] = useState(false);

    useEffect(() => {
        setShowWitchingHour(isWitchingHour());
    }, []);

    const troubleshootingSteps = [
        {
            id: 'hunger',
            title: '1. Hunger?',
            icon: '🍼',
            getContent: () => {
                const lastFeed = getLastFeed();
                if (!lastFeed) {
                    return 'No recent feed logged. Baby might be hungry.';
                }
                return `Last feed was ${formatTimeAgo(lastFeed.timestamp)}. Try offering a feed.`;
            },
            action: 'Start Feed',
            onAction: () => navigation.navigate('Feeding'),
        },
        {
            id: 'diaper',
            title: '2. Dirty Diaper?',
            icon: '🧷',
            getContent: () => 'Check if baby needs a diaper change.',
            action: 'Log Diaper',
            onAction: () => navigation.navigate('Diaper'),
        },
        {
            id: 'overtired',
            title: '3. Overtired?',
            icon: '😴',
            getContent: () => {
                if (!babyProfile || !currentWakeTime || activeSleep) {
                    return 'Baby is currently sleeping or wake window not tracked.';
                }

                const ageInWeeks = calculateAgeInWeeks(babyProfile.birthdate);
                const wakeWindow = calculateWakeWindowRemaining(currentWakeTime, ageInWeeks);

                if (wakeWindow.isUrgent) {
                    return `Baby has been awake for ${wakeWindow.minutesAwake} minutes. This is past the max wake window. Baby is likely overtired.`;
                } else if (wakeWindow.isWarning) {
                    return `Baby has been awake for ${wakeWindow.minutesAwake} minutes. Approaching max wake window.`;
                } else {
                    return `Baby has been awake for ${wakeWindow.minutesAwake} minutes. Wake window is okay.`;
                }
            },
            action: 'Start Sleep',
            onAction: () => navigation.navigate('Sleep'),
        },
        {
            id: 'temperature',
            title: '4. Temperature?',
            icon: '🌡️',
            getContent: () => 'Feel baby\'s chest/back. Is it too hot or cold? Check room temperature (68-72°F is ideal).',
        },
        {
            id: 'gas',
            title: '5. Gas/Burp?',
            icon: '💨',
            getContent: () => 'Try bicycle legs (gently move baby\'s legs in cycling motion) or hold baby upright for burping.',
        },
        {
            id: 'hair',
            title: '6. Hair Tourniquet?',
            icon: '🔍',
            getContent: () => 'Check baby\'s toes, fingers, and (for boys) penis for a hair wrapped tightly.',
            action: 'View Instructions',
            onAction: () => setShowHairTourniquet(true),
        },
        {
            id: 'overstimulation',
            title: '7. Overstimulation?',
            icon: '🤫',
            getContent: () => 'Try a dark, quiet room with white noise. Reduce visual and auditory stimulation.',
        },
    ];

    const witchingHourGuidance = getWitchingHourGuidance();
    const fiveSs = getFiveSs();
    const hairTourniquetInfo = getHairTourniquetInstructions();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>🆘 Why Are They Crying?</Text>

                {showWitchingHour && (
                    <AlertCard
                        title={witchingHourGuidance.title}
                        message={witchingHourGuidance.message}
                        severity="warning"
                        action="View Coping Strategies"
                        onActionPress={() => setShowWitchingHour(true)}
                    />
                )}

                <Text style={styles.subtitle}>The Checklist</Text>
                <Text style={styles.description}>
                    Go through these steps in order. Short sentences. You've got this.
                </Text>

                {troubleshootingSteps.map((step, index) => (
                    <View key={step.id} style={styles.stepCard}>
                        <View style={styles.stepHeader}>
                            <Text style={styles.stepIcon}>{step.icon}</Text>
                            <Text style={styles.stepTitle}>{step.title}</Text>
                        </View>
                        <Text style={styles.stepContent}>{step.getContent()}</Text>
                        {step.action && (
                            <TouchableOpacity
                                style={styles.stepButton}
                                onPress={step.onAction}
                            >
                                <Text style={styles.stepButtonText}>{step.action}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ))}

                <View style={styles.emergencySection}>
                    <Text style={styles.emergencyTitle}>Still Crying?</Text>
                    <TouchableOpacity
                        style={[styles.button, styles.infoButton]}
                        onPress={() => setShowFiveSs(true)}
                    >
                        <Text style={styles.buttonText}>Try the 5 S's</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.dangerButton]}
                        onPress={() => Linking.openURL('tel:911')}
                    >
                        <Text style={styles.buttonText}>🚨 Call 911</Text>
                    </TouchableOpacity>
                </View>

                {/* Modals/Expanded Views */}
                {showFiveSs && (
                    <View style={styles.modal}>
                        <Text style={styles.modalTitle}>{fiveSs.title}</Text>
                        {fiveSs.techniques.map((technique, index) => (
                            <View key={index} style={styles.techniqueItem}>
                                <Text style={styles.techniqueName}>{index + 1}. {technique.name}</Text>
                                <Text style={styles.techniqueDescription}>{technique.description}</Text>
                            </View>
                        ))}
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setShowFiveSs(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {showWitchingHour && (
                    <View style={styles.modal}>
                        <Text style={styles.modalTitle}>{witchingHourGuidance.title}</Text>
                        <Text style={styles.modalMessage}>{witchingHourGuidance.message}</Text>
                        <Text style={styles.modalSubtitle}>Strategies:</Text>
                        {witchingHourGuidance.strategies.map((strategy, index) => (
                            <Text key={index} style={styles.strategyItem}>• {strategy}</Text>
                        ))}
                        <Text style={styles.reminder}>{witchingHourGuidance.reminder}</Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setShowWitchingHour(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {showHairTourniquet && (
                    <View style={styles.modal}>
                        <Text style={styles.modalTitle}>{hairTourniquetInfo.title}</Text>
                        <Text style={styles.modalMessage}>{hairTourniquetInfo.message}</Text>
                        <Text style={styles.modalSubtitle}>Instructions:</Text>
                        {hairTourniquetInfo.instructions.map((instruction, index) => (
                            <Text key={index} style={styles.strategyItem}>• {instruction}</Text>
                        ))}
                        <Text style={styles.reminder}>{hairTourniquetInfo.action}</Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setShowHairTourniquet(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
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
    content: {
        padding: theme.spacing.lg,
    },
    title: {
        fontSize: theme.typography.sizes.xxxl,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.danger,
        marginBottom: theme.spacing.md,
    },
    subtitle: {
        fontSize: theme.typography.sizes.xl,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.text,
        marginTop: theme.spacing.lg,
        marginBottom: theme.spacing.sm,
    },
    description: {
        fontSize: theme.typography.sizes.md,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.lg,
        lineHeight: theme.typography.lineHeights.relaxed * theme.typography.sizes.md,
    },
    stepCard: {
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.md,
        ...theme.shadows.sm,
    },
    stepHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    stepIcon: {
        fontSize: 24,
        marginRight: theme.spacing.sm,
    },
    stepTitle: {
        fontSize: theme.typography.sizes.lg,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.text,
    },
    stepContent: {
        fontSize: theme.typography.sizes.md,
        color: theme.colors.text,
        lineHeight: theme.typography.lineHeights.relaxed * theme.typography.sizes.md,
    },
    stepButton: {
        marginTop: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.md,
        alignSelf: 'flex-start',
    },
    stepButtonText: {
        color: theme.colors.white,
        fontSize: theme.typography.sizes.sm,
        fontWeight: theme.typography.weights.semibold,
    },
    emergencySection: {
        marginTop: theme.spacing.xl,
    },
    emergencyTitle: {
        fontSize: theme.typography.sizes.xl,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
    },
    button: {
        paddingVertical: theme.spacing.lg,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    infoButton: {
        backgroundColor: theme.colors.info,
    },
    dangerButton: {
        backgroundColor: theme.colors.danger,
    },
    buttonText: {
        fontSize: theme.typography.sizes.lg,
        fontWeight: theme.typography.weights.semibold,
        color: theme.colors.white,
    },
    modal: {
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.xl,
        marginTop: theme.spacing.lg,
        ...theme.shadows.lg,
    },
    modalTitle: {
        fontSize: theme.typography.sizes.xxl,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
    },
    modalMessage: {
        fontSize: theme.typography.sizes.md,
        color: theme.colors.text,
        marginBottom: theme.spacing.lg,
        lineHeight: theme.typography.lineHeights.relaxed * theme.typography.sizes.md,
    },
    modalSubtitle: {
        fontSize: theme.typography.sizes.lg,
        fontWeight: theme.typography.weights.semibold,
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
    },
    techniqueItem: {
        marginBottom: theme.spacing.md,
    },
    techniqueName: {
        fontSize: theme.typography.sizes.md,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.text,
    },
    techniqueDescription: {
        fontSize: theme.typography.sizes.sm,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.xs,
    },
    strategyItem: {
        fontSize: theme.typography.sizes.md,
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
        lineHeight: theme.typography.lineHeights.relaxed * theme.typography.sizes.md,
    },
    reminder: {
        fontSize: theme.typography.sizes.md,
        color: theme.colors.success,
        fontWeight: theme.typography.weights.semibold,
        marginTop: theme.spacing.md,
        fontStyle: 'italic',
    },
    closeButton: {
        marginTop: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        backgroundColor: theme.colors.gray300,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: theme.typography.sizes.md,
        fontWeight: theme.typography.weights.semibold,
        color: theme.colors.text,
    },
});

export default SOSScreen;
