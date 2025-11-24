import { useState } from "react";

function App() {
    const [screen, setScreen] = useState("modeSelect");
    const [gameMode, setGameMode] = useState(null); // easy or hard
    const [aiImageIndex, setAiImageIndex] = useState(0);
    const [selectedImage, setSelectedImage] = useState(null);

    // 3 görsel
    const images = [
        "https://picsum.photos/300/300?random=111",
        "https://picsum.photos/300/300?random=222",
        "https://picsum.photos/300/300?random=333"
    ];

    // Oyunu başlat
    const startGame = (mode) => {
        setGameMode(mode);
        const randomIndex = Math.floor(Math.random() * 3);
        setAiImageIndex(randomIndex);
        setSelectedImage(null);
        setScreen("game");
    };

    // İlk seçim
    const chooseFirst = (index) => {
        if (index === aiImageIndex) {
            setSelectedImage(index);
            setScreen("result");
        } else {
            // Zor modda ipucu yok → direkt ikinci seçim ekranı
            if (gameMode === "hard") {
                setSelectedImage(index);
                setScreen("secondChance");
            } else {
                // Kolay modda ipucu göster
                setSelectedImage(index);
                setScreen("hint");
            }
        }
    };

    // İkinci seçim
    const chooseSecond = (index) => {
        setSelectedImage(index);
        setScreen("result");
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
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

                    <button onClick={() => startGame("hard")}>
                        Zor Mod (İpucusuz)
                    </button>
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
                        {images.map((img, index) => (
                            index !== selectedImage && (
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
                            )
                        ))}
                    </div>
                </>
            )}

            {/* ---------------- SONUÇ ---------------- */}
            {screen === "result" && (
                <>
                    <h2>Sonuç:</h2>

                    {selectedImage === aiImageIndex ? (
                        <p style={{ color: "green", fontSize: "20px" }}>
                            ✔ Doğru bildin!
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
