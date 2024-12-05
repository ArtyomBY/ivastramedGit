import React, { useState } from 'react';
import { Box, Grid, useTheme, useMediaQuery } from '@mui/material';
import DoctorChatList, { Doctor } from './DoctorChatList';
import DoctorChat from './DoctorChat';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
  }>;
}

interface ChatContainerProps {
  currentUserId: string;
  doctors: Doctor[];
  messages: { [doctorId: string]: Message[] };
  onSendMessage: (doctorId: string, text: string, attachments?: File[]) => void;
}

type SelectedDoctorType = Doctor | null;

const ChatContainer: React.FC<ChatContainerProps> = ({
  currentUserId,
  doctors,
  messages,
  onSendMessage,
}) => {
  const [selectedDoctor, setSelectedDoctor] = useState<SelectedDoctorType>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleSelectDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleSendMessage = (text: string, attachments?: File[]) => {
    if (selectedDoctor) {
      onSendMessage(selectedDoctor.id, text, attachments);
    }
  };

  const selectedDoctorId: string | null = selectedDoctor ? selectedDoctor.id : null;

  // На мобильных устройствах показываем либо список, либо чат
  if (isMobile) {
    return (
      <Box sx={{ height: '500px' }}>
        {!selectedDoctor ? (
          <DoctorChatList
            doctors={doctors}
            onSelectDoctor={handleSelectDoctor}
            selectedDoctorId={selectedDoctorId}
          />
        ) : (
          <DoctorChat
            doctor={selectedDoctor}
            messages={messages[selectedDoctor.id] || []}
            currentUserId={currentUserId}
            onSendMessage={handleSendMessage}
          />
        )}
      </Box>
    );
  }

  // На десктопе показываем список и чат рядом
  return (
    <Box sx={{ height: '500px' }}>
      <Grid container spacing={2} sx={{ height: '100%' }}>
        <Grid item xs={4}>
          <DoctorChatList
            doctors={doctors}
            onSelectDoctor={handleSelectDoctor}
            selectedDoctorId={selectedDoctorId}
          />
        </Grid>
        <Grid item xs={8}>
          {selectedDoctor ? (
            <DoctorChat
              doctor={selectedDoctor}
              messages={messages[selectedDoctor.id] || []}
              currentUserId={currentUserId}
              onSendMessage={handleSendMessage}
            />
          ) : (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.paper',
                borderRadius: 1,
              }}
            >
              <Box sx={{ color: 'text.secondary' }}>
                Выберите доктора для начала общения
              </Box>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default ChatContainer;
