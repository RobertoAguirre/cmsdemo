import { supabase } from "../../lib/supabase.js";

export async function createSignup(payload, redirectTo) {
  const { data: row, error: insertError } = await supabase
    .from("signup_leads")
    .insert({
      nombre_completo: payload.nombre_completo,
      correo_laboral: payload.correo_laboral.trim().toLowerCase(),
      empresa_proyecto: payload.empresa_proyecto,
      tipo_negocio: payload.tipo_negocio
    })
    .select("id,correo_laboral,created_at")
    .single();

  if (insertError) {
    if (insertError.code === "23505") {
      const dup = new Error("Este correo ya está registrado");
      dup.status = 409;
      throw dup;
    }
    throw insertError;
  }

  let inviteSent = false;
  let inviteMessage = null;

  const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(
    row.correo_laboral,
    {
      data: {
        nombre_completo: payload.nombre_completo,
        empresa_proyecto: payload.empresa_proyecto,
        tipo_negocio: payload.tipo_negocio
      },
      redirectTo: redirectTo || undefined
    }
  );

  if (!inviteError && inviteData?.user?.id) {
    inviteSent = true;
    await supabase.from("signup_leads").update({ auth_user_id: inviteData.user.id }).eq("id", row.id);
  } else if (inviteError) {
    inviteMessage = inviteError.message;
    if (/already been registered|already exists|duplicate/i.test(inviteMessage ?? "")) {
      inviteMessage =
        "El correo ya tiene cuenta en Auth. Tu solicitud quedó guardada; puedes iniciar sesión cuando esté lista la app.";
    }
  }

  return { lead: row, inviteSent, inviteMessage };
}
