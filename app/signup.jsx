import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Pressable, Text } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'expo-router';

export default function SignupScreen() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try { await signUp(email, password); } finally { setSubmitting(false); }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Create account</ThemedText>
      <TextInput placeholder="Email" autoCapitalize="none" keyboardType="email-address" style={styles.input} value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />
      <Pressable style={[styles.button, submitting && styles.disabled]} onPress={submit} disabled={submitting}>
        <Text style={styles.buttonText}>{submitting ? 'Creating...' : 'Sign Up'}</Text>
      </Pressable>
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 8 }}>
        <Text style={{ color: '#666' }}>Have an account? </Text>
        <Link href="/login"><Text style={{ color: '#0A84FF', fontWeight: '600' }}>Log in</Text></Link>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { 
    padding: 16, 
    gap: 12, 
    flex: 1, 
    justifyContent: 'center' },
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 10, 
    padding: 12 },
  button: { backgroundColor: '#34C759', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
  disabled: { opacity: 0.7 },
});


