import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * TimetableCreation Component
 * 
 * This component now serves as a redirect to the new CreateTimetableForm component
 * which is part of the updated timetable creation flow.
 */

const TimetableCreation: React.FC = () => {
  const navigate = useNavigate();
  
  // Redirect to the new timetable creation form on component mount
  useEffect(() => {
    navigate('/admin/timetables/create');
  }, [navigate]);
  
  // This component doesn't render anything as it immediately redirects
  return null;
};

export default TimetableCreation;
