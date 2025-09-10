import React from 'react';

interface CorrectCountCardProps {
  title: string;
  correctAnswers: number;
  totalQuestions: number;
  questionType?: 'MCQ' | 'FRQ' | 'All';
  icon?: React.ReactNode;
}

// Component removed - functionality integrated into ScoreSummaryCard
export function CorrectCountCard(props: CorrectCountCardProps) {
  return null;
}