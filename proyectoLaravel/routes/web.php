<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\DashboardController;

Route::get('/', [DashboardController::class, 'index']);

Route::get('/bienvenida', function () {
    return "Esta es la página de bienvenida secundaria sin errores.";
});