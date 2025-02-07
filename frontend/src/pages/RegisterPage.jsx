// src/pages/RegisterPage.jsx
import { Link } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-[#212121] flex flex-col items-center justify-center">
      <RegisterForm />
      <p className="mt-4 text-white">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-500 hover:underline">
          Login here
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
