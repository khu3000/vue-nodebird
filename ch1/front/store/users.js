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
        console.log('setMe '+ payload);
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
    removeFollowing(state, payload){
        const idx = state.me.Followings.findIndex((element) => element.id === payload.userId);
        state.me.Followings.splice(idx, 1);
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
    },
    following(state, payload) {
        state.me.Followings.push({id:payload.userId})
    }, 
};

export const actions = {
    loadUser({commit}){
       this.$axios.get('/user', {
            withCredentials:true
       })
       .then((res) => {
        commit('setMe', res.data);
       })
       .catch(() => {

       })
    },
    signUp({commit, state}, payload){
        this.$axios.post('/user', {
            nickname:payload.nickname,
            email:payload.email,
            password:payload.password,
        }).then((res) => {
            console.log(res);
            commit('setMe', res.data);
        });
    },
    logIn({commit, state}, payload){
        this.$axios.post('/user/login', {
            email:payload.email,
            password:payload.password,
        }, {
            withCredentials : true //domain이 달라도 쿠키가 저장 되도록 함
        }).then((res) => {
            console.log(res);
            commit('setMe', res.data);
        }).catch((err) => {
            console.error(err);
        })
    },
    logOut({commit, state}, payload){
        this.$axios.post('/user/logout', {}, {
            withCredentials : true //domain이 달라도 쿠키가 저장 되도록 함
        }).then((res) => {
            console.log(res);
            commit('setMe', null);
        }).catch((err) => {
            console.error(err);
        })
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
    // removeFolling({commit}, payload){
    //     commit('removeFolling', payload);
    // },
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
    following({commit}, payload){
        this.$axios.post(`/user/${payload.userId}/follow`, {}, {
            withCredentials:true,
        })
        .then((res) => {
            commit('following', {
                userId : payload.userId,
            });
        })
        .catch((err) => {
            console.error(err);
        })
    },
    unfollow({commit}, payload){
        this.$axios.delete(`/user/${payload.userId}/follow`, { //주의 : delete는 파라미터 순서 다름
            withCredentials:true,
        })
        .then((res) => {
            commit('removeFollowing', {
                userId : payload.userId,
            });
        })
        .catch((err) => {
            console.error(err);
        })
    },
}