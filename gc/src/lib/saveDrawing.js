import { supabase } from './supabase';
import { getSessionId } from './session';


// --------------------------------------------------
// Make sure the user has a Supabase anonymous account
// --------------------------------------------------
async function getAuthenticatedUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Already signed in
  if (user) {
    return user;
  }

  // No user yet → create anonymous account
  const { data, error } = await supabase.auth.signInAnonymously();

  if (error) {
    throw error;
  }

  if (!data.user) {
    throw new Error('Could not create anonymous user');
  }

  return data.user;
}


// --------------------------------------------------
// SAVE DRAWING
// Drawing is private initially
// --------------------------------------------------
export async function saveDrawing({
  canvasRef,
  phase,
  question,
}) {
  try {
    const canvas = canvasRef.current;

    if (!canvas) {
      throw new Error('Canvas is not available');
    }

    // -----------------------------------------------
    // 1. Get authenticated Supabase user
    // -----------------------------------------------
    const user = await getAuthenticatedUser();

    // -----------------------------------------------
    // 2. Get your application session ID
    // -----------------------------------------------
    const sessionId = await getSessionId();

    if (!sessionId) {
      throw new Error('Could not create a session');
    }

    // -----------------------------------------------
    // 3. Convert canvas → PNG
    // -----------------------------------------------
    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob((result) => {
        if (!result) {
          reject(
            new Error('Failed to convert canvas to image')
          );
          return;
        }

        resolve(result);
      }, 'image/png');
    });

    // -----------------------------------------------
    // 4. Create unique filename
    // -----------------------------------------------
    const filename = `${crypto.randomUUID()}.png`;

    // -----------------------------------------------
    // 5. Upload image
    // -----------------------------------------------
    const { error: uploadError } = await supabase.storage
      .from('drawings')
      .upload(filename, blob, {
        contentType: 'image/png',
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    // -----------------------------------------------
    // 6. Get image URL
    // -----------------------------------------------
    const { data: urlData } = supabase.storage
      .from('drawings')
      .getPublicUrl(filename);

    const imageUrl = urlData.publicUrl;

    const { error: dbError } = await supabase
      .from('drawings')
      .insert({
        phase,
        question_id: question?.id || null,
        question_text: question?.text || null,
        image_url: imageUrl,
        session_id: sessionId,
        user_id: user.id,
        released: true,
      });

    if (dbError) {
      throw dbError;
    }

    return {
      success: true,
      imageUrl,
    };

  } catch (err) {
    console.error('Failed to save drawing:', err);

    return {
      success: false,
      error: err.message,
    };
  }
}

// --------------------------------------------------
// FETCH RELEASED DRAWINGS FROM OTHER USERS
// --------------------------------------------------
export async function fetchReleasedDrawings({
  phase,
  limit = 50,
} = {}) {
  try {
    const sessionId = await getSessionId();

    console.log("CURRENT SESSION:", sessionId);

    let query = supabase
      .from("drawings")
      .select("*")
      .eq("released", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (phase) {
      query = query.eq("phase", phase);
    }

    const { data, error } = await query;

    console.log("GALLERY DATA:", data);
    console.log("GALLERY ERROR:", error);

    if (error) {
      throw error;
    }

    // Remove your own drawings AFTER we know the database returned them
    const otherDrawings = data.filter(
      (drawing) => drawing.session_id !== sessionId
    );

    console.log("OTHER DRAWINGS:", otherDrawings);

    return {
      success: true,
      drawings: otherDrawings,
    };

  } catch (err) {
    console.error("Failed to fetch drawings:", err);

    return {
      success: false,
      drawings: [],
      error: err.message,
    };
  }
}

