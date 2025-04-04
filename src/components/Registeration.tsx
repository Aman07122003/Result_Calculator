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
        <div className="relative w-[100%] max-w-md bg-gray-800/30 rounded-2xl shadow-2xl border border-gray-700/30 p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Year Selection */}
                <div className="space-y-2">
                    <label htmlFor="year" className="block md:text-lg font-medium text-gray-300">
                        Academic Year
                    </label>
                    <select
                        id="year"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full text-gray-500 px-4 py-2.5 bg-gray-700/30 border border-gray-600/30 rounded-lg focus:ring-2 focus:ring-indigo-400 transition-all"
                        required
                    >
                        <option value="">Select Year</option>
                        <option value="2022-2026">2022-2026</option>
                        <option value="2021-2025">2021-2025</option>
                    </select>
                </div>

                {/* Semester Selection */}
                <div className="space-y-2">
                    <label htmlFor="semester" className="block md:text-lg font-medium text-gray-300">
                        Semester
                    </label>
                    <select
                        id="semester"
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        className="w-full text-gray-500 p-4 py-2.5 bg-gray-700/30 border border-gray-600/30 rounded-lg focus:ring-2 focus:ring-indigo-400 transition-all"
                        required
                    >
                        <option value=""><p>Select Semester</p></option>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                            <option key={num} value={num}>Semester {num}</option>
                        ))}
                    </select>
                </div>

                {/* Roll Number Input */}
                <div className="space-y-2">
                    <label htmlFor="rollNumber" className="block text-lg font-medium text-gray-300">
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
                        className="w-full px-4 py-2.5 bg-gray-700/30 border border-gray-500/30 text-gray-400 rounded-lg focus:ring-2 focus:ring-indigo-400 transition-all placeholder-gray-500"
                        placeholder="Enter your roll number"
                    />
                </div>

                {/* Error Message */}
                {error && (
                    <div className="p-3 bg-red-900/30 text-red-300 text-sm rounded-lg border border-red-800/50">
                        {error}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full px-6 py-3 bg-gradient-to-r from-green-400 to-indigo-600 text-white font-extrabold md:text-xl rounded-lg hover:shadow-lg transition-all"
                >
                    Check Result
                </button>
            </form>
        </div>
    );
}