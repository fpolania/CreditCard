import React, { useEffect, useState } from 'react';
import { HStack, Input, Icon, Pressable, Text, Menu } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { getUsers } from '@/app/services/backend/AuthHandler';
import { Props, User } from '@/types/types';
import { FILTER_OPTIONS, PRIORITY } from '@/constants/default-value';
import { Colors } from '@/constants/Colors';


const TaskFilterBar = ({ onChange }: Props) => {
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState('Todos');
    const [selectedUser, setSelectedUser] = useState('');
    const [users, setusers] = useState<User[]>([]);
    const [selectedPriority, setSelectedPriority] = useState('');


    useEffect(() => {
        const loadTasks = async () => {
            try {
                const response = await getUsers();
                setusers(response);
            } catch (error) {
                console.error('Error cargando tareas:', error);
            }
        };
        loadTasks();
    }, []);

    const handleFilterPress = (filter: string) => {
        if (filter === 'Limpiar') return clearFilters();

        const isUser = users.some(user => user.email === filter);
        const isPriority = PRIORITY.includes(filter);

        if (isUser) return applyUserFilter(filter);
        if (isPriority) return applyPriorityFilter(filter);

        applyGenericFilter(filter);
    };

    const applyUserFilter = (email: string) => {
        setSelectedUser(email);
        setSelected('Usuarios');
        onChange(search, 'Usuarios', email);
    };

    const applyPriorityFilter = (priority: string) => {
        setSelected('Prioridad');
        setSelectedPriority(priority);
        setSelectedUser('');
        onChange(search, 'Prioridad', priority);
    };

    const applyGenericFilter = (filter: string) => {
        setSelected(filter);
        setSelectedUser('');
        setSelectedPriority('');
        onChange(search, filter, '');
    };


    const clearFilters = () => {
        setSearch('');
        setSelected('Todos');
        setSelectedUser('');
        setSelectedPriority('');
        onChange('', 'Todos', '');
    };


    const handleSearchChange = (text: string) => {
        setSearch(text);
        onChange(text, selected, selectedUser);
    };
    return (
        <>
            <Input
                placeholder="Buscar una tarea"
                value={search}
                onChangeText={handleSearchChange}
                borderRadius={20}
                borderColor={'blue'}
                InputLeftElement={
                    <Icon as={<MaterialIcons name="search" />} size={5} ml="2" color="gray.400" />
                }
                my={2}
                mx={4}
            />
            <HStack space={2} px={3} py={2}>
                {FILTER_OPTIONS.map(option => {
                    if (option === FILTER_OPTIONS[2]) {
                        return (
                            <Menu
                                key="Usuarios"
                                trigger={triggerProps => (
                                    <Pressable
                                        {...triggerProps}
                                        style={{
                                            paddingHorizontal: 12,
                                            paddingVertical: 6,
                                            borderRadius: 20,
                                            backgroundColor: selected === FILTER_OPTIONS[2] ? Colors.filter.backgroundSuccess : Colors.filter.backgroundNeutral,
                                            borderWidth: 1,
                                            borderColor: selected === FILTER_OPTIONS[2] ? Colors.filter.borderActive : Colors.filter.borderInactive,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Text style={{ color: Colors.filter.default, marginRight: 4 }}>Usuarios</Text>
                                        <Icon as={MaterialIcons} name="arrow-drop-down" size="sm" />
                                    </Pressable>
                                )}
                            >
                                {users.map(user => {
                                    const email = user.email;
                                    const username = email?.split('@')[0] ?? 'Usuario';
                                    const isSelected = selectedUser === email;

                                    return (
                                        <Menu.Item
                                            key={user.uid}
                                            onPress={() => handleFilterPress(email)}
                                            style={{
                                                backgroundColor: isSelected ? Colors.filter.backgroundInfo : Colors.filter.transparent,
                                            }}
                                        >
                                            <Text style={{ color: isSelected ? Colors.filter.textBlueDark : Colors.filter.textBlackHard }}>
                                                {username}
                                            </Text>
                                        </Menu.Item>
                                    );
                                })}
                            </Menu>
                        );
                    }

                    if (option === FILTER_OPTIONS[1]) {
                        return (
                            <Menu
                                key="Prioridad"
                                trigger={triggerProps => (
                                    <Pressable
                                        {...triggerProps}
                                        style={{
                                            paddingHorizontal: 12,
                                            paddingVertical: 6,
                                            borderRadius: 20,
                                            backgroundColor: selected === FILTER_OPTIONS[1] ? Colors.filter.backgroundSuccess : Colors.filter.backgroundNeutral,
                                            borderWidth: 1,
                                            borderColor: selected === FILTER_OPTIONS[1] ? Colors.filter.borderActive : Colors.filter.borderInactive,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Text style={{ color: Colors.filter.default, marginRight: 4 }}>Prioridad</Text>
                                        <Icon as={MaterialIcons} name="arrow-drop-down" size="sm" />
                                    </Pressable>
                                )}
                            >
                                {PRIORITY.map(level => (
                                    <Menu.Item
                                        key={level}
                                        onPress={() => handleFilterPress(level)}
                                        style={{
                                            backgroundColor: selectedPriority === level ? '#dbeafe' : 'transparent',
                                        }}
                                    >
                                        <Text style={{ color: selectedPriority === level ? '#1d4ed8' : '#111' }}>
                                            {level}
                                        </Text>
                                    </Menu.Item>
                                ))}
                            </Menu>
                        );
                    }



                    return (
                        <Pressable
                            key={option}
                            onPress={() => handleFilterPress(option)}
                            style={{
                                paddingHorizontal: 12,
                                paddingVertical: 6,
                                borderRadius: 20,
                                backgroundColor:
                                    option === FILTER_OPTIONS[3]
                                        ? Colors.filter.backgroundDanger
                                        : selected === option && option !== FILTER_OPTIONS[3]
                                            ? Colors.filter.backgroundSuccess
                                            : Colors.filter.backgroundNeutral,
                                borderWidth: 1,
                                borderColor: selected === option && option !== FILTER_OPTIONS[3] ? Colors.filter.borderActive : Colors.filter.borderInactive,
                            }}
                        >
                            <Text
                                style={{
                                    color: option === FILTER_OPTIONS[3]
                                        ? Colors.filter.danger
                                        : selected === option && option !== FILTER_OPTIONS[3]
                                            ? Colors.filter.success
                                            : Colors.filter.default,
                                    fontWeight: option === FILTER_OPTIONS[3] ? 'bold' : 'normal',
                                }}
                            >
                                {option}
                            </Text>
                        </Pressable>
                    );
                })}
            </HStack>

        </>
    );
};

export default TaskFilterBar;
