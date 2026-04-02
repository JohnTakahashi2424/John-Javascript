<!doctype html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sistema Academico Laravel</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" />
    <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/css/alertify.min.css"/>
    <!-- Default theme -->
    <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/css/themes/default.min.css"/>
    <!-- Semantic UI theme -->
    <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/css/themes/semantic.min.css"/>
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        body {
            background-color: #f1f5f9; /* Slate 100 */
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            color: #334155;
            margin: 0;
            overflow-x: hidden;
        }
        
        #app {
            display: flex;
            min-height: 100vh;
        }
        
        /* Sidebar Styles */
        .sidebar {
            width: 260px;
            background: #0f172a; /* Slate 900 */
            color: #f8fafc;
            flex-shrink: 0;
            box-shadow: 4px 0 15px rgba(0,0,0,0.05);
            z-index: 1000;
        }
        
        .sidebar-brand {
            height: 70px;
            display: flex;
            align-items: center;
            padding: 0 1.5rem;
            border-bottom: 1px solid #1e293b;
        }
        
        .nav-link-custom {
            color: #94a3b8 !important;
            border-radius: 0.5rem;
            padding: 0.75rem 1.25rem;
            margin: 0.25rem 1rem;
            transition: all 0.2s ease-in-out;
            font-weight: 500;
            display: flex;
            align-items: center;
        }
        
        .nav-link-custom:hover, .nav-link-custom.active {
            background-color: #1e293b;
            color: #f8fafc !important;
            transform: translateX(3px);
        }
        
        /* Main Content */
        .main-content {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            min-width: 0;
        }
        
        .topbar {
            height: 70px;
            background: #ffffff;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 2rem;
            box-shadow: 0 1px 2px 0 rgba(0,0,0,0.02);
            z-index: 900;
        }
        
        .search-bar-top {
            width: 300px;
            background-color: #f1f5f9;
            border-radius: 9999px;
            padding: 0.4rem 1.2rem;
            display: flex;
            align-items: center;
            border: 1px solid transparent;
            transition: all 0.2s;
        }
        
        .search-bar-top:focus-within {
            background-color: #ffffff;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .search-bar-top input {
            border: none;
            background: transparent;
            outline: none;
            width: 100%;
            margin-left: 0.5rem;
            font-size: 0.9rem;
        }
        
        /* General Utils */
        .cursor-pointer { cursor: pointer; }
        .transition-all { transition: all 0.3s ease-in-out; }
        /* Welcome Screen Styles */
        .welcome-hero {
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            border-radius: 1.5rem;
            color: white;
            padding: 3rem;
            position: relative;
            overflow: hidden;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        
        .welcome-hero::after {
            content: '';
            position: absolute;
            top: -50px;
            right: -50px;
            width: 300px;
            height: 300px;
            background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
            border-radius: 50%;
        }

        .stat-card {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 1rem;
            padding: 1.5rem;
            transition: transform 0.3s ease;
        }

        .stat-card:hover {
            transform: translateY(-5px);
            background: rgba(255, 255, 255, 0.08);
        }

        .welcome-illustration {
            max-width: 450px;
            filter: drop-shadow(0 20px 30px rgba(0,0,0,0.2));
            animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0px); }
        }
    </style>
</head>
<body>
    <div id="app">
        <!-- Sidebar -->
        <aside class="sidebar">
            <div class="sidebar-brand">
                <div class="bg-primary text-white rounded p-1 me-2 d-flex justify-content-center align-items-center" style="width: 32px; height: 32px;">
                    <i class="bi bi-mortarboard-fill fs-5"></i>
                </div>
                <span class="fs-5 fw-bold tracking-wide">Académico Pro</span>
            </div>
            
            <div class="mt-4">
                <p class="text-uppercase text-muted fw-semibold" style="font-size: 0.75rem; letter-spacing: 0.05em; margin: 0 1.5rem 0.5rem 1.5rem;">Gestión</p>
                <div class="navbar-nav w-100 flex-column">
                    <a class="nav-link nav-link-custom" href="#" @click.prevent="abrirVentana('alumnos')">
                        <i class="bi bi-people fs-5 me-3"></i> <span>Alumnos</span>
                    </a>
                    <a class="nav-link nav-link-custom" href="#" @click.prevent="abrirVentana('docentes')">
                        <i class="bi bi-person-workspace fs-5 me-3"></i> <span>Docentes</span>
                    </a>
                    <a class="nav-link nav-link-custom" href="#" @click.prevent="abrirVentana('materias')">
                        <i class="bi bi-journal-bookmark-fill fs-5 me-3"></i> <span>Materias</span>
                    </a>
                </div>
                
                <p class="text-uppercase text-muted fw-semibold" style="font-size: 0.75rem; letter-spacing: 0.05em; margin: 1.5rem 1.5rem 0.5rem 1.5rem;">Administración</p>
                <div class="navbar-nav w-100 flex-column">
                    <a class="nav-link nav-link-custom" href="#" @click.prevent="abrirVentana('matriculas')">
                        <i class="bi bi-layout-text-sidebar-reverse fs-5 me-3"></i> <span>Matrículas</span>
                    </a>
                    <a class="nav-link nav-link-custom" href="#" @click.prevent="abrirVentana('inscripciones')">
                        <i class="bi bi-pen fs-5 me-3"></i> <span>Inscripciones</span>
                    </a>
                </div>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            <!-- Topbar -->
            <header class="topbar">
                <div class="search-bar-top">
                    <i class="bi bi-search text-muted"></i>
                    <input type="text" placeholder="Búsqueda global (Cmd+K)">
                </div>
                <div class="d-flex align-items-center gap-4">
                    <div class="position-relative cursor-pointer">
                        <i class="bi bi-bell fs-5 text-secondary transition-all hover-primary"></i>
                        <span class="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                            <span class="visually-hidden">Nuevas notificaciones</span>
                        </span>
                    </div>
                    <div class="d-flex align-items-center cursor-pointer">
                        <span class="me-2 fw-semibold text-secondary d-none d-md-block" style="font-size:0.9rem;">Admin</span>
                        <img src="https://ui-avatars.com/api/?name=Admin&background=eff6ff&color=1d4ed8&rounded=true" alt="User Avatar" class="rounded-circle shadow-sm" width="36" height="36">
                    </div>
                </div>
            </header>

            <!-- App Container -->
            <div id="appSistema" class="container-fluid p-4 p-md-5 overflow-auto">
                <!-- Welcome Home Screen -->
                <div v-if="!anyFormActive" class="fade-in">
                    <div class="welcome-hero mb-5">
                        <div class="row align-items-center">
                            <div class="col-lg-7">
                                <h4 class="text-primary-emphasis fw-bold mb-2 tracking-tight" style="color: #60a5fa !important;">Panel de Control</h4>
                                <h1 class="display-4 fw-extrabold mb-4">¡Bienvenido de nuevo, Administrador!</h1>
                                <p class="lead text-slate-300 mb-5" style="color: #94a3b8; font-size: 1.1rem; line-height: 1.6;">
                                    Tu centro de mando académico está listo. Gestiona alumnos, docentes y trámites institucionales con eficiencia y estilo desde un solo lugar.
                                </p>
                                <div class="d-flex gap-3 flex-wrap">
                                    <div class="stat-card">
                                        <div class="text-muted small mb-1 uppercase tracking-wider">Fecha de Hoy</div>
                                        <div class="fs-5 fw-bold text-white">@{{ new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}</div>
                                    </div>
                                    <div class="stat-card">
                                        <div class="text-muted small mb-1 uppercase tracking-wider">Estado Sistema</div>
                                        <div class="fs-5 fw-bold text-success d-flex align-items-center">
                                            <span class="p-1 px-2 me-2 rounded-pill bg-success bg-opacity-20 fs-6">Activo</span>
                                            MySQL Conectado
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-5 d-none d-lg-block text-center">
                                <img src="{{ asset('welcome_illustration.png') }}" alt="Illustration" class="welcome-illustration img-fluid">
                            </div>
                        </div>
                    </div>

                    <div class="row g-4">
                        <div class="col-md-4">
                            <div class="bg-white p-4 rounded-4 shadow-sm border border-light h-100 transition-all hover-shadow-md cursor-pointer" @click="abrirVentana('alumnos')">
                                <div class="bg-primary bg-opacity-10 text-primary rounded-3 p-3 d-inline-block mb-3">
                                    <i class="bi bi-people fs-3"></i>
                                </div>
                                <h5 class="fw-bold">Gestión de Alumnos</h5>
                                <p class="text-muted small">Registra nuevos ingresos, busca expedientes y actualiza información de contacto.</p>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="bg-white p-4 rounded-4 shadow-sm border border-light h-100 transition-all hover-shadow-md cursor-pointer" @click="abrirVentana('matriculas')">
                                <div class="bg-success bg-opacity-10 text-success rounded-3 p-3 d-inline-block mb-3">
                                    <i class="bi bi-layout-text-sidebar-reverse fs-3"></i>
                                </div>
                                <h5 class="fw-bold">Trámites de Matrícula</h5>
                                <p class="text-muted small">Controla el proceso de matriculación anual y el estado de pagos de los estudiantes.</p>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="bg-white p-4 rounded-4 shadow-sm border border-light h-100 transition-all hover-shadow-md cursor-pointer" @click="abrirVentana('docentes')">
                                <div class="bg-warning bg-opacity-10 text-warning rounded-3 p-3 d-inline-block mb-3">
                                    <i class="bi bi-person-workspace fs-3"></i>
                                </div>
                                <h5 class="fw-bold">Directorio Docente</h5>
                                <p class="text-muted small">Administra la planta académica, sus especialidades y registros contractuales.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <alumnos @buscar='buscar("busqueda_alumnos","obtenerAlumnos")' :forms="forms" ref="alumnos" v-show="forms.alumnos.mostrar"></alumnos>
                <busqueda_alumnos @modificar='modificar("alumnos","modificarAlumno", $event)' ref="busqueda_alumnos" v-show="forms.busqueda_alumnos.mostrar"></busqueda_alumnos>

                <materias @buscar='buscar("busqueda_materias","obtenerMaterias")' :forms="forms" ref="materias" v-show="forms.materias.mostrar"></materias>
                <busqueda_materias @modificar='modificar("materias","modificarMateria", $event)' ref="busqueda_materias" v-show="forms.busqueda_materias.mostrar"></busqueda_materias>

                <docentes @buscar='buscar("busqueda_docentes","obtenerDocentes")' :forms="forms" ref="docentes" v-show="forms.docentes.mostrar"></docentes>
                <busqueda_docentes @modificar='modificar("docentes","modificarDocente", $event)' ref="busqueda_docentes" v-show="forms.busqueda_docentes.mostrar"></busqueda_docentes>

                <matriculas @buscar='buscar("busqueda_matriculas","obtenerMatriculas")' :forms="forms" ref="matriculas" v-show="forms.matriculas.mostrar"></matriculas>
                <busqueda_matriculas @modificar='modificar("matriculas","modificarMatricula", $event)' ref="busqueda_matriculas" v-show="forms.busqueda_matriculas.mostrar"></busqueda_matriculas>

                <inscripciones @buscar='buscar("busqueda_inscripciones","obtenerInscripciones")' :forms="forms" ref="inscripciones" v-show="forms.inscripciones.mostrar"></inscripciones>
                <busqueda_inscripciones @modificar='modificar("inscripciones","modificarInscripcion", $event)' ref="busqueda_inscripciones" v-show="forms.busqueda_inscripciones.mostrar"></busqueda_inscripciones>
            </div>
        </main>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/crypto-js@4.1.1/crypto-js.min.js"></script>
    <script src="//cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/alertify.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    
    <!-- Integración de Vite (Carga el frontend modular) -->
    @vite(['resources/js/main.js'])
</body>
</html>
