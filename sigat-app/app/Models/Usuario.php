<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Usuario extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $table = 'usuarios';

    protected $fillable = [
        'nombre_completo',
        'correo_electronico',
        'password',
        'rol',
    ];

    protected $hidden = [
        'password',
    ];

    // Anulamos updated_at y mapeamos created_at a tu columna
    const CREATED_AT = 'fecha_registro';
    const UPDATED_AT = null;

    /**
     * Relaciones del usuario: Dependiendo de su rol, puede tener reportes o incidentes.
     */
    public function reportesConductor()
    {
        return $this->hasMany(ReporteConductor::class, 'usuario_id');
    }

    public function accidentesPnc()
    {
        return $this->hasMany(AccidentePnc::class, 'oficial_id');
    }

    /**
     * Sobrescribir para usar 'correo_electronico' como el nombre de usuario para Laravel Auth.
     */
    public function getAuthIdentifierName()
    {
        return 'correo_electronico';
    }

    /**
     * Accesor para que 'email' apunte a 'correo_electronico' (compatible con plugins).
     */
    public function getEmailAttribute()
    {
        return $this->correo_electronico;
    }
}
