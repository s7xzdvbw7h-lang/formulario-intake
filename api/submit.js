export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const data = req.body;

    // Format the data for readability
    const fieldLabels = {
      nombre: "Nombre completo",
      edad: "Edad",
      email: "Correo electrónico",
      telefono: "Teléfono / WhatsApp",
      ocupacion: "Ocupación actual",
      como_llegaste: "¿Cómo llegaste a mí?",
      areas_dolor: "Áreas de insatisfacción o dolor",
      bienestar_escala: "Bienestar emocional (escala 1-10)",
      emociones_predominan: "Emociones predominantes",
      regulacion: "Regulación emocional",
      autodescripcion: "Autodescripción",
      creencias_limitantes: "Creencias limitantes",
      dinamicas_repetidas: "Patrones repetitivos",
      habitos: "Hábitos a soltar",
      ambiente_familiar: "Ambiente familiar de crianza",
      eventos_significativos: "Eventos significativos",
      tratamiento: "Tratamiento actual",
      relacion_cuerpo: "Relación con el cuerpo",
      que_te_trajo: "Intención del proceso",
      tiempo_compromiso: "Tiempo y compromiso",
      algo_mas: "Espacio libre",
      submitted_at: "Fecha de envío",
    };

    // Build email-friendly text
    let emailText = `🌟 NUEVO FORMULARIO DE INTAKE\n`;
    emailText += `${"=".repeat(50)}\n\n`;
    emailText += `Fecha: ${new Date(data.submitted_at).toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" })}\n`;
    emailText += `Nombre: ${data.nombre || "No indicado"}\n`;
    emailText += `Email: ${data.email || "No indicado"}\n\n`;
    emailText += `${"─".repeat(50)}\n\n`;

    for (const [key, value] of Object.entries(data)) {
      if (key === "submitted_at") continue;
      const label = fieldLabels[key] || key;
      emailText += `📌 ${label}\n`;
      emailText += `${value || "(sin respuesta)"}\n\n`;
    }

    emailText += `${"─".repeat(50)}\n`;
    emailText += `\nFormulario enviado desde: formulario-intake.vercel.app\n`;

    // Send to Google Sheets via Apps Script webhook (if configured)
    const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;
    if (GOOGLE_SCRIPT_URL) {
      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } catch (e) {
        console.error("Google Sheets error:", e);
      }
    }

    // Send email notification via a simple webhook service
    // For now, we'll use the Web3Forms free service (no signup needed)
    const EMAIL_API_KEY = process.env.EMAIL_API_KEY;
    const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || "daninavarrocoach@gmail.com";

    if (EMAIL_API_KEY) {
      try {
        await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            access_key: EMAIL_API_KEY,
            subject: `✦ Nuevo Intake: ${data.nombre || "Nuevo paciente"}`,
            from_name: "Formulario de Intake",
            to: NOTIFY_EMAIL,
            message: emailText,
          }),
        });
      } catch (e) {
        console.error("Email error:", e);
      }
    }

    // Always log to Vercel logs for backup
    console.log("=== NEW INTAKE SUBMISSION ===");
    console.log(JSON.stringify(data, null, 2));
    console.log("=== END SUBMISSION ===");

    return res.status(200).json({ success: true, message: "Formulario recibido" });
  } catch (error) {
    console.error("Submit error:", error);
    return res.status(500).json({ error: "Error procesando el formulario" });
  }
}
