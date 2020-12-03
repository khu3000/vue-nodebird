<template>
    <v-list>
        <v-col v-for="user in users" v-bind:key="user.id" cols="12" md="4" style="display:inline-block">
            <v-list-item>
                <v-list-item-avatar color="indigo">
                    <span class="white--text headline">{{user.nickname[0]}}</span>
                </v-list-item-avatar>
                <v-list-item-content>
                    <v-list-item-title>{{user.nickname}}</v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                    <v-icon @click="onRemoveFollow(user)">mdi-minus-circle-outline</v-icon>
                </v-list-item-action>
            </v-list-item>
        </v-col>
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
                email:evt.email,
                id:evt.id
            })
        }
    }
}
</script>

<style>

</style>