import { useState, useRef, useEffect } from "react";

const SECTIONS = [
  {
    id: "intro",
    type: "intro",
  },
  {
    id: "datos",
    letter: "A",
    title: "Datos Personales",
    subtitle: "Esta información me permite conocerte mejor y personalizar tu proceso.",
    fields: [
      { id: "nombre", label: "Nombre completo", type: "text", required: true },
      { id: "edad", label: "Edad", type: "text", required: true },
      { id: "email", label: "Correo electrónico", type: "email", required: true },
      { id: "telefono", label: "Teléfono / WhatsApp", type: "text", required: true },
      { id: "ocupacion", label: "Ocupación actual", type: "text", required: false },
      { id: "como_llegaste", label: "¿Cómo llegaste a mí?", type: "text", required: false },
    ],
  },
  {
    id: "situacion",
    letter: "1",
    title: "Tu Situación Actual",
    subtitle: "Quiero entender dónde estás parado/a hoy. No lo que debería ser, sino lo que es.",
    fields: [
      {
        id: "areas_dolor",
        label: "¿Qué áreas de tu vida te generan más insatisfacción o dolor en este momento?",
        sublabel: "¿Cómo se manifiesta ese malestar en tu día a día? (en tu cuerpo, tus pensamientos, tu energía, tus relaciones)",
        hint: "Ejemplos: vínculos, autoestima, trabajo, salud, propósito, soledad, agotamiento...",
        type: "textarea",
        required: true,
      },
      {
        id: "bienestar_escala",
        label: "¿Cómo calificarías tu bienestar emocional general hoy?",
        type: "scale",
        lowLabel: "1 = Muy mal, siento que no puedo más",
        highLabel: "10 = En paz conmigo",
        required: true,
      },
    ],
  },
  {
    id: "emocional",
    letter: "2",
    title: "Tu Mundo Emocional",
    subtitle: "Las emociones son mensajeras. Acá no juzgamos ninguna.",
    fields: [
      {
        id: "emociones_predominan",
        label: "¿Qué emociones predominan en tu vida cotidiana?",
        sublabel: "¿Hay emociones que sentís que evitás, reprimís o te cuesta expresar?",
        hint: "Ejemplos: rabia, tristeza, miedo, culpa, vergüenza, ansiedad, vacío, ternura...",
        type: "textarea",
        required: true,
      },
      {
        id: "regulacion",
        label: "¿Cómo reaccionás habitualmente cuando algo te desborda emocionalmente?",
        sublabel: "¿Tenés estrategias que usás para regularte? ¿Funcionan o sentís que son automáticas?",
        hint: "Ejemplos: te cerrás, explotás, te desconectás, comés, dormís, te sobreexigís...",
        type: "textarea",
        required: true,
      },
    ],
  },
  {
    id: "autopercepcion",
    letter: "3",
    title: "Cómo Te Ves",
    subtitle: "La imagen que tenemos de nosotros/as muchas veces fue construida por otros. Exploremos la tuya.",
    fields: [
      {
        id: "autodescripcion",
        label: "¿Cómo te describirías en este momento de tu vida?",
        sublabel: "¿Qué pensamientos aparecen cuando te mirás al espejo o reflexionás sobre quién sos?",
        type: "textarea",
        required: true,
      },
      {
        id: "creencias_limitantes",
        label: "¿Qué creencias sobre vos sentís que te limitan?",
        sublabel: "Pueden ser frases que escuchaste de chico/a, mandatos familiares, o cosas que te repetís internamente.",
        hint: "\"No soy suficiente\", \"tengo que ser fuerte\", \"no merezco que me cuiden\"...",
        type: "textarea",
        required: true,
      },
    ],
  },
  {
    id: "patrones",
    letter: "4",
    title: "Patrones que se Repiten",
    subtitle: "Los patrones inconscientes son el GPS desactualizado del alma. Identificarlos es el primer paso para reprogramarlos.",
    fields: [
      {
        id: "dinamicas_repetidas",
        label: "¿Qué situaciones o dinámicas se repiten en tu vida que te gustaría cambiar?",
        sublabel: "Pueden ser en vínculos, en lo laboral, o en tu relación con vos.",
        type: "textarea",
        required: true,
      },
      {
        id: "habitos",
        label: "¿Hay hábitos o conductas que sabés que no te hacen bien pero te cuesta soltar?",
        hint: "Ejemplos: sobrepensar, postergar, complacer, aislarte, buscar validación externa...",
        type: "textarea",
        required: false,
      },
    ],
  },
  {
    id: "historia",
    letter: "5",
    title: "Tu Historia y Raíces",
    subtitle: "Tu historia no te define, pero comprenderla te libera.",
    fields: [
      {
        id: "ambiente_familiar",
        label: "¿Cómo describirías el ambiente emocional en el que creciste?",
        sublabel: "¿Qué roles ocupabas en tu familia? ¿Qué mandatos o mensajes recibiste sobre cómo debías ser?",
        type: "textarea",
        required: true,
      },
      {
        id: "eventos_significativos",
        label: "¿Hubo eventos significativos en tu vida que sentís que dejaron marca?",
        sublabel: "No necesitás entrar en detalle si no querés. Podés nombrarlos brevemente.",
        hint: "Ejemplos: pérdidas, separaciones, mudanzas, traumas, momentos de quiebre...",
        type: "textarea",
        required: false,
      },
    ],
  },
  {
    id: "salud",
    letter: "6",
    title: "Tu Salud Integral",
    subtitle: "Cuerpo, mente y emociones son un sistema integrado. Necesito una foto completa.",
    fields: [
      {
        id: "tratamiento",
        label: "¿Estás actualmente en tratamiento psicológico o psiquiátrico? ¿Tomás alguna medicación?",
        sublabel: "Si estuviste en terapia antes, ¿qué tipo de abordaje fue y cómo fue tu experiencia?",
        hint: "Esta información es confidencial y me ayuda a adaptar el proceso a tu realidad.",
        type: "textarea",
        required: true,
      },
      {
        id: "relacion_cuerpo",
        label: "¿Cómo es tu relación actual con tu cuerpo? (sueño, alimentación, movimiento, energía)",
        sublabel: "¿Hay algo de tu salud física que te preocupe o que sientas conectado con tu bienestar emocional?",
        type: "textarea",
        required: false,
      },
    ],
  },
  {
    id: "intencion",
    letter: "7",
    title: "Tu Intención y Compromiso",
    subtitle: "Lo que siembres acá es lo que vamos a cosechar juntos/as.",
    fields: [
      {
        id: "que_te_trajo",
        label: "¿Qué te trajo a este proceso? ¿Qué te gustaría sanar, transformar o integrar?",
        hint: "Podés escribir libremente o elegir una palabra que represente tu intención: confianza, libertad, equilibrio, amor propio...",
        type: "textarea",
        required: true,
      },
      {
        id: "tiempo_compromiso",
        label: "¿Cuánto tiempo real y de calidad te dedicás a vos cada semana?",
        sublabel: "¿Qué estarías dispuesto/a a hacer diferente para priorizarte durante este proceso? ¿Hay algo que pueda dificultar tu compromiso?",
        type: "textarea",
        required: true,
      },
    ],
  },
  {
    id: "cierre",
    letter: "✦",
    title: "Espacio Libre",
    subtitle: "Este es tu espacio. Escribí lo que necesites.",
    fields: [
      {
        id: "algo_mas",
        label: "¿Hay algo más que quieras compartir o que sientas importante que yo sepa?",
        type: "textarea",
        required: false,
      },
    ],
  },
];

const ScaleInput = ({ value, onChange, lowLabel, highLabel }) => (
  <div>
    <div style={{ display: "flex", gap: "6px", marginBottom: "8px", flexWrap: "wrap" }}>
      {[1,2,3,4,5,6,7,8,9,10].map((n) => {
        const sel = value === n;
        let bg = "#fff", border = "#e0d5cc";
        if (sel) {
          if (n <= 3) { bg = "#D4445C"; border = "#D4445C"; }
          else if (n <= 6) { bg = "#C8A96E"; border = "#C8A96E"; }
          else { bg = "#5B8C5A"; border = "#5B8C5A"; }
        } else {
          if (n <= 3) bg = "#FFF5F5";
          else if (n <= 6) bg = "#FFFAF0";
          else bg = "#F0FFF4";
        }
        return (
          <button key={n} type="button" onClick={() => onChange(n)}
            style={{ width: 42, height: 42, borderRadius: 10, border: `2px solid ${border}`,
              backgroundColor: bg, color: sel ? "#fff" : "#666", fontWeight: sel ? "700" : "500",
              fontSize: 15, cursor: "pointer", transition: "all 0.2s", fontFamily: "'DM Sans', sans-serif" }}>
            {n}
          </button>
        );
      })}
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#999", fontStyle: "italic" }}>
      <span>{lowLabel}</span><span>{highLabel}</span>
    </div>
  </div>
);

export default function App() {
  const [cur, setCur] = useState(0);
  const [data, setData] = useState({});
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [errs, setErrs] = useState({});
  const [dir, setDir] = useState(1);
  const [anim, setAnim] = useState(0);

  const total = SECTIONS.length;
  const sec = SECTIONS[cur];
  const pct = (cur / (total - 1)) * 100;

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [cur]);

  const set = (id, v) => {
    setData(p => ({ ...p, [id]: v }));
    if (errs[id]) setErrs(p => { const n = { ...p }; delete n[id]; return n; });
  };

  const validate = () => {
    if (sec.type === "intro") return true;
    const e = {};
    sec.fields.forEach(f => {
      if (f.required && (!data[f.id] || String(data[f.id]).trim() === "")) e[f.id] = "Este campo es obligatorio";
    });
    setErrs(e);
    return !Object.keys(e).length;
  };

  const next = () => { if (!validate()) return; if (cur < total - 1) { setDir(1); setAnim(k => k+1); setCur(s => s+1); } };
  const prev = () => { if (cur > 0) { setDir(-1); setAnim(k => k+1); setCur(s => s-1); } };

  const submit = async () => {
    if (!validate()) return;
    setSending(true);
    let body = "FORMULARIO DE INTAKE - RECONECTATE CON VOS\n==========================================\n";
    body += `Fecha: ${new Date().toLocaleDateString("es-AR")}\nNombre: ${data.nombre||"-"}\nEmail: ${data.email||"-"}\nTeléfono: ${data.telefono||"-"}\n\n`;
    SECTIONS.forEach(s => {
      if (s.type === "intro" || !s.fields) return;
      body += `--- ${(s.title||"").toUpperCase()} ---\n\n`;
      s.fields.forEach(f => { const v = data[f.id]; if (v !== undefined && v !== "") body += `${f.label}\n→ ${v}\n\n`; });
    });
    try {
      await fetch("https://formsubmit.co/ajax/daninavarrocoach@gmail.com", {
        method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ _subject: `✦ Nuevo Intake: ${data.nombre||"Paciente"}`, _template: "box", nombre: data.nombre||"", email: data.email||"", telefono: data.telefono||"", mensaje_completo: body }),
      });
    } catch (e) { console.error(e); }
    setDone(true); setSending(false);
  };

  if (done) return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#FFF8F0 0%,#F5EDE4 40%,#EDE0D4 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',sans-serif", padding: 20 }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap" rel="stylesheet"/>
      <div style={{ textAlign: "center", maxWidth: 500, animation: "fadeUp .8s ease forwards" }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>✦</div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", color: "#8B2252", fontSize: 32, marginBottom: 16 }}>Gracias por confiar</h2>
        <p style={{ color: "#777", fontSize: 17, lineHeight: 1.7 }}>
          Tus respuestas fueron enviadas con éxito. Voy a revisarlas con mucho cuidado y cariño.<br/><br/>
          Me voy a comunicar con vos pronto para coordinar nuestro próximo paso juntos/as.<br/><br/>
          <em style={{ color: "#C8A96E" }}>Todo lo que necesitás ya está dentro de vos.</em>
        </p>
        <p style={{ marginTop: 40, color: "#C8A96E", fontSize: 14, letterSpacing: 2, textTransform: "uppercase" }}>Daniela Navarro Coach</p>
        <div style={{ marginTop: 32 }}>
          <a href="https://www.instagram.com/daninavarrocoach" target="_blank" rel="noopener noreferrer"
            style={{ color: "#8B2252", textDecoration: "none", fontSize: 14, padding: "10px 24px", border: "1.5px solid #E8D5C4", borderRadius: 12 }}>
            @daninavarrocoach
          </a>
        </div>
      </div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );

  const inputStyle = { width: "100%", padding: "12px 16px", borderRadius: 12, border: "1.5px solid #E8D5C4", background: "#FDFBF9", fontSize: 14, fontFamily: "'DM Sans',sans-serif", color: "#2D2D2D", outline: "none", transition: "border-color .3s,box-shadow .3s", boxSizing: "border-box" };
  const focus = e => { e.target.style.borderColor = "#C8A96E"; e.target.style.boxShadow = "0 0 0 3px rgba(200,169,110,.12)"; };
  const blur = e => { e.target.style.borderColor = "#E8D5C4"; e.target.style.boxShadow = "none"; };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#FFF8F0 0%,#F5EDE4 40%,#EDE0D4 100%)", fontFamily: "'DM Sans',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap" rel="stylesheet"/>

      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(255,248,240,.85)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderBottom: "1px solid rgba(200,169,110,.15)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "16px 24px 12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#C8A96E", fontWeight: 600 }}>Daniela Navarro Coach</span>
            <span style={{ fontSize: 12, color: "#bbb" }}>{cur === 0 ? "Inicio" : `${cur} de ${total-1}`}</span>
          </div>
          <div style={{ height: 3, background: "#EDE0D4", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#C8A96E,#8B2252)", borderRadius: 4, transition: "width .5s cubic-bezier(.4,0,.2,1)" }}/>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px 140px" }}>
        <div key={anim} style={{ animation: "slideIn .45s ease forwards" }}>

          {sec.type === "intro" ? (
            <div>
              <div style={{ textAlign: "center", marginBottom: 48 }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#8B2252,#C8A96E)", margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, color: "#fff", boxShadow: "0 8px 32px rgba(139,34,82,.2)" }}>✦</div>
                <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,5vw,40px)", color: "#8B2252", marginBottom: 8, fontWeight: 700, lineHeight: 1.2 }}>Reconectate con Vos</h1>
                <p style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(16px,3vw,20px)", color: "#C8A96E", fontStyle: "italic" }}>Exploración Profunda para tu Transformación Interior</p>
              </div>
              <div style={{ background: "#fff", borderRadius: 20, padding: "clamp(24px,4vw,40px)", boxShadow: "0 4px 24px rgba(139,34,82,.06)", border: "1px solid rgba(200,169,110,.15)" }}>
                <p style={{ fontSize: 17, color: "#555", lineHeight: 1.8, marginBottom: 18 }}>
                  <strong style={{ color: "#8B2252" }}>¡Bienvenido/a a este viaje de autodescubrimiento, sanación y transformación!</strong>
                </p>
                <p style={{ fontSize: 15, color: "#666", lineHeight: 1.8, marginBottom: 14 }}>
                  Estoy profundamente agradecida de que estés aquí. Este formulario es el primer paso de un proceso íntimo y poderoso. Es un espacio cuidado donde vas a explorar con honestidad tu mundo interno: lo que te duele, lo que anhelás, y lo que estás dispuesto/a a transformar.
                </p>
                <p style={{ fontSize: 15, color: "#666", lineHeight: 1.8, marginBottom: 14 }}>
                  Tus respuestas me ayudarán a comprender en qué punto estás, qué heridas necesitan atención y qué recursos vamos a activar juntos/as. <strong style={{ color: "#8B2252" }}>No hay respuestas correctas ni incorrectas. Solo tu verdad.</strong>
                </p>
                <div style={{ background: "linear-gradient(135deg,rgba(139,34,82,.04),rgba(200,169,110,.08))", borderRadius: 12, padding: "18px 20px", marginBottom: 14, borderLeft: "3px solid #C8A96E" }}>
                  <p style={{ fontSize: 15, color: "#666", lineHeight: 1.7, margin: 0 }}>
                    📝 Te invito a tomarte tu tiempo, responder con el corazón abierto, y escribir sin filtro. <em>Cuanto más te permitas expresarte, más potente será tu proceso.</em>
                  </p>
                </div>
                <p style={{ fontSize: 15, color: "#666", lineHeight: 1.8, marginBottom: 24 }}>Podés responder en una sola vez o en varias. Lo importante es que lo hagas a tu ritmo.</p>
                <div style={{ borderTop: "1px solid #EDE0D4", paddingTop: 18 }}>
                  <p style={{ fontSize: 15, color: "#999", fontStyle: "italic", marginBottom: 4 }}>Con amor y presencia,</p>
                  <p style={{ margin: 0 }}>
                    <strong style={{ color: "#8B2252", fontFamily: "'Playfair Display',serif", fontSize: 18 }}>Dany</strong>
                    <span style={{ color: "#C8A96E", fontSize: 14, marginLeft: 8, fontStyle: "italic" }}>– Tu terapeuta y guía en este proceso</span>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg,#8B2252,#A83268)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, flexShrink: 0, boxShadow: "0 4px 16px rgba(139,34,82,.2)" }}>{sec.letter}</div>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(22px,4vw,28px)", color: "#8B2252", margin: 0, fontWeight: 600 }}>{sec.title}</h2>
              </div>
              {sec.subtitle && <p style={{ fontSize: 14, color: "#999", fontStyle: "italic", marginBottom: 28, paddingLeft: 64 }}>{sec.subtitle}</p>}

              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                {sec.fields.map(f => (
                  <div key={f.id} style={{ background: "#fff", borderRadius: 16, padding: "clamp(20px,3vw,28px)", boxShadow: errs[f.id] ? "0 0 0 2px #D4445C" : "0 2px 16px rgba(139,34,82,.04)", border: errs[f.id] ? "1px solid #D4445C" : "1px solid rgba(200,169,110,.12)", transition: "all .3s" }}>
                    <label style={{ display: "block", fontSize: 15, fontWeight: 600, color: "#2D2D2D", marginBottom: 6, lineHeight: 1.5 }}>
                      {f.label}{f.required && <span style={{ color: "#D4445C", marginLeft: 4 }}>*</span>}
                    </label>
                    {f.sublabel && <p style={{ fontSize: 13, color: "#888", lineHeight: 1.6, margin: "0 0 8px", fontStyle: "italic" }}>{f.sublabel}</p>}
                    {f.hint && <p style={{ fontSize: 12, color: "#C8A96E", margin: "0 0 12px", fontStyle: "italic", background: "rgba(200,169,110,.08)", padding: "8px 12px", borderRadius: 8 }}>{f.hint}</p>}

                    {f.type === "textarea" ? (
                      <textarea value={data[f.id]||""} onChange={e => set(f.id, e.target.value)} placeholder="Escribí acá tu respuesta..." rows={4}
                        style={{ ...inputStyle, padding: "14px 16px", resize: "vertical" }} onFocus={focus} onBlur={blur}/>
                    ) : f.type === "scale" ? (
                      <ScaleInput value={data[f.id]} onChange={v => set(f.id, v)} lowLabel={f.lowLabel} highLabel={f.highLabel}/>
                    ) : (
                      <input type={f.type} value={data[f.id]||""} onChange={e => set(f.id, e.target.value)}
                        placeholder={f.type === "email" ? "tu@email.com" : ""} style={inputStyle} onFocus={focus} onBlur={blur}/>
                    )}

                    {errs[f.id] && <p style={{ fontSize: 12, color: "#D4445C", margin: "8px 0 0", fontWeight: 500 }}>⚠ {errs[f.id]}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer nav */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(255,248,240,.92)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderTop: "1px solid rgba(200,169,110,.15)", zIndex: 100 }}>
        <div style={{ textAlign: "center", padding: "6px 0 0" }}>
          <span style={{ fontSize: 11, color: "#ccc" }}>🔒 Tu información está protegida por el secreto profesional</span>
        </div>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "10px 24px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {cur > 0 ? (
            <button type="button" onClick={prev} style={{ padding: "12px 24px", borderRadius: 12, border: "1.5px solid #E8D5C4", background: "#fff", color: "#8B2252", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>← Anterior</button>
          ) : <div/>}
          {cur < total - 1 ? (
            <button type="button" onClick={next} style={{ padding: "12px 32px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#8B2252,#A83268)", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", boxShadow: "0 4px 16px rgba(139,34,82,.25)" }}>
              {cur === 0 ? "Comenzar ✦" : "Siguiente →"}
            </button>
          ) : (
            <button type="button" onClick={submit} disabled={sending} style={{ padding: "14px 36px", borderRadius: 12, border: "none", background: sending ? "#ccc" : "linear-gradient(135deg,#C8A96E,#B8944E)", color: "#fff", fontSize: 15, fontWeight: 700, cursor: sending ? "wait" : "pointer", fontFamily: "'DM Sans',sans-serif", boxShadow: sending ? "none" : "0 4px 20px rgba(200,169,110,.35)", letterSpacing: .5 }}>
              {sending ? "Enviando..." : "Enviar mis respuestas ✦"}
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideIn{from{opacity:0;transform:translateY(${dir>0?"24px":"-24px"})}to{opacity:1;transform:translateY(0)}}
        *{margin:0;padding:0;box-sizing:border-box}
        body{margin:0;background:#FFF8F0}
        textarea::-webkit-scrollbar{width:6px}
        textarea::-webkit-scrollbar-track{background:transparent}
        textarea::-webkit-scrollbar-thumb{background:#E8D5C4;border-radius:3px}
        input::placeholder,textarea::placeholder{color:#ccc}
      `}</style>
    </div>
  );
}
