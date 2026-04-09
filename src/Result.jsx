import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { getZodiacSign } from './hooks/useZodiac';
import { getCompatibility } from './hooks/compatibility';
import { getNameMatchScore } from './hooks/nameMatch';
import { getDobMatchScore } from './hooks/dobMatch';
import html2canvas from 'html2canvas';

export default function Result() {
    let { state } = useLocation()
    let [zodiac1, setZodiac1] = useState("")
    let [zodiac2, setZodiac2] = useState("")
    let [zodiacResult, setZodiacResult] = useState(null)
    let [loading, setLoading] = useState(true)

    const downloadCard = async () => {
        const card = document.getElementById("love-card");

        if (!card) return;

        const canvas = await html2canvas(card, {
            scale: 2,
            useCORS: true
        })

        const image = canvas.toDataURL("image/png");

        const link = document.createElement("a");
        link.href = image;
        link.download = "love-compatibility.png";
        link.click();
    }

    let zodiacIcons = {
        Aries: "♈",
        Taurus: "♉",
        Gemini: "♊",
        Cancer: "♋",
        Leo: "♌",
        Virgo: "♍",
        Libra: "♎",
        Scorpio: "♏",
        Sagittarius: "♐",
        Capricorn: "♑",
        Aquarius: "♒",
        Pisces: "♓"
    }

    useEffect(() => {
        if (!state) return

        async function calculate() {
            let z1 = await getZodiacSign(state.p1Dob)
            let z2 = await getZodiacSign(state.p2Dob)
            setZodiac1(z1)
            setZodiac2(z2)
            let result = await getCompatibility(z1, z2)
            setZodiacResult(result)
            setLoading(false)
        }

        calculate()
    }, [state])

    if (!state) { return <p className="text-center mt-5">Please go back and fill the form.</p> }
    if (loading || !zodiacResult) { return <p className="text-center mt-5">Calculating compatibility… ❤️</p> }

    let nameScore = getNameMatchScore(state.p1Name, state.p2Name);
    let dobScore = getDobMatchScore(state.p1Dob, state.p2Dob);
    let baseScore = Math.round(nameScore * 0.3 + dobScore * 0.2 + zodiacResult.score * 0.5)
    function addRandomFluctuation(score) {
        const randomOffset = Math.floor(Math.random() * 11) - 5;
        let final = score + randomOffset;
        if (final > 100) final = 100;
        if (final < 0) final = 0;
        return final;
    }
    function getFinalRomanticMessage(score) {
        if (score >= 85) {
            return "💞 A soulmate-level connection! Your hearts align naturally, and love flows effortlessly between you.";
        }

        if (score >= 70) {
            return "❤️ A strong and beautiful bond. With care and communication, this love can grow even deeper.";
        }

        if (score >= 55) {
            return "💖 A promising connection. You understand each other well, and small efforts can make this special.";
        }

        if (score >= 40) {
            return "💫 There is attraction, but understanding takes time. Patience and honesty are the key.";
        }

        return "🌱 A gentle connection. Love can grow if both hearts are willing to nurture it.";
    }

    let finalScore = addRandomFluctuation(baseScore)
    let finalMessage = getFinalRomanticMessage(finalScore)

    return (
        <div className="container mt-5">
            <div className="card shadow p-4 text-center result-card">
                <div className="d-flex justify-content-end">
                    <button className="btn btn-outline-secondary btn-sm" onClick={downloadCard}><i className="bi bi-download" style={{ color: "#be185d" }}></i></button>

                </div>
                <div id="love-card" className='result-card'>
                <p className='display-6 fw-semibold' style={{color: "#4c0519"}}>💖 LoveSync 💖</p>
                <h1 className="text-danger">{finalScore}%</h1>
                <p className="fw-semibold mt-2 result-message">{finalMessage}</p>
                <p className="text-muted mb-0">Overall Compatibility</p>
                <hr className='mt-1' />
                <div className="row">
                    <div className="col-md-4">
                        <h5 className='result-names'>{state.p1Name}</h5>
                        <p className='result-meta'>{zodiacIcons[zodiac1]}{zodiac1}</p>
                    </div>
                    <div className="col-md-4 display-4">💕</div>
                    <div className="col-md-4 ">
                        <h5 className='result-names'>{state.p2Name}</h5>
                        <p className='result-meta'>{zodiacIcons[zodiac2]}{zodiac2}</p>
                    </div>
                </div>

                <div className="alert alert-warning mt-3">
                    <h5>🔮 Zodiac Compatibility</h5>
                    <p className="mb-0 result-message">{zodiacResult.message}</p>
                </div>

                <div className="d-flex justify-content-evenly mt-2">
                    <p className='result-meta'>❤️ Name Match: <strong>{nameScore}%</strong></p>
                    <p className='result-meta'>📅 DOB Match: <strong>{dobScore}%</strong></p>
                    <p className='result-meta'>♈ Zodiac Match: <strong>{zodiacResult.score}%</strong></p>
                </div>
                <small className="mt-3 d-block opacity-75">
                    ✨ A little magic, a little destiny
                </small>
                </div>
                <Link to="/" className="btn btn-outline-danger mt-3 mx-auto w-50">Try Again</Link>
            </div>
        </div>
    )
}