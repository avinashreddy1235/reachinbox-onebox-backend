declare module 'imap' {
  import { EventEmitter } from 'events';

  interface ImapOptions {
    user: string;
    password: string;
    host: string;
    port: number;
    tls: boolean;
  }

  interface Box {
    name: string;
    flags: string[];
    readOnly: boolean;
    uidvalidity: number;
    uidnext: number;
    permFlags: string[];
    keywords: string[];
    newKeywords: boolean;
    persistentUIDs: boolean;
    nomodseq: boolean;
    messages: {
      total: number;
      new: number;
    };
  }

  interface MessageAttributes {
    uid: number;
    flags: string[];
    date: Date;
    struct: any[];
    size: number;
  }

  interface Message extends EventEmitter {
    on(event: 'body', listener: (stream: NodeJS.ReadableStream, info: { which: string }) => void): this;
    on(event: 'attributes', listener: (attrs: MessageAttributes) => void): this;
    on(event: 'end', listener: () => void): this;
  }

  class Connection extends EventEmitter {
    constructor(options: ImapOptions);
    connect(): void;
    end(): void;
    openBox(name: string, readOnly: boolean, callback: (err: Error | null, box: Box) => void): void;
    seq: {
      fetch(source: string, options: { bodies: string[]; struct: boolean }): EventEmitter;
    };
    on(event: 'ready' | 'mail' | 'end', listener: () => void): this;
    on(event: 'error', listener: (err: Error) => void): this;
    once(event: string, listener: (...args: any[]) => void): this;
  }

  function parseHeader(buffer: string): {
    from?: string[];
    to?: string[];
    subject?: string[];
    date?: string[];
  };

  export = Connection;
}