<html>
<head>
    @include('inc.head')
</head>
<body>
<main>
    @include('inc.navbar')
    @yield('content')
    @include('inc.footer')
</main>
</body>
</html>