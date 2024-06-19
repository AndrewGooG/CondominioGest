<?php

namespace App\Http\Controllers\Empleados;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Empleados\Asistencia;

class AsistenciaController extends Controller
{
    public function store(){

    }

    public function obtenerAsistencias(){
        $asistencias = Asistencia::with('asistencias')
                                 ->orderBy('fecha','desc')
                                 ->get();

        return response()->json([
            'status' => 200,
            'asistencias' => $asistencias,
        ]);
    }
}
