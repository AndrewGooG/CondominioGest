<?php

namespace App\Http\Controllers\CommonArea;

use App\Http\Controllers\Controller;
use App\Http\Requests\CommonArea\ReservationRequest;
use App\Http\Resources\CommonArea\ReservationCollection;
use App\Http\Resources\CommonArea\ReservationResource;
use App\Models\CommonArea\CommonArea;
use App\Models\CommonArea\Reservation;
use App\Models\GestDepartamento\Residente;
use App\Services\CommonArea\CommonAreaService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class ReservationController extends Controller
{

    private $commonAreaService;

    public function __construct(
        CommonAreaService $commonAreaService
    ) {
        $this->commonAreaService = $commonAreaService;
    }

    public function index()
    {
        $reservations = Reservation::all();

        return response()->json(new ReservationCollection($reservations), 200);
    }

    public function store(ReservationRequest $request)
    {
        [
            "idResident" => $id_resident,
            "idCommonArea" => $id_common_area,
            "reservationDate" => $reserved_date,
            "startTime" => $start_time,
            "endTime" => $end_time,
            "reason" => $reason,
            "numberPeople" => $number_people,
            "title" => $title,
        ] = $request->all();

        $isValidate = $this->commonAreaService->validateTimeReservation($id_common_area, $reserved_date, $start_time, $end_time);

        if (!$isValidate) {
            return response()->json(['message' => 'El horario no esta disponible.', "errors" => []], 400);
        }

        $commonArea = CommonArea::find($id_common_area);
        $resident = Residente::find($id_resident);

        if (!$commonArea) {
            return response()->json(['message' => 'Area comun no encontrada', "errors" => []], 404);
        }

        if (!$resident) {
            return response()->json(['message' => 'Residente no encontrado', "errors" => []], 404);
        }

        try {
            Reservation::create([
                'reserved_date' => $reserved_date,
                'start_time' => $start_time,
                'end_time' => $end_time,
                'reason' => $reason,
                'number_of_people' => $number_people,
                'title' => $title,
                'reserva_pagada' => 0, // Establecer el valor predeterminado a 0,
                'id_common_area' => $id_common_area,
                'id_resident' => $id_resident
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al crear la reservacion.', "errors" => [
                $e->getMessage()
            ]], 500);
        }

        return response()->json(['message' => 'Reservación creada correctamente'], 201);
    }

    public function cancelReservationsNext5Days($idCommonArea)
    {
        $today = Carbon::now()->toDateString();
        $fiveDaysLater = Carbon::now()->addDays(5)->toDateString();

        $reservationsToCancel = Reservation::whereBetween('reserved_date', [$today, $fiveDaysLater])
            ->where('cancelled', false)
            ->get();

        foreach ($reservationsToCancel as $reservation) {
            if ($reservation->id_common_area === $idCommonArea) {
                $reservation->cancelled = true;
                $reservation->save();
            }
        }
    }

    public function getReservationById($id)
    {
        $reservation = Reservation::find($id);

        if (!$reservation) {
            return response()->json(['message' => 'Reservación no encontrada', "errors" => []], 404);
        }

        return response()->json(new ReservationResource($reservation), 200);
    }

    public function getReservationsAfterDate($date, $common_area_name)
    {
        $commonArea = CommonArea::where('common_area_name', $common_area_name)->first();

        if (!$commonArea) {
            return response()->json(['message' => 'Área común no encontrada', 'errors' => []], 404);
        }

        $reservations = Reservation::where('id_common_area', $commonArea->id_common_area)
            ->where('reserved_date', '>=', $date)
            ->with('resident')
            ->get();

        $formattedReservations = $reservations->map(function ($reservation) {
            return [
                'id' => $reservation->id,
                'reserved_date' => $reservation->reserved_date,
                'reason' => $reservation->reason,
                'resident_name' => $reservation->resident->nombre_residente,
                'resident_email' => $reservation->resident->email_residente,
            ];
        });

        return response()->json($formattedReservations, 200);
    }

    public function disableReasonCommonArea($idCommonArea)
    {
        $commonArea = CommonArea::find($idCommonArea);
        $disableReasons = $commonArea->disableReasons()->get();
        $disableReasons = collect($disableReasons)->filter(function ($reason) {
            return $reason->active;
        })->values()->toArray();

        return response()->json($disableReasons, 200);
    }
    public function getCommonAreaAvailability($commonAreaName)
    {
        $commonArea = CommonArea::where('common_area_name', $commonAreaName)->first();

        if ($commonArea) {
            return response()->json(['available' => $commonArea->available], 200);
        } else {
            return response()->json(['error' => 'Common area not found'], 404);
        }
    }
}
