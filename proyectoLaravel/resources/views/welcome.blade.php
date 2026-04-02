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
                
                <p class="text-uppercase text-muted fw-semibold mt-4" style="font-size: 0.75rem; letter-spacing: 0.05em; margin: 0 1.5rem 0.5rem 1.5rem;">Administración</p>
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
