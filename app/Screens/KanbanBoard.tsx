import React, { useEffect, useState } from 'react';
import {
  View, Modal, Text, TouchableOpacity,
  StyleSheet, ActivityIndicator
} from 'react-native';
import { KanbanBoard, ColumnModel, CardModel } from '@intechnity/react-native-kanban-board';
import { StatusBar } from 'expo-status-bar';
import { createTaskInFirestore, getTasksFromFirestore, handleDeleteTaskInFirestore, updateTaskInFirestore } from '../services/backend/board-task';
import { Button, HStack, Icon, Input, VStack } from 'native-base';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import TaskFilterBar from '../../components/TaskFilterBar';
import { getFilteredTasksFromFirestore } from '../services/backend/getFilteredTasks';
import TaskModal from '@/components/TaskModal';
import { getUsers } from '../services/backend/AuthHandler';
import { CustomCardModel, User } from '@/types/types';
import { serverTimestamp } from 'firebase/firestore';
import { Colors } from '@/constants/Colors';


const KanbanScreen = () => {
  const [columns] = useState([
    new ColumnModel('todo', 'To Do', 1),
    new ColumnModel('progress', 'In Progress', 2),
    new ColumnModel('done', 'Done', 3),
  ]);

  const [cards, setCards] = useState<CardModel[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CustomCardModel | null>(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const [loadedCards, loadedUsers] = await Promise.all([
          getTasksFromFirestore(),
          getUsers(),
        ]);

        setCards(loadedCards);
        setUsers(loadedUsers);
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handleFilterChange = async (text: string, filter: string, user: string) => {
    setLoading(true);

    try {
      const tasks = await fetchTasks(text, filter, user);
      setCards(tasks);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async (text: string, filter: string, user: string) => {
    const shouldFetchAll = filter === 'Todos' && !text;
    return shouldFetchAll
      ? await getTasksFromFirestore()
      : await getFilteredTasksFromFirestore(text, filter, user);
  };

  const onCardPress = (item: CustomCardModel) => {
    const priority = item?.priority ?? item.item?.priority ?? '';
    const assignedTo = item?.assignedTo ?? item.item?.assignedTo ?? '';
    const creatDate = item?.creatDate ?? item.item?.creatDate ?? '';
    const normalizedCard: CustomCardModel = Object.assign(
      Object.create(Object.getPrototypeOf(item)),
      {
        ...item,
        priority,
        assignedTo,
        creatDate
      }
    );

    setSelectedCard(normalizedCard);
    setModalVisible(true);
  };

  const onDragEnd = async (
    sourceColumn: any,
    destColumn: any,
    movedCard: CustomCardModel,
    targetIndex: number
  ) => {
    const priority = movedCard?.priority ?? movedCard.item?.priority ?? '';
    const assignedTo = movedCard?.assignedTo ?? movedCard.item?.assignedTo ?? '';
    const creatDate = movedCard?.creatDate ?? movedCard.item?.creatDate ?? null;

    const updatedCard: CustomCardModel = Object.assign(
      new CardModel(
        movedCard.id,
        destColumn.id,
        movedCard.title,
        movedCard.subtitle,
        '',
        movedCard.tags,
        { assignedTo, priority, creatDate },
        movedCard.sortOrder
      ),
      {
        assignedTo,
        priority,
        creatDate
      }
    );

    await updateTaskInFirestore(updatedCard);
    const response = await getTasksFromFirestore();
    setCards(response);
  };
  const generateCode = () => Math.floor(1000 + Math.random() * 9000).toString();
  const handleSave = async () => {
    if (!selectedCard) return;
    setLoading(true);
    const isNew = !cards.some(c => c.id === selectedCard.id);
    try {
      if (isNew) {
        await handleCreateTask(selectedCard);
      } else {
        await handleUpdateTask(selectedCard);
      }
      const updatedCards = await getTasksFromFirestore();
      setCards(updatedCards);

    } catch (error) {
      console.error('Error al guardar la tarea:', error);
    } finally {
      setLoading(false);
      setModalVisible(false);
    }
  };

  const handleCreateTask = async (card: CustomCardModel) => {
    const code = generateCode();
    const newTask = {
      columnId: card.columnId,
      title: `${code}-${card.title}`,
      subtitle: card.subtitle,
      sortOrder: card.sortOrder,
      assignedTo: card.assignedTo,
      priority: card.priority,
      creatDate: serverTimestamp(),
    };
    const newId = await createTaskInFirestore(newTask as CustomCardModel);
    if (!newId) throw new Error('No se pudo crear la tarea');
  };

  const handleUpdateTask = async (card: CustomCardModel) => {
    await updateTaskInFirestore(card);
  };

  const updateCard = (key: keyof CustomCardModel, value: string) => {
    if (!selectedCard) return;
    setSelectedCard(prev => {
      if (!prev) return null;
      return Object.assign(Object.create(Object.getPrototypeOf(prev)), {
        ...prev,
        [key]: value
      });
    });
  };
  const openCreateModal = () => {
    const newCard = new CardModel(
      '',
      'todo',
      '',
      '',
      '',
      [],
      null,
      cards.length + 1
    );
    setSelectedCard(newCard);
    setModalVisible(true);
  };
  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await handleDeleteTaskInFirestore(id);
      const response = await getTasksFromFirestore();
      setCards(response);
    } catch (error: any) {
      console.log(error?.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };
  const renderCustomCard = (card: CustomCardModel) => {
    const priorityColors: Record<string, string> = {
      'Alta': Colors.priority.alta,
      'Media': Colors.priority.Media,
      'Baja': Colors.priority.Baja,
    };

    const priority = card.item?.priority;
    const assignedTo = card.item?.assignedTo;

    return (
      <>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{card.title}</Text>
          {priority && (
            <View
              style={{
                backgroundColor: priorityColors[priority],
                borderRadius: 12,
                paddingHorizontal: 8,
                paddingVertical: 2,
              }}
            >
              <Text style={{ color: 'white', fontSize: 12 }}>{priority}</Text>
            </View>
          )}
        </View>
        <Text numberOfLines={2} style={{ color: '#4B5563', marginTop: 4 }}>
          {card.subtitle}
        </Text>
        {
          assignedTo && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              <Text style={{ fontSize: 14, color: '#6B7280' }}>
                {assignedTo.split('@')[0]}
              </Text>
            </View>
          )
        }
        {
          card.columnId === 'todo' && (
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: 40,
                right: 2,
              }}
              onPress={() => handleDelete(card.id as string)}
            >
              <Icon color="red" size={10} as={<MaterialIcons name="delete-forever" />} />
            </TouchableOpacity>
          )
        }
      </>
    );
  };
  return (
    <View style={{ flex: 1, backgroundColor: Colors.light.backgroundMain }}>
      <StatusBar style="auto" />
      <TaskFilterBar onChange={handleFilterChange} />
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator
            size="large"
            color={Colors.light.loader}
            style={{ transform: [{ scale: 1.5 }] }}
          />
        </View>
      ) : (
        <KanbanBoard
          style={{ backgroundColor: Colors.light.backgroundMain }}
          columns={columns}
          cards={cards}
          cardContainerStyle={{ backgroundColor: Colors.light.backgroundCard }}
          onCardPress={onCardPress}
          onDragEnd={onDragEnd}
          renderCardContent={(card) => renderCustomCard(card)}
        />
      )}
      <Button onPress={openCreateModal} style={styles.butttonAdd}>
        <Icon
          color="white"
          size={30}
          as={<MaterialIcons name="add" />}
          ml={1}
        />
      </Button>
      <TaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
        selectedCard={selectedCard}
        updateCard={updateCard}
        users={users}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.light.modalBackdrop,
  },
  modalContent: {
    margin: 20,
    padding: 20,
    borderRadius: 10,
    backgroundColor: Colors.light.modalContent,
  },
  butttonAdd: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: Colors.light.buttonAdd,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    zIndex: 1,
    padding: 8,
  },
  card: {
    width: 'auto',
    height: 'auto',
  },
  cardTitle: {
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 12,
    color: Colors.light.cardSubtitle,
    width: '80%',
  },
  deleteButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    padding: 4,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.backgroundMain,
  },
});

export default KanbanScreen;
