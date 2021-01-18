<template>
    <v-container v-if="post">
        <post-card :post="post"></post-card>
    </v-container>
    <div v-else>
        해당 아이디의 게시글이 존재하지 않습니다.
    </div>
</template>

<script>
    import PostCard from '~/components/PostCard';
    export default {
        fetch({store, params}){
            return store.dispatch('posts/loadPost', params.id);
        },
        // asyncData(){

        // },
        components:{
            PostCard,
        },
        computed:{
            post() {
                //console.log("this.$store.state.posts.mainPosts", this.$store.state.posts.mainPosts, this.$route.params.id);
                return this.$store.state.posts.mainPosts.find(
                    v => v.id === parseInt(this.$route.params.id, 10)
                );
            }
        }

    }   
</script>

<style scoped>

</style>