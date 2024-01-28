import {readFile, writeFile} from 'node:fs/promises'
import {getDate, monSecret} from "./divers.js";
import {NotFoundError} from "./errors.js";
import {createHash} from 'node:crypto'
import { uuid } from 'uuidv4';

/* Chemin de stockage des blocks */
const path = "data/blockchain.json"

/**
 * Mes définitions
 * @typedef { id: string, nom: string, don: number, date: string,hash: string} Block
 * @property {string} id
 * @property {string} nom
 * @property {number} don
 * @property {string} date
 * @property {string} string
 *
 */

/**
 * Renvoie un tableau json de tous les blocks
 * @return {Promise<any>}
 */
export async function findBlocks() {

    return readFile(path, 'utf-8')
        .then(result => {
            return result;
        })
        .catch(error => {
            console.log(error);
            NotFoundError();
        })
}

/**
 * Trouve un block à partir de son id
 * @param partialBlock
 * @return {Promise<Block[]>}
 */
export async function findBlock(partialBlock) {
    // A coder
}

/**
 * Trouve le dernier block de la chaine
 * @return {Promise<Block|null>}
 */
export async function findLastBlock() {
    // A coder
    const currentBlocks = await findBlocks();
    const currentBlocksJSON = JSON.parse(currentBlocks);
    const lastBlock = currentBlocksJSON[Object.keys(currentBlocksJSON).sort().pop()];
    return lastBlock
}

/**
 * Creation d'un block depuis le contenu json
 * @param contenu
 * @return {Promise<Block[]>}
 */
export async function createBlock(contenu) {

    // VERIFIER SI CEST LE PREMIER BLOC, SI OUI ON CREER LE HASH AVEC MON SECRET
    // SI CEST PAS LE PREMIER ON RECUP L'ANCIEN HACK ET ON UPDATE +1

    const block = {
        "id": uuid(),
        "hash": createHash("sha256", monSecret),
        "date": getDate(),
        "nom": contenu.nom,
        "don": contenu.don,
    }

    const currentBlocks = await findBlocks();
    const currentBlocksJSON = JSON.parse(currentBlocks);
    const blocksAdded =   [block, ...currentBlocksJSON]
    writeFile(path, JSON.stringify(blocksAdded));
    return blocksAdded;
}

