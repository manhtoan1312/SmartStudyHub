import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import getRole from "../services/RoleService";
import { GetAllFolder } from "../services/Guest/FolderService";
import { FlatList, Modal, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { Entypo } from "@expo/vector-icons";

const SelectFolderModal = ({ visible, onSelect, onClose, navigation, folderId }) => {
    console.log(folderId)
  const [folderList, setFolderList] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchDataOnFocus = async () => {
      if (isFocused) {
        await fetchData();
      }
    };
    fetchDataOnFocus();
  }, [isFocused]);

  const fetchData = async () => {
    let id = await AsyncStorage.getItem("id");
    const role = await getRole();
    if (role) {
      id = role.id;
    }
    const response = await GetAllFolder(id);
    if (response.success) {
      setFolderList(response.data);
    }
  };

  const handleAddFolder = () => {
    onClose();
    navigation.navigate("AddFolder");
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={[styles.item, item.id == folderId && styles.itemSelect]}
        onPress={() => onSelect(item.id)}
      >
        <Entypo style={{paddingRight:10}} name="folder" size={24} color={item.colorCode} />
        <Text>{item.folderName}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.modalContent} activeOpacity={1}>
          <TouchableOpacity style={styles.item} onPress={handleAddFolder}>
            <Text>+ Add a new folder</Text>
          </TouchableOpacity>
          <FlatList
            data={folderList}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            ListFooterComponent={<View style={{ height: 20 }} />}
            onEndReachedThreshold={0.3}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default SelectFolderModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  addFolderButton: {
    marginBottom: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemSelect: {
    backgroundColor: '#FFA07A',
  },
});
