@extends('layouts.app')

@section('title', 'Inicio - Sistema Académico')

@section('content')
<div id="welcome-screen" class="modulo-seccion">
    <div class="welcome-hero mb-4 p-5 rounded-4 shadow-lg text-white" style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);">
        <div class="row align-items-center">
            <div class="col-lg-7">
                <span class="badge bg-primary bg-opacity-20 text-primary px-3 py-2 rounded-pill mb-3 fw-bold">v3.0 Pure Blade</span>
                <h1 class="display-3 fw-bold mb-4">¡Bienvenido, <span class="text-info">Admin</span>!</h1>
                <p class="mb-5 opacity-75 fs-4">
                    Gestiona la excelencia académica con herramientas de última generación en un entorno limpio y rápido.
                </p>
                <div class="d-flex gap-4 flex-wrap">
                    <div class="d-flex align-items-center bg-white bg-opacity-10 p-3 rounded-4">
                        <i class="bi bi-calendar3 fs-3 me-3"></i>
                        <div>
                            <div class="small opacity-50 text-uppercase fw-bold">Estado</div>
                            <div class="fw-bold">Sistema Activo</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-5 d-none d-lg-block text-center">
                <img src="{{ asset('rei_ayanami.png') }}" alt="Illustration" class="img-fluid rounded-4 shadow-lg" style="max-height: 480px; border: 4px solid rgba(255,255,255,0.1);">
            </div>
        </div>
    </div>

    <!-- KPIs con datos de Blade -->
    <div class="row g-4 mb-4">
        <div class="col-md-4">
            <div class="surface-card p-4 h-100">
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
            <div class="surface-card p-4 h-100">
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
            <div class="surface-card p-4 h-100">
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
    <h5 class="fw-bold mb-3">Accesos Rápidos</h5>
    <div class="row g-4">
        <div class="col-md-4">
            <a href="{{ route('alumnos.index') }}" class="text-decoration-none">
                <div class="surface-card p-4 h-100 transition-all hover-translate">
                    <div class="icon-gradient icon-blue mb-4">
                        <i class="bi bi-people fs-2"></i>
                    </div>
                    <h5 class="fw-bold text-dark">Alumnos</h5>
                    <p class="text-muted small mb-0">Gestión de expedientes.</p>
                </div>
            </a>
        </div>
        <!-- Repetir para otros si es necesario -->
    </div>
</div>
@endsection

@push('styles')
<style>
    .welcome-hero { position: relative; overflow: hidden; }
    .hover-translate:hover { transform: translateY(-5px); transition: transform 0.3s ease; }
</style>
@endpush
