import Service, { ServiceOptions } from "./Service";

export interface ResourceDocument extends Record<string, any> {
  id: string | number;
}

class ResourceService<T extends ResourceDocument> extends Service {
  constructor(options: ServiceOptions) {
    super(options);
  }

  create<P = any>(payload?: P) {
    return this.post<T>(["new"], payload);
  }

  fetch<P extends ResourceDocument>({ id }: { id: P["id"] }) {
    return this.get<T>([id]);
  }

  update<P extends ResourceDocument>({
    id,
    ...payload
  }: Partial<P> & { id: P["id"] }) {
    return this.post<T>([id], payload);
  }

  deleteOne<P extends ResourceDocument>({ id }: { id: P["id"] }) {
    return this.delete<void>([id]);
  }

  list<P = any>(payload?: P) {
    return this.get<T[]>(undefined, payload);
  }
}

export default ResourceService;
