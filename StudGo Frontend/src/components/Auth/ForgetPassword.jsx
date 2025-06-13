import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import axios from "axios";
import { Mail, Loader2, KeyRound, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Lottie from "react-lottie-player";
import hackerAnimation from "../../assets/hacker-using-laptop.json";

const ForgetPassword = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [apiError, setApiError] = useState(null);
    const navigate = useNavigate();

    const validationSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email").required("Email is required"),
    });

    const formik = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            setMessage(null);
            setApiError(null);

            try {
                const response = await axios.post(
                    "https://studgo-hweme6ccepbvd6hs.canadacentral-01.azurewebsites.net/api/auth/forgot-password",
                    values
                );
                navigate("/reset-code", { state: { email: values.email } });
                setMessage(response.data.message || "Password reset instructions sent to your email.");
            } catch (error) {
                setApiError(
                    error.response?.data?.message || "Something went wrong. Please try again."
                );
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <div className="container mx-auto px-4 py-[200px]">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
                        <div className="grid lg:grid-cols-2">
                            {/* Left Side - Form */}
                            <div className="p-8 lg:p-12">
                                <div className="flex items-center gap-2 mb-8">
                                    <button 
                                        onClick={() => navigate("/login")}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                    </button>
                                    <h1 className="text-2xl font-bold text-white">Forgot Password</h1>
                                </div>
                                
                                <p className="text-gray-400 mb-8">
                                    Enter your email address and we'll send you instructions to reset your password.
                                </p>

                                <form onSubmit={formik.handleSubmit} className="space-y-6">
                                    {/* Email Field */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Mail className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="email"
                                                className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                    formik.touched.email && formik.errors.email 
                                                        ? "border-red-500 focus:ring-red-500" 
                                                        : ""
                                                }`}
                                                placeholder="you@example.com"
                                                {...formik.getFieldProps("email")}
                                            />
                                        </div>
                                        {formik.touched.email && formik.errors.email && (
                                            <p className="mt-1 text-sm text-red-400">{formik.errors.email}</p>
                                        )}
                                    </div>

                                    {/* API Error Message */}
                                    {apiError && (
                                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                                            <p className="text-sm text-red-400">{apiError}</p>
                                        </div>
                                    )}

                                    {/* Success Message */}
                                    {message && (
                                        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                                            <p className="text-sm text-green-400">{message}</p>
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                Sending Reset Link...
                                            </>
                                        ) : (
                                            <>
                                                <KeyRound className="h-5 w-5" />
                                                Send Reset Link
                                            </>
                                        )}
                                    </button>
                                </form>

                                {/* Back to Login Link */}
                                <div className="mt-8 text-center">
                                    <p className="text-gray-400">
                                        Remember your password?{" "}
                                        <Link 
                                            to="/login" 
                                            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                                        >
                                            Sign in
                                        </Link>
                                    </p>
                                </div>
                            </div>

                            {/* Right Side - Animation */}
                            <div className="hidden lg:block bg-gray-800/30 p-8">
                                <div className="h-full flex items-center justify-center">
                                    <Lottie 
                                        animationData={hackerAnimation} 
                                        loop 
                                        play 
                                        className="w-full h-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgetPassword;
