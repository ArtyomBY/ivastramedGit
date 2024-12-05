import React, { useState } from 'react';

const NotificationSettings: React.FC = () => {
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);
  const [smsNotifications, setSmsNotifications] = useState<boolean>(false);

  const handleSaveSettings = () => {
    alert(`Settings saved! Email: ${emailNotifications}, SMS: ${smsNotifications}`);
    // Here, you would typically save the settings to the server or context
  };

  return (
    <div>
      <h2>Notification Settings</h2>
      <div>
        <label>
          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={() => setEmailNotifications(!emailNotifications)}
          />
          Email Notifications
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={smsNotifications}
            onChange={() => setSmsNotifications(!smsNotifications)}
          />
          SMS Notifications
        </label>
      </div>
      <button onClick={handleSaveSettings}>Save Settings</button>
    </div>
  );
};

export default NotificationSettings;
