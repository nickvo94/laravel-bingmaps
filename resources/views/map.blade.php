<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <title>loadmapsyncHTML</title>
        <meta http-equiv='Content-Type' content='text/html; charset=utf-8'/>
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <style type='text/css'>body{margin:0;padding:0;overflow:hidden;font-family:'Segoe UI',Helvetica,Arial,Sans-Serif}</style>
        <link rel="stylesheet" href="{{asset('/css/app.css') }}">
        <script type='text/javascript' src='https://www.bing.com/api/maps/mapcontrol?key=AoDOQpJ63wfxcif_EWqkh4ta3LPquD-k20VBdBSwYJZS3hH9X0X5ID_5FqUJr9Pt&callback=loadMapCB' async defer>
        </script>
        <script src="{{ URL::asset('/js/app.js') }}"></script>
    </head>
    <body onload="loadPlace()">
        <div class="container">

            <div id="info" class="sidebar">
                <div class="sidebarWrapper">
                    <h1>Map Application</h1>
                    <div id="list-view-layout">
                        <i class="fa fa-plus fa-lg" aria-hidden="true" type="submit" id="add-view-mode" onclick="ActivateMode(id)"> Add Place</i>
                        <br>
                        <section id="search">
                            <input type="text" id="searchInput" onkeyup="searchFunction()" placeholder="Search by title ..." title="Type in a name">
                            <label for="searchInput"><i class="fa fa-search" aria-hidden="true"></i></label>
                        </section>
                        <i class="fa fa-filter fa-sm" aria-hidden="true" type="submit" id="filter" onclick="TimeFilter()"> Open Now</i>
                        <div style="max-width:100%; overflow:auto;">
                            <table id="placesDisplay"></table>
                        </div>
                        <div id="edit-delete-function"></div>
                    </div>
                    <div id="edit-view-layout"></div>
                    <div id="add-view-layout"></div>
{{--                     <form method="post">
                        <input type="text" name="title" placeholder="Title">
                        <input type="text" name="lat" placeholder="Lat">
                        <input type="text" name="long" placeholder="Long">
                        {{ csrf_field() }}
                        <button type="submit">Submit</button>
                    </form> --}}
                </div>
            </div>
            <div id='myMap' class="main"></div>
            
        </div>
        {{-- @yield('content') --}}

        <script src="{{asset('/js/app.js') }}"></script>
    </body>
</html>
