import React, { useState } from 'react';
import Select from 'react-select';
import './Scheduler.css';

const Scheduler = () => {
    const [dob, setDob] = useState("");
    const [vaccines, setVaccines] = useState([]);

    const vaccineOptions = [
        { value: 'diphtheria', label: 'Diphtheria' },
        { value: 'hepatitis', label: 'Hepatitis' },
        { value: 'pertussis', label: 'Pertussis' },
        { value: 'tetanus', label: 'Tetanus' },
    ];

    const addVaccine = () => {
        setVaccines([...vaccines, { name: '', date: "" }]);
    }

    const handleVaccineChange = (index, event) => {
        const newVaccines = [...vaccines];
        newVaccines[index].name = event.value;
        setVaccines(newVaccines);
    }

    const handleVaccineDateChange = (index, event) => {
        const newVaccines = [...vaccines];
        newVaccines[index].date = event.target.value;
        setVaccines(newVaccines);
    }

    const removeVaccine = (index) => {
        const newVaccines = [...vaccines];
        newVaccines.splice(index, 1);
        setVaccines(newVaccines);
    }

    return (
        <div className="Scheduler">
            <h1>Vaccination Scheduler</h1>
            <form>
                <div className="input-field">
                    <label>Date of Birth:</label>
                    <input type="date" value={dob} onChange={event => setDob(event.target.value)} />
                </div>

                <div className="input-field">
                    <label>Add vaccinations:</label>
                    {vaccines.map((vaccine, index) => (
                        <div className="vaccine-field" key={index}>
                            <Select
                                placeholder="Select Vaccine"
                                options={vaccineOptions}
                                onChange={event => handleVaccineChange(index, event)}
                            />
                            <input
                                type="date"
                                value={vaccine.date}
                                onChange={event => handleVaccineDateChange(index, event)}
                            />
                            <button type="button" onClick={() => removeVaccine(index)}>Remove row</button>

                        </div>
                    ))}
                    <button type="button" onClick={addVaccine}>Add Vaccine</button>
                </div>

                <input type="submit" value="Calculate Schedule" />
            </form>
        </div>
    );
}

export default Scheduler;
