import { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

const api = axios.create({
  baseURL: 'https://wage-dev-backend.vercel.app/'
});

function App() {
  const [programmers, setProgrammers] = useState([]);
  const [newName, setNewName] = useState('');
  const [newProfession, setNewProfession] = useState('');
  const [newWage, setNewWage] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    api.get('/programmers').then((res) => {
      console.log(res);
      setProgrammers(res.data);
    });
  }, []);

  useEffect(() => {
    setIsFormValid(
      newName !== '' &&
      newProfession !== '' &&
      newWage !== ''
    );
  }, [newName, newProfession, newWage]);

  function addInformation() {
    if (isFormValid) {
      const newProgrammer = {
        name: newName,
        profession: newProfession,
        wage: newWage,
        id: uuidv4(),
      };

      api.post('/programmers', newProgrammer).then((res) => {
        setProgrammers([...programmers, newProgrammer]);
        console.log(res);
      });
    }
  }

  return (
    <div className="container">
      <h1>¿WAGE?</h1>
      <h2>Share information to help others to discover which area to enter.</h2>
      <div>
        <input placeholder='Name' onChange={event => setNewName(event.target.value)} />
        <input placeholder='Profession' onChange={event => setNewProfession(event.target.value)} />
        <input placeholder='Wage' onChange={event => setNewWage(event.target.value)} />
        <button onClick={addInformation} disabled={!isFormValid}>Add information</button>
      </div>
      <div>
        <h2>See the information below. Maybe you find out which area you want to join 😊.</h2>
        <ul>
          {programmers.map(programmer => (
            <li key={programmer.id} > Name: {programmer.name} - Profession: {programmer.profession} - Wage: {programmer.wage}</li>
          ))
          }
        </ul>
      </div>
    </div>
  )
}

export default App;
