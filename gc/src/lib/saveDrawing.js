import { supabase } from './supabase';

export async function saveDrawing({ canvasRef, phase, question }) {
  try {
    // 1. Convert canvas to a PNG blob
    const blob = await new Promise((resolve) =>
      canvasRef.current.toBlob(resolve, 'image/png')
    );

    // 2. Generate a unique filename
    const filename = `drawing-${Date.now()}.png`;

    // 3. Upload image to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('drawings')
      .upload(filename, blob, { contentType: 'image/png' });

    if (uploadError) throw uploadError;

    // 4. Get the public URL of the uploaded image
    const { data: urlData } = supabase.storage
      .from('drawings')
      .getPublicUrl(filename);

    const imageUrl = urlData.publicUrl;

    // 5. Save metadata to the drawings table
    const { error: dbError } = await supabase.from('drawings').insert({
      phase,
      question_id: question?.id || null,
      question_text: question?.text || null,
      image_url: imageUrl,
    });

    if (dbError) throw dbError;

    return { success: true, imageUrl };
  } catch (err) {
    console.error('Failed to save drawing:', err);
    return { success: false, error: err.message };
  }
}