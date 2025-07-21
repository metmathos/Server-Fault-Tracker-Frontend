import { useEffect, useState } from 'react';
import './FaultList.css';

function App() {
  const [faults, setFaults] = useState([]);
  const [loadingFaults, setLoadingFaults] = useState(true);
  const [status, setStatus] = useState("");
  const [statuses, setStatuses] = useState([]);
  const [loadingStatuses, setLoadingStatuses] = useState(true);
  const [faultError, setFaultError] = useState(null);

useEffect(() => {
  const fetchFaults = async () => {
    try {
      setLoadingFaults(true);
      setFaultError(null); // Limpiar error anterior

      const url = status === ""
        ? "http://localhost:8000/faults/"
        : `http://localhost:8000/faults/?fstatus=${status}`;

      const res = await fetch(url);

      if (res.status === 404) {
        throw new Error("No se encontraron resultados (404).");
      }

      if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status} - ${res.statusText}`);
      }

      const data = await res.json();
      setFaults(data);
    } catch (err) {
      console.error('Error al obtener datos:', err);
      setFaultError(err.message);
      setFaults([]);  // Limpiar lista si hubo error
    } finally {
      setLoadingFaults(false);
    }
  };

  fetchFaults();
}, [status]);

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

  return (
    <div className="container">
      <h1>Lista de Fallas</h1>

        <div>
          <label>Filtrar fallas por estado:</label><br />
          {loadingStatuses ? (
            <p>Cargando lista de estados...</p>
          ) : (
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="">*Mostrar todas las fallas</option>
              {statuses.map(stat => (
                <option key={stat} value={stat}>
                  {statusTranslations[stat] || stat}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
            {loadingFaults ? (
              <p>Cargando datos...</p>
            ) : faultError ? (
              <p style={{ color: "red" }}>{faultError}</p>
            ) : faults.length === 0 ? (
              <p>No hay fallos registrados.</p>
            ) : (
              faults.map(fault => (
                <div className="fault-item" key={fault.id}>
                  <strong>{fault.description}</strong>
                  <span>{fault.server_name} — Severidad: {severityTranslations[fault.severity] || fault.severity}</span>
                </div>
              ))
            )}
        </div>

      </div>
  );
}

export default App;
