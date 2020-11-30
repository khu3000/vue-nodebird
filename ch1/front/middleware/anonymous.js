export default function({store, redirect}){
    if(store.state.users.me){ //로그인 되어 있는 경우
        redirect('/');
    }
}