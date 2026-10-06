export function calculateExperienceLabel(experiences) {
    if (!experiences || experiences.length === 0) return null;

    const totalMonths = experiences.reduce((sum, exp) => {
        if (!exp.start_date) return sum;
        const start = new Date(exp.start_date);
        if (isNaN(start.getTime())) return sum;
        const end = exp.end_date ? new Date(exp.end_date) : new Date();
        if (isNaN(end.getTime())) return sum;
        const months = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30.44);
        return sum + Math.max(0, months);
    }, 0);

    if (isNaN(totalMonths) || totalMonths <= 0) return null;

    const roundedMonths = Math.max(1, Math.round(totalMonths));

    if (roundedMonths < 12) {
        return `${roundedMonths} Month${roundedMonths > 1 ? 's' : ''} Experience`;
    }

    const years = Math.round(roundedMonths / 12);
    return `${years}+ Year${years > 1 ? 's' : ''} Experience`;
}

export function formatMonthYear(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
}

export function formatProjectRange(project) {
    if (!project) return '';
    const start = formatMonthYear(project.start_date);
    const end = project.end_date ? formatMonthYear(project.end_date) : 'Present';
    if (!start && !project.end_date) return '';
    if (!start) return end;
    return `${start} - ${end}`;
}

export function formatDateISO(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
}

export function formatDateShort(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
