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
            'reporte_conductor_id' => 'nullable|exists:reportes_conductor,id',
            'direccion_exacta' => 'required|string',
            'vehiculos_involucrados' => 'required|string',
            'numero_heridos' => 'integer|min:0',
            'numero_fallecidos' => 'integer|min:0',
            'informe_pericial' => 'required|string',
            'estado_caso' => 'in:En proceso,Cerrado',
        ]);

        // Hardcode del oficial_id
        $validatedData['oficial_id'] = 1;

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
            'reporte_conductor_id' => 'nullable|exists:reportes_conductor,id',
            'direccion_exacta' => 'required|string',
            'vehiculos_involucrados' => 'required|string',
            'numero_heridos' => 'integer|min:0',
            'numero_fallecidos' => 'integer|min:0',
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

    /**
     * Búsqueda Multiparámetro (Rúbrica 6)
     * Busca accidentes aplicando filtros como estado_caso y fechas.
     */
    public function search(Request $request)
    {
        $query = AccidentePnc::with(['oficial', 'reporteConductor']);

        // Parámetro 1: estado_caso
        if ($request->has('estado_caso') && !empty($request->estado_caso)) {
            $query->where('estado_caso', $request->estado_caso);
        }

        // Parámetro 2: fecha_registro_oficial (puede ser una fecha exacta o a partir de una fecha)
        if ($request->has('fecha_registro') && !empty($request->fecha_registro)) {
            // Buscamos los accidentes por fecha específica ignorando la hora
            $query->whereDate('fecha_registro_oficial', $request->fecha_registro);
        }

        // Parámetro Extra: direccion_exacta
        if ($request->has('direccion') && !empty($request->direccion)) {
            $query->where('direccion_exacta', 'LIKE', '%' . $request->direccion . '%');
        }

        $resultados = $query->orderBy('fecha_registro_oficial', 'desc')->get();

        return response()->json($resultados);
    }
}
