import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { KeyRound, Lock, Loader2, Key, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Lottie from "react-lottie-player";
import hackerAnimation from "../../../public/hacker-using-laptop.json";

const ResetCode = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || "";

    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validationSchema = Yup.object().shape({
        resetCode: Yup.string().required("Reset code is required"),
        newPassword: Yup.string()
            .min(6, "Password must be at least 6 characters")
            .required("New password is required"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
            .required("Confirm password is required"),
    });

    const formik = useFormik({
        initialValues: {
            resetCode: "",
            newPassword: "",
            confirmPassword: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            setApiError(null);

            try {
                await axios.post("https://studgo-hweme6ccepbvd6hs.canadacentral-01.azurewebsites.net/api/auth/reset-password", {
                    email,
                    resetCode: values.resetCode,
                    newPassword: values.newPassword,
                    confirmPassword: values.confirmPassword,
                });

                navigate("/login");
            } catch (error) {
                setApiError(error.response?.data?.message || "Something went wrong. Please try again.");
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <div className="container mx-auto px-4 py-[100px]">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
                        <div className="grid lg:grid-cols-2">
                            {/* Left Side - Form */}
                            <div className="p-8 lg:p-12">
                                <div className="flex items-center gap-2 mb-8">
                                    <button 
                                        onClick={() => navigate("/forget-password")}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                    </button>
                                    <h1 className="text-2xl font-bold text-white">Reset Password</h1>
                                </div>

                                <p className="text-gray-400 mb-8">
                                    Enter the reset code sent to your email and create a new password.
                                </p>

                                <form onSubmit={formik.handleSubmit} className="space-y-6">
                                    {/* Reset Code Field */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Reset Code
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Key className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                    formik.touched.resetCode && formik.errors.resetCode 
                                                        ? "border-red-500 focus:ring-red-500" 
                                                        : ""
                                                }`}
                                                placeholder="Enter reset code"
                                                {...formik.getFieldProps("resetCode")}
                                            />
                                        </div>
                                        {formik.touched.resetCode && formik.errors.resetCode && (
                                            <p className="mt-1 text-sm text-red-400">{formik.errors.resetCode}</p>
                                        )}
                                    </div>

                                    {/* New Password Field */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className={`w-full pl-10 pr-12 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                    formik.touched.newPassword && formik.errors.newPassword 
                                                        ? "border-red-500 focus:ring-red-500" 
                                                        : ""
                                                }`}
                                                placeholder="Enter new password"
                                                {...formik.getFieldProps("newPassword")}
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                        {formik.touched.newPassword && formik.errors.newPassword && (
                                            <p className="mt-1 text-sm text-red-400">{formik.errors.newPassword}</p>
                                        )}
                                    </div>

                                    {/* Confirm Password Field */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Confirm Password
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                className={`w-full pl-10 pr-12 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                    formik.touched.confirmPassword && formik.errors.confirmPassword 
                                                        ? "border-red-500 focus:ring-red-500" 
                                                        : ""
                                                }`}
                                                placeholder="Confirm new password"
                                                {...formik.getFieldProps("confirmPassword")}
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                            <p className="mt-1 text-sm text-red-400">{formik.errors.confirmPassword}</p>
                                        )}
                                    </div>

                                    {/* API Error Message */}
                                    {apiError && (
                                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                                            <p className="text-sm text-red-400">{apiError}</p>
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
                                                Resetting Password...
                                            </>
                                        ) : (
                                            <>
                                                <KeyRound className="h-5 w-5" />
                                                Reset Password
                                            </>
                                        )}
                                    </button>
                                </form>

                                {/* Back to Login */}
                                <div className="mt-8 text-center">
                                    <p className="text-gray-400">
                                        Remember your password?{" "}
                                        <button 
                                            onClick={() => navigate("/login")} 
                                            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                                        >
                                            Sign in
                                        </button>
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

export default ResetCode;
