import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { logout, getUser } from '../../src/services/authService';

const SWIGGY_RED = '#EF4F5F';
const DARK_GRAY = '#1C1C1C';
const LIGHT_GRAY = '#F5F5F5';

export default function SettingsScreen() {
  const [user, setUser] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '' });
  const router = useRouter();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await getUser();
      setUser(userData);
      if (userData) {
        setEditForm({ name: userData.name || '', email: userData.email || '' });
      }
    } catch (error) {
      console.error('Failed to load user:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel' },
      {
        text: 'Logout',
        onPress: async () => {
          try {
            await logout();
            router.replace('/(auth)/login');
          } catch (error) {
            Alert.alert('Error', 'Failed to logout');
          }
        },
      },
    ]);
  };

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleSaveProfile = () => {
    Alert.alert('Success', 'Profile updated successfully');
    setShowEditModal(false);
  };

  const handleChangePicture = () => {
    Alert.alert('Change Picture', 'Select an option', [
      { text: 'Cancel' },
      { text: 'Camera', onPress: () => Alert.alert('Info', 'Camera feature coming soon') },
      { text: 'Gallery', onPress: () => Alert.alert('Info', 'Gallery feature coming soon') },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <View style={styles.profilePicture}>
              <Text style={styles.profileIcon}>👤</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name || 'Admin User'}</Text>
              <Text style={styles.profilePhone}>{user?.phone || 'N/A'}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.changePictureBtn} onPress={handleChangePicture}>
            <Text style={styles.changePictureBtnText}>📷 Change Picture</Text>
          </TouchableOpacity>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={handleEditProfile}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>✏️</Text>
              <View>
                <Text style={styles.menuTitle}>Edit Profile</Text>
                <Text style={styles.menuSubtitle}>Update your information</Text>
              </View>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Info', 'Email: ' + (user?.email || 'Not set'))}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>📧</Text>
              <View>
                <Text style={styles.menuTitle}>Email</Text>
                <Text style={styles.menuSubtitle}>{user?.email || 'Not set'}</Text>
              </View>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Info', 'Phone: ' + (user?.phone || 'N/A'))}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>📱</Text>
              <View>
                <Text style={styles.menuTitle}>Phone</Text>
                <Text style={styles.menuSubtitle}>{user?.phone || 'N/A'}</Text>
              </View>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* App Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('About', 'Cafe Admin v1.0.0')}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>ℹ️</Text>
              <View>
                <Text style={styles.menuTitle}>About</Text>
                <Text style={styles.menuSubtitle}>App version and info</Text>
              </View>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Help', 'Contact support at support@cafe.com')}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>❓</Text>
              <View>
                <Text style={styles.menuTitle}>Help & Support</Text>
                <Text style={styles.menuSubtitle}>Get help and support</Text>
              </View>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Section */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutBtnText}>🚪 Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={showEditModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formScroll}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={editForm.name}
                onChangeText={(text) => setEditForm({ ...editForm, name: text })}
              />

              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                keyboardType="email-address"
                value={editForm.email}
                onChangeText={(text) => setEditForm({ ...editForm, email: text })}
              />
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowEditModal(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile}>
                <Text style={styles.saveBtnText}>Save</Text>
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
  content: { flex: 1, paddingVertical: 12 },
  profileSection: { backgroundColor: '#fff', marginHorizontal: 12, marginVertical: 12, padding: 20, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  profileHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  profilePicture: { width: 70, height: 70, borderRadius: 35, backgroundColor: SWIGGY_RED, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  profileIcon: { fontSize: 40 },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 18, fontWeight: '700', color: DARK_GRAY },
  profilePhone: { fontSize: 13, color: '#999', marginTop: 4 },
  changePictureBtn: { backgroundColor: LIGHT_GRAY, paddingVertical: 12, borderRadius: 10, alignItems: 'center', borderWidth: 1.5, borderColor: SWIGGY_RED },
  changePictureBtnText: { color: SWIGGY_RED, fontWeight: '700', fontSize: 14 },
  section: { backgroundColor: '#fff', marginHorizontal: 12, marginVertical: 12, borderRadius: 12, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: DARK_GRAY, paddingHorizontal: 20, paddingVertical: 12, backgroundColor: LIGHT_GRAY, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  menuIcon: { fontSize: 24, marginRight: 16 },
  menuTitle: { fontSize: 14, fontWeight: '700', color: DARK_GRAY },
  menuSubtitle: { fontSize: 12, color: '#999', marginTop: 4 },
  menuArrow: { fontSize: 20, color: '#999' },
  logoutBtn: { backgroundColor: SWIGGY_RED, marginHorizontal: 12, marginVertical: 20, paddingVertical: 16, borderRadius: 12, alignItems: 'center', shadowColor: SWIGGY_RED, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  logoutBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingTop: 20, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: DARK_GRAY },
  closeIcon: { fontSize: 24, color: '#999' },
  formScroll: { paddingHorizontal: 20, maxHeight: '70%' },
  label: { fontSize: 13, fontWeight: '600', color: DARK_GRAY, marginBottom: 8, marginTop: 16 },
  input: { borderWidth: 1.5, borderColor: '#E0E0E0', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: DARK_GRAY, backgroundColor: LIGHT_GRAY },
  modalActions: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingVertical: 16, borderTopWidth: 1, borderTopColor: '#E0E0E0' },
  cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 10, borderWidth: 1.5, borderColor: SWIGGY_RED, alignItems: 'center' },
  cancelBtnText: { color: SWIGGY_RED, fontWeight: '700', fontSize: 14 },
  saveBtn: { flex: 1, paddingVertical: 14, borderRadius: 10, backgroundColor: SWIGGY_RED, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
