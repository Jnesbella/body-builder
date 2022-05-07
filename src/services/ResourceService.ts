import Service, { ServiceOptions } from "./Service";

export interface Resource extends Record<string, any> {
  id: string | number;
}

class ResourceService<T extends Resource> extends Service {
  constructor(options: ServiceOptions) {
    super(options);
  }

  create<P = any>(payload?: P) {
    return this.post<T>(["new"], payload);
  }

  fetch<P extends Resource>({ id }: { id: P["id"] }) {
    return this.get<T>([id]);
  }

  update<P extends Resource>({ id, ...payload }: Partial<P> & { id: P["id"] }) {
    return this.post<T>([id], payload);
  }

  deleteOne<P extends Resource>({ id }: { id: P["id"] }) {
    return this.delete<void>([id]);
  }

  list<P = any>(payload?: P) {
    return this.get<T[]>(undefined, payload);
  }
}

export default ResourceService;
