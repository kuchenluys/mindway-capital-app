import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';

import store from '@store/index';
import LoginScreen from '@screens/LoginScreen';
import DashboardScreen from '@screens/DashboardScreen';
import TradingScreen from '@screens/TradingScreen';
import CoursesScreen from '@screens/CoursesScreen';
import CommunityScreen from '@screens/CommunityScreen';
import ProfileScreen from '@screens/ProfileScreen';
import useAuth from '@hooks/useAuth';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const DashboardNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarStyle: {
          backgroundColor: '#0f172a',
          borderTopColor: '#1e293b',
          paddingBottom: 5,
        },
        tabBarActiveTintColor: '#fbbf24',
        tabBarInactiveTintColor: '#94a3b8',
      }}
    >
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{
          title: 'Dashboard',
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color }) => <Text style={{ color }}>📊</Text>,
        }}
      />
      <Tab.Screen
        name="Trading"
        component={TradingScreen}
        options={{
          title: 'Trading',
          tabBarLabel: 'Trading',
          tabBarIcon: ({ color }) => <Text style={{ color }}>💹</Text>,
        }}
      />
      <Tab.Screen
        name="Courses"
        component={CoursesScreen}
        options={{
          title: 'Cursos',
          tabBarLabel: 'Cursos',
          tabBarIcon: ({ color }) => <Text style={{ color }}>📚</Text>,
        }}
      />
      <Tab.Screen
        name="Community"
        component={CommunityScreen}
        options={{
          title: 'Comunidad',
          tabBarLabel: 'Comunidad',
          tabBarIcon: ({ color }) => <Text style={{ color }}>👥</Text>,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color }) => <Text style={{ color }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
};

function AppContent() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" />
      {user ? (
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#0f172a',
            },
            headerTintColor: '#fbbf24',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen
            name="Dashboard"
            component={DashboardNavigator}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
