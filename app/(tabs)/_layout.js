import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../lib/theme';

const tab = (name, title, icon) => (
  <Tabs.Screen name={name} options={{ title, tabBarIcon: ({ color, size }) => <Ionicons name={icon} color={color} size={size} /> }} />
);

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor: colors.bg, borderTopColor: colors.line },
      tabBarActiveTintColor: colors.accent,
      tabBarInactiveTintColor: colors.muted,
    }}>
      {tab('index', 'عام', 'play-circle')}
      {tab('friends', 'الأصدقاء', 'people')}
      {tab('links', 'روابط', 'link')}
      {tab('profile', 'ملفي', 'person')}
    </Tabs>
  );
}
