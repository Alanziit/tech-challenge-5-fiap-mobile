import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Switch,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ChecklistItem = { text: string; done: boolean };
type TaskType = { text: string; checklist: ChecklistItem[]; adding?: boolean };
type Tasks = {
  todo: TaskType[];
  doing: TaskType[];
  done: TaskType[];
};

const STORAGE_KEY = '@mindease_kanban_tasks';

export default function Kanban() {
  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState<Tasks>({
    todo: [],
    doing: [],
    done: [],
  });

  // 🔹 Carregar tarefas salvas
  useEffect(() => {
    loadTasks();
  }, []);

  // 🔹 Salvar tarefas sempre que mudar
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  async function loadTasks() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setTasks(JSON.parse(data));
      }
    } catch (e) {
      console.log('Erro ao carregar tarefas', e);
    }
  }

  async function saveTasks(data: Tasks) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.log('Erro ao salvar tarefas', e);
    }
  }

  function addTask() {
    if (!newTask.trim()) {
      Alert.alert('Erro', 'Nome da tarefa obrigatório');
      return;
    }

    setTasks(prev => ({
      ...prev,
      todo: [...prev.todo, { text: newTask, checklist: [] }],
    }));

    setNewTask('');
  }

  function confirmDelete(col: keyof Tasks, index: number) {
    Alert.alert('Excluir tarefa?', 'Deseja excluir esta tarefa?', [
      { text: 'Cancelar' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          const updated = structuredClone(tasks);
          updated[col].splice(index, 1);
          setTasks(updated);
        },
      },
    ]);
  }

  function toggleChecklist(col: keyof Tasks, idx: number, ci: number) {
    if (col === 'done') return;

    const updated = structuredClone(tasks);
    updated[col][idx].checklist[ci].done =
      !updated[col][idx].checklist[ci].done;
    setTasks(updated);
  }

  function enableChecklistInput(col: keyof Tasks, idx: number) {
    if (col === 'done') return;

    const updated = structuredClone(tasks);
    updated[col][idx].adding = true;
    setTasks(updated);
  }

  function saveChecklist(col: keyof Tasks, idx: number, value: string) {
    if (col === 'done') return;

    const updated = structuredClone(tasks);

    if (value.trim() !== '') {
      updated[col][idx].checklist.push({ text: value, done: false });
    }

    updated[col][idx].adding = false;
    setTasks(updated);
  }

  function progress(t: TaskType) {
    if (t.checklist.length === 0) return 0;
    const done = t.checklist.filter(c => c.done).length;
    return Math.round((done / t.checklist.length) * 100);
  }

  function moveTask(from: keyof Tasks, to: keyof Tasks, index: number) {
    if (from === 'done') return;

    if (to === 'done') {
      Alert.alert(
        'Concluir tarefa?',
        'Ao concluir, ela não poderá mais ser movida ou editada.',
        [
          { text: 'Cancelar' },
          {
            text: 'Confirmar',
            onPress: () => {
              const updated = structuredClone(tasks);
              const task = updated[from][index];

              task.checklist = task.checklist.map(c => ({
                ...c,
                done: true,
              }));

              updated[from].splice(index, 1);
              updated.done.push(task);

              setTasks(updated);
            },
          },
        ]
      );
      return;
    }

    const updated = structuredClone(tasks);
    const task = updated[from][index];

    updated[from].splice(index, 1);
    updated[to].push(task);

    setTasks(updated);
  }

  function renderTask(task: TaskType, col: keyof Tasks, index: number) {
    return (
      <View style={[styles.card, col === 'done' && styles.done]}>
        <View style={styles.header}>
          <Text>{task.text}</Text>
          <Button title="🗑️" onPress={() => confirmDelete(col, index)} />
        </View>

        {col !== 'done' && !task.adding && (
          <Button
            title="+ Adicionar checklist"
            onPress={() => enableChecklistInput(col, index)}
          />
        )}

        {task.adding && col !== 'done' && (
          <TextInput
            autoFocus
            placeholder="Digite o item"
            style={styles.input}
            onBlur={e => saveChecklist(col, index, e.nativeEvent.text)}
          />
        )}

        {task.checklist.length > 0 && (
          <>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progress,
                  { width: `${progress(task)}%` },
                ]}
              />
            </View>

            {task.checklist.map((c, ci) => (
              <View key={ci} style={styles.checkRow}>
                <Switch
                  value={c.done}
                  onValueChange={() =>
                    toggleChecklist(col, index, ci)
                  }
                  disabled={col === 'done'}
                />
                <Text>{c.text}</Text>
              </View>
            ))}
          </>
        )}

        <View style={styles.actions}>
          {col === 'doing' && (
            <Button
              title="⬅ A Fazer"
              onPress={() => moveTask(col, 'todo', index)}
            />
          )}

          {col === 'todo' && (
            <Button
              title="➡ Em Progresso"
              onPress={() => moveTask(col, 'doing', index)}
            />
          )}

          {col === 'doing' && (
            <Button
              title="✔ Concluir"
              onPress={() => moveTask(col, 'done', index)}
            />
          )}
        </View>
      </View>
    );
  }

  function renderColumn(title: string, key: keyof Tasks) {
    return (
      <View style={styles.column}>
        <Text style={styles.columnTitle}>{title}</Text>
        <FlatList
          data={tasks[key]}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item, index }) =>
            renderTask(item, key, index)
          }
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.addArea}>
        <TextInput
          placeholder="Digite uma tarefa..."
          value={newTask}
          onChangeText={setNewTask}
          style={styles.input}
        />
        <Button title="Adicionar" onPress={addTask} />
      </View>

      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.page}>
          {renderColumn('A Fazer', 'todo')}
        </View>

        <View style={styles.page}>
          {renderColumn('Em Progresso', 'doing')}
        </View>

        <View style={styles.page}>
          {renderColumn('Concluído', 'done')}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  addArea: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  input: { borderWidth: 1, padding: 8, flex: 1 },
  column: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    padding: 8,
    borderRadius: 8,
  },
  columnTitle: { fontSize: 18, marginBottom: 6, textAlign: 'center' },
  card: { backgroundColor: '#fff', padding: 8, marginBottom: 8, borderRadius: 6 },
  done: { opacity: 0.6 },
  header: { flexDirection: 'row', justifyContent: 'space-between' },
  progressBar: {
    height: 8,
    backgroundColor: '#ddd',
    borderRadius: 4,
    marginVertical: 6,
  },
  progress: { height: 8, backgroundColor: '#4caf50' },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  page: {
    width: Dimensions.get('window').width,
    paddingRight: 10,
  },
});
