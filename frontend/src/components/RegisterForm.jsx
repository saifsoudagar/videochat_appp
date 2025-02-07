import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const interestsList = ["Technology", "Sports", "Music", "Art", "Travel"];

const RegisterForm = () => {
  const [formData, setFormData] = useState({ username: "", password: "", interests: [] });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", formData);
      navigate("/chat");
    } catch (err) {
      setError("Registration failed - username might be taken");
    }
  };

  const toggleInterest = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  return (
    <div className="max-w-md mx-auto py-8 px-8 bg-[#1e1e24] rounded-lg shadow-xl text-white">
      <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 border rounded-full bg-[#2a2a33] text-white border-gray-600 focus:border-blue-400 focus:outline-none"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-full bg-[#2a2a33] text-white border-gray-600 focus:border-blue-400 focus:outline-none"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>
        
        <div className="space-y-3">
          <label className="block font-medium text-gray-300">Select Interests:</label>
          <div className="grid grid-cols-2 gap-3">
            {interestsList.map((interest) => (
              <button
                key={interest}
                type="button"
                className={`py-2 px-4 rounded-full font-medium transition-all duration-200 text-sm 
                  ${formData.interests.includes(interest) 
                    ? "bg-blue-600 text-white shadow-lg transform scale-105" 
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
                onClick={() => toggleInterest(interest)}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        
        <button 
          type="submit" 
          className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 active:scale-95 transition-all duration-200 px-6 py-3 rounded-full text-white font-semibold shadow-lg hover:shadow-blue-500/50"
        >
          Create Account
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
