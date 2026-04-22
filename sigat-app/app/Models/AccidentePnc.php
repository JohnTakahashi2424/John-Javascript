<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccidentePnc extends Model
{
    use HasFactory;

    protected $table = 'accidentes_pnc';

    protected $fillable = [
        'oficial_id',
        'reporte_conductor_id',
        'direccion_exacta',
        'vehiculos_involucrados',
        'numero_heridos',
        'numero_fallecidos',
        'informe_pericial',
        'estado_caso',
    ];

    // Configurando los timestamps según tu base de datos
    const CREATED_AT = 'fecha_registro_oficial';
    const UPDATED_AT = null;

    /**
     * Relación: Relacionado al oficial a cargo del caso.
     */
    public function oficial()
    {
        return $this->belongsTo(Usuario::class, 'oficial_id');
    }

    /**
     * Relación: Vinculado a un reporte emitido previamente por un conductor (Opcional).
     */
    public function reporteConductor()
    {
        return $this->belongsTo(ReporteConductor::class, 'reporte_conductor_id');
    }
}
