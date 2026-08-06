'use client';

import type { PutBlobResult } from '@vercel/blob';
import { useState, useRef, useEffect } from 'react';

type Avatar = {
  id: string;
  image: string;
  createdAt: string;
}

export default function AvatarUploadPage() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [avatars, setAvatars] = useState<Avatar[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchAvatars()
  }, [])

  async function fetchAvatars() {
    try {
      const res = await fetch('/api/avatar', {
        headers: {
          Authorization: `api-keys API-Key ${process.env.NEXT_PUBLIC_CMS_API_KEY}`,
        },
      })
      if (res.ok) {
        const data = await res.json()
        setAvatars(data.docs || [])
      }
    } catch (err) {
      console.error('Failed to fetch avatars:', err)
    }
  }

  async function handleUpload(event: React.FormEvent) {
    event.preventDefault();

    if (!inputFileRef.current?.files) {
      throw new Error('No file selected');
    }

    const file = inputFileRef.current.files[0];

    const response = await fetch(
      `/api/avatar/upload?filename=${file.name}`,
      {
        method: 'POST',
        body: file,
      },
    );

    const newBlob = (await response.json()) as PutBlobResult;

    setBlob(newBlob);

    await fetch('/api/avatar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `api-keys API-Key ${process.env.NEXT_PUBLIC_CMS_API_KEY}`,
      },
      body: JSON.stringify({
        data: {
          image: newBlob.url,
        },
      }),
    });

    fetchAvatars()
  }

  return (
    <>
      <h1>Upload Your Avatar</h1>

      <form onSubmit={handleUpload}>
        <input name="file" ref={inputFileRef} type="file" accept="image/jpeg, image/png, image/webp" required />
        <button type="submit">Upload</button>
      </form>

      {blob && (
        <div>
          <p>Uploaded successfully!</p>
          <img src={blob.url} alt="Uploaded avatar" width={200} />
          <a href={`/api/avatar/view?pathname=${blob.pathname}`}>View file</a>
        </div>
      )}

      <h2>Uploaded Avatars</h2>
      {loading ? (
        <p>Loading...</p>
      ) : avatars.length === 0 ? (
        <p>No avatars uploaded yet.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          {avatars.map((avatar) => (
            <div key={avatar.id} style={{ border: '1px solid #ccc', padding: '8px', borderRadius: '8px' }}>
              <img src={avatar.image} alt="Avatar" width={150} />
              <p style={{ fontSize: '12px', color: '#666' }}>{new Date(avatar.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}