module.exports = {
    ssr: true,
    head: {
        title: 'NodeBird',
    },
    modules: [
      '@nuxtjs/axios',
    ],
    buildModules: [
      '@nuxtjs/vuetify',
    ],
    vuetify: {},
    axios :{
      browserBaseURL : 'http://localhost:3085', //Client에서 axios 호출 경우
      baseURL : 'http://localhost:3085', //서버에서 axios 호출 경우
      https: false,
    },
    "server" : {
      "port" : "3080"
    }
  };