import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, TextInput, View, Text, Pressable } from 'react-native';
import { useExpenses } from '@/context/ExpensesContext';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export default function AddExpenseScreen() {
  const { groups, addExpense, getExpensesByGroup, computeBalances, computeSettlements } = useExpenses();
  const [selectedGroupId, setSelectedGroupId] = useState(groups[0]?.id ?? '');
  const [description, setDescription] = useState('Dinner');
  const [amountText, setAmountText] = useState('300');
  const [payer, setPayer] = useState(groups[0]?.members[0] ?? '');

  const selectedGroup = useMemo(() => groups.find(g => g.id === selectedGroupId), [groups, selectedGroupId]);
  const expenses = useMemo(() => selectedGroupId ? getExpensesByGroup(selectedGroupId) : [], [getExpensesByGroup, selectedGroupId]);
  const balances = useMemo(() => selectedGroupId ? computeBalances(selectedGroupId) : {}, [computeBalances, selectedGroupId]);
  const settlements = useMemo(() => selectedGroupId ? computeSettlements(selectedGroupId) : [], [computeSettlements, selectedGroupId]);

  const submit = () => {
    const amount = Number(amountText) || 0;
    if (!selectedGroupId || amount <= 0 || !payer) return;
    addExpense(selectedGroupId, description, amount, payer);
    setDescription('');
    setAmountText('');
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Add Expense</ThemedText>

      <View style={styles.card}>
        <ThemedText type="subtitle">Group</ThemedText>
        <FlatList
          horizontal
          data={groups}
          keyExtractor={(g) => g.id}
          contentContainerStyle={{ gap: 8 }}
          renderItem={({ item }) => (
            <Pressable onPress={() => { setSelectedGroupId(item.id); setPayer(item.members[0] ?? ''); }} style={[styles.chip, selectedGroupId === item.id && styles.chipActive]}>
              <Text style={[styles.chipText, selectedGroupId === item.id && styles.chipTextActive]}>{item.name}</Text>
            </Pressable>
          )}
          ListEmptyComponent={<Text style={styles.muted}>Create a group first</Text>}
        />
      </View>

      <View style={styles.card}>
        <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input} />
        <TextInput placeholder="Amount" value={amountText} onChangeText={setAmountText} keyboardType="numeric" style={styles.input} />
        {selectedGroup && (
          <FlatList
            horizontal
            data={selectedGroup.members}
            keyExtractor={(m) => m}
            contentContainerStyle={{ gap: 8 }}
            renderItem={({ item }) => (
              <Pressable onPress={() => setPayer(item)} style={[styles.chip, payer === item && styles.chipActive]}>
                <Text style={[styles.chipText, payer === item && styles.chipTextActive]}>{item}</Text>
              </Pressable>
            )}
          />
        )}
        <Pressable onPress={submit} style={styles.button}>
          <Text style={styles.buttonText}>Add Expense</Text>
        </Pressable>
      </View>

      {selectedGroupId ? (
        <>
          <ThemedText type="subtitle">Expenses</ThemedText>
          <FlatList
            data={expenses}
            keyExtractor={(e) => e.id}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={styles.itemTitle}>{item.description}</Text>
                <Text style={styles.muted}>{item.payer} paid ₹{item.amount}</Text>
              </View>
            )}
            ListEmptyComponent={<Text style={styles.muted}>No expenses yet</Text>}
          />

          <ThemedText type="subtitle" style={{ marginTop: 12 }}>Balances</ThemedText>
          <View style={styles.card}>
            {Object.keys(balances).length === 0 ? (
              <Text style={styles.muted}>No balances</Text>
            ) : (
              Object.entries(balances).map(([name, amt]) => (
                <View key={name} style={styles.row}> 
                  <Text style={styles.rowName}>{name}</Text>
                  <Text style={[styles.rowAmt, amt >= 0 ? styles.credit : styles.debit]}>₹{Math.abs(amt).toFixed(2)} {amt >= 0 ? 'to receive' : 'to pay'}</Text>
                </View>
              ))
            )}
          </View>

          <ThemedText type="subtitle" style={{ marginTop: 12 }}>Settlements</ThemedText>
          <View style={styles.card}>
            {settlements.length === 0 ? (
              <Text style={styles.muted}>All settled</Text>
            ) : (
              settlements.map((s, idx) => (
                <Text key={idx} style={styles.settleText}>{s.from} pays {s.to} ₹{s.amount.toFixed(2)}</Text>
              ))
            )}
          </View>
        </>
      ): null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 12, gap: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10 },
  button: { backgroundColor: '#34C759', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
  chip: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 16, borderWidth: 1, borderColor: '#ddd' },
  chipActive: { backgroundColor: '#222', borderColor: '#222' },
  chipText: { color: '#333' },
  chipTextActive: { color: '#fff' },
  item: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginVertical: 6 },
  itemTitle: { fontWeight: '600' },
  muted: { color: '#666' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  rowName: { color: '#333' },
  rowAmt: { fontWeight: '600' },
  credit: { color: '#34C759' },
  debit: { color: '#FF3B30' },
});


