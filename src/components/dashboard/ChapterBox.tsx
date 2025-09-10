"use client";
import React from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { 
  HelpCircle, 
  FileText, 
  Play, 
  CheckCircle, 
  Clock,
  Star,
  ChevronRight
} from "lucide-react";

export interface ChapterBoxProps {
  chapterNumber: number;
  title: string;
  mcqCount: number;
  frqCount: number;
  hasVideo: boolean;
  completed: boolean;
  score?: number;
  timeSpent?: number; // in minutes
  difficulty: "Easy" | "Medium" | "Hard";
  reviewCompleted?: boolean;
  className?: string;
}

export function ChapterBox({
  chapterNumber,
  title,
  mcqCount,
  frqCount,
  hasVideo,
  completed,
  score,
  timeSpent,
  difficulty,
  reviewCompleted = false,
  className
}: ChapterBoxProps) {
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "Easy":
        return "bg-green-100 text-green-800 border-green-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Hard":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card 
      className={`transition-all shadow-sm ${className}`}
      style={{ 
        backgroundColor: completed 
          ? "var(--color-card-completed-bg)" 
          : "var(--color-card-default-bg)",
        border: "1px solid var(--color-card-border)"
      }}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start space-x-3 flex-1">
            <div 
              className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold text-sm ${
                completed 
                  ? "bg-green-500 text-white" 
                  : "text-white"
              }`}
              style={{ 
                backgroundColor: completed ? "#10B981" : "#4A9FCC"
              }}
            >
              {completed ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                chapterNumber
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm mb-1 min-h-[3.75rem] flex items-start">
                <span className="line-clamp-3">Chapter {chapterNumber}: {title}</span>
              </h3>
            </div>
          </div>
          
          {/* Badges moved to top-right corner */}
          <div className="flex flex-col items-end space-y-1 ml-2">
            <Badge 
              variant="outline" 
              className={`text-xs ${getDifficultyColor(difficulty)}`}
            >
              {difficulty}
            </Badge>
            {completed && (
              <div className="flex items-center space-x-1 text-green-600 text-xs">
                <CheckCircle className="w-3 h-3" />
                <span>Completed</span>
              </div>
            )}
          </div>
        </div>

        {/* Content boxes */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {/* MCQ Box */}
          <div 
            className="p-2 rounded border text-center hover:shadow-sm/50 transition-all cursor-pointer"
            style={{ backgroundColor: "#F0F8FF", borderColor: "#4A9FCC40" }}
          >
            <HelpCircle className="w-4 h-4 mx-auto mb-1 cursor-pointer" style={{ color: "#4A9FCC" }} />
            <div className="text-xs font-semibold text-gray-900 cursor-pointer">{mcqCount} MCQ</div>
            <div className="text-xs text-gray-600 cursor-pointer">Multiple Choice</div>
          </div>

          {/* FRQ Box */}
          <div 
            className="p-2 rounded border text-center hover:shadow-sm/50 transition-all cursor-pointer"
            style={{ backgroundColor: "#F0FFF8", borderColor: "#6BB6C740" }}
          >
            <FileText className="w-4 h-4 mx-auto mb-1 cursor-pointer" style={{ color: "#6BB6C7" }} />
            <div className="text-xs font-semibold text-gray-900 cursor-pointer">{frqCount} FRQ</div>
            <div className="text-xs text-gray-600 cursor-pointer">Free Response</div>
          </div>

          {/* Video Box */}
          <div 
            className={`p-2 rounded border text-center transition-all ${
              hasVideo 
                ? "hover:shadow-sm/50 cursor-pointer" 
                : "opacity-50 cursor-not-allowed"
            }`}
            style={{ 
              backgroundColor: hasVideo ? "#FFF8F0" : "#F5F5F5", 
              borderColor: hasVideo ? "#8CC7D340" : "#E5E5E5" 
            }}
          >
            <Play className={`w-4 h-4 mx-auto mb-1 ${hasVideo ? "cursor-pointer" : "cursor-not-allowed"}`} style={{ 
              color: hasVideo ? "#8CC7D3" : "#9CA3AF" 
            }} />
            <div className={`text-xs font-semibold text-gray-900 ${hasVideo ? "cursor-pointer" : "cursor-not-allowed"}`}>
              {hasVideo ? "Video" : "No Video"}
            </div>
            <div className={`text-xs text-gray-600 ${hasVideo ? "cursor-pointer" : "cursor-not-allowed"}`}>
              {hasVideo ? "Solutions" : "Coming Soon"}
            </div>
          </div>
        </div>

        {/* Review Test Button with states */}
        <div className="pt-2 border-t border-gray-100">
          <Button 
            size="sm" 
            variant={reviewCompleted ? "outline" : "default"}
            className="h-6 px-2 text-xs w-full"
          >
            {reviewCompleted ? "After Viewing" : "Before Viewing"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}