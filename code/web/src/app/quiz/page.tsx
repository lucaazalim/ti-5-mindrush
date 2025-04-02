import QRCodePage from "./QRCodePage";

export default function Page() {

    // Pin
    const pin = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');

    const listDeJadores = []

    const isPlayer = listDeJadores.length > 0;

    const withPlayer = listDeJadores.length;
    const withoutPlayer = <h2 className="text-white w-96 mt-4 bg-purple-500 border-2xl rounded-lg p-4 mt-4 text-center">
        Aguardando jogadores...
    </h2>;

    return (
        <div className="flex flex-col items-center justify-center w-full h-screen">
            {/* Pin e qrcode */}
            <div className="flex justify-center w-full gap-4">
                <div className="bg-white rounded-lg py-2 px-16 flex flex-col items-start justify-center">
                    <h1 className="">PIN do Jogo</h1>
                    <h2 className="font-bold text-5xl">{pin}</h2>
                </div>
                <div className="max-w-96 ">
                    <QRCodePage text={pin} />
                </div>

            </div>

            <div>
                { isPlayer ? withPlayer : withoutPlayer }
            </div>
        </div>
    )
}