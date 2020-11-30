<template>
    <v-list>
        <v-list-item v-for="c in fList" v-bind:key="c.email">
            <span>{{c.nickname}}</span>
            <v-icon @click="onRemoveFollow(c)">mdi-minus-circle-outline</v-icon>
        </v-list-item>
    </v-list>
</template>

<script>
export default {      
    props:{
        fList:{
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