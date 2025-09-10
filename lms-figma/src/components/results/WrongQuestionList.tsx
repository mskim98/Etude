import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Eye, BookOpen, AlertTriangle } from 'lucide-react';

interface WrongQuestion {
  id: string;
  questionNumber: number;
  topic: string;
  questionType: 'MCQ' | 'FRQ';
  userAnswer: string;
  correctAnswer: string;
  reasoning: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface WrongQuestionListProps {
  questions: WrongQuestion[];
  onViewSolution: (questionId: string) => void;
}

export function WrongQuestionList({ questions, onViewSolution }: WrongQuestionListProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'mcq' | 'frq'>('all');

  const filteredQuestions = questions.filter(q => {
    if (activeFilter === 'all') return true;
    return q.questionType.toLowerCase() === activeFilter;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'MCQ' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';
  };

  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <BookOpen className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Wrong Questions!</h3>
          <p className="text-gray-500">
            Excellent work! You answered all questions correctly.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <span>Questions to Review ({questions.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Question List - All Questions */}
        <div 
          className={`space-y-3 ${questions.length >= 3 ? 'overflow-y-auto scrollbar-custom' : ''}`}
          style={questions.length >= 3 ? { maxHeight: '550px' } : {}}
        >
          {questions.map((question) => (
            <div
              key={question.id}
              className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Question Header */}
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-gray-900">
                      Question {question.questionNumber}
                    </span>
                    <Badge className={getDifficultyColor(question.difficulty)}>
                      {question.difficulty}
                    </Badge>
                  </div>

                  {/* Topic and Reasoning */}
                  <div className="space-y-2 mb-4">
                    <div className="text-base font-semibold text-gray-700">
                      {question.topic}
                    </div>
                    <div className="text-sm text-gray-600">
                      {question.reasoning}
                    </div>
                  </div>

                  {/* Answer Comparison */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Your Answer:</span>
                      <span className="ml-2 font-semibold text-red-600">
                        {question.userAnswer}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Correct Answer:</span>
                      <span className="ml-2 font-semibold text-green-600">
                        {question.correctAnswer}
                      </span>
                    </div>
                  </div>
                </div>

                {/* View Solution Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewSolution(question.id)}
                  className="ml-4 whitespace-nowrap"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View Solution
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}