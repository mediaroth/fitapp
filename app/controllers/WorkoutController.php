<?php

class WorkoutController extends BaseController {

  public function __construct() {
    $this->workout = null;
    $this->workouts = Workout::all();
  }

  public function index()
  {
    return Response::json(Workout::all());
  }
  public function show($id)
  {
    return Response::json(Workout::find($id));
  }
  public function destroy($id)
  {
    // delete
    Workout::destroy($id);
    return Response::json(array('success' => true));
  }
  public function update($id)
  {
    // validate
    // read more on validation at http://laravel.com/docs/validation
    $rules = array(
      'name'       => 'required',
    );
    $validator = Validator::make(Input::all(), $rules);

    // process the login
    if ($validator->fails()) {
      return Response::json(array('error'=>true,'errors'=>$validator->errors()->all()),400);
    } else {
      // store
      $workout = Workout::find($id);
      $workout->name = Input::get('name');
      $workout->description = Input::get('description');
      $workout->save();
      return Response::json(array('success'=>true));
    }
  }
  public function store()
  {
    // validate
    // read more on validation at http://laravel.com/docs/validation
    $rules = array(
      'name'       => 'required',
    );
    $validator = Validator::make(Input::all(), $rules);

    if ($validator->fails()) {
      return Response::json(array('error'=>true,'errors'=>$validator->errors()->all()),400);
    } else {
      // store
      Workout::create(array(
        'name' => Input::get('name'),
        'description' => Input::get('description')
      ));
      return Response::json(array('success'=>true));
    }
  }

}