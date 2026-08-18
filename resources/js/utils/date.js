export function calculateExperienceLabel(experiences) {
    if (!experiences || experiences.length === 0) return null;

    const totalMonths = experiences.reduce((sum, exp) => {
        if (!exp.start_date) return sum;
        const start = new Date(exp.start_date);
        const end = exp.end_date ? new Date(exp.end_date) : new Date();
        const months = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30.44);
        return sum + Math.max(0, months);
    }, 0);

    const roundedMonths = Math.max(1, Math.round(totalMonths));

    if (roundedMonths < 12) {
        return `${roundedMonths} Month${roundedMonths > 1 ? 's' : ''} Experience`;
    }

    const years = Math.round(roundedMonths / 12);
    return `${years}+ Year${years > 1 ? 's' : ''} Experience`;
}
