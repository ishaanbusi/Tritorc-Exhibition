export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  images: string[];
  images360?: string[]; // For 360° view
  model3D: string;
  modelAR: string;
  videos: string[];
  specifications: Specification[];
  variants?: Variant[];
  components?: Component[]; // For exploded view
  qrCode: string;
  features: string[];
  selectorData?: SelectorData; // For model-based specifications
}

export interface Specification {
  label: string;
  value: string;
  unit?: string;
}

export interface Variant {
  id: string;
  name: string;
  specs: Specification[];
}

export interface Component {
  id: string;
  name: string;
  description?: string;
}

export interface SelectorData {
  models: string[];
  generalTechnicalDrawing?: string;
  technicalData: {
    [modelName: string]: TechnicalData;
  };
  dimensionalData: {
    [modelName: string]: DimensionalData;
  };
}

export interface TechnicalData {
  squareDrive?: string;
  minTorque?: { metric: string; imperial: string };
  maxTorque?: { metric: string; imperial: string };
  weight?: { metric: string; imperial: string };
  [key: string]: any; // Allow additional properties
}

export interface DimensionalData {
  bodyLength?: { metric: string; imperial: string };
  overallLength?: { metric: string; imperial: string };
  toolWidth?: { metric: string; imperial: string };
  overallWidth?: { metric: string; imperial: string };
  toolHeight?: { metric: string; imperial: string };
  overallHeight?: { metric: string; imperial: string };
  toolRadius?: { metric: string; imperial: string };
  reactionReach?: { metric: string; imperial: string };
  [key: string]: any; // Allow additional properties
}

// Product database with PLACEHOLDER URLs for immediate testing
const PRODUCTS: Product[] = [
  {
    id: 'tsl-series',
    slug: 'tsl-torque-multiplier-series',
    name: 'TSL Series Torque Multiplier',
    category: 'Torque Multipliers',
    description: 'Professional torque multiplier series with multiple model variants for various industrial applications',
    images: [
      '/images/hydraulic-torque-wrench.png',
      '/images/thl-tool.png',
      '/images/TSF-Machine-with-Pipe-(Tej)-01.png'

    ],
    images360: [
      'https://placehold.co/800x600/1a1a1a/D6212F?text=TSL+360-0',
      'https://placehold.co/800x600/1a1a1a/D6212F?text=TSL+360-90',
      'https://placehold.co/800x600/1a1a1a/D6212F?text=TSL+360-180',
      'https://placehold.co/800x600/1a1a1a/D6212F?text=TSL+360-270',
    ],
    model3D: '/models/rig.glb',
    modelAR: '/models/rig.glb',
    videos: [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    ],
    specifications: [
      { label: 'Series Type', value: 'TSL', unit: '' },
      { label: 'Drive Type', value: 'Square Drive', unit: '' },
      { label: 'Models Available', value: '11', unit: '' },
      { label: 'Max Torque Range', value: '1120-69247', unit: 'Nm' },
    ],
    components: [
      { id: 'body', name: 'Main Body', description: 'Housing and gear mechanism' },
      { id: 'drive', name: 'Square Drive', description: 'Output drive socket' },
      { id: 'reaction', name: 'Reaction Arm', description: 'Torque reaction point' },
      { id: 'input', name: 'Input Socket', description: 'Input connection' },
    ],
    qrCode: 'TSL-SERIES-2024',
    features: [
      'Multiple model variants',
      'High precision gearing',
      'Durable construction',
      'Easy maintenance',
      'Metric & Imperial specs',
      'Wide torque range',
    ],
    selectorData: {
      models: ['TSL-07', 'TSL-1', 'TSL-3', 'TSL-5', 'TSL-8', 'TSL-10', 'TSL-15', 'TSL-20', 'TSL-25', 'TSL-35', 'TSL-50'],
      generalTechnicalDrawing: '/assets/img/tsl-technical-drawing.webp',
      technicalData: {
        'TSL-07': {
          squareDrive: '3/4"',
          minTorque: { metric: '112 Nm', imperial: '83 Ft. Lbs.' },
          maxTorque: { metric: '1120 Nm', imperial: '826 Ft. Lbs.' },
          weight: { metric: '1.8 Kg', imperial: '3.9 Lbs.' },
        },
        'TSL-1': {
          squareDrive: '3/4"',
          minTorque: { metric: '183 Nm', imperial: '135 Ft. Lbs.' },
          maxTorque: { metric: '1837 Nm', imperial: '1355 Ft. Lbs.' },
          weight: { metric: '2.5 Kg', imperial: '5.5 Lbs.' },
        },
        'TSL-3': {
          squareDrive: '1"',
          minTorque: { metric: '450 Nm', imperial: '332 Ft. Lbs.' },
          maxTorque: { metric: '4500 Nm', imperial: '3319 Ft. Lbs.' },
          weight: { metric: '4.9 Kg', imperial: '10.8 Lbs.' },
        },
        'TSL-5': {
          squareDrive: '1.1/2"',
          minTorque: { metric: '737 Nm', imperial: '544 Ft. Lbs.' },
          maxTorque: { metric: '7379 Nm', imperial: '5442 Ft. Lbs.' },
          weight: { metric: '9.5 Kg', imperial: '20.9 Lbs.' },
        },
        'TSL-8': {
          squareDrive: '1.1/2"',
          minTorque: { metric: '1078 Nm', imperial: '795 Ft. Lbs.' },
          maxTorque: { metric: '10780 Nm', imperial: '7951 Ft. Lbs.' },
          weight: { metric: '10.8 Kg', imperial: '23.8 Lbs.' },
        },
        'TSL-10': {
          squareDrive: '1.1/2"',
          minTorque: { metric: '1551 Nm', imperial: '1144 Ft. Lbs.' },
          maxTorque: { metric: '15519 Nm', imperial: '11446 Ft. Lbs.' },
          weight: { metric: '14.7 Kg', imperial: '32.4 Lbs.' },
        },
        'TSL-15': {
          squareDrive: '2.1/2"',
          minTorque: { metric: '2176 Nm', imperial: '1605 Ft. Lbs.' },
          maxTorque: { metric: '22505 Nm', imperial: '16599 Ft. Lbs.' },
          weight: { metric: '23 Kg', imperial: '50.7 Lbs.' },
        },
        'TSL-20': {
          squareDrive: '2.1/2"',
          minTorque: { metric: '3045 Nm', imperial: '2246 Ft. Lbs.' },
          maxTorque: { metric: '30461 Nm', imperial: '22467 Ft. Lbs.' },
          weight: { metric: '26 Kg', imperial: '57.3 Lbs.' },
        },
        'TSL-25': {
          squareDrive: '2.1/2"',
          minTorque: { metric: '3472 Nm', imperial: '2561 Ft. Lbs.' },
          maxTorque: { metric: '34725 Nm', imperial: '25612 Ft. Lbs.' },
          weight: { metric: '35 Kg', imperial: '77.1 Lbs.' },
        },
        'TSL-35': {
          squareDrive: '2.1/2"',
          minTorque: { metric: '4886 Nm', imperial: '3604 Ft. Lbs.' },
          maxTorque: { metric: '48666 Nm', imperial: '36042 Ft. Lbs.' },
          weight: { metric: '50 Kg', imperial: '110.2 Lbs.' },
        },
        'TSL-50': {
          squareDrive: '2.1/2"',
          minTorque: { metric: '6925 Nm', imperial: '5108 Ft. Lbs.' },
          maxTorque: { metric: '69247 Nm', imperial: '51074 Ft. Lbs.' },
          weight: { metric: '65 Kg', imperial: '143.3 Lbs.' },
        },
      },
      dimensionalData: {
        'TSL-07': {
          bodyLength: { metric: '117 mm', imperial: '4.61 inch' },
          overallLength: { metric: '139 mm', imperial: '5.47 inch' },
          toolWidth: { metric: '42 mm', imperial: '1.65 inch' },
          overallWidth: { metric: '67 mm', imperial: '2.64 inch' },
          toolHeight: { metric: '80 mm', imperial: '3.15 inch' },
          overallHeight: { metric: '117 mm', imperial: '4.61 inch' },
        },
        'TSL-1': {
          bodyLength: { metric: '143 mm', imperial: '5.63 inch' },
          overallLength: { metric: '171 mm', imperial: '6.73 inch' },
          toolWidth: { metric: '52 mm', imperial: '2.05 inch' },
          overallWidth: { metric: '75 mm', imperial: '2.95 inch' },
        },
        'TSL-3': {
          bodyLength: { metric: '178 mm', imperial: '7.01 inch' },
          overallLength: { metric: '228 mm', imperial: '8.98 inch' },
          toolWidth: { metric: '69.5 mm', imperial: '2.74 inch' },
          overallWidth: { metric: '97 mm', imperial: '3.82 inch' },
        },
        // Add more models as needed...
      },
    },
  },
  {
    id: 'thl-4',
    slug: 'thl-4-torque-tool',
    name: 'THL-4 Hydraulic Torque Wrench',
    category: 'Torque Tools',
    description: 'Professional hydraulic torque wrench for industrial applications',
    images: [
      'https://placehold.co/800x600/1a1a1a/D6212F?text=THL-4+Main+View',
      'https://placehold.co/800x600/1a1a1a/D6212F?text=THL-4+Side+View',
      'https://placehold.co/800x600/1a1a1a/D6212F?text=THL-4+Detail',
    ],
    model3D: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    modelAR: 'https://modelviewer.dev/shared-assets/models/Astronaut.usdz',
    videos: [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    ],
    specifications: [
      { label: 'Min Torque', value: '607', unit: 'Nm' },
      { label: 'Max Torque', value: '6069', unit: 'Nm' },
      { label: 'Weight', value: '3.2', unit: 'Kg' },
      { label: 'Hex Range', value: '33-80', unit: 'mm' },
      { label: 'Overall Length', value: '218', unit: 'mm' },
    ],
    variants: [
      {
        id: 'thl-4-33-56',
        name: '33-56mm Range',
        specs: [
          { label: 'Hex Range', value: '33-56', unit: 'mm' },
          { label: 'Length', value: '202', unit: 'mm' },
        ],
      },
      {
        id: 'thl-4-57-80',
        name: '57-80mm Range',
        specs: [
          { label: 'Hex Range', value: '57-80', unit: 'mm' },
          { label: 'Length', value: '218', unit: 'mm' },
        ],
      },
    ],
    qrCode: 'THL4-2024',
    features: [
      'Precision torque control',
      'Dual drive mechanism',
      'Industrial grade construction',
      'Multiple hex ranges',
      'High durability',
      'Easy maintenance',
    ],
  },
  {
    id: 'thl-2',
    slug: 'thl-2-torque-tool',
    name: 'THL-2 Hydraulic Torque Wrench',
    category: 'Torque Tools',
    description: 'Compact hydraulic torque wrench for precision applications',
    images: [
      'https://placehold.co/800x600/1a1a1a/D6212F?text=THL-2+Main+View',
      'https://placehold.co/800x600/1a1a1a/D6212F?text=THL-2+Side+View',
      'https://placehold.co/800x600/1a1a1a/D6212F?text=THL-2+Detail',
    ],
    model3D: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    modelAR: 'https://modelviewer.dev/shared-assets/models/Astronaut.usdz',
    videos: [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    ],
    specifications: [
      { label: 'Min Torque', value: '273', unit: 'Nm' },
      { label: 'Max Torque', value: '2728', unit: 'Nm' },
      { label: 'Weight', value: '1.5', unit: 'Kg' },
      { label: 'Hex Range', value: '19-48', unit: 'mm' },
    ],
    variants: [
      {
        id: 'thl-2-19-35',
        name: '19-35mm Range',
        specs: [
          { label: 'Hex Range', value: '19-35', unit: 'mm' },
        ],
      },
      {
        id: 'thl-2-36-48',
        name: '36-48mm Range',
        specs: [
          { label: 'Hex Range', value: '36-48', unit: 'mm' },
        ],
      },
    ],
    qrCode: 'THL2-2024',
    features: [
      'Compact design',
      'Precision control',
      'Lightweight',
      'Easy to use',
    ],
  },
];

export function getAllProducts(): Product[] {
  return PRODUCTS;
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

export function searchProducts(query: string): Product[] {
  const lowercaseQuery = query.toLowerCase();
  return PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(lowercaseQuery) ||
      p.description.toLowerCase().includes(lowercaseQuery) ||
      p.features.some((f) => f.toLowerCase().includes(lowercaseQuery))
  );
}