import React from 'react';

const HireMe = () => {
  return (
    <div className="max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Hire Me!</h1>
      <p className="mb-4 text-center">
        I am a skilled developer with extensive experience in React Native, the MERN stack, and modern web technologies. I am passionate about building scalable applications and have a proven track record of delivering high-quality solutions. I am eager to bring my expertise to your team and contribute to exciting new projects.
      </p>
      <div className="text-center">
        <p className="mb-2"><strong>Email:</strong> <a href="mailto:code.kapish@gmail.com" className="text-blue-500 hover:underline">code.kapish@gmail.com</a></p>
        <p className="mb-2"><strong>Phone:</strong> <a href="tel:+918707559369" className="text-blue-500 hover:underline">+91 8707559369</a></p>
        <p className="mb-2"><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/kapishsingh33/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">linkedin.com/in/kapishsingh33</a></p>
        <p className="mb-2"><strong>GitHub:</strong> <a href="https://github.com/kapish33" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">github.com/kapish33</a></p>
      </div>
    </div>
  );
};

export default HireMe;
