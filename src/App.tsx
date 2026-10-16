import { useEffect, useRef, useState } from "react";
import { searchPlaces, type Place } from "./lib/searchPlaces";
import Logo from "./assets/Vector.png";
import { MapPin, Calendar as CalendarIcon, ArrowRight } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import "./style/App.css";

function App() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const [destination, setDestination] = useState("");
  const [results, setResults] = useState<Place[]>([]);
  const skipSearch = useRef(false);
  useEffect(() => {
    // não busca de novo logo depois de escolher uma sugestão
    if (skipSearch.current) {
      skipSearch.current = false;
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setResults(await searchPlaces(destination, controller.signal));
      } catch (err) {
        if ((err as Error).name !== "AbortError") console.error(err);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort(); // cancela a busca anterior
    };
  }, [destination]);

  return (
    <div className="conteiner-logo">
      <img src={Logo} alt="Logo do plann.er" />
      <h3 className="sub-title">
        Convide seus amigos e planeje sua próxima viagem!
      </h3>

      <div className="content">
        <div className="where-wrapper"> 
          <MapPin
            size={22}
            className="icon "
            style={{ color: "var(--color-text-secondary)" }}
          />
          <input
            className="where-to-go"
            type="text"
            placeholder="Para onde você vai?"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />

          {results.length > 0 && (
            <ul className="suggestions">
              {results.map((place, i) => (
                <li
                  key={i}
                  onClick={() => {
                    setDestination(`${place.name}, ${place.country}`);
                    setResults([]);
                  }}
                >
                  {place.name}
                  {place.state && `, ${place.state}`} - {place.country}
                </li>
              ))}
            </ul>
          )}
        </div>

         <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-lg border"
  />
        {/* <CalendarIcon
          size={20}
          className="icon"
          style={{ color: "var(--color-text-secondary)" }}
        />
        <input
          className="where-input"
          placeholder="Quando?"
          type="text"
          onFocus={(event) => {
            event.currentTarget.type = "date";
          }}
          onBlur={(event) => {
            event.currentTarget.type = "text";
          }}
          id="date"
        /> */}

        <button className="button-continuar">
          Continuar
          <ArrowRight size={20} className="icon-arrow" />
        </button>
      </div>
    </div>
  );
}

export default App;
