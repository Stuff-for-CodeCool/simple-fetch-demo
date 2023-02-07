import React, { StrictMode, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

const url = "https://jsonplaceholder.typicode.com";

function App() {
    //  List of posts
    const [posts, setPosts] = useState([]);

    //  ID of selected post
    const [currentPostId, setCurrentPostId] = useState(null);
    //  Content of selected post
    const [currentPost, setCurrentPost] = useState(null);

    //  Author of selected post
    const [author, setAuthor] = useState(null);

    const handleClose = (e) => {
        //  To remove the # from the navbar
        e.preventDefault();
        setCurrentPostId(null);
    };

    //  Loads only once
    useEffect(() => {
        const loader = async () => {
            const req = await fetch(url + "/posts");
            const res = await req.json();

            //  Sets list of posts
            setPosts(res);
        };

        loader();
    }, []);

    //  Loads only when a post is selected
    useEffect(() => {
        const postLoader = async () => {
            const req = await fetch(url + "/posts/" + currentPostId);
            const res = await req.json();

            //  Sets selected post
            setCurrentPost(res);
        };

        //  Prevents infinite loop
        if (currentPostId) {
            postLoader();
        }
    }, [currentPostId]);

    //  Loads after selected post is loaded
    useEffect(() => {
        const authorLoader = async () => {
            const req = await fetch(url + "/users/" + currentPost?.userId);
            const res = await req.json();

            //  Sets author
            setAuthor(res);
        };
        authorLoader();
    }, [currentPost]);

    //  Close selected post on pressing Esc
    document.body.addEventListener("keydown", (e) => {
        if (e.code === "Escape") {
            setCurrentPostId(null);
        }
    });

    //  Display if a post has been selected
    if (currentPostId !== null)
        return (
            <article>
                <nav>
                    <ul>
                        <li>
                            <h4>{currentPost?.title}</h4>
                        </li>
                    </ul>
                    <ul>
                        <li>
                            <a role="button" href="#" onClick={handleClose}>
                                &times;
                            </a>
                        </li>
                    </ul>
                </nav>
                <main>
                    {author ? (
                        <h4>{author?.name}</h4>
                    ) : (
                        <small>Loading author</small>
                    )}

                    {currentPost?.body.split("\n").map((paragraf, index) => (
                        <p key={index}>{paragraf}</p>
                    ))}
                </main>
            </article>
        );

    //  Shows all posts or wait message
    return posts?.length
        ? posts.map((p) => (
              <article key={p.id}>
                  <h5 onClick={() => setCurrentPostId(p.id)}>{p.title}</h5>
                  <p>{p.body}</p>
              </article>
          ))
        : "Please wait";
}

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
    </StrictMode>
);
