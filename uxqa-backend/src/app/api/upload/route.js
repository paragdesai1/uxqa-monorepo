import { v4 as uuid } from 'uuid';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wnnlrccdrqkywbsbiviu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Truncated for brevity
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get('frame');
  const projectId = formData.get('project_id') || 'default';

  if (!file || typeof file === 'string') {
    return new Response(JSON.stringify({ error: 'No file uploaded' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);
  const ext = file.name.split('.').pop();
  const filename = `${projectId}-${uuid()}.${ext}`;

  const { error } = await supabase.storage
    .from('uxqa-frames')
    .upload(filename, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const publicUrl = `${supabaseUrl}/storage/v1/object/public/uxqa-frames/${filename}`;
  return new Response(JSON.stringify({ imageUrl: publicUrl, projectId }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}