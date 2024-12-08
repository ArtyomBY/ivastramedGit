import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Button,
  Stack,
} from '@mui/material';
import { Send as SendIcon, AttachFile as AttachFileIcon } from '@mui/icons-material';
import { Doctor } from './DoctorChatList';
import moment from 'moment';
import 'moment/locale/ru';

moment.locale('ru');

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

interface DoctorChatProps {
  doctor: Doctor;
  messages: Message[];
  currentUserId: string;
  onSendMessage: (text: string, attachments?: File[]) => void;
}

const DoctorChat: React.FC<DoctorChatProps> = ({
  doctor,
  messages,
  currentUserId,
  onSendMessage,
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() || selectedFiles.length > 0) {
      onSendMessage(newMessage.trim(), selectedFiles);
      setNewMessage('');
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  return (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box display="flex" alignItems="center">
          <Avatar sx={{ mr: 2 }}>
            {doctor.firstName.charAt(0)}
            {doctor.lastName.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h6">
              {`${doctor.lastName} ${doctor.firstName.charAt(0)}.${doctor.middleName.charAt(0)}.`}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {doctor.specialization}
            </Typography>
          </Box>
        </Box>
      </Box>

      <List sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
        {messages.map((message) => (
          <ListItem
            key={message.id}
            sx={{
              flexDirection: 'column',
              alignItems: message.senderId === currentUserId ? 'flex-end' : 'flex-start',
              mb: 2,
            }}
          >
            <Box
              sx={{
                maxWidth: '70%',
                bgcolor: message.senderId === currentUserId ? 'primary.main' : 'grey.100',
                color: message.senderId === currentUserId ? 'white' : 'text.primary',
                borderRadius: 2,
                p: 2,
              }}
            >
              <Typography variant="body1">{message.text}</Typography>
              {message.attachments && message.attachments.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  {message.attachments.map((attachment) => (
                    <Button
                      key={attachment.id}
                      href={attachment.url}
                      target="_blank"
                      variant="outlined"
                      size="small"
                      sx={{
                        mt: 1,
                        color: message.senderId === currentUserId ? 'white' : 'primary.main',
                        borderColor:
                          message.senderId === currentUserId ? 'white' : 'primary.main',
                      }}
                    >
                      {attachment.name}
                    </Button>
                  ))}
                </Box>
              )}
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  mt: 0.5,
                  color: message.senderId === currentUserId ? 'white' : 'text.secondary',
                }}
              >
                {moment(message.timestamp).format('HH:mm')}
              </Typography>
            </Box>
          </ListItem>
        ))}
        <div ref={messagesEndRef} />
      </List>

      {selectedFiles.length > 0 && (
        <Stack direction="row" spacing={1} sx={{ p: 1, borderTop: 1, borderColor: 'divider' }}>
          {selectedFiles.map((file, index) => (
            <Button
              key={index}
              variant="outlined"
              size="small"
              onClick={() => {
                setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
              }}
            >
              {file.name} ×
            </Button>
          ))}
        </Stack>
      )}

      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Box display="flex" alignItems="flex-end">
          <IconButton
            color="primary"
            component="label"
            sx={{ mb: 1.5, mr: 1 }}
          >
            <AttachFileIcon />
            <input
              ref={fileInputRef}
              hidden
              type="file"
              multiple
              onChange={handleFileSelect}
            />
          </IconButton>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Введите сообщение..."
            variant="outlined"
            size="small"
          />
          <IconButton
            color="primary"
            onClick={handleSendMessage}
            disabled={!newMessage.trim() && selectedFiles.length === 0}
            sx={{ ml: 1, mb: 1.5 }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

export default DoctorChat;
