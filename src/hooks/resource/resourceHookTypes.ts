import { ResourceDocument, ResourceService } from "../../Services";

export interface UseCRUD<T extends ResourceDocument> {
  service: ResourceService<T>;
  id?: ResourceDocument["id"];
}
