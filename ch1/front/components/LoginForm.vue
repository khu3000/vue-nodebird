<template>
    <div>
    <v-container v-if="!me">
        <v-card>
            <v-form ref="form" v-model="valid" @submit.prevent="onSubmitForm">
                <v-container>
                    <v-text-field 
                        label="이메일"
                        type="email"
                        :rules="emailRulse"
                        required
                        v-model="email"
                    />
                    <v-text-field 
                        label="비밀번호"
                        type="password"
                        :rules="passwordRulse"
                        required
                        v-model="password"
                    />
                    <v-btn color="green" type="submit" :disabled="!valid">로그인</v-btn>
                    <v-btn nuxt to="/signup">회원가입</v-btn>
                </v-container>
            </v-form>
        </v-card>
    </v-container>
    <v-container v-else>
        <v-card>
            <v-container>
                {{me.nickname}} 로그인 되었습니다.
            </v-container>
        </v-card>
        <v-btn @click="onLogout">로그아웃</v-btn>
        <v-row>
            <v-col cols="4">{{me.Followings.length}}팔로잉</v-col>
            <v-col cols="4">{{me.Followers.length}}팔로워</v-col>
            <v-col cols="4">{{me.Posts.length}}게시글</v-col>
        </v-row>
    </v-container>
    </div>
</template>

<script>
export default {
    data(){
        return{
            valid:false,
            email:'',
            password:'',
            emailRulse:[                    
                v => !!v || '이메일은 필수입니다.',
                v => /.+@.+/.test(v) || '이메일이 유효하지 않습니다.',
            ],

            passwordRulse:[
                v => !!v || '비밀번호는 필수입니다',
            ],

        }
    },
    computed : {
        me() {
            return this.$store.state.users.me;
        }
    },
    methods : {
        onSubmitForm(){
            if(this.$refs.form.validate()){
                 this.$store.dispatch('users/logIn', {
                    email: this.email,
                    password: this.password,
                })
            }
        },
        onLogout(){
            this.$store.dispatch('users/logOut');
        }
    }    
}
</script>

<style>

</style>