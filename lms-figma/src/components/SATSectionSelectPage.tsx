import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  BookOpen, 
  Edit3, 
  Calculator, 
  Clock, 
  Target,
  ArrowLeft,
  Play,
  Users,
  CheckCircle2,
  BarChart3
} from 'lucide-react';
import type { PageType, Subject } from '../App';

interface SATSectionSelectPageProps {
  selectedTest: Subject | null;
  onNavigate: (page: PageType) => void;
  onStartSection: (section: string) => void;
  onNavigateToSATSection?: () => void;
}

export function SATSectionSelectPage({ 
  selectedTest, 
  onNavigate, 
  onStartSection,
  onNavigateToSATSection
}: SATSectionSelectPageProps) {
  // Dynamic section data based on selectedTest
  const getSections = () => {
    const baseSections = [
      {
        id: 'reading',
        name: 'Reading',
        description: 'Reading comprehension, vocabulary in context, and analysis of texts from literature, history, and science.',
        duration: 65,
        questions: 52,
        icon: BookOpen,
        color: '#0091B3',
        difficulty: 'Medium'
      },
      {
        id: 'writing',
        name: 'Writing & Language',
        description: 'Grammar, usage, and rhetoric skills through editing and revising passages.',
        duration: 35,
        questions: 44,
        icon: Edit3,
        color: '#0091B3',
        difficulty: 'Medium'
      },
      {
        id: 'math',
        name: 'Math',
        description: 'Algebra, geometry, trigonometry, and data analysis with and without calculator.',
        duration: 80,
        questions: 58,
        icon: Calculator,
        color: '#0091B3',
        difficulty: 'Hard'
      }
    ];

    return baseSections.map(section => {
      const sectionProgress = selectedTest?.sectionProgress?.[section.id as keyof typeof selectedTest.sectionProgress];
      const completed = sectionProgress?.completed || false;
      const score = sectionProgress?.score || null;
      
      // Mock correct answers based on score (for demonstration)
      let correctAnswers = 0;
      if (completed && score) {
        const accuracy = Math.max(0.6, Math.min(0.95, score / 800)); // Convert score to accuracy (60-95%)
        correctAnswers = Math.round(section.questions * accuracy);
      }
      
      return {
        ...section,
        completed,
        score,
        correctAnswers,
        accuracy: completed && correctAnswers > 0 ? Math.round((correctAnswers / section.questions) * 100) : null
      };
    });
  };

  const sections = getSections();

  // Check if all sections are completed
  const allSectionsCompleted = sections.every(section => section.completed);
  const totalScore = allSectionsCompleted ? sections.reduce((sum, section) => sum + (section.score || 0), 0) : null;
  
  // Calculate overall accuracy rate
  const completedSections = sections.filter(section => section.completed);
  const totalCorrectAnswers = completedSections.reduce((sum, section) => sum + (section.correctAnswers || 0), 0);
  const totalCompletedQuestions = completedSections.reduce((sum, section) => sum + section.questions, 0);
  const overallAccuracy = totalCompletedQuestions > 0 ? Math.round((totalCorrectAnswers / totalCompletedQuestions) * 100) : null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'var(--color-difficulty-easy)';
      case 'medium': return 'var(--color-difficulty-medium)';
      case 'hard': return 'var(--color-difficulty-hard)';
      default: return 'var(--color-text-secondary)';
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 border-b" style={{ 
        backgroundColor: 'var(--color-card)', 
        borderColor: 'var(--color-border)' 
      }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigateToSATSection ? onNavigateToSATSection() : onNavigate('dashboard')}
              className="flex items-center space-x-2 hover:scale-105 transition-all duration-200"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to SAT Exams</span>
            </Button>
            <div className="w-px h-6" style={{ backgroundColor: 'var(--color-border)' }}></div>
            <div>
              <h1 className="text-2xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                {selectedTest?.name || 'SAT Practice Test'}
              </h1>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Choose a section to begin your practice
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge 
              className="px-3 py-1 text-sm font-medium"
              style={{ 
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-accent)',
                border: 'none'
              }}
            >
              <Target className="w-3 h-3 mr-1" />
              Full Length Test
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Test Overview */}
        <Card 
          className="mb-8 border rounded-lg"
          style={{ 
            backgroundColor: 'var(--color-card-default-bg)',
            borderColor: 'var(--color-card-border)',
            borderTop: '4px solid var(--color-accent)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
        >
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-3" style={{ color: 'var(--color-text-primary)' }}>
              <div 
                className="p-2 rounded-lg"
                style={{ backgroundColor: 'var(--color-primary-light)' }}
              >
                <Target className="w-5 h-5" style={{ color: 'var(--color-accent)' }} />
              </div>
              <div>
                <span>SAT Practice Test Overview</span>
                <p className="text-sm font-normal" style={{ color: 'var(--color-text-secondary)' }}>
                  Complete individual sections or take the full test
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-around items-center divide-y md:divide-y-0 md:divide-x divide-gray-300">
              <div className="text-center py-4 md:py-0 flex-1">
                <div className="text-3xl font-bold" style={{ color: 'var(--color-accent)' }}>
                  180
                </div>
                <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  Total Minutes
                </div>
              </div>
              <div className="text-center py-4 md:py-0 flex-1">
                <div className="text-3xl font-bold" style={{ color: 'var(--color-accent)' }}>
                  154
                </div>
                <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  Total Questions
                </div>
              </div>
              <div className="text-center py-4 md:py-0 flex-1">
                <div className="text-3xl font-bold" style={{ color: 'var(--color-accent)' }}>
                  1600
                </div>
                <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  Max Score
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--color-text-primary)' }}>
            Choose Your Section
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sections.map((section) => {
              const IconComponent = section.icon;
              return (
                <Card 
                  key={section.id}
                  className="border rounded-lg transition-all duration-300 group flex flex-col overflow-hidden"
                  style={{ 
                    backgroundColor: section.completed ? 'var(--color-card-completed-bg)' : 'var(--color-card-default-bg)',
                    borderColor: 'var(--color-card-border)',
                    borderWidth: '1px',
                    height: '420px', // 버튼 공간 확보를 위해 높이 증가
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' // 2️⃣ 기본 그림자 추가
                  }}
                  onMouseEnter={(e) => {
                    // 호버시 더 강한 그림자와 변형 효과
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = 'var(--color-card-hover-shadow)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'; // 기본 그림자로 복원
                  }}
                >
                  {/* Header Section - Fixed Height */}
                  <CardHeader className="pb-3 flex-shrink-0">
                    <div className="flex items-center justify-between mb-3">
                      <div 
                        className="p-3 rounded-lg flex-shrink-0 border"
                        style={{ 
                          backgroundColor: section.completed ? 'var(--color-status-success)' : 'var(--color-primary-light)',
                          borderColor: 'var(--color-card-border)'
                        }}
                      >
                        <IconComponent 
                          className="w-6 h-6" 
                          style={{ color: section.completed ? 'white' : section.color }} 
                        />
                      </div>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        {section.completed && (
                          <Badge 
                            className="px-2 py-1 text-xs font-medium flex items-center gap-1"
                            style={{ 
                              backgroundColor: 'var(--color-status-success)',
                              color: 'white',
                              border: 'none'
                            }}
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            Complete
                          </Badge>
                        )}
                        <Badge 
                          className="px-2 py-1 text-xs font-medium"
                          style={{ 
                            backgroundColor: getDifficultyColor(section.difficulty),
                            color: 'white',
                            border: 'none'
                          }}
                        >
                          {section.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-xl" style={{ color: 'var(--color-text-primary)' }}>
                      {section.name}
                    </CardTitle>
                  </CardHeader>
                  
                  {/* Content Section - Flexible */}
                  <CardContent className="flex flex-col flex-1 space-y-4 p-6 pt-0 overflow-hidden">
                    {/* Fixed 3-line description area */}
                    <div className="flex-shrink-0">
                      <p className="text-sm leading-relaxed line-clamp-3" style={{ 
                        color: 'var(--color-text-secondary)',
                        minHeight: '4rem', // Ensures consistent height for 3 lines
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {section.description}
                      </p>
                    </div>
                    
                    {/* Time and questions info */}
                    <div className="flex items-center justify-between text-sm flex-shrink-0 py-2">
                      <div className="flex items-center space-x-1" style={{ color: 'var(--color-text-secondary)' }}>
                        <Clock className="w-4 h-4" />
                        <span>{section.duration} min</span>
                      </div>
                      <div className="flex items-center space-x-1" style={{ color: 'var(--color-text-secondary)' }}>
                        <Users className="w-4 h-4" />
                        <span>{section.questions} questions</span>
                      </div>
                    </div>
                    
                    {/* 1️⃣ Score & Accuracy Display - 통일된 크기의 흰색 박스 구성 */}
                    <div className="flex justify-center space-x-3 flex-shrink-0 mt-auto mb-4">
                      {/* Score Box */}
                      <div 
                        className="bg-white rounded-lg px-3 py-3 shadow-sm border min-w-[100px] min-h-[85px] flex items-center justify-center"
                        style={{ 
                          borderColor: 'var(--color-card-border)',
                          backgroundColor: 'var(--color-card-default-bg)'
                        }}
                      >
                        <div className="text-center">
                          <div 
                            className="text-xl font-bold mb-1"
                            style={{ 
                              color: section.completed ? 'var(--color-status-success)' : 'var(--color-text-secondary)' 
                            }}
                          >
                            {section.completed && section.score ? section.score : '---'}
                          </div>
                          <div 
                            className="text-sm"
                            style={{ 
                              color: 'var(--color-text-secondary)' 
                            }}
                          >
                            Score
                          </div>
                        </div>
                      </div>

                      {/* Accuracy Box - 항상 표시, 통일된 크기 */}
                      <div 
                        className="bg-white rounded-lg px-3 py-3 shadow-sm border min-w-[100px] min-h-[85px] flex items-center justify-center"
                        style={{ 
                          borderColor: 'var(--color-card-border)',
                          backgroundColor: 'var(--color-card-default-bg)'
                        }}
                      >
                        <div className="text-center">
                          <div 
                            className="text-xl font-bold mb-1"
                            style={{ 
                              color: section.completed ? 'var(--color-accent)' : 'var(--color-text-secondary)' 
                            }}
                          >
                            {section.completed && section.accuracy ? `${section.accuracy}%` : '---%'}
                          </div>
                          <div 
                            className="text-sm"
                            style={{ 
                              color: 'var(--color-text-secondary)' 
                            }}
                          >
                            Accuracy
                          </div>

                        </div>
                      </div>
                    </div>
                    
                    {/* Button - Always at bottom with guaranteed space */}
                    <div className="flex-shrink-0">
                      <Button
                        className="w-full flex items-center justify-center gap-2 transition-all duration-200 hover:scale-105 cursor-pointer"
                        onClick={() => onStartSection(section.id)}
                        style={{ 
                          backgroundColor: section.completed ? 'var(--color-text-secondary)' : 'var(--color-accent)', // 3️⃣ Review 버튼 배경색 개선
                          color: 'white', // 모든 버튼의 텍스트를 흰색으로 통일
                          border: 'none'
                        }}
                      >
                        {section.completed ? (
                          <>
                            <Target className="w-4 h-4" />
                            <span>Review {section.name}</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" />
                            <span>Start {section.name}</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Test Results Section */}
        {allSectionsCompleted ? (
          <Card 
            className="border rounded-lg"
            style={{ 
              backgroundColor: 'var(--color-card-completed-bg)',
              borderColor: 'var(--color-status-success)',
              borderLeft: '4px solid var(--color-status-success)',
              borderWidth: '1px 1px 1px 4px'
            }}
          >
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
                    <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--color-status-success)' }} />
                    Exam Result
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div 
                      className="bg-white rounded-lg p-3 border text-center"
                      style={{ 
                        borderColor: 'var(--color-card-border)',
                        backgroundColor: 'var(--color-status-success)'
                      }}
                    >
                      <div className="text-xl font-bold text-white mb-1">
                        {totalScore}
                      </div>
                      <div className="text-xs text-white opacity-90">
                        Total Score
                      </div>
                    </div>
                    <div 
                      className="bg-white rounded-lg p-3 border text-center"
                      style={{ 
                        borderColor: 'var(--color-card-border)',
                        backgroundColor: 'var(--color-accent)'
                      }}
                    >
                      <div className="text-xl font-bold text-white mb-1">
                        {overallAccuracy}%
                      </div>
                      <div className="text-xs text-white opacity-90">
                        Accuracy
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    <Target className="w-4 h-4 mr-1" />
                    <span>All sections completed</span>
                  </div>
                </div>
                
                <div className="ml-4">
                  <Button
                    size="lg"
                    className="px-6 py-2 flex items-center gap-2 transition-all duration-200 hover:scale-105"
                    onClick={() => onNavigate('sat-detailed-results')}
                    style={{ 
                      backgroundColor: 'var(--color-accent)',
                      color: 'white',
                      border: 'none'
                    }}
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>세부결과</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card 
            className="border rounded-lg"
            style={{ 
              backgroundColor: 'var(--color-card-default-bg)',
              borderColor: 'var(--color-card-border)',
              borderLeft: '4px solid var(--color-accent)'
            }}
          >
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                      Exam Result
                    </h3>
                    {allSectionsCompleted && (
                      <Badge 
                        className="px-3 py-1 text-sm font-medium flex items-center gap-1"
                        style={{ 
                          backgroundColor: 'var(--color-status-success)',
                          color: 'white',
                          border: 'none'
                        }}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Completed
                      </Badge>
                    )}
                  </div>
                  
                  {/* Score Display */}
                  {completedSections.length > 0 && (
                    <div className="mb-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <div 
                          className="bg-white rounded-lg p-4 border text-center shadow-sm"
                          style={{ 
                            borderColor: 'var(--color-card-border)',
                            backgroundColor: 'var(--color-card-default-bg)'
                          }}
                        >
                          <div 
                            className="text-2xl font-bold mb-1"
                            style={{ 
                              color: allSectionsCompleted ? 'var(--color-status-success)' : 'var(--color-text-secondary)'
                            }}
                          >
                            {totalScore || completedSections.reduce((sum, section) => sum + (section.score || 0), 0)}
                          </div>
                          <div 
                            className="text-sm"
                            style={{ 
                              color: 'var(--color-text-secondary)'
                            }}
                          >
                            {allSectionsCompleted ? 'Total Score' : 'Current Score'}
                          </div>
                        </div>
                        
                        {overallAccuracy && (
                          <div 
                            className="bg-white rounded-lg p-4 border text-center shadow-sm"
                            style={{ 
                              borderColor: 'var(--color-card-border)',
                              backgroundColor: 'var(--color-card-default-bg)'
                            }}
                          >
                            <div 
                              className="text-2xl font-bold mb-1"
                              style={{ 
                                color: 'var(--color-accent)'
                              }}
                            >
                              {overallAccuracy}%
                            </div>
                            <div 
                              className="text-sm"
                              style={{ 
                                color: 'var(--color-text-secondary)'
                              }}
                            >
                              Accuracy
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3 py-2">
                        {sections.map(section => (
                          <div 
                            key={section.id} 
                            className="bg-white rounded-lg p-4 border text-center space-y-2 shadow-sm"
                            style={{ 
                              borderColor: 'var(--color-card-border)',
                              backgroundColor: 'var(--color-card-default-bg)'
                            }}
                          >
                            <div 
                              className="font-semibold text-lg"
                              style={{ 
                                color: section.completed ? 'var(--color-status-success)' : 'var(--color-text-secondary)' 
                              }}
                            >
                              {section.completed ? section.score : '---'}
                            </div>
                            <div className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                              {section.name}
                            </div>
                            <div className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
                              {section.completed && section.correctAnswers ? `${section.correctAnswers}/${section.questions}` : '---'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  

                </div>
                
                <div className="ml-4">
                  <Button
                    size="lg"
                    className="px-6 py-3 bg-primary hover:bg-primary-hover text-white transition-colors duration-200 rounded-lg shadow-sm hover:shadow-md"
                    onClick={() => onStartSection('detailed-results')}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Detailed Analysis
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}