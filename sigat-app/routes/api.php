<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ReporteConductorController;
use App\Http\Controllers\AccidentePncController;

/*
|--------------------------------------------------------------------------
| Application API Routes (SIGAT Público / Sin Login)
|--------------------------------------------------------------------------
*/

// Rutas Públicas para Reportes de Conductor
Route::get('/reportes-conductor', [ReporteConductorController::class, 'index']);
Route::post('/reportes-conductor', [ReporteConductorController::class, 'store']);
Route::put('/reportes-conductor/{id}', [ReporteConductorController::class, 'update']);
Route::delete('/reportes-conductor/{id}', [ReporteConductorController::class, 'destroy']);

// Rutas Públicas para Accidentes PNC
Route::get('/accidentes-pnc', [AccidentePncController::class, 'index']);
Route::post('/accidentes-pnc', [AccidentePncController::class, 'store']);
Route::put('/accidentes-pnc/{id}', [AccidentePncController::class, 'update']);
Route::delete('/accidentes-pnc/{id}', [AccidentePncController::class, 'destroy']);

// Rúbrica 6: Búsqueda dinámica Multiparámetro
Route::post('/accidentes-pnc/search', [AccidentePncController::class, 'search']);
