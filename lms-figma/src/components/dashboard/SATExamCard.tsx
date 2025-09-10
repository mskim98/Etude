import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  Play, 
  Clock, 
  CheckCircle, 
  Star, 
  Users,
  Calendar,
  BarChart3,
  Trophy
} from 'lucide-react';

export interface SATExamCardProps {
  examId: string;
  title: string;
  description: string;
  duration: number; // in minutes
  questionCount: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  hasExplanatoryVideo: boolean;
  videoLength?: number; // in minutes
  completed: boolean;
  score?: number; // SAT score (out of 800 or percentage)
  maxScore?: number; // For SAT (800) vs percentage (100)
  attempts: number;
  averageScore: number;
  completionRate: number;
  lastAttempt?: Date;
  examDate?: Date; // SAT test date countdown
  section?: 'All' | 'Math' | 'Reading' | 'Writing'; // SAT section types
  onStartExam: () => void;
  onWatchVideo?: () => void;
  className?: string;
}

export function SATExamCard({
  examId,
  title,
  description,
  duration,
  questionCount,
  difficulty,
  hasExplanatoryVideo,
  videoLength,
  completed,
  score,
  maxScore = 800,
  attempts,
  averageScore,
  completionRate,
  lastAttempt,
  examDate,
  section = 'All',
  onStartExam,
  onWatchVideo,
  className
}: SATExamCardProps) {
  
  const getDifficultyStyles = (diff: string) => {
    const baseClasses = "text-xs flex-shrink-0 border font-medium";
    switch (diff) {
      case 'Easy':
        return `${baseClasses} bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800`;
      case 'Medium':
        return `${baseClasses} bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800`;
      case 'Hard':
        return `${baseClasses} bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800`;
      default:
        return `${baseClasses} bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
    }
  };

  const getSectionStyles = (sec: string) => {
    switch (sec) {
      case 'All':
        return {
          backgroundColor: '#0091B3',
          color: 'white',
          border: 'none'
        };
      case 'Math':
        return {
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none'
        };
      case 'Reading':
        return {
          backgroundColor: '#10b981',
          color: 'white',
          border: 'none'
        };
      case 'Writing':
        return {
          backgroundColor: '#f59e0b',
          color: 'white',
          border: 'none'
        };

      default:
        return {
          backgroundColor: '#6b7280',
          color: 'white',
          border: 'none'
        };
    }
  };

  const formatSATScore = (score?: number, maxScore: number = 800) => {
    if (!score) return 'N/A';
    if (maxScore === 800) {
      return `${score}/800`;
    } else {
      return `${score}%`;
    }
  };

  const getSATScoreColor = (score?: number, maxScore: number = 800) => {
    if (!score) return 'var(--color-text-tertiary)';
    
    let percentage;
    if (maxScore === 800) {
      percentage = (score / 800) * 100;
    } else {
      percentage = score;
    }
    
    if (percentage >= 80) return 'var(--color-status-success)';
    if (percentage >= 70) return 'var(--color-status-warning)';
    return 'var(--color-status-error)';
  };



  return (
    <Card 
      className={`transition-all duration-300 shadow-sm ${className}`}
      style={{
        backgroundColor: completed ? 'var(--color-card-completed-bg)' : 'var(--color-card-default-bg)',
        border: '1px solid var(--color-card-border)',
        height: '400px'
      }}
    >
      <CardContent className="p-0 h-full">
        {/* Modern Card Design */}
        <div className="h-full flex flex-col">
          {/* Header with Status Bar */}
          <div 
            className="px-6 py-4 border-b"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 
                  className="font-semibold text-lg leading-tight mb-2" 
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {title}
                </h3>
                <div className="flex items-center gap-2">
                  <Badge 
                    className="text-xs font-medium px-2 py-1"
                    style={getSectionStyles(section)}
                  >
                    SAT {section}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`text-xs px-2 py-1 ${getDifficultyStyles(difficulty)}`}
                  >
                    {difficulty}
                  </Badge>
                </div>
              </div>
              
              {completed && (
                <div 
                  className="flex items-center px-3 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: '#e6f7e6', color: '#16a34a' }}
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Completed
                </div>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="px-6 py-4 flex-1 flex flex-col">
            {/* Description */}
            <div className="mb-4">
              <p 
                className="text-sm line-clamp-3 leading-relaxed" 
                style={{ 
                  color: 'var(--color-text-secondary)',
                  minHeight: '3.75rem' // Fixed height for 3 lines
                }}
              >
                {description}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-1 mb-4">
              <div 
                className="text-center p-3 rounded-lg border"
                style={{ 
                  backgroundColor: 'var(--primary-light)',
                  borderColor: 'var(--color-card-border)',
                  borderWidth: '1px'
                }}
              >
                <div 
                  className="text-xs mb-1" 
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  Duration
                </div>
                <div 
                  className="font-semibold" 
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {duration}m
                </div>
              </div>
              <div 
                className="text-center p-3 rounded-lg border"
                style={{ 
                  backgroundColor: 'var(--primary-light)',
                  borderColor: 'var(--color-card-border)',
                  borderWidth: '1px'
                }}
              >
                <div 
                  className="text-xs mb-1" 
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  Questions
                </div>
                <div 
                  className="font-semibold" 
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {questionCount}
                </div>
              </div>
              <div 
                className="text-center p-3 rounded-lg border"
                style={{ 
                  backgroundColor: 'var(--primary-light)',
                  borderColor: 'var(--color-card-border)',
                  borderWidth: '1px'
                }}
              >
                <div 
                  className="text-xs mb-1" 
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  Best Score
                </div>
                <div 
                  className="font-semibold" 
                  style={{ color: getSATScoreColor(score, maxScore) }}
                >
                  {formatSATScore(score, maxScore)}
                </div>
              </div>
            </div>

            {/* SAT-Specific Info */}
            <div className="space-y-3 mb-4">
              {/* Video Indicator - Always shown */}
              <div 
                className="flex items-center p-3 rounded-lg border"
                style={{ 
                  backgroundColor: 'var(--primary-light)',
                  borderColor: 'var(--color-card-border)',
                  borderWidth: '1px'
                }}
              >
                <Play 
                  className="w-4 h-4 mr-2" 
                  style={{ color: hasExplanatoryVideo ? 'var(--color-video-accent)' : 'var(--color-text-tertiary)' }} 
                />
                <span 
                  className="text-sm font-medium flex-1"
                  style={{ color: hasExplanatoryVideo ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}
                >
                  {hasExplanatoryVideo ? 'Video Solutions Available' : 'Video Solutions Not Available'}
                </span>
                {hasExplanatoryVideo && videoLength && (
                  <span 
                    className="text-xs px-2 py-1 rounded-full"
                    style={{ 
                      backgroundColor: 'var(--color-video-accent)',
                      color: 'white'
                    }}
                  >
                    {videoLength}min
                  </span>
                )}
                {!hasExplanatoryVideo && (
                  <span 
                    className="text-xs px-2 py-1 rounded-full"
                    style={{ 
                      backgroundColor: 'var(--color-text-tertiary)',
                      color: 'white'
                    }}
                  >
                    N/A
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div 
            className="px-6 py-4 border-t"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={onStartExam}
                className="h-11 font-semibold rounded-lg transition-all duration-200 hover:scale-105"
                style={{ 
                  backgroundColor: 'var(--color-primary)', 
                  color: 'var(--color-primary-foreground)',
                  boxShadow: '0 2px 8px rgba(0, 145, 179, 0.2)'
                }}
              >
                {completed ? 'Retake Test' : 'Start Test'}
              </Button>
              <Button 
                variant="outline" 
                onClick={onWatchVideo}
                disabled={!completed}
                className="h-11 font-semibold rounded-lg transition-all duration-200 hover:scale-105 disabled:hover:scale-100 hover:bg-transparent disabled:hover:bg-transparent"
                style={{ 
                  borderColor: 'var(--color-primary)',
                  color: completed ? 'var(--color-primary)' : 'var(--color-text-tertiary)',
                  borderWidth: '1.5px',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  if (completed) {
                    e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                    e.currentTarget.style.color = 'white';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = completed ? 'var(--color-primary)' : 'var(--color-text-tertiary)';
                }}
              >
                View Results
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}