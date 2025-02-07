// src/pages/LoginPage.jsx
import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginFrom';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-[#212121] flex flex-col items-center justify-center">
      <LoginForm />
      <p className="mt-4 text-white">
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-500 hover:underline">
          Register here
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;