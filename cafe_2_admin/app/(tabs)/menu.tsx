import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, TextInput, Alert, Switch, ScrollView } from 'react-native';
import { getMenuItems, addMenuItem, updateMenuItem, deleteMenuItem } from '../../src/services/menuService';

const SWIGGY_RED = '#EF4F5F';
const DARK_GRAY = '#1C1C1C';
const LIGHT_GRAY = '#F5F5F5';

export default function MenuScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image_url: '',
    available: true,
  });

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    try {
      const data = await getMenuItems();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      Alert.alert('Error', 'Failed to load menu');
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price) {
      Alert.alert('Error', 'Name and price are required');
      return;
    }

    try {
      if (editItem) {
        await updateMenuItem(editItem.id, form);
      } else {
        await addMenuItem({ ...form, price: parseFloat(form.price) });
      }
      loadMenu();
      closeModal();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save item');
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Item', 'Are you sure you want to delete this item?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            await deleteMenuItem(id);
            loadMenu();
          } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to delete');
          }
        },
      },
    ]);
  };

  const openModal = (item?: any) => {
    if (item) {
      setEditItem(item);
      setForm({
        name: item.name,
        description: item.description || '',
        price: item.price.toString(),
        category: item.category || '',
        image_url: item.image_url || '',
        available: item.available ?? true,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditItem(null);
    setForm({ name: '', description: '', price: '', category: '', image_url: '', available: true });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Menu Items</Text>
        <Text style={styles.headerSubtitle}>{items.length} items</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.name}>{item.name}</Text>
              {item.description && <Text style={styles.description}>{item.description}</Text>}
              <View style={styles.cardFooter}>
                <Text style={styles.price}>₹{item.price}</Text>
                <View style={[styles.badge, !item.available && styles.badgeInactive]}>
                  <Text style={styles.badgeText}>{item.available ? '✓ Available' : '✗ Unavailable'}</Text>
                </View>
              </View>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => openModal(item)} style={styles.editBtn}>
                <Text style={styles.actionIcon}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
                <Text style={styles.actionIcon}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity style={styles.fab} onPress={() => openModal()}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editItem ? 'Edit Item' : 'Add New Item'}</Text>
              <TouchableOpacity onPress={closeModal}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formScroll}>
              <Text style={styles.label}>Item Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Cappuccino"
                value={form.name}
                onChangeText={(text) => setForm({ ...form, name: text })}
              />

              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Item description"
                value={form.description}
                onChangeText={(text) => setForm({ ...form, description: text })}
                multiline
              />

              <Text style={styles.label}>Price *</Text>
              <TextInput
                style={styles.input}
                placeholder="₹ 0.00"
                keyboardType="numeric"
                value={form.price}
                onChangeText={(text) => setForm({ ...form, price: text })}
              />

              <Text style={styles.label}>Category</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Beverages"
                value={form.category}
                onChangeText={(text) => setForm({ ...form, category: text })}
              />

              <Text style={styles.label}>Image URL</Text>
              <TextInput
                style={styles.input}
                placeholder="https://..."
                value={form.image_url}
                onChangeText={(text) => setForm({ ...form, image_url: text })}
              />

              <View style={styles.switchContainer}>
                <Text style={styles.label}>Available</Text>
                <Switch
                  value={form.available}
                  onValueChange={(val) => setForm({ ...form, available: val })}
                  trackColor={{ false: '#E0E0E0', true: SWIGGY_RED }}
                  thumbColor="#fff"
                />
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={closeModal}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit}>
                <Text style={styles.saveBtnText}>Save Item</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: LIGHT_GRAY },
  header: { backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  headerTitle: { fontSize: 24, fontWeight: '700', color: DARK_GRAY },
  headerSubtitle: { fontSize: 12, color: '#999', marginTop: 4 },
  listContent: { paddingHorizontal: 12, paddingVertical: 12 },
  card: { backgroundColor: '#fff', marginHorizontal: 8, marginVertical: 8, padding: 16, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  cardContent: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700', color: DARK_GRAY, marginBottom: 4 },
  description: { fontSize: 12, color: '#666', marginBottom: 8 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: 18, fontWeight: '700', color: SWIGGY_RED },
  badge: { backgroundColor: '#E8F5E9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeInactive: { backgroundColor: '#FFEBEE' },
  badgeText: { fontSize: 11, fontWeight: '600', color: '#2E7D32' },
  actions: { flexDirection: 'row', gap: 8, justifyContent: 'center', alignItems: 'center' },
  editBtn: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#E3F2FD', justifyContent: 'center', alignItems: 'center' },
  deleteBtn: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#FFEBEE', justifyContent: 'center', alignItems: 'center' },
  actionIcon: { fontSize: 18 },
  fab: { position: 'absolute', right: 20, bottom: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: SWIGGY_RED, justifyContent: 'center', alignItems: 'center', shadowColor: SWIGGY_RED, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 8 },
  fabText: { color: '#fff', fontSize: 32, fontWeight: '700' },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingTop: 20, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: DARK_GRAY },
  closeIcon: { fontSize: 24, color: '#999' },
  formScroll: { paddingHorizontal: 20, maxHeight: '70%' },
  label: { fontSize: 13, fontWeight: '600', color: DARK_GRAY, marginBottom: 8, marginTop: 16 },
  input: { borderWidth: 1.5, borderColor: '#E0E0E0', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: DARK_GRAY, backgroundColor: LIGHT_GRAY },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  switchContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 16, paddingVertical: 12 },
  modalActions: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingVertical: 16, borderTopWidth: 1, borderTopColor: '#E0E0E0' },
  cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 10, borderWidth: 1.5, borderColor: SWIGGY_RED, alignItems: 'center' },
  cancelBtnText: { color: SWIGGY_RED, fontWeight: '700', fontSize: 14 },
  saveBtn: { flex: 1, paddingVertical: 14, borderRadius: 10, backgroundColor: SWIGGY_RED, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
