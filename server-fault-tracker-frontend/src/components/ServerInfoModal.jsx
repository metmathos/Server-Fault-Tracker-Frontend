
import { useEffect, useState } from 'react';

function ServerInfoModal({ isOpen, onClose, Id }) {
  const [serverData, setServerData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !Id) return;

    const fetchServerData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8000/servers/${Id}`);
        const data = await res.json();
        setServerData(data);
      } catch (err) {
        console.error('Error al obtener datos del servidor:', err);
        setServerData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchServerData();
  }, [isOpen, Id]);

  if (!isOpen) return null;

  return (
    <div style={styles.backdrop}>
      <div style={styles.modal}>
        <button onClick={onClose} style={styles.closeBtn}>✖</button>

        {loading ? (
          <p>Cargando datos del servidor...</p>
        ) : serverData ? (
          <>
            <h2>Servidor: {serverData.name}</h2>
            <p>IP: {serverData.ip}</p>
            <p>Ubicación: {serverData.location}</p>
            <p>Fabricante: {serverData.manufacturer}</p>
            <p>Modelo: {serverData.model}</p>
            <p>Numero de serie: {serverData.serial_number}</p>
          </>
        ) : (
          <p>No se encontraron datos del servidor.</p>
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

export default ServerInfoModal;
