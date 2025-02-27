import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { faker } from "@faker-js/faker";

const PostContext = createContext();

function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}

function PostProvider({ children }) {
  const [posts, setPosts] = useState(() =>
    Array.from({ length: 30 }, () => createRandomPost())
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Derived state. These are the posts that will actually be displayed
  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : posts;

  const handleAddPost = useCallback(function handleAddPost(post) {
    setPosts((posts) => [post, ...posts]);
  }, []);

  function handleClearPosts() {
    setPosts([]);
  }

  return (
    <PostContext.Provider
      // value={{
      //   searchedPosts,
      //   handleClearPosts,
      //   searchQuery,
      //   setSearchQuery,
      //   handleAddPost,
      //   posts,
      // }}
      value={useMemo(() => {
        return {
          searchedPosts,
          handleClearPosts,
          searchQuery,
          setSearchQuery,
          handleAddPost,
          posts,
        };
      }, [searchedPosts, handleAddPost, searchQuery, posts])}
    >
      {children}
    </PostContext.Provider>
  );
}

function usePostContext() {
  const context = useContext(PostContext);
  if (context === undefined)
    throw new Error("postContext is used outside provider!");
  return context;
}

export { PostProvider, usePostContext };
