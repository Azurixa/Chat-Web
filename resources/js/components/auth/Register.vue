<template>
    <div class="register">
        <div id="auth-box">
            <div class="auth-form">
                <h1 class="mb-0">Register</h1>
                <p class="mb-4">new account to use Ch-APP</p>
                <form action="/register" method="post">
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
                    <button type="submit" class="btn btn-primary"><i class='bx bx-user-plus'></i> Register to Ch-APP</button><br>
                    <a href="/login" class="small">Login to existing account</a>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['csrfToken'],
        data () {
            return {
                formData: {
                    login: '',
                    email: '',
                    password: '',
                    passwordConfirm: '',
                }
            }
        },
    }
</script>