"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { BookOpen, Video, Trophy, Target, Users, Award, ArrowRight, CheckCircle, Zap } from "lucide-react";

interface LandingPageProps {
  onNavigate: (page: "login" | "signup") => void;
  onDevLogin: () => void;
}

export function LandingPage({ onNavigate, onDevLogin }: LandingPageProps) {
  const features = [
    {
      icon: BookOpen,
      title: "Chapter Questions",
      description: "Practice with thousands of AP and SAT questions organized by chapters and topics."
    },
    {
      icon: Video,
      title: "Solution Videos",
      description: "Watch detailed solution explanations from expert instructors for every question."
    },
    {
      icon: Trophy,
      title: "Mock Exams",
      description: "Take full-length practice tests in a real exam environment with BlueBook interface."
    },
    {
      icon: Target,
      title: "Score Analysis",
      description: "Get detailed performance insights and personalized recommendations for improvement."
    }
  ];

  const stats = [
    { number: "50,000+", label: "Practice Questions" },
    { number: "95%", label: "Student Success Rate" },
    { number: "4.8/5", label: "Average Student Rating" },
    { number: "15+", label: "Subjects Available" }
  ];

  const subjects = [
    { name: "AP Chemistry", icon: "🧪", color: "bg-blue-50" },
    { name: "AP Biology", icon: "🧬", color: "bg-green-50" },
    { name: "SAT Math", icon: "📊", color: "bg-purple-50" },
    { name: "SAT English", icon: "📝", color: "bg-orange-50" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">ETUDE</span>
          </div>
          <div className="flex items-center space-x-4">
            {/* Dev Mode Button - Quick access to LMS without login */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={onDevLogin}
              className="border-orange-300 text-orange-600 hover:bg-orange-50 flex items-center space-x-2"
            >
              <Zap className="w-4 h-4" />
              <span>Dev Mode</span>
            </Button>
            
            <Button variant="ghost" onClick={() => onNavigate("login")}>
              Login
            </Button>
            <Button onClick={() => onNavigate("signup")}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-4xl lg:text-5xl font-semibold mb-6 leading-tight">
                Master AP & SAT Exams with Confidence
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Comprehensive learning platform with chapter-based practice, video solutions, 
                and BlueBook-style mock exams for AP Chemistry, Biology, and SAT preparation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50" onClick={() => onNavigate("signup")}>
                  Start Learning Today
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" onClick={() => onNavigate("login")}>
                  Login to Continue
                </Button>
              </div>
              <div className="flex items-center space-x-6 text-blue-100">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Free practice questions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Expert video solutions</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1641683521844-700c456379bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHN0dWR5aW5nJTIwZWR1Y2F0aW9ufGVufDF8fHx8MTc1NjYzMzM5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Students studying"
                className="w-full h-96 object-cover rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-semibold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform provides all the tools and resources you need to excel in your AP and SAT exams.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">
              Available Subjects
            </h2>
            <p className="text-xl text-gray-600">
              Start with our core subjects, with more coming soon
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {subjects.map((subject, index) => (
              <Card key={index} className={`border-0 shadow-lg hover:shadow-xl transition-all hover:scale-105 ${subject.color}`}>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{subject.icon}</div>
                  <h3 className="font-semibold text-gray-900">{subject.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-semibold mb-4">
            Ready to Start Your Success Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students who have improved their scores with ETUDE
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50" onClick={() => onNavigate("signup")}>
              Create Free Account
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" onClick={() => onNavigate("login")}>
              Already have an account?
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">ETUDE</span>
          </div>
          <p className="text-sm">
            © 2025 ETUDE. All rights reserved. Empowering students to achieve their academic goals.
          </p>
        </div>
      </footer>
    </div>
  );
}