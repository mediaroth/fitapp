@extends('layout')

@section('content')
<div class="row">
  <div class="main-row col-md-6">
    <h1>Create Exercise</h1>
    <?php if(!$errors->isEmpty()) : ?>
    <div class="alert alert-danger">
      {{ HTML::ul($errors->all()) }}
    </div>
    <?php endif; ?>
    <?php if(Session::has('message')) : ?>
    <div class="alert alert-success">
        <p><?php echo Session::get('message'); ?></p>
    </div>
    <?php endif; ?>
    <?php if(array_key_exists('exercise', $data)) : ?>
      {{ Form::model($data['exercise'], array('route' => array('exercise.update', $data['exercise']->id), 'method' => 'PUT')) }}
    <?php else: ?> 
      {{ Form::open(array('url' => 'exercise')) }}
    <?php endif; ?>
      <div class="form-group">
        <label for="name">Exercise Name</label>
        <input name="name" type="text" class="form-control" value="<?php echo Input::old("name") != null ? Input::old("name") : (array_key_exists('exercise', $data) ? $data['exercise']->name : null) ?>" id="name" placeholder="Enter Name">
      </div>
      <div class="form-group">
        <label for="description">Description</label>
        <textarea name="description"  rows="3" class="form-control" value="" id="description" placeholder="Enter Description"><?php echo Input::old("description") != null ? Input::old("description") : (array_key_exists('exercise', $data) ? $data['exercise']->description : null)?></textarea>
      </div>
      <button type="submit" class="btn btn-primary">Save</button>
      <a href="/exercise" class="btn btn-default">Reset</a>
  {{ Form::close() }}
      <?php if(array_key_exists('exercise', $data)) : ?>
      {{ Form::open(array('url' => 'exercise/' . $data['exercise']->id,'class' => '')) }}
              {{ Form::hidden('_method', 'DELETE') }}
              {{ Form::submit('Delete', array('class' => 'btn btn-danger btn-del')) }}
      {{ Form::close() }}
      <?php endif; ?> 
  </div>
  <div class="main-row col-md-6">
    <h1>List of Exercise</h1>
    <ul class="list-group">
      @foreach($data['exercises'] as $exercise)
        <li class="list-group-item"><a href="/exercise/{{ $exercise->id }}/edit">{{ $exercise->name }}</a></li>
      @endforeach
    </ul>
  </div>
</div>
@stop