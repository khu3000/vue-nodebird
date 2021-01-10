//import throttle from 'lodash.throttle';
export const state = () =>({
    mainPosts:[],
    hasMorePost : true, //다음 데이터가 있는 경우 true
    imagePaths: [],
});

const totalPosts = 51; //서버 max post 갯수 임시
const limit = 10; //건당 가져올 갯수

export const mutations = {
    addMainPost(state, payload){
        state.mainPosts.unshift(payload);
        state.imagePaths = [];
    },
    removeMainPost(state, payload){
        const index = state.mainPosts.findIndex(v=>v.id === payload.id);
        state.mainPosts.splice(index, 1);
    },
    addComment(state, payload){
        const index = state.mainPosts.findIndex(v=>v.id === payload.postId);
        state.mainPosts[index].comments.unshift(payload);
    },
    loadComments(state, payload){
        const index = state.mainPosts.findIndex(v=>v.id === payload.postId);
        state.mainPosts[index].comments = payload;
    },
    loadPosts(state, payload){
        console.log('mutations loadPosts' + payload);
        state.mainPosts = state.mainPosts.concat(payload);
        state.hasMorePost = payload.length === limit;
    },
    concatImagePaths(state, payload) {
        state.imagePaths = state.imagePaths.concat(payload);
    },
    removeImagePath(state, payload){
        state.imagePaths.splice(payload, 1);
    },
    unlikePost(state,payload){
        const index = state.mainPosts.findIndex(v=> v.id === payload.postId);
        const userIndex = state.mainPosts[index].Likers.findIndex(v=> v.id === payload.userId);
        state.mainPosts[index].Likers.splice(userIndex, 1);
    },
    likePost(state,payload){
        const index = state.mainPosts.findIndex(v=> v.id === payload.postId);
        state.mainPosts[index].Likers.push({
            id:payload.userId,
        })
    },
};

export const actions = {
    add({commit, state}, payload){
        this.$axios.post('/post', {
            content:payload.content,
            image:state.imagePaths
        }, {
            withCredentials:true,
        })
        .then((res)=>{
            commit('addMainPost', res.data);

        })
        .catch(()=>{
            console.error(err);
        });

    }, 
    remove({commit}, payload){
        this.$axios.delete(`/post/${payload.postId}`, {
            withCredentials:true
        })
        .then(()=>{
            commit('removeMainPost', payload);
        })
        .catch((err) => {
            console.error(err);
        });
    },
    addComment({commit}, payload){
        this.$axios.post(`/post/${payload.postId}/comment`, {
            content:payload.content,
        }, {
            withCredentials : true,
        })
        .then((res) =>{
            commit('addComment', res.data);
        })
        .catch((err) => {
            console.error(err);
        });
    },
    loadComments({commit, payload}){
        this.$axios.get(`/post/${payload.postId}/comments`)
        .then((res) => {
            commit('loadComments', res.data)
        })
        .catch((err) => {
            console.error(err);
        })
    },
    async loadPosts({commit, state}, payload){
        if(state.hasMorePost){
            await this.$axios.get(`/posts?offset=${state.mainPosts.length}&limit=10`)
            .then((res)=>{
                commit('loadPosts', res.data);
            })
            .catch((err) => {
                console.log("loadPosts action catch");
                console.error(err);
            });
        }
    },

    uploadImages({commit}, payload){
        this.$axios.post('/post/images', payload, {
            withCredentials:true,
        })
        .then((res) => {
            commit('concatImagePaths', res.data);
        })
        .catch((err) => {
            console.error(err);
        })
    },

    retweet({commit}, payload){
        this.$axios.post(`/post/${payload.postId}/retweet`, {}, {
            withCredentials:true,
        })
        .then((res) => {
            commit('addMainPost', res.data);
        })
        .catch((err) => {
            console.error(err);
            alert(err.response.data);
        })
    },
    likePost({commit}, payload){
        this.$axios.post(`/post/${payload.postId}/like`, {}, {
            withCredentials:true,
        })
        .then((res) => {
            commit('likePost', {
                userId : res.data.userId,
                postId : payload.postId,
            });
        })
        .catch((err) => {
            console.error(err);
        })
    },
    unlikePost({commit}, payload){
        this.$axios.delete(`/post/${payload.postId}/like`, {
            withCredentials:true,
        })
        .then((res) => {
            commit('unlikePost', {
                userId : res.data.userId,
                postId : payload.postId,
            });
        })
        .catch((err) => {
            console.error(err);
        })
    },
}