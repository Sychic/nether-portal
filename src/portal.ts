import { atom, computed } from "nanostores";

export type Coord = { value: number, dimension: Dimension }
export const xCoord = atom<Coord | undefined>(undefined);
export const zCoord = atom<Coord | undefined>(undefined);

export enum Dimension {
    Overworld = "overworld",
    Nether = "the_nether"
}

export const convertedXCoord = computed(
    [xCoord],
    ($xCoord) => {
        if (!$xCoord) return undefined;
        if ($xCoord.dimension === Dimension.Overworld) {
            return Math.floor($xCoord.value / 8);
        } else {
            return Math.floor($xCoord.value * 8);
        }
    }
)

export const convertedZCoord = computed(
    [zCoord],
    ($zCoord) => {
        if (!$zCoord) return undefined;
        if ($zCoord.dimension === Dimension.Overworld) {
            return Math.floor($zCoord.value / 8);
        } else {
            return Math.floor($zCoord.value * 8);
        }
    }
)

export const TELEPORT_REGEX = /^\/execute in minecraft:(?<dimension>\w+) run tp @s (?<x>-?\d+\.?\d{2}) -?\d+\.?\d{2} (?<z>-?\d+\.?\d{2}) -?\d+\.?\d{2} -?\d+\.?\d{2}$/;

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