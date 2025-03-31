import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from "../firebase";

const db = getFirestore(app);

export default function Registration() {
    const [rollNumber, setRollNumber] = useState("");
    const [year, setYear] = useState("");
    const [semester, setSemester] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");

        if (!year || !semester) {
            setError("Please select both Year and Semester");
            return;
        }

        try {
            const docRef = doc(db, 
                `Years/${year}/semesters/${semester}/students/${rollNumber}`);
            const docSnap = await getDoc(docRef);

            if(docSnap.exists()) {
                navigate(`/result/${year}/${semester}/${rollNumber}`);
            } else {
                setError("Student record not found. Please check your details.");
            }
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("An error occurred while searching. Please try again.");
        }
    };

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    alt="Your Company"
                    src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                    className="mx-auto h-10 w-auto"
                />
                <h2 className="mt-5 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                    Check your Result
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleSubmit} className="w-full flex flex-col py-4 space-y-4">
                    {/* Year Selection */}
                    <div>
                        <label htmlFor="year" className="block text-sm/6 md:text-[17px] font-medium text-gray-900">
                            Academic Year
                        </label>
                        <select
                            id="year"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-offset-1 outline-gray-300 focus:outline-2 focus:outline-offset-2 focus:outline-black sm:text-sm/6"
                            required
                        >
                            <option value="">Select Year</option>
                            <option value="2022-2026">2022-2026</option>
                            <option value="2021-2025">2021-2025</option>
                        </select>
                    </div>

                    {/* Semester Selection */}
                    <div>
                        <label htmlFor="semester" className="block text-sm/6 md:text-[17px] font-medium text-gray-900">
                            Semester
                        </label>
                        <select
                            id="semester"
                            value={semester}
                            onChange={(e) => setSemester(e.target.value)}
                            className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-offset-1 outline-gray-300 focus:outline-2 focus:outline-offset-2 focus:outline-black sm:text-sm/6"
                            required
                        >
                            <option value="">Select Semester</option>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                                <option key={num} value={num}>Semester {num}</option>
                            ))}
                        </select>
                    </div>

                    {/* Roll Number Input */}
                    <div>
                        <label htmlFor="rollNumber" className="block text-sm/6 md:text-[17px] font-medium text-gray-900">
                            Roll Number
                        </label>
                        <input
                            value={rollNumber}
                            onChange={(e) => setRollNumber(e.target.value)}
                            id="rollNumber"
                            name="rollNumber"
                            type="text"
                            required
                            autoComplete="off"
                            className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-offset-2 focus:outline-black sm:text-sm/6"
                        />
                    </div>

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-black px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                        >
                            Check Result
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}