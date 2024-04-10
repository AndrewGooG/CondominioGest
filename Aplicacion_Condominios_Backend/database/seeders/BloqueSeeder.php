<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\bloque;
class BloqueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        Bloque::factory()->withoutTimestamps()->count(5)->create();

        /* $bloqs=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
        foreach($bloqs as $bloq){
            Bloque::create([
                'nombre_bloque' => 'Bloque '.$bloq,
                'direccion_bloque' => 'Direccion del Bloque '.$bloq,
                'descripcion_bloque' => 'Descripcion del Bloque '.$bloq,
                'imagen_bloque' => 'https://picsum.photos/640/480'
            ]); 
        }*/
        
    }
}
