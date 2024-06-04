<?php

namespace App\Providers;

use App\Observers\ContratoObserver;
use Illuminate\Support\ServiceProvider;
use App\Models\GestDepartamento\Contrato;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
        Contrato::observe(ContratoObserver::class);
    }
}
