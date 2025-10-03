<?php

namespace App;
 

class Constants 
{
   public static function towTypes(){
    return [
        
          [  'label'=>'Flatbed','key'=>'flatbed'],
          [  'label'=>'Mini Flatbed','key'=>'mini_flatbed'],
          [  'label'=>'Heavy Duty Flatbed','key'=>'heavy_duty_flatbed'],
          [  'label'=>'Wheel-lift','key'=>'wheel_lift'],
          [  'label'=>'Boom or Heavy Duty Tow Truck','key'=>'heavy_duty_tow_truck'],
          [  'label'=>'Rotato','key'=>'rotato']
        
        ];
   }
   public static function vehicles(){
    return [
        [ 'label' => 'Bike/Scooter', 'key' => 'bike_scooter' ],
        [ 'label' => 'Electric Bike', 'key' => 'electric_bike' ],
        [ 'label' => 'Hatchback', 'key' => 'hatchback' ],
        [ 'label' => 'Sedan', 'key' => 'sedan' ],
        [ 'label' => 'SUV', 'key' => 'suv' ],
        [ 'label' => 'Electric Car', 'key' => 'electric_car' ],
        [ 'label' => 'Pickup Truck', 'key' => 'pickup_truck' ],
        [ 'label' => 'Auto/E-Rickshaw', 'key' => 'auto_e_rickshaw' ],
        [ 'label' => 'Mini Truck', 'key' => 'mini_truck' ],
        [ 'label' => 'Bus/School Van', 'key' => 'bus_school_van' ],
        [ 'label' => 'Tractor/Trolley', 'key' => 'tractor_trolley' ],
        [ 'label' => 'Luxury Car', 'key' => 'luxury_car' ],
        [ 'label' => 'JCB/Construction', 'key' => 'jcb_construction' ],
    ];
   }
   public  static function pricing(){
    return [
        'default_base_price'=>100,
        'default_per_km'=>4,
'price_by_tow'=>[
      [ 'key'=>'flatbed','by_vechile'=>[
          ['base_price'=>103,'price_per_km'=>4, 'key' => 'bike_scooter' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'electric_bike' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'hatchback' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'sedan' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'suv' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'electric_car' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'pickup_truck' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'auto_e_rickshaw' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'mini_truck' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'bus_school_van' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'tractor_trolley' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'luxury_car' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'jcb_construction' ],
      ]],
          [  'key'=>'mini_flatbed','by_vechile'=>[
              ['base_price'=>103,'price_per_km'=>4, 'key' => 'bike_scooter' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'electric_bike' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'hatchback' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'sedan' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'suv' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'electric_car' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'pickup_truck' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'auto_e_rickshaw' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'mini_truck' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'bus_school_van' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'tractor_trolley' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'luxury_car' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'jcb_construction' ],
          ]],
          [  'key'=>'heavy_duty_flatbed','by_vechile'=>[
              ['base_price'=>103,'price_per_km'=>4, 'key' => 'bike_scooter' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'electric_bike' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'hatchback' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'sedan' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'suv' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'electric_car' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'pickup_truck' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'auto_e_rickshaw' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'mini_truck' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'bus_school_van' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'tractor_trolley' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'luxury_car' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'jcb_construction' ],
          ]],
          [  'key'=>'wheel_lift','by_vechile'=>[
              ['base_price'=>103,'price_per_km'=>4, 'key' => 'bike_scooter' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'electric_bike' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'hatchback' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'sedan' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'suv' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'electric_car' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'pickup_truck' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'auto_e_rickshaw' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'mini_truck' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'bus_school_van' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'tractor_trolley' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'luxury_car' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'jcb_construction' ],
          ]],
          [  'key'=>'heavy_duty_tow_truck','by_vechile'=>[
              ['base_price'=>103,'price_per_km'=>4, 'key' => 'bike_scooter' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'electric_bike' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'hatchback' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'sedan' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'suv' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'electric_car' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'pickup_truck' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'auto_e_rickshaw' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'mini_truck' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'bus_school_van' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'tractor_trolley' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'luxury_car' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'jcb_construction' ],
          ]],
          [  'key'=>'rotato','by_vechile'=>[
              ['base_price'=>103,'price_per_km'=>4, 'key' => 'bike_scooter' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'electric_bike' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'hatchback' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'sedan' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'suv' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'electric_car' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'pickup_truck' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'auto_e_rickshaw' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'mini_truck' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'bus_school_van' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'tractor_trolley' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'luxury_car' ],
        ['base_price'=>103,'price_per_km'=>4, 'key' => 'jcb_construction' ],
          ]]
]
    ];
   }
}
