'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import api from '../../../../services/api';
import { Post } from '../../../../types/Post';
import { updatePost } from '../../../../redux/postsSlice';

export default function EditPost({ params }: { params: { id: string } }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPost = async () => {
      const { data } = await api.get<Post>(`/posts/${params.id}`);
      setTitle(data.title);
      setBody(data.body);
    };

    fetchPost();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.put<Post>(`/posts/${params.id}`, { title, body, userId: 1 });

      dispatch(updatePost(data));

      router.push('/');
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Edit Post</h1>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="border p-2 w-full rounded"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          className="border p-2 w-full rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Update Post
        </button>
      </form>
    </div>
  );
}
