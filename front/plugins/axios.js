export default function ({ $cookies, $axios, app, store, redirect }) {
  $axios.onRequest((config) => {
    // console.log("(axios)Making request to " + config.url);
    $axios.setToken(store.state.users.access_token, "Bearer");
  });

  $axios.onResponse((response) => {
    // console.log("(axios)Making response success");
    return response;
  });

  $axios.onResponseError(async (err) => {
    const originalRequest = err.config;
    console.log("(axios)Making response error ");
    //console.log(err.response.config);
    if (
      err.response?.config?.url !== "/auth/refresh" &&
      err.response?.status === 401 &&
      err.response?.data?.error?.accessTokenExpired === true
    ) {
      // console.log("(axios)accessTokenExpired");
      try {
        await store.dispatch("users/refresh");
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${store.state.users.access_token}`;
        console.log("users/refresh after");
        return $axios(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return Promise.reject(err);
  });

  // $axios.onError((error) => {
  //   const code = parseInt(error.response && error.response.status);
  //   // console.log("(axois)", error);
  //   if (code === 400) {
  //     redirect("/400");
  //   }
  // });
}
