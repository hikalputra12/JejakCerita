import { convertBase64ToUint8Array } from './index';
import { VAPID_PUBLIC_KEY } from '../config';
import { subscribePushNotification, unsubscribePushNotification } from '../data/api'; // Import unsubscribePushNotification

export function generateSubscribeOptions() {
  return {
    userVisibleOnly: true,
    applicationServerKey: convertBase64ToUint8Array(VAPID_PUBLIC_KEY),
  };
}

export function isNotificationAvailable() {
  return 'Notification' in window;
}
 
export function isNotificationGranted() {
  return Notification.permission === 'granted';
}
 
export async function requestNotificationPermission() {
  if (!isNotificationAvailable()) {
    console.error('Notification API unsupported.');
    return false;
  }
 
  if (isNotificationGranted()) {
    return true;
  }
 
  const status = await Notification.requestPermission();
 
  if (status === 'denied') {
    alert('Izin notifikasi ditolak.');
    return false;
  }
 
  if (status === 'default') {
    alert('Izin notifikasi ditutup atau diabaikan.');
    return false;
  }
 
  return true;
}
 
export async function getPushSubscription() {
  const registration = await navigator.serviceWorker.getRegistration();
  return await registration.pushManager.getSubscription();
}
 
export async function isCurrentPushSubscriptionAvailable() {
  return !!(await getPushSubscription());
}
 
export async function subscribe() {
  if (!(await requestNotificationPermission())) {
    return;
  }
 
  if (await isCurrentPushSubscriptionAvailable()) {
    alert('Sudah berlangganan push notification.');
    return;
  }
 
  console.log('Mulai berlangganan push notification...');
 
  const failureSubscribeMessage = 'Langganan push notification gagal diaktifkan.';
  const successSubscribeMessage = 'Langganan push notification berhasil diaktifkan.';
  let pushSubscription;
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    pushSubscription = await registration.pushManager.subscribe(generateSubscribeOptions());
 
    const { endpoint, keys } = pushSubscription.toJSON();
    const response = await subscribePushNotification({ endpoint, keys });
    if (!response.ok) {
      console.error('subscribe: response:', response);
      alert(failureSubscribeMessage);
 
      // Undo subscribe to push notification
      await pushSubscription.unsubscribe();
 
      return;
    }
 
    alert(successSubscribeMessage);
  } catch (error) {
    console.error('subscribe: error:', error);
    alert(failureSubscribeMessage);
 
    // Undo subscribe to push notification
    await pushSubscription.unsubscribe();
  }
}

export async function unsubscribe() { // Tambahkan fungsi ini
  const successUnsubscribeMessage = 'Berhasil berhenti berlangganan push notification.';
  const failureUnsubscribeMessage = 'Gagal berhenti berlangganan push notification.';
  try {
    const pushSubscription = await getPushSubscription();
    if (!pushSubscription) {
      alert('Tidak berlangganan push notification.');
      return;
    }

    const { endpoint } = pushSubscription.toJSON();
    const response = await unsubscribePushNotification({ endpoint });
    if (!response.ok) {
      console.error('unsubscribe: response:', response);
      alert(failureUnsubscribeMessage);
      return;
    }

    await pushSubscription.unsubscribe();
    alert(successUnsubscribeMessage);
  } catch (error) {
    console.error('unsubscribe: error:', error);
    alert(failureUnsubscribeMessage);
  }
}