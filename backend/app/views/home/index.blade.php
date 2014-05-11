@extends('layout')

@section('content')
    <p>from the db : </p>
    @foreach($data['users'] as $user)
        <p>{{ $user->name }}</p>
    @endforeach
@stop