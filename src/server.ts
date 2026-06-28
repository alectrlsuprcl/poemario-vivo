// server.ts — PartyKit server para heladera-poetica
// Maneja: estado persistente de palabras, broadcast de movimientos, presencia

import type * as Party from "partykit/server";

// Tipado de una palabra en la heladera
interface FridgeWord {
  id: string;
  word: string;
  x: number;
  y: number;
  color: string;
}

// Mensajes que llegan desde el cliente
type ClientMessage =
  | { type: "join"; clientId: string }
  | { type: "seed"; words: FridgeWord[] }
  | { type: "move"; id: string; x: number; y: number; from: string }
  | { type: "add"; word: FridgeWord }
  | { type: "delete"; id: string };

const STORAGE_KEY = "heladera-words";

export default class HeladeraServer implements Party.Server {
  constructor(readonly room: Party.Room) {}

  // ── Conexión nueva ───────────────────────────────────────────────────────
  async onConnect(conn: Party.Connection) {
    // Leer estado persistido
    const stored = await this.room.storage.get<FridgeWord[]>(STORAGE_KEY);

    if (stored && stored.length > 0) {
      // Enviar estado actual al recién llegado
      conn.send(JSON.stringify({ type: "init", words: stored }));
    } else {
      // Primera vez — sala vacía, el cliente hará seed
      conn.send(JSON.stringify({ type: "init", words: [] }));
    }

    // Broadcast de presencia actualizada
    this.broadcastPresence();
  }

  // ── Mensaje desde un cliente ─────────────────────────────────────────────
  async onMessage(raw: string, sender: Party.Connection) {
    const msg = JSON.parse(raw) as ClientMessage;

    if (msg.type === "seed") {
      // Cliente semilla manda las palabras iniciales — guardar solo si vacío
      const existing = await this.room.storage.get<FridgeWord[]>(STORAGE_KEY);
      if (!existing || existing.length === 0) {
        await this.room.storage.put(STORAGE_KEY, msg.words);
        // Broadcast a todos para que rendericen
        this.room.broadcast(
          JSON.stringify({ type: "state", words: msg.words }),
          [sender.id]
        );
      }
      return;
    }

    if (msg.type === "move") {
      // Actualizar posición en storage
      const words = (await this.room.storage.get<FridgeWord[]>(STORAGE_KEY)) ?? [];
      const updated = words.map((w) =>
        w.id === msg.id ? { ...w, x: msg.x, y: msg.y } : w
      );
      await this.room.storage.put(STORAGE_KEY, updated);

      // Broadcast a todos excepto el emisor (él ya movió en su pantalla)
      this.room.broadcast(
        JSON.stringify({ type: "move", id: msg.id, x: msg.x, y: msg.y, from: msg.from }),
        [sender.id]
      );
      return;
    }

    if (msg.type === "add") {
      // Agregar palabra nueva
      const words = (await this.room.storage.get<FridgeWord[]>(STORAGE_KEY)) ?? [];
      words.push(msg.word);
      await this.room.storage.put(STORAGE_KEY, words);

      // Broadcast a todos excepto el emisor
      this.room.broadcast(
        JSON.stringify({ type: "add", word: msg.word }),
        [sender.id]
      );
      return;
    }

    if (msg.type === "delete") {
      // Eliminar palabra
      const words = (await this.room.storage.get<FridgeWord[]>(STORAGE_KEY)) ?? [];
      const filtered = words.filter((w) => w.id !== msg.id);
      await this.room.storage.put(STORAGE_KEY, filtered);

      this.room.broadcast(
        JSON.stringify({ type: "delete", id: msg.id }),
        [sender.id]
      );
      return;
    }
  }

  // ── Desconexión ──────────────────────────────────────────────────────────
  onClose() {
    this.broadcastPresence();
  }

  // ── Helpers ──────────────────────────────────────────────────────────────
  private broadcastPresence() {
    const count = [...this.room.getConnections()].length;
    this.room.broadcast(JSON.stringify({ type: "presence", count }));
  }
}
