<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/map', 'PlacesController@index');

Route::get('/map/json', 'PlacesController@indexJson');

Route::get('map/search/{params}','PlacesController@searchPlace');

Route::post('/map', 'PlacesController@create');

Route::put('/map/{id}', 'PlacesController@updatePlace');

Route::delete('/map/delete/{id}', 'PlacesController@deletePlace');

Route::delete('/map/{id}', 'PlacesController@destroy')->name('place.destroy');