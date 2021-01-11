export const state = () =>({
    me : null,
    follwerList : [],
    follwingList : [],
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
        state.follwingList.push(payload);
    },
    addFollower(state, payload){
        state.follwerList.push(payload);
    },
    removeFollower(state, payload){
        let idx = state.me.Followers.findIndex((element) => element.id === payload.userId);
        state.me.Followers.splice(idx, 1);
        idx = state.follwerList.findIndex(v=> v.id === payload.userId);
        state.follwerList.splice(idx, 1);
    },
    removeFollowing(state, payload){
        let idx = state.me.Followings.findIndex((element) => element.id === payload.userId);
        state.me.Followings.splice(idx, 1);
        idx = state.follwingList.findIndex(v=> v.id === payload.userId);
        state.follwingList.splice(idx, 1);
    },
    loadFollowers(state, payload){
        if(payload.offset === 0 ){
            state.follwerList = payload.data;
        } else {
            state.follwerList = state.follwerList.concat(payload.data);
        }
        state.hasMoreFollwer = payload.data.length === limit;
    },
    loadFollowings(state, payload){
        if(payload.offset === 0 ){
            state.follwingList = payload.data;
        } else {
            state.follwingList = state.follwingList.concat(payload.data);
        }
        
        state.hasMoreFollwing = payload.data.length === limit;
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
        this.$axios.patch(`/user/nickname`, {nickname:payload.nickname}, {
            withCredentials:true,
        })
        .then((res) => {
            commit('changeNickname', payload);
        })
        .catch((err) => {
            console.error(err);
        })
    },
    addFollowing({commit}, payload){
        commit('addFollowing', payload);
    },
    addFollower({commit}, payload){
        commit('addFollower', payload);
    },
    removeFollower({commit}, payload){
        return this.$axios.delete(`/user/${payload.userId}/follower`, {
            withCredentials:true,
        })
        .then((res) => {
            commit('removeFollower', payload);
        })
        .catch((err) => {
            console.error(err);
        })
    },

    loadFollowers({commit,state}, payload){
        if(!(payload && payload.offset ===0) && !state.hasMoreFollwer) {
            return;
        }

        let offset = state.follwerList.length;
        if(payload && payload.offset === 0 ) {
            offset = 0;
        }

        return this.$axios.get(`/user/${state.me.id}/followers?limit=3&offset=${offset}`, {
            withCredentials:true
        })
        .then((res) => {
            commit('loadFollowers', {
                data:res.data,
                offset
            });
        })
        .catch((e) => {
            console.error(e);
        })
    },
    loadFollowings({commit,state}, payload){
        if(!(payload && payload.offset ===0) && !state.hasMoreFollwing) {
            return;
        }

        let offset = state.follwingList.length;
        if(payload && payload.offset === 0 ) {
            offset = 0;
        }
        
        return this.$axios.get(`/user/${state.me.id}/followings?limit=3&offset=${offset}`, {
            withCredentials:true
        })
        .then((res) => {
            commit('loadFollowings', {
                data:res.data,
                offset
            });
        })
        .catch((e) => {
            console.error(e);
        })
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