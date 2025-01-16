import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Box, Text, HStack, VStack, Image, Button, Icon } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { Product } from '../interfaces/product-interface';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { removeProduct } from '../redux/actions';
import CustomBackdrop from '@/components/Backdrop';

const CartScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isBackdropVisible, setIsBackdropVisible] = useState(false);
  const selectedProducts = useSelector((state: any) => state.selectedProducts);


  const openBackdrop = () => {
    setIsBackdropVisible(true);
  };

  // Función para cerrar el Backdrop
  const closeBackdrop = () => {
    setIsBackdropVisible(false);
  };

  /**
   * Renderiza los elementos seleccionados en la pantalla de carrito.
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
   * Elimina un producto del carrito
   *
   * @param {string} id
   */
  const handleRemove = (id: string) => {
    dispatch(removeProduct(id));
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
        ListFooterComponent={
          selectedProducts.length > 0 ? (
            <View style={{ padding: 10 }}>
              <Text textAlign="center" fontSize="lg" bold>
                Cantidad de productos: {selectedProducts.length}
              </Text>
            </View>
          ) : null
        }
      />

      <CustomBackdrop
        visible={isBackdropVisible}
        handleOpen={openBackdrop}
        handleClose={closeBackdrop}
        amount={selectedProducts
          .reduce((sum, product) => sum + product.price, 0)
          .toFixed(2)}
      />
      {selectedProducts.length > 0 && (
        <Box style={styles.footer}>
          <Text bold fontSize="lg" color="white">
            Total: $
            {selectedProducts
              .reduce((sum, product) => sum + product.price, 0)
              .toFixed(2)}
          </Text>
          <Button colorScheme="cyan" borderRadius={30} onPress={openBackdrop}>
            IR A PAGAR
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
    backgroundColor: '#8FBCFFB2',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});

export default CartScreen;
