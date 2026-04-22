<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReporteConductor extends Model
{
    use HasFactory;

    protected $table = 'reportes_conductor';

    protected $fillable = [
        'usuario_id',
        'referencia_ubicacion',
        'tipo_incidente',
        'descripcion_hechos',
        'placa_avistada',
        'fecha_siniestro',
        'estado',
    ];

    // Tu tabla tiene `created_at` por defecto, pero NO tiene `updated_at`.
    const UPDATED_AT = null;

    protected $casts = [
        'fecha_siniestro' => 'datetime',
    ];

    /**
     * Relación: Un reporte pertenece a un usuario (Conductor)
     */
    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }

    /**
     * Relación: Un reporte puede desencadenar / asociarse a un accidente de PNC
     */
    public function accidentePnc()
    {
        return $this->hasOne(AccidentePnc::class, 'reporte_conductor_id');
    }
}
