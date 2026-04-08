@extends('layouts.app')

@section('title', 'Inicio - Sistema Académico')

@section('content')
<div id="welcome-screen" class="modulo-seccion">
    <div class="welcome-hero mb-4 p-4 p-md-5 rounded-4 shadow-lg text-white" style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); min-height: 380px; display: flex; align-items: center;">
        <div class="row align-items-center w-100">
            <div class="col-lg-8 d-flex flex-column justify-content-center">
                <span class="badge bg-primary bg-opacity-20 text-primary px-3 py-2 rounded-pill mb-3 fw-bold align-self-start">v3.2 Pure Blade</span>
                <h1 class="display-4 fw-bold mb-3">¡Bienvenido, <span class="text-info">Admin</span>!</h1>
                <p class="mb-4 opacity-75 fs-5">
                    Gestiona la excelencia académica con herramientas de última generación en un entorno limpio y rápido.
                </p>
                <div class="d-flex gap-3 flex-wrap">
                    <div class="d-flex align-items-center bg-white bg-opacity-10 py-2 px-3 rounded-4">
                        <i class="bi bi-calendar3 fs-4 me-3"></i>
                        <div>
                            <div class="small opacity-50 text-uppercase fw-bold" style="font-size: 0.65rem;">Estado</div>
                            <div class="fw-bold small text-nowrap">Sistema Activo</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-4 d-none d-lg-block text-end">
                <img src="{{ asset('rei_ayanami.png') }}" alt="Illustration" class="img-fluid rounded-4 shadow-lg" style="height: 340px; width: 100%; object-fit: cover; object-position: top center; border: 2px solid rgba(255,255,255,0.1);">
            </div>
        </div>
    </div>

    <!-- KPIs con datos de Blade -->
    <div class="row g-4 mb-4">
        <div class="col-md-4">
            <div class="surface-card hover-lift h-100">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <div class="icon-gradient icon-blue">
                        <i class="bi bi-people-fill fs-3"></i>
                    </div>
                </div>
                <div class="text-muted small text-uppercase fw-bold mb-1">Total Alumnos</div>
                <div class="h2 fw-bold mb-0">{{ $stats['totalAlumnos'] }}</div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="surface-card hover-lift h-100">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <div class="icon-gradient icon-orange">
                        <i class="bi bi-person-workspace fs-3"></i>
                    </div>
                </div>
                <div class="text-muted small text-uppercase fw-bold mb-1">Docentes Activos</div>
                <div class="h2 fw-bold mb-0">{{ $stats['totalDocentes'] }}</div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="surface-card hover-lift h-100">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <div class="icon-gradient icon-green">
                        <i class="bi bi-journal-check fs-3"></i>
                    </div>
                </div>
                <div class="text-muted small text-uppercase fw-bold mb-1">Matrículas Hoy</div>
                <div class="h2 fw-bold mb-0">{{ $stats['matriculasHoy'] }}</div>
            </div>
        </div>
    </div>

    <!-- Accesos Rápidos -->
    <h5 class="fw-bold mb-3 mt-4">Accesos Rápidos</h5>
    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-4 shadow-sm pb-4">
        <div class="col">
            <a href="{{ route('alumnos.index') }}" class="text-decoration-none">
                <div class="surface-card hover-lift h-100 transition-all text-center p-3">
                    <div class="icon-gradient icon-blue mb-3 mx-auto">
                        <i class="bi bi-people fs-4"></i>
                    </div>
                    <h6 class="fw-bold text-dark mb-1">Alumnos</h6>
                    <p class="text-muted small mb-0">Gestión</p>
                </div>
            </a>
        </div>
        <div class="col">
            <a href="{{ route('docentes.index') }}" class="text-decoration-none">
                <div class="surface-card hover-lift h-100 transition-all text-center p-3">
                    <div class="icon-gradient icon-orange mb-3 mx-auto">
                        <i class="bi bi-person-badge fs-4"></i>
                    </div>
                    <h6 class="fw-bold text-dark mb-1">Docentes</h6>
                    <p class="text-muted small mb-0">Personal</p>
                </div>
            </a>
        </div>
        <div class="col">
            <a href="{{ route('materias.index') }}" class="text-decoration-none">
                <div class="surface-card hover-lift h-100 transition-all text-center p-3">
                    <div class="icon-gradient icon-blue mb-3 mx-auto">
                        <i class="bi bi-book fs-4"></i>
                    </div>
                    <h6 class="fw-bold text-dark mb-1">Materias</h6>
                    <p class="text-muted small mb-0">Cursos</p>
                </div>
            </a>
        </div>
        <div class="col">
            <a href="{{ route('matriculas.index') }}" class="text-decoration-none">
                <div class="surface-card hover-lift h-100 transition-all text-center p-3">
                    <div class="icon-gradient icon-green mb-3 mx-auto">
                        <i class="bi bi-journal-check fs-4"></i>
                    </div>
                    <h6 class="fw-bold text-dark mb-1">Matrículas</h6>
                    <p class="text-muted small mb-0">Ciclos</p>
                </div>
            </a>
        </div>
        <div class="col">
            <a href="{{ route('inscripciones.index') }}" class="text-decoration-none">
                <div class="surface-card hover-lift h-100 transition-all text-center p-3">
                    <div class="icon-gradient icon-orange mb-3 mx-auto">
                        <i class="bi bi-journal-plus fs-4"></i>
                    </div>
                    <h6 class="fw-bold text-dark mb-1">Inscripciones</h6>
                    <p class="text-muted small mb-0">Controles</p>
                </div>
            </a>
        </div>
    </div>
</div>
@endsection
