export const state = () =>({
    mainPosts:[],
    hasMorePost : true, //다음 데이터가 있는 경우 true
});

const limit = 10; //건당 가져올 갯수

export const mutations = {
    addMainPost(state, payload){
        state.mainPosts.unshift(payload);
    },
    removeMainPost(state, payload){
        const index = state.mainPosts.findIndex(v=>v.id === payload.id);
        state.mainPosts.splice(index, 1);
    },
    addComment(state, payload){
        const index = state.mainPosts.findIndex(v=>v.id === payload.postId);
        state.mainPosts[index].comments.unshift(payload);
    },
    loadPosts(state){
        const fakePosts = Array(limit).fill().map( v => ({
            id : Math.random().toString(),
            user: {
                id:1,
                nickname: '꿀꿀',
            },
            content: `Hello infinite scrolling~ ${Math.random()}`,
            comments:[],
            images : [],
        }));
        state.mainPosts = state.mainPosts.concat(fakePosts);
        state.hasMorePost = fakePosts.length === limit;
    },
};

export const actions = {
    add({commit}, payload){
        commit('addMainPost', payload);
    }, 
    remove({commit}, payload){
        commit('removeMainPost', payload);
    },
    addComment({commit}, payload){
        commit('addComment', payload);
    },
    loadPosts({commit, state}, payload){
        if(state.hasMorePost){
            commit('loadPosts');
        }
    }
}