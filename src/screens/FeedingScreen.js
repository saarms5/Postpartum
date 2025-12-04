import React, { useState } from 'react';
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

const FeedingScreen = ({ navigation }) => {
    const {
        activeFeed,
        startFeed,
        endFeed,
        cancelFeed,
        feedLogs,
        babyProfile,
    } = useBabyData();

    const [selectedType, setSelectedType] = useState('breast');
    const [selectedSide, setSelectedSide] = useState('left');
    const [formulaAmount, setFormulaAmount] = useState('');

    const handleStartFeed = () => {
        if (selectedType === 'breast') {
            startFeed('breast', selectedSide);
        } else {
            startFeed('formula');
        }
    };

    const handleEndFeed = () => {
        if (selectedType === 'formula') {
            endFeed(parseInt(formulaAmount) || 0);
        } else {
            endFeed();
        }
        navigation.goBack();
    };

    const handleCancel = () => {
        cancelFeed();
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Feeding</Text>

                {activeFeed ? (
                    <View>
                        <TimerCard
                            title={`Feeding - ${activeFeed.type === 'breast' ? activeFeed.side + ' side' : 'Formula'}`}
                            startTime={activeFeed.startTime}
                            icon="🍼"
                            showProgress={false}
                        />

                        <TouchableOpacity
                            style={[styles.button, styles.primaryButton]}
                            onPress={handleEndFeed}
                        >
                            <Text style={styles.buttonText}>End Feed</Text>
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
                        <Text style={styles.label}>Feeding Type</Text>
                        <View style={styles.typeSelector}>
                            <TouchableOpacity
                                style={[
                                    styles.typeButton,
                                    selectedType === 'breast' && styles.typeButtonActive,
                                ]}
                                onPress={() => setSelectedType('breast')}
                            >
                                <Text style={[
                                    styles.typeButtonText,
                                    selectedType === 'breast' && styles.typeButtonTextActive,
                                ]}>
                                    Breast
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.typeButton,
                                    selectedType === 'formula' && styles.typeButtonActive,
                                ]}
                                onPress={() => setSelectedType('formula')}
                            >
                                <Text style={[
                                    styles.typeButtonText,
                                    selectedType === 'formula' && styles.typeButtonTextActive,
                                ]}>
                                    Formula
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {selectedType === 'breast' && (
                            <View>
                                <Text style={styles.label}>Side</Text>
                                <View style={styles.typeSelector}>
                                    <TouchableOpacity
                                        style={[
                                            styles.typeButton,
                                            selectedSide === 'left' && styles.typeButtonActive,
                                        ]}
                                        onPress={() => setSelectedSide('left')}
                                    >
                                        <Text style={[
                                            styles.typeButtonText,
                                            selectedSide === 'left' && styles.typeButtonTextActive,
                                        ]}>
                                            Left
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[
                                            styles.typeButton,
                                            selectedSide === 'right' && styles.typeButtonActive,
                                        ]}
                                        onPress={() => setSelectedSide('right')}
                                    >
                                        <Text style={[
                                            styles.typeButtonText,
                                            selectedSide === 'right' && styles.typeButtonTextActive,
                                        ]}>
                                            Right
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[
                                            styles.typeButton,
                                            selectedSide === 'both' && styles.typeButtonActive,
                                        ]}
                                        onPress={() => setSelectedSide('both')}
                                    >
                                        <Text style={[
                                            styles.typeButtonText,
                                            selectedSide === 'both' && styles.typeButtonTextActive,
                                        ]}>
                                            Both
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                        <TouchableOpacity
                            style={[styles.button, styles.primaryButton]}
                            onPress={handleStartFeed}
                        >
                            <Text style={styles.buttonText}>Start Feed</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Feed History */}
                <View style={styles.historySection}>
                    <Text style={styles.sectionTitle}>Recent Feeds</Text>
                    {feedLogs.slice(0, 5).map((feed) => (
                        <View key={feed.id} style={styles.historyItem}>
                            <View style={styles.historyIcon}>
                                <Text>🍼</Text>
                            </View>
                            <View style={styles.historyContent}>
                                <Text style={styles.historyTitle}>
                                    {feed.type === 'breast'
                                        ? `Breast - ${feed.side} side`
                                        : `Formula - ${feed.amount}ml`}
                                </Text>
                                <Text style={styles.historyTime}>
                                    {formatTimeAgo(feed.timestamp)} • {feed.duration} min
                                </Text>
                            </View>
                        </View>
                    ))}

                    {feedLogs.length === 0 && (
                        <Text style={styles.emptyText}>No feeds logged yet</Text>
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

export default FeedingScreen;
