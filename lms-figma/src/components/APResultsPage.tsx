import React from 'react';
import { Button } from './ui/button';
import { ArrowLeft, BookOpen, RotateCcw, Target, Beaker, Brain, Dna } from 'lucide-react';
import { ScoreSummaryCard } from './results/ScoreSummaryCard';
import { TypeAnalysisChart } from './results/TypeAnalysisChart';
import { WrongQuestionList } from './results/WrongQuestionList';
import type { ExamResult, Subject, PageType } from '../App';

interface APResultsPageProps {
  result: ExamResult | null;
  subject: Subject | null;
  onNavigate: (page: PageType) => void;
  onRetryExam: () => void;
}

export function APResultsPage({
  result,
  subject,
  onNavigate,
  onRetryExam
}: APResultsPageProps) {
  if (!result || !subject) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-900 mb-4">No Results Found</h2>
          <Button onClick={() => onNavigate('dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Get subject-specific icon
  const getSubjectIcon = () => {
    switch (subject.name) {
      case 'AP Chemistry':
        return <Beaker className="w-4 h-4" />;
      case 'AP Biology':
        return <Dna className="w-4 h-4" />;
      case 'AP Psychology':
        return <Brain className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  // Mock AP-specific question type data based on subject
  const getQuestionTypeData = () => {
    const mcqTotal = Math.round(result.totalQuestions * 0.6);
    const frqTotal = result.totalQuestions - mcqTotal;
    const mcqCorrect = Math.round(result.correctAnswers * 0.6);
    const frqCorrect = result.correctAnswers - mcqCorrect;

    switch (subject.name) {
      case 'AP Chemistry':
        return [
          {
            name: 'Atomic Structure',
            correct: Math.round(result.correctAnswers * 0.15),
            total: Math.round(result.totalQuestions * 0.15),
            percentage: 0
          },
          {
            name: 'Chemical Bonding',
            correct: Math.round(result.correctAnswers * 0.2),
            total: Math.round(result.totalQuestions * 0.2),
            percentage: 0
          },
          {
            name: 'Thermodynamics',
            correct: Math.round(result.correctAnswers * 0.15),
            total: Math.round(result.totalQuestions * 0.15),
            percentage: 0
          },
          {
            name: 'Kinetics',
            correct: Math.round(result.correctAnswers * 0.15),
            total: Math.round(result.totalQuestions * 0.15),
            percentage: 0
          },
          {
            name: 'Equilibrium',
            correct: Math.round(result.correctAnswers * 0.2),
            total: Math.round(result.totalQuestions * 0.2),
            percentage: 0
          },
          {
            name: 'Acids & Bases',
            correct: Math.round(result.correctAnswers * 0.15),
            total: Math.round(result.totalQuestions * 0.15),
            percentage: 0
          }
        ];
      case 'AP Biology':
        return [
          {
            name: 'Evolution',
            correct: Math.round(result.correctAnswers * 0.2),
            total: Math.round(result.totalQuestions * 0.2),
            percentage: 0
          },
          {
            name: 'Cell Biology',
            correct: Math.round(result.correctAnswers * 0.25),
            total: Math.round(result.totalQuestions * 0.25),
            percentage: 0
          },
          {
            name: 'Genetics',
            correct: Math.round(result.correctAnswers * 0.2),
            total: Math.round(result.totalQuestions * 0.2),
            percentage: 0
          },
          {
            name: 'Ecology',
            correct: Math.round(result.correctAnswers * 0.2),
            total: Math.round(result.totalQuestions * 0.2),
            percentage: 0
          },
          {
            name: 'Energy & Communication',
            correct: Math.round(result.correctAnswers * 0.15),
            total: Math.round(result.totalQuestions * 0.15),
            percentage: 0
          }
        ];
      case 'AP Psychology':
        return [
          {
            name: 'Biological Psychology',
            correct: Math.round(result.correctAnswers * 0.2),
            total: Math.round(result.totalQuestions * 0.2),
            percentage: 0
          },
          {
            name: 'Learning & Memory',
            correct: Math.round(result.correctAnswers * 0.2),
            total: Math.round(result.totalQuestions * 0.2),
            percentage: 0
          },
          {
            name: 'Social Psychology',
            correct: Math.round(result.correctAnswers * 0.15),
            total: Math.round(result.totalQuestions * 0.15),
            percentage: 0
          },
          {
            name: 'Developmental Psychology',
            correct: Math.round(result.correctAnswers * 0.15),
            total: Math.round(result.totalQuestions * 0.15),
            percentage: 0
          },
          {
            name: 'Abnormal Psychology',
            correct: Math.round(result.correctAnswers * 0.15),
            total: Math.round(result.totalQuestions * 0.15),
            percentage: 0
          },
          {
            name: 'Research Methods',
            correct: Math.round(result.correctAnswers * 0.15),
            total: Math.round(result.totalQuestions * 0.15),
            percentage: 0
          }
        ];
      default:
        return [];
    }
  };

  const questionTypeData = getQuestionTypeData().map(item => ({
    ...item,
    percentage: item.total > 0 ? (item.correct / item.total) * 100 : 0
  }));

  // Question format breakdown
  const mcqTotal = Math.round(result.totalQuestions * 0.6);
  const frqTotal = result.totalQuestions - mcqTotal;
  const mcqCorrect = Math.round(result.correctAnswers * 0.6);
  const frqCorrect = result.correctAnswers - mcqCorrect;

  // Mock wrong questions
  const wrongQuestions = result.mistakes.map((mistake, index) => ({
    id: mistake.questionId,
    questionNumber: index + 1,
    topic: questionTypeData[index % questionTypeData.length]?.name || 'General',
    questionType: Math.random() > 0.4 ? 'MCQ' : 'FRQ' as 'MCQ' | 'FRQ',
    userAnswer: mistake.questionType === 'MCQ' ? `Option ${mistake.userAnswer + 1}` : 'Incomplete response',
    correctAnswer: mistake.questionType === 'MCQ' ? `Option ${mistake.correctAnswer + 1}` : 'Full explanation required',
    reasoning: 'Conceptual gap identified',
    difficulty: ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)] as 'Easy' | 'Medium' | 'Hard'
  }));

  const insights = {
    strengths: questionTypeData.filter(item => item.percentage >= 75).map(item => item.name),
    needsWork: questionTypeData.filter(item => item.percentage < 65).map(item => item.name)
  };

  const handleViewSolution = (questionId: string) => {
    // Mock implementation - in a real app, this would open a detailed solution modal
    console.log('View solution for question:', questionId);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => onNavigate('dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-xl font-medium text-gray-900 flex items-center space-x-2">
                {getSubjectIcon()}
                <span>{subject.name} Results</span>
              </h1>
              <p className="text-sm text-gray-500">
                Completed on {result.completedAt.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Score Summary Strip */}
        <div className="mb-8">
          <ScoreSummaryCard
            examType="AP"
            correctAnswers={result.correctAnswers}
            totalQuestions={result.totalQuestions}
            timeSpent={result.timeSpent}
            completedAt={result.completedAt}
          />
        </div>

        {/* Multiple Choice Questions section removed - functionality integrated into ScoreSummaryCard */}

        {/* Chapter/Topic Analysis */}
        <div className="mb-8">
          <TypeAnalysisChart
            title="Performance by Chapter/Topic"
            data={questionTypeData}
            chartType="bar"
            insights={insights}
          />
        </div>

        {/* Wrong Questions List */}
        <div className="mb-8">
          <WrongQuestionList
            questions={wrongQuestions}
            onViewSolution={handleViewSolution}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            style={{ backgroundColor: 'var(--color-accent)' }}
            className="text-white hover:opacity-90"
            onClick={onRetryExam}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Retake Chapter Test
          </Button>
          <Button variant="outline" size="lg">
            <BookOpen className="w-4 h-4 mr-2" />
            Review Mistakes
          </Button>
          <Button variant="outline" size="lg">
            <Target className="w-4 h-4 mr-2" />
            Go to Recommended Chapter
          </Button>
        </div>
      </div>
    </div>
  );
}