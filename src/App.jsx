import { useState, useEffect } from "react";

function App() {
    const [screen, setScreen] = useState("modeSelect");
    const [gameMode, setGameMode] = useState(null);
    const [aiImageIndex, setAiImageIndex] = useState(0);
    const [selectedImage, setSelectedImage] = useState(null);
    const [score, setScore] = useState(0);

    // ⏱️ TIMER STATE
    const [timeLeft, setTimeLeft] = useState(0);

    const images = [
        "https://picsum.photos/300/300?random=11111",
        "https://picsum.photos/300/300?random=22222",
        "https://picsum.photos/300/300?random=33333"
    ];

    // TIMER ÇALIŞTIRICI
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
        const randomIndex = Math.floor(Math.random() * 3);
        setAiImageIndex(randomIndex);
        setSelectedImage(null);

        // ⏱️ Süreyi moda göre ayarla
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
            if (gameMode === "hard") {
                setScreen("secondChance");
            } else {
                setScreen("hint");
            }
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

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            {/* SCORE */}
            <h3>Skor: {score}</h3>

            {/* TIMER */}
            {(screen === "game" || screen === "secondChance") && (
                <h3 style={{ color: timeLeft <= 3 ? "red" : "black" }}>
                    Kalan Süre: {timeLeft}
                </h3>
            )}

            {/* MOD SEÇİMİ */}
            {screen === "modeSelect" && (
                <>
                    <h1>AI Image Game</h1>
                    <p>Oyun Modu Seç</p>
                    <button onClick={() => startGame("easy")} style={{ marginRight: 15 }}>
                        Kolay (15 sn)
                    </button>
                    <button onClick={() => startGame("hard")}>
                        Zor (7 sn)
                    </button>
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
                    <h3>Yanlış Seçim!</h3>
                    <p>İpucu: Kenarlardaki detaylara dikkat et.</p>
                    <button onClick={() => setScreen("secondChance")}>
                        İkinci Şans
                    </button>
                </>
            )}

            {/* İKİNCİ ŞANS */}
            {screen === "secondChance" && (
                <>
                    <h2>İkinci Hakkın</h2>
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
                    <h2>Sonuç</h2>
                    {timeLeft === 0 && (
                        <p style={{ color: "red" }}>⏱️ Süre doldu!</p>
                    )}
                    {selectedImage === aiImageIndex ? (
                        <p style={{ color: "green" }}>✔ Doğru Seçim</p>
                    ) : (
                        <p style={{ color: "red" }}>
                            ✘ Yanlış! Doğru: {aiImageIndex + 1}. görsel
                        </p>
                    )}
                    <button onClick={() => setScreen("modeSelect")}>
                        Yeni Oyun
                    </button>
                </>
            )}
        </div>
    );
}

export default App;
