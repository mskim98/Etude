import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { SignUpPage } from './components/SignUpPage';
import { ForgotPasswordPage } from './components/ForgotPasswordPage';
import { Dashboard } from './components/Dashboard';
import { MockExamPage } from './components/MockExamPage';
import { SATResultsPage } from './components/SATResultsPage';
import { APResultsPage } from './components/APResultsPage';
import { SATSectionSelectPage } from './components/SATSectionSelectPage';
import { SATDetailedResultsPage } from './components/SATDetailedResultsPage';

export type PageType = 'landing' | 'login' | 'signup' | 'forgot-password' | 'dashboard' | 'exam' | 'sat-results' | 'ap-results' | 'sat-section-select' | 'sat-detailed-results';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Subject {
  id: string;
  name: string;
  type: 'AP' | 'SAT';
  progress: number;
  totalChapters: number;
  completedChapters: number;
  lastScore?: number;
  icon: string;
  examDate: Date;
  sectionProgress?: {
    reading?: {
      progress: number;
      completed: boolean;
      score?: number;
    };
    writing?: {
      progress: number;
      completed: boolean;
      score?: number;
    };
    math?: {
      progress: number;
      completed: boolean;
      score?: number;
    };
  };
}

export interface Chapter {
  id: string;
  title: string;
  completed: boolean;
  mcqCount: number;
  frqCount: number;
  hasVideo: boolean;
}

export interface ExamQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  subject: string;
  chapter: string;
}

export interface ExamResult {
  id: string;
  subjectId: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  timeSpent: number;
  completedAt: Date;
  mistakes: {
    questionId: string;
    userAnswer: number;
    correctAnswer: number;
  }[];
}

export interface APExam {
  examId: string;
  title: string;
  description: string;
  duration: number; // in minutes
  questionCount: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  hasExplanatoryVideo: boolean;
  videoLength?: number; // in minutes
  completed: boolean;
  score?: number; // AP score (1-5)
  attempts: number;
  averageScore: number;
  completionRate: number;
  lastAttempt?: Date;
  examDate?: Date; // AP exam date countdown
  subject: 'Chemistry' | 'Biology' | 'Psychology'; // AP subject types
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Mock chapters data for testing
  const mockChapters: Chapter[] = [
    { id: 'ch1', title: 'Introduction to Chemistry', completed: true, mcqCount: 15, frqCount: 3, hasVideo: true },
    { id: 'ch2', title: 'Atomic Structure', completed: true, mcqCount: 20, frqCount: 4, hasVideo: true },
    { id: 'ch3', title: 'Chemical Bonding', completed: true, mcqCount: 18, frqCount: 5, hasVideo: false },
    { id: 'ch4', title: 'Stoichiometry', completed: false, mcqCount: 22, frqCount: 6, hasVideo: true },
    { id: 'ch5', title: 'Thermodynamics', completed: false, mcqCount: 25, frqCount: 4, hasVideo: true },
    { id: 'ch6', title: 'Kinetics', completed: false, mcqCount: 19, frqCount: 3, hasVideo: false },
    { id: 'ch7', title: 'Equilibrium', completed: false, mcqCount: 21, frqCount: 5, hasVideo: true },
    { id: 'ch8', title: 'Acids and Bases', completed: false, mcqCount: 17, frqCount: 4, hasVideo: true },
    { id: 'ch9', title: 'Electrochemistry', completed: false, mcqCount: 23, frqCount: 6, hasVideo: true },
    { id: 'ch10', title: 'Nuclear Chemistry', completed: false, mcqCount: 16, frqCount: 3, hasVideo: false },
    { id: 'ch11', title: 'Organic Chemistry Basics', completed: false, mcqCount: 28, frqCount: 7, hasVideo: true },
    { id: 'ch12', title: 'Coordination Compounds', completed: false, mcqCount: 20, frqCount: 5, hasVideo: true },
    { id: 'ch13', title: 'Solutions and Colligative Properties', completed: false, mcqCount: 24, frqCount: 4, hasVideo: false },
    { id: 'ch14', title: 'Chemical Thermodynamics Advanced', completed: false, mcqCount: 26, frqCount: 6, hasVideo: true },
    { id: 'ch15', title: 'Surface Chemistry', completed: false, mcqCount: 18, frqCount: 4, hasVideo: true }
  ];

  // Mock exam questions for testing
  const mockExamQuestions: ExamQuestion[] = [
    {
      id: 'q1',
      question: 'What is the electron configuration of oxygen?',
      options: ['1s² 2s² 2p⁴', '1s² 2s² 2p⁶', '1s² 2s² 2p²', '1s² 2s⁴'],
      correctAnswer: 0,
      explanation: 'Oxygen has 8 electrons, so its electron configuration is 1s² 2s² 2p⁴.',
      subject: 'AP Chemistry',
      chapter: 'Atomic Structure'
    },
    {
      id: 'q2',
      question: 'Which type of bond is formed between Na and Cl?',
      options: ['Covalent', 'Ionic', 'Metallic', 'Hydrogen'],
      correctAnswer: 1,
      explanation: 'Na (metal) and Cl (nonmetal) form an ionic bond through electron transfer.',
      subject: 'AP Chemistry',
      chapter: 'Chemical Bonding'
    },
    // Add more questions as needed...
  ];

  // Mock exam results for testing
  const mockExamResults: ExamResult[] = [
    {
      id: 'result1',
      subjectId: 'ap-chemistry',
      totalQuestions: 30,
      correctAnswers: 24,
      score: 80,
      timeSpent: 45,
      completedAt: new Date('2024-12-20'),
      mistakes: [
        { questionId: 'q1', userAnswer: 1, correctAnswer: 0 },
        { questionId: 'q2', userAnswer: 2, correctAnswer: 1 }
      ]
    }
  ];

  // Comprehensive AP Practice Exams Data (4 for each subject: Chemistry, Biology, Psychology)
  const apExams: APExam[] = [
    // AP Chemistry (4 exams)
    {
      examId: 'chem-001',
      title: 'Atomic Structure & Bonding',
      description: 'Comprehensive exam covering atomic theory, electron configuration, periodic trends, and chemical bonding. Includes Lewis structures, VSEPR theory, and molecular geometry.',
      duration: 90,
      questionCount: 45,
      difficulty: 'Medium',
      hasExplanatoryVideo: true,
      videoLength: 25,
      completed: true,
      score: 4,
      attempts: 2,
      averageScore: 3.8,
      completionRate: 89,
      lastAttempt: new Date('2024-12-15'),
      subject: 'Chemistry'
    },
    {
      examId: 'chem-002', 
      title: 'Thermodynamics & Kinetics',
      description: 'Advanced practice covering thermodynamic laws, enthalpy, entropy, Gibbs free energy, reaction rates, catalysis, and equilibrium dynamics.',
      duration: 105,
      questionCount: 52,
      difficulty: 'Hard',
      hasExplanatoryVideo: true,
      videoLength: 35,
      completed: true,
      score: 5,
      attempts: 1,
      averageScore: 4.2,
      completionRate: 93,
      lastAttempt: new Date('2024-12-20'),
      subject: 'Chemistry'
    },
    {
      examId: 'chem-003',
      title: 'Acids, Bases & Equilibrium',
      description: 'Practice exam focusing on acid-base chemistry, pH calculations, buffer solutions, titrations, and chemical equilibrium principles.',
      duration: 85,
      questionCount: 40,
      difficulty: 'Medium',
      hasExplanatoryVideo: false,
      completed: false,
      attempts: 0,
      averageScore: 3.5,
      completionRate: 78,
      subject: 'Chemistry'
    },
    {
      examId: 'chem-004',
      title: 'Electrochemistry & Nuclear',
      description: 'Comprehensive coverage of redox reactions, electrochemical cells, nuclear chemistry, radioactive decay, and industrial chemical processes.',
      duration: 95,
      questionCount: 48,
      difficulty: 'Hard',
      hasExplanatoryVideo: true,
      videoLength: 30,
      completed: false,
      attempts: 0,
      averageScore: 3.9,
      completionRate: 82,
      subject: 'Chemistry'
    },

    // AP Biology (4 exams)
    {
      examId: 'bio-001',
      title: 'Cell Biology & Metabolism',
      description: 'Fundamental exam covering cell structure, membrane transport, cellular respiration, photosynthesis, and enzyme kinetics.',
      duration: 100,
      questionCount: 50,
      difficulty: 'Easy',
      hasExplanatoryVideo: true,
      videoLength: 22,
      completed: true,
      score: 3,
      attempts: 3,
      averageScore: 3.2,
      completionRate: 76,
      lastAttempt: new Date('2024-12-10'),
      subject: 'Biology'
    },
    {
      examId: 'bio-002',
      title: 'Genetics & Molecular Biology',
      description: 'Advanced practice on DNA structure, replication, transcription, translation, gene regulation, and biotechnology applications.',
      duration: 110,
      questionCount: 55,
      difficulty: 'Hard',
      hasExplanatoryVideo: true,
      videoLength: 40,
      completed: false,
      attempts: 0,
      averageScore: 3.7,
      completionRate: 85,
      subject: 'Biology'
    },
    {
      examId: 'bio-003',
      title: 'Evolution & Biodiversity',
      description: 'Comprehensive exam covering natural selection, speciation, phylogenetics, population genetics, and ecological relationships.',
      duration: 95,
      questionCount: 47,
      difficulty: 'Medium',
      hasExplanatoryVideo: false,
      completed: true,
      score: 4,
      attempts: 1,
      averageScore: 3.4,
      completionRate: 79,
      lastAttempt: new Date('2024-11-28'),
      subject: 'Biology'
    },
    {
      examId: 'bio-004',
      title: 'Ecology & Environmental Science',
      description: 'Practice exam focusing on ecosystem dynamics, energy flow, biogeochemical cycles, population dynamics, and human environmental impact.',
      duration: 88,
      questionCount: 44,
      difficulty: 'Medium',
      hasExplanatoryVideo: true,
      videoLength: 28,
      completed: false,
      attempts: 0,
      averageScore: 3.6,
      completionRate: 81,
      subject: 'Biology'
    },

    // AP Psychology (4 exams)
    {
      examId: 'psyc-001',
      title: 'Biological Psychology & Sensation',
      description: 'Foundational exam covering brain anatomy, neural communication, sensation and perception, consciousness, and biological bases of behavior.',
      duration: 80,
      questionCount: 40,
      difficulty: 'Easy',
      hasExplanatoryVideo: true,
      videoLength: 18,
      completed: true,
      score: 2,
      attempts: 2,
      averageScore: 2.8,
      completionRate: 68,
      lastAttempt: new Date('2024-12-08'),
      subject: 'Psychology'
    },
    {
      examId: 'psyc-002',
      title: 'Learning & Cognitive Psychology',
      description: 'Advanced practice on classical and operant conditioning, observational learning, memory systems, thinking, and problem-solving processes.',
      duration: 92,
      questionCount: 46,
      difficulty: 'Medium',
      hasExplanatoryVideo: true,
      videoLength: 32,
      completed: false,
      attempts: 0,
      averageScore: 3.1,
      completionRate: 73,
      subject: 'Psychology'
    },
    {
      examId: 'psyc-003',
      title: 'Developmental & Social Psychology',
      description: 'Comprehensive exam covering human development across the lifespan, social cognition, group behavior, and psychological disorders.',
      duration: 87,
      questionCount: 43,
      difficulty: 'Medium',
      hasExplanatoryVideo: false,
      completed: true,
      score: 3,
      attempts: 1,
      averageScore: 2.9,
      completionRate: 71,
      lastAttempt: new Date('2024-11-25'),
      subject: 'Psychology'
    },
    {
      examId: 'psyc-004',
      title: 'Abnormal Psychology & Treatment',
      description: 'Advanced practice on psychological disorders, diagnostic criteria, therapeutic approaches, research methods, and statistical analysis.',
      duration: 98,
      questionCount: 49,
      difficulty: 'Hard',
      hasExplanatoryVideo: true,
      videoLength: 45,
      completed: false,
      attempts: 0,
      averageScore: 3.3,
      completionRate: 77,
      subject: 'Psychology'
    }
  ];

  // Mock subjects data - Incomplete SAT tests only + AP courses (Updated for 2025.09.02 baseline)
  const subjects: Subject[] = [
    // Only show incomplete SAT practice tests
    {
      id: 'sat-test-4',
      name: 'SAT Practice Test 4',
      type: 'SAT',
      progress: 67, // 2 out of 3 sections completed
      totalChapters: 3, // Reading, Writing, Math sections
      completedChapters: 2,
      lastScore: undefined,
      icon: '📋',
      examDate: new Date('2025-09-05'),
      sectionProgress: {
        reading: {
          progress: 100,
          completed: true,
          score: 680
        },
        writing: {
          progress: 0,
          completed: false,
          score: undefined
        },
        math: {
          progress: 100,
          completed: true,
          score: 750
        }
      }
    },
    {
      id: 'sat-test-5',
      name: 'SAT Practice Test 5',
      type: 'SAT',
      progress: 33,
      totalChapters: 3,
      completedChapters: 1,
      lastScore: undefined,
      icon: '📋',
      examDate: new Date('2025-09-05'),
      sectionProgress: {
        reading: {
          progress: 100,
          completed: true,
          score: 710
        },
        writing: {
          progress: 0,
          completed: false,
          score: undefined
        },
        math: {
          progress: 0,
          completed: false,
          score: undefined
        }
      }
    },
    {
      id: 'sat-test-6',
      name: 'SAT Practice Test 6',
      type: 'SAT',
      progress: 100,
      totalChapters: 3,
      completedChapters: 3,
      lastScore: 1480,
      icon: '📋',
      examDate: new Date('2025-09-05'),
      sectionProgress: {
        reading: {
          progress: 100,
          completed: true,
          score: 720
        },
        writing: {
          progress: 100,
          completed: true,
          score: 760
        },
        math: {
          progress: 100,
          completed: true,
          score: 800
        }
      }
    },
    {
      id: 'sat-test-12',
      name: 'Official SAT Practice Test B',
      type: 'SAT',
      progress: 0,
      totalChapters: 3,
      completedChapters: 0,
      lastScore: undefined,
      icon: '📋',
      examDate: new Date('2025-09-05'),
      sectionProgress: {
        reading: {
          progress: 0,
          completed: false,
          score: undefined
        },
        writing: {
          progress: 0,
          completed: false,
          score: undefined
        },
        math: {
          progress: 0,
          completed: false,
          score: undefined
        }
      }
    },
    {
      id: 'sat-test-15',
      name: 'SAT Diagnostic Test',
      type: 'SAT',
      progress: 0,
      totalChapters: 3,
      completedChapters: 0,
      lastScore: undefined,
      icon: '📋',
      examDate: new Date('2025-09-05'),
      sectionProgress: {
        reading: {
          progress: 0,
          completed: false,
          score: undefined
        },
        writing: {
          progress: 0,
          completed: false,
          score: undefined
        },
        math: {
          progress: 0,
          completed: false,
          score: undefined
        }
      }
    },

    {
      id: 'ap-chemistry',
      name: 'AP Chemistry',
      type: 'AP',
      progress: 65,
      totalChapters: 12,
      completedChapters: 8,
      lastScore: 4,
      icon: '🧪',
      examDate: new Date('2025-10-15') // 1.5 months - low-medium priority
    },
    {
      id: 'ap-biology',
      name: 'AP Biology',
      type: 'AP',
      progress: 45,
      totalChapters: 15,
      completedChapters: 7,
      lastScore: 3,
      icon: '🧬',
      examDate: new Date('2025-11-10') // 2+ months - low-medium priority
    },

    {
      id: 'ap-psychology',
      name: 'AP Psychology',
      type: 'AP',
      progress: 35,
      totalChapters: 14,
      completedChapters: 5,
      lastScore: 2,
      icon: '🧠',
      examDate: new Date('2025-12-15') // 3+ months - medium priority
    }
  ];

  const handleLogin = (email: string, password: string) => {
    // Mock login - accept test@test.com / password
    if (email === 'test@test.com' && password === 'password') {
      const mockUser: User = {
        id: '1',
        email: 'test@test.com',
        name: 'Test Student'
      };
      setUser(mockUser);
      setCurrentPage('dashboard');
      return true;
    }
    return false;
  };

  const handleDevLogin = () => {
    // Dev mode - quick access to dashboard without authentication
    const mockUser: User = {
      id: 'dev-1',
      email: 'dev@etude.com',
      name: 'Dev User'
    };
    setUser(mockUser);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedSubject(null);
    setExamResult(null);
    setCurrentPage('landing');
  };

  const navigateToExam = (subject: Subject) => {
    setSelectedSubject(subject);
    // Check if it's SAT test - navigate to section select page first
    if (subject.type === 'SAT') {
      setCurrentPage('sat-section-select');
    } else {
      setCurrentPage('exam');
    }
  };

  const handleSATSectionStart = (section: string) => {
    if (section === 'detailed-results') {
      setCurrentPage('sat-detailed-results');
    } else if (section === 'full-test') {
      // Create a modified subject for the full test
      if (selectedSubject) {
        const fullTestSubject = {
          ...selectedSubject,
          name: `${selectedSubject.name} - Full Test`
        };
        setSelectedSubject(fullTestSubject);
        setCurrentPage('exam');
      }
    } else {
      // Create a modified subject for the specific section
      if (selectedSubject) {
        const sectionSubject = {
          ...selectedSubject,
          name: `${selectedSubject.name} - ${section.charAt(0).toUpperCase() + section.slice(1)}`
        };
        setSelectedSubject(sectionSubject);
        setCurrentPage('exam');
      }
    }
  };

  const handleExamComplete = (result: ExamResult) => {
    setExamResult(result);
    // Navigate to appropriate results page based on subject type
    if (selectedSubject?.type === 'SAT') {
      setCurrentPage('sat-results');
    } else {
      setCurrentPage('ap-results');
    }
  };

  const navigateToDashboardWithSection = (section: string) => {
    setActiveSection(section);
    setCurrentPage('dashboard');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={setCurrentPage} onDevLogin={handleDevLogin} />;
      case 'login':
        return <LoginPage onNavigate={setCurrentPage} onLogin={handleLogin} />;
      case 'signup':
        return <SignUpPage onNavigate={setCurrentPage} />;
      case 'forgot-password':
        return <ForgotPasswordPage onNavigate={setCurrentPage} />;
      case 'dashboard':
        return (
          <Dashboard
            user={user}
            subjects={subjects}
            apExams={apExams}
            onStartExam={navigateToExam}
            onLogout={handleLogout}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        );

      case 'sat-section-select':
        return (
          <SATSectionSelectPage
            selectedTest={selectedSubject}
            onNavigate={setCurrentPage}
            onStartSection={handleSATSectionStart}
            onNavigateToSATSection={() => navigateToDashboardWithSection('sat')}
          />
        );
      case 'sat-detailed-results':
        return (
          <SATDetailedResultsPage
            selectedTest={selectedSubject}
            onNavigate={setCurrentPage}
          />
        );
      case 'exam':
        return (
          <MockExamPage
            subject={selectedSubject}
            onExamComplete={handleExamComplete}
            onNavigate={setCurrentPage}
            onNavigateToSection={navigateToDashboardWithSection}
          />
        );
      case 'sat-results':
        return (
          <SATResultsPage
            result={examResult}
            subject={selectedSubject}
            onNavigate={setCurrentPage}
            onRetryExam={() => navigateToExam(selectedSubject!)}
          />
        );
      case 'ap-results':
        return (
          <APResultsPage
            result={examResult}
            subject={selectedSubject}
            onNavigate={setCurrentPage}
            onRetryExam={() => navigateToExam(selectedSubject!)}
          />
        );
      default:
        return <LandingPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      {renderCurrentPage()}
    </div>
  );
}