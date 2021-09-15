import { useEffect, useState } from "react";
import Nav from "../Nav";
import Call from "../../util/Call";
import FormParser from "../../util/FormParse";
import Modal from "./modal";
import { useHistory } from "react-router";

let colors = [
  "bg-gray-800",
  "bg-red-500",
  "bg-blue-800",
  "bg-green-500",
  "bg-yellow-400",
  "bg-gray-400",
  "bg-gray-100",
];

let getColor = (i) => {
  if (i > colors.length - 1) {
    let p = i % colors.length;
    return colors[p];
  } else {
    return colors[i];
  }
};

export default function Album() {
  const [albums, setAlbums] = useState([]);
  const [start, setStart] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [album, setAlbum] = useState({});
  const [showModal, setShowModal] = useState(false);
  let history = useHistory();

  let list = (start) => {
    Call({ path: "/album/", method: "get", params: { limit: 20, start } })
      .then((d) => {
        setStart(d.start + d.limit);
        setAlbums(d.data);
        setTotal(d.total);
        setLoading(false);
      })
      .catch((err) => setLoading(false));
  };

  useEffect(() => {
    list(0);
  }, []);

  let loadMore = (e) => {
    setLoading(true);
    list(start);
  };

  let addAlbum = (e) => {
    e.preventDefault();
    let values = FormParser(e);

    Call({ path: "/album/", method: "post", body: values })
      .then((d) => {
        setAlbums([...albums, d]);
        setStart(start + 1);
      })
      .catch((err) => alert("try again"));
  };

  let handleEdit = (e) => {
    e.preventDefault();
    let values = FormParser(e);
    Call({ path: "/album/" + album._id, method: "PATCH", body: values })
      .then((d) => {
        list(0);
        setShowModal(false);
      })
      .catch((err) => {
        alert("try again");
      });
  };

  let handleRemove = (id) => {
    if (window.confirm("Are you sure")) {
      Call({ path: "/album/" + id, method: "delete" })
        .then((d) => {})
        .catch((err) => alert("try again"));
    }
  };

  return (
    <div className="bg-white">
      <Nav linkText="" link="#" />
      <Modal
        submit={handleEdit}
        name={album.name}
        show={showModal}
        close={() => {
          setShowModal(false);
        }}
      />
      <div className="max-w-2xl mx-auto px-4  sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Albums</h2>
        <div>
          <form className="m-4 flex" onSubmit={addAlbum}>
            <input
              className="rounded-l-lg p-4 border-t mr-0 border-b border-l text-gray-800 border-gray-200 bg-white"
              name="name"
              placeholder="Album name"
            />
            <button className="px-8 rounded-r-lg bg-blue-400  text-gray-800 font-bold p-4 uppercase border-t border-b border-r">
              Add
            </button>
          </form>
        </div>
        <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {albums.map((album, i) => (
            <div>
              <div
                onClick={() => history.push("/gallery/" + album._id)}
                className={`w-40 h-40 m-4 ${getColor(
                  i
                )} rounded-2xl items-center justify-center text-center text-white py-16 cursor-pointer	`}
              >
                {album.name}
              </div>
              <button
                onClick={(e) => {
                  setAlbum(album);
                  setShowModal(true);
                }}
                className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
              >
                Edit
              </button>

              <button
                onClick={(e) => handleRemove(album._id)}
                className="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
              >
                Remove
              </button>
            </div>
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
