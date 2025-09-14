"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Zap } from "lucide-react";

interface LandingPageProps {
	onNavigate: (page: "login" | "signup") => void;
	onDevLogin: () => void;
}

export function LandingPage({ onNavigate, onDevLogin }: LandingPageProps) {
	return (
		<div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
			<Card className="w-full max-w-md border-0 shadow-lg">
				<CardContent className="p-8 text-center">
					{/* Logo */}
					<div className="flex items-center justify-center space-x-2 mb-8">
						<div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
							<BookOpen className="w-7 h-7 text-white" />
						</div>
						<span className="text-2xl font-semibold text-gray-900">ETUDE</span>
					</div>

					{/* Title */}
					<h1 className="text-2xl font-semibold text-gray-900 mb-4">디버깅용 랜딩 페이지</h1>
					<p className="text-gray-600 mb-8">개발 및 테스트를 위한 간단한 랜딩 페이지입니다.</p>

					{/* Buttons */}
					<div className="space-y-4">
						{/* Dev Mode Button */}
						<Button
							onClick={onDevLogin}
							className="w-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center space-x-2"
						>
							<Zap className="w-4 h-4" />
							<span>Dev Mode</span>
						</Button>

						{/* Login Button */}
						<Button variant="outline" onClick={() => onNavigate("login")} className="w-full">
							Login
						</Button>

						{/* Signup Button */}
						<Button onClick={() => onNavigate("signup")} className="w-full">
							Signup
						</Button>
					</div>

					{/* Debug Info */}
					<div className="mt-8 p-4 bg-gray-50 rounded-lg">
						<p className="text-sm text-gray-500">
							<strong>디버깅 정보:</strong>
							<br />
							• Dev Mode: 로그인 없이 LMS 접근
							<br />
							• Login: 기존 사용자 로그인
							<br />• Signup: 새 사용자 회원가입
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
