import React, { memo, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { calculateZodiacSync } from './hooks/useZodiac';
import { FaUser, FaHeart, FaBirthdayCake, FaCalendarAlt } from 'react-icons/fa';
import { FaUserGroup } from 'react-icons/fa6';
import { FiAlertCircle } from 'react-icons/fi';
import { IoFlash } from 'react-icons/io5';

function calculateAge(dobString) {
  if (!dobString) return null;
  const birthDate = new Date(dobString);
  if (isNaN(birthDate.getTime())) return null;

  const year = birthDate.getFullYear();
  const currentYear = new Date().getFullYear();

  // Protect against partial inputs like "0002" or "02" while typing
  if (year < 1920 || year > currentYear) return null;

  let age = currentYear - year;
  const m = new Date().getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && new Date().getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 0 && age <= 110 ? age : null;
}

const Home = memo(() => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      p1Name: '',
      p1Dob: '',
      p1Gender: '',
      p2Name: '',
      p2Dob: '',
      p2Gender: ''
    }
  });

  const navigate = useNavigate();

  const p1Dob = watch('p1Dob');
  const p2Dob = watch('p2Dob');

  const p1Zodiac = useMemo(() => calculateZodiacSync(p1Dob), [p1Dob]);
  const p2Zodiac = useMemo(() => calculateZodiacSync(p2Dob), [p2Dob]);

  const p1Age = useMemo(() => calculateAge(p1Dob), [p1Dob]);
  const p2Age = useMemo(() => calculateAge(p2Dob), [p2Dob]);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const onSubmit = (data) => {
    const params = new URLSearchParams({
      p1: data.p1Name || '',
      d1: data.p1Dob || '',
      g1: data.p1Gender || '',
      p2: data.p2Name || '',
      d2: data.p2Dob || '',
      g2: data.p2Gender || '',
    });

    try {
      localStorage.setItem('loveSync_last_match', JSON.stringify(data));
    } catch (e) {
      // LocalStorage error fallback
    }

    navigate(`/result?${params.toString()}`, { state: data });
  };

  const handleQuickFill = () => {
    setValue('p1Name', 'John', { shouldValidate: true });
    setValue('p1Dob', '2001-08-18', { shouldValidate: true });
    setValue('p1Gender', 'Male');

    setValue('p2Name', 'Nia', { shouldValidate: true });
    setValue('p2Dob', '2002-04-12', { shouldValidate: true });
    setValue('p2Gender', 'Female');
  };

  return (
    <div className="container home-container px-2 px-sm-3 px-lg-4 my-auto">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-11 col-md-11 col-lg-10 col-xl-9 col-xxl-8">
          <div className="glass-panel home-glass-panel p-3 p-sm-4 p-lg-4">
            {/* Header */}
            <div className="text-center mb-2 mb-md-3">
              <div
                className="d-inline-flex align-items-center justify-content-center mb-1 mb-md-2 px-3 py-1 rounded-pill"
                style={{ background: 'rgba(255, 45, 85, 0.15)', border: '1px solid rgba(255, 117, 151, 0.3)' }}
              >
                <span className="small text-pink" style={{ color: '#fda4af', fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.3px' }}>
                  ✨ Cosmic Soul Match
                </span>
              </div>
              <h1 className="fw-bold fs-3 fs-md-2 mb-1 text-white" style={{ letterSpacing: '-0.5px' }}>
                Check Compatibility
              </h1>
              <p className="text-white-50 mb-0 small px-2">
                Discover your relationship score, couple nickname, and zodiac synergy
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="row g-3 mb-2 mb-md-3 align-items-stretch">

                {/* Person 1 Details */}
                <div className="col-12 col-md-6 d-flex">
                  <div className="partner-card-sub flex-fill w-100 p-3 p-lg-3 d-flex flex-column">
                    <div className="d-flex align-items-center justify-content-between mb-2" style={{ minHeight: '28px' }}>
                      <h5 className="fw-semibold mb-0 d-flex align-items-center gap-2 text-white fs-6">
                        <FaUser style={{ color: '#ff7597' }} />
                        <span>Your Details</span>
                      </h5>
                      <div>
                        {p1Zodiac && (
                          <span className="live-info-badge">
                            {p1Zodiac.symbol} {p1Zodiac.sign}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mb-2">
                      <label className="form-label small text-white-50 mb-1" style={{ fontSize: '0.82rem' }}>Your Full Name</label>
                      <input
                        {...register('p1Name', { required: 'Please enter your name' })}
                        placeholder="e.g. John"
                        className="form-control glass-input"
                      />
                      <div style={{ minHeight: errors.p1Name ? '18px' : '4px' }}>
                        {errors.p1Name && (
                          <div className="form-text text-danger small mt-1 d-flex align-items-center gap-1" style={{ fontSize: '0.78rem' }}>
                            <FiAlertCircle />
                            <span>{errors.p1Name.message}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mb-2">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <label className="form-label small text-white-50 mb-0 d-flex align-items-center gap-1" style={{ fontSize: '0.82rem' }}>
                          <FaCalendarAlt className="small" /> Date of Birth
                        </label>
                        {p1Age !== null && (
                          <span className="small text-white-50 d-inline-flex align-items-center gap-1">
                            <FaBirthdayCake style={{ color: '#fda4af' }} /> {p1Age} yrs
                          </span>
                        )}
                      </div>
                      <input
                        type="date"
                        max={todayStr}
                        {...register('p1Dob', { required: 'Date of birth is required' })}
                        className="form-control glass-input"
                      />
                      <div style={{ minHeight: errors.p1Dob ? '18px' : '4px' }}>
                        {errors.p1Dob && (
                          <div className="form-text text-danger small mt-1 d-flex align-items-center gap-1" style={{ fontSize: '0.78rem' }}>
                            <FiAlertCircle />
                            <span>{errors.p1Dob.message}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-auto">
                      <label className="form-label small text-white-50 mb-1" style={{ fontSize: '0.82rem' }}>Gender (Optional)</label>
                      <select {...register('p1Gender')} className="form-select glass-input">
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non-binary">Non-binary / Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-6 d-flex">
                  <div className="partner-card-sub flex-fill w-100 p-3 p-lg-3 d-flex flex-column">
                    <div className="d-flex align-items-center justify-content-between mb-2" style={{ minHeight: '28px' }}>
                      <h5 className="fw-semibold mb-0 d-flex align-items-center gap-2 text-white fs-6">
                        <FaUserGroup style={{ color: '#ff7597' }} />
                        <span>Partner's Details</span>
                      </h5>
                      <div>
                        {p2Zodiac && (
                          <span className="live-info-badge">
                            {p2Zodiac.symbol} {p2Zodiac.sign}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mb-2">
                      <label className="form-label small text-white-50 mb-1" style={{ fontSize: '0.82rem' }}>Partner's Name</label>
                      <input
                        {...register('p2Name', { required: "Please enter partner's name" })}
                        placeholder="e.g. Nia"
                        className="form-control glass-input"
                      />
                      <div style={{ minHeight: errors.p2Name ? '18px' : '4px' }}>
                        {errors.p2Name && (
                          <div className="form-text text-danger small mt-1 d-flex align-items-center gap-1" style={{ fontSize: '0.78rem' }}>
                            <FiAlertCircle />
                            <span>{errors.p2Name.message}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mb-2">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <label className="form-label small text-white-50 mb-0 d-flex align-items-center gap-1" style={{ fontSize: '0.82rem' }}>
                          <FaCalendarAlt className="small" /> Date of Birth
                        </label>
                        {p2Age !== null && (
                          <span className="small text-white-50 d-inline-flex align-items-center gap-1">
                            <FaBirthdayCake style={{ color: '#fda4af' }} /> {p2Age} yrs
                          </span>
                        )}
                      </div>
                      <input
                        type="date"
                        max={todayStr}
                        {...register('p2Dob', { required: "Partner's DOB is required" })}
                        className="form-control glass-input"
                      />
                      <div style={{ minHeight: errors.p2Dob ? '18px' : '4px' }}>
                        {errors.p2Dob && (
                          <div className="form-text text-danger small mt-1 d-flex align-items-center gap-1" style={{ fontSize: '0.78rem' }}>
                            <FiAlertCircle />
                            <span>{errors.p2Dob.message}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-auto">
                      <label className="form-label small text-white-50 mb-1" style={{ fontSize: '0.82rem' }}>Gender (Optional)</label>
                      <select {...register('p2Gender')} className="form-select glass-input">
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non-binary">Non-binary / Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-grid gap-1 gap-md-2 mt-1">
                <button type="submit" className="btn btn-love-primary py-2 px-3 fs-6 fw-semibold d-flex align-items-center justify-content-center gap-2">
                  <FaHeart className="fs-6" />
                  <span>Calculate Compatibility</span>
                </button>
                <div className="text-center mt-1">
                  <button
                    type="button"
                    onClick={handleQuickFill}
                    className="btn btn-link text-white-50 text-decoration-none small py-0 d-inline-flex align-items-center gap-1"
                    style={{ fontSize: '0.82rem' }}
                  >
                    <IoFlash style={{ color: '#fbbf24' }} />
                    <span>Quick Fill Sample Match</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Home;
