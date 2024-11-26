import React, { useState } from 'react'
import { useNavigate } from 'react-router';
import { fetchMemberId } from './apis/userGameData';

export const BeforeGame = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    level: '',
    });
  
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if(name === 'age' || name === 'level'){
          setFormData((prev) => ({
            ...prev,
            [name]: parseInt(value),
          }));
        }else{
          setFormData((prev) => ({
            ...prev,
            [name]: value,
          }));
        }
    };
    
    const handleProfileSubmit = async (e) => {
        e.preventDefault();

        const { name, age, gender, level } = formData;
        if (!name || !age || !gender || !level) {
          alert("Please fill out all fields before submitting.");
          return; // 제출 중단
        }

        console.log('Submitted Data:', formData);
        const result = await fetchMemberId(formData);
        console.log(`memberId : ${result.member_id}`)
        navigate(`/MemoryGame/${result.member_id}`)
        //navigate(`/MemoryGame/1`)
    };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center text-indigo-600">User Profile</h2>
        <form onSubmit={(e)=>handleProfileSubmit(e)} className="space-y-4">
          {/* Name Field */}
          <div className="flex items-center">
            <label htmlFor="name" className="w-24 font-semibold text-indigo-600">
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
              className="flex-grow px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
            />
          </div>

          {/* Age Field */}
          <div className="flex items-center">
            <label htmlFor="age" className="w-24 font-semibold text-indigo-600">
              Age:
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              placeholder="Enter your age"
              className="flex-grow px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
            />
          </div>

          {/* Gender Field */}
          <div className="flex items-center">
            <label htmlFor="gender" className="w-24 font-semibold text-indigo-600">
              Gender:
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="flex-grow px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
            >
              <option value="" disabled>
                Select gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

            {/* Level Field */}
            <div className="flex items-center">
            <label htmlFor="age" className="w-24 font-semibold text-indigo-600">
              Level:
            </label>
            <input
              type="number"
              id="level"
              name="level"
              value={formData.level}
              onChange={handleInputChange}
              placeholder="Enter your level"
              className="flex-grow px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-300"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
