import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Platform,
} from 'react-native';
import { useBabyData } from '../context/BabyDataContext';
import theme from '../styles/theme';

const SettingsScreen = ({ navigation }) => {
    const { babyProfile, updateBabyProfile, clearAllData } = useBabyData();

    const [name, setName] = useState(babyProfile?.name || '');
    const [birthdate, setBirthdate] = useState(babyProfile?.birthdate || '');
    const [feedingType, setFeedingType] = useState(babyProfile?.feedingType || 'breast');

    const handleSave = () => {
        const profile = {
            name,
            birthdate,
            feedingType,
            emergencyContacts: babyProfile?.emergencyContacts || [],
        };

        updateBabyProfile(profile);
        navigation.navigate('Home');
    };

    const handleClearData = () => {
        if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
            clearAllData();
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Settings</Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Baby Profile</Text>

                    <Text style={styles.label}>Baby's Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter baby's name"
                        value={name}
                        onChangeText={setName}
                    />

                    <Text style={styles.label}>Birthdate</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="YYYY-MM-DD"
                        value={birthdate}
                        onChangeText={setBirthdate}
                    />
                    <Text style={styles.hint}>Format: YYYY-MM-DD (e.g., 2024-12-01)</Text>

                    <Text style={styles.label}>Feeding Type</Text>
                    <View style={styles.typeSelector}>
                        <TouchableOpacity
                            style={[
                                styles.typeButton,
                                feedingType === 'breast' && styles.typeButtonActive,
                            ]}
                            onPress={() => setFeedingType('breast')}
                        >
                            <Text style={[
                                styles.typeButtonText,
                                feedingType === 'breast' && styles.typeButtonTextActive,
                            ]}>
                                Breast
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.typeButton,
                                feedingType === 'formula' && styles.typeButtonActive,
                            ]}
                            onPress={() => setFeedingType('formula')}
                        >
                            <Text style={[
                                styles.typeButtonText,
                                feedingType === 'formula' && styles.typeButtonTextActive,
                            ]}>
                                Formula
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.typeButton,
                                feedingType === 'mixed' && styles.typeButtonActive,
                            ]}
                            onPress={() => setFeedingType('mixed')}
                        >
                            <Text style={[
                                styles.typeButtonText,
                                feedingType === 'mixed' && styles.typeButtonTextActive,
                            ]}>
                                Mixed
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[styles.button, styles.primaryButton]}
                        onPress={handleSave}
                    >
                        <Text style={styles.buttonText}>Save Profile</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About</Text>
                    <Text style={styles.aboutText}>
                        Antigravity Postpartum Edition
                    </Text>
                    <Text style={styles.aboutText}>
                        Version 1.0.0
                    </Text>
                    <Text style={styles.disclaimer}>
                        This app provides general guidance and is not a substitute for professional medical advice.
                        Always consult your pediatrician for medical concerns.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Data</Text>
                    <TouchableOpacity
                        style={[styles.button, styles.dangerButton]}
                        onPress={handleClearData}
                    >
                        <Text style={styles.buttonText}>Clear All Data</Text>
                    </TouchableOpacity>
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
    section: {
        marginBottom: theme.spacing.xxl,
    },
    sectionTitle: {
        fontSize: theme.typography.sizes.xl,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.text,
        marginBottom: theme.spacing.lg,
    },
    label: {
        fontSize: theme.typography.sizes.md,
        fontWeight: theme.typography.weights.semibold,
        color: theme.colors.text,
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.sm,
    },
    input: {
        borderWidth: 1,
        borderColor: theme.colors.gray300,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        fontSize: theme.typography.sizes.md,
        color: theme.colors.text,
        backgroundColor: theme.colors.white,
    },
    hint: {
        fontSize: theme.typography.sizes.sm,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.xs,
    },
    typeSelector: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
        marginTop: theme.spacing.sm,
    },
    typeButton: {
        flex: 1,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        borderWidth: 2,
        borderColor: theme.colors.gray300,
        backgroundColor: theme.colors.white,
        alignItems: 'center',
    },
    typeButtonActive: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.primaryLight,
    },
    typeButtonText: {
        fontSize: theme.typography.sizes.md,
        fontWeight: theme.typography.weights.semibold,
        color: theme.colors.textSecondary,
    },
    typeButtonTextActive: {
        color: theme.colors.primaryDark,
    },
    button: {
        paddingVertical: theme.spacing.lg,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
        marginTop: theme.spacing.lg,
    },
    primaryButton: {
        backgroundColor: theme.colors.primary,
    },
    dangerButton: {
        backgroundColor: theme.colors.danger,
    },
    buttonText: {
        fontSize: theme.typography.sizes.lg,
        fontWeight: theme.typography.weights.semibold,
        color: theme.colors.white,
    },
    aboutText: {
        fontSize: theme.typography.sizes.md,
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
    },
    disclaimer: {
        fontSize: theme.typography.sizes.sm,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.md,
        lineHeight: theme.typography.lineHeights.relaxed * theme.typography.sizes.sm,
        fontStyle: 'italic',
    },
});

export default SettingsScreen;
