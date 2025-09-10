import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';

interface SectionScoreCardProps {
  title: string;
  score: number;
  maxScore: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent?: number;
  icon?: React.ReactNode;
}

export function SectionScoreCard({
  title,
  score,
  maxScore,
  correctAnswers,
  totalQuestions,
  timeSpent,
  icon
}: SectionScoreCardProps) {
  const percentage = (score / maxScore) * 100;
  const accuracy = (correctAnswers / totalQuestions) * 100;

  const getScoreColor = () => {
    if (percentage >= 85) return 'text-green-600';
    if (percentage >= 70) return 'text-blue-600';
    if (percentage >= 55) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center space-x-2">
          {icon}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score Display */}
        <div className="text-center">
          <div className={`text-3xl font-bold ${getScoreColor()}`}>
            {score}
          </div>
          <div className="text-sm text-gray-500">
            out of {maxScore}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={percentage} className="h-3" />
          <div className="flex justify-between text-sm text-gray-500">
            <span>{Math.round(percentage)}%</span>
            <span>{correctAnswers}/{totalQuestions} correct</span>
          </div>
        </div>

        {/* Additional Stats */}
        {timeSpent && (
          <div className="text-center pt-2 border-t border-gray-100">
            <div className="text-sm text-gray-500">Time Spent</div>
            <div className="text-base font-medium">
              {Math.floor(timeSpent / 60)}m {timeSpent % 60}s
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}