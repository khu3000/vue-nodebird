export default function({store, redirect}){
    if(!store.state.users.me){ //로그인 안 된 경우
        redirect('/');
    }
}