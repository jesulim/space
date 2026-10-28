import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Coffee,
  Sparkles,
  Layers,
  Code2,
  Terminal,
  ShieldCheck,
  ExternalLink,
  Copy,
  Check,
  CheckCircle2,
  Compass,
  Database,
  GitBranch,
  Globe,
  Hammer,
  Eye,
  BookOpen,
  Smartphone,
  Cpu,
  RefreshCw,
  Send,
  Sliders,
  X,
  Play
} from 'lucide-react';
import './App.css';

export default function App() {
  // 1. Estado del Mostrador "Hola Mundo"
  const [cafesServidos, setCafesServidos] = useState(() => {
    const saved = localStorage.getItem('vibe_cafes_count');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isBrewing, setIsBrewing] = useState(false);
  const [activeXRay, setActiveXRay] = useState('all'); // 'all' | 'html' | 'css' | 'react'

  // 2. Filtro de las 6 piezas
  const [piecesFilter, setPiecesFilter] = useState('all'); // 'all' | 'local' | 'infra'

  // 3. Pestañas de Herramientas
  const [activeToolTab, setActiveToolTab] = useState(0);

  // 4. Copiar Prompt Maestro
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // 5. Checklist del Laboratorio (persistencia en LocalStorage)
  const [checklist, setChecklist] = useState(() => {
    const defaultList = [
      { id: 1, title: 'Crear el Prompt con la Fórmula de 4 Capas', desc: 'Definir Rol, Objetivo, Estructura y Estilos visuales antes de pedir código.', checked: true },
      { id: 2, title: 'Generar la Web en v0.dev, Bolt.new o Lovable', desc: 'Pegar el Prompt Maestro y dejar que la constructora de IA arme la app en segundos.', checked: false },
      { id: 3, title: 'Inspeccionar la Obra con Chrome DevTools', desc: 'Abrir F12, inspeccionar los muros (HTML) y probar el diseño (CSS).', checked: false },
      { id: 4, title: 'Guardar los Planos en la Bóveda de GitHub', desc: 'Conectar la cuenta y crear el repositorio para tener máquina del tiempo.', checked: false },
      { id: 5, title: 'Abrir el Local 24/7 en Vercel', desc: 'Importar el repo desde GitHub en 1 clic y obtener tu URL pública .vercel.app.', checked: false },
      { id: 6, title: 'Abrir el link desde tu Teléfono Celular', desc: 'Comprobar que tu cafetería web es 100% responsiva y compartirla por WhatsApp.', checked: false },
    ];
    const saved = localStorage.getItem('vibe_checklist');
    return saved ? JSON.parse(saved) : defaultList;
  });

  // 6. DevTools Drawer Simulator
  const [devtoolsOpen, setDevtoolsOpen] = useState(false);
  const [devtoolsTab, setDevtoolsTab] = useState('elements');

  // 7. Reto Sesión 2 Simulator
  const [challengeUrl, setChallengeUrl] = useState('');
  const [challengeOption, setChallengeOption] = useState('A');
  const [challengeSubmitted, setChallengeSubmitted] = useState(false);

  // Guardar cafés en localStorage
  useEffect(() => {
    localStorage.setItem('vibe_cafes_count', cafesServidos.toString());
  }, [cafesServidos]);

  // Guardar checklist en localStorage
  useEffect(() => {
    localStorage.setItem('vibe_checklist', JSON.stringify(checklist));
  }, [checklist]);

  // Manejar el botón del Barista
  const handlePedirCafe = () => {
    setIsBrewing(true);
    setCafesServidos((prev) => prev + 1);

    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#f59e0b', '#d97706', '#fbbf24', '#ffffff']
    });

    setTimeout(() => {
      setIsBrewing(false);
    }, 600);
  };

  // Toggle checklist item
  const toggleChecklistItem = (id) => {
    setChecklist((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item));
      const allDone = updated.every((i) => i.checked);
      if (allDone) {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
      return updated;
    });
  };

  const checklistProgress = Math.round(
    (checklist.filter((i) => i.checked).length / checklist.length) * 100
  );

  // Texto del Prompt Maestro de la Sesión 1
  const masterPromptText = `Actúa como un diseñador UI/UX y desarrollador experto en React y Tailwind CSS. Crea una aplicación web educativa e interactiva llamada 'La Anatomía de una Web App: La Cafetería del Vibe Coder'.
El objetivo es enseñar cómo funciona una aplicación web moderna usando una única analogía continua: abrir y operar una cafetería.
Incluye las siguientes secciones con un diseño moderno, cálido e intuitivo, totalmente adaptable a celulares:
1. Hero Principal: Título llamativo explicando que en el Vibe Coding tú eres el Director del local y la IA es tu equipo constructor.
2. Demostración 'Hola Mundo' en el Mostrador: Un componente interactivo real donde el usuario pueda hacer clic en 'Pedir un Café al Barista', aumentando un contador en vivo y mostrando con etiquetas visuales qué parte es HTML (el cartel y botón), cuál es CSS/Tailwind (los colores y bordes) y cuál es React/JavaScript (el contador y la acción del clic).
3. Las 6 Piezas de la Cafetería (Tarjetas interactivas): HTML (Muros, Mesas y Carteles), CSS / Tailwind (Diseño de Interiores, Pintura y Luces), React / JavaScript (El Barista, Estaciones Modulares y Pizarra de Estado), Persistencia / LocalStorage (El Almacén con Llave que no se borra al recargar), GitHub (La Bóveda de Planos con Máquina del Tiempo) y Vercel (El Local Abierto en la Avenida Principal con link público).
4. Mapa de Herramientas de Vibe Coding: Pestañas interactivas explicando Consultores (ChatGPT, Claude, Gemini), Constructores en Navegador (v0, Bolt, Lovable) y Editores con Agentes (Cursor, Windsurf).
5. Checklist Interactivo de 'Mi Primer Deploy': Lista de pasos (Crear prompt, Generar app, Subir a GitHub, Publicar en Vercel, Compartir link) que el alumno pueda marcar y que quede guardada en el navegador.`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(masterPromptText);
    setCopiedPrompt(true);
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.8 }
    });
    setTimeout(() => setCopiedPrompt(false), 3000);
  };

  // Información de las 6 piezas
  const piecesData = [
    {
      id: 'html',
      num: '01',
      type: 'local',
      tech: 'HTML',
      badgeColor: 'badge-html',
      analogy: 'La Obra Bruta (Muros, Mesas y Carteles)',
      func: 'Define qué objetos existen en la pantalla: títulos, textos, imágenes, formularios y botones físicos en el mostrador.',
      icon: <Layers size={22} color="#f97316" />,
      example: '<h1>Bienvenido a la Cafetería</h1>\n<button>Pedir Café</button>'
    },
    {
      id: 'css',
      num: '02',
      type: 'local',
      tech: 'CSS (Tailwind)',
      badgeColor: 'badge-css',
      analogy: 'El Diseño de Interiores, Pintura y Luces',
      func: 'Define cómo se ve y se acomoda todo: colores cálidos de café, tipografías legibles, esquinas redondeadas y Diseño Responsivo para celular.',
      icon: <Sparkles size={22} color="#38bdf8" />,
      example: 'bg-amber-950 text-white rounded-2xl p-8 shadow-lg'
    },
    {
      id: 'react',
      num: '03',
      type: 'local',
      tech: 'React (JavaScript)',
      badgeColor: 'badge-react',
      analogy: 'Los Baristas, Estaciones Modulares y Pantallas Digitales',
      func: 'El cerebro con JavaScript: crea moldes repetibles (Componentes), responde al clic del cliente y actualiza pantallas con su memoria en turno (Estado).',
      icon: <Code2 size={22} color="#61dafb" />,
      example: 'const [cafes, setCafes] = useState(0);\nonClick={() => setCafes(cafes + 1)}'
    },
    {
      id: 'storage',
      num: '04',
      type: 'infra',
      tech: 'Persistencia (LocalStorage / DB)',
      badgeColor: 'badge-primary',
      analogy: 'El Almacén con Llave y Libro Contable',
      func: 'Donde se guardan los datos permanentes para que no se borren si se corta la luz o si el usuario recarga la página (F5).',
      icon: <Database size={22} color="#c084fc" />,
      example: 'localStorage.setItem("cafes", cafes);\n// ¡Inmune a recargar la página!'
    },
    {
      id: 'github',
      num: '05',
      type: 'infra',
      tech: 'GitHub',
      badgeColor: 'badge-primary',
      analogy: 'La Bóveda de Planos con Máquina del Tiempo',
      func: 'Guarda cada versión del código en la nube. Si una remodelación con IA sale mal, puedes regresar al plano exacto que funcionaba ayer.',
      icon: <GitBranch size={22} color="#e2e8f0" />,
      example: 'git commit -m "feat: mostrador con barista"\ngit push origin main'
    },
    {
      id: 'vercel',
      num: '06',
      type: 'infra',
      tech: 'Vercel (Hosting & Dominio)',
      badgeColor: 'badge-primary',
      analogy: 'El Local Abierto en la Avenida Principal',
      func: 'Toma los planos de GitHub y abre tu cafetería al público 24/7 en internet con una dirección web propia (.vercel.app) accesible desde celular.',
      icon: <Globe size={22} color="#4ade80" />,
      example: 'https://mi-cafeteria-vibe.vercel.app\n¡Listo en 60 segundos!'
    }
  ];

  const filteredPieces = piecesData.filter((p) => {
    if (piecesFilter === 'local') return p.type === 'local';
    if (piecesFilter === 'infra') return p.type === 'infra';
    return true;
  });

  // Datos de las herramientas
  const toolsCategories = [
    {
      title: 'Consultores y Arquitectos',
      analogy: 'Tus Asesores de Negocio',
      icon: <Compass size={24} />,
      items: ['ChatGPT 4o', 'Claude 3.5 Sonnet', 'Gemini 1.5 Pro'],
      useCase: 'Aterrizar tu idea para el Hackathon de American Space, definir qué funciones tendrá tu prototipo mínimo viable (MVP) y redactar prompts bien estructurados con la Fórmula de 4 Capas.',
      badge: 'Fase de Planificación',
      mockTitle: 'Consultoría Estratégica con IA',
      mockCode: 'Prompt: "Actúa como arquitecto de producto. Necesito definir las 3 pantallas clave de mi cafetería..."'
    },
    {
      title: 'Constructores Visuales en el Navegador',
      analogy: 'Constructoras Llave en Mano Web',
      icon: <Hammer size={24} />,
      items: ['v0.dev (Vercel)', 'Bolt.new (StackBlitz)', 'Lovable.dev'],
      useCase: 'Pegar tu prompt y ver cómo se construye toda la aplicación en React y Tailwind en segundos, con vista previa interactiva en vivo y sin instalar nada en tu computadora.',
      badge: 'Recomendado Sesión 1',
      mockTitle: 'Construcción Instantánea',
      mockCode: 'Status: Levanto muros en React...\nEstilizo con Tailwind...\nVista previa lista en 12 segundos.'
    },
    {
      title: 'Editores con Agentes Integrados',
      analogy: 'El Taller de Remodelación Detallada',
      icon: <Terminal size={24} />,
      items: ['Cursor AI', 'Windsurf', 'VS Code + Copilot / Claude'],
      useCase: 'Cuando el proyecto crece y necesitas modificar archivos específicos en tu propia computadora con la ayuda de un copiloto o agente avanzado.',
      badge: 'Fase Avanzada',
      mockTitle: 'Edición en Local',
      mockCode: 'CMD+K: "Refactoriza el estado del barista para sincronizarlo con Supabase..."'
    }
  ];

  // Enviar reto
  const handleChallengeSubmit = (e) => {
    e.preventDefault();
    if (!challengeUrl) return;
    setChallengeSubmitted(true);
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.7 }
    });
  };

  return (
    <div className="app-wrapper">
      {/* NAVBAR */}
      <header className="navbar">
        <div className="container nav-container">
          <a href="#" className="brand">
            <div className="brand-icon-wrapper">
              <Coffee size={24} />
            </div>
            <div className="brand-title">
              <span>Cafetería Vibe Coder</span>
              <span className="brand-subtitle">American Space • Sesión 1</span>
            </div>
          </a>

          <ul className="nav-links">
            <li><a href="#paradigma" className="nav-link">El Paradigma</a></li>
            <li><a href="#mostrador" className="nav-link">Hola Mundo</a></li>
            <li><a href="#piezas" className="nav-link">Las 6 Piezas</a></li>
            <li><a href="#herramientas" className="nav-link">Ecosistema</a></li>
            <li><a href="#prompt-maestro" className="nav-link">Prompt Maestro</a></li>
            <li><a href="#laboratorio" className="nav-link">Deploy Lab</a></li>
            <li><a href="#reto" className="nav-link">Reto Sesión 2</a></li>
          </ul>

          <div className="nav-actions">
            <div className="coffee-counter-pill" title="Total de cafés servidos en esta cafetería web">
              <Coffee size={16} />
              <span>{cafesServidos} cafés</span>
            </div>
            <button
              onClick={() => setDevtoolsOpen(!devtoolsOpen)}
              className="btn btn-secondary"
              style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
            >
              <Eye size={16} />
              <span>DevTools</span>
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="hero-section" id="paradigma">
        <div className="container">
          <div className="hero-badge-group">
            <span className="badge badge-primary">
              <Sparkles size={14} /> AI Web & App Development - Vibe Coding
            </span>
            <span className="badge badge-secondary" style={{ background: 'rgba(255,255,255,0.06)', color: '#e2e8f0' }}>
              Hackathon Ready
            </span>
          </div>

          <h1 className="hero-title">
            Los Cimientos de la <span className="gradient-coffee">Cafetería Web</span>, "Hola Mundo" y Tu Primer Deploy
          </h1>

          <p className="hero-subtitle">
            Aprende a construir y publicar aplicaciones web completas en internet desde el día 1.
            Ya no eres el albañil que sufre con cada punto y coma: <span className="hero-highlight">ahora eres el Director de Producto y Arquitecto</span>.
          </p>

          {/* El Cambio de Paradigma: Antes vs Hoy */}
          <div className="paradigm-comparison">
            <div className="paradigm-box old">
              <div className="paradigm-header">
                <Hammer size={16} /> El Enfoque Tradicional
              </div>
              <div className="paradigm-role">El Albañil de Código</div>
              <p className="paradigm-desc">
                Meses aprendiendo sintaxis de memoria, frustración buscando dónde faltaba un punto y coma, y dejando el deploy para el último minuto del hackathon... donde casi siempre fallaba.
              </p>
            </div>

            <div className="paradigm-box new">
              <div className="paradigm-header">
                <Sparkles size={16} /> La Revolución Vibe Coding
              </div>
              <div className="paradigm-role">El Director de Producto & Arquitecto</div>
              <p className="paradigm-desc">
                Entiendes qué piezas componen una aplicación, le das instrucciones claras y estructuradas a la IA, auditas lo que construye y publicas en internet desde la primera hora.
              </p>
            </div>
          </div>

          {/* Los 3 Roles Principales */}
          <div className="roles-grid">
            <div className="glass-panel role-card">
              <div className="role-icon">
                <Coffee size={28} />
              </div>
              <div>
                <div className="role-analogy">Rol 1 • En la Cafetería</div>
                <div className="role-title">Tú (El Vibe Coder)</div>
              </div>
              <p className="role-text">
                Eres el <strong>Fundador y Director del Negocio</strong>. Tienes la visión del problema del hackathon a resolver, sabes qué experiencia dar al cliente y diriges la obra completa.
              </p>
            </div>

            <div className="glass-panel role-card">
              <div className="role-icon" style={{ borderColor: 'rgba(97, 218, 251, 0.4)', color: '#61dafb' }}>
                <Cpu size={28} />
              </div>
              <div>
                <div className="role-analogy" style={{ color: '#61dafb' }}>Rol 2 • Con IA</div>
                <div className="role-title">El Agente de IA</div>
              </div>
              <p className="role-text">
                Son tus <strong>Arquitectos y Constructores Ultra-rápidos</strong> (v0, Bolt, Lovable, Cursor). Les entregas tus planos hablados (prompts estructurados) y levantan el local en segundos.
              </p>
            </div>

            <div className="glass-panel role-card">
              <div className="role-icon" style={{ borderColor: 'rgba(56, 189, 248, 0.4)', color: '#38bdf8' }}>
                <Eye size={28} />
              </div>
              <div>
                <div className="role-analogy" style={{ color: '#38bdf8' }}>Rol 3 • En el Navegador</div>
                <div className="role-title">Chrome DevTools</div>
              </div>
              <p className="role-text">
                Son las <strong>Cámaras de Seguridad y Panel de Alarma</strong> del local (Clic derecho → Inspeccionar). Te permiten auditar cómo está armado cada mueble y leer qué falló si algo se rompe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 2: NUESTRO PRIMER "HOLA MUNDO" EN EL MOSTRADOR */}
      <section className="container" id="mostrador" style={{ scrollMarginTop: '80px' }}>
        <div className="section-header">
          <span className="section-tag">
            <Sliders size={16} /> Demostración Interactiva
          </span>
          <h2 className="section-title">Nuestro Primer "Hola Mundo" en el Mostrador</h2>
          <p className="section-desc">
            Observa cómo conviven <strong>React (JavaScript)</strong>, <strong>CSS (Tailwind)</strong> y <strong>HTML</strong> dentro del ejemplo mínimo de la cafetería. Activa el Modo Rayos X para inspeccionar cada capa.
          </p>
        </div>

        <div className="counter-showcase">
          {/* Controles de Rayos X */}
          <div className="xray-controls">
            <button
              onClick={() => setActiveXRay('all')}
              className={`xray-btn ${activeXRay === 'all' ? 'active' : ''}`}
            >
              <Sparkles size={16} /> Ver Todo Activo
            </button>
            <button
              onClick={() => setActiveXRay('html')}
              className={`xray-btn ${activeXRay === 'html' ? 'active' : ''}`}
              style={activeXRay === 'html' ? { borderColor: '#f97316', color: '#fdba74' } : {}}
            >
              <Layers size={16} /> 🧱 Solo HTML (Muros)
            </button>
            <button
              onClick={() => setActiveXRay('css')}
              className={`xray-btn ${activeXRay === 'css' ? 'active' : ''}`}
              style={activeXRay === 'css' ? { borderColor: '#38bdf8', color: '#7dd3fc' } : {}}
            >
              <Sparkles size={16} /> 🎨 Solo CSS (Pintura)
            </button>
            <button
              onClick={() => setActiveXRay('react')}
              className={`xray-btn ${activeXRay === 'react' ? 'active' : ''}`}
              style={activeXRay === 'react' ? { borderColor: '#61dafb', color: '#a5f3fc' } : {}}
            >
              <Code2 size={16} /> 🧠 Solo React (Barista)
            </button>
          </div>

          <div className="counter-grid">
            {/* Componente en Vivo: El Mostrador */}
            <div className="counter-stage">
              <div className="stage-ambient" />

              {/* Taza interactiva con vapor */}
              <div className="coffee-cup-visual">
                <div className="cup-steam">
                  <div className={`steam-line ${isBrewing ? 'steam-particle' : ''}`} style={{ animationDelay: '0s' }} />
                  <div className={`steam-line ${isBrewing ? 'steam-particle' : ''}`} style={{ animationDelay: '0.4s' }} />
                  <div className={`steam-line ${isBrewing ? 'steam-particle' : ''}`} style={{ animationDelay: '0.8s' }} />
                </div>
                <div className="cup-body">
                  <Coffee size={28} />
                  <div className="cup-handle" />
                </div>
                <div className="cup-saucer" />
              </div>

              {/* Elemento 1: HTML H1 */}
              <h1
                className={`counter-h1 ${activeXRay === 'html' || activeXRay === 'all' ? 'highlight-html' : ''}`}
                title="HTML: Etiqueta <h1> para el cartel del local"
              >
                ¡Hola Mundo! Bienvenido a mi Cafetería
              </h1>

              {/* Elemento 2: HTML P + React state */}
              <p
                className={`counter-p ${activeXRay === 'react' || activeXRay === 'all' ? 'highlight-react' : ''} ${activeXRay === 'html' ? 'highlight-html' : ''}`}
                title="HTML: Párrafo <p> | React: Muestra el estado {cafesServidos}"
              >
                Cafés servidos hoy:{' '}
                <span className="counter-number">{cafesServidos}</span>
              </p>

              {/* Elemento 3: HTML Button + CSS styling + React onClick */}
              <button
                onClick={handlePedirCafe}
                className={`counter-button ${activeXRay === 'css' || activeXRay === 'all' ? 'highlight-css' : ''} ${activeXRay === 'react' ? 'highlight-react' : ''} ${activeXRay === 'html' ? 'highlight-html' : ''}`}
                title="HTML: <button> | CSS: Clases de color y sombra | React: onClick handler"
              >
                <Coffee size={20} />
                <span>Pedir un Café al Barista</span>
              </button>

              <div style={{ marginTop: '1.25rem', fontSize: '0.8rem', color: '#a8988e' }}>
                💡 <em>¡Haz clic en el botón para ver al Barista despachar un café en vivo!</em>
              </div>
            </div>

            {/* Desglose de Capas en Código */}
            <div className="xray-details">
              {/* Capa 1: React */}
              <div className={`xray-card ${activeXRay === 'react' || activeXRay === 'all' ? 'active-layer' : ''}`}>
                <div className="xray-header">
                  <span className="xray-badge badge-react">1. React (JavaScript)</span>
                  <span style={{ fontSize: '0.78rem', color: '#61dafb', fontWeight: 600 }}>El Barista y su Memoria</span>
                </div>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                  El Barista recuerda cuántos cafés ha preparado en su pizarra de turno (<code style={{ color: '#fbbf24' }}>useState</code>) y suma 1 cada vez que el cliente hace clic en el botón físico.
                </p>
                <div className="xray-code-preview">
                  const [cafesServidos, setCafesServidos] = useState(0);<br />
                  {"onClick={() => setCafesServidos(cafesServidos + 1)}"}
                </div>
              </div>

              {/* Capa 2: CSS / Tailwind */}
              <div className={`xray-card ${activeXRay === 'css' || activeXRay === 'all' ? 'active-layer' : ''}`}>
                <div className="xray-header">
                  <span className="xray-badge badge-css">2. CSS (Tailwind)</span>
                  <span style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 600 }}>Diseño Interior & Pintura</span>
                </div>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                  Pinta el mostrador de color café oscuro, pone las letras blancas, centra el texto, redondea las esquinas y agrega sombra para darle volumen.
                </p>
                <div className="xray-code-preview">
                  className="p-8 bg-amber-950 text-white rounded-2xl text-center shadow-lg"
                </div>
              </div>

              {/* Capa 3: HTML */}
              <div className={`xray-card ${activeXRay === 'html' || activeXRay === 'all' ? 'active-layer' : ''}`}>
                <div className="xray-header">
                  <span className="xray-badge badge-html">3. HTML</span>
                  <span style={{ fontSize: '0.78rem', color: '#f97316', fontWeight: 600 }}>La Estructura Física</span>
                </div>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                  Coloca los muebles en su lugar: el cartel del local (<code style={{ color: '#fdba74' }}>&lt;h1&gt;</code>), el marcador (<code style={{ color: '#fdba74' }}>&lt;p&gt;</code>) y el botón físico en el mostrador (<code style={{ color: '#fdba74' }}>&lt;button&gt;</code>).
                </p>
                <div className="xray-code-preview">
                  &lt;h1&gt;¡Hola Mundo! Bienvenido a mi Cafetería&lt;/h1&gt;<br />
                  &lt;p&gt;Cafés servidos hoy: &#123;cafesServidos&#125;&lt;/p&gt;<br />
                  &lt;button&gt;Pedir un Café al Barista&lt;/button&gt;
                </div>
              </div>
            </div>
          </div>

          {/* Nota clave: ¿Por qué React (JavaScript)? */}
          <div className="react-callout">
            <div className="callout-icon">
              <Code2 size={28} />
            </div>
            <div>
              <div className="callout-title">Nota Clave de la Sesión 1: ¿Por qué decimos "React (JavaScript)"?</div>
              <p className="callout-desc">
                Los navegadores usan <strong>JavaScript</strong> como lenguaje nativo para dar vida y lógica a la web. Sin embargo, las herramientas modernas de IA no escriben JavaScript antiguo y desordenado ("puro"), sino que usan <strong>React</strong>: una tecnología creada con JavaScript que organiza toda tu cafetería como una franquicia moderna mediante <strong>Componentes</strong> (piezas tipo Lego reutilizables) y <strong>Estado</strong> (pantallas que se actualizan solas sin recargar el navegador).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 3: LAS 6 PIEZAS FUNDAMENTALES */}
      <section className="container" id="piezas" style={{ scrollMarginTop: '80px' }}>
        <div className="section-header">
          <span className="section-tag">
            <Layers size={16} /> Arquitectura Web
          </span>
          <h2 className="section-title">Las 6 Piezas Fundamentales de toda Web App</h2>
          <p className="section-desc">
            Toda aplicación web moderna que construyas con inteligencia artificial se compone de <strong>3 piezas de construcción dentro del local</strong> y <strong>3 piezas de infraestructura</strong>.
          </p>
        </div>

        {/* Filtros */}
        <div className="pieces-filter">
          <button
            onClick={() => setPiecesFilter('all')}
            className={`btn ${piecesFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
          >
            Todas las 6 Piezas
          </button>
          <button
            onClick={() => setPiecesFilter('local')}
            className={`btn ${piecesFilter === 'local' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
          >
            🏗️ Dentro del Local (3)
          </button>
          <button
            onClick={() => setPiecesFilter('infra')}
            className={`btn ${piecesFilter === 'infra' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
          >
            🌐 Infraestructura (3)
          </button>
        </div>

        {/* Grid de 6 piezas */}
        <div className="pieces-grid">
          {filteredPieces.map((piece) => (
            <div key={piece.id} className="piece-card">
              <div>
                <div className="piece-card-top">
                  <div className="piece-icon-circle">
                    {piece.icon}
                  </div>
                  <span className="piece-number">{piece.num}</span>
                </div>

                <div className="piece-name">{piece.tech}</div>
                <div className="piece-analogy">
                  <span>☕</span> {piece.analogy}
                </div>
                <p className="piece-desc">{piece.func}</p>
              </div>

              <div className="piece-demo-box">
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#fbbf24', fontWeight: 700 }}>
                  En código real:
                </span>
                <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', whiteSpace: 'pre-wrap' }}>
                  {piece.example}
                </code>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECCIÓN 4: MAPA DEL ECOSISTEMA DE VIBE CODING */}
      <section className="container tools-map" id="herramientas" style={{ scrollMarginTop: '80px' }}>
        <div className="section-header">
          <span className="section-tag">
            <Compass size={16} /> Ecosistema de Inteligencia Artificial
          </span>
          <h2 className="section-title">Mapa de Herramientas de Vibe Coding</h2>
          <p className="section-desc">
            No existe una sola herramienta mágica; existen <strong>3 categorías principales</strong> que combinamos según el momento del proyecto.
          </p>
        </div>

        {/* Pestañas de Navegación */}
        <div className="tools-nav-tabs">
          {toolsCategories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveToolTab(idx)}
              className={`tools-tab-btn ${activeToolTab === idx ? 'active' : ''}`}
            >
              <div className="tab-btn-icon">
                {cat.icon}
              </div>
              <div>
                <div className="tab-btn-title">{cat.title}</div>
                <div className="tab-btn-subtitle">{cat.analogy}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Contenido de la Pestaña Activa */}
        <div className="glass-panel tools-content-card">
          <div>
            <div className="tools-analogy-badge">
              <span>☕ Analogía:</span> {toolsCategories[activeToolTab].analogy}
            </div>

            <h3 className="tools-info-title">{toolsCategories[activeToolTab].title}</h3>

            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: '1.6' }}>
              <strong>Para qué usarlos:</strong> {toolsCategories[activeToolTab].useCase}
            </p>

            <div style={{ marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.05em', display: 'block', marginBottom: '0.5rem' }}>
                Herramientas destacadas:
              </span>
              <div className="tool-pills">
                {toolsCategories[activeToolTab].items.map((tool, i) => (
                  <span key={i} className="tool-chip">
                    <Sparkles size={14} color="#f59e0b" /> {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Visual Mock Window */}
          <div className="tools-visual-mock">
            <div className="mock-window-bar">
              <div className="mock-dot red" />
              <div className="mock-dot yellow" />
              <div className="mock-dot green" />
              <span style={{ fontSize: '0.78rem', color: '#888', marginLeft: 'auto', fontFamily: 'var(--font-mono)' }}>
                {toolsCategories[activeToolTab].badge}
              </span>
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fef3c7' }}>
              {toolsCategories[activeToolTab].mockTitle}
            </div>
            <div className="code-box" style={{ margin: 0, padding: '0.8rem', fontSize: '0.8rem' }}>
              <pre>{toolsCategories[activeToolTab].mockCode}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 5: CÓMO HABLARLE AL AGENTE & PROMPT MAESTRO */}
      <section className="container" id="prompt-maestro" style={{ scrollMarginTop: '80px' }}>
        <div className="section-header">
          <span className="section-tag">
            <Terminal size={16} /> Prompt Engineering para Hackathons
          </span>
          <h2 className="section-title">Cómo Hablarle al Agente: La Fórmula de 4 Capas</h2>
          <p className="section-desc">
            Para que la IA construya exactamente lo que imaginas en la primera sesión, evita instrucciones vagas como <em>"hazme una página bonita"</em> y usa esta estructura probada:
          </p>
        </div>

        {/* Las 4 Capas */}
        <div className="formula-grid">
          <div className="formula-card">
            <div className="formula-step-num">Capa 1</div>
            <div className="formula-card-title">Rol y Tecnología</div>
            <p className="formula-example">
              "Actúa como un diseñador UI/UX y desarrollador experto en React y Tailwind CSS..."
            </p>
          </div>

          <div className="formula-card">
            <div className="formula-step-num">Capa 2</div>
            <div className="formula-card-title">Objetivo y Contexto</div>
            <p className="formula-example">
              "Crea una aplicación web interactiva llamada... cuyo objetivo es enseñar/resolver..."
            </p>
          </div>

          <div className="formula-card">
            <div className="formula-step-num">Capa 3</div>
            <div className="formula-card-title">Secciones y Estructura</div>
            <p className="formula-example">
              Lista numerada con los bloques exactos, botones y componentes interactivos que debe tener la pantalla.
            </p>
          </div>

          <div className="formula-card">
            <div className="formula-step-num">Capa 4</div>
            <div className="formula-card-title">Estilo Visual y Reglas</div>
            <p className="formula-example">
              Paleta de colores (cálida, oscura, minimalista), tipografías y adaptación a celulares (responsive).
            </p>
          </div>
        </div>

        {/* El Prompt Maestro Copiable */}
        <div className="master-prompt-box">
          <div className="master-prompt-top">
            <div className="master-prompt-badge">
              <Sparkles size={18} /> El Prompt Maestro de la Sesión 1 (Listo para Copiar y Pegar)
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <button
                onClick={copyToClipboard}
                className="btn btn-primary"
                style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}
              >
                {copiedPrompt ? <Check size={18} /> : <Copy size={18} />}
                <span>{copiedPrompt ? '¡Copiado al Portapapeles!' : 'Copiar Prompt Maestro'}</span>
              </button>

              <a
                href="https://v0.dev"
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
                style={{ padding: '0.6rem 1rem', fontSize: '0.85rem' }}
              >
                <span>Abrir v0.dev</span> <ExternalLink size={15} />
              </a>

              <a
                href="https://bolt.new"
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
                style={{ padding: '0.6rem 1rem', fontSize: '0.85rem' }}
              >
                <span>Abrir Bolt.new</span> <ExternalLink size={15} />
              </a>
            </div>
          </div>

          <pre className="prompt-text-display">{masterPromptText}</pre>
        </div>
      </section>

      {/* SECCIÓN 6: LABORATORIO EN VIVO Y CHECKLIST DE DEPLOY */}
      <section className="container" id="laboratorio" style={{ scrollMarginTop: '80px' }}>
        <div className="section-header">
          <span className="section-tag">
            <Globe size={16} /> Laboratorio Práctico (60 Minutos)
          </span>
          <h2 className="section-title">Nuestro Primer "Meta-Deploy" en Vivo</h2>
          <p className="section-desc">
            <strong>Meta-Aprendizaje en acción:</strong> el primer proyecto real que desplegaremos en internet es una página web interactiva que explica esta misma clase.
          </p>
        </div>

        {/* 4 Pasos del Laboratorio */}
        <div className="lab-timeline">
          <div className="timeline-step">
            <span className="timeline-time">Paso 1 • 15 min</span>
            <div className="timeline-step-title">Generación con IA</div>
            <p className="timeline-step-desc">
              Entrar a v0.dev, Bolt.new o Lovable, pegar el Prompt Maestro y generar los muros, pintura y barista.
            </p>
          </div>

          <div className="timeline-step">
            <span className="timeline-time">Paso 2 • 10 min</span>
            <div className="timeline-step-title">Inspección de la Obra</div>
            <p className="timeline-step-desc">
              Probar el botón del barista y abrir Chrome DevTools (F12) para inspeccionar el DOM y estilos CSS.
            </p>
          </div>

          <div className="timeline-step">
            <span className="timeline-time">Paso 3 • 15 min</span>
            <div className="timeline-step-title">Guardar en la Bóveda</div>
            <p className="timeline-step-desc">
              Conectar tu cuenta de GitHub y guardar el repositorio con la máquina del tiempo de tus planos.
            </p>
          </div>

          <div className="timeline-step">
            <span className="timeline-time">Paso 4 • 20 min</span>
            <div className="timeline-step-title">Abrir en la Avenida</div>
            <p className="timeline-step-desc">
              Importar en Vercel.com en 1 clic, generar tu link público .vercel.app y abrirlo desde tu celular.
            </p>
          </div>
        </div>

        {/* Checklist Interactivo Guardado en LocalStorage */}
        <div className="glass-panel checklist-card">
          <div className="checklist-top">
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.3rem' }}>
                Checklist de 'Mi Primer Deploy'
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Tus avances se guardan en la <strong>Persistencia (LocalStorage)</strong> de tu navegador. Si recargas (F5), ¡no se borran!
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: checklistProgress === 100 ? '#10b981' : '#fbbf24' }}>
                {checklistProgress}% Completado
              </span>
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="progress-container">
            <div className="progress-bar-fill" style={{ width: `${checklistProgress}%` }} />
          </div>

          {/* Items */}
          <div className="checklist-items">
            {checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleChecklistItem(item.id)}
                className={`checklist-item ${item.checked ? 'checked' : ''}`}
              >
                <div className="custom-checkbox">
                  {item.checked && <Check size={16} />}
                </div>
                <div>
                  <div className="checklist-item-title">{item.title}</div>
                  <div className="checklist-item-detail">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {checklistProgress === 100 && (
            <div style={{ marginTop: '1.75rem', padding: '1.2rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <CheckCircle2 size={32} color="#10b981" />
              <div>
                <strong style={{ color: '#6ee7b7', fontSize: '1.05rem', display: 'block' }}>
                  ¡Felicitaciones, Arquitecto de Producto!
                </strong>
                <span style={{ fontSize: '0.88rem', color: '#d1fae5' }}>
                  Completaste todos los pasos de la Sesión 1. Tu local web está abierto al mundo 24/7 en Vercel.
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SECCIÓN 7: RETO PRÁCTICO PARA LA SESIÓN 2 */}
      <section className="container" id="reto" style={{ scrollMarginTop: '80px' }}>
        <div className="challenge-card">
          <div className="section-header" style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
            <span className="section-tag">
              <ShieldCheck size={16} /> Misión Hackathon
            </span>
            <h2 className="section-title">Reto Práctico: Tarea para la Sesión 2</h2>
            <p className="section-desc" style={{ margin: 0 }}>
              <strong>Misión antes de la próxima clase:</strong> Cada participante o equipo debe realizar un despliegue completo por su cuenta y enviar su enlace <code style={{ color: '#fbbf24' }}>.vercel.app</code> al grupo del curso.
            </p>
          </div>

          <div className="challenge-options">
            <div className={`challenge-box ${challengeOption === 'A' ? 'highlight-react' : ''}`} onClick={() => setChallengeOption('A')} style={{ cursor: 'pointer' }}>
              <div className="challenge-box-tag">Opción A (Recomendada para Equipos)</div>
              <h4 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Landing Page de su Proyecto de Hackathon</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Presenta a tu equipo, explica el problema social o tecnológico que van a resolver en American Space y agrega un botón interactivo de "Quiero ser voluntario / Notificarme".
              </p>
            </div>

            <div className={`challenge-box ${challengeOption === 'B' ? 'highlight-react' : ''}`} onClick={() => setChallengeOption('B')} style={{ cursor: 'pointer' }}>
              <div className="challenge-box-tag">Opción B (Creativa Individual)</div>
              <h4 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Tu Versión Personalizada de la Cafetería Web</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Adapta la analogía a otra temática visual (una pizzería web, un taller mecánico o una nave espacial) o añade una nueva sección interactiva usando la IA.
              </p>
            </div>
          </div>

          {/* Simulador de entrega de URL */}
          <div className="deploy-simulator-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.95rem', fontWeight: 700, color: '#fef3c7' }}>
              <Globe size={18} color="#4ade80" />
              <span>Simulador de Entrega de URL para Alumnos</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Pega aquí el enlace público de Vercel que generaste para simular tu entrega antes de enviarlo al WhatsApp del curso.
            </p>

            <form onSubmit={handleChallengeSubmit} className="simulator-form">
              <input
                type="url"
                required
                placeholder="https://mi-proyecto-hackathon.vercel.app"
                value={challengeUrl}
                onChange={(e) => setChallengeUrl(e.target.value)}
                className="simulator-input"
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
                <Send size={16} />
                <span>Validar Entrega</span>
              </button>
            </form>

            {challengeSubmitted && (
              <div style={{ marginTop: '1rem', padding: '0.9rem 1.1rem', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', borderRadius: 'var(--radius-sm)', color: '#a7f3d0', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <CheckCircle2 size={18} color="#10b981" />
                <span>¡Excelente trabajo! Tu proyecto <strong>{challengeUrl}</strong> cumple los requisitos para la Sesión 2.</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* DEVTOOLS DRAWER SIMULATOR */}
      {devtoolsOpen && (
        <aside className="devtools-drawer">
          <div className="devtools-drawer-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <Eye size={16} color="#38bdf8" />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
                Chrome DevTools Simulator (Cámaras de Seguridad)
              </span>
              <div className="devtools-tabs">
                <button
                  onClick={() => setDevtoolsTab('elements')}
                  className={`devtools-tab ${devtoolsTab === 'elements' ? 'active' : ''}`}
                >
                  Elements (Muros HTML)
                </button>
                <button
                  onClick={() => setDevtoolsTab('styles')}
                  className={`devtools-tab ${devtoolsTab === 'styles' ? 'active' : ''}`}
                >
                  Styles (Pintura CSS)
                </button>
                <button
                  onClick={() => setDevtoolsTab('console')}
                  className={`devtools-tab ${devtoolsTab === 'console' ? 'active' : ''}`}
                >
                  Console (Alarmas)
                </button>
              </div>
            </div>

            <button
              onClick={() => setDevtoolsOpen(false)}
              style={{ background: 'transparent', border: 'none', color: '#bbb', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <X size={18} />
            </button>
          </div>

          <div className="devtools-body">
            {devtoolsTab === 'elements' && (
              <div>
                <span style={{ color: '#6a9955' }}>&lt;!-- Muros y muebles de la cafetería --&gt;</span><br />
                <span style={{ color: '#569cd6' }}>&lt;div</span> <span style={{ color: '#9cdcfe' }}>class</span>=<span style={{ color: '#ce9178' }}>"mostrador-cafeteria"</span><span style={{ color: '#569cd6' }}>&gt;</span><br />
                &nbsp;&nbsp;<span style={{ color: '#569cd6' }}>&lt;h1&gt;</span>¡Hola Mundo! Bienvenido a mi Cafetería<span style={{ color: '#569cd6' }}>&lt;/h1&gt;</span><br />
                &nbsp;&nbsp;<span style={{ color: '#569cd6' }}>&lt;p&gt;</span>Cafés servidos hoy: <span style={{ color: '#b5cea8' }}>{cafesServidos}</span><span style={{ color: '#569cd6' }}>&lt;/p&gt;</span><br />
                &nbsp;&nbsp;<span style={{ color: '#569cd6' }}>&lt;button</span> <span style={{ color: '#9cdcfe' }}>onClick</span>=<span style={{ color: '#ce9178' }}>"pedirCafe()"</span><span style={{ color: '#569cd6' }}>&gt;</span>Pedir un Café al Barista<span style={{ color: '#569cd6' }}>&lt;/button&gt;</span><br />
                <span style={{ color: '#569cd6' }}>&lt;/div&gt;</span>
              </div>
            )}

            {devtoolsTab === 'styles' && (
              <div>
                <span style={{ color: '#6a9955' }}>/* Reglas de Diseño de Interiores (Pintura y Luces) */</span><br />
                <span style={{ color: '#d7ba7d' }}>.mostrador-cafeteria</span> &#123;<br />
                &nbsp;&nbsp;<span style={{ color: '#9cdcfe' }}>background-color</span>: <span style={{ color: '#ce9178' }}>#23120b</span>; <span style={{ color: '#6a9955' }}>/* bg-amber-950 */</span><br />
                &nbsp;&nbsp;<span style={{ color: '#9cdcfe' }}>color</span>: <span style={{ color: '#ce9178' }}>#ffffff</span>; <span style={{ color: '#6a9955' }}>/* text-white */</span><br />
                &nbsp;&nbsp;<span style={{ color: '#9cdcfe' }}>border-radius</span>: <span style={{ color: '#b5cea8' }}>1rem</span>; <span style={{ color: '#6a9955' }}>/* rounded-2xl */</span><br />
                &nbsp;&nbsp;<span style={{ color: '#9cdcfe' }}>box-shadow</span>: <span style={{ color: '#b5cea8' }}>0 10px 25px rgba(0,0,0,0.5)</span>;<br />
                &#125;
              </div>
            )}

            {devtoolsTab === 'console' && (
              <div>
                <span style={{ color: '#6a9955' }}>// Consola de Alarma del Barista</span><br />
                <span style={{ color: '#4ec9b0' }}>[INFO]</span> Barista listo en estación modular de React.<br />
                <span style={{ color: '#4ec9b0' }}>[STATE]</span> cafesServidos actualizado a: <strong style={{ color: '#f59e0b' }}>{cafesServidos}</strong><br />
                <span style={{ color: '#4ec9b0' }}>[VERCEL]</span> Conexión 24/7 activa en puerto seguro HTTPS.<br />
                <span style={{ color: '#10b981' }}>✓ 0 errores encontrados en la obra. Todo el local opera normalmente.</span>
              </div>
            )}
          </div>
        </aside>
      )}

      {/* FOOTER */}
      <footer className="footer">
        <div className="container footer-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Coffee size={24} color="#f59e0b" />
            <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
              La Cafetería del Vibe Coder
            </span>
          </div>

          <p className="footer-tagline">
            Curso <strong>AI Web & App Development - Vibe Coding</strong> • American Space.<br />
            Diseñado para participantes de Hackathon y principiantes sin experiencia previa.
          </p>

          <div className="footer-credits">
            <span>Construido con HTML5, CSS3 y React</span>
            <span>•</span>
            <span>Deploy inmediato en Vercel</span>
            <span>•</span>
            <span>Sesión 1 de 4</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
