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
    <div className='w-full h-screen bg-gray-200 flex justify-center items-center'>
        <div className='h-[50%] md:w-[40%] w-[80%] flex items-center justify-center'>
             <div className='h-[90%] w-[90%]'>
               <h1 className='md:text-5xl text-3xl font-bold'>Admin Login</h1>
                    {error ? <p className='p-3 bg-red-400 my-2'>{error}</p> : null}
                    <form onSubmit={handleSubmit} className='w-full flex flex-col py-4'>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            className='md:p-3 md:my-6 p-1 my-2 rounded-md border-[1px]'
                            type='email'
                            placeholder='Email'
                            autoComplete='email'
                        />
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            className='md:p-3 md:my-5 p-1 my-5 rounded-md border-[1px]'
                            type='password'
                            placeholder='Password'
                            autoComplete='current-password'
                        />
                        <button className='bg-black text-white md:py-3 md:my-6 p-1 my-3 rounded-md font-bold'>
                            Login
                        </button>
                    </form>
             </div>
        </div>
    </div>
  );
};

export default Login;