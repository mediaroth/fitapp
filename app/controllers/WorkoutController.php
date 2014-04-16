<?php

class WorkoutController extends BaseController {

	public function index()
	{
		return View::make('workout/index')->with('data',array('page'=>'workout'));
	}

}