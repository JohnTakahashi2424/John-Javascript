<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\DashboardController;

Route::get('/', [DashboardController::class, 'index'])->name('home');

Route::get('/alumnos', function() { return view('alumnos.index'); })->name('alumnos.index');
Route::get('/docentes', function() { return view('docentes.index'); })->name('docentes.index');
Route::get('/materias', function() { return view('materias.index'); })->name('materias.index');
Route::get('/matriculas', function() { return view('matriculas.index'); })->name('matriculas.index');
Route::get('/inscripciones', function() { return view('inscripciones.index'); })->name('inscripciones.index');

Route::get('/bienvenida', function () {
    return view('bienvenida');
});