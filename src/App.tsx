import { useEffect, useState } from "react";
import { lang, type AllData, type LangsJson } from "./components/Utils/Defines";
import { ImageLoader } from "./components/Utils/ImageLoader";
import { ItemLoader } from "./components/Utils/ItemLoader";
import { LanguageLoader } from "./components/Utils/LanguageLoader";
import { Reactor } from "./components/Utils/Reactor";
import type { ReactorItem } from "./components/Utils/ReactorItem";
import { FuelRod } from "./components/Utils/ReactorItems/FuelRod";
import { GGFuelRod } from "./components/Utils/ReactorItems/GGFuelRod";
import { Reflector } from "./components/Utils/ReactorItems/Reflector";
import ReactorCode from "./parts/ReactorCode";
import ReactorGrid from "./parts/ReactorGrid";
import ReactorSide from "./parts/ReactorSide";
import ReactorStats from "./parts/ReactorStats";

function App() {
    const [reactor, setReactor] = useState<Reactor>(new Reactor());
    const [simulateReactor, setSimulateReactor] = useState<Reactor | null>(
        null,
    );
    const [selectedItem, setSelectedItem] = useState<ReactorItem | null>(null);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [version, setVersion] = useState<{
        mcVersion: string;
        gtVersion: string;
    }>({
        mcVersion: localStorage.getItem("mcVersion") || "1.7.10",
        gtVersion: localStorage.getItem("gtVersion") || "-",
    });
    const [selectedRowAndCol, setSelectedRowAndCol] = useState<{
        row: number;
        col: number;
    }>({ row: 0, col: 0 });
    const [outputLines, setOutputLines] = useState<string[]>([]);

    const languageState =
        localStorage.getItem("lang") === "zh_cn" ||
        (localStorage.getItem("lang") == null &&
            navigator.language.includes("zh"))
            ? lang.zh
            : lang.en;

    const toggleLanguage = () => {
        const next = languageState === lang.zh ? lang.en : lang.zh;
        localStorage.setItem("lang", next.toString());
        location.reload();
    };

    useEffect(() => {
        const loadData = async () => {
            const langsRes = await fetch("./data/langs.json");
            const langsData: LangsJson = await langsRes.json();
            LanguageLoader.initLanguageLoader(langsData, languageState);

            const allRes = await fetch("./data/all_data.json");
            const allData: AllData = await allRes.json();
            ImageLoader.initImages(allData.image);
            ItemLoader.initItems(allData.items);
            setIsLoaded(true);
        };

        switch (version.gtVersion) {
            case "5.08": {
                FuelRod.setGT509Behavior(false);
                FuelRod.setGTNHBehavior(false);
                GGFuelRod.setGTNHBehavior(false);
                break;
            }
            case "5.09": {
                FuelRod.setGT509Behavior(true);
                FuelRod.setGTNHBehavior(false);
                GGFuelRod.setGTNHBehavior(false);
                break;
            }
            case "GTNH": {
                FuelRod.setGT509Behavior(false);
                FuelRod.setGTNHBehavior(true);
                GGFuelRod.setGTNHBehavior(true);
                break;
            }
            default: {
                FuelRod.setGT509Behavior(false);
                FuelRod.setGTNHBehavior(false);
                GGFuelRod.setGTNHBehavior(false);
                break;
            }
        }
        Reflector.setMcVersion(version.mcVersion);

        loadData();
    }, [languageState, version]);

    if (!isLoaded) {
        return <div>加载中...</div>;
    } else {
        return (
            <>
                <div className="MainBody">
                    <div className="ReactorGridCodeStats">
                        <div className="ReactorGrid">
                            <ReactorGrid
                                reactor={reactor}
                                onReactorChange={setReactor}
                                selectedItem={selectedItem}
                                setSelectedRowAndCol={setSelectedRowAndCol}
                                simulateReactor={simulateReactor}
                            />
                            <svg
                                id="changeLang"
                                data-slot="icon"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden={true}
                                onClick={toggleLanguage}
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802"
                                ></path>
                            </svg>
                        </div>
                        <div className="ReactorCode">
                            <ReactorCode
                                reactor={reactor}
                                onReactorChange={setReactor}
                            />
                        </div>
                        <div className="ReactorStats">
                            <ReactorStats
                                reactor={reactor}
                                onReactorChange={setReactor}
                                selectedRowAndCol={selectedRowAndCol}
                                simulateReactor={simulateReactor}
                                outputLines={outputLines}
                            />
                        </div>
                    </div>
                    <div className="ReactorSide">
                        <ReactorSide
                            setSelectedItem={setSelectedItem}
                            selectedItem={selectedItem}
                            reactor={reactor}
                            setReactor={setReactor}
                            version={version}
                            setVersion={setVersion}
                            setSimulateReactor={setSimulateReactor}
                            setOutputLines={setOutputLines}
                        />
                    </div>
                </div>
            </>
        );
    }
}

export default App;
