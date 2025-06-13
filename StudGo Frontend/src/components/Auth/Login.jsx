import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuthStore } from "../../store/authStore.js";
import { useState, useEffect } from "react";
import { Eye, EyeOff, Loader2, Mail, Lock, KeyRound } from "lucide-react";
import LogImg from "../../assets/auth.png";
import AuthImagePattern from "./AuthImagePattern.jsx";
import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
    const { handleLogin, handleGoogleLogin, apiError, loading } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const location = useLocation();
    const [error, setError] = useState(null);

    // Check for error parameters in URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const error = params.get('error');
        
        if (error === 'google_auth_failed') {
            toast.error('Google authentication failed. Please try again.');
        }
    }, [location]);

    // Function to handle Google login with popup
    const handleGoogleSignIn = () => {
        const redirectUri = `${window.location.origin}/google-callback.html`;
        
        const width = 500;
        const height = 600;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        const popup = window.open(
            redirectUri,
            'Google Sign-In',
            `width=${width},height=${height},left=${left},top=${top}`
        );

        window.addEventListener('message', async (event) => {
            if (event.origin !== window.location.origin) return;

            if (event.data.type === 'google-auth-token') {
                const token = event.data.token;
                try {
                    await handleGoogleLogin(token);
                } catch (error) {
                    console.error('Google login error:', error);
                    setError(error.message || 'Failed to sign in with Google');
                }
            } else if (event.data.type === 'google-auth-error') {
                setError('Google authentication failed: ' + event.data.error);
            }
        });

        // Check if popup was closed
        const checkPopup = setInterval(() => {
            if (popup.closed) {
                clearInterval(checkPopup);
            }
        }, 1000);
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string().required("Password is required"),
    });

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            await handleLogin({ ...values, rememberMe });
        },
    });

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
            {/* Left Side - Form */}
            <div className="flex flex-col justify-center items-center p-6 sm:p-12 overflow-y-auto">
                <div className="w-full max-w-md space-y-8">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="flex flex-col items-center gap-3 group">
                            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-all duration-300 transform group-hover:scale-105">
                                <KeyRound className="w-8 h-8 text-blue-400" />
                            </div>
                            <h1 className="text-3xl font-bold mt-2 text-gray-100 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
                                Welcome Back
                            </h1>
                            <p className="text-gray-400 text-lg">Sign in to your account</p>
                        </div>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-700"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-400">Or continue with</span>
                            </div>
                        </div>
                        <div className="mt-6">
                            <button
                                onClick={handleGoogleSignIn}
                                className="w-full inline-flex justify-center py-3 px-4 border border-gray-700 rounded-xl shadow-lg bg-gray-800/50 text-sm font-medium text-white hover:bg-gray-700/50 hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 hover:shadow-blue-500/20"
                            >
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Sign in with Google
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={formik.handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium text-gray-100">Email</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    className={`input-bordered w-full pl-10 bg-gray-800/50 text-gray-100 placeholder-gray-400 p-3 rounded-xl border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300 ${
                                        formik.touched.email && formik.errors.email ? "border-red-500" : ""
                                    }`}
                                    placeholder="you@example.com"
                                    {...formik.getFieldProps("email")}
                                />
                                {formik.touched.email && formik.errors.email && (
                                    <span className="text-sm text-red-400 mt-1">{formik.errors.email}</span>
                                )}
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium text-gray-100">Password</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className={`input-bordered w-full pl-10 bg-gray-800/50 text-gray-100 placeholder-gray-400 p-3 rounded-xl border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300 ${
                                        formik.touched.password && formik.errors.password ? "border-red-500" : ""
                                    }`}
                                    placeholder="••••••••"
                                    {...formik.getFieldProps("password")}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-blue-400 transition-colors" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-blue-400 transition-colors" />
                                    )}
                                </button>
                                {formik.touched.password && formik.errors.password && (
                                    <span className="text-sm text-red-400 mt-1">{formik.errors.password}</span>
                                )}
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-gray-300 cursor-pointer hover:text-blue-400 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="checkbox checkbox-primary bg-gray-800 border-gray-700"
                                />
                                Remember me
                            </label>
                            <Link to="/forget-password" className="text-blue-400 hover:text-blue-500 text-sm transition-colors">
                                Forgot password?
                            </Link>
                        </div>

                        {/* API Error Message */}
                        {apiError && (
                            <div className="p-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl">
                                {apiError}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="btn btn-primary w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-3 rounded-xl flex justify-center items-center gap-2 shadow-lg hover:shadow-blue-500/20 transition-all duration-300 transform hover:scale-[1.02]"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                "Sign in"
                            )}
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="text-center">
                        <p className="text-gray-400">
                            Don&apos;t have an account?{" "}
                            <Link to="/register" className="text-blue-400 hover:text-blue-500 font-medium transition-colors">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Image/Pattern */}
            <AuthImagePattern
                title={"Welcome back!"}
                subtitle={"Sign in to your account"}
                image={LogImg}
            />
        </div>
    );
};

export default Login;
