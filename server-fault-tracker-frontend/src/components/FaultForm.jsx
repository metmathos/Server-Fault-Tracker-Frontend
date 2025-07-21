import { useState, useEffect } from 'react';
import './FaultForm.css';
import ServerInfoModal from './ServerInfoModal'
import TechInfoModal from './TechInfoModal';

function FaultForm() {
  const [description, setDescription] = useState('');
  const [serverId, setServerId] = useState('');
  const [technicianId, setTechnicianId] = useState('');
  const [status, setStatus] = useState('pending');
  const [severity, setSeverity] = useState('informational');
  const [statuses, setStatuses] = useState([]);
  const [loadingStatuses, setLoadingStatuses] = useState(true);
  const [severities, setSeverities] = useState([]);
  const [loadingSeverities, setLoadingSeverities] = useState(true);
  const [message, setMessage] = useState('');
  const [servers, setServers] = useState([]);
  const [loadingServers, setLoadingServers] = useState(true);
  const [techs, setTechs] = useState([]);
  const [loadingTechs, setLoadingTechs] = useState(true);
  const [showServerInfoModal, setServerInfoModal] = useState(false);
  const [showTechInfoModal, setTechInfoModal] = useState(false);

  useEffect(()=>{
    const fetchServerIdsNames = async() => {
      try {
      const res = await fetch('http://localhost:8000/servers/list_id_name/');
      if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status} - ${res.statusText}`);
      }
      const data = await res.json();
      setServers(data);
    } catch (err) {
      console.error('Error al obtener endpoint GET /servers/list_id_name/', err);
    } finally {
      setLoadingServers(false);
    }
    }
    fetchServerIdsNames()
  },[]);

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

    const newFault = {
      description,
      server_id: Number(serverId),
      technician_id: Number(technicianId),
      status,
      severity
    };

    console.log("Enviando:", newFault); // Para debug

    try {
      const response = await fetch('http://localhost:8000/faults/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFault),
      });

      if (response.ok) {
        setMessage('✅ Falla registrada con éxito');
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

  return (
    <div className="container">
      <h1>Registrar Nueva Falla</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Descripción:</label><br />
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <label>Servidor:</label><br />
          {loadingServers ? (
            <p>Cargando lista de servidores...</p>
          ) : servers.length === 0 ? (
            <p>No hay servidores registrados.</p>
          ) : (
            <select
              required
              value={serverId}
              onChange={(e) => setServerId(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="">-- Selecciona un servidor --</option>
              {servers.map(server => (
                <option key={server.id} value={server.id}>
                  {server.name}
                </option>
              ))}
            </select>
          )}
        </div>
        <div>
          <button onClick={() => setServerInfoModal(true)}>Mostrar servidor seleccionado</button>

          <ServerInfoModal 
            isOpen={showServerInfoModal} 
            onClose={() => setServerInfoModal(false)}
            Id={serverId}
            />

        </div>

        <div>
          <label>Tecnico:</label><br />
          {loadingTechs ? (
            <p>Cargando lista de tecnicos...</p>
          ) : techs.length === 0 ? (
            <p>No hay tecnicos registrados.</p>
          ) : (
            <select
              required
              value={technicianId}
              onChange={(e) => setTechnicianId(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="">-- Selecciona un tecnico --</option>
              {techs.map(tech => (
                <option key={tech.id} value={tech.id}>
                  {tech.name}
                </option>
              ))}
            </select>
          )}
        </div>
        
        <div>
          <button onClick={() => setTechInfoModal(true)}>Mostrar tecnico seleccionado</button>
          <TechInfoModal 
            isOpen={showTechInfoModal} 
            onClose={() => setTechInfoModal(false)}
            Id={technicianId}
            />
        </div>

        <div>
          <label>Estado:</label><br />
          {loadingStatuses ? (
            <p>Cargando lista de estados...</p>
          ) : (
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="">-- Selecciona un estado --</option>
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
          {loadingSeverities ? (
            <p>Cargando lista de severidades...</p>
          ) : (
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="">-- Selecciona una severidad --</option>
              {severities.map(sev => (
                <option key={sev} value={sev}>
                  {severityTranslations[sev] || sev}
                </option>
              ))}
            </select>
          )}
        </div>
        <br />
        <button type="submit">Registrar Falla</button>
      </form>
    </div>
  );
}

export default FaultForm;
