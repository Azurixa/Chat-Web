<template>
    <div class="register">
        <div id="auth-box">
            <div class="auth-form">
                <h1 class="mb-0">Register</h1>
                <p class="mb-4">new account to use Ch-APP</p>
                <div class="form-group">
                    <input type="text" name="login" class="form-control" id="login" placeholder="Login"
                           required v-model="formData.login">
                </div>
                <div class="form-group">
                    <input type="email" name="email" class="form-control" id="email" placeholder="E-mail"
                           required v-model="formData.email">
                </div>
                <div class="form-group">
                    <input type="password" name="password" class="form-control" id="password"
                           placeholder="Password" required v-model="formData.password">
                </div>
                <div class="form-group">
                    <input type="password" name="password2" class="form-control" id="password2"
                           placeholder="Confirm password" required v-model="formData.passwordConfirm">
                </div>
                <button type="submit" class="btn btn-primary" @click="register" id="register-button">
                    <i class='bx bx-user-plus'></i> Register to Ch-APP
                </button>
                <br>
                <a href="/login" class="small">Login to existing account</a>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'register',
        props: ['csrfToken'],
        data() {
            return {
                formData: {
                    login: '',
                    email: '',
                    password: '',
                    passwordConfirm: '',
                }
            }
        },
        methods: {
            // Validate form
            formValidate() {
                if (
                    this.formData.login === '' ||
                    this.formData.email === '' ||
                    this.formData.password === '' ||
                    this.formData.passwordConfirm === ''
                ) {
                    return false;
                }
                if (this.formData.password !== this.formData.passwordConfirm) {
                    return false;
                }
                return true;
            },
            register() {
                if (this.formValidate()) {

                    // UI response
                    this.buttonChange(1);

                    fetch("http://azurix.pl:8080/auth/register?email=" + this.formData.email + "&login=" + this.formData.login + "&password=" + this.formData.password, {
                        method: "GET",
                        credentials: 'include'
                    })
                        .then(res => res.json())
                        .then(data => {

                            if (data === 'CREATED') {
                                fetch("http://azurix.pl:8080/auth/login?login=" + this.formData.login + "&password=" + this.formData.password, {
                                    method: "GET",
                                    credentials: 'include'
                                }).then(res => res.json()).then(data => {

                                    // All good -> login user

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

                            } else {
                                // TODO: display error messages from API
                                console.log('Bad response (prop. user exist)');
                                this.buttonChange(2);
                                setTimeout( () => {
                                    this.buttonChange(0);
                                }, 2000);
                            }
                        });
                } else {
                    // Form not valid
                    // TODO: display form error messages
                    console.log('All fields required');
                }
            },
            buttonChange (state) {

                /*
                *   0: default
                *   1: registering...
                *   2: user exist!
                * */

                // User UI response
                const registerBtn = document.getElementById('register-button');

                switch(state) {
                    case 0:
                        registerBtn.classList.add('btn-primary');
                        registerBtn.classList.remove('btn-secondary', 'btn-danger');
                        registerBtn.innerHTML = '<i class="bx bx-user-plus"></i> Register to Ch-APP';
                        break;
                    case 1:
                        registerBtn.classList.add('btn-secondary');
                        registerBtn.classList.remove('btn-primary', 'btn-danger');
                        registerBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Registering';
                        break;
                    case 2:
                        registerBtn.classList.add('btn-danger');
                        registerBtn.classList.remove('btn-secondary', 'btn-primary');
                        registerBtn.innerHTML = '<i class="bx bx-user-plus"></i> User exist!';
                        break;
                }

            }
        }
    }
</script>