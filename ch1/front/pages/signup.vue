<template>
    <div>
        <v-container>
            <v-card>
                <v-container>
                    <v-subheader>회원가입</v-subheader>
                    <v-form ref="form" v-model="valid" @submit.prevent="onSubmitForm">
                        <v-text-field 
                            v-model="email"
                            label="이메일"
                            type="email"
                            :rules="emailRulse"
                            required
                        />
                        <v-text-field 
                            v-model="password"
                            label="비밀번호"
                            type="password"
                            :rules="passwordRulse"
                            required
                        />
                        <v-text-field 
                            v-model="passwordchk"
                            label="비밀번호확인"
                            type="password"
                            :rules="passwordchkRulse"
                            required
                        />
                        <v-text-field 
                            v-model="nickname"
                            label="닉네임"
                            type="nickname"
                            :rules="nicknameRulse"
                            required
                        />
                        <v-checkbox 
                            v-model="terms"
                            required
                            :rules="[v => !!v || '약관에 동의해야합니다']"
                            label="동의합니다."
                        />
                        <v-btn color="green" type="submit">가입하기</v-btn>
                    </v-form>
                </v-container>
            </v-card>
        </v-container>
    </div>    
</template>

<script>
    export default {
        data(){
            return{
                valid: false,
                email: '',
                password: '',
                passwordchk: '',
                nickname: '',
                terms:false,
                emailRulse:[                    
                    v => !!v || '이메일은 필수입니다.',
                    v => /.+@.+/.test(v) || '이메일이 유효하지 않습니다.',
                ],
                nicknameRulse:[
                    v => !!v || '닉네임은 필수입니다',
                ],
                passwordRulse:[
                    v => !!v || '비밀번호는 필수입니다',
                ],
                passwordchkRulse:[
                    v => !!v || '비밀번호 확인은 필수입니다',
                    v => v === this.password || '비밀번호가 일치하지 않습니다'
                ],
            }
        },
        computed:{
            me(){
                return this.$store.state.users.me;
            }
        },
        watch:{
            me(value, oldvalue){
                if(value){
                    this.$router.push({
                        path: '/',
                    })
                }
            }
        },
        methods:{
            onSubmitForm(){
                if(this.$refs.form.validate()){
                    this.$store.dispatch('users/signUp', {
                        nickname:this.nickname,
                        email:this.email
                    })
                    .then(() =>{
                        this.$router.push({
                            path: '/',
                        })
                    })
                    .catch(() =>{
                        alert('회원가입 실패');
                    })

                }
            }
        },
        middleware : 'anonymous',
    }
</script>

<style>

</style>