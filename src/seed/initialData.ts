import { FormField, TemplateType } from '@/interfaces';

interface SeedProduct {
    description: string;
    images: string[];
    price: number;
    slug: string;
    tags: string[];
    title: string;
    type: ValidTypes;
    templateType: TemplateType;
    demoUrl?: string;
    features: string[];
    formFields: FormField[];
}

interface SeedUser {
    name: string;
    email: string;
    password: string; // Se hasheará en el seed
    role: 'Admin' | 'User';
    image?: string;
}

type ValidTypes = 'corporate' | 'portfolio' | 'landing' | 'blog' | 'ecommerce';

interface SeedData {
    users: SeedUser[];
    categories: ValidTypes[];
    products: SeedProduct[];
}

// Campos de formulario comunes para todas las plantillas
const commonFormFields: FormField[] = [
    {
        name: 'siteName',
        label: 'Nombre del sitio',
        type: 'text',
        required: true,
        placeholder: 'Mi Empresa S.L.',
        description: 'El nombre que aparecerá en el título y header de tu web'
    },
    {
        name: 'siteDescription',
        label: 'Descripción del sitio',
        type: 'textarea',
        required: true,
        placeholder: 'Descripción breve de tu negocio o proyecto...',
        description: 'Descripción para SEO y metadatos'
    },
    {
        name: 'primaryColor',
        label: 'Color principal',
        type: 'color',
        required: false,
        defaultValue: '#3B82F6',
        description: 'Color principal de tu marca'
    },
    {
        name: 'secondaryColor',
        label: 'Color secundario',
        type: 'color',
        required: false,
        defaultValue: '#1E40AF',
        description: 'Color secundario para acentos'
    },
    {
        name: 'logo',
        label: 'Logo',
        type: 'image',
        required: false,
        description: 'Sube el logo de tu empresa (PNG o SVG recomendado)'
    },
    {
        name: 'email',
        label: 'Email de contacto',
        type: 'email',
        required: true,
        placeholder: 'contacto@miempresa.com'
    },
    {
        name: 'phone',
        label: 'Teléfono',
        type: 'phone',
        required: false,
        placeholder: '+34 612 345 678'
    }
];

// Campos específicos para web corporativa
const corporateFormFields: FormField[] = [
    ...commonFormFields,
    {
        name: 'companySlogan',
        label: 'Eslogan de la empresa',
        type: 'text',
        required: false,
        placeholder: 'Innovación que transforma'
    },
    {
        name: 'aboutUs',
        label: 'Sobre nosotros',
        type: 'textarea',
        required: true,
        placeholder: 'Cuenta la historia de tu empresa...',
        description: 'Texto para la sección "Sobre nosotros"'
    },
    {
        name: 'services',
        label: 'Servicios (separados por coma)',
        type: 'textarea',
        required: false,
        placeholder: 'Consultoría, Desarrollo, Marketing...'
    },
    {
        name: 'address',
        label: 'Dirección física',
        type: 'text',
        required: false,
        placeholder: 'Calle Mayor 123, Madrid'
    },
    {
        name: 'linkedin',
        label: 'LinkedIn',
        type: 'url',
        required: false,
        placeholder: 'https://linkedin.com/company/miempresa'
    },
    {
        name: 'twitter',
        label: 'Twitter/X',
        type: 'url',
        required: false,
        placeholder: 'https://twitter.com/miempresa'
    }
];

// Campos específicos para portfolio
const portfolioFormFields: FormField[] = [
    ...commonFormFields,
    {
        name: 'fullName',
        label: 'Nombre completo',
        type: 'text',
        required: true,
        placeholder: 'Juan García López'
    },
    {
        name: 'profession',
        label: 'Profesión',
        type: 'text',
        required: true,
        placeholder: 'Diseñador UX/UI'
    },
    {
        name: 'bio',
        label: 'Biografía',
        type: 'textarea',
        required: true,
        placeholder: 'Cuéntanos sobre ti y tu experiencia...'
    },
    {
        name: 'skills',
        label: 'Habilidades (separadas por coma)',
        type: 'textarea',
        required: false,
        placeholder: 'Figma, Sketch, Adobe XD, HTML, CSS...'
    },
    {
        name: 'github',
        label: 'GitHub',
        type: 'url',
        required: false,
        placeholder: 'https://github.com/usuario'
    },
    {
        name: 'linkedin',
        label: 'LinkedIn',
        type: 'url',
        required: false,
        placeholder: 'https://linkedin.com/in/usuario'
    },
    {
        name: 'cvUrl',
        label: 'URL del CV (PDF)',
        type: 'url',
        required: false,
        placeholder: 'https://ejemplo.com/mi-cv.pdf'
    }
];

// Campos específicos para landing page
const landingFormFields: FormField[] = [
    ...commonFormFields,
    {
        name: 'heroTitle',
        label: 'Título principal (Hero)',
        type: 'text',
        required: true,
        placeholder: 'La solución que tu negocio necesita'
    },
    {
        name: 'heroSubtitle',
        label: 'Subtítulo del Hero',
        type: 'textarea',
        required: true,
        placeholder: 'Descripción breve y atractiva de tu producto o servicio'
    },
    {
        name: 'ctaText',
        label: 'Texto del botón CTA',
        type: 'text',
        required: true,
        defaultValue: 'Empezar ahora',
        placeholder: 'Empezar ahora'
    },
    {
        name: 'ctaUrl',
        label: 'URL del botón CTA',
        type: 'url',
        required: true,
        placeholder: 'https://ejemplo.com/registro'
    },
    {
        name: 'features',
        label: 'Características principales (una por línea)',
        type: 'textarea',
        required: false,
        placeholder: 'Rápido y eficiente\nFácil de usar\nSoporte 24/7'
    },
    {
        name: 'testimonial',
        label: 'Testimonio de cliente',
        type: 'textarea',
        required: false,
        placeholder: '"Este producto cambió mi negocio" - Cliente satisfecho'
    }
];

// Campos específicos para blog
const blogFormFields: FormField[] = [
    ...commonFormFields,
    {
        name: 'blogTitle',
        label: 'Título del blog',
        type: 'text',
        required: true,
        placeholder: 'Mi Blog Personal'
    },
    {
        name: 'authorName',
        label: 'Nombre del autor',
        type: 'text',
        required: true,
        placeholder: 'María García'
    },
    {
        name: 'authorBio',
        label: 'Biografía del autor',
        type: 'textarea',
        required: false,
        placeholder: 'Escritora y entusiasta de la tecnología...'
    },
    {
        name: 'categories',
        label: 'Categorías del blog (separadas por coma)',
        type: 'text',
        required: false,
        placeholder: 'Tecnología, Diseño, Desarrollo'
    },
    {
        name: 'twitter',
        label: 'Twitter/X',
        type: 'url',
        required: false,
        placeholder: 'https://twitter.com/autor'
    },
    {
        name: 'rssEnabled',
        label: 'Habilitar RSS',
        type: 'select',
        required: false,
        options: ['Sí', 'No'],
        defaultValue: 'Sí'
    }
];

// Campos específicos para ecommerce básico
const ecommerceFormFields: FormField[] = [
    ...commonFormFields,
    {
        name: 'storeName',
        label: 'Nombre de la tienda',
        type: 'text',
        required: true,
        placeholder: 'Mi Tienda Online'
    },
    {
        name: 'currency',
        label: 'Moneda',
        type: 'select',
        required: true,
        options: ['EUR', 'USD', 'GBP', 'MXN'],
        defaultValue: 'EUR'
    },
    {
        name: 'shippingInfo',
        label: 'Información de envío',
        type: 'textarea',
        required: false,
        placeholder: 'Envío gratuito en pedidos superiores a 50€...'
    },
    {
        name: 'returnPolicy',
        label: 'Política de devoluciones',
        type: 'textarea',
        required: false,
        placeholder: 'Aceptamos devoluciones en 30 días...'
    },
    {
        name: 'instagram',
        label: 'Instagram',
        type: 'url',
        required: false,
        placeholder: 'https://instagram.com/mitienda'
    },
    {
        name: 'facebook',
        label: 'Facebook',
        type: 'url',
        required: false,
        placeholder: 'https://facebook.com/mitienda'
    }
];

export const initialData: SeedData = {

    users: [
        {
            name: 'Diego Chilleron',
            email: 'diego@example.com',
            password: 'Admin123!',
            role: 'Admin',
            image: 'https://i.pravatar.cc/150?img=1'
        },
        {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'User123!',
            role: 'User',
            image: 'https://i.pravatar.cc/150?img=2'
        }
    ],

    categories: ['corporate', 'portfolio', 'landing', 'blog', 'ecommerce'],

    products: [
        // === WEB CORPORATIVA ===
        {
            title: 'Web Corporativa Profesional',
            description: 'Plantilla elegante y profesional para empresas. Incluye secciones de servicios, equipo, testimonios y formulario de contacto. Diseño moderno y totalmente responsive.',
            images: [],
            price: 299,
            slug: 'web-corporativa-profesional',
            type: 'corporate',
            templateType: 'corporate',
            tags: ['empresa', 'profesional', 'servicios', 'responsive'],
            demoUrl: 'https://demo.webfactory.com/corporate-pro',
            features: [
                'Diseño responsive',
                'Optimizado para SEO',
                'Formulario de contacto',
                'Sección de servicios',
                'Galería de equipo',
                'Integración con Google Maps',
                'Velocidad de carga optimizada'
            ],
            formFields: corporateFormFields
        },
        {
            title: 'Web Corporativa Starter',
            description: 'Plantilla sencilla y efectiva para pequeñas empresas y autónomos. Perfecta para dar los primeros pasos en internet con una presencia profesional.',
            images: [],
            price: 149,
            slug: 'web-corporativa-starter',
            type: 'corporate',
            templateType: 'corporate',
            tags: ['empresa', 'pyme', 'autónomo', 'sencilla'],
            demoUrl: 'https://demo.webfactory.com/corporate-starter',
            features: [
                'Diseño responsive',
                'Página única (one-page)',
                'Formulario de contacto',
                'Sección de servicios',
                'Optimizado para SEO'
            ],
            formFields: corporateFormFields
        },

        // === PORTFOLIO ===
        {
            title: 'Portfolio Creativo',
            description: 'Plantilla moderna para creativos, diseñadores y artistas. Muestra tus proyectos con galerías interactivas y animaciones sutiles.',
            images: [],
            price: 199,
            slug: 'portfolio-creativo',
            type: 'portfolio',
            templateType: 'portfolio',
            tags: ['diseñador', 'artista', 'creativo', 'galería'],
            demoUrl: 'https://demo.webfactory.com/portfolio-creative',
            features: [
                'Galería de proyectos interactiva',
                'Animaciones suaves',
                'Modo oscuro/claro',
                'Sección de habilidades',
                'Descarga de CV',
                'Integración con Behance/Dribbble',
                'Diseño responsive'
            ],
            formFields: portfolioFormFields
        },
        {
            title: 'Portfolio Developer',
            description: 'Plantilla minimalista para desarrolladores. Muestra tus proyectos de GitHub, stack tecnológico y experiencia de forma elegante.',
            images: [],
            price: 179,
            slug: 'portfolio-developer',
            type: 'portfolio',
            templateType: 'portfolio',
            tags: ['desarrollador', 'programador', 'github', 'tech'],
            demoUrl: 'https://demo.webfactory.com/portfolio-dev',
            features: [
                'Integración con GitHub API',
                'Sección de stack tecnológico',
                'Timeline de experiencia',
                'Blog integrado opcional',
                'Modo oscuro por defecto',
                'Animaciones de terminal',
                'Diseño responsive'
            ],
            formFields: portfolioFormFields
        },

        // === LANDING PAGE ===
        {
            title: 'Landing Page Conversión',
            description: 'Landing page optimizada para conversiones. Ideal para lanzamientos de productos, captación de leads y campañas de marketing.',
            images: [],
            price: 249,
            slug: 'landing-page-conversion',
            type: 'landing',
            templateType: 'landing',
            tags: ['marketing', 'conversión', 'leads', 'campaña'],
            demoUrl: 'https://demo.webfactory.com/landing-conversion',
            features: [
                'Diseño enfocado en conversión',
                'Formulario de captación',
                'Sección de beneficios',
                'Testimonios',
                'Contador regresivo',
                'Integración con email marketing',
                'A/B testing ready'
            ],
            formFields: landingFormFields
        },
        {
            title: 'Landing Page Producto',
            description: 'Presenta tu producto o servicio de forma impactante. Secciones de características, pricing y FAQ incluidas.',
            images: [],
            price: 199,
            slug: 'landing-page-producto',
            type: 'landing',
            templateType: 'landing',
            tags: ['producto', 'saas', 'startup', 'features'],
            demoUrl: 'https://demo.webfactory.com/landing-product',
            features: [
                'Hero section impactante',
                'Sección de características',
                'Tabla de precios',
                'FAQ accordion',
                'CTA flotante',
                'Diseño responsive',
                'Animaciones al scroll'
            ],
            formFields: landingFormFields
        },

        // === BLOG ===
        {
            title: 'Blog Personal',
            description: 'Plantilla elegante para bloggers. Sistema de categorías, búsqueda y diseño optimizado para la lectura.',
            images: [],
            price: 149,
            slug: 'blog-personal',
            type: 'blog',
            templateType: 'blog',
            tags: ['blogger', 'escritor', 'contenido', 'artículos'],
            demoUrl: 'https://demo.webfactory.com/blog-personal',
            features: [
                'Sistema de categorías',
                'Búsqueda de artículos',
                'Modo lectura',
                'Compartir en redes sociales',
                'RSS feed',
                'Comentarios opcionales',
                'Newsletter integration'
            ],
            formFields: blogFormFields
        },
        {
            title: 'Blog Magazine',
            description: 'Plantilla estilo revista digital. Múltiples layouts de artículos, secciones destacadas y diseño editorial.',
            images: [],
            price: 199,
            slug: 'blog-magazine',
            type: 'blog',
            templateType: 'blog',
            tags: ['revista', 'editorial', 'noticias', 'magazine'],
            demoUrl: 'https://demo.webfactory.com/blog-magazine',
            features: [
                'Múltiples layouts de artículos',
                'Sección de destacados',
                'Categorías con imágenes',
                'Autor destacado',
                'Artículos relacionados',
                'Newsletter popup',
                'Diseño editorial'
            ],
            formFields: blogFormFields
        },

        // === ECOMMERCE ===
        {
            title: 'Tienda Online Básica',
            description: 'Catálogo de productos estático perfecto para pequeños negocios. Muestra tus productos con enlace a WhatsApp o email para pedidos.',
            images: [],
            price: 249,
            slug: 'tienda-online-basica',
            type: 'ecommerce',
            templateType: 'ecommerce',
            tags: ['tienda', 'catálogo', 'productos', 'whatsapp'],
            demoUrl: 'https://demo.webfactory.com/ecommerce-basic',
            features: [
                'Catálogo de productos',
                'Filtros por categoría',
                'Ficha de producto',
                'Botón de WhatsApp',
                'Galería de imágenes',
                'Diseño responsive',
                'SEO optimizado'
            ],
            formFields: ecommerceFormFields
        },
        {
            title: 'Tienda Online Premium',
            description: 'Catálogo avanzado con más opciones de personalización. Incluye wishlist, búsqueda avanzada y múltiples vistas de producto.',
            images: [],
            price: 349,
            slug: 'tienda-online-premium',
            type: 'ecommerce',
            templateType: 'ecommerce',
            tags: ['tienda', 'premium', 'catálogo', 'avanzado'],
            demoUrl: 'https://demo.webfactory.com/ecommerce-premium',
            features: [
                'Catálogo avanzado',
                'Búsqueda con filtros',
                'Wishlist',
                'Comparador de productos',
                'Zoom de imágenes',
                'Reviews estáticas',
                'Instagram feed',
                'Newsletter integration'
            ],
            formFields: ecommerceFormFields
        }
    ]
};
