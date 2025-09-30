import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ExpensesContext = createContext(undefined);

const GROUPS_KEY = 'smart-splitter.groups.v1';
const EXPENSES_KEY = 'smart-splitter.expenses.v1';

function generateId(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}_${Date.now().toString(36)}`;
}

export const ExpensesProvider = ({ children }) => {
  const [groups, setGroups] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [groupsRaw, expensesRaw] = await Promise.all([
          AsyncStorage.getItem(GROUPS_KEY),
          AsyncStorage.getItem(EXPENSES_KEY),
        ]);
        if (groupsRaw) setGroups(JSON.parse(groupsRaw));
        if (expensesRaw) setExpenses(JSON.parse(expensesRaw));
      } catch (err) {
        // noop
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(GROUPS_KEY, JSON.stringify(groups)).catch(() => {});
  }, [groups]);

  useEffect(() => {
    AsyncStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses)).catch(() => {});
  }, [expenses]);

  const addGroup = useCallback((name, members) => {
    const trimmedMembers = members.map(m => m.trim()).filter(Boolean);
    const uniqueMembers = Array.from(new Set(trimmedMembers));
    const newGroup = { id: generateId('grp'), name: name.trim() || 'Group', members: uniqueMembers };
    setGroups(prev => [newGroup, ...prev]);
  }, []);

  const addExpense = useCallback((groupId, description, amount, payer) => {
    if (!groupId || !amount || !payer) return;
    const newExpense = {
      id: generateId('exp'),
      groupId,
      description: description.trim() || 'Expense',
      amount: Math.max(0, Number(amount) || 0),
      payer,
      createdAt: Date.now(),
    };
    setExpenses(prev => [newExpense, ...prev]);
  }, []);

  const getGroupById = useCallback((groupId) => groups.find(g => g.id === groupId), [groups]);
  const getExpensesByGroup = useCallback((groupId) => expenses.filter(e => e.groupId === groupId), [expenses]);

  const computeBalances = useCallback((groupId) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return {};
    const groupExpenses = expenses.filter(e => e.groupId === groupId);
    const balances = Object.fromEntries(group.members.map(m => [m, 0]));
    if (group.members.length === 0) return balances;

    for (const exp of groupExpenses) {
      const share = exp.amount / group.members.length;
      for (const member of group.members) {
        balances[member] -= share;
      }
      balances[exp.payer] += exp.amount;
    }
    Object.keys(balances).forEach((key) => {
      balances[key] = Math.round(balances[key] * 100) / 100;
    });
    return balances;
  }, [groups, expenses]);

  const computeSettlements = useCallback((groupId) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return [];
    const balances = computeBalances(groupId);
    const creditors = Object.entries(balances)
      .filter(([, amt]) => amt > 0)
      .map(([name, amt]) => ({ name, amt }));
    const debtors = Object.entries(balances)
      .filter(([, amt]) => amt < 0)
      .map(([name, amt]) => ({ name, amt: -amt }));

    creditors.sort((a, b) => b.amt - a.amt);
    debtors.sort((a, b) => b.amt - a.amt);

    const settlements = [];
    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
      const pay = Math.min(debtors[i].amt, creditors[j].amt);
      if (pay > 0.009) {
        settlements.push({ from: debtors[i].name, to: creditors[j].name, amount: Math.round(pay * 100) / 100 });
      }
      debtors[i].amt -= pay;
      creditors[j].amt -= pay;
      if (debtors[i].amt <= 0.009) i++;
      if (creditors[j].amt <= 0.009) j++;
    }
    return settlements;
  }, [groups, computeBalances]);

  const removeGroup = useCallback((groupId) => {
    setGroups(prev => prev.filter(g => g.id !== groupId));
    setExpenses(prev => prev.filter(e => e.groupId !== groupId));
  }, []);

  const value = useMemo(() => ({
    groups,
    expenses,
    addGroup,
    addExpense,
    removeGroup,
    getGroupById,
    getExpensesByGroup,
    computeBalances,
    computeSettlements,
  }), [groups, expenses, addGroup, addExpense, removeGroup, getGroupById, getExpensesByGroup, computeBalances, computeSettlements]);

  if (!hydrated) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return <ExpensesContext.Provider value={value}>{children}</ExpensesContext.Provider>;
};

export function useExpenses() {
  const ctx = useContext(ExpensesContext);
  if (!ctx) throw new Error('useExpenses must be used within ExpensesProvider');
  return ctx;
}


