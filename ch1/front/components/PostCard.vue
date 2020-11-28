<template>
    <div style="margin-bottom:20px">   
        <v-card>
            <v-img/>
            <v-card-text>
                <div>
                    <h3>{{post.user.nickname}}</h3>
                    <div>{{post.content}}</div>
                </div>
            </v-card-text>
            <v-card-actions>
                <v-btn text color="orange">
                    <v-icon>mdi-twitter-retweet</v-icon>
                </v-btn>
                <v-btn text color="orange">
                    <v-icon>mdi-heart-outline</v-icon>
                </v-btn>
                <v-btn text color="orange" @click="onToggleComment">
                    <v-icon>mdi-comment-outline</v-icon>
                </v-btn>
                <v-menu offset-y open-on-hover>
                    <template v-slot:activator="{on}">
                        <v-btn text color="orange" v-on="on">
                            <v-icon>mdi-dots-horizontal</v-icon>
                        </v-btn>
                    </template>
                    <div style="background: white">
                        <v-btn dark color="red" @click="onRemovePost">삭제</v-btn>
                        <v-btn dark color="orange" @click="onEditPost">수정</v-btn>
                    </div>
                </v-menu>
            </v-card-actions>
        </v-card>
        <template v-if="commentOpend">
            <comment-form :post-id="post.id"/>
            <v-list>
                <v-list-item v-for="c in post.comments" v-bind:key="c">
                    <v-list-item-avatar color="teal">
                        <span>{{c.User.nickname[0]}}</span>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title>{{c.User.nickname}}</v-list-item-title>
                        <v-list-item-sub-title>{{c.content}}</v-list-item-sub-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </template>
    </div>
</template>

<script>
import CommentForm from '~/components/CommentForm';
export default {
  components: { CommentForm },
    props:{
        post:{
            type : Object,
            required : true,
        }
    },
    data(){
        return {
            commentOpend : false,
        }
    },
    methods:{
        onRemovePost(){
            this.$store.dispatch('posts/remove', {
                id:this.post.id,
            });
        },
        onEditPost(){

        },
        onToggleComment(){
            this.commentOpend = !this.commentOpend;
        }

    }
}
</script>

<style>

</style>