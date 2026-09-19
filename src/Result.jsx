import React, { memo, useEffect, useState, useMemo, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getZodiacSign, calculateZodiacSync } from './hooks/useZodiac';
import { getCompatibility } from './hooks/compatibility';
import { getNameMatchScore } from './hooks/nameMatch';
import { getDobMatchScore } from './hooks/dobMatch';
import { generateShipNames } from './utils/shipName';
import { fireConfetti } from './utils/confetti';
import html2canvas from 'html2canvas';

// Clean React Icons
import { FaWhatsapp, FaHeart, FaCalendarAlt, FaCrown, FaFire } from 'react-icons/fa';
import { FiShare2, FiDownload, FiArrowLeft, FiSmartphone, FiCheck, FiRefreshCw } from 'react-icons/fi';
import { RiHeartsFill } from 'react-icons/ri';
import { GiCrystalBall } from 'react-icons/gi';

const ZODIAC_ICONS = {
  Aries: '♈',
  Taurus: '♉',
  Gemini: '♊',
  Cancer: '♋',
  Leo: '♌',
  Virgo: '♍',
  Libra: '♎',
  Scorpio: '♏',
  Sagittarius: '♐',
  Capricorn: '♑',
  Aquarius: '♒',
  Pisces: '♓',
};

const Result = memo(() => {
  const { state } = useLocation();

  const [zodiac1, setZodiac1] = useState('');
  const [zodiac2, setZodiac2] = useState('');
  const [zodiacResult, setZodiacResult] = useState(null);
  const [loading, setLoading] = useState(true);

  // Animated counter for current active view
  const [animatedScore, setAnimatedScore] = useState(0);

  // Card view format: 'classic' | 'story'
  const [viewMode, setViewMode] = useState('classic');
  const [isDownloading, setIsDownloading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const hasFiredConfetti = useRef(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3200);
  };

  // Ship names
  const shipNames = useMemo(() => {
    if (!state) return { primary: 'Lovebirds', secondary: 'Soulmates', all: [] };
    return generateShipNames(state.p1Name, state.p2Name);
  }, [state]);

  // Initial calculation
  useEffect(() => {
    if (!state) return;
    let isMounted = true;

    async function calculate() {
      const fallbackZ1 = calculateZodiacSync(state.p1Dob)?.sign || 'Aries';
      const fallbackZ2 = calculateZodiacSync(state.p2Dob)?.sign || 'Aries';

      let z1 = fallbackZ1;
      let z2 = fallbackZ2;

      try {
        const [fetchedZ1, fetchedZ2] = await Promise.all([
          getZodiacSign(state.p1Dob),
          getZodiacSign(state.p2Dob),
        ]);
        if (fetchedZ1) z1 = fetchedZ1;
        if (fetchedZ2) z2 = fetchedZ2;
      } catch (err) {
        // Instant offline fallback
      }

      if (!isMounted) return;
      setZodiac1(z1);
      setZodiac2(z2);

      const result = await getCompatibility(z1, z2);
      if (!isMounted) return;
      setZodiacResult(result);
      setLoading(false);
    }

    calculate();

    return () => {
      isMounted = false;
    };
  }, [state]);

  // Scores calculation
  const { finalScore, nameScore, dobScore, vibeBadge, romanticMessage } = useMemo(() => {
    if (!state || !zodiacResult) {
      return { finalScore: 0, nameScore: 0, dobScore: 0, vibeBadge: {}, romanticMessage: '' };
    }

    const nScore = getNameMatchScore(state.p1Name, state.p2Name);
    const dScore = getDobMatchScore(state.p1Dob, state.p2Dob);
    const base = Math.round(nScore * 0.3 + dScore * 0.2 + (zodiacResult.score || 75) * 0.5);

    const combinedLength = (state.p1Name + state.p2Name).length;
    const offset = ((combinedLength * 7) % 11) - 5;
    const computedFinal = Math.min(100, Math.max(20, base + offset));

    let badge = { text: 'Cosmic Soulmates', icon: <FaCrown style={{ color: '#fbbf24' }} /> };
    let message = 'A soulmate-level connection! Your hearts align naturally, and love flows effortlessly between you.';

    if (computedFinal >= 85) {
      badge = { text: 'Cosmic Soulmates', icon: <FaCrown style={{ color: '#fbbf24' }} /> };
      message = 'A soulmate-level connection! Your spirits align naturally, creating rare and magnetic harmony.';
    } else if (computedFinal >= 70) {
      badge = { text: 'Power Couple', icon: <FaHeart style={{ color: '#ff2d55' }} /> };
      message = 'A vibrant and passionate bond. You inspire each other and bring out the best in both worlds.';
    } else if (computedFinal >= 55) {
      badge = { text: 'Sweet Harmony', icon: <FaHeart style={{ color: '#f472b6' }} /> };
      message = 'A warm and promising connection. With mutual respect and gentle care, your love continues to blossom.';
    } else if (computedFinal >= 40) {
      badge = { text: 'Sparky Dynamic', icon: <FaFire style={{ color: '#fb923c' }} /> };
      message = 'Magnetic attraction filled with chemistry! Taking time to listen and understand each other unlocks magic.';
    } else {
      badge = { text: 'Gentle Blooming', icon: <FaHeart style={{ color: '#a78bfa' }} /> };
      message = 'A tender connection. Patience, honesty, and shared moments will help your unique bond flourish.';
    }

    return {
      finalScore: computedFinal,
      nameScore: nScore,
      dobScore: dScore,
      vibeBadge: badge,
      romanticMessage: message,
    };
  }, [state, zodiacResult]);

  // Smooth counter animation whenever viewMode changes or calculation finishes
  useEffect(() => {
    if (loading || !finalScore) return;

    setAnimatedScore(0);

    let current = 0;
    const stepTime = 16;
    const increment = Math.max(1, Math.floor(finalScore / 35));

    const timer = setInterval(() => {
      current += increment;
      if (current >= finalScore) {
        setAnimatedScore(finalScore);
        clearInterval(timer);

        // Fire celebratory confetti once for high scores
        if (finalScore >= 75 && !hasFiredConfetti.current) {
          hasFiredConfetti.current = true;
          fireConfetti({ count: 80, duration: 3000 });
        }
      } else {
        setAnimatedScore(current);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [loading, finalScore, viewMode]);

  // Download card handler
  const downloadCard = async (elementId, filename) => {
    const card = document.getElementById(elementId);
    if (!card) return;

    try {
      setIsDownloading(true);
      const canvas = await html2canvas(card, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: '#160817',
        logging: false,
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = filename;
      link.click();
      showToast('Card downloaded successfully! 📸');
    } catch (err) {
      showToast('Download failed. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  // WhatsApp Share
  const handleWhatsAppShare = () => {
    const shareText = `💖 *LoveSync Match Result*\n\n` +
      `💑 *${state.p1Name}* + *${state.p2Name}*\n` +
      `🔥 *Compatibility Score:* ${finalScore}%\n` +
      `💍 *Ship Name:* ${shipNames.primary}\n` +
      `👑 *Vibe:* ${vibeBadge.text}\n\n` +
      `Check your relationship & zodiac compatibility on LoveSync!`;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  // Native Web Share or Copy Link
  const handleShareOrCopy = async () => {
    const shareData = {
      title: 'LoveSync Compatibility Result',
      text: `${state.p1Name} + ${state.p2Name} are a ${finalScore}% match (${shipNames.primary})! Check your compatibility on LoveSync.`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showToast('Shared successfully!');
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(
        `${state.p1Name} + ${state.p2Name} scored ${finalScore}% on LoveSync! Couple Nickname: ${shipNames.primary}`
      );
      showToast('Result copied to clipboard! 📋');
    } catch (err) {
      showToast('Could not copy to clipboard.');
    }
  };

  if (!state) {
    return (
      <div className="container px-3 text-center py-5">
        <div className="glass-panel p-4 p-md-5 mx-auto" style={{ maxWidth: '500px' }}>
          <div className="display-4 mb-3">💔</div>
          <h3 className="fw-bold mb-2 text-white">No Details Found</h3>
          <p className="text-white-50 mb-4">Please fill in your details to check your compatibility.</p>
          <Link to="/" className="btn btn-love-primary px-4 d-inline-flex align-items-center gap-2">
            <FiArrowLeft /> Go to Home
          </Link>
        </div>
      </div>
    );
  }

  if (loading || !zodiacResult) {
    return (
      <div className="container px-3 text-center py-5">
        <div className="glass-panel p-4 p-md-5 mx-auto" style={{ maxWidth: '420px' }}>
          <div className="brand-heart fs-1 mb-3 text-danger d-inline-flex justify-content-center">
            <FaHeart style={{ color: '#ff2d55' }} />
          </div>
          <h4 className="fw-semibold mb-2 text-white">Consulting the Stars…</h4>
          <p className="text-white-50 mb-0 small">Calculating astrological harmony & heart alignment</p>
        </div>
      </div>
    );
  }

  // Circular gauge math (radius = 65, circumference = 2 * PI * 65 ≈ 408.4)
  const radius = 65;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="container px-2 px-sm-3 px-lg-4 pb-5 my-auto">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="love-toast">
          <FiCheck className="text-pink fs-5" style={{ color: '#ff7597' }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Controls: View Switcher & Action Bar */}
      <div className="row justify-content-center mb-3 mb-md-4">
        <div className="col-12 col-md-11 col-lg-10 col-xl-9 d-flex flex-column flex-sm-row justify-content-between align-items-stretch align-items-sm-center gap-2 gap-sm-3">
          {/* Toggle buttons */}
          <div className="btn-group bg-dark p-1 rounded-pill border border-secondary border-opacity-25 align-self-center align-self-sm-auto">
            <button
              className={`btn btn-sm rounded-pill px-3 ${viewMode === 'classic' ? 'btn-love-primary' : 'text-white-50'}`}
              onClick={() => setViewMode('classic')}
            >
              Classic Card
            </button>
            <button
              className={`btn btn-sm rounded-pill px-3 d-inline-flex align-items-center gap-1 ${viewMode === 'story' ? 'btn-love-primary' : 'text-white-50'}`}
              onClick={() => setViewMode('story')}
            >
              <FiSmartphone className="small" />
              <span>Story Mode (9:16)</span>
            </button>
          </div>

          {/* Action buttons */}
          <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap">
            <button
              onClick={handleWhatsAppShare}
              className="btn btn-whatsapp btn-sm d-inline-flex align-items-center gap-2 px-3 py-2"
              title="Share on WhatsApp"
            >
              <FaWhatsapp className="fs-6" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={handleShareOrCopy}
              className="btn btn-love-outline btn-sm d-inline-flex align-items-center gap-1 px-3 py-2"
              title="Copy or Native Share"
            >
              <FiShare2 />
              <span>Share</span>
            </button>

            <button
              disabled={isDownloading}
              onClick={() =>
                downloadCard(
                  viewMode === 'story' ? 'love-story-card' : 'love-classic-card',
                  viewMode === 'story' ? `${shipNames.primary}-story.png` : `${shipNames.primary}-love-sync.png`
                )
              }
              className="btn btn-love-primary btn-sm d-inline-flex align-items-center gap-1 px-3 py-2"
              title="Download image"
            >
              <FiDownload />
              <span>{isDownloading ? 'Saving…' : 'Save Image'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODE 1: CLASSIC VIEW */}
      {viewMode === 'classic' && (
        <div className="row justify-content-center">
          <div className="col-12 col-md-11 col-lg-10 col-xl-9">
            <div id="love-classic-card" className="glass-panel p-3 p-sm-4 p-md-5 text-center">
              {/* Couple Header & Ship Badge */}
              <div className="mb-2 mb-md-3">
                <span className="ship-name-badge mb-2">
                  Couple Nickname: <strong>{shipNames.primary}</strong>
                </span>
                <div className="mt-2">
                  <span className="vibe-tag">
                    <span>{vibeBadge.icon}</span>
                    <span>{vibeBadge.text}</span>
                  </span>
                </div>
              </div>

              {/* Partners Names and Zodiac Signs */}
              <div className="row align-items-center my-3 my-md-4 py-2 g-2">
                <div className="col-5 text-end">
                  <h3 className="fw-bold mb-1 fs-5 fs-sm-4 fs-md-3 text-truncate text-white">
                    {state.p1Name}
                  </h3>
                  <div
                    className="d-inline-flex align-items-center gap-1 text-pink small px-2 py-1 rounded"
                    style={{ background: 'rgba(255, 45, 85, 0.15)', color: '#fda4af', fontSize: '0.82rem' }}
                  >
                    <span>{ZODIAC_ICONS[zodiac1]}</span>
                    <span>{zodiac1}</span>
                  </div>
                </div>

                <div className="col-2 text-center">
                  <div className="brand-heart fs-3 fs-md-2 text-danger d-inline-flex justify-content-center">
                    <RiHeartsFill style={{ color: '#ff2d55' }} />
                  </div>
                </div>

                <div className="col-5 text-start">
                  <h3 className="fw-bold mb-1 fs-5 fs-sm-4 fs-md-3 text-truncate text-white">
                    {state.p2Name}
                  </h3>
                  <div
                    className="d-inline-flex align-items-center gap-1 text-pink small px-2 py-1 rounded"
                    style={{ background: 'rgba(255, 45, 85, 0.15)', color: '#fda4af', fontSize: '0.82rem' }}
                  >
                    <span>{ZODIAC_ICONS[zodiac2]}</span>
                    <span>{zodiac2}</span>
                  </div>
                </div>
              </div>

              {/* Circular Animated Progress Gauge */}
              <div className="score-circle-wrap my-3">
                <svg className="score-circle-svg" viewBox="0 0 150 150">
                  <defs>
                    <linearGradient id="scoreGradientClassic" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ff2d55" />
                      <stop offset="50%" stopColor="#ff7597" />
                      <stop offset="100%" stopColor="#fbbf24" />
                    </linearGradient>
                  </defs>
                  <circle className="score-circle-bg" cx="75" cy="75" r={radius} />
                  <circle
                    className="score-circle-progress"
                    cx="75"
                    cy="75"
                    r={radius}
                    stroke="url(#scoreGradientClassic)"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                  />
                </svg>
                <div className="score-circle-content">
                  <div className="score-number">{animatedScore}%</div>
                  <div className="text-white-50 small text-uppercase" style={{ letterSpacing: '1px', fontSize: '0.7rem' }}>
                    Match
                  </div>
                </div>
              </div>

              {/* Romantic Insight */}
              <p className="lead fw-normal text-white-50 px-2 px-md-4 my-3 fst-italic fs-6 fs-md-5">
                "{romanticMessage}"
              </p>

              {/* Zodiac Astrological Synergy Alert */}
              <div
                className="p-3 my-3 my-md-4 rounded-4 text-start"
                style={{
                  background: 'rgba(251, 191, 36, 0.08)',
                  border: '1px solid rgba(251, 191, 36, 0.25)',
                }}
              >
                <div className="d-flex align-items-center gap-2 mb-1">
                  <GiCrystalBall className="fs-5" style={{ color: '#fbbf24' }} />
                  <h6 className="fw-semibold mb-0 text-truncate" style={{ color: '#fbbf24', fontSize: '0.95rem' }}>
                    Zodiac Chemistry ({zodiac1} + {zodiac2})
                  </h6>
                </div>
                <p className="mb-0 small text-white-50 ps-1 ps-sm-4">
                  {zodiacResult.message}
                </p>
              </div>

              {/* Breakdown Bars */}
              <div className="row g-2 g-md-3 text-start my-2">
                <div className="col-12 col-md-4">
                  <div className="aspect-card">
                    <div className="d-flex justify-content-between small">
                      <span className="text-white-50 d-inline-flex align-items-center gap-1">
                        <FaHeart className="small" style={{ color: '#ff2d55' }} /> Name Match
                      </span>
                      <span className="fw-bold text-white">{nameScore}%</span>
                    </div>
                    <div className="custom-progress-track">
                      <div className="custom-progress-fill" style={{ width: `${nameScore}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-4">
                  <div className="aspect-card">
                    <div className="d-flex justify-content-between small">
                      <span className="text-white-50 d-inline-flex align-items-center gap-1">
                        <FaCalendarAlt className="small" style={{ color: '#fbbf24' }} /> DOB Match
                      </span>
                      <span className="fw-bold text-white">{dobScore}%</span>
                    </div>
                    <div className="custom-progress-track">
                      <div className="custom-progress-fill" style={{ width: `${dobScore}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-4">
                  <div className="aspect-card">
                    <div className="d-flex justify-content-between small">
                      <span className="text-white-50 d-inline-flex align-items-center gap-1">
                        <GiCrystalBall className="small" style={{ color: '#c084fc' }} /> Zodiac Match
                      </span>
                      <span className="fw-bold text-white">{zodiacResult.score || 80}%</span>
                    </div>
                    <div className="custom-progress-track">
                      <div className="custom-progress-fill" style={{ width: `${zodiacResult.score || 80}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-4 pt-3 border-top border-white border-opacity-10 d-flex justify-content-between align-items-center flex-wrap gap-2">
                <span className="small text-white-50">
                  A little magic, a little destiny
                </span>
                <Link to="/" className="btn btn-love-outline btn-sm px-3 d-inline-flex align-items-center gap-1">
                  <FiRefreshCw className="small" /> Try Another Match
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: INSTAGRAM & WHATSAPP STORY CARD (9:16) */}
      {viewMode === 'story' && (
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
            <div id="love-story-card" className="story-card-wrapper">
              {/* Brand Top */}
              <div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold small d-inline-flex align-items-center gap-1 text-white" style={{ letterSpacing: '1px' }}>
                    <FaHeart style={{ color: '#ff2d55' }} /> LOVESYNC
                  </span>
                  <span className="small text-white-50" style={{ letterSpacing: '0.5px' }}>STORY CARD</span>
                </div>
                <hr className="my-2 border-white border-opacity-20" />
              </div>

              {/* Center Content */}
              <div className="my-auto py-2">
                {/* Ship Name */}
                <div className="mb-2">
                  <span className="ship-name-badge">
                    #{shipNames.primary}
                  </span>
                </div>

                {/* Names */}
                <h2 className="fw-bold fs-3 mb-1 text-white text-truncate px-2">
                  {state.p1Name} & {state.p2Name}
                </h2>

                {/* Zodiac signs */}
                <p className="text-pink small mb-2" style={{ color: '#fda4af' }}>
                  {ZODIAC_ICONS[zodiac1]} {zodiac1} & {ZODIAC_ICONS[zodiac2]} {zodiac2}
                </p>

                {/* Score Ring with dedicated LinearGradient Defs */}
                <div className="score-circle-wrap my-2">
                  <svg className="score-circle-svg" viewBox="0 0 150 150">
                    <defs>
                      <linearGradient id="scoreGradientStory" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ff2d55" />
                        <stop offset="50%" stopColor="#ff7597" />
                        <stop offset="100%" stopColor="#fbbf24" />
                      </linearGradient>
                    </defs>
                    <circle className="score-circle-bg" cx="75" cy="75" r={radius} />
                    <circle
                      className="score-circle-progress"
                      cx="75"
                      cy="75"
                      r={radius}
                      stroke="url(#scoreGradientStory)"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                    />
                  </svg>
                  <div className="score-circle-content">
                    <div className="score-number">{animatedScore}%</div>
                    <div className="text-white-50 small text-uppercase" style={{ letterSpacing: '1px', fontSize: '0.68rem' }}>
                      COMPATIBILITY
                    </div>
                  </div>
                </div>

                {/* Vibe Tag */}
                <div className="my-2">
                  <span className="vibe-tag">
                    <span>{vibeBadge.icon}</span>
                    <span>{vibeBadge.text}</span>
                  </span>
                </div>

                {/* Romantic Line */}
                <p className="small text-white-50 px-2 mb-0 fst-italic" style={{ fontSize: '0.86rem' }}>
                  "{romanticMessage}"
                </p>
              </div>

              {/* Story Footer & Watermark */}
              <div className="pt-2 border-top border-white border-opacity-20">
                <div className="d-flex justify-content-around text-center small text-white-50 mb-2">
                  <div>Name: <strong className="text-white">{nameScore}%</strong></div>
                  <div>DOB: <strong className="text-white">{dobScore}%</strong></div>
                  <div>Zodiac: <strong className="text-white">{zodiacResult.score || 80}%</strong></div>
                </div>
                <div className="text-pink small d-inline-flex align-items-center justify-content-center gap-1 w-100" style={{ color: '#fbcfe8', fontSize: '0.78rem' }}>
                  <span>Calculate yours at LoveSync</span>
                  <FaHeart style={{ color: '#ff2d55' }} />
                </div>
              </div>
            </div>

            {/* Quick action below story preview */}
            <div className="text-center mt-3">
              <button
                disabled={isDownloading}
                onClick={() => downloadCard('love-story-card', `${shipNames.primary}-story.png`)}
                className="btn btn-love-primary px-4 py-2 d-inline-flex align-items-center gap-2"
              >
                <FiDownload />
                <span>{isDownloading ? 'Exporting Story...' : 'Download Story Format (9:16)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default Result;