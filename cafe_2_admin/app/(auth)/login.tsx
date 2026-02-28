import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { sendOTP, verifyOTP } from '../../src/services/authService';

const SWIGGY_RED = '#EF4F5F';
const DARK_GRAY = '#1C1C1C';
const LIGHT_GRAY = '#F5F5F5';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  // debugging output shown on screen
  const [debugLog, setDebugLog] = useState('');
  const logDebug = (msg: string) => {
    console.log(msg);
    setDebugLog((d) => d + msg + '\n');
  };
  const router = useRouter();

  const handleSendOTP = async () => {
    if (phone.length !== 10) {
      Alert.alert('Error', 'Enter valid 10-digit phone number');
      return;
    }
    setLoading(true);
    try {
      const res: any = await sendOTP(phone);
      setOtpSent(true);
      const message = res?.message || 'OTP sent to your phone';
      // auto-fill OTP if message contains digits
      const matched = (message || '').match(/\d{4,6}/);
      if (matched) setOtp(matched[0]);
      Alert.alert('OTP', message);
    } catch (error: any) {
      logDebug(`sendOTP error: ${error?.message || error}`);
      Alert.alert('Error', error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      Alert.alert('Error', 'Enter valid 6-digit OTP');
      return;
    }
    setLoading(true);
    try {
        logDebug(`Verifying OTP for ${phone} ${otp}`);
      const res: any = await verifyOTP(phone, otp);
      logDebug(`verifyOTP result: ${JSON.stringify(res)}`);
      // ensure a successful response
      if (!res || !res.success) {
        logDebug('verifyOTP returned failure');
        const msg = (res as any)?.message;
        throw new Error(msg || 'Verification failed');
      }

      // show success to the user then navigate to root
      Alert.alert(
        'Success',
        'Logged in',
        [{ text: 'OK', onPress: () => {
            logDebug('user tapped OK, navigating to root');
            router.replace('/');
          } }],
        { cancelable: false }
      );

      // also try to navigate immediately in case alert is non-blocking
      try {
        logDebug('attempting immediate navigate to root');
        router.replace('/');
      } catch (err) {
        logDebug(`immediate navigation failed: ${err}`);
      }
    } catch (error: any) {
      logDebug(`verifyOTP error: ${error?.message || error}`);
      console.error('verifyOTP error:', error);
      Alert.alert('Error', error.message || 'Invalid OTP or not authorized');
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}>☕</Text>
          <Text style={styles.title}>Cafe Admin</Text>
          <Text style={styles.subtitle}>Manage your cafe with ease</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter 10-digit number"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            maxLength={10}
            value={phone}
            onChangeText={setPhone}
            editable={!otpSent && !loading}
          />

          {otpSent && (
            <>
              <Text style={styles.label}>Enter OTP</Text>
              <TextInput
                style={styles.input}
                placeholder="6-digit OTP"
                placeholderTextColor="#999"
                keyboardType="number-pad"
                maxLength={6}
                value={otp}
                onChangeText={setOtp}
                editable={!loading}
              />
            </>
          )}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={otpSent ? handleVerifyOTP : handleSendOTP}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {loading ? '⏳ Loading...' : otpSent ? '✓ Verify OTP' : 'Send OTP'}
            </Text>
          </TouchableOpacity>

          {otpSent && (
            <TouchableOpacity onPress={() => { setOtpSent(false); setOtp(''); }} disabled={loading}>
              <Text style={styles.link}>← Change Phone Number</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Only admin users can login</Text>
        </View>

        {/* debug output */}
        {debugLog ? (
          <View style={styles.debugContainer}>
            <Text style={styles.debugTitle}>Debug:</Text>
            <Text style={styles.debugText}>{debugLog}</Text>
          </View>
        ) : null}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  logo: {
    fontSize: 60,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: DARK_GRAY,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  formContainer: {
    marginVertical: 40,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: DARK_GRAY,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: DARK_GRAY,
    backgroundColor: LIGHT_GRAY,
    fontWeight: '500',
  },
  button: {
    backgroundColor: SWIGGY_RED,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 28,
    shadowColor: SWIGGY_RED,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  link: {
    color: SWIGGY_RED,
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  debugContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
  },
  debugTitle: {
    fontWeight: '700',
    marginBottom: 4,
    color: DARK_GRAY,
  },
  debugText: {
    fontSize: 12,
    color: DARK_GRAY,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});
