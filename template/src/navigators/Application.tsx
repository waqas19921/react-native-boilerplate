import React from 'react';
import { ActivityIndicator, SafeAreaView, StatusBar } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Startup } from '../screens';
import { useTheme } from '../hooks';
import MainNavigator from './Main';
import { useFlipper } from '@react-navigation/devtools';
import { ApplicationStackParamList } from '../../@types/navigation';
import Config from '../config';
import { ErrorBoundary } from '../screens/ErrorScreen/ErrorBoundary';
import { navigationRef, useNavigationPersistence } from './NavigationUtilities';

const Stack = createStackNavigator<ApplicationStackParamList>();
const NAVIGATION_PERSISTENCE_KEY = 'NAVIGATION_STATE';

// @refresh reset
const ApplicationNavigator = () => {
  const { Layout, darkMode, NavigationTheme } = useTheme();
  const { colors } = NavigationTheme;

  const {
    initialNavigationState,
    onNavigationStateChange,
    isRestored: isNavigationStateRestored,
  } = useNavigationPersistence(NAVIGATION_PERSISTENCE_KEY);

  useFlipper(navigationRef);
  if (!isNavigationStateRestored) {
    return (
      <SafeAreaView style={[Layout.fill, { backgroundColor: colors.card }]}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[Layout.fill, { backgroundColor: colors.card }]}>
      <ErrorBoundary catchErrors={Config.catchErrors}>
        <NavigationContainer
          theme={NavigationTheme}
          ref={navigationRef}
          initialState={initialNavigationState}
          onStateChange={onNavigationStateChange}
        >
          <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Startup" component={Startup} />
            <Stack.Screen name="Main" component={MainNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      </ErrorBoundary>
    </SafeAreaView>
  );
};

export default ApplicationNavigator;
