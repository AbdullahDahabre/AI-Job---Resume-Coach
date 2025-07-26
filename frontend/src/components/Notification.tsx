interface NotificationProps {
  message: string;
  isVisible: boolean;
}

const Notification = ({ message, isVisible }: NotificationProps) => {
  if (!isVisible) return null;

  // Determine if this is an error message
  const isError = message.toLowerCase().includes('please') || 
                  message.toLowerCase().includes('upload') || 
                  message.toLowerCase().includes('add') ||
                  message.toLowerCase().includes('first');

  return (
    <div style={{
      position: 'fixed',
      top: '6rem',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 2000,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      color: isError ? '#dc3545' : '#28a745',
      padding: '1rem 2rem',
      fontSize: '1.1rem',
      fontWeight: '500',
      animation: 'slideDown 0.3s ease-out',
      textAlign: 'center',
      letterSpacing: '0.3px',
      borderRadius: '6px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
      border: `2px solid ${isError ? '#dc3545' : '#28a745'}`,
      backdropFilter: 'blur(8px)',
      minWidth: '300px'
    }}>
      {message}
    </div>
  );
};

export default Notification;
