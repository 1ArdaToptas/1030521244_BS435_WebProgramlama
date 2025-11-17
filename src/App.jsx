import { useState } from "react";

function App() {
    const [screen, setScreen] = useState("start"); // start, game, hint, secondChance, result
    const [aiImageIndex, setAiImageIndex] = useState(0);
    const [selectedImage, setSelectedImage] = useState(null);
    const [firstTryWrong, setFirstTryWrong] = useState(false);

    // 3 görsel (rastgele)
    const images = [
        "https://picsum.photos/300/300?random=11",
        "https://picsum.photos/300/300?random=22",
        "https://picsum.photos/300/300?random=33"
    ];

    // AI'nın hangi görseli ürettiğini rastgele ata
    const startGame = () => {
        const randomIndex = Math.floor(Math.random() * 3);
        setAiImageIndex(randomIndex);
        setSelectedImage(null);
        setFirstTryWrong(false);
        setScreen("game");
    };

    // İlk seçim
    const chooseFirst = (index) => {
        if (index === aiImageIndex) {
            // Doğruysa direkt sonuç ekranı
            setSelectedImage(index);
            setScreen("result");
        } else {
            // Yanlışsa ipucu verilecek
            setFirstTryWrong(true);
            setSelectedImage(index);
            setScreen("hint");
        }
    };

    // İkinci seçim
    const chooseSecond = (index) => {
        setSelectedImage(index);
        setScreen("result");
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            {/* ---------------- BAŞLANGIÇ EKRANI ---------------- */}
            {screen === "start" && (
                <>
                    <h1>AI Image Game</h1>
                    <p>3 fotoğraftan hangisinin AI tarafından üretildiğini bul!</p>
                    <button onClick={startGame}>Başla</button>
                </>
            )}

            {/* ---------------- İLK TAHMİN EKRANI ---------------- */}
            {screen === "game" && (
                <>
                    <h2>Hangisi Yapay Zeka Üretimi?</h2>
                    <p>3 görselden birini seç.</p>

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

            {/* ---------------- İPUCU EKRANI ---------------- */}
            {screen === "hint" && (
                <>
                    <h2>Yanlış seçim!</h2>
                    <p>İpucu: Arka plan detaylarına dikkat et, AI genelde kusur bırakır.</p>

                    <button onClick={() => setScreen("secondChance")}>
                        Tekrar Seçim Yap
                    </button>
                </>
            )}

            {/* ---------------- İKİNCİ ŞANS SEÇİMİ ---------------- */}
            {screen === "secondChance" && (
                <>
                    <h2>İkinci Şans!</h2>
                    <p>Kalan 2 görselden birini seç.</p>

                    <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
                        {images.map((img, index) => (
                            // İlk seçilen fotoğraf tekrar seçilmesin
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

            {/* ---------------- SONUÇ EKRANI ---------------- */}
            {screen === "result" && (
                <>
                    <h2>Sonuç</h2>

                    {selectedImage === aiImageIndex ? (
                        <p style={{ color: "green", fontSize: "20px" }}>
                            ✔ Doğru bildin! Yapay Zeka görselini seçtin.
                        </p>
                    ) : (
                        <p style={{ color: "red", fontSize: "20px" }}>
                            ✘ Yanlış seçim! Doğru görsel {aiImageIndex + 1}. sıradaydı.
                        </p>
                    )}

                    <button onClick={() => setScreen("start")}>Yeni Oyun</button>
                </>
            )}
        </div>
    );
}

export default App;
