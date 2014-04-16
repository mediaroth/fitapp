<?php

class ExerciseController extends BaseController {

  public function __construct() {
    $this->exercise = null;
    $this->exercises = exercise::all();
  }

	public function index()
	{
    return View::make('exercise/index')->with('data',array('page'=>'exercise','exercises'=>$this->exercises));
	}
  public function destroy($id)
  {
    // delete
    $exercise = Exercise::find($id);
    $exercise->delete();

    // redirect
    Session::flash('message', 'Successfully deleted the exercise!');
    return Redirect::to('exercise');
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
      return Redirect::to('exercise/'.$id.'/edit')
        ->withErrors($validator)
        ->withInput();
    } else {
      // store
      $exercise = Exercise::find($id);
      $exercise->name = Input::get('name');
      $exercise->description = Input::get('description');
      $exercise->save();

      // redirect
      Session::flash('message', 'Successfully updated exercise!');
      return Redirect::to('exercise/'.$id.'/edit');
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

    // process the login
    if ($validator->fails()) {
      return Redirect::to('exercise')
        ->withErrors($validator)
        ->withInput();
    } else {
      // store
      $exercise = new Exercise;
      $exercise->name = Input::get('name');
      $exercise->description = Input::get('description');
      $exercise->save();

      // redirect
      Session::flash('message', 'Successfully created exercise!');
      return Redirect::to('exercise');
    }
    // return View::make('exercise/index')->with('data',array('page'=>'exercise'));
  }
  public function edit($id)
  {
    $this->exercise = exercise::find($id);
    return View::make('exercise/index')->with('data',array('page'=>'exercise','exercises'=>$this->exercises,'exercise'=>$this->exercise));
  }

}