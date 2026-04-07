<?php

namespace App\Http\Controllers;

use App\Models\Alumno;
use App\Models\Docente;
use App\Models\Matricula;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Muestra la página principal con estadísticas reales.
     */
    public function index()
    {
        // Conteo total de alumnos
        $totalAlumnos = Alumno::count();

        // Conteo total de docentes
        $totalDocentes = Docente::count();

        // Conteo de matrículas realizadas hoy
        $matriculasHoy = Matricula::whereDate('fecha', Carbon::today())->count();

        return view('welcome', compact('totalAlumnos', 'totalDocentes', 'matriculasHoy'));
    }
}
