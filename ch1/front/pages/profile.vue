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
                        <v-btn dark color="blue" type="submit">수정</v-btn>
                    </v-container>
                </v-form>
            </v-card>
            <v-card style="margin-bottom: 20px">
                <v-container>
                    <v-subheader>팔로잉</v-subheader>
                    <follow-list :users="folloing" :remove="removeFollowing" />
                    <v-btn @click="loadMoreFollowings" v-if="hasMoreFollwing" dark color="blue" style="width:100%">더보기</v-btn>
                </v-container>
            </v-card>
            <v-card style="margin-bottom: 20px">
                <v-container>
                    <v-subheader>팔로워</v-subheader>
                    <follow-list :users="follwer" :remove="removeFollower"/>    
                    <v-btn @click="loadMoreFollowers" v-if="hasMoreFollwer" dark color="blue" style="width:100%">더보기</v-btn>                
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
                return this.$store.state.users.follwingList;
            },
            hasMoreFollwer(){
                return this.$store.state.users.hasMoreFollwer;
            },
            hasMoreFollwing(){
                return this.$store.state.users.hasMoreFollwing;
            }
        },
        fetch({store}){
            store.dispatch('users/loadFollowers', {offset:0});
            return store.dispatch('users/loadFollowings', {offset:0});
        },
        methods:{
            onChangeNickname(){
                this.$store.dispatch('users/changeNickname', {
                    nickname:this.nickname
                })
            },
            loadMoreFollowings(){
                this.$store.dispatch('users/loadFollowings');
            },
            loadMoreFollowers(){
                this.$store.dispatch('users/loadFollowers');
            },
            removeFollowing(evt){
                this.$store.dispatch('users/unfollow', {userId:evt.id})
            },
            removeFollower(evt){
                this.$store.dispatch('users/removeFollower', {userId:evt.id})
            },
        },
        middleware : 'authenticated',
    }
</script>

<style>

</style>