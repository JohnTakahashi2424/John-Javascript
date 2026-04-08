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
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        
        :root {
            --bg-body: #f8fafc;
            --bg-surface: #ffffff;
            --text-primary: #0f172a;
            --text-secondary: #64748b;
            --border-color: #e2e8f0;
            --accent-primary: #2563eb;
            --card-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05);
            --sidebar-bg: rgba(15, 23, 42, 0.95);
        }

        [data-theme="dark"] {
            --bg-body: #020617;
            --bg-surface: #1e293b;
            --text-primary: #f8fafc;
            --text-secondary: #94a3b8;
            --border-color: rgba(255, 255, 255, 0.06);
            --card-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
            --sidebar-bg: rgba(2, 6, 23, 0.95);
        }
        
        /* Compatibilidad Dark Mode Global */
        [data-theme="dark"] .bg-white { background-color: var(--bg-surface) !important; }
        [data-theme="dark"] .bg-light { background-color: rgba(255,255,255, 0.03) !important; }
        [data-theme="dark"] .text-dark { color: #f8fafc !important; }
        [data-theme="dark"] .text-muted { color: #94a3b8 !important; }
        [data-theme="dark"] .border-light, [data-theme="dark"] .border { border-color: var(--border-color) !important; }
        
        [data-theme="dark"] .table {
            --bs-table-bg: transparent;
            --bs-table-color: #f8fafc;
            --bs-table-hover-bg: rgba(255, 255, 255, 0.02);
            --bs-table-hover-color: #f8fafc;
        }

        /* Inputs Premium */
        [data-theme="dark"] .form-control, 
        [data-theme="dark"] .form-select,
        [data-theme="dark"] .input-group-text {
            background-color: #0f172a !important;
            border-color: var(--border-color) !important;
            color: #f8fafc !important;
        }

        [data-theme="dark"] .form-control:focus {
            background-color: #1e293b !important;
            border-color: var(--accent-primary) !important;
            box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.15) !important;
        }

        /* Botones Claros Adaptables */
        [data-theme="dark"] .btn-light {
            background-color: rgba(255, 255, 255, 0.05) !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
            color: #f1f5f9 !important;
        }
        
        [data-theme="dark"] .btn-light:hover {
            background-color: rgba(255, 255, 255, 0.1) !important;
            border-color: rgba(255, 255, 255, 0.2) !important;
        }

        body {
            background-color: var(--bg-body);
            color: var(--text-primary);
            font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
            margin: 0;
            overflow-x: hidden;
            transition: background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Sidebar Glassmorphism Refinado */
        .sidebar {
            width: 280px;
            min-width: 280px;
            background: var(--sidebar-bg);
            backdrop-filter: blur(25px);
            -webkit-backdrop-filter: blur(25px);
            color: #f8fafc;
            border-right: 1px solid rgba(255, 255, 255, 0.08);
            z-index: 1000;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            flex-direction: column;
            height: 100vh;
            position: sticky;
            top: 0;
        }

        .sidebar-collapsed .sidebar {
            width: 0 !important;
            min-width: 0 !important;
            opacity: 0;
            pointer-events: none;
        }

        .sidebar-brand {
            height: 90px;
            display: flex;
            align-items: center;
            padding: 0 2rem;
            border-bottom: 1px solid rgba(255,255,255,0.03);
            background: linear-gradient(to bottom, rgba(255,255,255,0.02), transparent);
            transition: all 0.3s ease;
        }

        .sidebar-brand:hover {
            background: rgba(255, 255, 255, 0.05);
            transform: scale(1.02);
        }

        .nav-link-custom {
            color: #94a3b8 !important;
            border-radius: 0.75rem;
            padding: 0.85rem 1.25rem;
            margin: 0.25rem 1.25rem;
            transition: all 0.3s ease;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .nav-link-custom:hover {
            background-color: rgba(255, 255, 255, 0.05);
            color: #ffffff !important;
            transform: translateX(5px);
        }

        .nav-link-custom.active {
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: white !important;
            box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
        }

        /* Instant UX Animations */
        @keyframes fadeInUpCustom {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes highlightSuccess {
            0% { background-color: rgba(16, 185, 129, 0.2); }
            100% { background-color: transparent; }
        }

        @keyframes pulseSyncing {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
        }

        .modulo-seccion:not(.d-none) {
            animation: fadeInUpCustom 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .row-syncing {
            animation: pulseSyncing 1.5s infinite ease-in-out;
            opacity: 0.7;
        }

        .row-highlight-new {
            animation: highlightSuccess 2s ease-out forwards;
        }

        /* Vue Transition Classes */
        .list-enter-active, .list-leave-active {
            transition: all 0.4s ease;
        }
        .list-enter-from {
            opacity: 0;
            transform: translateX(30px);
        }
        .list-leave-to {
            opacity: 0;
            transform: translateX(-30px);
        }


        /* Topbar Elevada */
        .topbar {
            height: 80px;
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 2.5rem;
            position: sticky;
            top: 0;
            z-index: 900;
        }

        [data-theme="dark"] .topbar {
            background: rgba(2, 6, 23, 0.8);
        }

        /* Hero Section con Mesh Gradient */
        .welcome-hero {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%),
                        radial-gradient(at 0% 0%, rgba(59, 130, 246, 0.15) 0, transparent 50%),
                        radial-gradient(at 100% 100%, rgba(99, 102, 241, 0.1) 0, transparent 50%);
            border-radius: 1.5rem;
            color: white;
            padding: 3.5rem 4.5rem;
            position: relative;
            overflow: hidden;
            box-shadow: 0 40px 60px -15px rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.05);
        }

        /* Tarjetas de Superficie Refinadas */
        .surface-card {
            background: var(--bg-surface);
            border: 1px solid var(--border-color);
            border-radius: 1.5rem;
            box-shadow: var(--card-shadow);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            overflow: hidden;
        }

        .surface-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
            border-color: var(--accent-primary);
        }

        /* Barra de búsqueda Premium */
        .search-bar-top {
            width: 350px;
            background: rgba(0, 0, 0, 0.04);
            border-radius: 1rem;
            padding: 0.6rem 1.2rem;
            display: flex;
            align-items: center;
            border: 1px solid transparent;
            transition: all 0.3s;
        }

        [data-theme="dark"] .search-bar-top {
            background: rgba(255, 255, 255, 0.05);
        }

        .search-bar-top:focus-within {
            background: white;
            border-color: #3b82f6;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        [data-theme="dark"] .search-bar-top:focus-within {
            background: #1e293b;
        }

        .search-bar-top input {
            border: none; background: transparent; outline: none; width: 100%; margin-left: 10px; color: inherit;
        }

        /* Gradientes de iconos consistentes */
        .icon-gradient {
            padding: 1rem; border-radius: 1rem; margin-bottom: 1.5rem; display: inline-flex;
        }
        .icon-blue { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
        .icon-green { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .icon-orange { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }

        /* Animaciones */
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .modulo-seccion { animation: fadeInUp 0.5s ease-out forwards; }

        /* Animación Float para Ilustración */
        @keyframes floating {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
            100% { transform: translateY(0px); }
        }
        .welcome-illustration {
            animation: floating 4s ease-in-out infinite;
        }

        /* Estructura Base (CRÍTICO) */
        #app {
            display: flex;
            min-height: 100vh;
        }

        .main-content {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            min-width: 0;
            background-color: var(--bg-body);
        }

        /* Estado Colapsado Profesional */
        .sidebar-collapsed .sidebar {
            width: 0 !important;
            min-width: 0 !important;
            margin-left: 0;
            opacity: 0;
            border-right: 0;
            pointer-events: none;
        }
        
        .sidebar-collapsed .main-content {
            width: 100%;
            flex: 1;
        }

    </style>
</head>
<body>
    <div id="app" data-stats='@json($stats)'>
        <!-- Sidebar -->
        <aside class="sidebar shadow-lg">
            <div class="sidebar-brand cursor-pointer" @click="volverInicio" title="Ir al Inicio">
                <div class="rounded-3 p-1 me-3 d-flex justify-content-center align-items-center shadow-lg" style="width: 40px; height: 40px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);">
                    <i class="bi bi-mortarboard-fill fs-5 text-white"></i>
                </div>
                <span class="fs-5 fw-extrabold tracking-tight" style="letter-spacing: -0.02em;">Sistema Académico</span>
            </div>

            
            <div class="mt-4">
                <div class="px-4 mb-2">
                    <p class="text-uppercase text-white opacity-50 fw-bold mb-3" style="font-size: 0.7rem; letter-spacing: 0.05em;">Gestión</p>
                </div>
                <div class="navbar-nav w-100 flex-column">
                    <a class="nav-link nav-link-custom mb-1" :class="{'active': forms.busqueda_alumnos.mostrar || forms.alumnos.mostrar}" @click.prevent="abrirVentana('alumnos')" href="#">
                        <i class="bi bi-people fs-5 me-3"></i> <span>Alumnos</span>
                    </a>
                    <a class="nav-link nav-link-custom mb-1" :class="{'active': forms.busqueda_docentes.mostrar || forms.docentes.mostrar}" @click.prevent="abrirVentana('docentes')" href="#">
                        <i class="bi bi-person-badge fs-5 me-3"></i> <span>Docentes</span>
                    </a>
                    <a class="nav-link nav-link-custom mb-1" :class="{'active': forms.busqueda_materias.mostrar || forms.materias.mostrar}" @click.prevent="abrirVentana('materias')" href="#">
                        <i class="bi bi-book fs-5 me-3"></i> <span>Materias</span>
                    </a>
                </div>
                
                <div class="px-4 mt-4 mb-2">
                    <p class="text-uppercase text-white opacity-50 fw-bold mb-3" style="font-size: 0.7rem; letter-spacing: 0.05em;">Administración</p>
                </div>
                <div class="navbar-nav w-100 flex-column">
                    <a class="nav-link nav-link-custom mb-1" :class="{'active': forms.busqueda_matriculas.mostrar || forms.matriculas.mostrar}" @click.prevent="abrirVentana('matriculas')" href="#">
                        <i class="bi bi-journal-check fs-5 me-3"></i> <span>Matrículas</span>
                    </a>
                    <a class="nav-link nav-link-custom mb-1" :class="{'active': forms.busqueda_inscripciones.mostrar || forms.inscripciones.mostrar}" @click.prevent="abrirVentana('inscripciones')" href="#">
                        <i class="bi bi-journal-plus fs-5 me-3"></i> <span>Inscripciones</span>
                    </a>
                </div>
            </div>


            <!-- Botón de Recarga y Perfil -->
            <div class="mt-auto p-4 border-top border-white border-opacity-10">
                <button id="btnReloadApp" class="btn btn-outline-light w-100 mb-3 border-opacity-10 py-2 rounded-4 d-flex align-items-center justify-content-center transition-all hover-translate" style="font-size: 0.85rem;">
                    <i class="bi bi-arrow-clockwise me-2 fs-5"></i> Reiniciar Sistema
                </button>

                <div class="d-flex align-items-center p-2 rounded-4 cursor-pointer transition-all hover-translate" style="background: rgba(255,255,255,0.03);">
                    <div class="position-relative me-3">
                        <img src="https://ui-avatars.com/api/?name=Admin&background=3b82f6&color=fff&rounded=true" alt="User Avatar" class="rounded-circle shadow-lg" width="42" height="42">
                        <span class="position-absolute bottom-0 end-0 p-1 bg-success border border-2 border-dark rounded-circle" style="width: 12px; height: 12px;" title="En línea"></span>
                    </div>
                    <div class="overflow-hidden d-none d-md-block">
                        <div class="fw-bold text-white small text-truncate">Administrador</div>
                        <div class="text-white opacity-50 text-truncate" style="font-size: 0.65rem;">admin@institucion.edu</div>
                    </div>
                </div>
            </div>
        </aside>


        <!-- Main Content -->
        <main class="main-content">
            <!-- Topbar con Botón de Toggle -->
            <header class="topbar">
                <div class="d-flex align-items-center">
                    <button id="sidebarToggle" class="btn btn-light rounded-circle me-3 d-flex align-items-center justify-content-center" style="width: 42px; height: 42px;">
                        <i class="bi bi-list fs-4"></i>
                    </button>
                    <div class="search-bar-top d-none d-md-flex">
                        <i class="bi bi-search text-muted"></i>
                        <input type="text" placeholder="Buscar funciones o expedientes...">
                    </div>
                </div>

                <div class="d-flex align-items-center gap-3">
                    <button id="themeToggle" class="btn btn-light rounded-circle d-flex align-items-center justify-content-center shadow-sm border" style="width: 42px; height: 42px;" title="Alternar Modo Oscuro">
                        <i class="bi bi-moon-stars-fill fs-5" id="themeIcon"></i>
                    </button>
                    <div class="d-none d-lg-block text-end me-2">
                        <div class="fw-bold small text-dark">Portal Académico</div>
                        <div class="text-success small d-flex align-items-center justify-content-end" style="font-size: 0.7rem;">
                            <span class="p-1 me-1 rounded-circle bg-success" style="width: 6px; height: 6px;"></span> En línea
                        </div>
                    </div>
                </div>
            </header>

            <!-- App Container -->
            <div id="appSistema" class="container-fluid p-4 p-md-5 overflow-auto">
                <div id="welcome-screen" class="modulo-seccion" v-if="Object.values(forms).every(f => !f.mostrar)">
                    <div class="welcome-hero mb-4">
                        <div class="row align-items-center">
                            <div class="col-lg-7">
                                <span class="badge bg-primary bg-opacity-20 text-primary px-3 py-2 rounded-pill mb-3 fw-bold" style="font-size: 0.9rem;">v2.0 Premium Sync</span>
                                <h1 class="display-2 fw-extrabold mb-4 tracking-tight">¡Bienvenido, <span class="text-primary-emphasis" style="color: #60a5fa !important;">Admin</span>!</h1>
                                <p class="mb-5 opacity-75" style="font-size: 1.4rem; line-height: 1.6; max-width: 90%;">
                                    Gestiona la excelencia académica con herramientas de última generación en un solo lugar.
                                </p>
                                <div class="d-flex gap-4 flex-wrap">
                                    <div class="d-flex align-items-center">
                                        <div class="bg-white bg-opacity-10 rounded-3 p-2 me-3">
                                            <i class="bi bi-calendar3 fs-4"></i>
                                        </div>
                                        <div>
                                            <div class="small opacity-50 text-uppercase fw-bold" style="font-size: 0.65rem;">Fecha Actual</div>
                                            <div class="fw-bold fs-6">
                                                <span id="dashboard-date"></span> 
                                                <span class="mx-2 opacity-50">|</span> 
                                                <span id="dashboard-time"></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="d-flex align-items-center">
                                        <div class="bg-success bg-opacity-10 rounded-3 p-2 me-3">
                                            <i class="bi bi-shield-check fs-4 text-success"></i>
                                        </div>
                                        <div>
                                            <div class="small opacity-50 text-uppercase fw-bold" style="font-size: 0.65rem;">Estado</div>
                                            <div class="fw-bold fs-6 text-success">Sistema Activo</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-5 d-none d-lg-block text-center">
                                <div class="position-relative d-inline-block">
                                    <div class="position-absolute top-50 start-50 translate-middle bg-primary rounded-circle blur-3xl opacity-20" style="width: 300px; height: 300px;"></div>
                                    <img src="{{ asset('rei_ayanami.png') }}" alt="Dashboard Illustration" class="welcome-illustration img-fluid rounded-4 shadow-lg position-relative" style="max-height: 480px; border: 4px solid rgba(255,255,255,0.1); filter: drop-shadow(0 20px 30px rgba(0,0,0,0.5));">
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- KPIs Reequilibrados -->
                    <div class="row g-4 mb-4">
                        <div class="col-md-4">
                            <div class="surface-card p-4">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <div class="icon-gradient icon-blue p-3 mb-0">
                                        <i class="bi bi-people-fill fs-3"></i>
                                    </div>
                                    <span class="badge bg-success bg-opacity-10 text-success rounded-pill" style="font-size: 0.75rem;">+5%</span>
                                </div>
                                <div class="text-theme-secondary fw-bold text-uppercase mb-1" style="font-size: 0.7rem; letter-spacing: 0.05em;">Total Alumnos</div>
                                <div class="h2 fw-extrabold mb-0" v-text="stats.totalAlumnos"></div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="surface-card p-4">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <div class="icon-gradient icon-orange p-3 mb-0">
                                        <i class="bi bi-person-workspace fs-3"></i>
                                    </div>
                                </div>
                                <div class="text-theme-secondary fw-bold text-uppercase mb-1" style="font-size: 0.7rem; letter-spacing: 0.05em;">Docentes Activos</div>
                                <div class="h2 fw-extrabold mb-0" v-text="stats.totalDocentes"></div>
                            </div>
                        </div>

                        <div class="col-md-4">
                            <div class="surface-card p-4">
                                <div class="d-flex justify-content-between align-items-start mb-3">
                                    <div class="icon-gradient icon-green p-3 mb-0">
                                        <i class="bi bi-journal-check fs-3"></i>
                                    </div>
                                </div>
                                <div class="text-theme-secondary fw-bold text-uppercase mb-1" style="font-size: 0.7rem; letter-spacing: 0.05em;">Matrículas Hoy</div>
                                <div class="h2 fw-extrabold mb-0" v-text="stats.matriculasHoy"></div>
                            </div>
                        </div>

                    </div>

                    <!-- Accesos Rápidos Mejorados -->
                    <div class="d-flex align-items-center justify-content-between mb-3">
                        <h5 class="fw-extrabold mb-0">Accesos Rápidos</h5>
                        <hr class="flex-grow-1 mx-4 opacity-10">
                    </div>
                    
                    <div class="row g-4">
                        <div class="col-md-4">
                            <div class="surface-card p-4 h-100 cursor-pointer" @click="abrirVentana('alumnos')">
                                <div class="icon-gradient icon-blue mb-4 p-3">
                                    <i class="bi bi-people fs-2"></i>
                                </div>
                                <h5 class="fw-bold mb-2">Alumnos</h5>
                                <p class="text-theme-secondary small mb-0">Control de expedientes.</p>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="surface-card p-4 h-100 cursor-pointer" @click="abrirVentana('matriculas')">
                                <div class="icon-gradient icon-green mb-4 p-3">
                                    <i class="bi bi-layout-text-sidebar-reverse fs-2"></i>
                                </div>
                                <h5 class="fw-bold mb-2">Matrículas</h5>
                                <p class="text-theme-secondary small mb-0">Trámites de ciclo.</p>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="surface-card p-4 h-100 cursor-pointer" @click="abrirVentana('docentes')">
                                <div class="icon-gradient icon-orange mb-4 p-3">
                                    <i class="bi bi-person-workspace fs-2"></i>
                                </div>
                                <h5 class="fw-bold mb-2">Docentes</h5>
                                <p class="text-theme-secondary small mb-0">Planta académica.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="form-alumnos" class="modulo-seccion" v-if="forms.alumnos.mostrar || forms.busqueda_alumnos.mostrar">
                    <alumnos @buscar='buscar("busqueda_alumnos","obtenerAlumnos")' :forms="forms" ref="alumnos"></alumnos>
                    <busqueda_alumnos @modificar='modificar("alumnos","modificarAlumno", $event)' ref="busqueda_alumnos"></busqueda_alumnos>
                </div>

                <div id="form-materias" class="modulo-seccion" v-if="forms.materias.mostrar || forms.busqueda_materias.mostrar">
                    <materias @buscar='buscar("busqueda_materias","obtenerMaterias")' :forms="forms" ref="materias"></materias>
                    <busqueda_materias @modificar='modificar("materias","modificarMateria", $event)' ref="busqueda_materias"></busqueda_materias>
                </div>

                <div id="form-docentes" class="modulo-seccion" v-if="forms.docentes.mostrar || forms.busqueda_docentes.mostrar">
                    <docentes @buscar='buscar("busqueda_docentes","obtenerDocentes")' :forms="forms" ref="docentes"></docentes>
                    <busqueda_docentes @modificar='modificar("docentes","modificarDocente", $event)' ref="busqueda_docentes"></busqueda_docentes>
                </div>

                <div id="form-matriculas" class="modulo-seccion" v-if="forms.matriculas.mostrar || forms.busqueda_matriculas.mostrar">
                    <matriculas @buscar='buscar("busqueda_matriculas","obtenerMatriculas")' :forms="forms" ref="matriculas"></matriculas>
                    <busqueda_matriculas @modificar='modificar("matriculas","modificarMatricula", $event)' ref="busqueda_matriculas"></busqueda_matriculas>
                </div>

                <div id="form-inscripciones" class="modulo-seccion" v-if="forms.inscripciones.mostrar || forms.busqueda_inscripciones.mostrar">
                    <inscripciones @buscar='buscar("busqueda_inscripciones","obtenerInscripciones")' :forms="forms" ref="inscripciones"></inscripciones>
                    <busqueda_inscripciones @modificar='modificar("inscripciones","modificarInscripcion", $event)' ref="busqueda_inscripciones"></busqueda_inscripciones>
                </div>
            </div>
        </main>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/crypto-js@4.1.1/crypto-js.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="//cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/alertify.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    
    <!-- El estado inicial se lee desde data-stats en #app para evitar errores de linter en el script -->


    <!-- Integración de Vite (Carga el frontend modular) -->
    @vite(['resources/js/main.js'])
    <!-- Reloj en Tiempo Real (In-page para evitar problemas de compilación) -->
    <script>
        function updateDashboardClock() {
            const dateEl = document.getElementById('dashboard-date');
            const timeEl = document.getElementById('dashboard-time');
            if (dateEl && timeEl) {
                const now = new Date();
                dateEl.textContent = now.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
                timeEl.textContent = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            }
        }
        // Ejecutar inmediatamente y cada segundo
        document.addEventListener('DOMContentLoaded', () => {
            updateDashboardClock();
            setInterval(updateDashboardClock, 1000);
        });
        // Si Vue ya cargó, forzar actualización
        setTimeout(updateDashboardClock, 500);
    </script>
</body>
</html>
