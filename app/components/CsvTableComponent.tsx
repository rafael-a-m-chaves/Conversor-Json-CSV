import React from 'react';

interface CsvTableProps {
    csvData: string;
    separator: string;
}

const CsvTable = ({ csvData, separator }: CsvTableProps) => {
    if (!csvData) {
        return <p className="text-gray-500 dark:text-gray-400">Nenhum JSON fornecido.</p>;
    }

    // Função para converter CSV para um array de linhas e colunas
    const parseCsv = (csv: string) => {
        const rows = csv.split('\n').map(row => row.split(separator));
        return rows;
    };

    const csvRows = parseCsv(csvData);

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-200 dark:border-gray-700">
                <thead className="bg-gray-100 dark:bg-gray-800">
                    <tr>
                        {csvRows[0].map((header, index) => (
                            <th
                                key={index}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-left font-medium text-gray-900 dark:text-gray-100"
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {csvRows.slice(1).map((row, rowIndex) => (
                        <tr key={rowIndex} className={`${rowIndex % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}`}>
                            {row.map((cell, cellIndex) => (
                                <td
                                    key={cellIndex}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                                >
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CsvTable;
