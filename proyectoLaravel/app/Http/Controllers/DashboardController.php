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
        $stats = $this->getStatsData();
        return view('welcome', compact('stats'));
    }


    /**
     * Retorna estadísticas en formato JSON para la SPA.
     */
    public function getStats()
    {
        return response()->json($this->getStatsData());
    }

    private function getStatsData()
    {
        return [
            'totalAlumnos' => Alumno::count(),
            'totalDocentes' => Docente::count(),
            'matriculasHoy' => Matricula::whereDate('fecha', Carbon::today())->count(),
        ];
    }
}

