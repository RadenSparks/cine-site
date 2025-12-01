import { createContext, useContext, useRef, ReactNode } from 'react';
import SplashedPushNotifications, { type SplashedPushNotificationsHandle, type NotificationType } from '../components/UI/SplashedPushNotifications';

interface NotificationContextType {
  showNotification: (type: NotificationType, title: string, content: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const notificationRef = useRef<SplashedPushNotificationsHandle>(null);

  const showNotification = (type: NotificationType, title: string, content: string) => {
    notificationRef.current?.createNotification(type, title, content);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      <SplashedPushNotifications ref={notificationRef} />
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
}
