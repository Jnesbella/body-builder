import Service, { ServiceOptions } from "./Service";
import { ResourceDocument } from "./servicesTypes";

export type QueryOne<TDocument extends ResourceDocument> = Pick<
  TDocument,
  "id"
>;

export type CreateOne<TDocument extends ResourceDocument> = Partial<TDocument>;

export type ReadOne<TDocument extends ResourceDocument> = QueryOne<TDocument>;

export type UpdateOne<TDocument extends ResourceDocument> =
  QueryOne<TDocument> & Partial<TDocument>;

export type DeleteOne<TDocument extends ResourceDocument> = QueryOne<TDocument>;

class ResourceService<TDocument extends ResourceDocument> extends Service {
  constructor(options: ServiceOptions) {
    super(options);
  }

  create = <TData = CreateOne<TDocument>>(payload?: TData) => {
    return this.put<TDocument>("new", payload);
  };

  fetch = <TData extends QueryOne<TDocument>>({ id }: TData) => {
    return this.get<TDocument>(id);
  };

  update = <TData extends UpdateOne<TDocument>>({ id, ...payload }: TData) => {
    return this.patch<TDocument>(id, payload);
  };

  deleteOne = <TData extends DeleteOne<TDocument>>({ id }: TData) => {
    return this.delete<void>(id);
  };

  list = <TData = any>(payload?: TData) => {
    return this.get<TDocument[]>(undefined, payload);
  };
}

export default ResourceService;
