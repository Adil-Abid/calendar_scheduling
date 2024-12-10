<?php

use Illuminate\Database\Migrations\Migration;
use MongoDB\Laravel\Schema\Blueprint; // Correct namespace for Blueprint
use Illuminate\Support\Facades\Schema;

class CreateEventsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::connection('mongodb')->create('events', function (Blueprint $collection) {
            $collection->id(); // Primary key
            $collection->string('title'); // Event title
            $collection->timestamp('start'); // Start date and time
            $collection->timestamp('end'); // End date and time
            $collection->timestamps(); // Created at and updated at fields
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::connection('mongodb')->dropIfExists('events');
    }
}
