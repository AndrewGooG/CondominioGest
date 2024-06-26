<?php

namespace App\Models\Cobro_Servicios;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PagoExpensas extends Model
{
    use HasFactory;
    protected $table = 'pago_expensas';
    protected $fillable = ['residente_id','montoPagar,expensa_id'];
    public function pagosExpensas()
    {
        return $this->hasMany(PagoExpensas::class, 'residente_id', 'id');
        
    }

    public function expensaCorrespondiente(){
        return $this->hasOne(PagoExpensas::class, 'expensa_id', 'id');

    }
}
