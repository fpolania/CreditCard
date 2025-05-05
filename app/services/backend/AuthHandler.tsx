import { auth, db } from '@/firebase/firebaseConfig';
import { AuthMode, User } from '@/types/types';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, doc, getDocs, serverTimestamp, setDoc } from 'firebase/firestore';



export const authHandler = async (
    mode: AuthMode,
    email: string,
    password: string
) => {
    try {
        if (mode === 'login') {
            const login = await signInWithEmailAndPassword(auth, email, password);
            return login;
        } else {
            const register = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, 'users', register.user.uid), {
                email: register.user.email,
                createdAt: serverTimestamp(),
            });
            return register;
        }
    } catch (error: any) {
        throw error;
    }
};
export const getUsers = async (): Promise<User[]> => {
    const usersSnapshot = await getDocs(collection(db, 'users'));

    const users: User[] = usersSnapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
    })) as User[];

    return users;
};
export const logout = async () => {
    try {
        await signOut(auth);
        
    } catch (error) {
        console.error(error);
    }
};