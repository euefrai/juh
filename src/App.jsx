import React, { useState } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import { Heart, HelpCircle, Lock } from 'lucide-react';

// Componente para os elementos flutuantes (Tulipas/Corações ou Interrogações)
const FloatingElement = ({ emoji, direction = 'up' }) => {
  const randomX = Math.random() * 100; 
  const duration = 2 + Math.random() * 3; 
  const delay = Math.random() * 5;
  const size = 15 + Math.random() * 35;

  return (
    <motion.div
      initial={{ y: direction === 'up' ? '110vh' : '-10vh', x: `${randomX}vw`, opacity: 0, scale: 0 }}
      animate={{ 
        y: direction === 'up' ? '-20vh' : '110vh', 
        opacity: [0, 1, 1, 0],
        rotate: [0, 180, 360],
        scale: [0.5, 1.2, 0.8, 1]
      }}
      transition={{ duration, repeat: Infinity, delay, ease: "easeInOut" }}
      style={{ position: 'absolute', fontSize: `${size}px`, pointerEvents: 'none', zIndex: 0 }}
    >
      {emoji}
    </motion.div>
  );
};

function App() {
  const [nome, setNome] = useState('');
  const [isLogged, setIsLogged] = useState(false);
  const [isWrongUser, setIsWrongUser] = useState(false);
  const [particles, setParticles] = useState([]);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 20, stiffness: 200 };
  const heartX = useSpring(cursorX, springConfig);
  const heartY = useSpring(cursorY, springConfig);

  const handleLogin = (e) => {
    e.preventDefault();
    const nomeLimpo = nome.trim().toLowerCase();
    const permitidos = ['ju', 'juh', 'julia', 'julinha', 'felix'];

    if (permitidos.includes(nomeLimpo)) {
      setIsLogged(true);
      setIsWrongUser(false);
    } else {
      setIsWrongUser(true);
    }
  };

  const handlePointerMove = (e) => {
    cursorX.set(e.clientX - 32);
    cursorY.set(e.clientY - 32);
    // Cria rastro denso ao mover
    if (Math.random() > 0.7) {
      createParticle(e.clientX, e.clientY);
    }
  };

  const createParticle = (x, y) => {
    const id = Date.now() + Math.random();
    setParticles((prev) => [...prev, { id, x, y }]);
    setTimeout(() => setParticles((prev) => prev.filter((p) => p.id !== id)), 1200);
  };

  // 1. TELA DE LOGIN (Portal)
  if (!isLogged && !isWrongUser) {
    return (
      <div style={styles.container}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={styles.card}>
          <Lock size={40} color="#7b1fa2" style={{ marginBottom: 20 }} />
          <h2 style={{ color: '#4a148c', marginBottom: 20 }}>login ?</h2>
          <form onSubmit={handleLogin} style={styles.form}>
            <input 
              type="text" 
              placeholder="name..." 
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              style={styles.input}
            />
            <button type="submit" style={styles.button}>-</button>
          </form>
        </motion.div>
      </div>
    );
  }

  // 2. TELA DE ERRO (Caos de Dúvida)
  if (isWrongUser) {
    const emojisDuvida = ['❓', '🤔', '🤨', '🚫', '🧐', '💭', '❌', '🤷‍♂️', '❗', '😶'];
    return (
      <div style={{ ...styles.container, backgroundColor: '#1a1a1a' }}>
        {Array.from({ length: 60 }).map((_, i) => (
          <FloatingElement key={i} emoji={emojisDuvida[i % emojisDuvida.length]} direction="down" />
        ))}
        <motion.div 
          style={{ ...styles.card, backgroundColor: '#333', border: '2px solid #ff4444' }}
          animate={{ x: [-10, 10, -10, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 0.5 }}
        >
          <HelpCircle size={60} color="#ff4444" />
          <h1 style={{ color: '#ff4444', marginTop: 10 }}>QUEM É VOCÊ?</h1>
          <p style={{ color: '#fff' }}>Acesso negado para estranhos. 🤨</p>
          <button onClick={() => setIsWrongUser(false)} style={{ ...styles.button, backgroundColor: '#ff4444', marginTop: 20 }}>
            Tentar Novamente
          </button>
        </motion.div>
      </div>
    );
  }

  // 3. TELA DA JULIA (Explosão Roxa Profunda)
  const itensJulia = ['🌷', '🌹', '💜', '🍇', '🔮', '✨', '🥀', '💐', '💟', '❣️', '🌌', '🎆', '🌸'];
  
  return (
    <div 
      onPointerMove={handlePointerMove}
      onPointerDown={(e) => { createParticle(e.clientX, e.clientY); createParticle(e.clientX + 10, e.clientY + 10); }}
      style={{ ...styles.container, backgroundColor: '#2e003e', cursor: 'none', touchAction: 'none' }}
    >
      {/* Poluição Visual: 80 itens subindo */}
      {Array.from({ length: 80 }).map((_, i) => (
        <FloatingElement key={i} emoji={itensJulia[i % itensJulia.length]} direction="up" />
      ))}

      <motion.h1 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0, scale: [1, 1.05, 1] }}
        transition={{ scale: { repeat: Infinity, duration: 2 } }}
        style={{ ...styles.title, color: '#e1bee7', fontSize: '2.5rem' }}
      >
        Minha Julia! 💜
      </motion.h1>

      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, scale: 0.5, x: p.x - 10, y: p.y - 10 }}
            animate={{ opacity: 0, scale: 2.5, y: p.y - 150, rotate: 180 }}
            exit={{ opacity: 0 }}
            style={{ position: 'absolute', pointerEvents: 'none', zIndex: 5 }}
          >
            <Heart fill="#9c27b0" color="#f3e5f5" size={25} />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Coração Principal Neon */}
      <motion.div
        style={{ position: 'fixed', left: 0, top: 0, x: heartX, y: heartY, pointerEvents: 'none', zIndex: 10 }}
        animate={{ 
            scale: [1, 1.3, 1.1, 1.4, 1],
            rotate: [0, 5, -5, 0]
        }}
        transition={{ duration: 1.2, repeat: Infinity }}
      >
        <Heart 
          size={80} 
          fill="#f3e5f5" 
          color="#7b1fa2" 
          style={{ filter: 'drop-shadow(0 0 25px #9c27b0)' }} 
        />
      </motion.div>
    </div>
  );
}

const styles = {
  container: {
    width: '100vw', height: '100vh',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', position: 'relative', fontFamily: 'sans-serif', transition: 'background-color 0.5s'
  },
  card: {
    padding: '40px', backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '30px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.2)', textAlign: 'center', zIndex: 20, maxWidth: '85%'
  },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: {
    padding: '15px', borderRadius: '15px', border: '3px solid #e1bee7',
    outline: 'none', fontSize: '18px', textAlign: 'center', color: '#4a148c'
  },
  button: {
    padding: '12px 25px', backgroundColor: '#7b1fa2', color: 'white',
    border: 'none', borderRadius: '15px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem'
  },
  title: { 
    pointerEvents: 'none', zIndex: 10, textAlign: 'center', 
    textShadow: '0 0 15px rgba(156, 39, 176, 0.6)', padding: '20px' 
  }
};

export default App;