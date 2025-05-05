import React from 'react';
import {
    Modal,
    View,
    TouchableOpacity,
    StyleSheet,
    Pressable,
} from 'react-native';
import {
    VStack,
    Input,
    Button,
    Text,
    Icon,
    HStack
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { CustomCardModel, User } from '@/types/types';
import { PRIORITY } from '@/constants/default-value';
import { Colors } from '@/constants/Colors';

type Props = {
    visible: boolean;
    onClose: () => void;
    onSave: () => void;
    selectedCard: CustomCardModel | null;
    updateCard: (key: keyof CustomCardModel, value: string) => void;
    users: User[];
};

const TaskModal = ({
    visible,
    onClose,
    onSave,
    selectedCard,
    updateCard,
    users,
}: Props) => {
    const isNew = !selectedCard?.id;
    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={{ alignItems: 'center', marginBottom: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                            {isNew ? 'Crear tarea' : 'Actualizar tarea'}
                        </Text>
                    </View>

                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Icon color={Colors.dark.background} size={30} as={<MaterialIcons name="close" />} ml={1} />
                    </TouchableOpacity>

                    <VStack space={4}>
                        <Input
                            placeholder="Título"
                            value={selectedCard?.title || ''}
                            borderRadius={10}
                            height={10}
                            onChangeText={text => updateCard('title', text)}
                        />
                        <Input
                            placeholder="Descripción"
                            value={selectedCard?.subtitle || ''}
                            borderRadius={10}
                            height={10}
                            onChangeText={text => updateCard('subtitle', text)}
                        />
                        {isNew && (
                            <Input
                                placeholder="Asignar A"
                                value={selectedCard?.assignedTo}
                                borderRadius={10}
                                height={10}
                                onChangeText={text => updateCard('assignedTo', text)}
                            />
                        )}
                        <HStack space={3} justifyContent="center">
                            {PRIORITY.map(level => {
                                const isSelected = selectedCard?.priority === level;
                                const getColor = () => {
                                    if (level === PRIORITY[0]) return isSelected ? Colors.priority.alta : Colors.priority.defaultAlta;
                                    if (level === PRIORITY[2]) return isSelected ? Colors.priority.Media : Colors.priority.defaultMedia;
                                    if (level === PRIORITY[1]) return isSelected ? Colors.priority.Baja : Colors.priority.defaultBaja;
                                    return Colors.priority.colorReturn;
                                };
                                return (
                                    <Pressable
                                        key={level}
                                        onPress={() => updateCard('priority', level)}
                                        style={{
                                            paddingHorizontal: 12,
                                            paddingVertical: 6,
                                            borderRadius: 20,
                                            backgroundColor: getColor(),
                                            borderWidth: 1,
                                            borderColor: Colors.light.background
                                        }}
                                    >
                                        <Text style={{ color: Colors.dark.background, fontWeight: '500' }}>
                                            {level}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </HStack>
                    </VStack>

                    <Button borderRadius={50} top={4} onPress={onSave}>
                        Guardar
                    </Button>
                </View>
            </View>
        </Modal>
    );
};

export default TaskModal;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: Colors.modal.fondo,
    },
    modalContent: {
        margin: 20,
        padding: 20,
        borderRadius: 10,
        backgroundColor: Colors.modal.contenido,
        position: 'relative',
    },
    closeButton: {
        position: 'absolute',
        right: 10,
        top: 10,
        zIndex: 1,
        padding: 8,
    },
});
