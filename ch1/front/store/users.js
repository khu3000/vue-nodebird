export const state = () =>({
    me : null,
    follwerList : [{email:'gg@gg', nickname:'꾸리'},{email:'ggf@gg', nickname:'꾸리아빠'},{email:'ggm@gg',nickname:'꾸리엄마'}],
    follingList : [{email:'gg@gg', nickname:'꼬미'},{email:'ggf@gg', nickname:'꾸리아빠'},{email:'ggm@gg',nickname:'꾸리엄마'}],
});

export const mutations = {
    setMe(state, payload){
        state.me = payload;
    },
    changeNickname(state, payload){
        state.me.nickname = payload.nickname;
    },
    removeFollwer(state, payload){
        const idx = state.follwerList.findIndex((element) => element.email === payload.email);
        state.follwerList.splice(idx, 1);
    },
    removeFolling(state, payload){
        const idx = state.follingList.findIndex((element) => element.email === payload.email);
        state.follingList.splice(idx, 1);
    },
};

export const actions = {
    signUp({commit, state}, payload){
        //서버에 회원가입 요청을 보내는 부분
        commit('setMe', payload);
    },
    logIn({commit, state}, payload){
        commit('setMe', payload);
    },
    logOut({commit, state}, payload){
        commit('setMe', null);
    },
    changeNickname({commit}, payload){
        commit('changeNickname', payload);
    },
    removeFollwer({commit}, payload){
        commit('removeFollwer', payload);
    },
    removeFolling({commit}, payload){
        commit('removeFolling', payload);
    },
}