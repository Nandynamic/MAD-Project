import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Pressable, Text } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'expo-router';

export default function LoginScreen() {
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try { await signIn(email, password); } finally { setSubmitting(false); }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Log in</ThemedText>
      <TextInput placeholder="Email" autoCapitalize="none" keyboardType="email-address" style={styles.input} value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />
      <Pressable style={[styles.button, submitting && styles.disabled]} onPress={submit} disabled={submitting}>
        <Text style={styles.buttonText}>{submitting ? 'Signing in...' : 'Sign In'}</Text>
      </Pressable>
      <Pressable style={[styles.google]} onPress={signInWithGoogle}>
        <Text style={styles.googleText}>Continue with Google</Text>
      </Pressable>
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 8 }}>
        <Text style={{ color: '#666' }}>No account? </Text>
        <Link href="/signup"><Text style={{ color: '#0A84FF', fontWeight: '600' }}>Sign up</Text></Link>
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
  button: { 
    backgroundColor: '#007AFF',
    paddingVertical: 12, 
    borderRadius: 10, 
    alignItems: 'center' },
  buttonText: {
    color: '#fff', 
    fontWeight: '700' },
  disabled: { 
    opacity: 0.7 },
  google: { 
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 12, 
    borderRadius: 10, 
    alignItems: 'center' },
  googleText: { color: '#111', fontWeight: '600' },
});


