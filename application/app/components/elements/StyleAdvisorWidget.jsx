"use client";

import { useState, useRef, useEffect } from "react";
import { ALL_PRODUCTS } from "../../../lib/products";

// ── Icons ──────────────────────────────────────────────────
const SparkleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const UploadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

// ── Steps ──────────────────────────────────────────────────
const STEPS = ["Body Info", "Style Prefs", "Photo", "Results"];

const BODY_TYPES = ["Slim / Ectomorph", "Athletic / Mesomorph", "Curvy / Endomorph", "Pear Shape", "Apple Shape", "Hourglass"];
const SKIN_TONES = ["Fair", "Light", "Medium", "Olive", "Tan", "Deep"];
const STYLE_PREFS = ["Casual", "Formal", "Streetwear", "Minimalist", "Sporty", "Vintage"];
const GENDERS = ["Male", "Female", "Non-binary / Other"];

const INITIAL_FORM = {
  gender: "",
  age: "",
  height: "",
  weight: "",
  bodyType: "",
  skinTone: "",
  stylePrefs: [],
  budget: "mid",
};

// ── Pill Button ────────────────────────────────────────────
function Pill({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
        selected
          ? "bg-black text-white border-black"
          : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
      }`}
    >
      {label}
    </button>
  );
}

// ── Result Card ────────────────────────────────────────────
function ResultSection({ title, content }) {
  return (
    <div className="mb-4">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">{title}</p>
      <p className="text-sm text-gray-700 leading-relaxed">{content}</p>
    </div>
  );
}

// ── Main Widget ────────────────────────────────────────────
export default function StyleAdvisorWidget() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL_FORM);
  const [photo, setPhoto] = useState(null);
  const [photoBase64, setPhotoBase64] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const fileRef = useRef();
  const resultRef = useRef();

  // Scroll to result when it arrives
  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [result]);

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const toggleStylePref = (pref) => {
    setForm((f) => ({
      ...f,
      stylePrefs: f.stylePrefs.includes(pref)
        ? f.stylePrefs.filter((p) => p !== pref)
        : [...f.stylePrefs, pref],
    }));
  };

  const handlePhoto = (file) => {
    if (!file) return;
    setPhoto(URL.createObjectURL(file));
    const reader = new FileReader();
    reader.onload = (e) => setPhotoBase64(e.target.result.split(",")[1]);
    reader.readAsDataURL(file);
  };

  const canProceed = () => {
    if (step === 0) return form.gender && form.height && form.weight && form.bodyType && form.skinTone;
    if (step === 1) return form.stylePrefs.length > 0;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    // Build product catalog string for the prompt
    const catalog = ALL_PRODUCTS.map(
      (p) => `- ${p.title} ($${p.price})${p.discount ? ` [${p.discount} off]` : ""}`
    ).join("\n");

    try {
      const res = await fetch("/api/style-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form, photoBase64, catalog }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      setStep(3);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(0);
    setForm(INITIAL_FORM);
    setPhoto(null);
    setPhotoBase64(null);
    setResult(null);
    setError("");
  };

  // ── Step 0: Body Info ────────────────────────────────────
  const Step0 = () => (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs text-gray-400 font-medium mb-2">Gender</p>
        <div className="flex flex-wrap gap-2">
          {GENDERS.map((g) => (
            <Pill key={g} label={g} selected={form.gender === g} onClick={() => update("gender", g)} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <p className="text-xs text-gray-400 font-medium mb-1.5">Age</p>
          <input
            type="number"
            placeholder="25"
            value={form.age}
            onChange={(e) => update("age", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-black transition-colors"
          />
        </div>
        <div>
          <p className="text-xs text-gray-400 font-medium mb-1.5">Height (cm)</p>
          <input
            type="number"
            placeholder="175"
            value={form.height}
            onChange={(e) => update("height", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-black transition-colors"
          />
        </div>
        <div>
          <p className="text-xs text-gray-400 font-medium mb-1.5">Weight (kg)</p>
          <input
            type="number"
            placeholder="70"
            value={form.weight}
            onChange={(e) => update("weight", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-black transition-colors"
          />
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-400 font-medium mb-2">Body Type</p>
        <div className="flex flex-wrap gap-2">
          {BODY_TYPES.map((b) => (
            <Pill key={b} label={b} selected={form.bodyType === b} onClick={() => update("bodyType", b)} />
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-400 font-medium mb-2">Skin Tone</p>
        <div className="flex flex-wrap gap-2">
          {SKIN_TONES.map((s) => (
            <Pill key={s} label={s} selected={form.skinTone === s} onClick={() => update("skinTone", s)} />
          ))}
        </div>
      </div>
    </div>
  );

  // ── Step 1: Style Prefs ──────────────────────────────────
  const Step1 = () => (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs text-gray-400 font-medium mb-2">Style Preferences (pick all that apply)</p>
        <div className="flex flex-wrap gap-2">
          {STYLE_PREFS.map((s) => (
            <Pill key={s} label={s} selected={form.stylePrefs.includes(s)} onClick={() => toggleStylePref(s)} />
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-400 font-medium mb-2">Budget Range</p>
        <div className="flex gap-2">
          {[["budget", "Under $150"], ["mid", "$150–$300"], ["high", "$300+"]].map(([val, label]) => (
            <Pill key={val} label={label} selected={form.budget === val} onClick={() => update("budget", val)} />
          ))}
        </div>
      </div>
    </div>
  );

  // ── Step 2: Photo ────────────────────────────────────────
  const Step2 = () => (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-gray-500 leading-relaxed">
        Optionally upload a photo for more personalized color and style suggestions. Your photo is only used for this request.
      </p>

      <div
        onClick={() => fileRef.current?.click()}
        className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center gap-3 cursor-pointer hover:border-black transition-colors group"
      >
        {photo ? (
          <img src={photo} alt="preview" className="w-24 h-24 object-cover rounded-xl" />
        ) : (
          <div className="text-gray-300 group-hover:text-gray-500 transition-colors">
            <UploadIcon />
          </div>
        )}
        <p className="text-xs text-gray-400 text-center">
          {photo ? "Tap to change photo" : "Tap to upload a full-body photo"}
        </p>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handlePhoto(e.target.files[0])}
        />
      </div>

      {photo && (
        <button
          onClick={() => { setPhoto(null); setPhotoBase64(null); }}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors text-center"
        >
          Remove photo
        </button>
      )}

      <p className="text-xs text-gray-400 text-center">
        Skip this step if you prefer — we'll use your form data only.
      </p>
    </div>
  );

  // ── Step 3: Results ──────────────────────────────────────
  const Step3 = () => (
    <div ref={resultRef} className="flex flex-col gap-2">
      {loading ? (
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Analyzing your style profile...</p>
        </div>
      ) : error ? (
        <div className="text-center py-6">
          <p className="text-sm text-red-500 mb-4">{error}</p>
          <button onClick={() => setStep(2)} className="text-sm underline text-gray-500">Go back</button>
        </div>
      ) : result ? (
        <>
          <div className="bg-gray-50 rounded-2xl p-4 mb-2">
            <ResultSection title="📐 Your Size" content={result.size} />
            <ResultSection title="👗 Styles That Suit You" content={result.styles} />
            <ResultSection title="🎨 Colors For Your Skin Tone" content={result.colors} />
            <ResultSection title="✂️ Fit Advice" content={result.fitAdvice} />
            <div className="mb-2">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">🛍️ From Our Store</p>
              <div className="flex flex-col gap-1.5">
                {result.productSuggestions?.map((item, i) => (
                  <div key={i} className="text-sm text-gray-700 flex items-start gap-1.5">
                    <span className="text-gray-400 mt-0.5">•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            {result.extraTip && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500 italic">{result.extraTip}</p>
              </div>
            )}
          </div>
          <button
            onClick={reset}
            className="w-full border border-gray-200 rounded-full py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Start Over
          </button>
        </>
      ) : null}
    </div>
  );

const stepComponents = [Step0(), Step1(), Step2(), Step3()];
  return (
    <>
      {/* ── Floating Button ──────────────────────────── */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
          open ? "bg-gray-800 rotate-12" : "bg-black hover:scale-110"
        } text-white`}
        aria-label="Style Advisor"
      >
        {open ? <CloseIcon /> : <SparkleIcon />}
      </button>

      {/* ── Widget Panel ─────────────────────────────── */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-24px)] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col transition-all duration-300 origin-bottom-right ${
          open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
        }`}
        style={{ maxHeight: "calc(100vh - 120px)" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 shrink-0">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white">
            <SparkleIcon />
          </div>
          <div>
            <p className="text-sm font-bold">AI Style Advisor</p>
            <p className="text-xs text-gray-400">Personalized for your body & style</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="ml-auto text-gray-300 hover:text-gray-600 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Step Progress */}
        {step < 3 && (
          <div className="px-5 pt-4 shrink-0">
            <div className="flex items-center gap-1 mb-4">
              {STEPS.slice(0, 3).map((s, i) => (
                <div key={i} className="flex items-center gap-1 flex-1">
                  <div
                    className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${
                      i <= step ? "bg-black" : "bg-gray-100"
                    }`}
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 font-medium mb-1">
              Step {step + 1} of 3
            </p>
            <p className="text-base font-bold mb-4">{STEPS[step]}</p>
          </div>
        )}

        {/* Step Content */}
        <div className="px-5 overflow-y-auto flex-1 pb-4">
          {stepComponents[step]}
        </div>

        {/* Footer Nav */}
        {step < 3 && (
          <div className="px-5 py-4 border-t border-gray-100 shrink-0">
            <div className="flex gap-3">
              {step > 0 && (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="px-5 py-2.5 border border-gray-200 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
              )}
              {step < 2 ? (
                <button
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canProceed()}
                  className="flex-1 flex items-center justify-center gap-2 bg-black text-white rounded-full py-2.5 text-sm font-semibold hover:opacity-85 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Continue <ArrowIcon />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 bg-black text-white rounded-full py-2.5 text-sm font-semibold hover:opacity-85 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>Get My Style Advice <ArrowIcon /></>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
