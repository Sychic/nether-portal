import { atom, computed } from "nanostores";

export type Coords = { x: number; z: number };
export const coords = atom<Coords | undefined>(undefined);

export enum Dimension {
    Overworld = "overworld",
    Nether = "the_nether"
}
export const dimension = atom<Dimension | undefined>(undefined);

export const convertedCoords = computed(
    [coords, dimension],
    ($coords, $dimension) => {
        if (!$coords || $dimension === undefined) return undefined;
        if ($dimension === Dimension.Overworld) {
            return { x: Math.floor($coords.x / 8), z: Math.floor($coords.z / 8) };
        } else {
            return { x: Math.floor($coords.x * 8), z: Math.floor($coords.z * 8) };
        }
    }
);

const TELEPORT_REGEX = /^\/execute in minecraft:(?<dimension>\w+) run tp @s (?<x>-?\d+\.?\d{2}) -?\d+\.?\d{2} (?<z>-?\d+\.?\d{2}) -?\d+\.?\d{2} -?\d+\.?\d{2}$/;

export const parseCoords = (text: string) => {
    const match = text.match(TELEPORT_REGEX);
    if (!match?.groups) return undefined;

    const { dimension, x, z } = match.groups;
    return {
        dimension: dimension as Dimension,
        coords: {
            x: Math.round(Number(x)),
            z: Math.round(Number(z))
        }
    };
}