let endpoint = () => {
  if (process.env.NODE_ENV === "production") {
    return "https://efsc-gallery.herokuapp.com/api/v1";
  }

  return "http://localhost:3600/api/v1";
};

export default function call({ path, method, body, params }) {
  return new Promise((resolve, reject) => {
    var url = new URL(endpoint() + path);
    if (params) {
      Object.keys(params).forEach((key) =>
        url.searchParams.append(key, params[key])
      );
    }

    fetch(url, {
      headers: {
        "content-type": "application/json",
        token: window.localStorage.getItem("token"),
      },
      method,
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401) {
            window.location.href = "/verification";
          } else {
            reject(response);
          }
        } else {
          return response.json();
        }
      })
      .then((d) => resolve(d))
      .catch((err) => reject(err));
  });
}
