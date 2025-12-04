// Safety protocols and medical guidance

/**
 * Check for fever emergency (under 3 months)
 */
export const checkFeverEmergency = (temperatureFahrenheit, ageInDays) => {
    if (ageInDays < 90 && temperatureFahrenheit > 100.4) {
        return {
            isEmergency: true,
            title: '🚨 MEDICAL EMERGENCY',
            message: 'A fever in a newborn under 3 months is a medical emergency.',
            action: 'Go to the ER immediately. Do not give Tylenol yet.',
            severity: 'critical',
        };
    }

    if (temperatureFahrenheit > 100.4) {
        return {
            isEmergency: false,
            title: '⚠️ Fever Detected',
            message: 'Baby has a fever. Monitor closely.',
            action: 'Contact your pediatrician for guidance on next steps.',
            severity: 'warning',
        };
    }

    return null;
};

/**
 * Check for breathing emergency
 */
export const checkBreathingEmergency = (symptoms) => {
    const emergencySymptoms = ['blue lips', 'struggling to breathe', 'grunting', 'flaring nostrils'];

    const hasEmergency = emergencySymptoms.some(symptom =>
        symptoms.toLowerCase().includes(symptom)
    );

    if (hasEmergency) {
        return {
            isEmergency: true,
            title: '🚨 CALL 911 IMMEDIATELY',
            message: 'Baby is showing signs of breathing difficulty.',
            action: 'Call Emergency Services (911/112) now.',
            severity: 'critical',
        };
    }

    return null;
};

/**
 * Check hydration based on wet diaper count
 */
export const checkHydration = (wetDiaperCount24h, ageInDays) => {
    // Newborns need at least 6 wet diapers per 24 hours after day 5
    if (ageInDays > 5 && wetDiaperCount24h < 6) {
        return {
            isWarning: true,
            title: '⚠️ Low Wet Diaper Count',
            message: `Only ${wetDiaperCount24h} wet diapers in 24 hours. Baby may be dehydrated.`,
            action: 'Assess feeding efficiency. Contact pediatrician if concerned.',
            severity: 'warning',
        };
    }

    return null;
};

/**
 * Hair tourniquet check reminder
 */
export const getHairTourniquetInstructions = () => {
    return {
        title: 'Hair Tourniquet Check',
        message: 'A hair wrapped around a digit can cut off circulation.',
        instructions: [
            'Check baby\'s toes carefully',
            'Check baby\'s fingers',
            'For boys: check penis',
            'Look for red, swollen digits',
            'Look for a thin hair wrapped tightly',
        ],
        action: 'If found, try to gently remove. If unable, seek medical help immediately.',
    };
};

/**
 * The 5 S's for soothing
 */
export const getFiveSs = () => {
    return {
        title: 'The 5 S\'s for Soothing',
        techniques: [
            {
                name: 'Swaddle',
                description: 'Wrap baby snugly in a blanket with arms down',
            },
            {
                name: 'Side/Stomach',
                description: 'Hold baby on their side or stomach (never sleep in this position)',
            },
            {
                name: 'Shush',
                description: 'Make a loud "shh" sound near baby\'s ear',
            },
            {
                name: 'Swing',
                description: 'Gentle, rhythmic swaying or rocking',
            },
            {
                name: 'Suck',
                description: 'Offer pacifier or allow baby to suck on clean finger',
            },
        ],
    };
};

/**
 * Witching hour coping strategies
 */
export const getWitchingHourGuidance = () => {
    return {
        title: 'Witching Hour Support',
        message: 'This is the Witching Hour. It is not your fault. The baby is safe.',
        strategies: [
            'Put baby in a safe place (crib) and step away for 5 minutes if you feel angry',
            'Try the 5 S\'s: Swaddle, Side-stomach, Shush, Swing, Suck',
            'Go outside for fresh air - change of scenery can help',
            'Turn on white noise or vacuum cleaner',
            'Skin-to-skin contact',
            'Call a support person if you need a break',
        ],
        reminder: 'Purple crying peaks at 6 weeks and improves by 3-4 months. You are doing great.',
    };
};

/**
 * Safe sleep guidelines
 */
export const getSafeSleepGuidelines = () => {
    return {
        title: 'Safe Sleep Guidelines',
        rules: [
            'Always place baby on their back to sleep',
            'Use a firm, flat sleep surface',
            'Keep crib completely empty - no blankets, pillows, bumpers, or toys',
            'Room-share (but not bed-share) for at least 6 months',
            'Keep room at comfortable temperature (68-72°F)',
            'Offer pacifier at nap/bedtime',
            'No smoking around baby',
        ],
    };
};

/**
 * Tummy time guidelines
 */
export const getTummyTimeGuidance = () => {
    return {
        title: 'Tummy Time',
        goal: '2-3 times per day for short bursts',
        timing: 'When baby is awake, alert, and has a full tummy',
        duration: 'Start with 2-3 minutes, gradually increase',
        benefits: [
            'Builds neck and shoulder strength',
            'Prevents flat spots on head',
            'Develops motor skills',
        ],
        tips: [
            'Get down on floor at baby\'s level',
            'Use toys or mirror for motivation',
            'Start on your chest if baby resists floor',
            'Stop if baby gets fussy - try again later',
        ],
    };
};

/**
 * Medical disclaimer
 */
export const getMedicalDisclaimer = () => {
    return {
        title: 'Medical Disclaimer',
        text: 'This app provides general guidance and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your pediatrician or other qualified health provider with any questions you may have regarding your baby\'s health. Never disregard professional medical advice or delay in seeking it because of information from this app. If you think your baby may have a medical emergency, call 911 or your local emergency number immediately.',
    };
};

/**
 * Dosage warning (never calculate dosages)
 */
export const getMedicationWarning = () => {
    return {
        title: '⚠️ Medication Dosage',
        message: 'Never calculate medication dosages yourself.',
        action: 'Always refer to your pediatrician\'s dosage chart or the medication bottle instructions.',
        warning: 'Incorrect dosages can be dangerous.',
    };
};
