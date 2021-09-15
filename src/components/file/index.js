import { useCallback, useEffect, useState } from "react";
import Axios from "axios";
import Nav from "../Nav";
import Call from "../../util/Call";

let endpoint = () => {
  if (process.env.NODE_ENV === "production") {
    return "https://efsc-gallery.herokuapp.com/api/v1";
  }

  return "http://localhost:3600/api/v1";
};

export default function File(props) {
  const [files, setFiles] = useState([]);
  const [start, setStart] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  let list = useCallback(
    (start) => {
      Call({
        path: "/file/" + props.match.params.id,
        method: "get",
        params: { limit: 20, start },
      })
        .then((d) => {
          setStart(d.start + d.limit);
          setFiles(d.data);
          setTotal(d.total);
          setLoading(false);
        })
        .catch((err) => setLoading(false));
    },
    [props.match.params.id]
  );

  useEffect(() => {
    list(0);
  }, [list]);

  let loadMore = (e) => {
    setLoading(true);
    list(start);
  };

  let addAlbum = (e) => {
    e.preventDefault();
    if (!selectedFiles.length) return;
    let formData = new FormData();
    for (var f of selectedFiles) {
      formData.append("file", f);
    }

    Axios.post(`${endpoint()}/file/${props.match.params.id}`, formData, {
      headers: {
        token: window.localStorage.getItem("token") || "",
      },
    })
      .then((d) => {
        list(0);
      })
      .catch((err) => alert(err));
  };

  let handleRemove = (id) => {
    if (window.confirm("Are you sure")) {
      Call({ path: "/file/" + id, method: "delete" })
        .then((d) => {
          list(0);
        })
        .catch((err) => alert("try again"));
    }
  };

  return (
    <div className="bg-white">
      <Nav linkText="" link="#" />
      <div className="max-w-2xl mx-auto px-4 py-6  sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Albums</h2>
        <div>
          <form className="m-4 flex" onSubmit={addAlbum}>
            <input
              className="rounded-l-lg p-4 border-t mr-0 border-b border-l text-gray-800 border-gray-200 bg-white"
              name="name"
              type="file"
              multiple
              onChange={(e) => {
                setSelectedFiles(e.target.files);
              }}
              placeholder="Album name"
            />
            <button className="px-8 rounded-r-lg bg-blue-400  text-gray-800 font-bold p-4 uppercase border-t border-b border-r">
              Upload
            </button>
          </form>
        </div>
        <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {files.map((file, i) => (
            <a key={file.id} href={file.href} className="group">
              <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
                {file.mimetype.startsWith("image/") ? (
                  <img
                    src={file.origin + "/" + file.name}
                    alt={file.name}
                    className="w-full h-full object-center object-cover group-hover:opacity-75"
                  />
                ) : (
                  <video
                    className="video-container video-container-overlay"
                    autoPlay={true}
                    loop=""
                    muted=""
                    controls={true}
                  >
                    <source type={file.type} src={"/" + file.name} />
                  </video>
                )}
              </div>

              <p className="mt-1 text-lg font-medium text-gray-900">
                <button
                  onClick={(e) => handleRemove(file._id)}
                  className="px-8 rounded-r-lg bg-blue-400  text-gray-800 font-bold p-4 uppercase border-t border-b border-r"
                >
                  Remove
                </button>
              </p>
            </a>
          ))}
        </div>
        <div class="flex justify-center">
          {loading ? (
            <div className="inline-flex rounded-md shadow-sm">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150"
              >
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Load
              </button>
            </div>
          ) : total > start * 20 ? (
            <div className="inline-flex rounded-md shadow-sm">
              <button
                type="button"
                onClick={loadMore}
                className="inline-flex items-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150"
              >
                Load
              </button>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}
