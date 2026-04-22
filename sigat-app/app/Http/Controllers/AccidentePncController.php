<?php

namespace App\Http\Controllers;

use App\Models\AccidentePnc;
use Illuminate\Http\Request;

class AccidentePncController extends Controller
{
    public function index()
    {
        // Incluimos al oficial a cargo y el reporte asociado (si existe).
        $accidentes = AccidentePnc::with(['oficial', 'reporteConductor'])->orderBy('fecha_registro_oficial', 'desc')->get();
        return response()->json($accidentes);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'oficial_id' => 'required|exists:usuarios,id',
            'reporte_conductor_id' => 'nullable|exists:reportes_conductor,id',
            'direccion_exacta' => 'required|string',
            'vehiculos_involucrados' => 'required|string',
            'numero_heridos' => 'integer|min:0',
            'numero_fallecidos' => 'integer|min:0',
            'informe_pericial' => 'required|string',
            'estado_caso' => 'in:En proceso,Cerrado',
        ]);

        $accidente = AccidentePnc::create($validatedData);

        return response()->json([
            'message' => 'Incidente de tránsito registrado con éxito',
            'data' => $accidente
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $accidente = AccidentePnc::findOrFail($id);

        $validatedData = $request->validate([
            'estado_caso' => 'required|in:En proceso,Cerrado',
            'informe_pericial' => 'string'
        ]);

        $accidente->update($validatedData);

        return response()->json([
            'message' => 'Actualización pericial guardada',
            'data' => $accidente
        ]);
    }

    public function destroy($id)
    {
        $accidente = AccidentePnc::findOrFail($id);
        $accidente->delete();

        return response()->json(['message' => 'Registro eliminado exitosamente']);
    }
}
