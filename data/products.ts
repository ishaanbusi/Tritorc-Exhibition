export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  images: string[];
  model3D: string;
  modelAR: string;
  videos: string[];
  specifications: Specification[];
  variants: Variant[];
  qrCode: string;
  features: string[];
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

// Product database with PLACEHOLDER URLs for immediate testing
const PRODUCTS: Product[] = [
  {
    id: 'thl-4',
    slug: 'thl-4-torque-tool',
    name: 'THL-4 Hydraulic Torque Wrench',
    category: 'Torque Tools',
    description: 'Professional hydraulic torque wrench for industrial applications',
    // Using placeholder images that work immediately
    images: [
      'https://placehold.co/800x600/1a1a1a/white?text=THL-4+Main+View',
      'https://placehold.co/800x600/1a1a1a/white?text=THL-4+Side+View',
      'https://placehold.co/800x600/1a1a1a/white?text=THL-4+Detail',
    ],
    // Using demo 3D models that work
    model3D: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    modelAR: 'https://modelviewer.dev/shared-assets/models/Astronaut.usdz',
    // Using demo video that works
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
      'https://placehold.co/800x600/1a1a1a/white?text=THL-2+Main+View',
      'https://placehold.co/800x600/1a1a1a/white?text=THL-2+Side+View',
      'https://placehold.co/800x600/1a1a1a/white?text=THL-2+Detail',
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
  {
    id: 'thl-6',
    slug: 'thl-6-torque-tool',
    name: 'THL-6 Hydraulic Torque Wrench',
    category: 'Torque Tools',
    description: 'Heavy-duty hydraulic torque wrench for demanding industrial tasks',
    images: [
      'https://placehold.co/800x600/1a1a1a/white?text=THL-6+Main+View',
      'https://placehold.co/800x600/1a1a1a/white?text=THL-6+Side+View',
      'https://placehold.co/800x600/1a1a1a/white?text=THL-6+Detail',
    ],
    model3D: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    modelAR: 'https://modelviewer.dev/shared-assets/models/Astronaut.usdz',
    videos: [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    ],
    specifications: [
      { label: 'Min Torque', value: '1350', unit: 'Nm' },
      { label: 'Max Torque', value: '13517', unit: 'Nm' },
      { label: 'Weight', value: '6.8', unit: 'Kg' },
      { label: 'Hex Range', value: '46-115', unit: 'mm' },
    ],
    variants: [
      {
        id: 'thl-6-46-75',
        name: '46-75mm Range',
        specs: [
          { label: 'Hex Range', value: '46-75', unit: 'mm' },
        ],
      },
      {
        id: 'thl-6-76-115',
        name: '76-115mm Range',
        specs: [
          { label: 'Hex Range', value: '76-115', unit: 'mm' },
        ],
      },
    ],
    qrCode: 'THL6-2024',
    features: [
      'Maximum torque output',
      'Heavy-duty construction',
      'Extended reach',
      'Professional grade',
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