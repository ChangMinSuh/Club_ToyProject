export default function ({ $axios, app, store, redirect }) {
  $axios.onRequest((config) => {
    console.log("(axios)Making request to " + config.url);
    config.headers.common["Authorization"] = "123";
  });

  $axios.onResponse((response) => {
    console.log("(axios)Making response success");
    return response;
  });

  $axios.onResponseError(async (err) => {
    const originalRequest = err.config;
    console.log("(axios)Making response error ");
    console.log(err.response.data);

    if (
      err.response.status === 401 &&
      err.response.data?.accessTokenExpired === true
    ) {
      console.log("(axios)accessTokenExpired");

      try {
        const cookies = await store.dispatch("users/refresh");
        console.log("(axios)users/refresh");
        cookies.forEach((cookie) => {
          app.$cookies.set(cookie);
          $axios.setHeader("cookie", cookie);
        });
        console.log("(axios)cookies success");
        //$axios(originalRequest);
      } catch (err) {
        Promise.reject(err);
      }
    }
    return Promise.reject(err);
  });

  $axios.onError((error) => {
    const code = parseInt(error.response && error.response.status);
    console.log("(axois)", error);
    if (code === 400) {
      redirect("/400");
    }
  });
}
