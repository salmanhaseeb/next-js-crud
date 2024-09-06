'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import api from '../services/api';
import { Post } from '../types/Post';
import { RootState } from '../redux/store';
import { setPosts, deletePost } from '../redux/postsSlice';

export default function HomePage() {
  const dispatch = useDispatch();
  const posts = useSelector((state: RootState) => state.posts.posts);

  const fetchPosts = async () => {
    if (posts.length === 0) {
      const { data } = await api.get<Post[]>('/posts');
      dispatch(setPosts(data));
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm('Are you sure you want to delete this post?');
    if (confirmDelete) {
      await api.delete(`/posts/${id}`);
      dispatch(deletePost(id));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Posts</h1>
      <Link href="/create">
        <button className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600">
          Create New Post
        </button>
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <div key={post.id} className="border rounded-lg p-4 shadow-lg bg-white">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-gray-600 mt-2">{post.body}</p>
            <div className="flex justify-between mt-4">
              <Link href={`/posts/${post.id}`}>
                <button className="text-blue-500 hover:underline">View</button>
              </Link>
              <button
                onClick={() => handleDelete(post.id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
