import Service, { ServiceOptions } from "./Service";
import { ResourceDocument } from "./servicesTypes";

class ResourceService<T extends ResourceDocument> extends Service {
  constructor(options: ServiceOptions) {
    super(options);
  }

  create = <P = any>(payload?: P) => {
    return this.post<T>("new", payload);
  };

  fetch = <P extends ResourceDocument>({ id }: Pick<P, "id">) => {
    return this.get<T>(id);
  };

  update = <P extends ResourceDocument>({
    id,
    ...payload
  }: Partial<P> & Pick<P, "id">) => {
    return this.post<T>(id, payload);
  };

  deleteOne = <P extends ResourceDocument>({ id }: Pick<P, "id">) => {
    return this.delete<void>(id);
  };

  list = <P = any>(payload?: P) => {
    return this.get<T[]>(undefined, payload);
  };
}

export default ResourceService;
