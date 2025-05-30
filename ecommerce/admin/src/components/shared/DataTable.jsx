import React from 'react';

const DataTable = ({ 
  columns, 
  data, 
  onEdit, 
  onDelete,
  emptyMessage = "No data available" 
}) => {
  return (
    <div className="overflow-x-auto">
      {data.length === 0 ? (
        <p className="text-gray-500 py-4">{emptyMessage}</p>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-amber-50">
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.key} 
                  className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
              <th className="px-6 py-3 text-right text-xs font-medium text-amber-800 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item.id}>
                {columns.map((column) => (
                  <td key={`${item.id}-${column.key}`} className="px-6 py-4 whitespace-nowrap">
                    {column.render ? column.render(item) : item[column.key]}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(item)}
                    className="text-amber-600 hover:text-amber-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(item)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DataTable;
