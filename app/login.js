import { useState } from 'react';
import { Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { supabase } from '../lib/supabase';
import { colors } from '../lib/theme';

export default function Login() {
  const [isNew, setIsNew] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  async function submit() {
    setBusy(true); setMsg('');
    const { error } = isNew
      ? await supabase.auth.signUp({ email, password, options: { data: { username: username.trim() } } })
      : await supabase.auth.signInWithPassword({ email, password });
    if (error) setMsg(error.message);
    else if (isNew) setMsg('تم إنشاء الحساب. إن طُلب تأكيد البريد، افتح الرسالة ثم سجّل الدخول.');
    setBusy(false);
  }

  const canSend = email && password.length >= 6 && (!isNew || username.trim().length >= 3);

  return (
    <KeyboardAvoidingView style={s.page} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Text style={s.title}>شورتس</Text>
      <Text style={s.sub}>{isNew ? 'أنشئ حسابك وانشر أول فيديو' : 'سجّل الدخول لمتابعة الفيديوهات'}</Text>

      {isNew && <TextInput style={s.input} placeholder="اسم المستخدم" placeholderTextColor={colors.muted}
        value={username} onChangeText={setUsername} autoCapitalize="none" />}
      <TextInput style={s.input} placeholder="البريد الإلكتروني" placeholderTextColor={colors.muted}
        value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={s.input} placeholder="كلمة المرور (6 أحرف على الأقل)" placeholderTextColor={colors.muted}
        value={password} onChangeText={setPassword} secureTextEntry />

      {!!msg && <Text style={s.msg}>{msg}</Text>}

      <Pressable style={[s.btn, (!canSend || busy) && { opacity: 0.5 }]} disabled={!canSend || busy} onPress={submit}>
        <Text style={s.btnText}>{isNew ? 'إنشاء حساب' : 'تسجيل الدخول'}</Text>
      </Pressable>
      <Pressable onPress={() => { setIsNew(!isNew); setMsg(''); }}>
        <Text style={s.switch}>{isNew ? 'لدي حساب بالفعل' : 'مستخدم جديد؟ أنشئ حسابًا'}</Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg, padding: 24, justifyContent: 'center' },
  title: { color: colors.accent, fontSize: 44, fontWeight: '800', textAlign: 'right' },
  sub: { color: colors.muted, fontSize: 16, textAlign: 'right', marginBottom: 28, marginTop: 4 },
  input: { backgroundColor: colors.surface, borderColor: colors.line, borderWidth: 1, borderRadius: 14,
    color: colors.text, padding: 14, fontSize: 16, marginBottom: 12, textAlign: 'right' },
  btn: { backgroundColor: colors.accent, borderRadius: 14, padding: 15, alignItems: 'center', marginTop: 6 },
  btnText: { color: colors.onAccent, fontSize: 17, fontWeight: '700' },
  switch: { color: colors.text, textAlign: 'center', marginTop: 20, fontSize: 15 },
  msg: { color: colors.error, textAlign: 'right', marginBottom: 8 },
});
