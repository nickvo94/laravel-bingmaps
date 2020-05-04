<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class PlacesTableV2 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('places', function (Blueprint $table) {
            $table->integer('open_hour')->default(0);
            $table->integer('open_min')->default(0);
            $table->integer('close_hour')->default(0);
            $table->integer('close_min')->default(0);
            $table->string('description')->default('');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
