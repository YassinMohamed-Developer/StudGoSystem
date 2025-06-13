import { createBrowserRouter, Navigate, RouterProvider, useNavigate, Outlet } from 'react-router-dom';
import './App.css'

import Login from './components/Auth/Login.jsx';
import NotFound from './components/Auth/NotFound.jsx';
import UnAuthorize from './components/Auth/UnAuthorize.jsx';
import Register from './components/Auth/Register.jsx';
import Home from './components/student/pages/Home.jsx';
import Layout from './components/student/Layout.jsx';
import ProtectedRoute from './components/Auth/ProtectedRoute.jsx';
import StudentActivityHome from './components/student/pages/StudentActivityHome .jsx';
import { useAuthStore } from './store/authStore.js';
import StudentActivityDetails from './components/student/pages/StudentActivityDetails.jsx';
import SAHome from './components/SA/pages/SAHome.jsx';
import SaTeams from './components/SA/pages/SaTeams.jsx';
import SaActivities from './components/SA/pages/SaActivities.jsx';
import ActivitySADetails from './components/SA/pages/ActivitySADetails.jsx';
import SaFollowers from './components/SA/pages/SaFollowers.jsx';
import SaReports from './components/SA/pages/SaReports.jsx';
import SaProfile from './components/SA/pages/SaProfile.jsx';
import SaDashboard from './components/SA/pages/SaDashboard.jsx';
import { QueryClient, QueryClientProvider } from 'react-query';
import {Toaster} from 'react-hot-toast'
import ForgotPassword from './components/Auth/ForgetPassword.jsx';
import ResetCode from './components/Auth/RestCode.jsx';
import Profile from './components/student/pages/profile.jsx';
import Activities from './components/student/pages/Activities.jsx';
import ActivityDetails from './components/student/pages/ActivityDetails.jsx';
import Calendar from './components/student/pages/Calendar.jsx';
import Internships from './components/student/pages/Internships.jsx';

import GoogleCallback from './components/Auth/GoogleCallback';
import { useEffect } from 'react';
import FollowedStudentActivities from './components/student/pages/FollowedStudentActivities.jsx';

function AuthRoute({ children }) {
  const { currentUser } = useAuthStore();

  if (currentUser) {
    return <Navigate to={currentUser.role === "StudentActivity" ? "/student-activity" : "/"} replace />;
  }

  return children;
}

function NavigationSetup() {
  const navigate = useNavigate();
  const { setNavigate } = useAuthStore();

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate, setNavigate]);

  return null;
}

function App() {
  const mainRoutes = {
    path: '',
    element: <Layout />,
    children: [
      { index: true, element: <ProtectedRoute requiredRole="Student"><Home /></ProtectedRoute> },
      { path: 'student-activities', element: <ProtectedRoute requiredRole="Student"><StudentActivityHome /></ProtectedRoute> },
      { path: 'profile', element: <ProtectedRoute requiredRole="Student"><Profile /></ProtectedRoute> },
      { path: 'calendar', element: <ProtectedRoute requiredRole="Student"><Calendar /></ProtectedRoute> },
      { path: 'activities', element: <ProtectedRoute requiredRole="Student"><Activities /></ProtectedRoute> },
      { path: 'followed-activities', element: <ProtectedRoute requiredRole="Student"><FollowedStudentActivities /></ProtectedRoute> },
      { path: 'interns', element: <ProtectedRoute requiredRole="Student"><Internships /></ProtectedRoute> },
      { path: 'studentactivity/:id', element: <ProtectedRoute requiredRole="Student"><StudentActivityDetails /></ProtectedRoute> },
      { path: 'activities/:id', element: <ProtectedRoute requiredRole="Student"><ActivityDetails /></ProtectedRoute> },
    ],
  };

  const studentActivityRoutes = {
    path: 'student-activity',
    element: <ProtectedRoute requiredRole="StudentActivity"><SAHome /></ProtectedRoute>,
    children: [
      { index: true, element: <SaDashboard /> },
      { path: 'dashboard', element: <SaDashboard /> },
      { path: 'activities', element: <SaActivities /> },
      { path: 'activities/:id', element: <ActivitySADetails /> },
      { path: 'teams', element: <SaTeams /> },
      { path: 'followers', element: <SaFollowers /> },
      { path: 'reports', element: <SaReports /> },
      { path: 'profile', element: <SaProfile /> },
    ],
  };

  const authRoutes = [
    { path: '*', element: <NotFound /> },  
    { path: '/unauthorized', element: <UnAuthorize /> }, 
    { path: 'register', element: <AuthRoute><Register /></AuthRoute> },
    { path: 'login', element: <AuthRoute><Login /></AuthRoute> },
    { path: '', element: <AuthRoute><Login /></AuthRoute> },
    { path: 'forget-password', element: <AuthRoute><ForgotPassword /></AuthRoute> },
    { path: 'reset-code', element: <AuthRoute><ResetCode /></AuthRoute> },
    { path: 'auth/google/callback', element: <GoogleCallback /> }
  ];

  const routes = createBrowserRouter([
    {
      path: '/',
      element: (
        <>
          <NavigationSetup />
          <Outlet />
        </>
      ),
      children: [
        mainRoutes,
        studentActivityRoutes,
        ...authRoutes,
      ],
    },
  ]);

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={routes} />
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}

export default App;
