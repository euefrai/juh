import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Lock, Heart } from 'lucide-react';

// Elementos flutuantes otimizados para performance
const FloatingElement = React.memo(({ emoji, isChaos = false }) => {
  const randomX = useMemo(() => Math.random() * 100, []);
  const randomYInitial = useMemo(() => Math.random() * 100, []);
  const duration = useMemo(() => 3 + Math.random() * 4, []);
  const delay = useMemo(() => Math.random() * 5, []);
  const size = useMemo(() => 20 + Math.random() * 30, []);

  const targetY = isChaos ? (Math.random() > 0.5 ? -120 : 120) : -120;

  return (
    <motion.div
      initial={{ 
        y: isChaos ? `${randomYInitial}vh` : '110vh', 
        x: `${randomX}vw`, 
        opacity: 0, 
        scale: 0 
      }}
      animate={{ 
        y: `${targetY}vh`,
        opacity: [0, 1, 1, 0],
        rotate: 360,
        scale: [0.8, 1.2, 1]
      }}
      transition={{ duration, repeat: Infinity, delay, ease: "linear" }}
      style={{ 
        position: 'absolute', 
        fontSize: `${size}px`, 
        pointerEvents: 'none', 
        zIndex: 50,
        filter: 'drop-shadow(0 0 10px rgba(156, 39, 176, 0.5))'
      }}
    >
      {emoji}
    </motion.div>
  );
});

function App() {
  const [nome, setNome] = useState('');
  const [isLogged, setIsLogged] = useState(false);
  const [isWrongUser, setIsWrongUser] = useState(false);
  const [particles, setParticles] = useState([]);

  const handleLogin = (e) => {
    e.preventDefault();
    const nomeLimpo = nome.trim().toLowerCase();
    const permitidos = ['felix'];

    if (permitidos.includes(nomeLimpo)) {
      setIsLogged(true);
      setIsWrongUser(false);
    } else {
      setIsWrongUser(true);
    }
  };

  const createParticle = (e) => {
    const id = Date.now();
    const newParticle = { id, x: e.clientX, y: e.clientY };
    setParticles((prev) => [...prev.slice(-15), newParticle]); // Limita a 15 partículas para não travar
    setTimeout(() => setParticles((prev) => prev.filter((p) => p.id !== id)), 1000);
  };

  if (!isLogged && !isWrongUser) {
    return (
      <div style={styles.container}>
        <div style={styles.neonGlow}></div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.card}>
          <Lock size={40} color="#7b1fa2" style={{ marginBottom: 20 }} />
          <h2 style={{ color: '#4a148c', marginBottom: 20 }}>Portal Secreto</h2>
          <form onSubmit={handleLogin} style={styles.form}>
            <input 
              type="text" 
              placeholder="Seu nome..." 
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              style={styles.input}
            />
            <button type="submit" style={styles.button}>Entrar</button>
          </form>
        </motion.div>
      </div>
    );
  }

  if (isWrongUser) {
    const emojisDuvida = ['❓', '🤔', '🤨', '🚫'];
    return (
      <div style={{ ...styles.container, backgroundColor: '#111' }}>
        {Array.from({ length: 30 }).map((_, i) => (
          <FloatingElement key={i} emoji={emojisDuvida[i % emojisDuvida.length]} isChaos={true} />
        ))}
        <motion.div style={styles.cardError} animate={{ x: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 0.2 }}>
          <HelpCircle size={60} color="#ff4444" />
          <h1 style={{ color: '#ff4444' }}>Acesso Negado</h1>
          <button onClick={() => setIsWrongUser(false)} style={styles.buttonError}>Voltar</button>
        </motion.div>
      </div>
    );
  }

  const itensJulia = ['🌷', '💜', '✨', '🌸', '💟', '❣️'];
  
  return (
    <div 
      onPointerDown={createParticle}
      style={styles.containerMain}
    >
      {/* Luzes Neon de Fundo */}
      <div style={styles.neonGlow}></div>
      <div style={{ ...styles.neonGlow, animationDelay: '2s', left: '60%', top: '20%' }}></div>

      {/* Itens Flutuantes por cima de tudo */}
      {Array.from({ length: 40 }).map((_, i) => (
        <FloatingElement key={i} emoji={itensJulia[i % itensJulia.length]} isChaos={true} />
      ))}

      {/* Nome da Julia com efeito Neon */}
      <motion.div
        drag
        dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
        style={{ zIndex: 10, cursor: 'grab' }}
      >
        <h1 style={styles.neonTitle}>
          😜
        </h1>
      </motion.div>

      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, scale: 0.5, x: p.x - 15, y: p.y - 15 }}
            animate={{ opacity: 0, scale: 2, y: p.y - 100 }}
            exit={{ opacity: 0 }}
            style={{ position: 'absolute', pointerEvents: 'none', zIndex: 60 }}
          >
            <Heart fill="#e1bee7" color="#7b1fa2" size={30} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

const styles = {
  container: {
    width: '100vw', height: '100vh', backgroundColor: '#0f001a',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', position: 'relative', fontFamily: 'sans-serif'
  },
  containerMain: {
    width: '100vw', height: '100vh', backgroundColor: '#0f001a',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', position: 'relative', touchAction: 'none'
  },
  neonGlow: {
    position: 'absolute', width: '400px', height: '400px',
    background: 'radial-gradient(circle, rgba(123, 31, 162, 0.3) 0%, rgba(15, 0, 26, 0) 70%)',
    borderRadius: '50%', top: '30%', left: '20%', filter: 'blur(50px)',
    animation: 'pulse 6s infinite alternate'
  },
  neonTitle: {
    fontSize: '4rem', color: '#fff', textAlign: 'center',
    textShadow: '0 0 10px #e1bee7, 0 0 20px #e1bee7, 0 0 40px #7b1fa2, 0 0 80px #7b1fa2',
    userSelect: 'none'
  },
  card: {
    padding: '40px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '30px',
    backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)',
    textAlign: 'center', zIndex: 20, color: '#fff'
  },
  input: {
    padding: '15px', borderRadius: '15px', border: 'none', backgroundColor: 'rgba(255,255,255,0.9)',
    outline: 'none', fontSize: '18px', textAlign: 'center', color: '#4a148c'
  },
  button: {
    padding: '12px 25px', backgroundColor: '#7b1fa2', color: 'white',
    border: 'none', borderRadius: '15px', cursor: 'pointer', fontWeight: 'bold',
    boxShadow: '0 0 15px rgba(123, 31, 162, 0.5)'
  },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  cardError: { padding: '40px', backgroundColor: '#222', borderRadius: '30px', textAlign: 'center', zIndex: 100 },
  buttonError: { padding: '10px 20px', backgroundColor: '#ff4444', color: '#fff', border: 'none', borderRadius: '10px', marginTop: '20px' }
};

// Adicione isso ao seu arquivo CSS global ou em uma tag <style> no index.html
// @keyframes pulse { from { transform: scale(1); opacity: 0.5; } to { transform: scale(1.2); opacity: 0.8; } }

export default App;