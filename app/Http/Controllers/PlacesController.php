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

        $placesJson = Place::all()->toJson(JSON_PRETTY_PRINT);

        return response($placesJson, 200);
    }

    public function create(Request $request){

        $newPlace = new Place();
        $newPlace -> title = is_null($request->title) ? '' : $request -> title;
        $newPlace -> lat = is_null($request->lat) ? 0 : $request -> lat;
        $newPlace -> long = is_null($request->long) ? 0 : $request -> long;
        $newPlace -> open_hour = is_null($request->open_hour) ? 0 : $request -> open_hour;
        $newPlace -> open_min = is_null($request->open_min) ? 0 : $request -> open_min;
        $newPlace -> close_hour = is_null($request->close_hour) ? 0 : $request -> close_hour;
        $newPlace -> close_min = is_null($request->close_min) ? 0 : $request -> close_min;
        $newPlace -> description = is_null($request->description) ? '' : $request -> description;
        $newPlace -> save();

        return response()->json([
            "message" => "new place created"
        ], 200);

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
            $updatingPlace->open_hour = is_null($request->open_hour) ? $updatingPlace->open_hour : $request->open_hour;
            $updatingPlace->open_min = is_null($request->open_min) ? $updatingPlace->open_min : $request->open_min;
            $updatingPlace->close_hour = is_null($request->close_hour) ? $updatingPlace->close_hour : $request->close_hour;
            $updatingPlace->close_min = is_null($request->close_min) ? $updatingPlace->close_min : $request->close_min;
            $updatingPlace->description = is_null($request->description) ? $updatingPlace->description : $request->description;
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
            ], 200);
            } else {
                return response()->json([
                "message" => "Place not found"
                ], 404);
            }
    }
}
