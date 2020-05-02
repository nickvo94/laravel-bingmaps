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
            $table->integer('open-hour')->default(0);
            $table->integer('open-min')->default(0);
            $table->integer('close-hour')->default(0);
            $table->integer('close-min')->default(0);
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
