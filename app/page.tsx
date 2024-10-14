'use client';
import { useState } from 'react';
import CsvTable from './components/CsvTableComponent';

const Home = () => {
    const [jsonInput, setJsonInput] = useState('');
    const [csvOutput, setCsvOutput] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [separator, setSeparator] = useState(',');

    // Função para transformar um objeto JSON em um objeto plano
    const flattenObject = (obj: any, prefix = '', res = {} as any) => {
        for (let key in obj) {
            const propName = prefix ? `${prefix}.${key}` : key;
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                flattenObject(obj[key], propName, res);
            } else {
                res[propName] = obj[key];
            }
        }
        return res;
    };

    // Função para converter JSON para CSV
    const convertJsonToCsv = (json: string) => {
        try {
            const parsedJson = JSON.parse(json);
            
            if (Array.isArray(parsedJson)) {
                generatecsv(parsedJson);
            }else{
                for (let i = 0; i < Object.keys(parsedJson).length; i++) 
                {
                    let array = parsedJson[Object.keys(parsedJson)[i]];
                   
                    generatecsv(array); //TODO ponto de fragilidade, verificar uma forma de objetos que não são arrays serem convertidos
                }
            }

            
        } catch (error) {
            setErrorMessage('JSON inválido.');
        }
    };

    const generatecsv = (array:any) => {
        const flattenedArray = array.map((item:any) => flattenObject(item));
        const keys = Object.keys(flattenedArray[0]);
        const csvRows = [keys.join(separator)];

        for (const obj of flattenedArray) {
            const values = keys.map(key => `"${obj[key] || ''}"`);
            csvRows.push(values.join(separator));
        }

        setCsvOutput(csvRows.join('\n'));
        setErrorMessage('');

    };

    // Função para baixar o arquivo CSV
    const downloadCsv = () => {
        if (!csvOutput) {
            setErrorMessage('Não há CSV gerado para download.');
            return;
        }

        const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.href = url;
        link.setAttribute('download', 'resultado.csv');
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // Função para limpar os campos
    const clearFields = () => {
        setJsonInput('');
        setCsvOutput('');
        setErrorMessage('');
    };

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark', !isDarkMode);
    };

    return (
        <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
            <button
                onClick={toggleTheme}
                className="mb-4 p-2 rounded-md bg-blue-500 text-white dark:bg-blue-700"
            >
                Alternar Tema
            </button>
            <h1 className="text-2xl font-bold mb-4">JSON para CSV</h1>
            <textarea
                placeholder="Cole o JSON aqui"
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="w-full p-3 mb-4 border rounded-md h-14 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
            <div className="mb-4">
                <label className="mr-2">Escolha o separador:</label>
                <select
                    value={separator}
                    onChange={(e) => setSeparator(e.target.value)}
                    className="p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                    <option value=",">Vírgula (,)</option>
                    <option value=";">Ponto e vírgula (;)</option>
                    <option value="\t">Tabulação (Tab)</option>
                </select>
            </div>
            <div className="flex space-x-2 mb-4">
                <button
                    onClick={() => convertJsonToCsv(jsonInput)}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 dark:bg-green-700"
                >
                    Converter
                </button>
                <button
                    onClick={clearFields}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 dark:bg-yellow-700"
                >
                    Limpar
                </button>
                <button
                    onClick={downloadCsv}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 dark:bg-blue-700"
                >
                    Baixar CSV
                </button>
            </div>
            {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
            <h2 className="text-xl font-semibold mb-2">CSV</h2>
            <textarea
                placeholder="CSV convertido"
                value={csvOutput}
                readOnly
                className="w-full h-14 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
            <h2 className="text-xl font-semibold mt-6 mb-2">Tabela JSON</h2>
            <CsvTable csvData={csvOutput} separator={separator} />  {/*TODO ponto de melhoria estetica, a tabela pode ultrapassar os limites horizontais da tela */}
        </div>
    );
};

export default Home;

