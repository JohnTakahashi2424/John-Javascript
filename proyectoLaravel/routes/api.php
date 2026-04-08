<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AlumnoController;
use App\Http\Controllers\Api\DocenteController;
use App\Http\Controllers\Api\MateriaController;
use App\Http\Controllers\Api\MatriculaController;
use App\Http\Controllers\Api\InscripcionController;
use App\Http\Controllers\DashboardController;

Route::name('api.')->group(function() {
    Route::get('/stats', [DashboardController::class, 'getStats']);

    Route::apiResource('alumnos', AlumnoController::class);
    Route::apiResource('docentes', DocenteController::class);
    Route::apiResource('materias', MateriaController::class);
    Route::apiResource('matriculas', MatriculaController::class);
    Route::apiResource('inscripciones', InscripcionController::class);
});
