import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { getOrderBill } from '../../src/services/orderService';

const SWIGGY_RED = '#EF4F5F';
const DARK_GRAY = '#1C1C1C';
const LIGHT_GRAY = '#F5F5F5';

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [bill, setBill] = useState<any>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionIcon}>📷</Text>
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionText}>We need camera access to scan QR codes</Text>
          <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
            <Text style={styles.permissionBtnText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handleBarCodeScanned = async ({ data }: any) => {
    if (scanned) return;
    setScanned(true);

    try {
      const orderBill = await getOrderBill(data);
      setBill(orderBill);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No data found for this order');
      setScanned(false);
    }
  };

  const resetScanner = () => {
    setScanned(false);
    setBill(null);
  };

  if (bill) {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.billContainer}>
          <View style={styles.billHeader}>
            <Text style={styles.billIcon}>✓</Text>
            <Text style={styles.billTitle}>Order Bill</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Information</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Order ID</Text>
              <Text style={styles.infoValue}>{bill.order_number || bill.id.slice(0, 8)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date</Text>
              <Text style={styles.infoValue}>{new Date(bill.created_at).toLocaleString()}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customer Details</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={styles.infoValue}>{bill.users?.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{bill.users?.phone}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Items Ordered</Text>
            {bill.order_items?.map((item: any, idx: number) => (
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
            <Text style={styles.totalAmount}>₹{bill.total_amount}</Text>
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.scanAgainBtn} onPress={resetScanner}>
          <Text style={styles.scanAgainBtnText}>🔄 Scan Another</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      />
      <View style={styles.overlay}>
        <View style={styles.scannerFrame}>
          <View style={styles.corner} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />
        </View>
        <Text style={styles.scanText}>Point camera at QR code</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' },
  scannerFrame: { width: 250, height: 250, borderWidth: 2, borderColor: SWIGGY_RED, borderRadius: 20, position: 'relative' },
  corner: { position: 'absolute', width: 30, height: 30, borderTopWidth: 3, borderLeftWidth: 3, borderColor: SWIGGY_RED, top: -2, left: -2 },
  cornerTR: { borderTopWidth: 3, borderRightWidth: 3, borderLeftWidth: 0, top: -2, right: -2, left: 'auto' },
  cornerBL: { borderBottomWidth: 3, borderLeftWidth: 3, borderTopWidth: 0, bottom: -2, left: -2, top: 'auto' },
  cornerBR: { borderBottomWidth: 3, borderRightWidth: 3, borderTopWidth: 0, borderLeftWidth: 0, bottom: -2, right: -2, top: 'auto', left: 'auto' },
  scanText: { color: '#fff', fontSize: 16, backgroundColor: 'rgba(0,0,0,0.6)', padding: 12, borderRadius: 8, marginTop: 30, fontWeight: '600' },
  permissionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  permissionIcon: { fontSize: 60, marginBottom: 20 },
  permissionTitle: { fontSize: 20, fontWeight: '700', color: DARK_GRAY, marginBottom: 8, textAlign: 'center' },
  permissionText: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 30 },
  permissionBtn: { backgroundColor: SWIGGY_RED, paddingVertical: 14, paddingHorizontal: 40, borderRadius: 10 },
  permissionBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  billContainer: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 20 },
  billHeader: { alignItems: 'center', marginBottom: 24, paddingBottom: 16, borderBottomWidth: 2, borderBottomColor: LIGHT_GRAY },
  billIcon: { fontSize: 40, color: SWIGGY_RED, marginBottom: 8 },
  billTitle: { fontSize: 24, fontWeight: '700', color: DARK_GRAY },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: DARK_GRAY, marginBottom: 12, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  infoLabel: { fontSize: 13, color: '#666', fontWeight: '600' },
  infoValue: { fontSize: 13, color: DARK_GRAY, fontWeight: '700' },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 13, fontWeight: '700', color: DARK_GRAY },
  itemQty: { fontSize: 12, color: '#999', marginTop: 4 },
  itemPrice: { fontSize: 14, fontWeight: '700', color: SWIGGY_RED },
  totalSection: { backgroundColor: LIGHT_GRAY, padding: 16, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 20 },
  totalLabel: { fontSize: 14, fontWeight: '600', color: '#666' },
  totalAmount: { fontSize: 24, fontWeight: '700', color: SWIGGY_RED },
  scanAgainBtn: { backgroundColor: SWIGGY_RED, paddingVertical: 16, marginHorizontal: 20, marginBottom: 20, borderRadius: 12, alignItems: 'center', shadowColor: SWIGGY_RED, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  scanAgainBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
