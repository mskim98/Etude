import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "./useAuth";
import { loginSchema, signUpSchema, forgotPasswordSchema } from "../utils/validation";
import type { LoginFormData, SignUpFormData, ForgotPasswordFormData } from "../types/auth.types";

/**
 * 로그인 폼을 위한 커스텀 훅
 */
export const useLoginForm = () => {
	const { signIn, isLoading, error, clearError } = useAuth();

	const form = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data: LoginFormData) => {
		clearError();
		try {
			await signIn(data.email, data.password);
		} catch (error) {
			// Error is handled by the store
		}
	};

	return {
		form,
		onSubmit: form.handleSubmit(onSubmit),
		isLoading,
		error,
	};
};

/**
 * 회원가입 폼을 위한 커스텀 훅
 */
export const useSignUpForm = () => {
	const { signUp, isLoading, error, clearError } = useAuth();

	const form = useForm<SignUpFormData>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
			name: "",
			university: "",
			major: "",
			role: "student",
		},
	});

	const onSubmit = async (data: SignUpFormData) => {
		clearError();
		try {
			await signUp(data);
		} catch (error) {
			// Error is handled by the store
		}
	};

	return {
		form,
		onSubmit: form.handleSubmit(onSubmit),
		isLoading,
		error,
	};
};

/**
 * 비밀번호 재설정 폼을 위한 커스텀 훅
 */
export const useForgotPasswordForm = () => {
	const { resetPassword, isLoading, error, clearError } = useAuth();

	const form = useForm<ForgotPasswordFormData>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: "",
		},
	});

	const onSubmit = async (data: ForgotPasswordFormData) => {
		clearError();
		try {
			await resetPassword(data.email);
		} catch (error) {
			// Error is handled by the store
		}
	};

	return {
		form,
		onSubmit: form.handleSubmit(onSubmit),
		isLoading,
		error,
	};
};
