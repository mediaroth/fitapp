<?php
use Rhumsaa\Uuid\Uuid;
class UserController extends BaseController {

  public function __construct() {
    // THIS SHOULD BE IMPLEMENTED
    // $this->beforeFilter('csrf', array('on'=>'post'));
  }

	public function index()
	{
    return Response::json(User::all());
	}
  public function login()
  {
    if (Auth::attempt(array('email'=>Input::get('email'), 'password'=>Input::get('password')))) {
      $uuid = (string) Uuid::uuid4();
      Session::put('user.token', $uuid);
      return Response::json(array('success' => true,'user'=>array('email'=>Auth::user()->email,'role'=>Auth::user()->role,'token'=>$uuid)));
    } else {
      return Response::json(array('error'=>true,'errors'=>array('User was not found.')),401);
    }
  }
  public function auth()
  {
    if (Session::get('user.token') != "" && Session::get('user.token') === Request::input('token')) {
      return Response::json(array('success' => true,'user'=>array('email'=>Auth::user()->email,'role'=>Auth::user()->role,'token'=>Session::get('user.token'))));
    } else {
      return Response::json(array('error'=>true,'errors'=>array('User was not found.')),401);
    }
  }
  public function show($id)
  {
    return Response::json(User::find($id));
  }
  public function destroy($id)
  {
    // delete
    User::destroy($id);
    return Response::json(array('success' => true));
  }
  public function update($id)
  {
    // validate
    // read more on validation at http://laravel.com/docs/validation
    $rules = array(
      'name'       => 'required|alpha',
      'email'       => 'required|email|unique:users',
      'password'       => 'required|alpha_num|between:6,12|confirmed',
      'password_confirmation'       => 'required|alpha_num|between:6,12',
    );
    $validator = Validator::make(Input::all(), $rules);

    if ($validator->fails()) {
      return Response::json(array('error'=>true,'errors'=>$validator->errors()->all()),400);
    } else {
      // store
      $user = User::find($id);
      $user->name = Input::get('name');
      $user->email = Input::get('email');
      $user->password = Hash::make(Input::get('password'));
      $user->save();
      return Response::json(array('success'=>true));
    }
    // return View::make('user/index')->with('data',array('page'=>'user'));
  }
  public function store()
  {
    // validate
    // read more on validation at http://laravel.com/docs/validation
    $rules = array(
      'name'       => 'required',
      'email'       => 'required|email|unique:users',
      'password'       => 'required|alpha_num|between:6,12|confirmed',
      'password_confirmation'       => 'required|alpha_num|between:6,12',
    );
    $validator = Validator::make(Input::all(), $rules);

    if ($validator->fails()) {
      return Response::json(array('error'=>true,'errors'=>$validator->errors()->all()),400);
    } else {
      // store
      User::create(array(
        'name' => Input::get('name'),
        'email' => Input::get('email'),
        'password' => Hash::make(Input::get('password')),
        'role' => 2
      ));
      return Response::json(array('sucess'=>true));
    }
    // return View::make('user/index')->with('data',array('page'=>'user'));
  }

}