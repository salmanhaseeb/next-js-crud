'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import api from '../../../services/api';
import { Post } from '../../../types/Post';
import { deletePost } from '../../../redux/postsSlice';

export default function PostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPost = async () => {
      const { data } = await api.get<Post>(`/posts/${params.id}`);
      setPost(data);
    };

    fetchPost();
  }, [params.id]);

  const handleDelete = async () => {
    const confirmDelete = confirm('Are you sure you want to delete this post?');
    if (confirmDelete) {
      await api.delete(`/posts/${params.id}`);
      dispatch(deletePost(Number(params.id)));
      router.push('/');
    }
  };

  if (!post) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{post.title}</h1>
      <p className="mt-4">{post.body}</p>

      <div className="mt-6 flex space-x-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => router.push(`/posts/${post.id}/edit`)}
        >
          Update
        </button>

        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
