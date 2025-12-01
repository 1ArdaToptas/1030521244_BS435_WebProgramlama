import { useState } from "react";

function App() {
    const [screen, setScreen] = useState("modeSelect");
    const [gameMode, setGameMode] = useState(null);
    const [aiImageIndex, setAiImageIndex] = useState(0);
    const [selectedImage, setSelectedImage] = useState(null);
    const [score, setScore] = useState(0); // ⭐ 5. Hafta: Puan sistemi

    const images = [
        "https://picsum.photos/300/300?random=1111",
        "https://picsum.photos/300/300?random=2222",
        "https://picsum.photos/300/300?random=3333"
    ];

    const startGame = (mode) => {
        setGameMode(mode);
        const randomIndex = Math.floor(Math.random() * 3);
        setAiImageIndex(randomIndex);
        setSelectedImage(null);
        setScreen("game");
    };

    const chooseFirst = (index) => {
        if (index === aiImageIndex) {
            // İlk tahminde doğru → +10 (doğru) +10 (bonus)
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

    const chooseSecond = (index) => {
        if (index === aiImageIndex) {
            // İkinci tahminde doğru → +10 puan
            setScore(score + 10);
        }
        setSelectedImage(index);
        setScreen("result");
    };

    const resetScore = () => {
        setScore(0);
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            {/* PUAN GÖSTERGESİ */}
            <div style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "20px" }}>
                Skor: {score}
            </div>

            {/* SKOR SIFIRLAMA */}
            <button onClick={resetScore} style={{ marginBottom: "20px" }}>
                Skoru Sıfırla
            </button>

            {/* ---------------- MOD SEÇİMİ ---------------- */}
            {screen === "modeSelect" && (
                <>
                    <h1>AI Image Game</h1>
                    <h3>Bir oyun modu seç:</h3>

                    <button
                        onClick={() => startGame("easy")}
                        style={{ marginRight: "20px" }}
                    >
                        Kolay Mod (İpuculu)
                    </button>

                    <button onClick={() => startGame("hard")}>Zor Mod (İpucusuz)</button>
                </>
            )}

            {/* ---------------- OYUN EKRANI ---------------- */}
            {screen === "game" && (
                <>
                    <h2>Hangisi AI?</h2>
                    <p>Mod: {gameMode === "easy" ? "Kolay" : "Zor"}</p>

                    <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
                        {images.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                style={{
                                    width: "200px",
                                    height: "200px",
                                    border: "2px solid #333",
                                    cursor: "pointer",
                                }}
                                onClick={() => chooseFirst(index)}
                            />
                        ))}
                    </div>
                </>
            )}

            {/* ---------------- İPUCU ---------------- */}
            {screen === "hint" && (
                <>
                    <h2>Yanlış seçim!</h2>
                    <p>İpucu: Arka planda gölgeler ve detaylara dikkat et.</p>

                    <button onClick={() => setScreen("secondChance")}>
                        Tekrar Dene
                    </button>
                </>
            )}

            {/* ---------------- İKİNCİ SEÇİM ---------------- */}
            {screen === "secondChance" && (
                <>
                    <h2>İkinci hakkın!</h2>

                    <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
                        {images.map((img, index) =>
                            index !== selectedImage ? (
                                <img
                                    key={index}
                                    src={img}
                                    style={{
                                        width: "200px",
                                        height: "200px",
                                        border: "2px solid #333",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => chooseSecond(index)}
                                />
                            ) : null
                        )}
                    </div>
                </>
            )}

            {/* ---------------- SONUÇ ---------------- */}
            {screen === "result" && (
                <>
                    <h2>Sonuç:</h2>

                    {selectedImage === aiImageIndex ? (
                        <p style={{ color: "green", fontSize: "20px" }}>
                            ✔ Doğru bildin! (+10 / +20)
                        </p>
                    ) : (
                        <p style={{ color: "red", fontSize: "20px" }}>
                            ✘ Yanlış bildin! Doğru cevap {aiImageIndex + 1}. görseldi.
                        </p>
                    )}

                    <button onClick={() => setScreen("modeSelect")}>Başa Dön</button>
                </>
            )}
        </div>
    );
}

export default App;
