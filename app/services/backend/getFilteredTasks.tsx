import { collection, getDocs, query, where } from 'firebase/firestore';
import { CardModel } from '@intechnity/react-native-kanban-board';
import { db } from '@/firebase/firebaseConfig';
import { QueryConstraint } from 'firebase/firestore';

export const getFilteredTasksFromFirestore = async (
    searchText: string,
    columnFilter: string,
    userFilter?: string
): Promise<CardModel[]> => {
    const tasksRef = collection(db, 'tasks');
    const constraints: QueryConstraint[] = [];
    if (columnFilter === 'Prioridad') {
        constraints.push(where('priority', '==', userFilter));
    }
    if (columnFilter === 'Usuarios' && userFilter) {
        constraints.push(where('assignedTo', '==', userFilter));
    }

    const q = query(tasksRef, ...constraints);
    const snapshot = await getDocs(q);

    let tasks = snapshot.docs.map(doc => {
        const data = doc.data();
        return new CardModel(
            doc.id,
            data.columnId,
            data.title,
            data.subtitle,
            '',
            [],
            {
                assignedTo: data.assignedTo ?? '',
                priority: data.priority
            },
            data.sortOrder
        );
    });

    if (searchText.trim() !== '') {
        tasks = tasks.filter(task =>
            task.title.toLowerCase().includes(searchText.toLowerCase())
        );
    }

    return tasks;
};


