@extends('map')

@section('content')

    <h1>Places</h1>

    <ul>
        @foreach($places as $place)
            <li>
                <form method="post" action="{{ route('place.destroy', [$place->id]) }}">
                    {{$place->id}} - {{$place->title}} - {{$place->lat}} - {{$place->long}}
                    {{ csrf_field() }}
                    {{ method_field('DELETE') }}
                    <button type="submit">Delete</button>
                </form>
            </li>

        @endforeach
    
    </ul>

    <form method="post">
        <input type="text" name="title" placeholder="Title">
        <input type="text" name="lat" placeholder="Lat">
        <input type="text" name="long" placeholder="Long">
        {{ csrf_field() }}
        <button type="submit">Submit</button>
    </form>



@endsection

        

