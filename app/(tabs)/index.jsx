import React, { useMemo } from 'react';
import { StyleSheet, View, Text, Pressable, FlatList } from 'react-native';
import { Link } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useExpenses } from '@/context/ExpensesContext';

export default function HomeScreen() {
  const { groups } = useExpenses();
  const recentGroups = useMemo(() => groups.slice(0, 5), [groups]);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Smart Expense Splitter</ThemedText>
      <ThemedText style={styles.subtitle}>Hassle-free group expense management</ThemedText>

      <View style={styles.ctaRow}>
        <Link href="/(tabs)/groups" asChild>
          <Pressable style={[styles.cta, styles.primary]}>
            <Text style={styles.ctaText}>Create Group</Text>
          </Pressable>
        </Link>
        <Link href="/(tabs)/add-expense" asChild>
          <Pressable style={[styles.cta, styles.secondary]}>
            <Text style={[styles.ctaText, styles.secondaryText]}>Add Expense</Text>
          </Pressable>
        </Link>
      </View>

      <ThemedText type="subtitle" style={{ marginTop: 16 }}>Recent groups</ThemedText>
      {recentGroups.length === 0 ? (
        <View style={[styles.card, { alignItems: 'center' }]}> 
          <Text style={styles.muted}>No groups yet. Tap Create Group to start.</Text>
        </View>
      ) : (
        <FlatList
          data={recentGroups}
          keyExtractor={(g) => g.id}
          renderItem={({ item }) => (
            <View style={styles.groupCard}>
              <View style={styles.avatarRow}>
                {item.members.slice(0, 3).map((m) => (
                  <View key={m} style={styles.avatar}><Text style={styles.avatarText}>{m.trim()[0]?.toUpperCase() ?? '?'}</Text></View>
                ))}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.groupName}>{item.name}</Text>
                <Text style={styles.muted}>{item.members.length} members</Text>
              </View>
              <Link href="/(tabs)/add-expense" asChild>
                <Pressable style={styles.addBtn}><Text style={styles.addBtnText}>Add</Text></Pressable>
              </Link>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 8 },
  subtitle: { color: '#666' },
  ctaRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  cta: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  primary: { backgroundColor: '#007AFF' },
  secondary: { backgroundColor: '#EAF2FF' },
  ctaText: { color: '#fff', fontWeight: '700' },
  secondaryText: { color: '#0A84FF' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginTop: 8 },
  groupCard: { backgroundColor: '#fff', borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
  groupName: { fontWeight: '700', fontSize: 16 },
  muted: { color: '#666' },
  avatarRow: { flexDirection: 'row', gap: -6 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#0A84FF', alignItems: 'center', justifyContent: 'center', marginRight: -6 },
  avatarText: { color: '#fff', fontWeight: '700' },
  addBtn: { backgroundColor: '#34C759', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  addBtnText: { color: '#fff', fontWeight: '700' },
});


