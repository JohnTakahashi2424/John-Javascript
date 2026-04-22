<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ReporteConductorController;
use App\Http\Controllers\AccidentePncController;

/*
|--------------------------------------------------------------------------
| Rutas Públicas (Sin autenticación)
|--------------------------------------------------------------------------
*/
Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Rutas Protegidas (Con Sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    
    // Auth - Obtener usuario actual y logout
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);

    // Rutas para Reportes de Conductor
    Route::get('/reportes-conductor', [ReporteConductorController::class, 'index']);
    Route::post('/reportes-conductor', [ReporteConductorController::class, 'store']);
    Route::put('/reportes-conductor/{id}', [ReporteConductorController::class, 'update']);
    Route::delete('/reportes-conductor/{id}', [ReporteConductorController::class, 'destroy']);

    // Rutas para Accidentes PNC
    Route::get('/accidentes-pnc', [AccidentePncController::class, 'index']);
    Route::post('/accidentes-pnc', [AccidentePncController::class, 'store']);
    Route::put('/accidentes-pnc/{id}', [AccidentePncController::class, 'update']);
    Route::delete('/accidentes-pnc/{id}', [AccidentePncController::class, 'destroy']);
    
    // Método Multiparámetro (Rúbrica 6)
    Route::post('/accidentes-pnc/search', [AccidentePncController::class, 'search']);

});
