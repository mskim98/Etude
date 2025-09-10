import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Bell, User, Users, Calendar } from 'lucide-react';

interface Announcement {
  id: string;
  author: string;
  date: Date;
  content: string;
  type: 'Operations Team' | 'Teacher';
  priority: 'high' | 'medium' | 'low';
  subject?: string;
}

interface AnnouncementsProps {
  className?: string;
}

export function Announcements({ className }: AnnouncementsProps) {
  // Mock announcements data - 8 comprehensive test items with varied priorities and dates
  const announcements: Announcement[] = [
    {
      id: '1',
      author: 'Dr. Sarah Chen',
      date: new Date('2025-01-02'),
      content: 'URGENT: AP Chemistry mock exam tomorrow at 8:00 AM in Science Lab A. Bring calculator and periodic table reference sheet.',
      type: 'Teacher',
      priority: 'high',
      subject: 'AP Chemistry'
    },
    {
      id: '2',
      author: 'Operations Team',
      date: new Date('2025-01-02'),
      content: 'System maintenance completed successfully. New features include enhanced progress tracking and improved exam analytics.',
      type: 'Operations Team',
      priority: 'medium'
    },
    {
      id: '3',
      author: 'Prof. Michael Rodriguez',
      date: new Date('2025-01-01'),
      content: 'New year, new goals! Advanced practice problems added for Calculus AB. Focus on integration techniques and applications.',
      type: 'Teacher',
      priority: 'medium',
      subject: 'AP Calculus AB'
    },
    {
      id: '4',
      author: 'Dr. Lisa Park',
      date: new Date('2024-12-30'),
      content: 'Outstanding performance on recent SAT practice tests! Average scores improved by 50 points across all sections.',
      type: 'Teacher',
      priority: 'low',
      subject: 'SAT Math'
    },
    {
      id: '5',
      author: 'Operations Team',
      date: new Date('2024-12-29'),
      content: 'Registration for January SAT practice test is now open. Test simulates actual exam conditions - register early!',
      type: 'Operations Team',
      priority: 'high'
    },
    {
      id: '6',
      author: 'Dr. Emily Watson',
      date: new Date('2024-12-28'),
      content: 'AP Biology: Cellular respiration lab simulation now available. Complete virtual experiments before next class.',
      type: 'Teacher',
      priority: 'medium',
      subject: 'AP Biology'
    },
    {
      id: '7',
      author: 'Prof. James Kim',
      date: new Date('2024-12-27'),
      content: 'AP Statistics students: Review probability distributions chapter. Quiz scheduled for this Friday covering normal and binomial distributions.',
      type: 'Teacher',
      priority: 'high',
      subject: 'AP Statistics'
    },
    {
      id: '8',
      author: 'Operations Team',
      date: new Date('2024-12-26'),
      content: 'Holiday break study schedule recommendations sent to all students. Don\'t forget to maintain consistent practice!',
      type: 'Operations Team',
      priority: 'low'
    }
  ];

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-destructive border-destructive';
      case 'medium':
        return 'text-warning border-warning';
      case 'low':
        return 'text-success border-success';
      default:
        return 'text-muted-foreground border-border';
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'Operations Team' ? Users : User;
  };

  return (
    <Card className={`border shadow-sm ${className}`}>
      <CardHeader className="pb-3 rounded-t-lg bg-primary">
        <CardTitle className="flex items-center space-x-2 text-lg font-semibold text-primary-foreground">
          <Bell className="w-5 h-5" />
          <span>Announcements</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          className="space-y-3 overflow-y-auto scrollbar-custom pr-2"
          style={{
            maxHeight: '384px' // Standardized height
          }}
        >
          {announcements.map((announcement) => {
            const TypeIcon = getTypeIcon(announcement.type);
            
            return (
              <div
                key={announcement.id}
                className="p-4 rounded-lg border-2 border-muted-foreground/15 bg-card"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center bg-primary"
                    >
                      <TypeIcon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-foreground text-base">
                          {announcement.author}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-xs font-semibold ${getPriorityColor(announcement.priority)}`}
                        >
                          {announcement.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                        <Badge 
                          variant="secondary" 
                          className="text-xs font-semibold bg-primary text-primary-foreground"
                        >
                          {announcement.type}
                        </Badge>
                        {announcement.subject && (
                          <Badge 
                            variant="outline" 
                            className="text-xs font-semibold border-primary text-primary"
                          >
                            {announcement.subject}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground font-medium">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(announcement.date)}</span>
                  </div>
                </div>
                
                <p className="text-sm text-foreground leading-relaxed pl-12 font-medium">
                  {announcement.content}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}