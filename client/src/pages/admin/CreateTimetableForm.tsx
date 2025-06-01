import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button,
  Container,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface CreateTimetableFormProps {
  // Props can be added here if needed
}

interface TimetableResponse {
  message: string;
  timetable: {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    isPublished: boolean;
  };
}

const API_URL = 'http://localhost:5000/api';

const CreateTimetableForm: React.FC<CreateTimetableFormProps> = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    title?: string;
    startDate?: string;
    endDate?: string;
  }>({});
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({ open: false, message: '', severity: 'info' });

  const validateForm = (): boolean => {
    const newErrors: {
      title?: string;
      startDate?: string;
      endDate?: string;
    } = {};
    
    if (!title.trim()) {
      newErrors.title = 'Timetable title is required';
    }
    
    if (!startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!endDate) {
      newErrors.endDate = 'End date is required';
    } else if (startDate && endDate && endDate < startDate) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Make an API call to create the timetable
      const response = await axios.post<TimetableResponse>(`${API_URL}/timetables`, {
        title,
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString()
      });
      
      // Get the created timetable from the response
      const newTimetable = response.data.timetable;
      
      setSnackbar({
        open: true,
        message: 'Timetable created successfully!',
        severity: 'success'
      });
      
      // Navigate to the scheduler with the timetable data
      navigate('/admin/timetables/scheduler', { 
        state: { 
          timetable: newTimetable 
        } 
      });
    } catch (error: any) {
      console.error('Error creating timetable:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to create timetable',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
          Create Timetable
        </Typography>
        
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            mt: 4,
            borderRadius: 2,
            backgroundColor: 'white' 
          }}
        >
          <form onSubmit={handleSubmit}>
            <Box mb={3}>
              <TextField
                label="Timetable Title"
                variant="outlined"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={!!errors.title}
                helperText={errors.title}
                required
              />
            </Box>
            
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box mb={3}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  slotProps={{
                    textField: {
                      variant: 'outlined',
                      fullWidth: true,
                      required: true,
                      error: !!errors.startDate,
                      helperText: errors.startDate
                    }
                  }}
                />
              </Box>
              
              <Box mb={4}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  slotProps={{
                    textField: {
                      variant: 'outlined',
                      fullWidth: true,
                      required: true,
                      error: !!errors.endDate,
                      helperText: errors.endDate
                    }
                  }}
                />
              </Box>
            </LocalizationProvider>
            
            <Box display="flex" justifyContent="center">
              <Button 
                variant="contained" 
                color="primary" 
                type="submit" 
                fullWidth
                size="large"
                sx={{ mt: 2 }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Create Timetable'
                )}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreateTimetableForm;
