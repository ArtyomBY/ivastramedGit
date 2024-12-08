import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Chip,
  IconButton,
  Box,
  Divider,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Visit } from '../../types/medical';
import { formatDate } from '../../utils/dateUtils';

interface VisitListProps {
  visits: Visit[];
  onDelete: (id: string) => void;
}

const VisitList: React.FC<VisitListProps> = ({ visits, onDelete }) => {
  return (
    <List>
      {visits.map((visit) => (
        <React.Fragment key={visit.id}>
          <ListItem
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => onDelete(visit.id)}
              >
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={
                <Typography variant="subtitle1">
                  {formatDate(visit.date)} - {visit.type}
                </Typography>
              }
              secondary={
                <>
                  {visit.diagnosis && visit.diagnosis.length > 0 && (
                    <Chip
                      size="small"
                      label={`Диагноз: ${visit.diagnosis.join(', ')}`}
                      color="secondary"
                    />
                  )}
                  {visit.treatment && (
                    <Chip
                      size="small"
                      label={`Лечение: ${visit.treatment}`}
                      color="info"
                    />
                  )}
                  {visit.notes && (
                    <Typography variant="body2" color="text.secondary">
                      Примечания: {visit.notes}
                    </Typography>
                  )}
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Chip
                      label={visit.status}
                      color={visit.status === 'Завершен' ? 'success' : 'warning'}
                      size="small"
                    />
                    {visit.followUpDate && (
                      <Chip
                        size="small"
                        label={`Следующий визит: ${formatDate(visit.followUpDate)}`}
                        color="primary"
                      />
                    )}
                  </Box>
                </>
              }
            />
          </ListItem>
          <Divider />
        </React.Fragment>
      ))}
      {visits.length === 0 && (
        <ListItem>
          <ListItemText
            primary={
              <Typography color="text.secondary">
                Нет записей о визитах
              </Typography>
            }
          />
        </ListItem>
      )}
    </List>
  );
};

export default VisitList;
