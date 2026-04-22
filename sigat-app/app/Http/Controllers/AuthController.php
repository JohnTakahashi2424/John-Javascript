<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'correo_electronico' => 'required|email',
            'password' => 'required',
        ]);

        $usuario = Usuario::where('correo_electronico', $request->correo_electronico)->first();

        // Verificamos si existe el usuario o si la password es incorrecta
        // Nota: en producción $usuario->password debería estar hasheada.
        // Si tienes las contraseñas en texto plano (por ser un entorno de desarrollo simple), puedes comparar directamente.
        // Aquí usamos Hash::check que es el estándar de Laravel.
        if (! $usuario || ! Hash::check($request->password, $usuario->password)) {
            // Si la db tiene contraseñas en texto plano, cambia la linea anterior por: if (!$usuario || $request->password !== $usuario->password) {
            throw ValidationException::withMessages([
                'correo_electronico' => ['Las credenciales son incorrectas.'],
            ]);
        }

        // Crear token de Sanctum
        $token = $usuario->createToken('sigat-auth-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'usuario' => $usuario,
            'rol' => $usuario->rol
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sesión cerrada exitosamente.'
        ]);
    }
}
