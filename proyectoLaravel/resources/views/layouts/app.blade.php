<!doctype html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>@yield('title', 'Sistema Académico Laravel')</title>
    <!-- CSS Externos -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/css/alertify.min.css"/>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/css/themes/default.min.css"/>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    
    <style>
        :root {
            --bg-body: #f8fafc;
            --bg-surface: #ffffff;
            --text-primary: #0f172a;
            --text-secondary: #64748b;
            --border-color: #e2e8f0;
            --accent-primary: #2563eb;
            --card-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05);
            --sidebar-bg: rgba(15, 23, 42, 0.95);
            
            /* ARQUITECTURA DE MEDIDAS (Variables Matemáticas) */
            --sidebar-width: 260px;
            --sidebar-collapsed-width: 80px;
            --current-sidebar-width: var(--sidebar-width);
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

        /* Lógica de Colapso (Trigger Global) */
        .sidebar-collapsed {
            --current-sidebar-width: var(--sidebar-collapsed-width);
        }
        
        /* Compatibilidad Dark Mode Global */
        [data-theme="dark"] .bg-white { background-color: var(--bg-surface) !important; }
        [data-theme="dark"] .bg-light { background-color: rgba(255,255,255, 0.03) !important; }
        [data-theme="dark"] .text-dark { color: #f8fafc !important; }
        [data-theme="dark"] .text-muted { color: #94a3b8 !important; }
        [data-theme="dark"] .border-light, [data-theme="dark"] .border { border-color: var(--border-color) !important; }
        
        /* Transiciones Globales */
        * { transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease; }

        body {
            background-color: var(--bg-body);
            color: var(--text-primary);
            font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
            margin: 0;
            overflow-x: hidden;
        }

        /* --- SISTEMA DE DISEÑO PREMIUM --- */
        
        /* Inputs & Selects en Dark Mode */
        [data-theme="dark"] .form-control, 
        [data-theme="dark"] .form-select {
            background-color: rgba(30, 41, 59, 0.5) !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
            color: #f8fafc !important;
        }
        [data-theme="dark"] .form-control:focus, 
        [data-theme="dark"] .form-select:focus {
            background-color: rgba(30, 41, 59, 0.8) !important;
            border-color: var(--accent-primary) !important;
            box-shadow: 0 0 0 0.25rem rgba(37, 99, 235, 0.15);
        }
        [data-theme="dark"] .input-group-text {
            background-color: rgba(30, 41, 59, 0.8) !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
            color: #94a3b8 !important;
        }

        /* Tablas en Dark Mode */
        [data-theme="dark"] .table { color: #f8fafc !important; }
        [data-theme="dark"] .table > :not(caption) > * > * { background-color: transparent !important; border-bottom-color: rgba(255, 255, 255, 0.05) !important; }
        [data-theme="dark"] .table-hover tbody tr:hover { background-color: rgba(255, 255, 255, 0.02) !important; }
        [data-theme="dark"] .bg-light { background-color: rgba(255, 255, 255, 0.03) !important; }

        /* Tarjetas con Elevación (Hover Lift) */
        .hover-lift { cursor: pointer; }
        .hover-lift:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
        }

        /* Whitespace & Layout */
        .surface-card {
            background: var(--bg-surface);
            border: 1px solid var(--border-color);
            border-radius: 1.5rem;
            box-shadow: var(--card-shadow);
            overflow: hidden;
            padding: 2rem; /* Más respiro visual */
        }

        .sidebar {
            width: var(--current-sidebar-width);
            min-width: var(--current-sidebar-width);
            flex-shrink: 0;
            background: var(--sidebar-bg);
            backdrop-filter: blur(25px);
            color: #f8fafc;
            border-right: 1px solid rgba(255, 255, 255, 0.08);
            z-index: 1000;
            display: flex;
            flex-direction: column;
            height: 100vh;
            position: sticky;
            top: 0;
            transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
        }

        /* Ocultar texto al colapsar para estado mini */
        .sidebar-collapsed .sidebar span, 
        .sidebar-collapsed .sidebar .opacity-50 {
            display: none;
        }

        /* Centrar iconos en sidebar colapsado */
        .sidebar-collapsed .nav-link-custom {
            justify-content: center;
            padding: 0.85rem;
            margin: 0.25rem 0.75rem;
        }
        .sidebar-collapsed .nav-link-custom i { margin: 0; font-size: 1.5rem; }



        .nav-link-custom {
            color: #94a3b8 !important;
            border-radius: 0.75rem;
            padding: 0.85rem 1.25rem;
            margin: 0.25rem 1.25rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 12px;
            text-decoration: none;
        }

        .nav-link-custom:hover {
            background-color: rgba(255, 255, 255, 0.05);
            color: #ffffff !important;
        }

        .nav-link-custom.active {
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: white !important;
        }

        .main-content {
            width: calc(100% - var(--current-sidebar-width));
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            overflow-x: hidden;
            background-color: var(--bg-body);
        }

        /* --- BOTÓN TOGGLE & BUSCADORES DARK MODE --- */
        [data-theme="dark"] #sidebarToggle {
            background-color: rgba(30, 41, 59, 0.8) !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
            color: #ffffff !important;
        }

        [data-theme="dark"] input[type="search"],
        [data-theme="dark"] .form-control[type="search"] {
            background-color: rgba(15, 23, 42, 0.6) !important;
            color: #f8fafc !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
        }

        [data-theme="dark"] .input-group-text i { color: #94a3b8; }

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

        [data-theme="dark"] .topbar { background: rgba(2, 6, 23, 0.8); }

        /* Estilo para los KPIs y gradientes */
        .icon-gradient { padding: 1rem; border-radius: 1rem; display: inline-flex; }
        .icon-blue { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
        .icon-green { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .icon-orange { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }

        @stack('styles')
    </style>
</head>
<body>
    <div id="application-shell" class="d-flex min-vh-100">
        <!-- Sidebar -->
        <aside class="sidebar shadow-lg">
            <div class="p-4 d-flex align-items-center mb-4">
                <div class="rounded-3 p-1 me-3 d-flex justify-content-center align-items-center shadow-lg" style="width: 40px; height: 40px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);">
                    <i class="bi bi-mortarboard-fill fs-5 text-white"></i>
                </div>
                <span class="fs-5 fw-bold text-white">Sistema Académico</span>
            </div>

            <div class="navbar-nav w-100">
                <div class="px-4 mb-2 small text-uppercase opacity-50 text-white">Gestión</div>
                <a href="{{ route('home') }}" class="nav-link-custom {{ request()->routeIs('home') ? 'active' : '' }}">
                    <i class="bi bi-speedometer2 fs-5"></i> <span>Dashboard</span>
                </a>
                <a href="{{ route('alumnos.index') }}" class="nav-link-custom {{ request()->routeIs('alumnos.*') ? 'active' : '' }}">
                    <i class="bi bi-people fs-5"></i> <span>Alumnos</span>
                </a>
                <a href="{{ route('docentes.index') }}" class="nav-link-custom {{ request()->routeIs('docentes.*') ? 'active' : '' }}">
                    <i class="bi bi-person-badge fs-5"></i> <span>Docentes</span>
                </a>
                <a href="{{ route('materias.index') }}" class="nav-link-custom {{ request()->routeIs('materias.*') ? 'active' : '' }}">
                    <i class="bi bi-book fs-5"></i> <span>Materias</span>
                </a>
                
                <div class="px-4 mt-4 mb-2 small text-uppercase opacity-50 text-white">Administración</div>
                <a href="{{ route('matriculas.index') }}" class="nav-link-custom {{ request()->routeIs('matriculas.*') ? 'active' : '' }}">
                    <i class="bi bi-journal-check fs-5"></i> <span>Matrículas</span>
                </a>
                <a href="{{ route('inscripciones.index') }}" class="nav-link-custom {{ request()->routeIs('inscripciones.*') ? 'active' : '' }}">
                    <i class="bi bi-journal-plus fs-5"></i> <span>Inscripciones</span>
                </a>
            </div>

            <div class="mt-auto p-4">
                <button id="themeToggle" class="btn btn-outline-light w-100 rounded-pill d-flex align-items-center justify-content-center">
                    <i class="bi bi-moon-stars me-2"></i> Alternar Tema
                </button>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            <header class="topbar">
                <button id="sidebarToggle" class="btn btn-light rounded-circle shadow-sm">
                    <i class="bi bi-list fs-4"></i>
                </button>
                <div class="d-flex align-items-center gap-3">
                    <span id="header-date" class="text-muted small"></span>
                    <div class="fw-bold px-3 py-1 bg-success bg-opacity-10 text-success rounded-pill small">Online</div>
                </div>
            </header>

            <div class="p-4 p-md-5">
                @yield('content')
            </div>
        </main>
    </div>

    <!-- Scripts Base -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/alertify.min.js"></script>
    <script>
        // Lógica Global de UI (Copia refinada de main.js pero sin Vue)
        document.addEventListener('DOMContentLoaded', () => {
            const dateEl = document.getElementById('header-date');
            if(dateEl) setInterval(() => {
                dateEl.textContent = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
            }, 1000);

            // Toggle Sidebar
            const toggleSidebar = () => {
                const isCollapsed = document.body.classList.toggle('sidebar-collapsed');
                localStorage.setItem('sidebarState', isCollapsed ? 'collapsed' : 'expanded');
            };
            document.getElementById('sidebarToggle')?.addEventListener('click', toggleSidebar);

            // Cargar estado de sidebar
            if(localStorage.getItem('sidebarState') === 'collapsed') {
                document.body.classList.add('sidebar-collapsed');
            }

            // Theme Toggle
            const toggleTheme = () => {
                const current = document.documentElement.getAttribute('data-theme');
                const next = current === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', next);
                localStorage.setItem('theme', next);
            };
            document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);
            
            // Cargar tema guardado
            if(localStorage.getItem('theme') === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
        });
    </script>
    @stack('scripts')
</body>
</html>
