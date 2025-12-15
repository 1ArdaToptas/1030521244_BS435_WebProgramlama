import { useState, useEffect } from "react";

function App() {
    const [screen, setScreen] = useState("modeSelect");
    const [gameMode, setGameMode] = useState(null);
    const [aiImageIndex, setAiImageIndex] = useState(0);
    const [selectedImage, setSelectedImage] = useState(null);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);

    // 🏆 Leaderboard
    const [scores, setScores] = useState(
        JSON.parse(localStorage.getItem("scores")) || []
    );

    const images = [
        "https://picsum.photos/300/300?random=111111",
        "https://picsum.photos/300/300?random=222222",
        "https://picsum.photos/300/300?random=333333"
    ];

    // TIMER
    useEffect(() => {
        if (screen !== "game" && screen !== "secondChance") return;
        if (timeLeft === 0) {
            setScreen("result");
            return;
        }

        const timer = setTimeout(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [timeLeft, screen]);

    // OYUN BAŞLAT
    const startGame = (mode) => {
        setGameMode(mode);
        setAiImageIndex(Math.floor(Math.random() * 3));
        setSelectedImage(null);
        setTimeLeft(mode === "easy" ? 15 : 7);
        setScreen("game");
    };

    // İLK SEÇİM
    const chooseFirst = (index) => {
        if (index === aiImageIndex) {
            setScore(score + 20);
            setSelectedImage(index);
            setScreen("result");
        } else {
            setSelectedImage(index);
            setScreen(gameMode === "hard" ? "secondChance" : "hint");
        }
    };

    // İKİNCİ SEÇİM
    const chooseSecond = (index) => {
        if (index === aiImageIndex) {
            setScore(score + 10);
        }
        setSelectedImage(index);
        setScreen("result");
    };

    // 🏆 Skoru kaydet
    useEffect(() => {
        if (screen === "result") {
            const newScores = [...scores, score]
                .sort((a, b) => b - a)
                .slice(0, 5);

            setScores(newScores);
            localStorage.setItem("scores", JSON.stringify(newScores));
        }
    }, [screen]);

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h3>Skor: {score}</h3>

            {(screen === "game" || screen === "secondChance") && (
                <h3>Kalan Süre: {timeLeft}</h3>
            )}

            {/* MOD SEÇİMİ */}
            {screen === "modeSelect" && (
                <>
                    <h1>AI Image Game</h1>
                    <button onClick={() => startGame("easy")}>Kolay</button>
                    <button onClick={() => startGame("hard")} style={{ marginLeft: 10 }}>
                        Zor
                    </button>

                    {/* 🏆 Leaderboard */}
                    <h2>🏆 En İyi Skorlar</h2>
                    <ol>
                        {scores.map((s, i) => (
                            <li key={i}>{s}</li>
                        ))}
                    </ol>
                </>
            )}

            {/* OYUN */}
            {screen === "game" && (
                <>
                    <h2>Hangisi AI?</h2>
                    <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
                        {images.map((img, i) => (
                            <img
                                key={i}
                                src={img}
                                width={200}
                                height={200}
                                style={{ cursor: "pointer", border: "2px solid black" }}
                                onClick={() => chooseFirst(i)}
                            />
                        ))}
                    </div>
                </>
            )}

            {/* İPUCU */}
            {screen === "hint" && (
                <>
                    <p>İpucu: Kenar detaylarına dikkat et.</p>
                    <button onClick={() => setScreen("secondChance")}>Devam</button>
                </>
            )}

            {/* İKİNCİ ŞANS */}
            {screen === "secondChance" && (
                <>
                    <h2>İkinci Hak</h2>
                    <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
                        {images.map(
                            (img, i) =>
                                i !== selectedImage && (
                                    <img
                                        key={i}
                                        src={img}
                                        width={200}
                                        height={200}
                                        style={{ cursor: "pointer", border: "2px solid black" }}
                                        onClick={() => chooseSecond(i)}
                                    />
                                )
                        )}
                    </div>
                </>
            )}

            {/* SONUÇ */}
            {screen === "result" && (
                <>
                    <h2>Oyun Bitti</h2>
                    <p>Doğru görsel: {aiImageIndex + 1}</p>
                    <button onClick={() => setScreen("modeSelect")}>Yeni Oyun</button>
                </>
            )}
        </div>
    );
}

export default App;
