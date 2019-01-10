@extends('layouts.default')

@section('content')

    <register csrf-token="{{ csrf_token() }}"></register>

@endsection