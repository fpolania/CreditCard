import { addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp, setDoc } from 'firebase/firestore';
import { CardModel } from '@intechnity/react-native-kanban-board';
import { db } from '@/firebase/firebaseConfig';
import { CustomCardModel } from '@/types/types';


export const createTaskInFirestore = async (card: CustomCardModel): Promise<string> => {
    const ref = collection(db, 'tasks');
    const docRef = await addDoc(ref, {
        columnId: card.columnId,
        title: card.title,
        subtitle: card.subtitle,
        sortOrder: card.sortOrder,
        assignedTo: card?.assignedTo,
        creatDate: card?.creatDate,
        priority: card?.priority
    });

    return docRef.id;
};
export const updateTaskInFirestore = async (card: CustomCardModel): Promise<void> => {
    if (!card.id) throw new Error('No se puede actualizar: ID de la tarjeta no definido');
    const ref = doc(db, 'tasks', card.id);
    await setDoc(ref, {
        columnId: card.columnId,
        title: card.title,
        subtitle: card.subtitle,
        sortOrder: card.sortOrder,
        assignedTo: card?.assignedTo,
        creatDate: serverTimestamp(),
        priority: card?.priority
    });
};

export const getTasksFromFirestore = async (): Promise<CustomCardModel[]> => {
    const snapshot = await getDocs(collection(db, 'tasks'));
    const cards: CardModel[] = snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return new CardModel(
            docSnap.id,
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

    return cards;
};
export const handleDeleteTaskInFirestore = async (id: string): Promise<void> => {
    try {
        await deleteDoc(doc(db, 'tasks', id));
    } catch (error) {
        throw error;
    }
};