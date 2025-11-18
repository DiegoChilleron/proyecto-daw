import { FaBoltLightning, FaPalette, FaAws } from 'react-icons/fa6';

export default function Home() {
  return (

    <main className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">

      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight">
              Crea la web de tu negocio en{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">
                minutos
              </span>
            </h1>
            <h2 className="text-lg md:text-xl text-slate-600">Genera una web totalmente personalizada rellenando un sencillo formulario</h2>
            <button className="px-8 py-4 bg-blue-500 text-white rounded-3xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
              Formulario para crear mi web
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-slate-200">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-600 font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Rellena un formulario</h3>
              <p className="text-slate-600 leading-relaxed">Responde a unas preguntas sobre tu negocio y tus preferencias de diseño.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-slate-200">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-purple-600 font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Generamos tu sitio we</h3>
              <p className="text-slate-600 leading-relaxed">Nuestro sistema compone una plantilla profesional, añade tus contenidos y crea tu subdominio</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-slate-200">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-green-600 font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Tu web estará lista</h3>
              <p className="text-slate-600 leading-relaxed">Puedes verla online inmediatamente</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 bg-white rounded-3xl">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center text-slate-900 mb-16">Beneficios</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4 p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
                <FaBoltLightning className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Rápido y sencillo</h3>
              <p className="text-slate-600 leading-relaxed">Tu web se genera en segundos con un diseño moderno</p>
            </div>

            <div className="text-center space-y-4 p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto">
                <FaPalette className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Personalizable</h3>
              <p className="text-slate-600 leading-relaxed">Podrás personalizar textos, colores y más contenido</p>
            </div>

            <div className="text-center space-y-4 p-6">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto">
                <FaAws className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Alojado en AWS</h3>
              <p className="text-slate-600 leading-relaxed">Infraestructura rápida, escalable y segura</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto bg-linear-to-r from-slate-900 to-slate-800 rounded-3xl p-12 text-center space-y-6">
          <p className="text-lg text-slate-300 leading-relaxed">Nuestro sistema utiliza plantillas Next.js optimizadas, se despliega automáticamente en AWS S3 y cada proyecto se entrega bajo un subdominio seguro.</p>
          <p className="text-lg text-slate-300 leading-relaxed">No necesitas conocimientos técnicos, ni costes de mantenimiento.</p>
        </div>
      </section>

    </main>
  );
}
