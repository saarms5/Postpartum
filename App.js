import React, { useEffect } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { BabyDataProvider } from './src/context/BabyDataContext';
import { requestNotificationPermissions } from './src/utils/notifications';
import theme from './src/styles/theme';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import FeedingScreen from './src/screens/FeedingScreen';
import SleepScreen from './src/screens/SleepScreen';
import DiaperScreen from './src/screens/DiaperScreen';
import SOSScreen from './src/screens/SOSScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createStackNavigator();

export default function App() {
    useEffect(() => {
        // Request notification permissions on app start
        requestNotificationPermissions();
    }, []);

    return (
        <BabyDataProvider>
            <NavigationContainer>
                <StatusBar style="auto" />
                <Stack.Navigator
                    initialRouteName="Home"
                    screenOptions={{
                        headerStyle: {
                            backgroundColor: theme.colors.primary,
                        },
                        headerTintColor: theme.colors.white,
                        headerTitleStyle: {
                            fontWeight: theme.typography.weights.bold,
                            fontSize: theme.typography.sizes.lg,
                        },
                        headerBackTitleVisible: false,
                    }}
                >
                    <Stack.Screen
                        name="Home"
                        component={HomeScreen}
                        options={({ navigation }) => ({
                            title: 'Antigravity',
                            headerRight: () => (
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('Settings')}
                                    style={{ marginRight: 15 }}
                                >
                                    <Text style={{ color: theme.colors.white, fontSize: 24 }}>⚙️</Text>
                                </TouchableOpacity>
                            ),
                        })}
                    />
                    <Stack.Screen
                        name="Feeding"
                        component={FeedingScreen}
                        options={{ title: 'Feeding' }}
                    />
                    <Stack.Screen
                        name="Sleep"
                        component={SleepScreen}
                        options={{ title: 'Sleep' }}
                    />
                    <Stack.Screen
                        name="Diaper"
                        component={DiaperScreen}
                        options={{ title: 'Diaper' }}
                    />
                    <Stack.Screen
                        name="SOS"
                        component={SOSScreen}
                        options={{
                            title: 'SOS',
                            headerStyle: {
                                backgroundColor: theme.colors.danger,
                            },
                        }}
                    />
                    <Stack.Screen
                        name="Settings"
                        component={SettingsScreen}
                        options={{ title: 'Settings' }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </BabyDataProvider>
    );
}
