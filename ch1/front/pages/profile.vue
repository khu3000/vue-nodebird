<template>
    <div>
        <v-container>
            <v-card style="margin-bottom: 20px">
                <v-container>
                    <v-subheader>내 프로필</v-subheader>
                </v-container>
                <v-form v-model="valid" @submit.prevent="onChangeNickname">
                    <v-container>
                        <v-text-field
                            v-model="nickname"
                            label="닉네임"
                            :rules="nicknameRules"
                            required
                        />
                        <v-btn color="blue" type="submit">수정</v-btn>
                    </v-container>
                </v-form>
            </v-card>
            <v-card style="margin-bottom: 20px">
                <v-container>
                    <v-subheader>팔로잉</v-subheader>
                    <follow-list :users="folloing" :userType="follingUser" />
                </v-container>
            </v-card>
            <v-card style="margin-bottom: 20px">
                <v-container>
                    <v-subheader>팔로워</v-subheader>
                    <follow-list :users="follwer" :userType="follwerUser"/>                    
                </v-container>
            </v-card>
        </v-container>
    </div>    
</template>

<script>
    import FollowList from '~/components/FollowList'
    export default {
        components:{
            FollowList,
        },
        data(){
            return {
                valid:false,
                nickname:'',
                nicknameRules :[
                    v => !!v || '닉네임을 입력하세요'
                ],
                follingUser:'type_folling',
                follwerUser:'type_follwer'
            };
        },
        computed:{
            follwer(){
                return this.$store.state.users.follwerList;
            },
            folloing(){
                return this.$store.state.users.follingList;
            },
        },
        methods:{
            onChangeNickname(){
                this.$store.dispatch('users/changeNickname', {
                    nickname:this.nickname
                })
            }
        },
        middleware : 'authenticated',
    }
</script>

<style>

</style>