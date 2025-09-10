import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Calendar, Clock } from 'lucide-react';

export function DateSection() {
  const currentDate = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  const currentTime = currentDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const formattedDate = currentDate.toLocaleDateString('en-US', options);
  
  // Get day of year for progress calculation
  const start = new Date(currentDate.getFullYear(), 0, 0);
  const diff = currentDate.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const totalDays = new Date(currentDate.getFullYear(), 11, 31).getTime() - new Date(currentDate.getFullYear(), 0, 1).getTime();
  const yearProgress = Math.round((dayOfYear / (totalDays / (1000 * 60 * 60 * 24))) * 100);

  return (
    <Card className="h-full border shadow-sm bg-secondary">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-foreground text-lg font-semibold">
          <Calendar className="w-5 h-5 text-primary" />
          <span>Today</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center space-y-2">
          <div className="text-5xl font-bold text-primary">
            {currentDate.getDate()}
          </div>
          <div className="text-lg text-foreground font-semibold">
            {currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </div>
        </div>

        <div className="space-y-3 pt-3 border-t border-border">
          <div className="flex items-center space-x-3 text-foreground">
            <Clock className="w-6 h-6 text-primary" />
            <span className="text-lg font-semibold">{currentTime}</span>
          </div>
          
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2 font-medium">Day of Week</div>
            <div className="text-lg font-bold text-foreground">
              {currentDate.toLocaleDateString('en-US', { weekday: 'long' })}
            </div>
          </div>

          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2 font-medium">Year Progress</div>
            <div className="text-lg font-bold text-primary">{yearProgress}%</div>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div 
                className="bg-primary rounded-full h-2 transition-all duration-300 shadow-sm"
                style={{ width: `${yearProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}