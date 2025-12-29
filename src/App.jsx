import { useEffect, useMemo, useState } from "react";
import "./App.css";

function pick3Unique(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, 3);
}

function App() {
    const [screen, setScreen] = useState("modeSelect"); // modeSelect | name | game | hint | secondChance | lose | win
    const [gameMode, setGameMode] = useState(null); // easy | hard

    const [playerName, setPlayerName] = useState("");
    const [nameInput, setNameInput] = useState("");

    const [stage, setStage] = useState(1); // 1..3
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);

    const [roundImages, setRoundImages] = useState([]);
    const [aiImageIndex, setAiImageIndex] = useState(0);
    const [selectedImage, setSelectedImage] = useState(null);

    const [scores, setScores] = useState(
        JSON.parse(localStorage.getItem("scores_v2")) || []
    );

    const resetLeaderboard = () => {
        if (window.confirm("Skor tablosu sıfırlansın mı?")) {
            setScores([]);
            localStorage.removeItem("scores_v2");
        }
    };

    const imagePool = useMemo(
        () => [
            "https://picsum.photos/600/400?random=111111",
            "https://picsum.photos/600/400?random=222222",
            "https://picsum.photos/600/400?random=333333",
            "https://picsum.photos/600/400?random=444444",
            "https://picsum.photos/600/400?random=555555",
            "https://picsum.photos/600/400?random=666666",
            "https://picsum.photos/600/400?random=777777",
            "https://picsum.photos/600/400?random=888888",
            "https://picsum.photos/600/400?random=999999",
        ],
        []
    );

    const roundTime = (mode) => (mode === "easy" ? 15 : 7);

    const setupRound = (mode, newStage) => {
        const imgs = pick3Unique(imagePool);
        setRoundImages(imgs);
        setAiImageIndex(Math.floor(Math.random() * 3));
        setSelectedImage(null);
        setTimeLeft(roundTime(mode));
        setStage(newStage);
        setScreen("game");
    };

    // Mod seçince isim ekranına git
    const startGame = (mode) => {
        setGameMode(mode);
        setNameInput("");
        setScreen("name");
    };

    // İsim onayla ve oyunu başlat
    const confirmNameAndStart = () => {
        const name = nameInput.trim();
        if (!name) return;

        setPlayerName(name);
        setScore(0);
        setupRound(gameMode, 1);
    };

    // TIMER
    useEffect(() => {
        if (screen !== "game" && screen !== "secondChance") return;

        if (timeLeft <= 0) {
            setScreen("lose");
            return;
        }

        const t = setTimeout(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearTimeout(t);
    }, [timeLeft, screen]);

    const handleCorrect = (points) => {
        setScore((prev) => prev + points);

        if (stage < 3) {
            setupRound(gameMode, stage + 1);
        } else {
            setScreen("win");
        }
    };

    const chooseFirst = (index) => {
        if (index === aiImageIndex) {
            handleCorrect(20);
        } else {
            setSelectedImage(index);
            setScreen(gameMode === "hard" ? "secondChance" : "hint");
        }
    };

    const chooseSecond = (index) => {
        if (index === aiImageIndex) {
            handleCorrect(10);
        } else {
            setScreen("lose");
        }
    };

    // WIN olunca leaderboard kaydet
    useEffect(() => {
        if (screen !== "win") return;

        const entry = {
            name: playerName || "Oyuncu",
            score,
            date: new Date().toISOString(),
        };

        const newScores = [...scores, entry]
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);

        setScores(newScores);
        localStorage.setItem("scores_v2", JSON.stringify(newScores));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [screen]);

    return (
        <div className="app">
            <div className="card">
                <header className="header">
                    <h1 className="title">AI Image Game</h1>
                    <div className="meta">
                        <span className="badge">Skor: {score}</span>

                        {(screen === "game" || screen === "secondChance") && (
                            <span className={`badge ${timeLeft <= 3 ? "danger" : ""}`}>
                Kalan Süre: {timeLeft}
              </span>
                        )}

                        {(screen === "game" || screen === "hint" || screen === "secondChance") && (
                            <span className="badge">Aşama: {stage}/3</span>
                        )}
                    </div>
                </header>

                {/* İSİM EKRANI */}
                {screen === "name" && (
                    <>
                        <h2 className="sectionTitle">Oyuncu Adı</h2>
                        <p className="muted">Oyuna başlamak için adını gir.</p>

                        <div className="nameBox">
                            <input
                                className="nameInput"
                                type="text"
                                placeholder="Örn: Arda"
                                value={nameInput}
                                onChange={(e) => setNameInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") confirmNameAndStart();
                                }}
                                autoFocus
                            />
                            <button
                                className="btn primary"
                                onClick={confirmNameAndStart}
                                disabled={!nameInput.trim()}
                            >
                                Başla
                            </button>
                        </div>

                        <div className="actions" style={{ marginTop: 14 }}>
                            <button className="btn" onClick={() => setScreen("modeSelect")}>
                                Geri
                            </button>
                        </div>
                    </>
                )}

                {/* MOD SEÇİMİ */}
                {screen === "modeSelect" && (
                    <>
                        <p className="subtitle">Oyun modu seç</p>

                        <div className="actions">
                            <button className="btn primary" onClick={() => startGame("easy")}>
                                Kolay
                            </button>
                            <button className="btn" onClick={() => startGame("hard")}>
                                Zor
                            </button>
                            <button className="btn" onClick={resetLeaderboard}>
                                Skor Tablosunu Sıfırla
                            </button>
                        </div>

                        <div className="section">
                            <h2 className="sectionTitle">🏆 En İyi Skorlar</h2>
                            {scores.length === 0 ? (
                                <p className="muted">Henüz skor yok. İlk oyunu başlat 🙂</p>
                            ) : (
                                <ol className="leaderboard">
                                    {scores.map((item, i) => (
                                        <li key={i} className="leaderItem">
                                            <span>{item.name}    </span>
                                            <strong>{item.score}</strong>
                                        </li>
                                    ))}
                                </ol>
                            )}
                        </div>
                    </>
                )}

                {/* OYUN */}
                {screen === "game" && (
                    <>
                        <h2 className="sectionTitle">Hangisi AI?</h2>
                        <div className="grid">
                            {roundImages.map((img, i) => (
                                <button key={i} className="imgBtn" onClick={() => chooseFirst(i)}>
                                    <img src={img} alt={`Görsel ${i + 1}`} className="img" />
                                    <span className="imgLabel">{i + 1}</span>
                                </button>
                            ))}
                        </div>
                        <p className="muted">AI olduğunu düşündüğün görsele tıkla.</p>
                    </>
                )}

                {/* İPUCU */}
                {screen === "hint" && (
                    <>
                        <h2 className="sectionTitle">İpucu</h2>
                        <p className="hintBox">Kenar detaylarına ve tekrar eden desenlere dikkat et.</p>
                        <div className="actions">
                            <button className="btn primary" onClick={() => setScreen("secondChance")}>
                                İkinci Hakka Geç
                            </button>
                        </div>
                    </>
                )}

                {/* İKİNCİ ŞANS */}
                {screen === "secondChance" && (
                    <>
                        <h2 className="sectionTitle">İkinci Hak</h2>
                        <div className="grid">
                            {roundImages.map(
                                (img, i) =>
                                    i !== selectedImage && (
                                        <button key={i} className="imgBtn" onClick={() => chooseSecond(i)}>
                                            <img src={img} alt={`Görsel ${i + 1}`} className="img" />
                                            <span className="imgLabel">{i + 1}</span>
                                        </button>
                                    )
                            )}
                        </div>
                        <p className="muted">Kalan iki görselden birini seç.</p>
                    </>
                )}

                {/* KAYBETTİN */}
                {screen === "lose" && (
                    <>
                        <h2 className="sectionTitle">Kaybettin 😢</h2>
                        <p className="muted">
                            {timeLeft <= 0 ? "Süre doldu." : "Yanlış seçim yaptın."} Ulaştığın aşama:{" "}
                            <strong>{stage}/3</strong>
                        </p>
                        <div className="actions">
                            <button className="btn primary" onClick={() => setScreen("modeSelect")}>
                                Başa Dön
                            </button>
                        </div>
                    </>
                )}

                {/* KAZANDIN */}
                {screen === "win" && (
                    <>
                        <h2 className="sectionTitle">Kazandın! 🎉</h2>
                        <p className="muted">
                            3 aşamayı da geçtin. Toplam skorun: <strong>{score}</strong>
                        </p>
                        <div className="actions">
                            <button className="btn primary" onClick={() => setScreen("modeSelect")}>
                                Yeni Oyun
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default App;
