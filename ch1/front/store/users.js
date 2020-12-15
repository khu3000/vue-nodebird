export const state = () =>({
    me : null,
    follwerList : [],
    follingList : [],
    hasMoreFollwer : true,
    hasMoreFollwing : true,
});

const totalFollwer = 8;
const totalFollwing = 6;
const limit = 3;

export const mutations = {
    setMe(state, payload){
        state.me = payload;
    },
    changeNickname(state, payload){
        state.me.nickname = payload.nickname;
    },
    addFollowing(state, payload){
        state.follingList.push(payload);
    },
    addFollower(state, payload){
        state.follwerList.push(payload);
    },
    removeFollwer(state, payload){
        const idx = state.follwerList.findIndex((element) => element.id === payload.id);
        state.follwerList.splice(idx, 1);
    },
    removeFolling(state, payload){
        const idx = state.follingList.findIndex((element) => element.id === payload.id);
        state.follingList.splice(idx, 1);
    },
    loadFollowers(state){
        const diff = totalFollwer - state.follwerList.length;
        const fakeUsers = Array(diff > limit ? limit : diff).fill().map(v => ({
            id : Math.random().toString(),
            nickname : Math.floor(Math.random() * 1000)
        }));
        state.follwerList = state.follwerList.concat(fakeUsers);
        state.hasMoreFollwer = fakeUsers.length === limit;
    },
    loadFollowings(state){
        const diff = totalFollwing - state.follingList.length;
        const fakeUsers = Array(diff > limit ? limit : diff).fill().map(v => ({
            id : Math.random().toString(),
            nickname : Math.floor(Math.random() * 1000)
        }));
        state.follingList = state.follingList.concat(fakeUsers);
        state.hasMoreFollwing = fakeUsers.length === limit;
    }
};

export const actions = {
    signUp({commit, state}, payload){
        this.$axios.post('http://localhost:3085/user', {
            nickname:payload.nickname,
            email:payload.email,
            password:payload.password,
        }).then((data) => {
            console.log(data);
            commit('setMe', payload);
        });
    },
    logIn({commit, state}, payload){
        this.$axios.post('http://localhost:3085/user/login', {
            email:payload.email,
            password:payload.password,
        }, {
            withCredentials : true //domain이 달라도 쿠키가 저장 되도록 함
        }).then((data) => {
            console.log(data);
            commit('setMe', payload);
        }).catch((err) => {
            console.error(err);
        })
    },
    logOut({commit, state}, payload){
        commit('setMe', null);
    },
    changeNickname({commit}, payload){
        commit('changeNickname', payload);
    },
    addFollowing({commit}, payload){
        commit('addFollowing', payload);
    },
    addFollower({commit}, payload){
        commit('addFollower', payload);
    },
    removeFollwer({commit}, payload){
        commit('removeFollwer', payload);
    },
    removeFolling({commit}, payload){
        commit('removeFolling', payload);
    },
    loadFollowers({commit,state}, payload){
        if(state.hasMoreFollwer){
            commit('loadFollowers', payload);
        }
    },
    loadFollowings({commit,state}, payload){
        if(state.hasMoreFollwing){
            commit('loadFollowings', payload);
        }
    },
}