import { View, Text, Pressable, StyleSheet } from 'react-native';
import { supabase } from '../../lib/supabase';
import { colors } from '../../lib/theme';

export default function Screen() {
  return (
    <View style={s.page}>
      <Text style={s.t}>ملفي</Text>
      <Text style={s.d}>منشوراتي وفيديوهات الهاتف</Text>
      <Pressable style={s.b} onPress={() => supabase.auth.signOut()}><Text style={s.bt}>تسجيل الخروج</Text></Pressable>
    </View>
  );
}
const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: 24 },
  t: { color: colors.text, fontSize: 22, fontWeight: '700' },
  d: { color: colors.muted, marginTop: 8, textAlign: 'center' },
  b: { marginTop: 24, borderColor: colors.line, borderWidth: 1, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 20 },
  bt: { color: colors.text },
});
