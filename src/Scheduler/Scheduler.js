import React, { useState } from 'react';
import Select from 'react-select';
import { AiFillDelete } from 'react-icons/ai';
import { vaccineOptions } from './Variables';
import './Scheduler.css';

const calculateAge = dob => {
    const today = new Date();
    const birthDate = new Date(dob);
    let ageYears = today.getFullYear() - birthDate.getFullYear();
    let ageMonths = today.getMonth() - birthDate.getMonth();
    let ageWeeks = Math.floor((today.getDate() - birthDate.getDate()) / 7);

    if (ageMonths < 0 || (ageMonths === 0 && today.getDate() < birthDate.getDate())) {
        ageYears--;
        ageMonths += 12;
    }

    return { ageYears, ageMonths, ageWeeks };
};

const getVaccineSchedule = (dob, vaccine) => {
    const { ageYears, ageMonths, ageWeeks } = calculateAge(dob);
    const schedules = [];

    const totalAgeInWeeks = ageYears * 52 + ageMonths * 4 + ageWeeks;

    if (vaccine.name === 'DTPa-VHB-IPV-Hib' && totalAgeInWeeks < 8) {
        const intervals = [8, 12, 16, 15 * 4.3];
        intervals.forEach(weeks => {
            // Calculate the exact target date
            const targetDate = new Date(new Date(dob).getTime() + weeks * 7 * 24 * 60 * 60 * 1000);

            // Calculate the range (+- 5 days)
            const startDate = new Date(targetDate.getTime() - 5 * 24 * 60 * 60 * 1000);
            const endDate = new Date(targetDate.getTime() + 5 * 24 * 60 * 60 * 1000);

            schedules.push({ startDate, targetDate, endDate });
        });
    }

    return schedules;
};

const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
};


const Scheduler = () => {
    const [dob, setDob] = useState("");
    const [age, setAge] = useState({ ageYears: null, ageMonths: null, ageWeeks: null });
    const [error, setError] = useState(null);
    const [vaccines, setVaccines] = useState([
        {
            name: '',
            doses: [{ date: "" }]
        }
    ]);

    const addVaccine = () => {
        setVaccines([...vaccines, { name: '', doses: [{ date: "" }] }]);
    }

    const handleVaccineChange = (index, event) => {
        const newVaccines = [...vaccines];
        newVaccines[index].name = event.value;
        setVaccines(newVaccines);
    }

    const removeVaccine = (index) => {
        const newVaccines = [...vaccines];
        newVaccines.splice(index, 1);
        setVaccines(newVaccines);
    }

    const addDose = (vaccineIndex) => {
        const newVaccines = [...vaccines];
        newVaccines[vaccineIndex].doses.push({ date: "" });
        setVaccines(newVaccines);
    };

    const removeDose = (vaccineIndex, doseIndex) => {
        const newVaccines = [...vaccines];
        newVaccines[vaccineIndex].doses.splice(doseIndex, 1);
        setVaccines(newVaccines);
    };

    const handleDoseDateChange = (vaccineIndex, doseIndex, event) => {
        const newVaccines = [...vaccines];
        newVaccines[vaccineIndex].doses[doseIndex].date = event.target.value;
        setVaccines(newVaccines);
    };

    const [vaccineSchedule, setVaccineSchedule] = useState([]);

    const handleSubmit = event => {
        event.preventDefault();

        if (!dob) {
            setError("Input age");
            return;
        }

        const selectedVaccine = vaccines[0];
        const isDTPaVaccine = selectedVaccine.name === 'DTPa-VHB-IPV-Hib';
        const childAge = calculateAge(dob);
        const totalAgeInWeeks = childAge.ageYears * 52 + childAge.ageMonths * 4 + childAge.ageWeeks;
        const noDosesGiven = selectedVaccine.doses.every(dose => !dose.date);

        if (isDTPaVaccine && totalAgeInWeeks < 8 && noDosesGiven) {
            const schedules = getVaccineSchedule(dob, selectedVaccine);
            setVaccineSchedule(schedules);
        } else {
            setVaccineSchedule([]);
        }

        setAge(childAge);
        setError(null);
        console.log("Selected Vaccine:", selectedVaccine.name);
        console.log("Child's age in weeks:", totalAgeInWeeks);
    };

    console.log('Vaccination schedule: ', vaccineSchedule)

    return (
        <div className="Scheduler">
            <h1>Vaccination Scheduler</h1>
            <form onSubmit={handleSubmit}>
                <div className="input-field">
                    <label>Date of Birth:</label>
                    <input type="date" value={dob} onChange={event => setDob(event.target.value)} />
                </div>
                <div className="input-field">
                    <label>Add vaccinations:</label>
                    {vaccines.map((vaccine, index) => (
                        <div className="vaccine-field" key={index}>
                            <div className='selectionvaccine'>
                                <label>Vaccine</label>
                                <div className="vaccine-selection">
                                    <Select
                                        placeholder="Select Vaccine"
                                        options={vaccineOptions}
                                        onChange={event => handleVaccineChange(index, event)}
                                    />
                                    <AiFillDelete className="removeicon" onClick={() => removeVaccine(index)} />
                                </div>
                            </div>
                            <div className="doses-container">
                                {vaccine.doses.map((dose, doseIndex) => (
                                    <div className="dose-item" key={doseIndex}>
                                        <label>Dose {doseIndex + 1}:</label>
                                        <div className='dosedate'>
                                            <input
                                                type="date"
                                                value={dose.date}
                                                onChange={event => handleDoseDateChange(index, doseIndex, event)}
                                            />
                                            <AiFillDelete className='removeicon' onClick={() => removeDose(index, doseIndex)} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button type="button" onClick={() => addDose(index)}>Add Dose</button>
                        </div>
                    ))}
                    <button type="button" onClick={addVaccine}>Add Vaccine</button>
                </div>
                <input type="submit" value="Calculate Schedule" className="submit-btn" />
                {error &&
                    <p className="error-message">
                        {error}
                    </p>
                }
                {age.ageYears !== null &&
                    <p className="age-display">
                        Age: {age.ageYears} years, {age.ageMonths} months, and {age.ageWeeks} weeks
                    </p>
                }
                {vaccineSchedule.map((schedule, index) => (
                    <p key={index} className="vaccine-date">
                        Recommended date for dose {index + 1}: {formatDate(schedule.startDate)} to {formatDate(schedule.endDate)}
                    </p>
                ))}

            </form>
        </div>
    );
}
export default Scheduler;