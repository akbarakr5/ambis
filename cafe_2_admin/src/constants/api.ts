import Constants from 'expo-constants';

const MANUAL_IP = '10.20.226.9';

const getHost = () => {
  if (MANUAL_IP) return MANUAL_IP;
  try {
    if (Constants.expoConfig?.hostUri) {
      return Constants.expoConfig.hostUri.split(':')[0];
    }
  } catch (e) {}
  return 'localhost';
};

export const API_BASE_URL = `http://${getHost()}:3006`;
export const WS_URL = `ws://${getHost()}:3006`;

export const ENDPOINTS = {
  SEND_OTP: "/auth/send-otp",
  VERIFY_OTP: "/auth/verify-otp",
  MENU: "/menu",
  ADMIN_MENU: "/admin/menu",
  ADMIN_ORDERS: "/admin/orders",
  ADMIN_ANALYTICS: "/admin/analytics",
  ORDER_BILL: "/admin/orders/:id/bill",
};
