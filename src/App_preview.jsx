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
        hint: '"No soy suficiente", "tengo que ser fuerte", "no merezco que me cuiden"...',
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

const ScaleInput = ({ value, onChange, lowLabel, highLabel }) => {
  return (
    <div>
      <div style={{ display: "flex", gap: "6px", marginBottom: "8px", flexWrap: "wrap" }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => {
          const isSelected = value === n;
          let bg = "#fff";
          let border = "#e0d5cc";
          if (isSelected) {
            if (n <= 3) { bg = "#D4445C"; border = "#D4445C"; }
            else if (n <= 6) { bg = "#C8A96E"; border = "#C8A96E"; }
            else { bg = "#5B8C5A"; border = "#5B8C5A"; }
          } else {
            if (n <= 3) bg = "#FFF5F5";
            else if (n <= 6) bg = "#FFFAF0";
            else bg = "#F0FFF4";
          }
          return (
            <button
              key={n}
              onClick={() => onChange(n)}
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                border: `2px solid ${border}`,
                backgroundColor: bg,
                color: isSelected ? "#fff" : "#666",
                fontWeight: isSelected ? "700" : "500",
                fontSize: "15px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {n}
            </button>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#999", fontStyle: "italic" }}>
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
};

export default function IntakeForm() {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [direction, setDirection] = useState(1);
  const [animKey, setAnimKey] = useState(0);
  const containerRef = useRef(null);

  const totalSections = SECTIONS.length;
  const section = SECTIONS[currentSection];
  const progress = ((currentSection) / (totalSections - 1)) * 100;

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentSection]);

  const updateField = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const goNext = () => {
    if (currentSection < totalSections - 1) {
      setDirection(1);
      setAnimKey((k) => k + 1);
      setCurrentSection((s) => s + 1);
    }
  };

  const goPrev = () => {
    if (currentSection > 0) {
      setDirection(-1);
      setAnimKey((k) => k + 1);
      setCurrentSection((s) => s - 1);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #FFF8F0 0%, #F5EDE4 40%, #EDE0D4 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif",
        padding: "20px",
      }}>
        <div style={{
          textAlign: "center",
          maxWidth: "500px",
          animation: "fadeUp 0.8s ease forwards",
        }}>
          <div style={{ fontSize: "64px", marginBottom: "24px" }}>✦</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#8B2252", fontSize: "32px", marginBottom: "16px" }}>
            Gracias por confiar
          </h2>
          <p style={{ color: "#777", fontSize: "17px", lineHeight: "1.7" }}>
            Tus respuestas fueron enviadas. Estoy feliz de acompañarte en este camino.
            <br /><br />
            <em style={{ color: "#C8A96E" }}>Todo lo que necesitás ya está dentro de vos.</em>
          </p>
          <p style={{ marginTop: "40px", color: "#C8A96E", fontSize: "14px", letterSpacing: "2px", textTransform: "uppercase" }}>
            Daniela Navarro Coach
          </p>
        </div>
        <style>{`
          @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #FFF8F0 0%, #F5EDE4 40%, #EDE0D4 100%)",
      fontFamily: "'DM Sans', sans-serif",
      position: "relative",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap" rel="stylesheet" />

      {/* Progress bar */}
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(255,248,240,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(200,169,110,0.15)",
      }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "16px 24px 12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", letterSpacing: "3px", textTransform: "uppercase", color: "#C8A96E", fontWeight: "600" }}>
              Daniela Navarro Coach
            </span>
            <span style={{ fontSize: "12px", color: "#bbb" }}>
              {currentSection === 0 ? "Inicio" : `${currentSection} de ${totalSections - 1}`}
            </span>
          </div>
          <div style={{
            height: "3px",
            background: "#EDE0D4",
            borderRadius: "4px",
            overflow: "hidden",
          }}>
            <div style={{
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg, #C8A96E, #8B2252)",
              borderRadius: "4px",
              transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)",
            }} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div ref={containerRef} style={{ maxWidth: "720px", margin: "0 auto", padding: "32px 24px 120px" }}>
        <div
          key={animKey}
          style={{
            animation: `slideIn 0.45s ease forwards`,
          }}
        >
          {section.type === "intro" ? (
            <div>
              <div style={{ textAlign: "center", marginBottom: "48px" }}>
                <div style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #8B2252, #C8A96E)",
                  margin: "0 auto 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "32px",
                  color: "#fff",
                  boxShadow: "0 8px 32px rgba(139,34,82,0.2)",
                }}>
                  ✦
                </div>
                <h1 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(28px, 5vw, 40px)",
                  color: "#8B2252",
                  marginBottom: "8px",
                  fontWeight: "700",
                  lineHeight: "1.2",
                }}>
                  Reconectate con Vos
                </h1>
                <p style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(16px, 3vw, 20px)",
                  color: "#C8A96E",
                  fontStyle: "italic",
                  fontWeight: "400",
                }}>
                  Exploración Profunda para tu Transformación Interior
                </p>
              </div>

              <div style={{
                background: "#fff",
                borderRadius: "20px",
                padding: "clamp(24px, 4vw, 40px)",
                boxShadow: "0 4px 24px rgba(139,34,82,0.06)",
                border: "1px solid rgba(200,169,110,0.15)",
              }}>
                <p style={{ fontSize: "17px", color: "#555", lineHeight: "1.8", marginBottom: "18px" }}>
                  <strong style={{ color: "#8B2252" }}>¡Bienvenido/a a este viaje de autodescubrimiento, sanación y transformación!</strong>
                </p>
                <p style={{ fontSize: "15px", color: "#666", lineHeight: "1.8", marginBottom: "14px" }}>
                  Estoy profundamente agradecida de que estés aquí. Este formulario es el primer paso de un proceso íntimo y poderoso. Es un espacio cuidado donde vas a explorar con honestidad tu mundo interno: lo que te duele, lo que anhelás, y lo que estás dispuesto/a a transformar.
                </p>
                <p style={{ fontSize: "15px", color: "#666", lineHeight: "1.8", marginBottom: "14px" }}>
                  Tus respuestas me ayudarán a comprender en qué punto estás, qué heridas necesitan atención y qué recursos vamos a activar juntos/as. <strong style={{ color: "#8B2252" }}>No hay respuestas correctas ni incorrectas. Solo tu verdad.</strong>
                </p>
                <div style={{
                  background: "linear-gradient(135deg, rgba(139,34,82,0.04), rgba(200,169,110,0.08))",
                  borderRadius: "12px",
                  padding: "18px 20px",
                  marginBottom: "14px",
                  borderLeft: "3px solid #C8A96E",
                }}>
                  <p style={{ fontSize: "15px", color: "#666", lineHeight: "1.7", margin: 0 }}>
                    📝 Te invito a tomarte tu tiempo, responder con el corazón abierto, y escribir sin filtro. <em>Cuanto más te permitas expresarte, más potente será tu proceso.</em>
                  </p>
                </div>
                <p style={{ fontSize: "15px", color: "#666", lineHeight: "1.8", marginBottom: "24px" }}>
                  Podés responder en una sola vez o en varias. Lo importante es que lo hagas a tu ritmo.
                </p>
                <div style={{ borderTop: "1px solid #EDE0D4", paddingTop: "18px" }}>
                  <p style={{ fontSize: "15px", color: "#999", fontStyle: "italic", marginBottom: "4px" }}>Con amor y presencia,</p>
                  <p style={{ margin: 0 }}>
                    <strong style={{ color: "#8B2252", fontFamily: "'Playfair Display', serif", fontSize: "18px" }}>Dany</strong>
                    <span style={{ color: "#C8A96E", fontSize: "14px", marginLeft: "8px", fontStyle: "italic" }}>– Tu terapeuta y guía en este proceso</span>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {/* Section header */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "8px" }}>
                <div style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  background: "linear-gradient(135deg, #8B2252, #A83268)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "22px",
                  fontWeight: "700",
                  flexShrink: 0,
                  boxShadow: "0 4px 16px rgba(139,34,82,0.2)",
                }}>
                  {section.letter}
                </div>
                <h2 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(22px, 4vw, 28px)",
                  color: "#8B2252",
                  margin: 0,
                  fontWeight: "600",
                }}>
                  {section.title}
                </h2>
              </div>
              {section.subtitle && (
                <p style={{
                  fontSize: "14px",
                  color: "#999",
                  fontStyle: "italic",
                  marginBottom: "28px",
                  paddingLeft: "64px",
                }}>
                  {section.subtitle}
                </p>
              )}

              {/* Fields */}
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {section.fields.map((field) => (
                  <div
                    key={field.id}
                    style={{
                      background: "#fff",
                      borderRadius: "16px",
                      padding: "clamp(20px, 3vw, 28px)",
                      boxShadow: "0 2px 16px rgba(139,34,82,0.04)",
                      border: "1px solid rgba(200,169,110,0.12)",
                      transition: "box-shadow 0.3s ease",
                    }}
                  >
                    <label style={{
                      display: "block",
                      fontSize: "15px",
                      fontWeight: "600",
                      color: "#2D2D2D",
                      marginBottom: "6px",
                      lineHeight: "1.5",
                    }}>
                      {field.label}
                      {field.required && <span style={{ color: "#D4445C", marginLeft: "4px" }}>*</span>}
                    </label>

                    {field.sublabel && (
                      <p style={{ fontSize: "13px", color: "#888", lineHeight: "1.6", margin: "0 0 8px 0", fontStyle: "italic" }}>
                        {field.sublabel}
                      </p>
                    )}

                    {field.hint && (
                      <p style={{
                        fontSize: "12px",
                        color: "#C8A96E",
                        margin: "0 0 12px 0",
                        fontStyle: "italic",
                        background: "rgba(200,169,110,0.08)",
                        padding: "8px 12px",
                        borderRadius: "8px",
                      }}>
                        {field.hint}
                      </p>
                    )}

                    {field.type === "textarea" ? (
                      <textarea
                        value={formData[field.id] || ""}
                        onChange={(e) => updateField(field.id, e.target.value)}
                        placeholder="Escribí acá tu respuesta..."
                        rows={4}
                        style={{
                          width: "100%",
                          padding: "14px 16px",
                          borderRadius: "12px",
                          border: "1.5px solid #E8D5C4",
                          background: "#FDFBF9",
                          fontSize: "14px",
                          fontFamily: "'DM Sans', sans-serif",
                          color: "#2D2D2D",
                          resize: "vertical",
                          outline: "none",
                          transition: "border-color 0.3s, box-shadow 0.3s",
                          boxSizing: "border-box",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#C8A96E";
                          e.target.style.boxShadow = "0 0 0 3px rgba(200,169,110,0.12)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#E8D5C4";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                    ) : field.type === "scale" ? (
                      <ScaleInput
                        value={formData[field.id]}
                        onChange={(v) => updateField(field.id, v)}
                        lowLabel={field.lowLabel}
                        highLabel={field.highLabel}
                      />
                    ) : (
                      <input
                        type={field.type}
                        value={formData[field.id] || ""}
                        onChange={(e) => updateField(field.id, e.target.value)}
                        placeholder={field.type === "email" ? "tu@email.com" : ""}
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          borderRadius: "12px",
                          border: "1.5px solid #E8D5C4",
                          background: "#FDFBF9",
                          fontSize: "14px",
                          fontFamily: "'DM Sans', sans-serif",
                          color: "#2D2D2D",
                          outline: "none",
                          transition: "border-color 0.3s, box-shadow 0.3s",
                          boxSizing: "border-box",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#C8A96E";
                          e.target.style.boxShadow = "0 0 0 3px rgba(200,169,110,0.12)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#E8D5C4";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "rgba(255,248,240,0.9)",
        backdropFilter: "blur(16px)",
        borderTop: "1px solid rgba(200,169,110,0.15)",
        zIndex: 100,
      }}>
        <div style={{
          maxWidth: "720px",
          margin: "0 auto",
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          {currentSection > 0 ? (
            <button
              onClick={goPrev}
              style={{
                padding: "12px 24px",
                borderRadius: "12px",
                border: "1.5px solid #E8D5C4",
                background: "#fff",
                color: "#8B2252",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                transition: "all 0.2s ease",
              }}
            >
              ← Anterior
            </button>
          ) : (
            <div />
          )}

          {currentSection < totalSections - 1 ? (
            <button
              onClick={goNext}
              style={{
                padding: "12px 32px",
                borderRadius: "12px",
                border: "none",
                background: "linear-gradient(135deg, #8B2252, #A83268)",
                color: "#fff",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: "0 4px 16px rgba(139,34,82,0.25)",
                transition: "all 0.2s ease",
              }}
            >
              {currentSection === 0 ? "Comenzar ✦" : "Siguiente →"}
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              style={{
                padding: "14px 36px",
                borderRadius: "12px",
                border: "none",
                background: "linear-gradient(135deg, #C8A96E, #B8944E)",
                color: "#fff",
                fontSize: "15px",
                fontWeight: "700",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: "0 4px 20px rgba(200,169,110,0.35)",
                letterSpacing: "0.5px",
                transition: "all 0.2s ease",
              }}
            >
              Enviar mis respuestas ✦
            </button>
          )}
        </div>
      </div>

      {/* Confidentiality */}
      <div style={{
        position: "fixed",
        bottom: "72px",
        left: 0,
        right: 0,
        textAlign: "center",
        zIndex: 99,
      }}>
        <span style={{ fontSize: "11px", color: "#ccc" }}>
          🔒 Tu información está protegida por el secreto profesional
        </span>
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(${direction > 0 ? "24px" : "-24px"}); }
          to { opacity: 1; transform: translateY(0); }
        }
        textarea::-webkit-scrollbar { width: 6px; }
        textarea::-webkit-scrollbar-track { background: transparent; }
        textarea::-webkit-scrollbar-thumb { background: #E8D5C4; border-radius: 3px; }
        input::placeholder, textarea::placeholder { color: #ccc; }
        button:hover { transform: translateY(-1px); }
        button:active { transform: translateY(0); }
      `}</style>
    </div>
  );
}
