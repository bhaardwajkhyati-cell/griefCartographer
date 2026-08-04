import { supabase } from './supabase';
import { getSessionId } from './session';

export async function saveDrawing({ canvasRef, phase, question }) {
  try {
    const blob = await new Promise((resolve) =>
      canvasRef.current.toBlob(resolve, 'image/png')
    );

    const filename = `drawing-${Date.now()}-${crypto.randomUUID()}.png`;

    const { error: uploadError } = await supabase.storage
      .from('drawings')
      .upload(filename, blob, { contentType: 'image/png' });

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from('drawings')
      .getPublicUrl(filename);

    const imageUrl = urlData.publicUrl;

    const { error: dbError } = await supabase.from('drawings').insert({
      phase,
      question_id: question?.id || null,
      question_text: question?.text || null,
      image_url: imageUrl,
      session_id: getSessionId(),
    });

    if (dbError) throw dbError;

    return { success: true, imageUrl };
  } catch (err) {
    console.error('Failed to save drawing:', err);
    return { success: false, error: err.message };
  }
}

export async function fetchOtherDrawings({ phase, limit = 50 } = {}) {
  try {
    let query = supabase
      .from('drawings')
      .select('*')
      .neq('session_id', getSessionId())
      .order('created_at', { ascending: false })
      .limit(limit);

    if (phase) query = query.eq('phase', phase);

    const { data, error } = await query;
    if (error) throw error;

    return { success: true, drawings: data };
  } catch (err) {
    console.error('Failed to fetch drawings:', err);
    return { success: false, error: err.message };
  }
}