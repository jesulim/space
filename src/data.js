import {
  BrickWall,
  PaintRoller,
  ChefHat,
  Warehouse,
  Vault,
  Store,
  Coffee,
  Bot,
  Cctv,
  Compass,
  Hammer,
  Wrench,
} from 'lucide-react';
import photoOwner from './assets/photos/owner.webp';
import photoPlans from './assets/photos/plans.webp';
import photoCamera from './assets/photos/camera.webp';
import photoMeeting from './assets/photos/meeting.webp';
import photoStorefront from './assets/photos/storefront.webp';
import photoTools from './assets/photos/tools.webp';

export const NAV = [
  { id: 'idea', label: 'La idea', hint: 'antes y ahora' },
  { id: 'piezas', label: 'Las 6 piezas', hint: 'HTML → Vercel' },
  { id: 'mostrador', label: 'Mostrador', hint: 'hola mundo' },
  { id: 'equipo', label: 'Equipo', hint: 'herramientas' },
  { id: 'receta', label: 'Receta', hint: 'el prompt' },
  { id: 'deploy', label: 'Deploy', hint: 'tu link' },
  { id: 'reto', label: 'Reto', hint: 'sesión 2' },
];

export const ZONES = [
  { id: 'local', label: 'Dentro del local' },
  { id: 'infra', label: 'Infraestructura' },
];

// Cada pieza es una analogía partida en dos: la cafetería y la web
export const PIECES = [
  {
    id: 'html',
    num: '01',
    zone: 'local',
    color: 'html',
    icon: BrickWall,
    cafe: 'Los muros y los carteles',
    short: 'Muros y carteles',
    cafeLine: 'Lo que existe dentro del local.',
    tech: 'HTML',
    webLine: 'Lo que existe en la pantalla.',
    code: '<h1>Mi cafetería</h1>\n<button>Pedir café</button>',
  },
  {
    id: 'css',
    num: '02',
    zone: 'local',
    color: 'css',
    icon: PaintRoller,
    cafe: 'La pintura y las luces',
    short: 'Pintura y luces',
    cafeLine: 'Cómo se ve el local.',
    tech: 'CSS',
    techNote: 'o Tailwind',
    webLine: 'Cómo se ve la pantalla.',
    code: 'bg-amber-700 rounded-full shadow-lg',
  },
  {
    id: 'react',
    num: '03',
    zone: 'local',
    color: 'react',
    icon: ChefHat,
    cafe: 'El barista',
    short: 'Barista',
    cafeLine: 'Escucha el pedido y lo prepara.',
    tech: 'React',
    techNote: 'JavaScript',
    webLine: 'Escucha el clic y actualiza la pantalla.',
    code: 'const [cafes, setCafes] = useState(0);',
  },
  {
    id: 'storage',
    num: '04',
    zone: 'infra',
    color: 'storage',
    icon: Warehouse,
    cafe: 'El almacén con llave',
    short: 'Almacén con llave',
    cafeLine: 'Lo guardado sigue ahí mañana.',
    tech: 'LocalStorage',
    techNote: 'o base de datos',
    webLine: 'Los datos sobreviven al F5.',
    code: "localStorage.setItem('cafes', 12);",
  },
  {
    id: 'github',
    num: '05',
    zone: 'infra',
    color: 'github',
    icon: Vault,
    cafe: 'La bóveda de planos',
    short: 'Bóveda de planos',
    cafeLine: 'Cada versión del local, guardada.',
    tech: 'GitHub',
    webLine: 'Cada versión del código, guardada.',
    code: 'git commit -m "nuevo mostrador"',
  },
  {
    id: 'vercel',
    num: '06',
    zone: 'infra',
    color: 'vercel',
    icon: Store,
    cafe: 'El local en la avenida',
    short: 'Local en la avenida',
    cafeLine: 'Abierto al público, 24/7.',
    tech: 'Vercel',
    webLine: 'Tu link público, 24/7.',
    code: 'https://mi-cafeteria.vercel.app',
  },
];

export const ROLES = [
  {
    id: 'tu',
    tone: 'accent',
    icon: Coffee,
    cafe: 'El dueño del local',
    cafeLine: 'Tiene la visión y dirige la obra.',
    photo: { src: photoOwner, alt: 'Una barista detrás de la barra de su cafetería' },
    web: 'Tú, el vibe coder',
    webLine: 'Decides qué construir y para quién.',
  },
  {
    id: 'ia',
    tone: 'storage',
    icon: Bot,
    cafe: 'La constructora',
    cafeLine: 'Levanta el local con tus planos.',
    photo: { src: photoPlans, alt: 'Un arquitecto dibujando planos con lápiz y regla' },
    web: 'La IA',
    webLine: 'Construye la app a partir de tus prompts.',
  },
  {
    id: 'devtools',
    tone: 'css',
    icon: Cctv,
    cafe: 'Las cámaras de seguridad',
    cafeLine: 'Ves todo lo que pasa adentro.',
    photo: { src: photoCamera, alt: 'Una cámara de seguridad blanca en una pared' },
    web: 'Chrome DevTools',
    webLine: 'Clic derecho → Inspeccionar.',
  },
];

export const LAYERS = [
  {
    id: 'html',
    tech: 'HTML',
    cafe: 'Los muros',
    line: 'Pone el cartel, el marcador y el botón.',
    code: '<h1>¡Hola mundo!</h1>\n<p>Cafés servidos: 0</p>\n<button>Pedir un café</button>',
  },
  {
    id: 'css',
    tech: 'CSS',
    cafe: 'La pintura',
    line: 'Colores, bordes, sombra y tipografía.',
    code: 'bg-amber-50 rounded-2xl shadow-lg\nbg-amber-700 rounded-full',
  },
  {
    id: 'react',
    tech: 'React',
    cafe: 'El barista',
    line: 'Recuerda la cuenta y responde al clic.',
    code: 'const [cafes, setCafes] = useState(0);\nonClick={() => setCafes(cafes + 1)}',
  },
];

export const TOOLS = [
  {
    id: 'consultores',
    icon: Compass,
    cafe: 'Los asesores de negocio',
    cafeLine: 'Te ayudan a aterrizar la idea.',
    photo: { src: photoMeeting, alt: 'Dos personas conversando un plan con café y una laptop' },
    web: 'Consultores',
    webLine: 'Planear la idea y escribir el prompt.',
    items: ['ChatGPT', 'Claude', 'Gemini'],
    phase: 'Planear',
  },
  {
    id: 'constructores',
    icon: Hammer,
    cafe: 'La constructora llave en mano',
    cafeLine: 'Te entrega el local listo.',
    photo: { src: photoStorefront, alt: 'Un local nuevo con las puertas de vidrio abiertas' },
    web: 'Constructores en el navegador',
    webLine: 'Del prompt a la app, sin instalar nada.',
    items: ['v0', 'Bolt.new', 'Lovable'],
    phase: 'Construir · Sesión 1',
  },
  {
    id: 'editores',
    icon: Wrench,
    cafe: 'El taller de remodelación',
    cafeLine: 'Arreglos finos, pieza por pieza.',
    photo: { src: photoTools, alt: 'Herramientas de carpintería sobre una mesa de madera' },
    web: 'Editores con agentes',
    webLine: 'Cambios precisos en tu computadora.',
    items: ['Cursor', 'Windsurf', 'VS Code + Copilot'],
    phase: 'Pulir',
  },
];

// La fórmula de 4 capas, servida como un latte (de abajo hacia arriba)
export const RECIPE = [
  {
    title: 'Rol',
    layer: 'El espresso',
    line: 'Quién construye.',
    example: '"Actúa como diseñador UI/UX experto en React y Tailwind…"',
    color: '#4A2C1D',
    ink: '#FFF3E6',
  },
  {
    title: 'Objetivo',
    layer: 'La leche',
    line: 'Qué construye y para qué.',
    example: '"Crea una web que enseñe cómo funciona una app…"',
    color: '#9A6440',
    ink: '#FFF3E6',
  },
  {
    title: 'Estructura',
    layer: 'La espuma',
    line: 'Qué secciones lleva.',
    example: '"1. Portada  2. Demo interactiva  3. Las 6 piezas…"',
    color: '#E2C29E',
    ink: '#4A2C1D',
  },
  {
    title: 'Estilo',
    layer: 'El arte latte',
    line: 'Cómo se ve y se siente.',
    example: '"Colores claros y cálidos, adaptada a celular."',
    color: '#FFF6EA',
    ink: '#4A2C1D',
  },
];

export const LAB_STEPS = [
  { time: '15 min', title: 'Generar con IA', cafe: 'Construir el local', line: 'Pega el prompt en v0, Bolt o Lovable.' },
  { time: '10 min', title: 'Inspeccionar', cafe: 'Revisar las cámaras', line: 'Prueba el botón y abre DevTools (F12).' },
  { time: '15 min', title: 'Guardar en GitHub', cafe: 'Guardar los planos', line: 'Sube el código a tu bóveda.' },
  { time: '20 min', title: 'Publicar en Vercel', cafe: 'Abrir al público', line: 'Importa el repo y abre tu link en el celular.' },
];

export const CHECKLIST = [
  { id: 1, title: 'Escribir el prompt en 4 capas', desc: 'Rol, objetivo, estructura y estilo.', checked: true },
  { id: 2, title: 'Generar la web con IA', desc: 'En v0, Bolt.new o Lovable.', checked: false },
  { id: 3, title: 'Inspeccionar con DevTools', desc: 'F12: mira los muros (HTML) y la pintura (CSS).', checked: false },
  { id: 4, title: 'Guardar en GitHub', desc: 'Tu bóveda de planos con máquina del tiempo.', checked: false },
  { id: 5, title: 'Publicar en Vercel', desc: 'Importa el repo y obtén tu link .vercel.app.', checked: false },
  { id: 6, title: 'Abrirla en tu celular', desc: 'Compruébala y compártela por WhatsApp.', checked: false },
];

export const MASTER_PROMPT = `Actúa como un diseñador UI/UX y desarrollador experto en React y Tailwind CSS. Crea una aplicación web educativa e interactiva llamada 'La Anatomía de una Web App: La Cafetería del Vibe Coder'.
El objetivo es enseñar cómo funciona una aplicación web moderna usando una única analogía continua: abrir y operar una cafetería.
Incluye las siguientes secciones con un diseño moderno, cálido e intuitivo, totalmente adaptable a celulares:
1. Hero Principal: Título llamativo explicando que en el Vibe Coding tú eres el Director del local y la IA es tu equipo constructor.
2. Demostración 'Hola Mundo' en el Mostrador: Un componente interactivo real donde el usuario pueda hacer clic en 'Pedir un Café al Barista', aumentando un contador en vivo y mostrando con etiquetas visuales qué parte es HTML (el cartel y botón), cuál es CSS/Tailwind (los colores y bordes) y cuál es React/JavaScript (el contador y la acción del clic).
3. Las 6 Piezas de la Cafetería (Tarjetas interactivas): HTML (Muros, Mesas y Carteles), CSS / Tailwind (Diseño de Interiores, Pintura y Luces), React / JavaScript (El Barista, Estaciones Modulares y Pizarra de Estado), Persistencia / LocalStorage (El Almacén con Llave que no se borra al recargar), GitHub (La Bóveda de Planos con Máquina del Tiempo) y Vercel (El Local Abierto en la Avenida Principal con link público).
4. Mapa de Herramientas de Vibe Coding: Pestañas interactivas explicando Consultores (ChatGPT, Claude, Gemini), Constructores en Navegador (v0, Bolt, Lovable) y Editores con Agentes (Cursor, Windsurf).
5. Checklist Interactivo de 'Mi Primer Deploy': Lista de pasos (Crear prompt, Generar app, Subir a GitHub, Publicar en Vercel, Compartir link) que el alumno pueda marcar y que quede guardada en el navegador.`;

// Recursos externos usados en la página (licencia de Unsplash y Lottie Simple License)
export const CREDITS = {
  photos: [
    { name: 'Nathan Dumlao', url: 'https://unsplash.com/photos/top-view-photography-of-heart-latte-coffee-XOhI_kW_TaM' },
    { name: 'Brooke Balentine', url: 'https://unsplash.com/photos/a-barista-stands-behind-a-counter-in-a-coffee-shop-nBR694hNslc' },
    { name: 'Daniel McCullough', url: 'https://unsplash.com/photos/an-architect-working-on-a-draft-with-a-pencil-and-ruler-HtBlQdxfG9k' },
    { name: 'Alan J. Hendry', url: 'https://unsplash.com/photos/white-surveillance-camera-hanging-on-wall-KNt4zd8HPb0' },
    { name: 'Vitaly Gariev', url: 'https://unsplash.com/photos/two-businessmen-in-a-meeting-with-laptop-and-laptop-1gMIeDTl2u8' },
    { name: 'Trista Le', url: 'https://unsplash.com/photos/modern-black-storefront-with-open-glass-doors-PyHrr8nZXvs' },
    { name: 'Dominik Scythe', url: 'https://unsplash.com/photos/hand-tools-on-top-of-table-v8vz-Roj8zo' },
  ],
  animations: [
    { name: 'Santiago Manuel Nogueira', url: 'https://lottiefiles.com/free-animation/smoke-steam-TmcZrUsVLT' },
    { name: 'Sebastián Nieto', url: 'https://lottiefiles.com/free-animation/cup-of-coffee-cnMpFnUDxV' },
  ],
};
