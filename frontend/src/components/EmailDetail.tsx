import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Chip,
  Divider
} from '@mui/material';
import axios from 'axios';

interface EmailDetailProps {
  email: {
    id: string;
    from: string;
    to: string;
    subject: string;
    body: string;
    date: string;
    category?: string;
  };
}

export const EmailDetail: React.FC<EmailDetailProps> = ({ email }) => {
  const [suggestedReply, setSuggestedReply] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleGetSuggestedReply = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/emails/suggest-reply', {
        subject: email.subject,
        body: email.body
      });
      setSuggestedReply(response.data.reply);
    } catch (error) {
      console.error('Error getting suggested reply:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Box mb={2}>
        <Typography variant="h6">{email.subject}</Typography>
        <Typography variant="subtitle2" color="textSecondary">
          From: {email.from}
        </Typography>
        <Typography variant="subtitle2" color="textSecondary">
          To: {email.to}
        </Typography>
        <Typography variant="caption" color="textSecondary" display="block">
          {new Date(email.date).toLocaleString()}
        </Typography>
        {email.category && (
          <Chip
            label={email.category}
            color="primary"
            size="small"
            sx={{ mt: 1 }}
          />
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 3 }}>
        {email.body}
      </Typography>

      <Box mt={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleGetSuggestedReply}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Get AI Reply Suggestion'}
        </Button>

        {suggestedReply && (
          <Paper sx={{ p: 2, mt: 2, bgcolor: 'grey.100' }}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Suggested Reply:
            </Typography>
            <Typography variant="body1">{suggestedReply}</Typography>
          </Paper>
        )}
      </Box>
    </Paper>
  );
};