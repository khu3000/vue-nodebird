<template>
    <v-list>
        <v-list-item v-for="user in users" v-bind:key="user.email">
            <span>{{user.nickname}}</span>
            <v-icon @click="onRemoveFollow(user)">mdi-minus-circle-outline</v-icon>
        </v-list-item>
    </v-list>
</template>

<script>
export default {      
    props:{
        users:{
            type : Array,
            required : true,
        },
        userType :{
            type : String,
            required : true,
        }
    },
    methods:{
        onRemoveFollow(evt){
            const dispatchName = this.userType === 'type_folling' ? 'removeFolling' : 'removeFollwer';

            this.$store.dispatch('users/' + dispatchName, {
                email:evt.email
            })
        }
    }
}
</script>

<style>

</style>