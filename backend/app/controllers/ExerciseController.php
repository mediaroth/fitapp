<?php

class ExerciseController extends BaseController {

  public function __construct() {
    $this->exercise = null;
    $this->exercises = Exercise::all();
  }

	public function index()
	{
    return Response::json(Exercise::all());
	}
  public function show($id)
  {
    return Response::json(Exercise::find($id));
  }
  public function destroy($id)
  {
    // delete
    Exercise::destroy($id);
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
      $exercise = Exercise::find($id);
      $exercise->name = Input::get('name');
      $exercise->description = Input::get('description');
      $exercise->save();
      return Response::json(array('success'=>true));
    }
    // return View::make('exercise/index')->with('data',array('page'=>'exercise'));
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
      Exercise::create(array(
        'name' => Input::get('name'),
        'description' => Input::get('description')
      ));
      return Response::json(array('success'=>true));
    }
    // return View::make('exercise/index')->with('data',array('page'=>'exercise'));
  }

}