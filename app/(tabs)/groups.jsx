import React, { useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet, TextInput, View, Text, Pressable } from 'react-native';
import { useExpenses } from '@/context/ExpensesContext';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Link } from 'expo-router';

export default function GroupsScreen() {
  const { groups, addGroup, removeGroup } = useExpenses();
  const [name, setName] = useState('Trip to Goa');
  const [membersText, setMembersText] = useState('Alice,Bob,Charlie');

  const submit = () => {
    const members = membersText.split(',');
    addGroup(name, members);
    setName('');
    setMembersText('');
  };

  const data = useMemo(() => groups, [groups]);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Groups</ThemedText>
      <View style={styles.card}>
        <ThemedText type="subtitle">Create group</ThemedText>
        <TextInput placeholder="Group name" value={name} onChangeText={setName} style={styles.input} />
        <TextInput placeholder="Members comma-separated (e.g., Alice,Bob)" value={membersText} onChangeText={setMembersText} style={styles.input} />
        <Pressable onPress={submit} style={styles.button}><Text style={styles.buttonText}>Add Group</Text></Pressable>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.groupItem}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View>
                <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
                <Text style={styles.members}>{item.members.join(', ')}</Text>
              </View>
              <Link href="/(tabs)/add-expense" asChild>
                <Pressable style={styles.addBtn}><Text style={styles.addBtnText}>Add</Text></Pressable>
              </Link>
            </View>
            <View style={styles.actionsRow}>
              <Pressable
                onPress={() => {
                  Alert.alert('Delete group', `Delete "${item.name}" and its expenses?`, [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Delete', style: 'destructive', onPress: () => removeGroup(item.id) },
                  ]);
                }}
                style={styles.deleteBtn}
              >
              <Text style={styles.deleteText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No groups yet</Text>}
        contentContainerStyle={data.length === 0 ? styles.emptyContainer : undefined}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 12, gap: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10 },
  button: { backgroundColor: '#007AFF', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
  groupItem: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginVertical: 6 },
  members: { color: '#555', marginTop: 4 },
  emptyContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { color: '#555' },
  addBtn: { backgroundColor: '#34C759', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  addBtnText: { color: '#fff', fontWeight: '700' },
  actionsRow: { marginTop: 8, flexDirection: 'row', justifyContent: 'flex-end' },
  deleteBtn: { backgroundColor: '#FFECEC', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  deleteText: { color: '#FF3B30', fontWeight: '600' },
});


