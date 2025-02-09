import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Ruler, Weight, Thermometer, Box, Clock, HardDrive, Copy, RotateCcw } from 'lucide-react';

const UnitConverter = () => {
  const [category, setCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState([]);

  const categories = {
    length: {
      icon: Ruler,
      name: 'Lunghezza',
      units: {
        km: { name: 'Chilometri', factor: 1000 },
        m: { name: 'Metri', factor: 1 },
        cm: { name: 'Centimetri', factor: 0.01 },
        mm: { name: 'Millimetri', factor: 0.001 },
        mi: { name: 'Miglia', factor: 1609.344 },
        yd: { name: 'Iarde', factor: 0.9144 },
        ft: { name: 'Piedi', factor: 0.3048 },
        in: { name: 'Pollici', factor: 0.0254 }
      }
    },
    weight: {
      icon: Weight,
      name: 'Peso',
      units: {
        t: { name: 'Tonnellate', factor: 1000 },
        kg: { name: 'Chilogrammi', factor: 1 },
        g: { name: 'Grammi', factor: 0.001 },
        mg: { name: 'Milligrammi', factor: 0.000001 },
        lb: { name: 'Libbre', factor: 0.45359237 },
        oz: { name: 'Once', factor: 0.028349523125 }
      }
    },
    temperature: {
      icon: Thermometer,
      name: 'Temperatura',
      units: {
        c: { name: 'Celsius' },
        f: { name: 'Fahrenheit' },
        k: { name: 'Kelvin' }
      }
    },
    volume: {
      icon: Box,
      name: 'Volume',
      units: {
        l: { name: 'Litri', factor: 1 },
        ml: { name: 'Millilitri', factor: 0.001 },
        m3: { name: 'Metri cubi', factor: 1000 },
        gal: { name: 'Galloni (US)', factor: 3.78541 },
        qt: { name: 'Quarti (US)', factor: 0.946353 },
        pt: { name: 'Pinte (US)', factor: 0.473176 },
        cup: { name: 'Tazze (US)', factor: 0.236588 }
      }
    },
    time: {
      icon: Clock,
      name: 'Tempo',
      units: {
        s: { name: 'Secondi', factor: 1 },
        min: { name: 'Minuti', factor: 60 },
        h: { name: 'Ore', factor: 3600 },
        d: { name: 'Giorni', factor: 86400 },
        w: { name: 'Settimane', factor: 604800 },
        mo: { name: 'Mesi (30g)', factor: 2592000 },
        y: { name: 'Anni', factor: 31536000 }
      }
    },
    digital: {
      icon: HardDrive,
      name: 'Dati',
      units: {
        b: { name: 'Bytes', factor: 1 },
        kb: { name: 'Kilobytes', factor: 1024 },
        mb: { name: 'Megabytes', factor: 1048576 },
        gb: { name: 'Gigabytes', factor: 1073741824 },
        tb: { name: 'Terabytes', factor: 1099511627776 }
      }
    }
  };

  useEffect(() => {
    const categoryUnits = Object.keys(categories[category].units);
    setFromUnit(categoryUnits[0]);
    setToUnit(categoryUnits[1]);
  }, [category]);

  const convertTemperature = (value, from, to) => {
    let celsius;
    switch(from) {
      case 'c': celsius = value; break;
      case 'f': celsius = (value - 32) * 5/9; break;
      case 'k': celsius = value - 273.15; break;
    }
    switch(to) {
      case 'c': return celsius;
      case 'f': return (celsius * 9/5) + 32;
      case 'k': return celsius + 273.15;
    }
  };

  const convert = () => {
    if (!inputValue || !fromUnit || !toUnit) return;
    
    const value = parseFloat(inputValue);
    if (isNaN(value)) return;

    let convertedResult;
    if (category === 'temperature') {
      convertedResult = convertTemperature(value, fromUnit, toUnit);
    } else {
      const fromFactor = categories[category].units[fromUnit].factor;
      const toFactor = categories[category].units[toUnit].factor;
      convertedResult = (value * fromFactor) / toFactor;
    }

    const formattedResult = convertedResult.toFixed(6);
    setResult(formattedResult);

    const newHistoryItem = {
      from: `${value} ${categories[category].units[fromUnit].name}`,
      to: `${formattedResult} ${categories[category].units[toUnit].name}`,
      category: categories[category].name,
      timestamp: new Date().toLocaleTimeString()
    };
    setHistory(prev => [newHistoryItem, ...prev].slice(0, 5));
  };

  useEffect(() => {
    convert();
  }, [inputValue, fromUnit, toUnit]);

  const copyResult = async () => {
    if (result) {
      await navigator.clipboard.writeText(result);
    }
  };

  const reset = () => {
    setInputValue('');
    setResult('');
  };

  const CategoryIcon = categories[category].icon;

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="flex flex-row items-center space-x-4">
        <CategoryIcon className="w-8 h-8" />
        <CardTitle className="text-2xl">Convertitore Universale</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Griglia delle categorie */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {Object.entries(categories).map(([key, value]) => (
            <Button
              key={key}
              variant={category === key ? "default" : "outline"}
              className="flex items-center justify-center gap-2 p-3 h-auto"
              onClick={() => setCategory(key)}
            >
              <value.icon className="w-4 h-4" />
              <span className="text-sm">{value.name}</span>
            </Button>
          ))}
        </div>

        {/* Campi di conversione */}
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Da:</label>
            <div className="flex flex-col md:flex-row gap-2">
              <Input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Inserisci il valore"
                className="text-lg p-6"
              />
              <Select value={fromUnit} onValueChange={setFromUnit}>
                <SelectTrigger className="min-w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categories[category].units).map(([key, unit]) => (
                    <SelectItem key={key} value={key}>
                      {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">A:</label>
            <div className="flex flex-col md:flex-row gap-2">
              <Input
                type="text"
                value={result}
                readOnly
                className="text-lg p-6 bg-gray-50"
              />
              <Select value={toUnit} onValueChange={setToUnit}>
                <SelectTrigger className="min-w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categories[category].units).map(([key, unit]) => (
                    <SelectItem key={key} value={key}>
                      {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={copyResult} className="flex-1 p-6">
            <Copy className="w-4 h-4 mr-2" />
            Copia risultato
          </Button>
          <Button variant="outline" onClick={reset} className="flex-1 p-6">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        {history.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Cronologia Conversioni</h3>
            <div className="space-y-2">
              {history.map((item, index) => (
                <div key={index} className="text-sm bg-gray-50 p-3 rounded-md">
                  <span className="text-gray-500">{item.timestamp}</span>
                  <br />
                  <span className="font-medium">{item.category}:</span> {item.from} → {item.to}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-sm text-gray-500">
          <p>Suggerimenti:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>Usa il punto come separatore decimale</li>
            <li>Le conversioni vengono aggiornate automaticamente</li>
            <li>I risultati sono arrotondati a 6 decimali</li>
            <li>Usa il pulsante copia per copiare il risultato negli appunti</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default UnitConverter;
