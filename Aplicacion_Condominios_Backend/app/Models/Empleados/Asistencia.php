<?php

namespace App\Models\Empleados;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Empleados\Employee;

class Asistencia extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_empleado',
        'hora_entrada',
        'hora_salida'
    ];

    public function asistencias(){
        return $this->belongsTo(Employee::class,'id_empleado');
    }
}
