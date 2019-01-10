<template>
    <div class="login">
        <div id="auth-box">
            <div class="auth-form">
                <h1 class="mb-0">Login</h1>
                <p class="mb-4">to Ch-APP</p>
                <div class="form-group">
                    <input type="text" name="login" class="form-control" id="login" placeholder="Login" required
                           v-model="formData.login">
                </div>
                <div class="form-group">
                    <input type="password" name="password" class="form-control" id="password"
                           placeholder="Password" required v-model="formData.password">
                </div>
                <button type="submit" class="btn btn-primary" @click="login()" id="login-button">
                    <i class='bx bx-log-in'></i> Login to Ch-APP
                </button>
                <br>
                <a href="/register" class="small">Create account</a>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'login',
        props: ['csrfToken'],
        data() {
            return {
                formData: {
                    login: '',
                    password: '',
                }
            }
        },
        methods: {
            login() {

                // User UI response
                const loginBtn = document.getElementById('login-button');
                loginBtn.classList.add('btn-secondary');
                loginBtn.classList.remove('btn-primary');
                loginBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Logging in';

                fetch("http://azurix.pl:8080/auth/login?login=" + this.formData.login + "&password=" + this.formData.password, {
                    method: "GET",
                    credentials: 'include'
                })
                    .then(res => {
                        if(res.status === 200){
                            res.json()
                        } else {
                            //TODO: error message <- when api get update!
                        }
                    })
                    .then(data => {

                        const formData = new FormData();
                        formData.append('login', this.formData.login);
                        formData.append('password', this.formData.password);
                        formData.append('_token', this.csrfToken);

                        fetch("/login", {
                            method: 'POST',
                            body: formData,
                            headers: {
                                'Accept': 'application/json'
                            }
                        }).then(res => res.json()).then(data => {
                            if (data === 200) {
                                window.location.href = '/chat';
                            } else {
                                // TODO: error messages from controller
                            }
                        });
                    });
            }
        }
    }
</script>