<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="dark">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>SIGAT - Stellar Trafic</title>

        <!-- Google Fonts: Inter -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700&display=swap" rel="stylesheet" />

        <!-- Bootstrap CSS (CDN para asegurar Dark Mode y consistencia rápida) -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        
        <style>
            body { 
                font-family: 'Inter', sans-serif;
                background-color: #22272e !important; /* Aesthetic Dark Mode BG */
                color: #c9d1d9 !important;
            }
        </style>

        <!-- Conexión directa a Vue y Vite -->
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body class="bg-dark text-light">
        <!-- Contenedor maestro donde se monta Vue -->
        <div id="app"></div>

        <!-- Bootstrap Bundle JS -->
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    </body>
</html>
