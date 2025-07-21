
import { useEffect, useState } from 'react';

function TechInfoModal({ isOpen, onClose, Id }) {
  const [techData, setTechData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !Id) return;

    const fetchTechnicianData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8000/technicians/${Id}`);
        const data = await res.json();
        setTechData(data);
      } catch (err) {
        console.error('Error al obtener datos del servidor:', err);
        setTechData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTechnicianData();
  }, [isOpen, Id]);

  if (!isOpen) return null;

  return (
    <div style={styles.backdrop}>
      <div style={styles.modal}>
        <button onClick={onClose} style={styles.closeBtn}>✖</button>

        {loading ? (
          <p>Cargando datos del tecnico...</p>
        ) : techData ? (
          <>
            <h2>Tecnico: {techData.name}</h2>
            <p>E-mail: {techData.email}</p>
            <p>Telefono: {techData.phone_number}</p>
            <p>Departamento: {techData.department}</p>
            <p>Locacion: {techData.location}</p>
          </>
        ) : (
          <p>No se encontraron datos del tecnico.</p>
        )}
      </div>
    </div>
  );
}


// Estilos en JS (podés usar CSS también)
const styles = {
  backdrop: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    minWidth: '300px',
    position: 'relative'
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    background: 'none',
    border: 'black',
    fontSize: '1.2rem',
    cursor: 'pointer'
  }
};

export default TechInfoModal;
