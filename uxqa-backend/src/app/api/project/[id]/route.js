import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://wnnlrccdrqkywbsbiviu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // Truncated for brevity
);

export async function GET(_, { params }) {
  const projectId = params.id;
  const { data, error } = await supabase
    .storage
    .from('uxqa-frames')
    .list('', { limit: 100 });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const filtered = data.filter(file => file.name.startsWith(`${projectId}-`));
  const urls = filtered.map(file =>
    `https://wnnlrccdrqkywbsbiviu.supabase.co/storage/v1/object/public/uxqa-frames/${file.name}`
  );

  return new Response(JSON.stringify({
    projectId,
    frames: urls
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}