import { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { getAnalytics } from '../../src/services/analyticsService';

const SWIGGY_RED = '#EF4F5F';
const DARK_GRAY = '#1C1C1C';
const LIGHT_GRAY = '#F5F5F5';

export default function AnalyticsScreen() {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week');
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const loadAnalytics = async () => {
    try {
      const analytics = await getAnalytics(period);
      setData(Array.isArray(analytics) ? analytics : []);
    } catch (error) {
      console.error('Failed to load analytics:', error);
      setData([]);
    }
  };

  const totalRevenue = data.reduce((sum: number, item: any) => sum + (item.revenue || 0), 0);
  const totalUnits = data.reduce((sum: number, item: any) => sum + (item.units || 0), 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics</Text>
        <Text style={styles.headerSubtitle}>Top selling products</Text>
      </View>

      <View style={styles.filterContainer}>
        {(['week', 'month', 'year'] as const).map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.filterBtn, period === p && styles.filterBtnActive]}
            onPress={() => setPeriod(p)}
          >
            <Text style={[styles.filterText, period === p && styles.filterTextActive]}>
              {p === 'week' ? '📅 Week' : p === 'month' ? '📊 Month' : '📈 Year'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {data.length > 0 && (
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Revenue</Text>
            <Text style={styles.statValue}>₹{totalRevenue.toFixed(0)}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Units Sold</Text>
            <Text style={styles.statValue}>{totalUnits}</Text>
          </View>
        </View>
      )}

      <FlatList
        data={data}
        keyExtractor={(item, idx) => idx.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>#{index + 1}</Text>
            </View>
            <View style={styles.content}>
              <Text style={styles.name}>{item.name}</Text>
              <View style={styles.stats}>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Sold</Text>
                  <Text style={styles.statNumber}>{item.units || 0}</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Revenue</Text>
                  <Text style={styles.revenue}>₹{(item.revenue || 0).toFixed(0)}</Text>
                </View>
              </View>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📊</Text>
            <Text style={styles.emptyText}>No data available for this period</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: LIGHT_GRAY },
  header: { backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  headerTitle: { fontSize: 24, fontWeight: '700', color: DARK_GRAY },
  headerSubtitle: { fontSize: 12, color: '#999', marginTop: 4 },
  filterContainer: { flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 12, gap: 8, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  filterBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: LIGHT_GRAY, alignItems: 'center', borderWidth: 1.5, borderColor: 'transparent' },
  filterBtnActive: { backgroundColor: SWIGGY_RED, borderColor: SWIGGY_RED },
  filterText: { fontSize: 12, color: '#666', fontWeight: '600' },
  filterTextActive: { color: '#fff', fontWeight: '700' },
  statsContainer: { flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 12, gap: 12 },
  statCard: { flex: 1, backgroundColor: '#fff', padding: 14, borderRadius: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  statLabel: { fontSize: 11, color: '#999', fontWeight: '600', marginBottom: 4 },
  statValue: { fontSize: 18, fontWeight: '700', color: SWIGGY_RED },
  listContent: { paddingHorizontal: 12, paddingVertical: 12 },
  card: { backgroundColor: '#fff', marginHorizontal: 8, marginVertical: 8, padding: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  rankBadge: { width: 50, height: 50, borderRadius: 25, backgroundColor: SWIGGY_RED, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  rankText: { color: '#fff', fontWeight: '700', fontSize: 18 },
  content: { flex: 1 },
  name: { fontSize: 15, fontWeight: '700', color: DARK_GRAY, marginBottom: 4 },
  category: { fontSize: 12, color: '#999', marginBottom: 10 },
  stats: { flexDirection: 'row', gap: 16 },
  stat: { flex: 1 },
  statLabelSmall: { fontSize: 11, color: '#999', fontWeight: '600', marginBottom: 2 },
  statNumber: { fontSize: 14, fontWeight: '700', color: DARK_GRAY },
  revenue: { fontSize: 14, fontWeight: '700', color: SWIGGY_RED },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 14, color: '#999', fontWeight: '500' },
});
