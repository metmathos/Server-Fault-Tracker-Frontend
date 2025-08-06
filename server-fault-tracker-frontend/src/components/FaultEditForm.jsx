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
  const [errorTech, setErrorTechs] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [loadingStatuses, setLoadingStatuses] = useState(true);
  const [severities, setSeverities] = useState([]);
  const [loadingSeverities, setLoadingSeverities] = useState(true);
  const [originalStatus, loadingOriginalStatus] = useState('');
  const [originalDescription, loadingOriginalDescription] = useState('');
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    const fetchFault = async () => {
      try {
        const res = await fetch(`http://localhost:8000/faults/${faultId}`);
        if (!res.ok) {
          throw new Error(`Error HTTP: ${res.status}`);
        }
        const data = await res.json();
        setFaultData(data);
        setOriginalStatus(data.status);
        setOriginalDescription(data.description);
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
  
  useEffect(()=>{
    const fetchValidStatuses = async() => {
      try {
      const res = await fetch('http://localhost:8000/faults/valid-statuses/');
      if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status} - ${res.statusText}`);
      }
      const data = await res.json();
      setStatuses(data.statuses);
    } catch (err) {
      console.error('Error al obtener endpoint GET /faults/valid-statuses/', err);
    } finally {
      setLoadingStatuses(false);
    }
    }
    fetchValidStatuses()
  },[]);

    useEffect(()=>{
    const fetchValidSeverities = async() => {
      try {
      const res = await fetch('http://localhost:8000/faults/valid-severities/');
      if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status} - ${res.statusText}`);
      }
      const data = await res.json();
      setSeverities(data.severities);
    } catch (err) {
      console.error('Error al obtener endpoint GET /faults/valid-severities/', err);
    } finally {
      setLoadingSeverities(false);
    }
    }
    fetchValidSeverities()
  },[]);
  
    const statusTranslations = {
      pending: "Pendiente",
      under_analysis: "Bajo Análisis",
      waiting_for_spare_parts: "Esperando repuestos",
      resolved: "Resuelto",
      closed: "Cerrado",
      in_progress: "En progreso",
      rejected: "Rechazado",
      reopened: "Reabierto",
      escalated: "Escalado",
      cancelled: "Cancelado"
    };

    const severityTranslations = {
      informational: "Informativa",
      low: "Baja",
      medium: "Media",
      high: "Alta",
      critical: "Crítica"
    };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if(status!==originalStatus && description===originalDescription){
      setErrorMessage('Si cambia el estado, tambien debe modificar la descripción')
      return;
    }

    const modFault = {
      description,
      server_id: Number(faultData.serverId),
      technician_id: Number(technicianId),
      status,
      severity
    };

    console.log("Enviando:", modFault); // Para debug

    try {
      const response = await fetch('http://localhost:8000/faults/', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modFault),
      });

      if (response.ok) {
        setMessage('✅ Falla modificada con éxito');
        setDescription('');
        setServerId('');
        setTechnicianId('');
        setStatus('pending');
        setSeverity('low');
      } else {
        const errorData = await response.json();
        console.error(errorData);
        setMessage(`❌ Error: ${errorData.detail || 'Algo salió mal'}`);
      }
    } catch (error) {
      setMessage('❌ Error al conectar con la API');
      console.error(error);
    }
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
        <div>
          <label>Estado:</label><br />
           {loadingStatuses?(
            <p>Cargando lista de estados...</p>
            ):statuses.length===0?(
            <p>No hay estados registrados</p>
            ):(
            <select
              required
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{ width: '100%' }}
            >
              {statuses.map(stat => (
                <option key={stat} value={stat}>
                  {statusTranslations[stat] || stat}
                </option>
              ))}
            </select>
          )}
        </div>
        <div>
          <label>Severidad:</label><br />
           {loadingSeverities?(
            <p>Cargando lista de severidades...</p>
            ):severities.length===0?(
            <p>No hay severidades registradas</p>
            ):(
            <select
              required
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              style={{ width: '100%' }}
            >
              {severities.map(sev => (
                <option key={sev} value={sev}>
                  {severityTranslations[sev] || sev}
                </option>
              ))}
            </select>
          )}
        </div>
        
        <button type="submit">Guardar Cambios</button>
      </form>
    </div>
  );
}

export default FaultEditForm;
