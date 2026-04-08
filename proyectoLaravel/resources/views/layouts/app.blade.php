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
        
        body {
            background-color: var(--bg-body);
            color: var(--text-primary);
            font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
            margin: 0;
            overflow-x: hidden;
            transition: background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .sidebar {
            width: 280px;
            min-width: 280px;
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
            transition: all 0.4s ease;
        }

        .sidebar-collapsed .sidebar {
            width: 0 !important;
            min-width: 0 !important;
            opacity: 0;
            pointer-events: none;
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
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            min-width: 0;
        }

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

        .surface-card {
            background: var(--bg-surface);
            border: 1px solid var(--border-color);
            border-radius: 1.5rem;
            box-shadow: var(--card-shadow);
            overflow: hidden;
        }

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
            document.getElementById('sidebarToggle')?.addEventListener('click', () => {
                document.body.classList.toggle('sidebar-collapsed');
            });

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
