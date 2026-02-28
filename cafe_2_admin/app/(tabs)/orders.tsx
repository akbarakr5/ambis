import { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { getOrders } from '../../src/services/orderService';

const SWIGGY_RED = '#EF4F5F';
const DARK_GRAY = '#1C1C1C';
const LIGHT_GRAY = '#F5F5F5';

export default function OrdersScreen() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getOrders();
      const paidOrders = Array.isArray(data) ? data.filter((o: any) => o.payment_status === 'paid') : [];
      setOrders(paidOrders);
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Orders</Text>
        <Text style={styles.headerSubtitle}>{orders.length} paid orders</Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => setSelectedOrder(item)}
            activeOpacity={0.7}
          >
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.orderId}>Order #{item.order_number || item.id.slice(0, 8)}</Text>
                <Text style={styles.user}>👤 {item.users?.name || 'Guest'}</Text>
              </View>
              <Text style={styles.total}>₹{item.total_amount}</Text>
            </View>
            <View style={styles.cardFooter}>
              <Text style={styles.date}>📅 {formatDate(item.created_at)}</Text>
              <Text style={styles.items}>📦 {item.order_items?.length || 0} items</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />

      <Modal visible={!!selectedOrder} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Order Details</Text>
              <TouchableOpacity onPress={() => setSelectedOrder(null)}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            {selectedOrder && (
              <View style={styles.detailsContainer}>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Customer Info</Text>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Order ID:</Text>
                    <Text style={styles.infoValue}>{selectedOrder.order_number || selectedOrder.id.slice(0, 8)}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Name:</Text>
                    <Text style={styles.infoValue}>{selectedOrder.users?.name}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Phone:</Text>
                    <Text style={styles.infoValue}>{selectedOrder.users?.phone}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Date:</Text>
                    <Text style={styles.infoValue}>{formatDate(selectedOrder.created_at)}</Text>
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Order Items</Text>
                  {selectedOrder.order_items?.map((item: any, idx: number) => (
                    <View key={idx} style={styles.itemRow}>
                      <View style={styles.itemInfo}>
                        <Text style={styles.itemName}>{item.menu_items?.name}</Text>
                        <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
                      </View>
                      <Text style={styles.itemPrice}>₹{(item.price * item.quantity).toFixed(2)}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.totalSection}>
                  <Text style={styles.totalLabel}>Total Amount</Text>
                  <Text style={styles.totalAmount}>₹{selectedOrder.total_amount}</Text>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setSelectedOrder(null)}
            >
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
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
  card: { backgroundColor: '#fff', marginHorizontal: 8, marginVertical: 8, padding: 16, borderRadius: 12, borderLeftWidth: 4, borderLeftColor: SWIGGY_RED, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  orderId: { fontSize: 16, fontWeight: '700', color: DARK_GRAY },
  user: { fontSize: 13, color: '#666', marginTop: 4 },
  total: { fontSize: 18, fontWeight: '700', color: SWIGGY_RED },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  date: { fontSize: 12, color: '#999' },
  items: { fontSize: 12, color: '#999' },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  modalTitle: { fontSize: 20, fontWeight: '700', color: DARK_GRAY },
  closeIcon: { fontSize: 24, color: '#999' },
  detailsContainer: { paddingHorizontal: 20, paddingVertical: 16, maxHeight: '70%' },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: DARK_GRAY, marginBottom: 12, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  infoLabel: { fontSize: 13, color: '#666', fontWeight: '600' },
  infoValue: { fontSize: 13, color: DARK_GRAY, fontWeight: '700' },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 13, fontWeight: '700', color: DARK_GRAY },
  itemQty: { fontSize: 12, color: '#999', marginTop: 4 },
  itemPrice: { fontSize: 14, fontWeight: '700', color: SWIGGY_RED },
  totalSection: { backgroundColor: LIGHT_GRAY, padding: 16, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 16 },
  totalLabel: { fontSize: 14, fontWeight: '600', color: '#666' },
  totalAmount: { fontSize: 24, fontWeight: '700', color: SWIGGY_RED },
  closeBtn: { backgroundColor: SWIGGY_RED, paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginHorizontal: 20, marginVertical: 16 },
  closeBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
