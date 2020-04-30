<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Place;

class PlacesController extends Controller
{
    //
    public function index(){

        $places = Place::all();

        //return response()->json($places);

        return view('place', ['places' => $places,]);
    }

    public function indexJson(){

        $placesJson = Place::all();

        return response()->json($placesJson);
    }

    public function create(Request $request){

        $newPlace = new Place();
        $newPlace -> title = $request -> title;
        $newPlace -> lat = $request -> lat;
        $newPlace -> long = $request -> long;
        $newPlace -> save();

        return redirect('/map');

    }

    public function searchPlace($params){
        $output=Place::where('title','LIKE','%'.$params."%")->get();
        if($output)
        {
            return Response(json_encode($output), 200);
        }
        

    }

    public function updatePlace(Request $request, $id) {
        if (Place::where('id', $id)->exists()) {
            $updatingPlace = Place::find($id);
            $updatingPlace->title = is_null($request->title) ? $updatingPlace->title : $request->title;
            $updatingPlace->lat = is_null($request->lat) ? $updatingPlace->lat : $request->lat;
            $updatingPlace->long = is_null($request->long) ? $updatingPlace->long : $request->long;
            $updatingPlace->save();
    
            return response()->json([
                "message" => "updated successfully"
            ], 200);
            } else {
            return response()->json([
                "message" => "id not found"
            ], 404);
            
        }
    }

    public function destroy($id)
    {
        $destroyPlace = Place::findOrFail($id);

        $destroyPlace->delete();

        return redirect('/map');
    }

    public function deletePlace($id)
    {

        if(Place::where('id', $id)->exists()) {

            $destroyPlace = Place::find($id);

            $destroyPlace->delete();
    
            return response()->json([
              "message" => "place deleted"
            ], 202);
            } else {
                return response()->json([
                "message" => "Place not found"
                ], 404);
            }
    }
}
