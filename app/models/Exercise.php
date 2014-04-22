<?php

class Exercise extends Eloquent {

	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
  protected $fillable = array('name', 'description'); 
	protected $table = 'exercises';

}