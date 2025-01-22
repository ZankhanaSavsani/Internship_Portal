import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

const AddWeeklyReportPage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex items-center justify-center">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>Add Weekly Report</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Click below to add a new Weekly Report.</p>
          <Button onClick={() => navigate('/WeeklyReportForm')} className="w-full">
            Add Weekly Report
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddWeeklyReportPage;
