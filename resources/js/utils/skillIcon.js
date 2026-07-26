import * as SiIcons from 'react-icons/si';
import * as DiIcons from 'react-icons/di';
import * as FaIcons from 'react-icons/fa';
import * as SimpleIconsData from 'simple-icons';

// Icon sets checked in order. Si covers most modern tools, Di and Fa
// fill gaps Si omits on purpose, like Java.
const ICON_SETS = [
    { prefix: 'Si', icons: SiIcons },
    { prefix: 'Di', icons: DiIcons },
    { prefix: 'Fa', icons: FaIcons },
];

// Builds an icon export key from a raw name, e.g. "Fast API" -> "SiFastapi".
function buildKey(raw, prefix) {
    const cleaned = raw?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    if (!cleaned) return null;
    return prefix + cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

// Tries each icon set in order, first match wins.
export function lookupIcon(raw) {
    for (const { prefix, icons } of ICON_SETS) {
        const key = buildKey(raw, prefix);
        if (key && icons[key]) return icons[key];
    }
    return null;
}

// Official brand color only exists in the Simple Icons data set.
export function lookupColor(raw) {
    const key = buildKey(raw, 'si');
    return key && SimpleIconsData[key] ? `#${SimpleIconsData[key].hex}` : null;
}

// Prefers an admin override name, falls back to the skill name itself.
export function getSkillIcon(skill) {
    return lookupIcon(skill.icon_name) || lookupIcon(skill.name);
}

export function getSkillColor(skill) {
    return lookupColor(skill.icon_name) || lookupColor(skill.name);
}