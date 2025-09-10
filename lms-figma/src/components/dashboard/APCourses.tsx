import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { ChapterBox } from './ChapterBox';
import { APExamCard } from './APExamCard';
import { BookOpen, TrendingUp, Award, FileText } from 'lucide-react';
import type { Subject, APExam } from '../../App';

interface APCoursesProps {
  subjects: Subject[];
  apExams: APExam[];
  onStartExam: (subject: Subject) => void;
  selectedSubject?: Subject | null;
  onTabChange?: () => void;
  className?: string;
}

export function APCourses({ subjects, apExams, onStartExam, selectedSubject, onTabChange, className }: APCoursesProps) {
  const apSubjects = subjects.filter(s => s.type === 'AP');
  const [activeTab, setActiveTab] = useState(
    apSubjects.filter(subject => 
      ['ap-chemistry', 'ap-biology', 'ap-psychology'].includes(subject.id)
    )[0]?.id || 'ap-chemistry'
  );

  // Auto-select tab based on selected subject
  useEffect(() => {
    if (selectedSubject && selectedSubject.type === 'AP') {
      setActiveTab(selectedSubject.id);
    }
  }, [selectedSubject]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (onTabChange) {
      onTabChange();
    }
  };

  // Mock chapter data for each AP subject
  const getChaptersForSubject = (subjectId: string) => {
    const chapterData = {
      'ap-chemistry': [
        { 
          number: 1, 
          title: 'Atomic Structure and Properties', 
          mcq: 25, 
          frq: 5, 
          hasVideo: true, 
          completed: true, 
          score: 88, 
          timeSpent: 120, 
          difficulty: 'Medium' as const 
        },
        { 
          number: 2, 
          title: 'Molecular and Ionic Compounds', 
          mcq: 30, 
          frq: 8, 
          hasVideo: true, 
          completed: true, 
          score: 92, 
          timeSpent: 95, 
          difficulty: 'Easy' as const 
        },
        { 
          number: 3, 
          title: 'Intermolecular Forces', 
          mcq: 28, 
          frq: 6, 
          hasVideo: true, 
          completed: true, 
          score: 76, 
          timeSpent: 110, 
          difficulty: 'Hard' as const 
        },
        { 
          number: 4, 
          title: 'Chemical Reactions', 
          mcq: 35, 
          frq: 10, 
          hasVideo: true, 
          completed: false, 
          timeSpent: 45, 
          difficulty: 'Medium' as const 
        },
        { 
          number: 5, 
          title: 'Kinetics', 
          mcq: 32, 
          frq: 7, 
          hasVideo: true, 
          completed: false, 
          difficulty: 'Hard' as const 
        },
        { 
          number: 6, 
          title: 'Thermodynamics', 
          mcq: 29, 
          frq: 9, 
          hasVideo: false, 
          completed: false, 
          difficulty: 'Hard' as const 
        },
        { 
          number: 7, 
          title: 'Equilibrium', 
          mcq: 26, 
          frq: 6, 
          hasVideo: true, 
          completed: false, 
          difficulty: 'Medium' as const 
        },
        { 
          number: 8, 
          title: 'Acids and Bases', 
          mcq: 24, 
          frq: 5, 
          hasVideo: true, 
          completed: false, 
          difficulty: 'Medium' as const 
        },
        { 
          number: 9, 
          title: 'Applications of Thermodynamics', 
          mcq: 27, 
          frq: 7, 
          hasVideo: false, 
          completed: false, 
          difficulty: 'Hard' as const 
        },
        { 
          number: 10, 
          title: 'Electrochemistry and Redox', 
          mcq: 31, 
          frq: 8, 
          hasVideo: true, 
          completed: false, 
          difficulty: 'Hard' as const 
        },
        { 
          number: 11, 
          title: 'Organic Chemistry', 
          mcq: 22, 
          frq: 4, 
          hasVideo: true, 
          completed: false, 
          difficulty: 'Medium' as const 
        },
        { 
          number: 12, 
          title: 'Nuclear Chemistry', 
          mcq: 18, 
          frq: 3, 
          hasVideo: false, 
          completed: false, 
          difficulty: 'Easy' as const 
        }
      ],
      'ap-biology': [
        { 
          number: 1, 
          title: 'Chemistry of Life', 
          mcq: 22, 
          frq: 4, 
          hasVideo: true, 
          completed: true, 
          score: 85, 
          timeSpent: 105, 
          difficulty: 'Easy' as const 
        },
        { 
          number: 2, 
          title: 'Cell Structure and Function', 
          mcq: 28, 
          frq: 6, 
          hasVideo: true, 
          completed: true, 
          score: 79, 
          timeSpent: 130, 
          difficulty: 'Medium' as const 
        },
        { 
          number: 3, 
          title: 'Cellular Energetics', 
          mcq: 26, 
          frq: 5, 
          hasVideo: true, 
          completed: true, 
          score: 91, 
          timeSpent: 88, 
          difficulty: 'Medium' as const 
        },
        { 
          number: 4, 
          title: 'Cell Communication', 
          mcq: 24, 
          frq: 7, 
          hasVideo: true, 
          completed: false, 
          timeSpent: 25, 
          difficulty: 'Hard' as const 
        },
        { 
          number: 5, 
          title: 'Heredity', 
          mcq: 30, 
          frq: 8, 
          hasVideo: false, 
          completed: false, 
          difficulty: 'Medium' as const 
        }
      ],
      'ap-physics': [
        { 
          number: 1, 
          title: 'Kinematics', 
          mcq: 20, 
          frq: 3, 
          hasVideo: true, 
          completed: true, 
          score: 82, 
          timeSpent: 90, 
          difficulty: 'Easy' as const 
        },
        { 
          number: 2, 
          title: 'Dynamics', 
          mcq: 25, 
          frq: 5, 
          hasVideo: true, 
          completed: false, 
          timeSpent: 30, 
          difficulty: 'Medium' as const 
        },
        { 
          number: 3, 
          title: 'Circular Motion', 
          mcq: 18, 
          frq: 4, 
          hasVideo: false, 
          completed: false, 
          difficulty: 'Hard' as const 
        }
      ],
      'ap-psychology': [
        { 
          number: 1, 
          title: 'Biological Bases of Behavior', 
          mcq: 24, 
          frq: 4, 
          hasVideo: true, 
          completed: true, 
          score: 78, 
          timeSpent: 85, 
          difficulty: 'Medium' as const 
        },
        { 
          number: 2, 
          title: 'Sensation and Perception', 
          mcq: 28, 
          frq: 5, 
          hasVideo: true, 
          completed: true, 
          score: 84, 
          timeSpent: 95, 
          difficulty: 'Medium' as const 
        },
        { 
          number: 3, 
          title: 'Learning', 
          mcq: 22, 
          frq: 3, 
          hasVideo: true, 
          completed: false, 
          timeSpent: 30, 
          difficulty: 'Easy' as const 
        },
        { 
          number: 4, 
          title: 'Cognitive Psychology', 
          mcq: 26, 
          frq: 6, 
          hasVideo: true, 
          completed: false, 
          difficulty: 'Hard' as const 
        },
        { 
          number: 5, 
          title: 'Developmental Psychology', 
          mcq: 25, 
          frq: 4, 
          hasVideo: false, 
          completed: false, 
          difficulty: 'Medium' as const 
        },
        { 
          number: 6, 
          title: 'Personality', 
          mcq: 20, 
          frq: 3, 
          hasVideo: true, 
          completed: false, 
          difficulty: 'Easy' as const 
        },
        { 
          number: 7, 
          title: 'Abnormal Psychology', 
          mcq: 23, 
          frq: 5, 
          hasVideo: true, 
          completed: false, 
          difficulty: 'Hard' as const 
        },
        { 
          number: 8, 
          title: 'Treatment of Abnormal Behavior', 
          mcq: 21, 
          frq: 4, 
          hasVideo: false, 
          completed: false, 
          difficulty: 'Medium' as const 
        },
        { 
          number: 9, 
          title: 'Social Psychology', 
          mcq: 27, 
          frq: 6, 
          hasVideo: true, 
          completed: false, 
          difficulty: 'Medium' as const 
        }
      ]
    };

    return chapterData[subjectId as keyof typeof chapterData] || [];
  };

  // Get AP exam data for each subject using the provided apExams data
  const getExamsForSubject = (subjectId: string) => {
    const subjectMapping = {
      'ap-chemistry': 'Chemistry',
      'ap-biology': 'Biology', 
      'ap-psychology': 'Psychology'
    };
    
    const subjectName = subjectMapping[subjectId as keyof typeof subjectMapping];
    return apExams.filter(exam => exam.subject === subjectName);
  };

  const getSubjectStats = (subjectId: string) => {
    const chapters = getChaptersForSubject(subjectId);
    const completed = chapters.filter(c => c.completed).length;
    const avgScore = chapters
      .filter(c => c.score)
      .reduce((acc, c, _, arr) => acc + (c.score || 0) / arr.length, 0);

    return { completed, total: chapters.length, avgScore: Math.round(avgScore) };
  };

  return (
    <Card 
      className={`border-0 shadow-sm ${className || ''}`}
      style={{ 
        backgroundColor: 'var(--color-card-default-bg)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <CardHeader 
        className="pb-4 rounded-t-lg border" 
        style={{ 
          backgroundColor: 'var(--color-card-default-bg)',
          borderColor: 'var(--color-card-border)',
          borderTop: '4px solid var(--color-accent)',
          borderTopLeftRadius: '0.75rem',
          borderTopRightRadius: '0.75rem'
        }}
      >
        <CardTitle className="flex items-center space-x-2" style={{ color: 'var(--color-text-primary)' }}>
          <BookOpen className="w-5 h-5" style={{ color: 'var(--color-subject-secondary)' }} />
          <span>AP Courses</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList 
              className="relative flex items-center p-1.5 rounded-2xl shadow-lg bg-transparent border-0"
              style={{ 
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-card-border)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                height: 'auto'
              }}
            >
              {apSubjects
                .filter(subject => ['ap-chemistry', 'ap-biology', 'ap-psychology'].includes(subject.id))
                .map((subject) => (
                <TabsTrigger 
                  key={subject.id} 
                  value={subject.id}
                  className="relative flex items-center px-6 py-3 mx-1 rounded-xl transition-all duration-300 ease-in-out transform data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:scale-105 data-[state=inactive]:text-gray-600 hover:text-gray-800 hover:bg-gray-50 border-0 bg-transparent"
                  style={{
                    minWidth: '120px',
                    fontSize: '15px',
                    fontWeight: '500',
                    height: 'auto',
                    '--tw-ring-offset-shadow': 'none',
                    '--tw-ring-shadow': 'none'
                  }}
                  data-state-style="active"
                >
                  <span className="mr-2.5 transition-transform duration-300 data-[state=active]:scale-110" 
                        style={{ fontSize: '18px' }}>
                    {subject.icon}
                  </span>
                  <span className="relative">
                    {subject.name.replace('AP ', '')}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {apSubjects
            .filter(subject => ['ap-chemistry', 'ap-biology', 'ap-psychology'].includes(subject.id))
            .map((subject) => {
            const chapters = getChaptersForSubject(subject.id);
            const exams = getExamsForSubject(subject.id);
            const stats = getSubjectStats(subject.id);

            return (
              <TabsContent key={subject.id} value={subject.id} className="space-y-6">
                {/* Subject Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div 
                    className="p-4 rounded-lg text-center"
                    style={{ 
                      backgroundColor: 'var(--color-card-default-bg)',
                      border: '1px solid var(--color-card-border)',
                      boxShadow: 'var(--color-card-hover-shadow)'
                    }}
                  >
                    <TrendingUp className="w-5 h-5 mx-auto mb-2" style={{ color: 'var(--color-primary)' }} />
                    <div className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{subject.progress}%</div>
                    <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Progress</div>
                  </div>
                  
                  <div 
                    className="p-4 rounded-lg text-center"
                    style={{ 
                      backgroundColor: 'var(--color-card-default-bg)',
                      border: '1px solid var(--color-card-border)',
                      boxShadow: 'var(--color-card-hover-shadow)'
                    }}
                  >
                    <BookOpen className="w-5 h-5 mx-auto mb-2" style={{ color: 'var(--color-primary)' }} />
                    <div className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{stats.completed}/{stats.total}</div>
                    <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Chapters</div>
                  </div>
                  
                  <div 
                    className="p-4 rounded-lg text-center"
                    style={{ 
                      backgroundColor: 'var(--color-card-default-bg)',
                      border: '1px solid var(--color-card-border)',
                      boxShadow: 'var(--color-card-hover-shadow)'
                    }}
                  >
                    <Award className="w-5 h-5 mx-auto mb-2" style={{ color: 'var(--color-primary)' }} />
                    <div className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{stats.avgScore || 0}%</div>
                    <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Avg Score</div>
                  </div>
                </div>

                {/* Content Sections */}
                <div className="space-y-8">
                  {/* Study Chapters */}
                  <div>
                    <h4 className="text-sm font-medium mb-4 flex items-center" style={{ color: 'var(--color-text-primary)' }}>
                      <BookOpen className="w-4 h-4 mr-2" style={{ color: 'var(--color-subject-secondary)' }} />
                      Study Chapters
                    </h4>
                    <div 
                      className="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto scrollbar-custom px-2 py-2"
                      style={{ maxHeight: 'calc(55vh - 100px)' }} // Dynamic height for chapters
                    >
                      {chapters.map((chapter) => (
                        <ChapterBox
                          key={chapter.number}
                          chapterNumber={chapter.number}
                          title={chapter.title}
                          mcqCount={chapter.mcq}
                          frqCount={chapter.frq}
                          hasVideo={chapter.hasVideo}
                          completed={chapter.completed}
                          score={chapter.score}
                          timeSpent={chapter.timeSpent}
                          difficulty={chapter.difficulty}
                          onClick={() => onStartExam(subject)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* AP Practice Exams */}
                  {exams.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-4 flex items-center" style={{ color: 'var(--color-text-primary)' }}>
                        <FileText className="w-4 h-4 mr-2" style={{ color: 'var(--color-subject-accent)' }} />
                        Practice Exams ({exams.length} available)
                      </h4>
                      <div 
                        className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto scrollbar-custom pr-2 pb-6"
                        style={{ 
                          height: '700px' // Fixed height for testing - this ensures both scroll and height work
                        }}
                      >
                        {exams.map((exam) => (
                          <APExamCard
                            key={exam.examId}
                            examId={exam.examId}
                            title={exam.title}
                            description={exam.description}
                            duration={exam.duration}
                            questionCount={exam.questionCount}
                            difficulty={exam.difficulty}
                            hasExplanatoryVideo={exam.hasExplanatoryVideo}
                            videoLength={exam.videoLength}
                            completed={exam.completed}
                            score={exam.score}
                            attempts={exam.attempts}
                            averageScore={exam.averageScore}
                            completionRate={exam.completionRate}
                            lastAttempt={exam.lastAttempt}
                            examDate={new Date('2025-05-15')} // May 15, 2025 - AP Exam date
                            subject={exam.subject}
                            onStartExam={() => onStartExam(subject)}
                            onWatchVideo={() => console.log(`Watch video for ${exam.examId}`)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Actions */}

                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </CardContent>
    </Card>
  );
}