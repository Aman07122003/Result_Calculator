import React, { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('')
  const { logIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('')
    try {
      await logIn(email, password)
      navigate('/admin')
    } catch (error) {
      if(error instanceof Error) {
        setError(error.message);
      }
    }
  };

  return (
    <div className='w-full h-screen bg-gradient-to-br from-gray-900 to-gray-800  flex justify-center items-center'>
        <div className='h-[50%] md:w-[40%] w-[80%] flex items-center justify-center'>
             <div className='h-[90%] w-[90%]'>
               <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-400 to-indigo-600 bg-clip-text text-transparent'>Admin Login</h1>
                    {error ? <p className='p-3 bg-red-400 my-2'>{error}</p> : null}
                    <form onSubmit={handleSubmit} className='w-full flex flex-col py-4'>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            className='md:p-3 md:my-6 p-1 my-2 text-gray-300 bg-gray-700 bg-gra rounded-md border border-gray-700'
                            type='email'
                            placeholder='Email'
                            autoComplete='email'
                        />
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            className='md:p-3 md:my-5 text-gray-300 p-1 my-5 rounded-md bg-gray-700 border border-gray-700'
                            type='password'
                            placeholder='Password'
                            autoComplete='current-password'
                        />
                        <button className='w-full px-6 py-3 bg-gradient-to-r from-green-400 to-indigo-600 text-white font-extrabold md:text-xl rounded-lg hover:shadow-lg transition-all'>
                            Login
                        </button>
                    </form>
             </div>
        </div>
    </div>
  );
};

export default Login;