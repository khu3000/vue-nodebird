<template>
    <v-card style="margin-bottom: 20px">
        <v-container>
            <v-form ref="form" v-model="valid" @submit.prevent="onSubmitForm">
                <v-textarea
                outlined
                auto-grow
                clearable
                label="어떤 신기한 일이 있었나요?" 
                v-model="content"
                :hide-details="hideDetails" 
                :success-messages="successMesssages" 
                :rules="[v => !!v || '내용을 입력하세요']"
                @input="onChangeText"
                />            
            <v-btn type="submit" color="green" absolute right>짹짹</v-btn>
            <v-btn>이미지 업로드</v-btn>
            </v-form>
        </v-container>
    </v-card>
</template>

<script>

    import {mapState} from 'vuex';
export default {
    data(){
        return{
            valid: false,
            hideDetails : true,
            successMesssages : '',
            success : false,
            content : '',
        }
    },
    computed : {
        ...mapState('users', ['me'])
    },
    methods: {
        onChangeText(value){
            if(value.length){
                this.hideDetails = true; // true : textarea 하단에 여백 보여짐
                this.success = false;
                this.successMesssages = '';
            }            
        },
        onSubmitForm(){
            if(this.$refs.form.validate()){
                this.$store.dispatch('posts/add',{
                    content:this.content,
                    user : {
                        nickname : this.me.nickname
                    },
                    comments : [],
                    images : [],
                    id : Date.now(),
                    createAt : Date.now(),
                })
                .then(() => {
                    this.content = '';
                    this.hideDetails = false;
                    this.success = true;
                    this.successMesssages = "게시글 등록 성공!"
                })
                .catch(()=>{

                })
            }
        }
    }
}
</script>

<style>

</style>