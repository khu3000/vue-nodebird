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
        //const diff = totalPosts - state.mainPosts.length; //아직 안 불러온 게시글 수
    
        state.mainPosts = state.mainPosts.concat(fakePosts);
        state.hasMorePost = fakePosts.length === limit;
    },
    concatImagePaths(state, payload) {
        state.imagePaths = state.imagePaths.concat(payload);
    },
    removeImagePath(state, payload){
        state.imagePaths.splice(payload, 1);
    }
};

export const actions = {
    add({commit, state}, payload){
        this.$axios.post('http://localhost:3085/post', {
            content:payload.content,
            imagePaths:state.imagePaths
        }, {
            withCredentials:true,
        })
        .then((res)=>{
            commit('addMainPost', res.data);

        })
        .catch(()=>{

        });

    }, 
    remove({commit}, payload){
        this.$axios.delete(`http://localhost:3085/post/${payload.postId}`, {
            withCredentials:true
        })
        .then(()=>{
            commit('removeMainPost', payload);
        })
        .catch((err) => {

        });
    },
    addComment({commit}, payload){
        this.$axios.post(`http://localhost:3085/post/${payload.postId}/comment`, {
            content:payload.content,
        }, {
            withCredentials : true,
        })
        .then((res) =>{
            commit('addComment', res.data);
        })
        .catch((err) => {

        });
    },
    loadComments({commit, payload}){
        this.$axios.get(`http://localhost:3085/post/${payload.postId}/comments`)
        .then((res) => {
            commit('loadComments', res.data)
        })
        .catch((err) => {

        })
    },
    loadPosts({commit, state}, payload){
        if(state.hasMorePost){
            this.$axios.get(`http://localhost:3085/posts?offset=${state.mainPosts.length}&limit=10`)
            .then((res)=>{
                commit('loadPosts', res.data);
            })
            .catch(() => {

            });
        }
    },
    uploadImages({commit}, payload){
        this.$axios.post('http://localhost:3085/post/images', payload, {
            withCredentials:true,
    })
        .then((res) => {
            commit('concatImagePaths', res.data);
        })
        .catch(() => {

        })
    }
}