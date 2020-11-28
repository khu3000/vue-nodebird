export const state = () =>({
    me : null,
    follwerList : [],
    follingList : [],
});

export const mutations = {
    setMe(state, payload){
        state.me = payload;
    },
    changeNickname(state, payload){
        state.me.nickname = payload.nickname;
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
}