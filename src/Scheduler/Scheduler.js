import React, { useState } from 'react';
import Select from 'react-select';
import { AiFillDelete } from 'react-icons/ai';
import './Scheduler.css';

const Scheduler = () => {
    const [dob, setDob] = useState("");
    const [vaccines, setVaccines] = useState([{ name: '', doses: [{ date: "" }] }]);

    const vaccineOptions = [
        { value: 'diphtheria', label: 'Diphtheria' },
        { value: 'hepatitis', label: 'Hepatitis' },
        { value: 'pertussis', label: 'Pertussis' },
        { value: 'tetanus', label: 'Tetanus' },
    ];

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

                            {vaccine.doses.map((dose, doseIndex) => (
                                <div key={doseIndex}>
                                    <label>Dose {doseIndex + 1}:</label>
                                    <div className='dosedate' >
                                        <input
                                            type="date"
                                            value={dose.date}
                                            onChange={event => handleDoseDateChange(index, doseIndex, event)}
                                        />
                                        <AiFillDelete className='removeicon' onClick={() => removeDose(index, doseIndex)} />
                                    </div>
                                </div>
                            ))}
                            <button type="button" onClick={() => addDose(index)}>Add Dose</button>
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
