import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Chip,
  CircularProgress,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip
} from '@mui/material';
import { Sync as SyncIcon } from '@mui/icons-material';
import { useEmails, useEmailSync } from '../hooks/useEmails';
import { Email } from '../types/email';

interface EmailListProps {
  onEmailSelect?: (email: Email) => void;
}

export const EmailList: React.FC<EmailListProps> = ({ onEmailSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');

  const { data, isLoading } = useEmails({
    query: searchQuery,
    accountId: selectedAccount,
    folder: selectedFolder
  });

  const { mutate: syncEmails, isLoading: isSyncing } = useEmailSync();

  const emails = data?.emails || [];

  return (
    <Box p={3}>
      <Box mb={3}>
        <Box display="flex" gap={2} mb={2}>
          <TextField
            fullWidth
            label="Search emails"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Tooltip title="Sync emails">
            <IconButton 
              onClick={() => syncEmails()} 
              disabled={isSyncing}
              color="primary"
            >
              {isSyncing ? <CircularProgress size={24} /> : <SyncIcon />}
            </IconButton>
          </Tooltip>
        </Box>
        
        <Box display="flex" gap={2}>
          <FormControl fullWidth>
            <InputLabel>Account</InputLabel>
            <Select
              value={selectedAccount}
              label="Account"
              onChange={(e) => setSelectedAccount(e.target.value as string)}
            >
              <MenuItem value="">All Accounts</MenuItem>
              <MenuItem value="email1">Email 1</MenuItem>
              <MenuItem value="email2">Email 2</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Folder</InputLabel>
            <Select
              value={selectedFolder}
              label="Folder"
              onChange={(e) => setSelectedFolder(e.target.value as string)}
            >
              <MenuItem value="">All Folders</MenuItem>
              <MenuItem value="INBOX">Inbox</MenuItem>
              <MenuItem value="SENT">Sent</MenuItem>
              <MenuItem value="DRAFT">Draft</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {isLoading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      ) : (
        <List>
          {emails.map((email: Email) => (
            <ListItem
              key={email.id}
              component="div"
              onClick={() => onEmailSelect?.(email)}
              divider
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                p: 2,
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              <Box display="flex" justifyContent="space-between" width="100%" mb={1}>
                <Typography variant="subtitle2" color="textSecondary">
                  {email.from}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {new Date(email.date).toLocaleString()}
                </Typography>
              </Box>
              
              <ListItemText
                primary={email.subject}
                secondary={email.text?.slice(0, 100) + '...'}
                sx={{ mb: 1 }}
              />

              <Box>
                {email.categories?.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    color="primary"
                    variant="outlined"
                    size="small"
                    sx={{ mr: 0.5 }}
                  />
                ))}
              </Box>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};