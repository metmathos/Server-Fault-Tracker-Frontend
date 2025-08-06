import { useState, useEffect } from 'react';

function FaultEditForm() {
  const [faultId, setFaultId] = useState(1);
  const [faultList, setFaultList] = useState([]);
  const [faultData, setFaultData] = useState(null);

  const [description, setDescription] = useState('');
  const [technicianId, setTechnicianId] = useState('');
  const [status, setStatus] = useState('');
  const [severity, setSeverity] = useState('');

  const [originalStatus, setOriginalStatus] = useState('');
  const [originalDescription, setOriginalDescription] = useState('');

  const [techs, setTechs] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [severities, setSeverities] = useState([]);

  const [loadingData, setLoadingData] = useState(true);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingTechs, setLoadingTechs] = useState(true);
  const [loadingStatuses, setLoadingStatuses] = useState(true);
  const [loadingSeverities, setLoadingSeverities] = useState(true);

  const [errorData, setErrorData] = useState(null);
  const [errorList, setErrorList] = useState(null);
  const [errorTech, setErrorTech] = useState(null);

  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchFaultList = async () => {
      try {
        const res = await fetch(`http://localhost:8000/faults/fault-ids`);
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
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

  useEffect(() => {
    const fetchFault = async () => {
      try {
        const res = await fetch(`http://localhost:8000/faults/${faultId}`);
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        const data = await res.json();
        setFaultData(data);
        setOriginalStatus(data.status);
        setOriginalDescription(data.description);
        setDescription(data.description);
        setTechnicianId(data.technician_id?.toString() || '');
        setStatus(data.status);
        setSeverity(data.severity);
      } catch (err) {
        setErrorData(err.message);
      } finally {
        setLoadingData(false);
      }
    };
    fetchFault();
  }, [faultId]);

  useEffect(() => {
    const fetchTechIdsNames = async () => {
      try {
        const res = await fetch('http://localhost:8000/technicians/list_id_name/');
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        const data = await res.json();
        setTechs(data);
      } catch (err) {
        setErrorTech(err.message);
      } finally {
        setLoadingTechs(false);
      }
    };
    fetchTechIdsNames();
  }, []);

  useEffect(() => {
    const fetchValidStatuses = async () => {
      try {
        const res = await fetch('http://localhost:8000/faults/valid-statuses/');
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        const data = await res.json();
        setStatuses(data.statuses);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingStatuses(false);
      }
    };
    fetchValidStatuses();
  }, []);

  useEffect(() => {
    const fetchValidSeverities = async () => {
      try {
        const res = await fetch('http://localhost:8000/faults/valid-severities/');
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        const data = await res.json();
        setSeverities(data.severities);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingSeverities(false);
      }
    };
    fetchValidSeverities();
  }, []);

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
    setMessage('');
    setErrorMessage('');

    if (status !== originalStatus && description === originalDescription) {
      setErrorMessage('⚠️ Si cambia el estado, también debe modificar la descripción.');
      return;
    }

    const modFault = {
      description,
      server_id: Number(faultData.server_id),
      technician_id: Number(technicianId),
      status,
      severity
    };

    try {
      const response = await fetch('http://localhost:8000/faults/', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modFault),
      });

      if (response.ok) {
        setMessage('✅ Falla modificada con éxito');
      } else {
        const errorData = await response.json();
        setMessage(`❌ Error: ${errorData.detail || 'Algo salió mal'}`);
      }
    } catch (error) {
      setMessage('❌ Error al conectar con la API');
      console.error(error);
    }
  };

  if (loadingData || loadingList) return <p>Cargando datos...</p>;
  if (errorData || errorList) return <p>Error: {errorData || errorList}</p>;
  if (!faultData) return null;

  return (
    <div className='container'>
      <form onSubmit={handleSubmit}>
        <h2>Editar Falla #{faultId}</h2>

        <div>
          <label>Seleccionar falla:</label><br />
          <select
            required
            value={faultId}
            onChange={(e) => setFaultId(Number(e.target.value))}
            style={{ width: '100%' }}
          >
            <option value="">-- Selecciona un ID --</option>
            {faultList.map(id => (
              <option key={id} value={id}>Falla #{id}</option>
            ))}
          </select>
        </div>

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
          <label>Técnico:</label><br />
          {loadingTechs ? <p>Cargando técnicos...</p> : (
            <select
              required
              value={technicianId}
              onChange={(e) => setTechnicianId(e.target.value)}
              style={{ width: '100%' }}
            >
              {techs.map(tech => (
                <option key={tech.id} value={tech.id}>{tech.name}</option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label>Estado:</label><br />
          {loadingStatuses ? <p>Cargando estados...</p> : (
            <select
              required
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{ width: '100%' }}
            >
              {statuses.map(stat => (
                <option key={stat} value={stat}>{statusTranslations[stat] || stat}</option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label>Severidad:</label><br />
          {loadingSeverities ? <p>Cargando severidades...</p> : (
            <select
              required
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              style={{ width: '100%' }}
            >
              {severities.map(sev => (
                <option key={sev} value={sev}>{severityTranslations[sev] || sev}</option>
              ))}
            </select>
          )}
        </div>

        <button type="submit">Guardar Cambios</button>

        {errorMessage && <p style={{ color: 'orange' }}>{errorMessage}</p>}
        {message && <p style={{ color: message.startsWith('✅') ? 'green' : 'red' }}>{message}</p>}
      </form>
    </div>
  );
}

export default FaultEditForm;