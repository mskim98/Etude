"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { debugAuthState } from "@/lib/debug-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AuthCallbackPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [progress, setProgress] = useState("인증 페이지 로드 중...");

	useEffect(() => {
		const handleAuthCallback = async (): Promise<(() => void) | undefined> => {
			let mounted = true;
			let subscription: any = null;

			try {
				console.log("Auth callback page loaded");
				setProgress("URL 매개변수 확인 중...");

				// Check URL for errors first
				const urlParams = new URLSearchParams(window.location.search);
				const hashParams = new URLSearchParams(window.location.hash.substring(1));

				const errorParam = urlParams.get("error") || hashParams.get("error");
				const errorDescription = urlParams.get("error_description") || hashParams.get("error_description");

				if (errorParam) {
					console.error("URL contains error:", errorParam, errorDescription);
					if (mounted) {
						setError(`인증 오류: ${errorDescription || errorParam}`);
						setLoading(false);
					}
					return;
				}

				setProgress("인증 상태 모니터링 설정 중...");

				// Function to check and handle user profile
				const handleUserProfile = async (userId: string, userEmail: string) => {
					console.log("Checking profile for user:", userEmail);

					// Debug current auth state
					await debugAuthState();

					// Try multiple times with longer waits
					for (let attempt = 1; attempt <= 15; attempt++) {
						console.log(`Profile check attempt ${attempt}/15`);

						try {
							const { data: profile, error: profileError } = await supabase
								.from("profile")
								.select("*")
								.eq("id", userId)
								.single();

							if (profile) {
								console.log("Profile found:", profile);
								if (mounted) {
									if (subscription) subscription.unsubscribe();
									router.push("/dashboard");
								}
								return true;
							}

							if (profileError && profileError.code !== "PGRST116") {
								console.error("Profile error (not PGRST116):", profileError);
								// Don't break on other errors, keep trying
							}

							// Progressive wait times: 1s, 2s, 3s, then 2s for remaining attempts
							const waitTime = attempt <= 3 ? attempt * 1000 : 2000;
							console.log(`Profile not found, waiting ${waitTime}ms before retry...`);
							await new Promise((resolve) => setTimeout(resolve, waitTime));
						} catch (error) {
							console.error(`Profile check attempt ${attempt} failed:`, error);
							await new Promise((resolve) => setTimeout(resolve, 1000));
						}
					}

					console.error("Profile not found after all attempts");
					if (mounted) {
						setError("프로필을 찾을 수 없습니다. 인증은 완료되었을 수 있으니 대시보드를 확인해보세요.");
						setLoading(false);
					}
					return false;
				};

				// Set up auth state listener
				const {
					data: { subscription: authSubscription },
				} = supabase.auth.onAuthStateChange(async (event, session) => {
					console.log("Auth event:", event, session?.user?.email);

					if (!mounted) return;

					if (event === "SIGNED_IN" && session?.user) {
						console.log("User signed in via auth state change");
						await handleUserProfile(session.user.id, session.user.email!);
					} else if (event === "SIGNED_OUT") {
						console.log("User signed out");
						setError("인증이 취소되었습니다.");
						setLoading(false);
						if (subscription) subscription.unsubscribe();
					}
				});

				subscription = authSubscription;

				// Small delay to allow any auth processing to complete
				setProgress("세션 상태 확인 중...");
				await new Promise((resolve) => setTimeout(resolve, 2000));

				// Check for existing session
				const {
					data: { session },
					error: sessionError,
				} = await supabase.auth.getSession();

				if (sessionError) {
					console.error("Session error:", sessionError);
					if (mounted) {
						setError(`세션 오류: ${sessionError.message}`);
						setLoading(false);
					}
					if (subscription) subscription.unsubscribe();
					return;
				}

				// If user is already authenticated, handle it immediately
				if (session?.user) {
					console.log("Session already exists for:", session.user.email);
					await handleUserProfile(session.user.id, session.user.email!);
				} else {
					// No session yet, try to force session detection
					console.log("No session found, attempting alternative approaches...");
					setProgress("세션을 찾을 수 없음, 대체 방법 시도 중...");

					// Try multiple times to get session with different approaches
					let sessionFound = false;
					for (let i = 0; i < 5; i++) {
						setProgress(`세션 검색 중... (${i + 1}/5)`);
						console.log(`Session detection attempt ${i + 1}/5`);

						// Wait a bit
						await new Promise((resolve) => setTimeout(resolve, 2000));

						// Try to get session again
						const {
							data: { session: retrySession },
						} = await supabase.auth.getSession();

						if (retrySession?.user) {
							console.log("Session found on retry:", retrySession.user.email);
							sessionFound = true;
							await handleUserProfile(retrySession.user.id, retrySession.user.email!);
							break;
						}

						// Also try refreshing
						if (i === 2) {
							console.log("Attempting session refresh...");
							try {
								await supabase.auth.refreshSession();
							} catch (refreshError) {
								console.log("Refresh failed:", refreshError);
							}
						}
					}

					if (!sessionFound) {
						console.log("No session found after all attempts, setting timeout...");
						setProgress("인증이 완료되었을 가능성이 높습니다. 잠시 후 자동으로 대시보드로 이동합니다...");

						// Final timeout - automatically redirect to dashboard
						setTimeout(() => {
							if (mounted && loading) {
								console.log("Final timeout reached, redirecting to dashboard...");
								// Try one more debug before redirecting
								debugAuthState().then(() => {
									console.log("Auto-redirecting to dashboard...");
									router.push("/dashboard");
								});
							}
						}, 8000); // 8 second auto-redirect
					}
				}

				// Cleanup function
				return () => {
					mounted = false;
					if (subscription) subscription.unsubscribe();
				};
			} catch (err) {
				console.error("Unexpected error in auth callback:", err);
				if (mounted) {
					setError("예상치 못한 오류가 발생했습니다.");
					setLoading(false);
				}
				if (subscription) subscription.unsubscribe();
				return () => {
					mounted = false;
					if (subscription) subscription.unsubscribe();
				};
			}
		};

		handleAuthCallback().then((cleanup) => {
			// Store cleanup function for later use
			if (cleanup) {
				// Cleanup will be called when component unmounts
				return cleanup;
			}
		});

		return () => {
			// Cleanup is handled within the async function
		};
	}, [router]);

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-6">
				<Card className="w-full max-w-md border-0 shadow-lg">
					<CardContent className="p-8 text-center">
						<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
							<div className="w-8 h-8 bg-blue-500 rounded-full animate-pulse"></div>
						</div>
						<h2 className="text-xl font-semibold text-gray-900 mb-2">인증 처리 중...</h2>
						<p className="text-gray-600 mb-4">{progress}</p>

						{/* Show manual option after some time */}
						<div className="mt-6 space-y-3">
							<Button onClick={() => router.push("/dashboard")} variant="outline" className="w-full">
								대시보드로 직접 이동
							</Button>
							<Button
								onClick={() => {
									console.log("=== MANUAL DEBUG DURING LOADING ===");
									debugAuthState();
								}}
								variant="ghost"
								size="sm"
								className="w-full text-xs"
							>
								디버그 정보 확인
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-6">
				<Card className="w-full max-w-md border-0 shadow-lg">
					<CardContent className="p-8 text-center">
						<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
							<div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
								<span className="text-white text-lg">✕</span>
							</div>
						</div>
						<h2 className="text-xl font-semibold text-gray-900 mb-2">인증 실패</h2>
						<Alert className="mb-6 bg-red-50 border-red-200">
							<AlertDescription className="text-red-800">{error}</AlertDescription>
						</Alert>
						<div className="space-y-3">
							<Button onClick={() => router.push("/dashboard")} className="w-full">
								대시보드로 이동
							</Button>
							<Button onClick={() => router.push("/auth/login")} variant="outline" className="w-full">
								로그인 페이지로 이동
							</Button>
							<Button onClick={() => window.location.reload()} variant="outline" className="w-full">
								새로고침
							</Button>
							<Button
								onClick={() => {
									console.log("=== MANUAL DEBUG ===");
									debugAuthState().then(() => {
										console.log("Debug completed. Check console for details.");
									});
								}}
								variant="outline"
								size="sm"
								className="w-full text-xs"
							>
								디버그 정보 출력 (콘솔 확인)
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return null;
}
