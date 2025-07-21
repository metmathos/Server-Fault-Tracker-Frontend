import { useState, useEffect } from 'react';

function FaultEditForm() {
  const [faultData, setFaultData] = useState(null);
  const [faultId, setFaultId] = useState(1);
  const [faultList, setFaultList] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [errorData, setErrorData] = useState(null);
  const [loadingList, setLoadingList] = useState(true);
  const [errorList, setErrorList] = useState(null);
  const [description, setDescription] = useState('');
  const [technicianId, setTechnicianId] = useState('');
  const [status, setStatus] = useState('');
  const [severity, setSeverity] = useState('');
  const [techs, setTechs] = useState([]);
  const [loadingTechs, setLoadingTechs] = useState(true);

  useEffect(() => {
    const fetchFault = async () => {
      try {
        const res = await fetch(`http://localhost:8000/faults/${faultId}`);
        if (!res.ok) {
          throw new Error(`Error HTTP: ${res.status}`);
        }
        const data = await res.json();
        setFaultData(data);
      } catch (err) {
        setErrorData(err.message);
      } finally {
        setLoadingData(false);
      }
    };

    fetchFault();
  }, [faultId]);


  useEffect(() => {
    const fetchFaultList = async () => {
      try {
        const res = await fetch(`http://localhost:8000/faults/fault-ids`);
        if (!res.ok) {
          throw new Error(`Error HTTP: ${res.status}`);
        }
        const data = await res.json();
        setFaultList(data);
      } catch (err) {
        setErrorList(err.message);
      } finally {
        setLoadingList(false);
      }
    };

    fetchFaultList();
  }, []);


  useEffect(()=>{
    const fetchTechIdsNames = async() => {
      try {
      const res = await fetch('http://localhost:8000/technicians/list_id_name/');
      if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status} - ${res.statusText}`);
      }
      const data = await res.json();
      setTechs(data);
    } catch (err) {
      console.error('Error al obtener endpoint GET /technicians/list_id_name/', err);
    } finally {
      setLoadingTechs(false);
    }
    }
    fetchTechIdsNames()
  },[]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Lógica para enviar los datos editados
  };

  if (loadingData) return <p>Cargando datos de la falla...</p>;
  if (errorData) return <p>Error: {errorData}</p>;
  if (errorList) return <p>Error: {errorList}</p>;
  if (!faultData) return null;

  return (
    <div className='container'>
      <form onSubmit={handleSubmit}>
        <h2>Editar Falla #{faultId}</h2>
        <div>
          <label>Seleccion falla:</label><br />
          {loadingList ? (
            <p>Cargando indices de fallas...</p>
          ) : faultList.length === 0 ? (
            <p>No hay fallas registrados.</p>
          ) : (
            <select
              required
              value={faultId}
              onChange={(e) => setFaultId(Number(e.target.value))}
              style={{ width: '100%' }}
            >
                <option value="">-- Selecciona un índice de falla --</option>
                {faultList.map(id => (
                  <option key={id} value={id}>
                    Falla #{id}
                  </option>
              ))}
            </select>
          )}
        </div>
        <div>
          <label>Descripcion:</label><br />
            <textarea
            required
            value={faultData.description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <label>Tecnico:</label><br />
            <select
              required
              value={faultData.technicianId}
              onChange={(e) => setTechnicianId(e.target.value)}
              style={{ width: '100%' }}
            >
              {techs.map(tech => (
                <option key={tech.id} value={tech.id}>
                  {tech.name}
                </option>
              ))}
            </select>
        </div>
        <button type="submit">Guardar Cambios</button>
      </form>
    </div>
  );
}

export default FaultEditForm;
