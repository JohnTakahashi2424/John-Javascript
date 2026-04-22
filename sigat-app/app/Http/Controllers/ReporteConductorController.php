<?php

namespace App\Http\Controllers;

use App\Models\ReporteConductor;
use Illuminate\Http\Request;

class ReporteConductorController extends Controller
{
    public function index()
    {
        // Traemos todos los reportes con la info de su respectivo usuario.
        $reportes = ReporteConductor::with('usuario')->orderBy('created_at', 'desc')->get();
        return response()->json($reportes);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'referencia_ubicacion' => 'required|string',
            'tipo_incidente' => 'required|string|max:100',
            'descripcion_hechos' => 'required|string',
            'placa_avistada' => 'nullable|string|max:20',
            'fecha_siniestro' => 'required|date',
            'estado' => 'in:Enviado,En proceso,Resuelto',
        ]);

        // Hardcode del usuario_id para evitar error de FK en este entorno público
        $validatedData['usuario_id'] = 1;

        $reporte = ReporteConductor::create($validatedData);

        return response()->json([
            'message' => 'Reporte generado con éxito',
            'data' => $reporte
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $reporte = ReporteConductor::findOrFail($id);

        $validatedData = $request->validate([
            'referencia_ubicacion' => 'required|string',
            'tipo_incidente' => 'required|string|max:100',
            'descripcion_hechos' => 'required|string',
            'placa_avistada' => 'nullable|string|max:20',
            'fecha_siniestro' => 'required|date',
            'estado' => 'in:Enviado,En proceso,Resuelto',
        ]);

        $reporte->update($validatedData);

        return response()->json([
            'message' => 'Reporte actualizado exitosamente',
            'data' => $reporte
        ]);
    }

    public function destroy($id)
    {
        $reporte = ReporteConductor::findOrFail($id);
        $reporte->delete();

        return response()->json(['message' => 'Reporte eliminado del sistema']);
    }
}
