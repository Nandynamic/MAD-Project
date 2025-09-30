import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'expo-router';

export default function ProfileScreen() {
  const { user, signOut, signInWithGoogle } = useAuth();
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Profile</ThemedText>
      {user ? (
        <>
          <View style={styles.card}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{user.email}</Text>
          </View>
          <Pressable onPress={signOut} style={[styles.button, { backgroundColor: '#FF3B30' }]}>
            <Text style={styles.buttonText}>Sign out</Text>
          </Pressable>
        </>
      ) : (
        <>
          <View style={styles.card}>
            <Text style={styles.value}>Sign in to sync groups and expenses</Text>
          </View>
          <Link href="/login" asChild>
            <Pressable style={styles.button}><Text style={styles.buttonText}>Log in</Text></Pressable>
          </Link>
          <Link href="/signup" asChild>
            <Pressable style={[styles.button, { backgroundColor: '#34C759' }]}><Text style={styles.buttonText}>Create account</Text></Pressable>
          </Link>
          <Pressable onPress={signInWithGoogle} style={styles.google}>
            <Text style={styles.googleText}>Continue with Google</Text>
          </Pressable>
        </>
      )}
      <View style={styles.card}>
        <Text style={styles.label}>About</Text>
        <Text style={styles.value}>Smart Expense Splitter – Hassle-Free Group Expense Management</Text>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 12, gap: 4 },
  label: { color: '#666' },
  value: { fontWeight: '600' },
  button: { backgroundColor: '#007AFF', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
  google: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  googleText: { color: '#111', fontWeight: '600' },
});


