import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Chip,
  IconButton,
  Divider,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { LabTest } from '../../types/medical';
import { formatDate } from '../../utils/dateUtils';

interface LabTestListProps {
  labTests: LabTest[];
  onDelete?: (id: string) => void;
}

const LabTestList: React.FC<LabTestListProps> = ({ labTests, onDelete }) => {
  return (
    <List>
      {labTests.map((test) => (
        <React.Fragment key={test.id}>
          <ListItem
            secondaryAction={
              onDelete && (
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => onDelete(test.id)}
                >
                  <DeleteIcon />
                </IconButton>
              )
            }
          >
            <ListItemText
              primary={
                <Typography variant="subtitle1">
                  {test.name}
                </Typography>
              }
              secondary={
                <>
                  <Typography variant="body2" color="text.secondary">
                    {test.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Дата назначения: {formatDate(test.orderedDate)}
                  </Typography>
                  {test.completedDate && (
                    <Typography variant="body2" color="text.secondary">
                      Дата выполнения: {formatDate(test.completedDate)}
                    </Typography>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
                    <Chip
                      label={test.status}
                      color={test.status === 'Завершен' ? 'success' : 'warning'}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    {test.results && (
                      <Typography variant="body2" color="text.secondary">
                        Результаты: {test.results}
                      </Typography>
                    )}
                  </div>
                </>
              }
            />
          </ListItem>
          <Divider />
        </React.Fragment>
      ))}
      {labTests.length === 0 && (
        <ListItem>
          <ListItemText
            primary={
              <Typography color="text.secondary">
                Нет назначенных анализов
              </Typography>
            }
          />
        </ListItem>
      )}
    </List>
  );
};

export default LabTestList;
