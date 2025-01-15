import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Box, Text, HStack, VStack, Image, Button, Icon } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { Product } from '../interfaces/product-interface';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';

const CartScreen = ({ route }) => {
  const navigation = useNavigation();
  const { selectedProducts: initialSelectedProducts } = route.params;
  const [selectedProducts, setSelectedProducts] = useState<Product[]>(initialSelectedProducts);


  // useFocusEffect(
  //   useCallback(() => {
  //     // Cambiamos las opciones del encabezado
  //     navigation.setOptions({
  //       headerLeft: () => (
  //         <TouchableOpacity
  //           onPress={() => navigation.goBack()}
  //           style={{ marginLeft: 10 }}
  //         >
  //           <MaterialIcons name="chevron-left" size={30} color="black" />
  //         </TouchableOpacity>
  //       ),
  //     });
  //   }, [navigation])
  // );

  /**
   *Renderiza los elementos seleccionado en la pantalla anterior.
   *
   * @param {{ item: Product }} { item }
   */
  const renderItem = ({ item }: { item: Product }) => (
    <Box style={styles.card}>
      <HStack space={3} alignItems="center">
        <Image
          source={{ uri: item.image }}
          alt="image-profile"
          size="lg"
          borderRadius={8}
          resizeMode="cover"
        />
        <VStack flex={1}>
          <Text bold fontSize="md" numberOfLines={1}>
            {item.name}
          </Text>
          <Text fontSize="sm" color="gray.500" numberOfLines={2}>
            {item.title}
          </Text>
          <Text bold fontSize="lg" color="emerald.500" mt={1}>
            ${item.price.toFixed(2)}
          </Text>
        </VStack>
        <Button
          variant="ghost"
          colorScheme="danger"
          size="sm"
          onPress={() => handleRemove(item.id)}
        >
          <Icon as={<MaterialIcons name="delete" />} size="8" color="red.600" />
        </Button>
      </HStack>
    </Box>
  );

  /**
   *Elimina productos.
   *
   * @param {string} id
   */
  const handleRemove = (id: string) => {
    setSelectedProducts((prevSelectedProducts) =>
      prevSelectedProducts.filter((product) => product.id !== id)
    );
  };


  const handleCheckout = () => {
    console.log('Proceeding to checkout');
    // Aquí manejas el proceso de compra
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={selectedProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text textAlign="center" mt={10} color="gray.500">
            No hay productos seleccionados.
          </Text>
        }
      />
      {selectedProducts.length > 0 && (
        <Box style={styles.footer}>
          <Text bold fontSize="lg" color="white">
            Total: $
            {selectedProducts
              .reduce((sum, product) => sum + product.price, 0)
              .toFixed(2)}
          </Text>
          <Button colorScheme="emerald" onPress={handleCheckout}>
            Checkout
          </Button>
        </Box>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 10,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#28a745',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});

export default CartScreen;
