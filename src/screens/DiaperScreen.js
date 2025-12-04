import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    TextInput,
} from 'react-native';
import { useBabyData } from '../context/BabyDataContext';
import theme from '../styles/theme';
import { formatTimeAgo, analyzePoopColor, calculateAgeInDays } from '../utils/calculations';
import AlertCard from '../components/AlertCard';

const DiaperScreen = ({ navigation }) => {
    const { logDiaper, diaperLogs, babyProfile } = useBabyData();

    const [selectedType, setSelectedType] = useState('wet');
    const [poopColor, setPoopColor] = useState('');
    const [notes, setNotes] = useState('');
    const [colorAnalysis, setColorAnalysis] = useState(null);

    const handleLogDiaper = () => {
        logDiaper(selectedType, poopColor || null, notes);

        // Reset form
        setSelectedType('wet');
        setPoopColor('');
        setNotes('');
        setColorAnalysis(null);

        navigation.goBack();
    };

    const handleColorChange = (color) => {
        setPoopColor(color);

        if (color && babyProfile) {
            const ageInDays = calculateAgeInDays(babyProfile.birthdate);
            const analysis = analyzePoopColor(color, ageInDays);
            setColorAnalysis(analysis);
        } else {
            setColorAnalysis(null);
        }
    };

    const poopColorOptions = [
        { label: 'Mustard Yellow', value: 'mustard' },
        { label: 'Tan/Brown', value: 'tan' },
        { label: 'Green', value: 'green' },
        { label: 'Black', value: 'black' },
        { label: 'White/Chalky', value: 'white' },
        { label: 'Red', value: 'red' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Diaper Change</Text>

                <Text style={styles.label}>Type</Text>
                <View style={styles.typeSelector}>
                    <TouchableOpacity
                        style={[
                            styles.typeButton,
                            selectedType === 'wet' && styles.typeButtonActive,
                        ]}
                        onPress={() => setSelectedType('wet')}
                    >
                        <Text style={[
                            styles.typeButtonText,
                            selectedType === 'wet' && styles.typeButtonTextActive,
                        ]}>
                            💧 Wet
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.typeButton,
                            selectedType === 'dirty' && styles.typeButtonActive,
                        ]}
                        onPress={() => setSelectedType('dirty')}
                    >
                        <Text style={[
                            styles.typeButtonText,
                            selectedType === 'dirty' && styles.typeButtonTextActive,
                        ]}>
                            💩 Dirty
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.typeButton,
                            selectedType === 'both' && styles.typeButtonActive,
                        ]}
                        onPress={() => setSelectedType('both')}
                    >
                        <Text style={[
                            styles.typeButtonText,
                            selectedType === 'both' && styles.typeButtonTextActive,
                        ]}>
                            Both
                        </Text>
                    </TouchableOpacity>
                </View>

                {(selectedType === 'dirty' || selectedType === 'both') && (
                    <View>
                        <Text style={styles.label}>Poop Color (Optional)</Text>
                        <View style={styles.colorGrid}>
                            {poopColorOptions.map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    style={[
                                        styles.colorButton,
                                        poopColor === option.value && styles.colorButtonActive,
                                    ]}
                                    onPress={() => handleColorChange(option.value)}
                                >
                                    <Text style={styles.colorButtonText}>{option.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {colorAnalysis && (
                            <AlertCard
                                title={colorAnalysis.status === 'normal' ? '✅ Normal' : colorAnalysis.status === 'emergency' ? '🚨 Emergency' : '⚠️ Warning'}
                                message={colorAnalysis.message}
                                severity={colorAnalysis.status === 'emergency' ? 'critical' : colorAnalysis.status === 'warning' ? 'warning' : 'success'}
                                action={colorAnalysis.action}
                            />
                        )}
                    </View>
                )}

                <Text style={styles.label}>Notes (Optional)</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Any additional notes..."
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                    numberOfLines={3}
                />

                <TouchableOpacity
                    style={[styles.button, styles.primaryButton]}
                    onPress={handleLogDiaper}
                >
                    <Text style={styles.buttonText}>Log Diaper</Text>
                </TouchableOpacity>

                {/* Diaper History */}
                <View style={styles.historySection}>
                    <Text style={styles.sectionTitle}>Recent Diapers</Text>
                    {diaperLogs.slice(0, 5).map((diaper) => (
                        <View key={diaper.id} style={styles.historyItem}>
                            <View style={styles.historyIcon}>
                                <Text>{diaper.type === 'wet' ? '💧' : diaper.type === 'dirty' ? '💩' : '🧷'}</Text>
                            </View>
                            <View style={styles.historyContent}>
                                <Text style={styles.historyTitle}>
                                    {diaper.type === 'wet' ? 'Wet' : diaper.type === 'dirty' ? 'Dirty' : 'Both'}
                                    {diaper.poopColor && ` • ${diaper.poopColor}`}
                                </Text>
                                <Text style={styles.historyTime}>
                                    {formatTimeAgo(diaper.timestamp)}
                                </Text>
                                {diaper.notes && (
                                    <Text style={styles.historyNotes}>{diaper.notes}</Text>
                                )}
                            </View>
                        </View>
                    ))}

                    {diaperLogs.length === 0 && (
                        <Text style={styles.emptyText}>No diapers logged yet</Text>
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
    typeSelector: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
    },
    typeButton: {
        flex: 1,
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        borderRadius: theme.borderRadius.md,
        borderWidth: 2,
        borderColor: theme.colors.gray300,
        backgroundColor: theme.colors.white,
        alignItems: 'center',
    },
    typeButtonActive: {
        borderColor: theme.colors.success,
        backgroundColor: theme.colors.success + '20',
    },
    typeButtonText: {
        fontSize: theme.typography.sizes.md,
        fontWeight: theme.typography.weights.semibold,
        color: theme.colors.textSecondary,
    },
    typeButtonTextActive: {
        color: theme.colors.success,
    },
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.sm,
    },
    colorButton: {
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        borderWidth: 2,
        borderColor: theme.colors.gray300,
        backgroundColor: theme.colors.white,
        marginBottom: theme.spacing.sm,
    },
    colorButtonActive: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.primaryLight,
    },
    colorButtonText: {
        fontSize: theme.typography.sizes.sm,
        fontWeight: theme.typography.weights.medium,
        color: theme.colors.text,
    },
    textInput: {
        borderWidth: 1,
        borderColor: theme.colors.gray300,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        fontSize: theme.typography.sizes.md,
        color: theme.colors.text,
        backgroundColor: theme.colors.white,
        textAlignVertical: 'top',
    },
    button: {
        paddingVertical: theme.spacing.lg,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
        marginTop: theme.spacing.xl,
    },
    primaryButton: {
        backgroundColor: theme.colors.success,
    },
    buttonText: {
        fontSize: theme.typography.sizes.lg,
        fontWeight: theme.typography.weights.semibold,
        color: theme.colors.white,
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
    historyNotes: {
        fontSize: theme.typography.sizes.sm,
        color: theme.colors.text,
        marginTop: theme.spacing.xs,
        fontStyle: 'italic',
    },
    emptyText: {
        fontSize: theme.typography.sizes.md,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginTop: theme.spacing.lg,
    },
});

export default DiaperScreen;
