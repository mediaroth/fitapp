<?php

class DatabaseSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		Eloquent::unguard();
		$this->call('UserTableSeeder');
		$this->call('ExerciseTableSeeder');
		$this->call('WorkoutTableSeeder');
	}

}
class UserTableSeeder extends Seeder {
	public function run() {
		DB::table('users')->delete();
		User::create(array('name'=>'Steven','password'=>'todo','email'=>'steven@fit.dev'));
		User::create(array('name'=>'Alesandro','password'=>'todo','email'=>'alessandro@fit.dev'));
	}
}
class ExerciseTableSeeder extends Seeder {
	public function run() {
		DB::table('exercises')->delete();
		Exercise::create(array('name'=>'Bench Press','description'=>'todo'));
		Exercise::create(array('name'=>'Squats','description'=>'todo'));
	}
}
class WorkoutTableSeeder extends Seeder {
	public function run() {
		DB::table('workouts')->delete();
		Workout::create(array('name'=>'Workout Steven','description'=>'todo'));
		Workout::create(array('name'=>'Workout Alessandro','description'=>'todo2'));
	}
}