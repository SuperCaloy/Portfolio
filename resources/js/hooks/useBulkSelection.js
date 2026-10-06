import { useState, useEffect } from 'react';

export function useBulkSelection(items = []) {
    const [selectedIds, setSelectedIds] = useState([]);

    useEffect(() => {
        setSelectedIds([]);
    }, [items]);

    const handleToggleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleToggleSelectAll = () => {
        const pageIds = items.map((item) => item.id);
        const allSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));
        setSelectedIds(allSelected ? [] : pageIds);
    };

    const allOnPageSelected = items.length > 0 && items.every((item) => selectedIds.includes(item.id));

    return {
        selectedIds,
        setSelectedIds,
        handleToggleSelect,
        handleToggleSelectAll,
        allOnPageSelected,
    };
}
